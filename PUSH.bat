@echo off
set SRC=C:\Users\yapic\OneDrive\Belgeler\verdent-projects\new-project\envanter-site
set DST=C:\Users\yapic\OneDrive\Belgeler\GitHub
set GIT=C:\Users\yapic\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe

echo Dosyalar kopyalaniyor...
copy /Y "%SRC%\index.html" "%DST%\index.html"

echo Git push yapiliyor...
"%GIT%" -C "%DST%" add index.html
"%GIT%" -C "%DST%" commit -m "guncelleme"
"%GIT%" -C "%DST%" push

echo Tamamlandi!
pause
