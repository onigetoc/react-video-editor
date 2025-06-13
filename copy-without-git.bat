@echo off
echo Script de copie SECURISE - Preserve votre configuration Git
echo.
echo IMPORTANT: Ce script copie tout SAUF le dossier .git
echo.

REM Definir les chemins (VOUS DEVEZ LES MODIFIER)
set "SOURCE_DIR=C:\Users\LENOVO\APPS\0-video\react-video-editor"
set "TARGET_DIR=C:\Users\LENOVO\APPS\VOTRE-ANCIEN-PROJET"

echo Source: %SOURCE_DIR%
echo Target: %TARGET_DIR%
echo.
echo VERIFIEZ ces chemins avant de continuer !
pause

REM Copier tous les fichiers SAUF .git
xcopy "%SOURCE_DIR%\*" "%TARGET_DIR%\" /E /H /Y /EXCLUDE:exclude-git.txt

echo.
echo Copie terminee ! Votre configuration Git est preservee.
pause