"""empty message

Revision ID: 692514ba01d2
Revises: 1465ba10e93f
Create Date: 2020-10-13 23:40:47.219769

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "692514ba01d2"
down_revision = "1465ba10e93f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("Doacoes", sa.Column("confirmado", sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("Doacoes", "confirmado")
    # ### end Alembic commands ###
