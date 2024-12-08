"""add_user_name_column_to_message

Revision ID: f94d66d47b6e
Revises: 509a99624551
Create Date: 2024-12-08 05:46:52.188489

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f94d66d47b6e'
down_revision: Union[str, None] = '509a99624551'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE messages 
        ADD COLUMN user_name TEXT AFTER created_at;
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE messages DROP user_name;")