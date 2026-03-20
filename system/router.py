from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models.task import TaskResponse, TaskCreate
from connection.connection import get_db

import controllers.task as task_controller
import controllers.auth as auth_controller

router = APIRouter()


# --- Authentication Section ---
@router.post("/api/auth/login")
def login(user_info: dict, db: Session = Depends(get_db)):
    user = auth_controller.AuthController.authenticate_user(
        db, user_info["username"], user_info["password"]
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    print(f"User found: {user.username}, Person ID: {user.person_id}")

    token = auth_controller.AuthController.create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "person_id": user.person_id if user.person_id is not None else 0,
        "role": user.role,
    }


# --- Tasks Section ---
@router.get("/api/tasks", response_model=List[TaskResponse], tags=["Tasks"])
def read_tasks(
    person_id: int = None,
    status: str = "all", 
    db: Session = Depends(get_db)
):
    return task_controller.get_tasks(db, person_id=person_id, status=status)


@router.post("/api/tasks", response_model=TaskResponse, tags=["Tasks"])
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return task_controller.create_task(db=db, task=task)


@router.put("/api/tasks/{task_id}", response_model=TaskResponse, tags=["Tasks"])
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    result = task_controller.update_task(db, task_id, task)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return result


@router.delete("/api/tasks/{task_id}", tags=["Tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    if not task_controller.delete_task(db, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "success"}
