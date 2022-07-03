from flask import request
from datetime import datetime
from flask_restful import Resource
from db import db, ma
from login_verifier_keys import Key, key_schema


# class
class EventNotif(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_to_send_to = db.Column(db.String(50))
    time_to_send = db.Column(db.DateTime)
    event_id = db.Column(db.String(50))

    def __repr__(self):
        return '<Event Notifs %s>' % self.content


# schema
class EventNotifSchema(ma.Schema):
    class Meta:
        fields = ("id", "user_to_send_to", "time_to_send", "event_id")
        model = EventNotif


event_notif_schema = EventNotifSchema()
event_notifs_schema = EventNotifSchema(many=True)


class thing(Resource):
    def get(self):
        users = EventNotif.query.all()
        return event_notifs_schema.dump(users)

    def post(self):
        key_info = Key.query.get_or_404(request.json['key'])
        key_info = key_schema.dump(key_info)

        new_event_notif = EventNotif(
            user_to_send_to=key_info['user'],
            time_to_send=datetime.fromtimestamp(int(request.json['time_to_send_notif']) / 1000.0),
            event_id=request.json['id']
        )
        db.session.add(new_event_notif)
        db.session.commit()
        return event_notif_schema.dump(new_event_notif)


# do CRUD operations on single event notifs just delete because get is in diff func to get based on username rather
# than id
class EventNotifResource(Resource):
    def delete(self, event_notif_id):
        event_notif = EventNotif.query.get_or_404(event_notif_id)
        db.session.delete(event_notif)
        db.session.commit()
        return '', 204


# getting event notifs based on key and date for it to be posted being
class GetEventNotifResource(Resource):
    def get(self, key):
        event_notifs = EventNotif.query.all()
        user_name = Key.query.get_or_404(key)
        user_name = key_schema.dump(user_name)['user']
        toReturn = []

        for i in range(len(event_notifs)):
            if event_notifs[i].user_to_send_to == user_name:
                if event_notifs[i].time_to_send < datetime.now():
                    toReturn.append(event_notifs[i])

        return event_notifs_schema.dump(toReturn)
