import datetime
import secrets
from . import db


class User(db.Model):
    '''Model for user credentials'''

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    api_key = db.Column(db.String(255), default=secrets.token_urlsafe(32), unique=True, nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"


class Database(db.Model):
    '''Model for database credentials'''

    __tablename__ = 'databases'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    host = db.Column(db.String(255), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    database = db.Column(db.String(255), nullable=False)
    user = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    # How long before backup will be erased (in days)
    last_for = db.Column(db.Integer, default=30, nullable=False)
    created = db.Column(db.DateTime(), default=datetime.datetime.utcnow, nullable=False)
    updated = db.Column(db.DateTime(), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    cron = db.Column(db.String(80), nullable=True)
    active = db.Column(db.Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<Database {self.name}>"

class Backup(db.Model):
    '''Model for backups'''
    
    __tablename__ = 'backups'
    id = db.Column(db.Integer, primary_key=True)
    database_id = db.Column(db.Integer, db.ForeignKey('databases.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    size = db.Column(db.Integer)
    created = db.Column(db.DateTime(), default=datetime.datetime.utcnow, nullable=False)
    finished = db.Column(db.DateTime(), default=None, nullable=True)
    status = db.Column(db.String(255), default="Started", nullable=False)
    error = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<Backup {self.id}>"

class Datasource(db.Model):
    '''Model for secure copy (scp) credentials'''

    __tablename__ = 'datasources'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    host = db.Column(db.String(255), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    user = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255), nullable=False)
    created = db.Column(db.DateTime(), default=datetime.datetime.utcnow, nullable=False)
    updated = db.Column(db.DateTime(), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<Datasource {self.name}>"