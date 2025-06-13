# Guide Sécurisé : Remplacer l'Ancien Projet Sans Perdre Git

## ⚠️ ATTENTION CRITIQUE
**Ne JAMAIS copier le dossier `.git` !** Cela écraserait votre configuration de fork.

## Méthode Sécurisée

### Option 1 : Méthode Manuelle (RECOMMANDÉE)

1. **Localiser votre ancien projet forké**
   - Cherchez dans `C:\Users\LENOVO\APPS\` ou autres dossiers
   - Le dossier doit contenir un `.git` pointant vers VOTRE fork

2. **Dans l'ancien projet :**
   - Sélectionnez TOUT sauf `.git` (Ctrl+A puis Ctrl+clic sur `.git`)
   - Supprimez ces fichiers/dossiers
   - **GARDEZ le dossier `.git` intact**

3. **Dans ce projet actuel :**
   - Sélectionnez TOUT sauf `.git`
   - Copiez (Ctrl+C)

4. **Retour dans l'ancien projet :**
   - Collez (Ctrl+V)

### Option 2 : Script Automatisé

1. **Modifiez `copy-without-git.bat` :**
   ```batch
   set "TARGET_DIR=C:\Users\LENOVO\APPS\VOTRE-ANCIEN-PROJET"
   ```

2. **Exécutez le script**

### Option 3 : PowerShell
```powershell
robocopy "C:\Users\LENOVO\APPS\0-video\react-video-editor" "CHEMIN\VERS\ANCIEN-PROJET" /E /XD .git
```

## Vérification Finale

Après la copie, dans votre ancien projet :
```bash
git remote -v
```
Doit afficher VOTRE repository, pas l'original.

## Résultat Attendu

✅ Code mis à jour  
✅ Git pointe vers VOTRE fork  
✅ Prêt pour `git add`, `git commit`, `git push`  
❌ Aucun lien avec le projet original