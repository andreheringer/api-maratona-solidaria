"""empty message

Revision ID: 4511695bbe0b
Revises: dcf72e579f09
Create Date: 2020-10-08 20:01:09.281396

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4511695bbe0b"
down_revision = "dcf72e579f09"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("Alunos", sa.Column("observacao", sa.Text(), nullable=True))
    op.add_column("Alunos", sa.Column("telefone", sa.Text(), nullable=True))
    op.add_column("Doacoes", sa.Column("equipe_id", sa.Integer(), nullable=False))
    op.create_foreign_key(None, "Doacoes", "Equipes", ["equipe_id"], ["id"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "Doacoes", type_="foreignkey")
    op.drop_column("Doacoes", "equipe_id")
    op.drop_column("Alunos", "telefone")
    op.drop_column("Alunos", "observacao")
    # ### end Alembic commands ###
