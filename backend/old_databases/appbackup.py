"""
The backend code. Has functionality for users, posts, comments and notifs with most crud operations.
If you make changes that need to be added to db (new tables) then either make a console in this folder or
open built in pycharm console and type
sys.path.extend(['C:\\Users\\jamie\\Desktop\\thynkr\\backend', 'C:/Users/jamie/Desktop/thynkr/backend'])
from app import db
db.create_all()
db.session.commit()
exit()
then if needed move the db and file back to thynkr/backend (current dir)
"""

# imports
from PIL import Image
from flask import Flask, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, abort
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import magic
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['UPLOAD_FOLDER'] = 'images/'  # images stored in backend/images
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000  # about 16MB can make smaller if necessary
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
# image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
FLASHCARDS_FOLDER = 'flashcards/'


# db models
# post
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    content = db.Column(db.String(255))
    author = db.Column(db.String(50))
    date_time = db.Column(db.DateTime)
    comment_number = db.Column(db.Integer)

    def __repr__(self):
        return '<Post %s>' % self.title


# users
class User(db.Model):
    name = db.Column(db.String(50), primary_key=True)
    about = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    profile_picture = db.Column(db.String(50))

    def __repr__(self):
        return '<Users %s>' % self.name


# comments
class Comment(db.Model):
    comment_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255))
    author = db.Column(db.String(50))
    date_time = db.Column(db.DateTime)
    on_post_id = db.Column(db.Integer)

    def __repr__(self):
        return '<Comment %s>' % self.content


# notifications
class Notif(db.Model):
    notif_id = db.Column(db.Integer, primary_key=True)
    user_to_send_to = db.Column(db.String(50))
    date_time = db.Column(db.DateTime)
    user_to_link = db.Column(db.String(50))
    post_to_link = db.Column(db.String(50))
    notif_type = db.Column(db.String(50))  # notif_type can be like or comment right now

    # any value can be entered but frontend only parses like and comment

    def __repr__(self):
        return '<Notifs %s>' % self.content


# schemas
# posts
class PostSchema(ma.Schema):
    class Meta:
        fields = ("post_id", "title", "content", "author", "date_time", "comment_number")
        model = Post


# these post_schema and posts_schema and then users etc is to return the data from db in crud calls
# i.e. the PostListResource.get() return
post_schema = PostSchema()
posts_schema = PostSchema(many=True)


# users
class UserSchema(ma.Schema):
    class Meta:
        fields = ("name", "about", "email", "password", "profile_picture")
        model = User


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# comments
class CommentSchema(ma.Schema):
    class Meta:
        fields = ("comment_id", "on_post_id", "content", "author", "date_time")
        model = Comment


comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)


# notifications
class NotifSchema(ma.Schema):
    class Meta:
        fields = ("notif_id", "user_to_send_to", "notif_type", "date_time", "user_to_link", "post_to_link")
        model = Notif


notif_schema = NotifSchema()
notifs_schema = NotifSchema(many=True)


# listing and creating posts
class PostListResource(Resource):
    def get(self):
        posts = Post.query.all()
        # dumps post that it got into the schemas
        # if a specific user get system is necessary (recommendation systems) then make a UserPostListResource

        return posts_schema.dump(posts)

    def post(self):
        new_post = Post(
            title=request.json['title'],
            content=request.json['content'],
            author=request.json['author'],
            date_time=datetime.now(),
            comment_number=0
        )
        db.session.add(new_post)
        db.session.commit()
        return post_schema.dump(new_post)


api.add_resource(PostListResource, '/posts')


# do CRUD operations on single posts
class PostResource(Resource):
    def get(self, post_id):
        post = Post.query.get_or_404(post_id)
        return post_schema.dump(post)

    def patch(self, post_id):
        post = Post.query.get_or_404(post_id)

        if 'title' in request.json:
            post.title = request.json['title']
        if 'content' in request.json:
            post.content = request.json['content']

        db.session.commit()
        return post_schema.dump(post)

    def delete(self, post_id):
        post = Post.query.get_or_404(post_id)
        db.session.delete(post)
        # to add: get comments, filter for on_post_id being id of post deleting and delete them too
        db.session.commit()
        return '', 204


api.add_resource(PostResource, '/posts/<int:post_id>')


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


api.add_resource(UserListResource, '/users')


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


api.add_resource(UserResource, '/users/<string:user_name>')


class UserPFPResource(Resource):
    def get(self, user_name):
        user = User.query.get_or_404(user_name)
        pfp_link = user.profile_picture
        pfp_img_ext = pfp_link.split('.')[1]
        return send_from_directory(app.config['UPLOAD_FOLDER'], user_name + "_pfp." + pfp_img_ext)

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
            filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            img_file = Image.open(received_file.stream)
            img_file.save(filename)
            current_user.profile_picture = filename
            db.session.commit()
            return user_schema.dump(current_user)
        abort(404)


api.add_resource(UserPFPResource, '/users/pfp/<string:user_name>')


# listing and creating comments
class CommentListResource(Resource):
    def get(self):
        comments = Comment.query.all()
        return comments_schema.dump(comments)

    def post(self):
        new_comment = Comment(
            content=request.json['content'],
            author=request.json['author'],
            date_time=datetime.now(),
            on_post_id=request.json['post_id']
        )

        post_inc = Post.query.get_or_404(request.json['post_id'])
        post_inc.comment_number += 1

        db.session.add(new_comment)
        db.session.commit()
        return comment_schema.dump(new_comment)


api.add_resource(CommentListResource, '/comments')


# do CRUD operations on single comments
class CommentResource(Resource):
    def get(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        return comment_schema.dump(comment)

    def delete(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        try:
            post_dec = Post.query.get_or_404(comment.on_post_id)
            post_dec.comment_number -= 1
        except:
            pass
        db.session.delete(comment)
        db.session.commit()
        return '', 204


api.add_resource(CommentResource, '/comments/<int:comment_id>')


# listing and creating notifications
class NotifListResource(Resource):
    def get(self):
        notifs = Notif.query.all()
        return notifs_schema.dump(notifs)

    def post(self):
        new_notif = Notif(
            notif_type=request.json['notif_type'],
            user_to_send_to=request.json['user_to_send_to'],
            date_time=datetime.now(),
            post_to_link=request.json['post_link'],
            user_to_link=request.json['user_link']
        )

        db.session.add(new_notif)
        db.session.commit()
        return notif_schema.dump(new_notif)


api.add_resource(NotifListResource, '/notifs')


# do CRUD operations on single notifs just delete because get is in diff func to get based on username rather than id
class NotifResource(Resource):
    def delete(self, notif_id):
        notif = Notif.query.get_or_404(notif_id)
        db.session.delete(notif)
        db.session.commit()
        return '', 204


api.add_resource(NotifResource, '/notifs/<int:notif_id>')


# getting notifs based on username
class GetNotifResource(Resource):
    def get(self, user_name):
        notifs = Notif.query.all()
        toReturn = []
        for i in range(len(notifs)):
            if notifs[i].user_to_send_to == user_name:
                toReturn.append(notifs[i])

        return notifs_schema.dump(toReturn)


api.add_resource(GetNotifResource, '/notifs/<string:user_name>')


class FlashCards(Resource):
    def get(self, identifier):
        file_path = FLASHCARDS_FOLDER + str(identifier) + '.json'
        f = open(file_path, 'r')
        data = f.read()
        data = json.loads(data)
        return data


api.add_resource(FlashCards, '/flashcards/<int:identifier>')


class FlashCardsAll(Resource):
    def get(self):
        number_of_files = len(os.listdir(FLASHCARDS_FOLDER))
        data = []
        for i in range(number_of_files):
            file_path = FLASHCARDS_FOLDER + str(i+1) + '.json'
            f = open(file_path, 'r')
            file = f.read()
            data.append(json.loads(file))
        return data


api.add_resource(FlashCardsAll, '/flashcards')


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
    return response
