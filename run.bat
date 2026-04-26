@echo off
title Task Manager Pro - Runner

echo Starting Frontend on port 8001...
start cmd /k "npm run dev --host 0.0.0.0"

echo Starting Backend on port 8000...
cd system
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ==========================================
echo  Frontend: http://localhost:8001
echo  Backend API: http://localhost:8000
echo ==========================================
pause