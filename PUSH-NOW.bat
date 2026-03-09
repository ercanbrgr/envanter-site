@echo off
cd /d "%~dp0"
set PATH=%PATH%;C:\Program Files\Verdent\resources\app.asar.unpacked\node_modules\dugite\git\cmd

echo === GITHUB'A YUKLENIYOR ===
git add .
git commit -m "Recete yonetimi eklendi"
git push origin main --force-with-lease

echo.
echo === BITTI ===
echo 5 dakika bekle, sonra siteyi yenile!
pause
