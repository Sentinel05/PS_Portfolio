@echo off
title PS Portfolio - Database Seed

pushd "%~dp0.."

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

echo Seeding MongoDB with portfolio data...
echo   Collections: educations, works, projects, skills, certifications
echo.
echo WARNING: This will CLEAR and re-insert all data in those collections.
echo.
echo Requires in .env: MONGO_URI
echo.

npm run seed
if %ERRORLEVEL% neq 0 (
    echo.
    echo Seed failed. Check the error above and verify your MONGO_URI in .env.
    pause
    exit /b 1
)

echo.
echo Seed complete! Run ingest.bat next to update the chatbot knowledge base.
pause
popd
