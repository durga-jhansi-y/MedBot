@echo off
echo ========================================
echo MedBot - Backend Setup
echo ========================================
echo.

echo Installing flask-cors...
pip install flask-cors

echo.
echo Installing other dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the backend, run:
echo     python app.py
echo.
pause
