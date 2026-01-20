@echo off
echo ========================================
echo   The Daily Bread - Production Version
echo ========================================
echo.
echo Starting application...
cd /d "%~dp0"
node_modules\electron\dist\electron.exe .
