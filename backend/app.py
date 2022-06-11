"""
The backend code. Has functionality for users, posts, comments and notifs with most crud operations.
If you make changes that need to be added to db (new tables) then either make a console in this folder or
open built in pycharm console and type
sys.path.extend(['C:\\Users\\jamie\\Desktop\\thynkr\\backend', 'C:/Users/jamie/Desktop/thynkr/backend'])
import app
from db import db
db.create_all()
db.session.commit()
exit()
then if needed move the db and file back to thynkr/backend (current dir)
"""
# imports
from flask import Flask
from flask_restful import Api


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['UPLOAD_FOLDER'] = 'images/'  # images stored in backend/images
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000  # about 16MB can make smaller if necessary
api = Api(app)
FLASHCARDS_FOLDER = 'flashcards/'

from comment import CommentListResource, CommentResource
from notif import NotifListResource, NotifResource, GetNotifResource
from post import PostListResource, PostResource
from user import UserListResource, UserResource, UserPFPResource
from flashcards import FlashCards, FlashCardsAll
from login_verifier_keys import KeyListResource, KeyResource
from planner import EventListResource


api.add_resource(CommentListResource, '/comments')
api.add_resource(CommentResource, '/comments/<int:comment_id>')

api.add_resource(NotifListResource, '/notifs')
api.add_resource(NotifResource, '/notifs/<int:notif_id>')
api.add_resource(GetNotifResource, '/notifs/<string:key>')

api.add_resource(PostListResource, '/posts')
api.add_resource(PostResource, '/posts/<int:post_id>')

api.add_resource(UserListResource, '/users')
api.add_resource(UserResource, '/users/<string:user_name>')
api.add_resource(UserPFPResource, '/users/pfp/<string:user_name>')

api.add_resource(FlashCards, '/flashcards/<int:identifier>')
api.add_resource(FlashCardsAll, '/flashcards')

api.add_resource(KeyListResource, '/keys')
api.add_resource(KeyResource, '/keys/<string:key>')

api.add_resource(EventListResource, '/planner')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
    return response
