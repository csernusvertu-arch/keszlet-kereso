@echo off

echo =====================================
echo NaturaSoft keszlet frissitese
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

git add data/keszlet.json

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