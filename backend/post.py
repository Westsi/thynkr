from flask import request
from flask_restful import Resource, abort
from datetime import datetime
from db import db, ma
import comment
import login_verifier_keys


# model
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    content = db.Column(db.String(255))
    author = db.Column(db.String(50))
    date_time = db.Column(db.DateTime)
    comment_number = db.Column(db.Integer)

    def __repr__(self):
        return '<Post %s>' % self.title


# schema for data serialisation with marshmallow
class PostSchema(ma.Schema):
    class Meta:
        fields = ("post_id", "title", "content", "author", "date_time", "comment_number")
        model = Post


# these post_schema and posts_schema and then users etc is to return the data from db in crud calls
# i.e. the PostListResource.get() return
post_schema = PostSchema()
posts_schema = PostSchema(many=True)


# listing and creating posts
class PostListResource(Resource):
    def get(self):
        posts = Post.query.all()
        # dumps post that it got into the schemas
        # if a specific user get system is necessary (recommendation systems) then make a UserPostListResource

        return posts_schema.dump(posts)

    def post(self):
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        print(key_info)
        new_post = Post(
            title=request.json['title'],
            content=request.json['content'],
            author=key_info['user'],
            date_time=datetime.now(),
            comment_number=0
        )
        db.session.add(new_post)
        db.session.commit()
        return post_schema.dump(new_post)


# do CRUD operations on single posts
class PostResource(Resource):
    def get(self, post_id):
        post = Post.query.get_or_404(post_id)
        return post_schema.dump(post)

    def patch(self, post_id):
        post = Post.query.get_or_404(post_id)
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        if key_info['user'] == post_schema.dump(post)['author']:
            if 'title' in request.json:
                post.title = request.json['title']
            if 'content' in request.json:
                post.content = request.json['content']

            db.session.commit()
            return post_schema.dump(post)
        abort(401)

    def delete(self, post_id):
        post = Post.query.get_or_404(post_id)
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        if key_info['user'] == post_schema.dump(post)['author']:
            db.session.delete(post)
            # i got no idea if this chunk works- should test it
            comments = comment.Comment.query.all()
            for icomment in comments:
                if icomment["on_post_id"] == post_id:
                    db.session.delete(comment.Comment.get_or_404(icomment["comment_id"]))
            # up to here
            db.session.commit()
            return '', 204
        abort(401)
