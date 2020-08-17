from threading import Thread
import datetime
import os

from flask import current_app as app
from flask import make_response, request, has_app_context, copy_current_request_context, jsonify, send_file, send_from_directory, render_template
from werkzeug.security import check_password_hash, generate_password_hash

import secrets

from . import auth, db
from .models import Database, User, Backup, Datasource
from .schemas import backups_schema, user_schema, database_schema, datasource_schema
from .backup import create_backup, delete_backup
from .restore import restore_new, restore_existing
from .cron import create_crons

from .slack import backup_slack_notificate, scp_slack_notificate

@auth.verify_password
def verify_password(username, password):
    token = request.headers.get('token')
    api_key = request.headers.get('x-api-key')

    api_key = api_key if api_key else request.args.get('api_key')

    if token and token == str(app.config['CRON_TOKEN']):
        return True

    if api_key:
        user = User.query.filter(User.api_key == api_key).first()
        if user:
            return True
    else:
        user = User.query.filter(User.username == username).first()
        if user:
            return check_password_hash(user.password, password)
    
    return False

@app.route("/user", methods=['POST', 'PATCH', 'DELETE'])
@auth.login_required
def create_user():
    if request.method == 'POST':
        req = request.form.to_dict()
        new_user = User(username=req['username'], password=generate_password_hash(req['password']), api_key=secrets.token_urlsafe(32))
        db.session.add(new_user)
        db.session.commit()

        return make_response(f"User with username {req['username']} was created!", 200)
    elif request.method == 'PATCH':
        req = request.args.to_dict()
        user = User.query.filter(User.id == req['id']).first()
        user.username = req['username']
        user.password = generate_password_hash(req['password'])

        db.session.commit()
        return make_response(f"User with username {req['username']} was updated!", 200)
    elif request.method == 'DELETE':
        req = request.args.to_dict()
        user = User.query.filter(User.id == req['id']).delete()
        db.session.commit()
        return make_response(f"User with username {req['username']} was deleted!", 200)
    
    return make_response("Error occured",  500)



@app.route("/", methods=['GET'])
@app.route("/databases", methods=['GET'])
@app.route("/users", methods=['GET'])
@app.route("/scp", methods=['GET'])
@auth.login_required
def home():
    return render_template('index.html', api_key=User.query.filter(User.username == auth.username()).first().api_key, api_url=app.config['API_URL'])


@app.route("/database", methods=['POST', 'PATCH', 'DELETE'])
@auth.login_required
def create_db():
    if request.method == 'POST':
        req = request.form.to_dict()
        new_db = Database(name=req['name'], host=req['host'],
                        port=req['port'], database=req['database'],
                        user=req['user'], password=req['password'],
                        cron=req['cron'], active=True if req['active'] == 'true' else False)
        db.session.add(new_db)
        db.session.commit()

        create_crons()

        return make_response(f"Database config for '{req['name']}' was created!", 200)
    elif request.method == 'PATCH':
        req = request.args.to_dict()
        database = Database.query.filter(Database.id == req['id']).first()
        database.name = req['name']
        database.host = req['host']
        database.port = req['port']
        database.database = req['database']
        database.user = req['user']
        database.password = req['password']
        database.cron = req['cron']
        database.active = True if req['active'] == 'true' else False
        db.session.commit()

        create_crons()

        return make_response(f"Database config for '{req['name']}' was updated!", 200)
    elif request.method == 'DELETE':
        req = request.args.to_dict()
        Database.query.filter(Database.id == req['id']).delete()
        db.session.commit()

        create_crons()

        return make_response(f"Database config for '{req['name']}' was deleted!", 200)

    return make_response("Error occured",  500)


@app.route("/datasource", methods=['POST', 'PATCH', 'DELETE'])
@auth.login_required
def create_datasource():
    if request.method == 'POST':
        req = request.form.to_dict()
        new_datasource = Datasource(name=req['name'], host=req['host'],
                                    port=req['port'], user=req['user'], password=req['password'],
                                    path=req['path'], active=True if req['active'] == 'true' else False)
        db.session.add(new_datasource)
        db.session.commit()

        return make_response(f"Datasource config for '{req['name']}' was created!", 200)
    elif request.method == 'PATCH':
        req = request.args.to_dict()
        datasource = Datasource.query.filter(Datasource.id == req['id']).first()
        datasource.name = req['name']
        datasource.host = req['host']
        datasource.port = req['port']
        datasource.user = req['user']
        datasource.password = req['password']
        datasource.path = req['path']
        datasource.active = True if req['active'] == 'true' else False
        db.session.commit()

        return make_response(f"Datasource config for '{req['name']}' was updated!", 200)
    elif request.method == 'DELETE':
        req = request.args.to_dict()
        Datasource.query.filter(Datasource.id == req['id']).delete()
        db.session.commit()

        return make_response(f"Datasource config for '{req['name']}' was deleted!", 200)

    return make_response("Error occured",  500)

@app.route("/backup", methods=['GET'])
@auth.login_required
def backup():
    database_name = request.args.get('db')
    is_test = True if request.args.get('test') == 'true' else False
    config = Database.query.filter(Database.name == database_name).first()

    if not config:
        return make_response(f"No database configuration for '{database_name}' \
                             was found!", 404)
    
    @copy_current_request_context
    def run_backup(config):
        create_backup(config, is_test)

    Thread(target=run_backup, args=(config, )).start()
    
    return make_response(f"Backup was started for: {database_name}", 200)


@app.route("/restore/new", methods=['POST'])
@auth.login_required
def restore_new_backup():
    req = request.form.to_dict()

    if not req['host'] or not req['port'] or not req['user'] or not req['password'] or not req['database'] or not req['backup_id']:
        return make_response(f"Required data was not passed!", 404)
    
    @copy_current_request_context
    def run_restore(host, port, user, password, database, backup_id):
        restore_new(host, port, user, password, database, backup_id)

    Thread(target=run_restore, args=(req['host'], req['port'], req['user'], req['password'], req['database'], req['backup_id'])).start()
    
    return make_response(f"Backup {req['backup_id']} was started for database with host {req['host']}", 200)


@app.route("/restore/existing", methods=['GET'])
@auth.login_required
def restore_existing_backup():
    database_id = request.args.get('db')
    backup_id = request.args.get('backup')
    database = Database.query.filter(Database.id == database_id).first()
    backup = Backup.query.filter(Backup.id == backup_id).first()

    if not database:
        return make_response(f"No database configuration with id '{database_id}' \
                             was found!", 404)
    
    @copy_current_request_context
    def run_restore(database, backup):
        restore_existing(database, backup)

    Thread(target=run_restore, args=(database, backup)).start()
    
    return make_response(f"Backup {backup_id} was started for database with id {database_id}", 200)


@app.route("/delete_backups", methods=['GET'])
@auth.login_required
def delete_backups():
    database_name = request.args.get('db')
    database = Database.query.filter(Database.name == database_name).first()
    since = datetime.datetime.now() - datetime.timedelta(days=database.last_for)

    backups_to_delete = Backup.query.filter(Backup.created < since).all()

    @copy_current_request_context
    def run_delete_backups():
        for backup in backups_to_delete:
            delete_backup(backup)

    Thread(target=run_delete_backups).start()

    return make_response(f"Backups deletion started!", 200)


@app.route("/get_backups", methods=['GET'])
@auth.login_required
def get_backups():
    backups = Backup.query.order_by(Backup.id.desc()).limit(50).all()
    result = backups_schema.dump(backups)
    response = jsonify(result)
    return make_response(response, 200)


@app.route("/get_databases", methods=['GET'])
@auth.login_required
def get_databases():
    
    databases = Database.query.all()
    result = database_schema.dump(databases)
    response = jsonify(result)
    return make_response(response, 200)


@app.route("/get_users", methods=['GET'])
@auth.login_required
def get_users():
    users = User.query.all()
    result = user_schema.dump(users)
    return make_response(jsonify(result), 200)


@app.route("/get_datasources", methods=['GET'])
@auth.login_required
def get_datasources():
    datasources = Datasource.query.all()
    result = datasource_schema.dump(datasources)
    return make_response(jsonify(result), 200)

@app.route('/backups/<path:backup_id>', methods=['GET'])
@auth.login_required
def download(backup_id):
    uploads = os.path.join('..', 'backups')
    filename = Backup.query.filter(Backup.id == backup_id).first().filename
    return send_from_directory(directory=uploads, filename=filename, as_attachment=True)

@app.route('/<path:the_path>', methods=['GET', 'POST'])
@auth.login_required
def all_other_routes(the_path):
    return app.send_static_file(the_path)
