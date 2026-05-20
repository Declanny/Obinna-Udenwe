from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.config import settings


class _SQLiteCloudConn:
    """Thin wrapper that drops unsupported kwargs SQLAlchemy passes to create_function."""

    def __init__(self, conn):
        self._conn = conn

    def create_function(self, *args, **kwargs):  # noqa: ARG002
        pass  # SQLiteCloud does not support create_function; silently ignore

    def __getattr__(self, name):
        return getattr(self._conn, name)


def _make_engine():
    url = settings.database_url
    if url.startswith("sqlite://"):
        return create_engine(url, connect_args={"check_same_thread": False})
    elif url.startswith("sqlitecloud://"):
        import sqlitecloud
        return create_engine(
            "sqlite+pysqlite://",
            creator=lambda: _SQLiteCloudConn(sqlitecloud.connect(url)),
            poolclass=NullPool,
        )
    return create_engine(url)


engine = _make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
