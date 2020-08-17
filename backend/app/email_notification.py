from flask import current_app as app
from .models import Backup, Database

import yagmail
import datetime


def email_notificate(func):
    def send_notification(*args, **kwargs):
        # Handles situation where email config variables are not set
        if app.config['SENDER_EMAIL'] == '' or app.config['RECEIVER_EMAIL'] == '' or app.config['SENDER_PASSWORD'] == '':
            return
            
        sender_email = app.config['SENDER_EMAIL']
        receiver_email = app.config['RECEIVER_EMAIL']
        password = app.config['SENDER_PASSWORD']

        yag = yagmail.SMTP(sender_email, password)

        content = func(*args, **kwargs)
        
        yag.send(to=receiver_email, subject=content['subject'], contents=content['body'])
    return send_notification


@email_notificate
def backup_email_notificate(backup_id, error=None):
    backup = Backup.query.filter(Backup.id == backup_id).first()
    database = Database.query.filter(Database.id == backup.database_id).first()

    duration = calculate_duration(backup.created, backup.finished)

    success_json = {
        "subject": f"[BACKUP] {database.name} - Success ✅",
        "body": """<div style='color: #FF7F11; font-size: 20px;'>✅ <strong style="font-size: 24px;">Date and time:</strong> """ + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """ ✅</div>"""
    }

    error_json = {
        "subject": f"[BACKUP] {database.name} - Failed ❌",
        "body": """<div style='color: #FF7F11; font-size: 20px;'>❌ <strong style="font-size: 24px;">Date and time:</strong> """ + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """ ❌</div><br><br>""" + '' if error is None else error  
    }

    return error_json if error else success_json


def calculate_duration(created, finished):
    if finished:
        delta = (finished - created).total_seconds()
        result = str(round(delta, 3)) + 's'
        return result
    return None
