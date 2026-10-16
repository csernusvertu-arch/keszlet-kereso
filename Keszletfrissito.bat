@echo off

echo =====================================
echo Keszlet frissitese a Raktarkezelobol
echo =====================================
echo.

python python\frissites.py

if errorlevel 1 (
    echo.
    echo HIBA tortent a JSON generalasa kozben.
    pause
    exit /b
)

echo.
echo GitHub frissitese...

git add data/keszlet.json index.html css/style.css js/script.js python/frissites.py Keszletfrissito.bat

git diff --cached --quiet

if %errorlevel%==0 (
    echo.
    echo Nem valtozott a keszlet.
    pause
    exit /b
)

git commit -m "Update inventory"

git push

if errorlevel 1 (
    echo.
    echo HIBA: A GitHub feltoltes sikertelen.
    pause
    exit /b
)

echo.
echo =====================================
echo Keszlet sikeresen frissitve!
echo =====================================

pause