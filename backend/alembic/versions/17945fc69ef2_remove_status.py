"""remove status

Revision ID: 17945fc69ef2
Revises: b53ecbe2b230
Create Date: 2026-03-10 03:03:19.068263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17945fc69ef2'
down_revision: Union[str, Sequence[str], None] = 'b53ecbe2b230'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('carts', 'status')


def downgrade() -> None:
    """Downgrade schema."""
    pass
