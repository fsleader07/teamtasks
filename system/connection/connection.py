import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator
from dotenv import load_dotenv

# โหลดค่าจากไฟล์ .env
load_dotenv()

# ดึงค่า DATABASE_URL จาก env ถ้าไม่มีให้ใช้ค่า default (ป้องกันโปรแกรมพัง)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("ไม่พบค่า DATABASE_URL ในไฟล์ .env หรือ Environment Variable")

# สร้าง Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_size=5, 
    max_overflow=10
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()