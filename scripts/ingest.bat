@echo off
title PS Portfolio - Chatbot Ingestion

pushd "%~dp0.."

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

echo Running chatbot ingestion script...
echo   Fetches portfolio content from MongoDB
echo   Collections: educations, works, projects, skills, certifications
echo   Embeds using gemini-embedding-2 (768 dims)
echo   Upserts to Pinecone index (namespace: portfolio)
echo.
echo Requires in .env: MONGO_URI, GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX
echo.

npm run ingest
if %ERRORLEVEL% neq 0 (
    echo.
    echo Ingestion failed. Check the error above and verify your .env variables.
    pause
    exit /b 1
)

echo.
echo Ingestion complete! Re-run this script whenever MongoDB content changes.
pause
popd
