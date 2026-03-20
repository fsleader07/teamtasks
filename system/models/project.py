from sqlalchemy import Column, Integer, String, Date, DateTime, Text, func
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime
from connection.connection import Base

# ==========================================
# 1. DATABASE MODEL (SQLAlchemy)
# ==========================================
class Project(Base):
    __tablename__ = "project"

    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ==========================================
# 2. DATA SCHEMAS (Pydantic)
# ==========================================
class ProjectBase(BaseModel):
    project_name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectCreate(ProjectBase):
    """ใช้สำหรับรับข้อมูลตอน Create / Update"""
    pass


class ProjectResponse(ProjectBase):
    """ใช้สำหรับส่งข้อมูลกลับไปที่ Frontend"""
    project_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)