from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from connection.connection import Base

# ==========================================
# 1. DATABASE MODEL (SQLAlchemy)
# ==========================================
class Personel(Base):
    __tablename__ = "tb_personel"

    person_id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(150), nullable=False)
    lastname = Column(String(150), nullable=False)
    nickname = Column(String(100), nullable=True)
    email = Column(String(150), nullable=True)
    phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ==========================================
# 2. DATA SCHEMAS (Pydantic)
# ==========================================
class PersonelBase(BaseModel):
    firstname: str
    lastname: str
    nickname: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = True


class PersonelCreate(PersonelBase):
    """ใช้สำหรับรับข้อมูลตอน Create / Update"""
    pass


class PersonelResponse(PersonelBase):
    """ใช้สำหรับส่งข้อมูลกลับไปที่ Frontend"""
    person_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)