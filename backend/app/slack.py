from flask import current_app as app
from .models import Backup, Database
from subprocess import Popen, PIPE
import json
import datetime


def slack_notificate(func):
    def send_notification(*args, **kwargs):
        # Handles situation where slack config variables are not set
        if app.config['SLACK_CHANNEL'] == '' or app.config['SLACK_WEBHOOK'] == '':
            return
            
        payload = {
            "channel": app.config['SLACK_CHANNEL'],
            "username": app.config['SLACK_BOT_USERNAME'],
            "icon_emoji": app.config['SLACK_ICON_EMOJI'],
            "attachments": func(*args, **kwargs)
        }

        if app.config['ENVIRONMENT'] == 'DEVELOPMENT':
            payload['blocks'] = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":warning: This message comes from the *development* server! :warning:"
                    }
                }
            ]

        Popen(['curl', '-X', 'POST', '-H', 'Content-type: application/json', '-d', json.dumps(payload),
               app.config['SLACK_WEBHOOK']], stdout=PIPE, stderr=PIPE, universal_newlines=True)
        return payload
    return send_notification


@slack_notificate
def backup_slack_notificate(backup_id, error=None):
    backup = Backup.query.filter(Backup.id == backup_id).first()
    database = Database.query.filter(Database.id == backup.database_id).first()

    duration = calculate_duration(backup.created, backup.finished)

    success_attachment = [
        {
            "color": app.config['SLACK_COLOR_SUCCESS'],
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Backup*"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Database:*\n{database.name}"
                        },
                        {
                            "type": "plain_text",
                            "text": "\n"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Status:*\nSuccess! :heavy_check_mark:"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Duration:*\n{duration}"
                        }
                    ]
                },
            ]
        }
    ]

    error_attachment = [
        {
            "color": app.config['SLACK_COLOR_ERROR'],
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Backup*"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Status:*\nFailed! :heavy_multiplication_x:"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Database:*\n{database.name}"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": f"*Error message:*\n```{error}```"
                    }
                }
            ]
        }
    ]

    return error_attachment if error else success_attachment


@slack_notificate
def scp_slack_notificate(backup_id, datasource, error=None):
    backup = Backup.query.filter(Backup.id == backup_id).first()
    database = Database.query.filter(Database.id == backup.database_id).first()

    duration = calculate_duration(backup.created, backup.finished)

    success_attachment = [
        {
            "color": app.config['SLACK_COLOR_SUCCESS'],
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Secure Copy*"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Database:*\n{database.name}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Server:*\n{datasource.name}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Status:*\nSuccess! :heavy_check_mark:"
                        }
                    ]
                }
            ]
        }
    ]

    error_attachment = [
        {
            "color": app.config['SLACK_COLOR_ERROR'],
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Secure Copy*"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Database:*\n{database.name}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Server:*\n{datasource.name}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Status:*\nFailed! :heavy_multiplication_x:"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": f"*Error message:*\n```{error}```"
                    }
                }
            ]
        }
    ]

    return error_attachment if error else success_attachment


@slack_notificate
def restore_slack_notificate(host, database, error=None):
    success_attachment = [
        {
            "color": app.config['SLACK_COLOR_RESTORE'],
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Backup restoration*"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Host:*\n{host}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Database:*\n{database}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Status:*\nSuccess! :heavy_check_mark:"
                        }
                    ]
                }
            ]
        }
    ]

    error_attachment = [
        {
            "color": app.config['SLACK_COLOR_ERROR'],
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Backup restoration*"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Host:*\n{host}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Database:*\n{database}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Status:*\nFailed! :heavy_multiplication_x:"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": f"*Error message:*\n```{error}```"
                    }
                }
            ]
        }
    ]

    return error_attachment if error else success_attachment


def calculate_duration(created, finished):
    if finished:
        delta = (finished - created).total_seconds()
        result = str(round(delta, 3)) + 's'
        return result
    return None
