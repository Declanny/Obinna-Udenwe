from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.config import settings


def _make_engine():
    url = settings.database_url
    if url.startswith("sqlite://"):
        return create_engine(url, connect_args={"check_same_thread": False})
    elif url.startswith("sqlitecloud://"):
        import sqlitecloud
        return create_engine(
            "sqlite+pysqlite://",
            creator=lambda: sqlitecloud.connect(url),
            poolclass=NullPool,
        )
    return create_engine(url)


engine = _make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
