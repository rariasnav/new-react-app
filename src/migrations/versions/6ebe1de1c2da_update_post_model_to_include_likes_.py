"""Update Post model to include likes relationship

Revision ID: 6ebe1de1c2da
Revises: 22845b451884
Create Date: 2024-08-05 13:10:05.008406

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ebe1de1c2da'
down_revision = '22845b451884'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('post',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('image', sa.String(length=120), nullable=False),
    sa.Column('message', sa.String(length=20), nullable=True),
    sa.Column('created_at', sa.String(length=20), nullable=False),
    sa.Column('location', sa.String(length=20), nullable=False),
    sa.Column('status', sa.Enum('drafted', 'deleted', 'published', name='status'), nullable=True),
    sa.Column('author_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['author_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('post_likes',
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('post_id', 'user_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('post_likes')
    op.drop_table('post')
    # ### end Alembic commands ###
