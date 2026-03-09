@echo off
cd /d "%~dp0"
set PATH=%PATH%;C:\Program Files\Verdent\resources\app.asar.unpacked\node_modules\dugite\git\cmd

echo === DOSYA KALDIRILIYOR ===
git rm --cached fix-superadmin.ps1 2>nul

echo === DEGISIKLIKLER EKLENIYOR ===
git add .gitignore index.html

echo === COMMIT YAPILIYOR ===
git commit -m "Recete yonetimi eklendi - secret temizlendi"

echo === GITHUB'A YUKLENIYOR ===
git push origin main --force-with-lease

echo.
echo === BITTI ===
echo 5 dakika bekle, sonra siteyi yenile!
pause
