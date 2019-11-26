"""empty message

Revision ID: 592d13a3cb75
Revises: 
Create Date: 2019-11-19 01:48:00.693344

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '592d13a3cb75'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('contest',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('prize', sa.Float(), nullable=False),
    sa.Column('deadline', sa.DateTime(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('title')
    )
    op.create_table('submission',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('contest_id', sa.Integer(), nullable=False),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('date_submitted', sa.DateTime(), nullable=False),
    sa.Column('image', sa.LargeBinary(), nullable=False),
    sa.ForeignKeyConstraint(['contest_id'], ['contest.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('submission')
    op.drop_table('contest')
    op.drop_table('user')
    # ### end Alembic commands ###
