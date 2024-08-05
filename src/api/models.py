from flask_sqlalchemy import SQLAlchemy
import enum

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    surname = db.Column(db.String(20), nullable=False)
    avatar = db.Column(db.String(120), unique=True, nullable=True)

    posts = db.relationship('Post', backref='author', lazy=True)
    liked_posts = db.relationship('Post', secondary='post_likes', back_populates='likers')

    def __init__(self, username, password, name, surname, is_active):
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if len(password) < 5:
            raise ValueError("Password must be at least 5 characters long")
        if len(name) < 5:
            raise ValueError("Name must be at least 5 characters long")
        if len(surname) < 5:
            raise ValueError("Surname must be at least 5 characters long")
        
        self.username = username
        self.password = password
        self.name = name
        self.surname = surname
        self.is_active = is_active

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "surname": self.surname,
            "avatar": self.avatar,
            "is_active": self.is_active
        }
    
class Status(enum.Enum):
    drafted = 'drafted'
    deleted = 'deleted'
    published = 'published'

post_likes = db.Table('post_likes',
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(120), nullable=False)
    message = db.Column(db.String(20), nullable=False)
    likers = db.relationship('User', secondary='post_likes', back_populates='liked_posts')
    created_at = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(20), nullable=False)
    status = db.Column(db.Enum(Status), nullable=True)

    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Post {self.id}>'
    
    def serialize(self):
        user = User.query.get(self.author_id)
        if user is not None:
            user = user.serialize()

        return {
            "id": self.id,
            "image": self.image,
            "message": self.message,
            "likes": [user.id for user in self.likers],
            "author": user,
            "created_at": self.created_at,
            "location": self.location,
            "status": self.status.name
        }