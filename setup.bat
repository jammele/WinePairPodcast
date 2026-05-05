@echo off
echo.
echo === Podcast OS Setup ===
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

echo Installing dependencies...
npm install

echo.
echo Initializing database...
node scripts/init_db.js

echo.
echo Scanning local files...
node scripts/find_source_files.js --scan

echo.
echo Auto-ingesting episodes from scan...
node scripts/ingest_episode.js --auto

echo.
echo === Setup complete ===
echo.
echo What you can do now:
echo   Search files:     node scripts/find_source_files.js --search "your term"
echo   Search archive:   node scripts/search_archive.js "your term"
echo   Episode detail:   node scripts/search_archive.js --episode 212
echo   Re-scan files:    node scripts/find_source_files.js --scan
echo   List episodes:    node scripts/ingest_episode.js --list
echo.
pause
