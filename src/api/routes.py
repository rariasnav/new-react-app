from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Post, Status
from .utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

import cloudinary.uploader

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def create_user():
    try:
        body = request.get_json()
        if not body:
            return jsonify({'error': 'Invalid input no data provided'}), 400
        
        required_fields = ['username', 'password', 'name', 'surname']
        for field in required_fields:
            if field not in body:
                return jsonify({'error': f'missing field {field}'}), 400
        
        if User.query.filter_by(username=body['username']).first():
            return jsonify({'error': 'username already in use'}), 400
        
        password_hash = current_app.bcrypt.generate_password_hash(body['password']).decode('utf-8')

        new_user = User(
            username=body['username'],
            password=password_hash,
            is_active=True,
            name=body['name'],
            surname=body['surname']
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'msg': 'User created'}), 201

    except KeyError as e:
        current_app.logger.error(f"Invalid value for field: {str(e)}")
        return jsonify({"error": f"Invalid value for field: {str(e)}"}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating user: {str(e)}")
        return jsonify({"error": f"Error creating user: {str(e)}"}), 500
    
@api.route('/login', methods=['POST'])
def login():
    try:
        username = request.json.get('username', None)
        password = request.json.get('password', None)

        user = User.query.filter_by(username=username).first()

        if user is None or not current_app.bcrypt.check_password_hash(user.password, password):
            return jsonify({"msg": "Bad username or password"}), 401
        
        access_token = create_access_token(identity=username)
        user_data = {
            "id": user.id,
            "username": user.username,
        }
        return jsonify(user=user_data, access_token=access_token), 200

    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({"error": f"Login error: {str(e)}"}), 500
    
@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        user_username = get_jwt_identity()

        user = User.query.filter_by(username=user_username).first()
        if not user:
            return jsonify({'error': 'user not found'}), 404
        
        user_data = user.serialize()

        response_body = {
            "msg": "user found",
            "user": user_data
        }
        return jsonify(response_body), 200
    
    except Exception as e:
        current_app.logger.error(f"Error getting profile {str(e)}")
        return jsonify({'error': 'Error getting profile'}), 500
    
@api.route('/user_profile', methods=['PUT'])
@jwt_required()
def user_profile_update():
    try:
        body = request.get_json()

        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "Invalid request"}), 401

        for key in body:
            for col in user.serialize():
                if key == col and key != 'id':
                    setattr(user, key, body[key])

        db.session.commit()
        return jsonify({"msg": "user updated"}), 200 

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'error updating user information: {str(e)}'}), 500    
    
@api.route('/post', methods=['GET'])
@jwt_required()
def get_posts():
    try:
        posts = Post.query.filter(Post.status == Status.published).all()
        result = list(map(lambda post: post.serialize() , posts))

        return jsonify(result), 200
    
    except Exception as e:
        current_app.logger.error(f'error getting posts {str(e)}')
        return jsonify({'error': 'error getting posts'}), 500
    
@api.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    try:
        body = request.get_json()

        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "Invalid request"}), 401
        
        required_fields = ['image', 'created_at', 'location', 'message']
        for field in required_fields:
            if field not in body:
                return jsonify({'error': f'missing field {field}'}), 400
            
        new_post = Post(
            image=body['image'],
            message=body['message'],
            author_id=user.id,
            created_at=body['created_at'],
            location=body['location'],
            status=Status.published
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify({'msg': 'post created successfully'}), 201
            
    except KeyError as e:
        current_app.logger.error(f"Invalid value for field: {str(e)}")
        return jsonify({"error": f"Invalid value for field: {str(e)}"}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating post: {str(e)}")
        return jsonify({"error": f"Error creating post: {str(e)}"}), 500