from subprocess import Popen, PIPE, run, CalledProcessError
import os

from .models import Datasource, Backup

from .slack import scp_slack_notificate

def scp(backup_id, backup_path):
    datasources = Datasource.query.all()
    backup = Backup.query.filter(Backup.id == backup_id).first()
    for datasource in datasources:
        if datasource.active:
            cmd = ["sshpass", "-p", f"{datasource.password}",
            "scp", "-o", "StrictHostKeyChecking=no", "-P", f"{str(datasource.port)}",
            f"{backup_path}",
            f"{datasource.user}@{datasource.host}:{os.path.join(datasource.path, backup.filename)}"]
            try:
                copy = run(cmd, check=True, text=False)
                scp_slack_notificate(backup.id, datasource)
            except CalledProcessError as err:
                error = err.stderr if err.stderr else "[SERVER] Unable to catch the error!"
                scp_slack_notificate(backup.id, datasource, error)