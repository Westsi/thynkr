from flask import Flask, jsonify
import requests
app = Flask(__name__)

@app.route('/makepost')
def send_req():
    request = requests.post('http://localhost:5000/posts', json={"title": "Post1", "content": "Lorem ipsum test"})
    print(request.status_code)
    print(request.json())
    return request.json()

@app.route('/getallposts')
def get_all():
    r = requests.get('http://localhost:5000/posts')
    print(r.status_code)
    print(r.json())
    return jsonify(r.json())

@app.route('/makeuser')
def send_req_u():
    request = requests.post('http://localhost:5000/users', json={"name": "test", "about": "CS Major"})
    print(request.status_code)
    print(request.json())
    return request.json()

@app.route('/getallusers')
def get_all_u():
    r = requests.get('http://localhost:5000/users')
    print(r.status_code)
    print(r.json())
    return jsonify(r.json())