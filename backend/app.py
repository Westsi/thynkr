from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)


# db models
# post
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    content = db.Column(db.String(255))

    def __repr__(self):
        return '<Post %s>' % self.title


# users
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    about = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))

    def __repr__(self):
        return '<Users %s>' % self.name


# schemas
# posts
class PostSchema(ma.Schema):
    class Meta:
        fields = ("post_id", "title", "content")
        model = Post


post_schema = PostSchema()
posts_schema = PostSchema(many=True)


# users
class UserSchema(ma.Schema):
    class Meta:
        fields = ("name", "about", "user_id", "email", "password")
        model = User


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# listing and creating posts
class PostListResource(Resource):
    def get(self):
        posts = Post.query.all()
        return posts_schema.dump(posts)

    def post(self):
        new_post = Post(
            title=request.json['title'],
            content=request.json['content']
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
        db.session.commit()
        return '', 204


api.add_resource(PostResource, '/posts/<int:post_id>')


# listing and creating users
class UserListResource(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users)

    def post(self):
        new_user = User(
            email=request.json['email'],
            password=request.json['password'],
            name=request.json['name']
        )
        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user)


api.add_resource(UserListResource, '/users')

# do CRUD operations on single users
class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return user_schema.dump(user)

    def patch(self, user_id):
        user = User.query.get_or_404(user_id)

        if 'name' in request.json:
            user.name = request.json['name']
        if 'about' in request.json:
            user.about = request.json['about']
        if 'email' in request.json:
            user.email = request.json['email']
        if 'password' in request.json:
            user.password = request.json['password']

        db.session.commit()
        return user_schema.dump(user)

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204


api.add_resource(UserResource, '/users/<int:user_id>')


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response