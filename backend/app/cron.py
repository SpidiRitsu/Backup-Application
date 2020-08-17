from subprocess import Popen

from flask import current_app as app

from .models import Database

CRON_FILE = f'/etc/cron.d/backups'


def start_crons():
    create_crons()
    Popen(['service', 'cron', 'start'])


def create_crons():
    databases = Database.query.all()

    cron_content = []

    for database in databases:
        if database.active:
            cron_content.append(get_backup_create_cron(database))
            cron_content.append(get_backup_delete_cron(database))

    with open(CRON_FILE, 'w+') as f:
        f.writelines(cron_content)

    Popen(['crontab', CRON_FILE])


def get_backup_create_cron(database):
    return f"{database.cron} curl -H 'Token: {str(app.config['CRON_TOKEN'])}' http://127.0.0.1:5000/backup?db={database.name}" + '\n'


def get_backup_delete_cron(database):
    default_cron = "0 0 */1 * *"
    return f"{default_cron} curl -H 'Token: {str(app.config['CRON_TOKEN'])}' http://127.0.0.1:5000/delete_backups?db={database.name}" + '\n'
