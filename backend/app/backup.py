import os
import urllib.request, json 
import sys
from subprocess import Popen, PIPE
import time
import datetime
from pathlib import Path
from flask import current_app as app
from flask import has_app_context, copy_current_request_context

from . import db
from .models import Backup, Database

from .slack import backup_slack_notificate
from .email_notification import backup_email_notificate
from .scp import scp

# Global stuff
backup_path = os.path.split(os.path.abspath(os.path.dirname(__file__)))[0] + '/backups'

def delete_backup(config):
    if config.finished != None:
        file_path = f"{backup_path}/{config.filename}"
        rm = Popen(['rm', '-rf', file_path])
        
        output, errors = rm.communicate()
        status = bool(rm.wait())

        backup = Backup.query.filter(Backup.id == config.id).first()
        if status:
            backup.status = "Deletion Failed"
            backup.error = errors
            db.session.commit()
        else:
            backup.status = "Deleted"
            db.session.commit()
        
        return

def create_backup(config, is_test=False):
    if is_test is False:
        file_datetime = time.strftime('%Y%m%d-%H%M%S')

        dump_name = f"{config.name}_{file_datetime}.sql"
        dump_compressed_name = f"{dump_name}.gz"
        dump_path = f"{backup_path}/{dump_name}"
        dump_compressed_path = f"{backup_path}/{dump_compressed_name}"

        new_backup = Backup(filename=dump_compressed_name, database_id=config.id)
        db.session.add(new_backup)
        db.session.commit()
        
        if not os.path.isdir(backup_path):
            create_dir = Popen(['mkdir', '-p', backup_path])
            create_dir.wait()
        dump_output = open(dump_path, "w+")
        dump_p = Popen(["mysqldump", f"-u{config.user}", f"-p{config.password}", f"-h{config.host}",
                        f"-P {config.port}", "--routines", "--single-transaction", "--quick",
                        config.database], stdout=dump_output, stderr=PIPE, universal_newlines=True)
        dump_p.wait()
        dump_output.close()
        gzip_p = Popen(['gzip', dump_path], stdout=PIPE, stderr=PIPE, universal_newlines=True)
        gzip_p.wait()

        commands = [dump_p, gzip_p]

        backup = Backup.query.filter(Backup.id == new_backup.id).first()

        for command in commands:
            output, errors = command.communicate()
            status = bool(command.wait())
            if status:
                backup.status = "Failed"
                backup.error = errors
                db.session.commit()
                rm_p = Popen(['rm', "-rf", f"{dump_path}.gz"], stdout=PIPE, stderr=PIPE, universal_newlines=True)
                rm_p.wait()
                backup_slack_notificate(backup.id, errors)
                backup_email_notificate(backup.id, errors)

                with open('/app/error_log_backups.log', 'a') as f:
                    f.write(errors)

                return

        posix_dump_path = Path(dump_compressed_path)
        dump_size = posix_dump_path.stat().st_size

        backup.size = dump_size
        backup.status = "Succeeded"
        backup.finished = datetime.datetime.utcnow()
        db.session.commit()
        backup_slack_notificate(backup.id)
        backup_email_notificate(backup.id)
        scp(backup.id, f"{dump_path}.gz")

        database = Database.query.filter(Database.id == backup.database_id).first()
    else:
        new_test_backup = Backup(filename=config.name, 
                                database_id=0, 
                                status='[Test]', 
                                error='This backup was created for sake of a E2E test!')
        db.session.add(new_test_backup)
        db.session.commit()

    return