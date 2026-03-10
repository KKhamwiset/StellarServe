"""add_user_role_and_restaurant_owner

Revision ID: 91a275a27cda
Revises: 41ec7fb01b3e
Create Date: 2026-03-10 18:30:19.120870

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91a275a27cda'
down_revision: Union[str, Sequence[str], None] = '41ec7fb01b3e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add owner_id to restaurants
    op.add_column('restaurants', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_restaurants_owner_id', 'restaurants', 'users', ['owner_id'], ['id'])

    # Add role column as nullable first
    op.add_column('users', sa.Column('role', sa.String(), nullable=True))
    
    # Backfill existing users with 'consumer'
    op.execute("UPDATE users SET role = 'consumer' WHERE role IS NULL")
    
    # Now set NOT NULL
    op.alter_column('users', 'role', nullable=False)

    # Assign existing restaurants to user 'conde'
    op.execute("""
        UPDATE restaurants 
        SET owner_id = (SELECT id FROM users WHERE username = 'conde' LIMIT 1)
        WHERE owner_id IS NULL
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'role')
    op.drop_constraint('fk_restaurants_owner_id', 'restaurants', type_='foreignkey')
    op.drop_column('restaurants', 'owner_id')
