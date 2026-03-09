@echo off
set GIT=C:\Users\yapic\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe
"%GIT%" -C "C:\Users\yapic\OneDrive\Belgeler\GitHub" diff index.html | find /c "^"
echo Lines changed above
"%GIT%" -C "C:\Users\yapic\OneDrive\Belgeler\GitHub" log --oneline -3
