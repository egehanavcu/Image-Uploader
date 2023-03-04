# -*- coding: utf-8 -*-
import os
import random
import string
from flask import Flask, request, jsonify, send_from_directory
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from sqlalchemy.sql import func

app = Flask(__name__, static_folder='build')
CORS(app)

app.config['UPLOADED_PHOTOS_DEST'] = os.getcwd()

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)
patch_request_class(app)  # set maximum file size, default is 16MB

db = SQLAlchemy(app)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    extension = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    likes = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f'<Student {self.id}>'

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(100), nullable=False)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/upload-image', methods=['POST'])
def upload_file():
    if request.method == 'POST' and 'photo' in request.files:
        title = request.form.get("title", "")
        description = request.form.get("description", "")

        image_file = request.files['photo']
        image_file_extension = os.path.splitext(image_file.filename)[1][1:]
        saved_file_name = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        photos.save(image_file, "build/images", saved_file_name + ".")

        image_object = Image(name=saved_file_name, extension=image_file_extension, title=title, description=description, likes=0)
        db.session.add(image_object)
        db.session.commit()
        return jsonify({"name" : saved_file_name})

@app.route('/api/images/<int:page>', methods=['GET'])
def view_all_images(page):
    page_size = 12
    parsed_images = Image.query.order_by(desc(Image.id)).limit(page_size).offset(page*page_size).all()
    return list(map(lambda image: {"name": image.name, "extension": image.extension}, parsed_images))

@app.route('/api/image/<image_name>', methods=['GET'])
def view_image(image_name):
    parsed_image = Image.query.filter_by(name=image_name).first()
    return jsonify({"name" : parsed_image.name,"extension": parsed_image.extension, "title": parsed_image.title, "description": parsed_image.description, "likes": parsed_image.likes, "created_at": parsed_image.created_at})

@app.route('/api/like', methods=['POST'])
def like_image():
    name = request.form.get('name', "")

    if (request.method == "POST") and name:
        parsed_image = Image.query.filter_by(name=name).first()
        if parsed_image:
            ip_address = request.remote_addr
            is_liked_before = Like.query.filter_by(name=name, ip_address=ip_address).first()
            if not is_liked_before:
                parsed_image.likes += 1
                like_object = Like(name=name, ip_address=ip_address)
                db.session.add(like_object)
                db.session.commit()
                return jsonify({"status" : True})
    return jsonify({"status" : False})

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)