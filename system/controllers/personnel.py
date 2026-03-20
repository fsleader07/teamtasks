from sqlalchemy.orm import Session
from models.personnel import Personel, PersonelCreate


# ==========================================
# GET ALL PERSONNEL
# ==========================================
def get_personnels(db: Session, is_active: bool = None):
    query = db.query(Personel)

    if is_active is not None:
        query = query.filter(Personel.is_active == is_active)

    return query.order_by(Personel.person_id.asc()).all()


# ==========================================
# GET BY ID
# ==========================================
def get_personel_by_id(db: Session, person_id: int):
    return db.query(Personel).filter(Personel.person_id == person_id).first()


# ==========================================
# CREATE
# ==========================================
def create_personel(db: Session, person: PersonelCreate):
    db_person = Personel(**person.model_dump())
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person


# ==========================================
# UPDATE
# ==========================================
def update_personel(db: Session, person_id: int, person_in: PersonelCreate):
    db_person = db.query(Personel).filter(Personel.person_id == person_id).first()

    if db_person:
        update_data = person_in.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_person, key, value)

        db.commit()
        db.refresh(db_person)

    return db_person


# ==========================================
# DELETE
# ==========================================
def delete_personel(db: Session, person_id: int):
    db_person = db.query(Personel).filter(Personel.person_id == person_id).first()

    if db_person:
        db.delete(db_person)
        db.commit()
        return True

    return False