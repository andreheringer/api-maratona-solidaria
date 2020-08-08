# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
from flask import Flask
import os

from app.blueprints.public import public_pb
from app.models import user
from app.extentions import db, migrate

def create_app():
    """An application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.
    :param config_object: The configuration object to use.
    """
    app = Flask(__name__)
    app.config.from_object(os.environ['APP_SETTINGS'])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    register_extensions(app)
    register_bluprints(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    migrate.init_app(app, db)
    return None



def register_bluprints(app):
    """Register Blueprints with views."""
    app.register_blueprint(public_pb)
    return None
