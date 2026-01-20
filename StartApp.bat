@echo off
echo Starting The Daily Bread Video Generator...
echo.
echo Please wait while the server starts...
cd /d "%~dp0"

REM Start the Vite dev server in the background
start /B cmd /C "npm run dev > nul 2>&1"

REM Wait for the server to start
timeout /t 5 /nobreak > nul

REM Start Electron
npm run electron-start

REM When Electron closes, kill the Vite server
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*" > nul 2>&1
