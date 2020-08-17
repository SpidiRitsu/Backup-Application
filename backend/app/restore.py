import os
import urllib.request
import json
import sys
from subprocess import Popen, PIPE
import time
import datetime
from pathlib import Path
from flask import current_app as app
from flask import has_app_context, copy_current_request_context

from . import db
from .models import Backup, Database

from .slack import restore_slack_notificate
from .scp import scp

# Global stuff
backup_path = os.path.split(os.path.abspath(
    os.path.dirname(__file__)))[0] + '/backups'


def restore_new(host, port, user, password, database, backup_id):
    backup = Backup.query.filter(Backup.id == backup_id).first()
    restore(host, port, user, password, database, backup.filename)


def restore_existing(database, backup):
    restore(database.host, database.port, database.user,
            database.password, database.database, backup.filename)


def restore(host, port, user, password, database, filename):
    gz_backup_file_path = os.path.join(backup_path, filename)
    gzip_p = Popen(['gzip', '-d', '-k', f'{os.path.join(backup_path, filename)}'],
                   stdout=PIPE, stderr=PIPE, universal_newlines=True)
    gzip_p.wait()
    backup_file_path = os.path.join(backup_path, filename[0:-3])
    backup_file = open(backup_file_path)
    restore_p = Popen(["mysql",  f"-u{user}", f"-p{password}", f"-h{host}",
                       f"-P {port}", database], stdin=backup_file,  stdout=PIPE, stderr=PIPE, universal_newlines=True)
    restore_p.wait()
    rm_sql = Popen(['rm', '-rf', backup_file_path], stdout=PIPE,
                   stderr=PIPE, universal_newlines=True)
    rm_sql.wait()

    commands = [gzip_p, restore_p, rm_sql]

    for command in commands:
        output, errors = command.communicate()
        status = bool(command.wait())
        if status:
            restore_slack_notificate(host, database, errors)
            return

    restore_slack_notificate(host, database)