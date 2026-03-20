from sqlalchemy.orm import Session
from sqlalchemy import any_
from models.task import Task, TaskCreate

def get_tasks(db: Session, person_id: int = None, status: str = "all"):
    query = db.query(Task)
    
    if person_id:
        query = query.filter(person_id == any_(Task.assignee))
    
    if status != "all":
        query = query.filter(Task.status == status)
        
    return query.order_by(Task.id.asc()).all()

def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_in: TaskCreate):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task:
        update_data = task_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False