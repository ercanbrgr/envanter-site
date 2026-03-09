@echo off
cd /d "%~dp0"
set PATH=%PATH%;C:\Program Files\Verdent\resources\app.asar.unpacked\node_modules\dugite\git\cmd

echo === PUSH YAPILIYOR ===
git push origin main --force

echo.
echo === BITTI ===
pause
