from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from connection.connection import engine, Base
from models.task import Task
from router import router as task_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router)

@app.get("/")
def root():
    return {"message": "Server is running", "database": "Connected"}