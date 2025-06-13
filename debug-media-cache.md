# Script de Debug pour le Cache des Médias

## Problème rencontré
Les nouveaux médias ajoutés disparaissent après rafraîchissement ou navigation, seuls les anciens restent.

## Script de debug à exécuter dans la console du navigateur

```javascript
// 1. Vérifier l'état actuel du localStorage
console.log('=== ÉTAT DU CACHE ===');
console.log('Version:', localStorage.getItem('video-editor-media-version'));
console.log('Données brutes:', localStorage.getItem('video-editor-imported-media'));

// 2. Analyser les données sauvegardées
const stored = localStorage.getItem('video-editor-imported-media');
if (stored) {
  try {
    const data = JSON.parse(stored);
    console.log('Nombre de médias en cache:', data.length);
    data.forEach((media, index) => {
      console.log(`Média ${index + 1}:`, {
        name: media.name,
        type: media.type,
        hasFileData: !!media.fileData,
        hasPreviewData: !!media.previewData,
        size: media.size
      });
    });
  } catch (e) {
    console.error('Erreur de parsing:', e);
  }
} else {
  console.log('Aucune donnée en cache');
}

// 3. Vérifier l'état du store Zustand (si accessible)
console.log('=== ÉTAT DU STORE ===');
// Cette partie nécessite l'accès au store depuis la fenêtre

// 4. Forcer le nettoyage du cache (si nécessaire)
function clearMediaCache() {
  localStorage.removeItem('video-editor-imported-media');
  localStorage.removeItem('video-editor-media-version');
  console.log('Cache nettoyé - rafraîchissez la page');
}

// 5. Exporter la fonction de nettoyage
window.clearMediaCache = clearMediaCache;
console.log('Fonction clearMediaCache() disponible pour nettoyage forcé');
```

## Instructions pour l'utilisateur

1. **Ouvrir la console du navigateur** (F12 → Console)
2. **Copier-coller le script ci-dessus** et appuyer sur Entrée
3. **Analyser les résultats** affichés
4. **Si nécessaire, nettoyer le cache** avec `clearMediaCache()`
5. **Rafraîchir la page** et retester l'import

## Signaux d'alerte

- ❌ `hasFileData: false` - Les données base64 sont manquantes
- ❌ `Version: null` ou version différente de "2.0"
- ❌ Erreur de parsing du JSON
- ❌ Nombre de médias incohérent avec ce qui est affiché

## Solution temporaire

Si le problème persiste, utiliser la fonction de nettoyage :
```javascript
clearMediaCache();
// Puis rafraîchir la page (F5)
```

Cela forcera un redémarrage propre du système de cache.