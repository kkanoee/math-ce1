@echo off
echo ========================================
echo      MathCE1 - Creation de l'executable
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Verification des dependances...
call npm install

echo.
echo [2/3] Construction de l'application Windows...
call npm run electron:build

echo.
IF %ERRORLEVEL% EQU 0 (
    echo [3/3] SUCCES ! L'executable a ete cree.
    echo.
    echo Ouverture du dossier de destination...
    start "" "dist"
) ELSE (
    echo [3/3] ERREUR lors de la creation.
    echo Veuillez verifier les messages ci-dessus.
    pause
)

echo.
echo Appuyez sur une touche pour quitter.
pause >nul
