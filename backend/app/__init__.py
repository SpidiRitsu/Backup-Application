from flask import Flask
from flask_httpauth import HTTPBasicAuth
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os

# Globally accessible libraries
db = SQLAlchemy()
auth = HTTPBasicAuth()
ma = Marshmallow()

def create_app():
    """Initialize the core application."""
    
    template_dir = os.path.abspath(os.path.dirname(__file__))
    template_dir = os.path.join(template_dir, 'static')
    app = Flask(__name__, instance_relative_config=False, template_folder=template_dir)
    app.config.from_object('config.Config')

    # Initialize Plugins
    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        CORS(app)
        # Include Routes
        from . import routes
        from . import cron

        db.create_all()
        cron.start_crons()
        
        return app
