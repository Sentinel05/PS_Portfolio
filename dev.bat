@echo off
title PS Portfolio - Dev Server

:: Try npm from PATH first, then fall back to default Node.js install location
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

echo Starting PS Portfolio in development mode...
echo   Backend  -^> http://localhost:8080
echo   Frontend -^> http://localhost:3000
echo.
npm run dev
pause
