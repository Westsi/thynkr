from flask import request
from flask_restful import Resource
from datetime import datetime
from db import db, ma
import comment
import login_verifier_keys


# model
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.String(255))
    user = db.Column(db.String(50))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    def __repr__(self):
        return '<Events %s>' % self.title


# schema for data serialisation with marshmallow
class EventSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "description", "user", "start_time", "end_time")
        model = Event


# these post_schema and posts_schema and then users etc is to return the data from db in crud calls
# i.e. the PostListResource.get() return
event_schema = EventSchema()
events_schema = EventSchema(many=True)


# listing and creating posts
class EventListResource(Resource):

    def post(self):
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        print(key_info)
        print(request.json['start'])
        print(request.json['end'])
        new_event = Event(
            name=request.json['name'],
            description=request.json['description'],
            user=key_info['user'],
            start_time=request.json['start'],
            end_time=request.json['end']
        )
         # db.session.add(new_event)
         # db.session.commit()
        return event_schema.dump(new_event)


# do CRUD operations on single posts
"""
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
        # i got no idea if this chunk works- should test it
        comments = comment.Comment.query.all()
        for icomment in comments:
            if icomment["on_post_id"] == post_id:
                db.session.delete(comment.Comment.get_or_404(icomment["comment_id"]))
        # up to here
        db.session.commit()
        return '', 204
        
        """
