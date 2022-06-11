from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import app

db = SQLAlchemy(app.app)
ma = Marshmallow(app.app)
