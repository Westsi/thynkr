from flask import request
from flask_restful import Resource
from datetime import datetime
from db import db, ma
from post import Post
from login_verifier_keys import Key, key_schema


# comments
class Comment(db.Model):
    comment_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255))
    author = db.Column(db.String(50))
    date_time = db.Column(db.DateTime)
    on_post_id = db.Column(db.Integer)

    def __repr__(self):
        return '<Comment %s>' % self.content


# comments
class CommentSchema(ma.Schema):
    class Meta:
        fields = ("comment_id", "on_post_id", "content", "author", "date_time")
        model = Comment


comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)


# listing and creating comments
class CommentListResource(Resource):
    def get(self):
        comments = Comment.query.all()
        return comments_schema.dump(comments)

    def post(self):
        key = request.json['key']
        key = Key.query.get_or_404(key)
        author = key_schema.dump(key)['user']
        new_comment = Comment(
            content=request.json['content'],
            author=author,
            date_time=datetime.now(),
            on_post_id=request.json['post_id']
        )

        post_inc = Post.query.get_or_404(request.json['post_id'])
        post_inc.comment_number += 1

        db.session.add(new_comment)
        db.session.commit()
        return comment_schema.dump(new_comment)


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
