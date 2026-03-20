from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models.task import TaskResponse, TaskCreate
from models.personnel import PersonelResponse, PersonelCreate
from models.project import ProjectResponse, ProjectCreate
from connection.connection import get_db

import controllers.task as task_controller
import controllers.auth as auth_controller
import controllers.personnel as personel_controller
import controllers.project as project_controller

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
    person_id: int = None, status: str = "all", db: Session = Depends(get_db)
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


# --- Personnel Section ---
@router.get("/api/personnel/all", response_model=List[PersonelResponse], tags=["Personnel"])
def read_personnel(is_active: bool = None, db: Session = Depends(get_db)):
    return personel_controller.get_personnels(db, is_active=is_active)


@router.get("/api/personnel/{person_id}", response_model=PersonelResponse, tags=["Personnel"])
def read_personel_by_id(person_id: int, db: Session = Depends(get_db)):
    person = personel_controller.get_personel_by_id(db, person_id)

    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    return person


@router.post("/api/personnel", response_model=PersonelResponse, tags=["Personnel"])
def create_personel(person: PersonelCreate, db: Session = Depends(get_db)):
    return personel_controller.create_personel(db=db, person=person)


@router.put("/api/personnel/{person_id}", response_model=PersonelResponse, tags=["Personnel"])
def update_personel(person_id: int, person: PersonelCreate, db: Session = Depends(get_db)):
    result = personel_controller.update_personel(db, person_id, person)

    if not result:
        raise HTTPException(status_code=404, detail="Personnel not found")

    return result


@router.delete("/api/personnel/{person_id}", tags=["Personnel"])
def delete_personel(person_id: int, db: Session = Depends(get_db)):
    if not personel_controller.delete_personel(db, person_id):
        raise HTTPException(status_code=404, detail="Personnel not found")

    return {"status": "success"}


# --- Projects Section ---
@router.get("/api/projects/all", response_model=List[ProjectResponse], tags=["Projects"])
def read_projects(db: Session = Depends(get_db)):
    return project_controller.get_projects(db)


@router.get("/api/projects/{project_id}", response_model=ProjectResponse, tags=["Projects"])
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = project_controller.get_project_by_id(db, project_id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


@router.post("/api/projects", response_model=ProjectResponse, tags=["Projects"])
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return project_controller.create_project(db=db, project=project)


@router.put("/api/projects/{project_id}", response_model=ProjectResponse, tags=["Projects"])
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db)):
    result = project_controller.update_project(db, project_id, project)

    if not result:
        raise HTTPException(status_code=404, detail="Project not found")

    return result


@router.delete("/api/projects/{project_id}", tags=["Projects"])
def delete_project(project_id: int, db: Session = Depends(get_db)):
    if not project_controller.delete_project(db, project_id):
        raise HTTPException(status_code=404, detail="Project not found")

    return {"status": "success"}
