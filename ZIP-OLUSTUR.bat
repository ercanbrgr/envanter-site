@echo off
echo Zip olusturuluyor...
powershell -Command "Compress-Archive -Path 'C:\Users\yapic\OneDrive\Belgeler\verdent-projects\new-project\envanter-site\*' -DestinationPath 'C:\Users\yapic\OneDrive\Belgeler\verdent-projects\new-project\envanter-site.zip' -Force"
echo.
echo Tamamlandi! envanter-site.zip hazir.
echo.
pause
