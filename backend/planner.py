from flask import request
from flask_restful import Resource, abort
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
# i.e. the EventListResource.get() return
event_schema = EventSchema()
events_schema = EventSchema(many=True)


# listing and creating posts
class EventListResource(Resource):

    def post(self):
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        new_event = Event(
            name=request.json['name'],
            description=request.json['description'],
            user=key_info['user'],
            start_time=datetime.fromtimestamp(int(request.json['start']) / 1000.0),
            end_time=datetime.fromtimestamp(int(request.json['end']) / 1000.0)
        )
        db.session.add(new_event)
        db.session.commit()
        return event_schema.dump(new_event)


# do CRUD operations on single posts

class EventResource(Resource):
    def get(self, event_id):
        event = Event.query.get_or_404(event_id)
        return event_schema.dump(event)

    def patch(self, event_id):
        event = Event.query.get_or_404(event_id)
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        if key_info['user'] == event_schema.dump(event)['user']:
            if 'name' in request.json:
                event.name = request.json['name']
            if 'description' in request.json:
                event.description = request.json['description']
            if 'start_time' in request.json:
                event.start_time = request.json['start_time']
            if 'end_time' in request.json:
                event.end_time = request.json['end_time']

            db.session.commit()
        return event_schema.dump(event)

    def delete(self, event_id):
        event = Event.query.get_or_404(event_id)
        key_info = login_verifier_keys.Key.query.get_or_404(request.json['key'])
        key_info = login_verifier_keys.key_schema.dump(key_info)
        if key_info['user'] == event_schema.dump(event)['user']:
            db.session.delete(event)
            db.session.commit()
            return '', 204
        abort(401)


# getting events based on key
class GetEventResource(Resource):
    def get(self, key):
        events = Event.query.all()
        user_name = login_verifier_keys.Key.query.get_or_404(key)
        user_name = login_verifier_keys.key_schema.dump(user_name)['user']
        toReturn = []
        for i in range(len(events)):
            if events[i].user == user_name:
                toReturn.append(events[i])

        return events_schema.dump(toReturn)
