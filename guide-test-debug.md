# Guide de Test et Debug - Médias Importés

## 🚨 IMPORTANT - Avant de tester

**Le cache a été mis à jour avec une nouvelle version. La première fois que vous chargez la page après les modifications, l'ancien cache sera automatiquement nettoyé.**

## 📋 Procédure de Test

### 1. **Nettoyage Initial** (Recommandé)
```javascript
// Dans la console du navigateur (F12)
localStorage.removeItem('video-editor-imported-media');
localStorage.removeItem('video-editor-media-version');
location.reload();
```

### 2. **Test d'Import de Base**
1. Importez 2-3 fichiers (vidéo, audio, image)
2. Vérifiez qu'ils apparaissent dans l'onglet Import
3. **Ouvrez la console** et vérifiez les logs :
   - ✅ "X nouveau(x) média(s) importé(s)"
   - ✅ "Sauvegarde réussie: X médias sauvegardés"

### 3. **Test de Navigation**
1. Naviguez vers "Images" → "Audio" → "Text"
2. Revenez à "Videos" 
3. **Les médias doivent encore être présents**

### 4. **Test de Persistance**
1. Rafraîchissez la page (F5)
2. Attendez le chargement
3. Vérifiez la console :
   - ✅ "X médias restaurés depuis le localStorage"
4. **Les médias doivent réapparaître**

### 5. **Test de Doublons**
1. Essayez d'importer les mêmes fichiers
2. Vérifiez la console :
   - ✅ "Médias déjà importés (ignorés): nom-fichier.ext"

## 🔧 Outils de Debug Disponibles

### Dans la Console du Navigateur :

```javascript
// Voir l'état actuel des médias
window.debugImportedMedia.getImportedMedia()

// Nettoyer le cache
window.debugImportedMedia.clearCache()

// Nettoyer et recharger la page
window.debugImportedMedia.forceReload()
```

### Vérifier le localStorage :
```javascript
// Voir la version du cache
localStorage.getItem('video-editor-media-version')

// Voir les données (attention: peut être très long)
JSON.parse(localStorage.getItem('video-editor-imported-media') || '[]').length
```

## 🐛 Diagnostic des Problèmes

### Si les médias disparaissent encore :

1. **Vérifiez la console** pour des erreurs
2. **Testez avec un seul fichier** d'abord
3. **Vérifiez la version** : `localStorage.getItem('video-editor-media-version')` doit être `"2.0"`
4. **Forcez le nettoyage** :
   ```javascript
   window.debugImportedMedia.forceReload()
   ```

### Logs à surveiller :

**✅ Logs positifs :**
- "Migration vers nouvelle version, nettoyage du cache..."
- "X médias restaurés depuis le localStorage"
- "Sauvegarde réussie: X médias sauvegardés"
- "X nouveau(x) média(s) importé(s)"

**❌ Logs d'erreur :**
- "Impossible de restaurer le fichier..."
- "Pas de données fileData pour..."
- "Erreur lors du chargement des médias..."

## 🆘 Solution de Dernier Recours

Si rien ne fonctionne :
```javascript
// Nettoyage complet
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Puis retestez l'import depuis zéro.

## 📞 Feedback Attendu

Après vos tests, merci de me dire :
1. ✅/❌ Les médias persistent lors de la navigation entre onglets
2. ✅/❌ Les médias persistent après rafraîchissement
3. ✅/❌ Les doublons sont rejetés
4. 📋 Tous les logs de console (s'il y a des erreurs)
5. 🔍 Résultat de `window.debugImportedMedia.getImportedMedia()` si les médias disparaissent