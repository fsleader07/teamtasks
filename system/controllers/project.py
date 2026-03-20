from sqlalchemy.orm import Session
from models.project import Project, ProjectCreate


# ==========================================
# GET ALL PROJECTS
# ==========================================
def get_projects(db: Session):
    return db.query(Project).order_by(Project.project_id.asc()).all()


# ==========================================
# GET BY ID
# ==========================================
def get_project_by_id(db: Session, project_id: int):
    return db.query(Project).filter(Project.project_id == project_id).first()


# ==========================================
# CREATE
# ==========================================
def create_project(db: Session, project: ProjectCreate):
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


# ==========================================
# UPDATE
# ==========================================
def update_project(db: Session, project_id: int, project_in: ProjectCreate):
    db_project = db.query(Project).filter(Project.project_id == project_id).first()

    if db_project:
        update_data = project_in.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_project, key, value)

        db.commit()
        db.refresh(db_project)

    return db_project


# ==========================================
# DELETE
# ==========================================
def delete_project(db: Session, project_id: int):
    db_project = db.query(Project).filter(Project.project_id == project_id).first()

    if db_project:
        db.delete(db_project)
        db.commit()
        return True

    return False