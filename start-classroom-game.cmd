@echo off
title Food Detective Challenge
cd /d "%~dp0"
echo Starting Food Detective Challenge...
echo.
echo Student link:
echo http://Khadejah:8123/
echo.
echo Teacher dashboard:
echo http://Khadejah:8123/teacher.html
echo.
start "" "http://Khadejah:8123/teacher.html"
"C:\Users\k0983\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
pause
