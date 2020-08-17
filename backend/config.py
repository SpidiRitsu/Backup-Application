from os import environ
from uuid import uuid4

class Config:

    # General
    API_URL =  environ['API_URL'] if 'API_URL' in environ and environ['API_URL'] != '' else 'http://127.0.0.1:5000'
    ENVIRONMENT = 'DEVELOPMENT' if 'DEV' in environ and environ['DEV'] == '1' else 'PRODUCTION'
    DEBUG = False if ENVIRONMENT != 'DEVELOPMENT' else True

    # SQL Alchemy
    SQLALCHEMY_DATABASE_URI = "sqlite:///../db/backups.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Slack
    SLACK_WEBHOOK = environ['SLACK_WEBHOOK'] if 'SLACK_WEBHOOK' in environ else ''
    SLACK_CHANNEL = environ['SLACK_CHANNEL'] if 'SLACK_WEBHOOK' in environ else ''
    SLACK_BOT_USERNAME = "Backups B0T"
    SLACK_ICON_EMOJI = ":fox_face:"
    SLACK_COLOR_SUCCESS = "#13e841"
    SLACK_COLOR_RESTORE = "#26ffed"
    SLACK_COLOR_ERROR = "#f01a1a"
    
    # Email
    SENDER_EMAIL = environ['SENDER_EMAIL'] if 'SENDER_EMAIL' in environ else ''
    SENDER_PASSWORD = environ['SENDER_PASSWORD'] if 'SENDER_PASSWORD' in environ else ''
    RECEIVER_EMAIL = environ['RECEIVER_EMAIL'] if 'RECEIVER_EMAIL' in environ else ''

    # Token for crons
    CRON_TOKEN = "f0b10da8-c234-4a0c-9f41-7573e0fe9218"
    PRESERVE_CONTEXT_ON_EXCEPTION = False
