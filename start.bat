@echo off
title PS Portfolio - Production Server

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\Program Files\nodejs\npm.cmd" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else (
        echo ERROR: Node.js not found. Please install it from https://nodejs.org/
        pause
        exit /b 1
    )
)

echo Building React client...
npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed.
    pause
    exit /b 1
)

echo.
echo Starting production server on http://localhost:8080
npm start
pause
