from datetime import timedelta, datetime
from flask import request
from flask_restful import Resource, abort
import passlib.hash
import uuid
from db import db, ma
from user import User, user_schema


# db model
class Key(db.Model):
    value = db.Column(db.String(50), primary_key=True)
    creation_date = db.Column(db.DateTime)
    expiry_date = db.Column(db.DateTime)
    user = db.Column(db.String(50))
    user_email = db.Column(db.String(50))

    def __repr__(self):
        return '<Keys %s>' % self.name


# schema for marshmallow serialisation
class KeySchema(ma.Schema):
    class Meta:
        fields = ("value", "creation_date", "expiry_date", "user", "user_email")
        model = Key


key_schema = KeySchema()


# listing and creating users
class KeyListResource(Resource):
    def post(self):
        user_attempting_to_log_in_info = User.query.filter_by(email=request.json['email']).first()
        user_attempting_to_log_in_info = user_schema.dump(user_attempting_to_log_in_info)
        if user_attempting_to_log_in_info['password'] != request.json['password']:
            abort(404)
        else:
            new_key = Key(
                value=str(uuid.uuid4()),
                creation_date=datetime.now(),
                expiry_date=datetime.now() + timedelta(minutes=30),  # this timedelta is the expiration time of the key
                user=user_attempting_to_log_in_info['name'],
                user_email=request.json['email']
            )
            db.session.add(new_key)
            db.session.commit()
            return key_schema.dump(new_key)


# do CRUD operations on single keys
class KeyResource(Resource):
    def get(self, key):
        return key_schema.dump(Key.query.get_or_404(key))

    def post(self, key):
        # this is to get a new key from an existing one- frontend will send requests
        key_existence = Key.query.get_or_404(key)
        schema = key_schema.dump(key_existence)
        if request.json['user'] == schema['user']:
            new_key = Key(
                value=str(uuid.uuid4()),
                creation_date=datetime.now(),
                expiry_date=datetime.now() + timedelta(minutes=30),  # this timedelta is the expiration time of the key
                user=request.json['user'],
                user_email=schema['user_email']
            )
            db.session.add(new_key)
            db.session.delete(key_existence)
            db.session.commit()
            return key_schema.dump(new_key)

    def delete(self, key):
        key_to_delete = Key.query.get_or_404(key)
        db.session.delete(key_to_delete)
        db.session.commit()
        return '', 204
