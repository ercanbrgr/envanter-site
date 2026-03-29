@echo off
set REPO=C:\Users\yapic\OneDrive\Belgeler\verdent-projects\new-project\envanter-site
set GIT=C:\Users\yapic\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe

echo Git push yapiliyor...
"%GIT%" -C "%REPO%" add .
"%GIT%" -C "%REPO%" commit -m "Fix: Tenders ayri urun"
"%GIT%" -C "%REPO%" push

echo Tamamlandi!
pause
