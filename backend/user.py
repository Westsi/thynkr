from PIL import Image
from flask import request, send_from_directory
from flask_restful import Resource, abort
from werkzeug.utils import secure_filename
import os
import magic
from db import db, ma

# image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

UPLOAD_FOLDER = 'images/'


# db model
class User(db.Model):
    name = db.Column(db.String(50), primary_key=True)
    about = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    profile_picture = db.Column(db.String(50))

    def __repr__(self):
        return '<Users %s>' % self.name


# schema for marshmallow serialisation
class UserSchema(ma.Schema):
    class Meta:
        fields = ("name", "about", "email", "password", "profile_picture")
        model = User


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# listing and creating users
class UserListResource(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users)

    def post(self):
        if '@' in request.json['email'] and '.' in request.json['email']:
            new_user = User(
                email=request.json['email'],
                password=request.json['password'],
                name=request.json['name'],
                profile_picture='',
                about='Hi! I\'m new to Thynkr!'
            )
        else:
            abort(404)
        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user)


# do CRUD operations on single users
class UserResource(Resource):
    def get(self, user_name):
        user = User.query.get_or_404(user_name)
        return user_schema.dump(user)

    def patch(self, user_name):
        user = User.query.get_or_404(user_name)

        if 'name' in request.json:
            user.name = request.json['name']
        if 'about' in request.json:
            user.about = request.json['about']
        if 'email' in request.json:
            if '@' in request.json['email'] and '.' in request.json['email']:
                user.email = request.json['email']
            else:
                pass
        if 'password' in request.json:
            user.password = request.json['password']
        db.session.commit()
        return user_schema.dump(user)

    def delete(self, user_name):
        user = User.query.get_or_404(user_name)
        pfp_fname = user.profile_picture
        os.remove(pfp_fname)
        db.session.delete(user)
        db.session.commit()
        return '', 204


# separate endpoint for profile pictures
class UserPFPResource(Resource):
    def get(self, user_name):
        user = User.query.get_or_404(user_name)
        pfp_link = user.profile_picture
        pfp_img_ext = pfp_link.split('.')[1]
        return send_from_directory(UPLOAD_FOLDER, user_name + "_pfp." + pfp_img_ext)

    def post(self, user_name):
        current_user = User.query.get_or_404(user_name)
        received_file = request.files['profile_picture']
        if received_file.filename.split('.')[1] not in ALLOWED_EXTENSIONS:
            abort(404)

        f = magic.Magic(mime=True)
        mimetype = f.from_buffer(received_file.stream.read())
        if mimetype == 'image/jpeg' or mimetype == 'image/png' or mimetype == 'image/gif':
            filename = current_user.name + '_pfp' + '.' + received_file.filename.split('.')[1]
            filename = secure_filename(filename)
            filename = os.path.join(UPLOAD_FOLDER, filename)
            img_file = Image.open(received_file.stream)
            img_file.save(filename)
            current_user.profile_picture = filename
            db.session.commit()
            return user_schema.dump(current_user)
        abort(404)
