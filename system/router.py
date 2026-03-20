from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models.task import TaskResponse, TaskCreate 
from connection.connection import get_db

import controllers.task as task_controller

router = APIRouter(prefix="/api/tasks")

@router.get("/", response_model=List[TaskResponse])
def read_tasks(status: str = "all", db: Session = Depends(get_db)):
    return task_controller.get_tasks(db, status=status)

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return task_controller.create_task(db=db, task=task)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    result = task_controller.update_task(db, task_id, task)
    if not result: 
        raise HTTPException(status_code=404, detail="Task not found")
    return result

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    if not task_controller.delete_task(db, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "success"}