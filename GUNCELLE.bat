@echo off
echo Dosya kopyalanıyor...
copy /Y "C:\Users\yapic\OneDrive\Belgeler\verdent-projects\new-project\envanter-site\index.html" "C:\Users\yapic\OneDrive\Belgeler\GitHub\index.html"
if %errorlevel%==0 (
  echo BAŞARILI! Şimdi GitHub Desktop'ı açıp Commit ve Push yapın.
) else (
  echo HATA! Klasör bulunamadı.
)
pause
