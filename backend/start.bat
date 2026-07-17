@echo off
title AI Mutual Fund Analyzer - Backend Server
color 0A

echo.
echo  ============================================================
echo   AI Mutual Fund Analyzer - Backend Startup
echo  ============================================================
echo.

:: Navigate to backend directory
cd /d "%~dp0"

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python found.

:: Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo.
    echo [INFO] Creating virtual environment...
    python -m venv .venv
    echo [OK] Virtual environment created.
)

:: Activate the virtual environment
echo [INFO] Activating virtual environment...
call .venv\Scripts\activate.bat

:: Install/update dependencies
echo.
echo [INFO] Installing dependencies (this may take a minute on first run)...
pip install -r requirements.txt --quiet
echo [OK] Dependencies installed.

:: Check if .env has been configured
findstr /C:"your_gemini_api_key_here" .env >nul 2>&1
if not errorlevel 1 (
    echo.
    echo [WARNING] Gemini API key is not set in .env file!
    echo           AI analysis features will not work.
    echo           Get your free key at: https://aistudio.google.com
    echo           Edit: MutualFundAI\backend\.env
    echo.
)

:: Start the FastAPI server
echo.
echo  ============================================================
echo   Starting server at: http://localhost:8000
echo   API Docs at:        http://localhost:8000/docs
echo   Press Ctrl+C to stop the server
echo  ============================================================
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
