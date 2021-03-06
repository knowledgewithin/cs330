import os
from flask_mongoengine import MongoEngine
from dotenv import load_dotenv

def init_database_connection(app):
    load_dotenv()
    app.config['MONGODB_SETTINGS'] = {
        'db': os.environ.get('DATABASE_NAME'),
        'host': 'mongodb+srv://' + os.environ.get('HOST') + '/' + os.environ.get('DATABASE_NAME') + '?retryWrites=true&w=majority',
        'username': os.environ.get('USERNAME'),
        'password': os.environ.get('PASSWORD')
    }
    db = MongoEngine()
    db.init_app(app)