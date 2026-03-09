@echo off
cd /d "%~dp0"
echo StokPro - GitHub'a gonderiliyor...
git add -A
git commit -m "StokPro guncelleme - %date% %time%"
git push origin main
echo.
echo Basarili! Site birkaç dakika icinde guncellenir.
pause
