from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import any_
from models.task import Task, TaskCreate
from models.personnel import Personel


def get_tasks(
    db: Session, person_id: int = None, role: str = "user", status: str = "all"
):
    query = db.query(Task)

    if role != "admin" and person_id:
        query = query.filter(person_id == any_(Task.assignee))

    if status != "all":
        query = query.filter(Task.status == status)

    tasks = query.order_by(Task.id.asc()).all()

    # -------------------------
    # ดึง personnel ทั้งหมดครั้งเดียว
    # -------------------------
    personnel = db.query(Personel).all()
    personnel_map = {p.person_id: (p.nickname or p.firstname) for p in personnel}

    # -------------------------
    # map assignee -> nickname
    # -------------------------
    for task in tasks:
        if task.assignee:
            task.assignee_names = [personnel_map.get(pid, "ไม่พบ") for pid in task.assignee]
        else:
            task.assignee_names = []

    return tasks


def get_status_counts(db: Session, person_id: int = None, role: str = "user"):
    target_statuses = ["Opened", "Pending", "In Progress", "Success", "Break"]

    query = db.query(
        Task.status, 
        func.count(Task.id).label('count')
    ).filter(Task.status.in_(target_statuses))

    if role != "admin" and person_id:
        query = query.filter(person_id == any_(Task.assignee))

    results = query.group_by(Task.status).all()

    status_counts = {status: count for status, count in results}

    final_counts = {status: status_counts.get(status, 0) for status in target_statuses}

    return final_counts


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
