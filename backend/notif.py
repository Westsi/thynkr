from flask import request
from flask_restful import Resource
from datetime import datetime
from db import db, ma
from login_verifier_keys import Key, key_schema



# class
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


# schema
class NotifSchema(ma.Schema):
    class Meta:
        fields = ("notif_id", "user_to_send_to", "notif_type", "date_time", "user_to_link", "post_to_link")
        model = Notif


notif_schema = NotifSchema()
notifs_schema = NotifSchema(many=True)


# listing and creating notifications
class NotifListResource(Resource):
    def get(self):
        notifs = Notif.query.all()
        return notifs_schema.dump(notifs)

    def post(self):
        key = request.json['key']
        key = Key.query.get_or_404(key)
        key = key_schema.dump(key)['user']
        new_notif = Notif(
            notif_type=request.json['notif_type'],
            user_to_send_to=request.json['user_to_send_to'],
            date_time=datetime.now(),
            post_to_link=request.json['post_link'],
            user_to_link=key
        )

        db.session.add(new_notif)
        db.session.commit()
        return notif_schema.dump(new_notif)


# do CRUD operations on single notifs just delete because get is in diff func to get based on username rather than id
class NotifResource(Resource):
    def delete(self, notif_id):
        notif = Notif.query.get_or_404(notif_id)
        db.session.delete(notif)
        db.session.commit()
        return '', 204


# getting notifs based on key
class GetNotifResource(Resource):
    def get(self, key):
        notifs = Notif.query.all()
        user_name = Key.query.get_or_404(key)
        user_name = key_schema.dump(user_name)['user']
        toReturn = []
        for i in range(len(notifs)):
            if notifs[i].user_to_send_to == user_name:
                toReturn.append(notifs[i])

        return notifs_schema.dump(toReturn)
