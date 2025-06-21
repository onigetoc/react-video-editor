# Plan d'implémentation - Recherche Pexels

## 📋 Spécifications mises à jour

### Configuration environnement
- **Clé API** : `Sw4PEtt3xTaVcSi39aEn8w3YcvOzOiUABP19rBkVou8wq3vk8oZ0MOzT`
- **Fichiers** : `.env` et `.env.example` à créer
- **Package** : Tester le package `pexels` v1.4.0 existant en premier

### Interface utilisateur - Onglet Pexels
- **Pas de drag & drop** pour l'upload (API search uniquement)
- **Drag & drop fonctionnel** pour ajouter les médias Pexels à la timeline
- **Boutons Image/Vidéo** : Style moderne, pas de dropdown
- **Switch automatique** : Relancer la recherche automatiquement quand on change de type

### Thumbnails et affichage
- **Nom affiché** : Utiliser les données JSON Pexels (pas le nom de fichier)
- **Format adaptatif** :
  - 16:9 → utiliser `src.landscape`
  - 9:16 → utiliser `src.portrait`

#### URLs des thumbnails personnalisées
```javascript
// Pour les photos (ID = 3573351 par exemple)
const thumbnailUrl = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=113`

// Tiny landscape (inverser h et w)
const tinyLandscape = `&fit=crop&w=200&h=113`
```

#### Images haute définition pour le lecteur vidéo
- **Paysage** : 1920x1080 (YouTube, 1080p, Full HD)
- **Portrait** : 1080x1920 (TikTok, Shorts, Reels, Full HD vertical)

## 🎯 Structure d'implémentation

### 1. Configuration (.env files)
```env
# .env
VITE_PEXELS_API_KEY=Sw4PEtt3xTaVcSi39aEn8w3YcvOzOiUABP19rBkVou8wq3vk8oZ0MOzT

# .env.example
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

### 2. Hook de recherche Pexels
```typescript
// src/features/editor/hooks/usePexelsSearch.ts
interface PexelsSearchOptions {
  query: string;
  type: 'photos' | 'videos';
  perPage?: number;
}

interface PexelsResult {
  id: number;
  photographer?: string; // pour photos
  user?: { name: string }; // pour vidéos
  src: {
    landscape: string;
    portrait: string;
    original: string;
  };
  // ... autres propriétés
}
```

### 3. Logique d'affichage des thumbnails
```typescript
const getThumbnailUrl = (item: PexelsResult, format: '16:9' | '9:16') => {
  const baseUrl = `https://images.pexels.com/photos/${item.id}/pexels-photo-${item.id}.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop`;
  
  if (format === '16:9') {
    return `${baseUrl}&w=200&h=113`; // landscape
  } else {
    return `${baseUrl}&h=200&w=113`; // portrait
  }
};
```

### 4. Adaptation pour le lecteur vidéo
```typescript
const getFullHDUrl = (item: PexelsResult, format: '16:9' | '9:16') => {
  if (format === '16:9') {
    return item.src.landscape; // 1920x1080
  } else {
    return item.src.portrait; // 1080x1920
  }
};
```

### 5. Interface dans videos.tsx
- Modifier le case 'pexels' existant
- Ajouter input de recherche
- Ajouter boutons Image/Vidéo modernes
- Intégrer avec Masonic pour l'affichage
- Maintenir le drag & drop pour ajouter à la timeline

## 🔧 API Endpoints à utiliser

### Photos
```
GET https://api.pexels.com/v1/search
Headers: Authorization: YOUR_API_KEY
Params: query, per_page (default: 15, max: 80)
```

### Vidéos
```
GET https://api.pexels.com/videos/search  
Headers: Authorization: YOUR_API_KEY
Params: query, per_page (default: 15, max: 80)
```

## 🎨 Version simple (v1)
- Pas de cache
- Pas de pagination
- Recherche basique
- Test du package pexels existant
- Fallback vers fetch si nécessaire

## 🚀 Prochaines étapes
1. Créer les fichiers .env
2. Tester le package pexels
3. Implémenter le hook de recherche
4. Modifier le composant videos.tsx
5. Tester l'intégration complète