from sqlalchemy.orm import Session
from models.auth import User
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt  # อย่าลืม pip install pyjwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ตั้งค่า Secret สำหรับ JWT
SECRET_KEY = "your_secret_key_change_this" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class AuthController:
    @staticmethod
    def register_user(db: Session, user_data: dict):
        hashed_pw = pwd_context.hash(user_data["password"])
        
        db_user = User(
            username=user_data["username"],
            password_hash=hashed_pw,
            person_id=user_data["person_id"],
            role=user_data.get("role", "user"),
            is_active=True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str):
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        
        safe_password = password[:72] 
        
        if not pwd_context.verify(safe_password, user.password_hash):
            return None
        return user

    # --- เพิ่มฟังก์ชันสร้าง Token ที่ router เรียกใช้ด้วย ---
    @staticmethod
    def create_access_token(data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt