@echo off
rem Double-click to host the Asnani Footwear site locally (no internet needed).
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Opening index.html directly in your browser instead.
  start "" "%~dp0index.html"
  pause
  exit /b
)
rem Start the server in its own window, give it a moment, then open the site
start "Asnani Footwear server" node serve.js 8080
timeout /t 2 /nobreak >nul
start "" http://localhost:8080
