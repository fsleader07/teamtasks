@echo off
title Task Manager Pro - Runner

:: 1. รัน Frontend (Python HTTP Server) ในหน้าต่างใหม่
echo Starting Frontend on port 8001...
start cmd /k "python -m http.server 8001 --bind 0.0.0.0"

:: 2. เข้าไปในโฟลเดอร์ system และรัน Backend (Uvicorn) ในหน้าต่างใหม่
echo Starting Backend on port 8000...
cd system
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ==========================================
echo  Frontend: http://localhost:8001
echo  Backend API: http://localhost:8000
echo ==========================================
pause