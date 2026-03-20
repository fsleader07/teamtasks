from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from connection.connection import engine, Base
from router import router

# สร้าง Table ใน DB (ถ้ายังไม่มี)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001","http://192.168.1.180:8001","http://0.0.0.0:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Server is running"}