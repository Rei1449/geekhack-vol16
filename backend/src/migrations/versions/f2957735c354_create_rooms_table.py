"""create rooms table

Revision ID: f2957735c354
Revises: 
Create Date: 2024-10-23 12:16:56.836857

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'f2957735c354'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE rooms (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        """
    )

def downgrade() -> None:
    op.execute("DROP TABLE rooms;")
