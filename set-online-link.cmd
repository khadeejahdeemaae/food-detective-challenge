@echo off
title Set Online Game Link
cd /d "%~dp0"
echo Paste the public online link for the student game.
echo Example: https://food-detective-yourname.onrender.com/
echo.
set /p PUBLIC_LINK=Online link: 
echo %PUBLIC_LINK%> public-url.txt
echo.
echo Saved online link:
type public-url.txt
echo.
echo Now refresh the teacher page. The QR Code will use this online link.
pause
