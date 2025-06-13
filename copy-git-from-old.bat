@echo off
echo ========================================
echo Copie SECURISEE du .git depuis l'ancien projet
echo ========================================
echo.

REM IMPORTANT: Modifiez ce chemin vers votre ancien projet forké
set "OLD_PROJECT=C:\Users\LENOVO\APPS\ANCIEN-react-video-editor"
set "CURRENT_PROJECT=%CD%"

echo Projet actuel: %CURRENT_PROJECT%
echo Ancien projet: %OLD_PROJECT%
echo.

REM Vérification de sécurité
if not exist "%OLD_PROJECT%\.git" (
    echo ERREUR: Le dossier .git n'existe pas dans l'ancien projet !
    echo Vérifiez le chemin: %OLD_PROJECT%
    pause
    exit /b 1
)

echo ATTENTION: Cette opération va:
echo 1. Sauvegarder votre .git actuel (si il existe)
echo 2. Copier le .git de votre ancien projet forké
echo.
echo Voulez-vous continuer ? (O/N)
set /p confirm=

if /i "%confirm%" neq "O" (
    echo Opération annulée.
    pause
    exit /b 0
)

REM Sauvegarde du .git actuel
if exist ".git" (
    echo Sauvegarde du .git actuel...
    move ".git" ".git-backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%"
)

REM Copie du .git de l'ancien projet
echo Copie du .git depuis l'ancien projet...
xcopy "%OLD_PROJECT%\.git" ".git\" /E /H /Y

echo.
echo ========================================
echo SUCCÈS ! Configuration Git copiée.
echo.
echo Vérifiez avec: git remote -v
echo Cela devrait pointer vers VOTRE fork.
echo ========================================
pause