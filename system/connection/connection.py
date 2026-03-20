from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator

# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:abc%401234@192.168.1.180:5432/teamtasks"
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:conic%40development@localhost:5432/teamtasks"


engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_size=5, max_overflow=10)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()