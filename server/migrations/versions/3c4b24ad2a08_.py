"""empty message

Revision ID: 3c4b24ad2a08
Revises: c871995f9133
Create Date: 2019-11-25 16:02:58.545520

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c4b24ad2a08'
down_revision = 'c871995f9133'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('submission',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('contest_id', sa.Integer(), nullable=False),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('date_submitted', sa.DateTime(), nullable=False),
    sa.Column('image', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['contest_id'], ['contest.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('submission')
    # ### end Alembic commands ###
