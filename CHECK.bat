@echo off
set GIT=C:\Users\yapic\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe
"%GIT%" -C "C:\Users\yapic\OneDrive\Belgeler\GitHub" status
"%GIT%" -C "C:\Users\yapic\OneDrive\Belgeler\GitHub" diff --stat HEAD
echo.
echo Files in GitHub folder:
dir "C:\Users\yapic\OneDrive\Belgeler\GitHub" /b
