"""create messages table

Revision ID: 509a99624551
Revises: f2957735c354
Create Date: 2024-10-23 12:43:26.664861

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '509a99624551'
down_revision: Union[str, None] = 'f2957735c354'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE messages (
            id VARCHAR(36) PRIMARY KEY,
            room_id VARCHAR(36) NOT NULL,
            message TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms (id)
        );
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE messages;")
