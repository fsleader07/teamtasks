from sqlalchemy import Column, Integer, String, Text, Date, DateTime, func , ARRAY
from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional , List
from connection.connection import Base

# ==========================================
# 1. DATABASE MODELS (SQLAlchemy)
# ==========================================
class Task(Base):
    __tablename__ = "tb_tasks"

    id = Column(Integer, primary_key=True, index=True)
    project = Column(String(100), nullable=True)       
    task_name = Column(Text, nullable=False)            
    assignee = Column(ARRAY(Integer))
    status = Column(String(50), default="Pending")      
    priority = Column(String(20), default="Normal")      
    author = Column(String(100), nullable=True)          
    deadline = Column(Date, nullable=True)              
    completed_at = Column(Date, nullable=True)          
    note = Column(Text, nullable=True)                
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ==========================================
# 2. DATA SCHEMAS (Pydantic)
# ==========================================
class TaskBase(BaseModel):
    project: Optional[str] = None
    task_name: str
    assignee: Optional[List[int]] = []
    status: Optional[str] = "Pending"
    priority: Optional[str] = "Normal"
    author: Optional[str] = None
    deadline: Optional[date] = None
    completed_at: Optional[date] = None
    note: Optional[str] = None

class TaskCreate(TaskBase):
    """ใช้สำหรับรับข้อมูลตอน Create/Update"""
    pass

class TaskResponse(TaskBase):
    """ใช้สำหรับส่งข้อมูลกลับไปที่ Frontend (มี ID และ Created_at)"""
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True) # เชื่อม Pydantic กับ SQLAlchemy