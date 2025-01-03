"""Ajout de la colonne entreprise_id à User

Revision ID: 6596e8c9807b
Revises: 
Create Date: 2024-09-08 01:20:53.847598

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6596e8c9807b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('conversion')
    op.drop_table('purchase')
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('entreprise_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'entreprise', ['entreprise_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('entreprise_id')

    op.create_table('purchase',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('amount_spent', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False),
    sa.Column('points_earned', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='purchase_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='purchase_pkey')
    )
    op.create_table('conversion',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('id_entreprise', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('points_entreprise', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('points_uu', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('date_conversion', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['id_entreprise'], ['entreprise.id'], name='conversion_id_entreprise_fkey'),
    sa.PrimaryKeyConstraint('id', name='conversion_pkey')
    )
    # ### end Alembic commands ###
