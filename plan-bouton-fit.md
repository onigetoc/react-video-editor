# 📋 Plan Détaillé pour Corriger le Bouton "Fit"

## 🔍 **Analyse du Problème**

1. **Problème identifié** : Le bouton "Fit" ne fait que centrer les médias mais n'applique pas le bon scaling "fit" comme lors de l'ajout initial
2. **Ce qui fonctionne** : Le texte fonctionne correctement (à préserver)
3. **Ce qui ne fonctionne pas** : Les vidéos et images ne s'ajustent pas aux dimensions du player
4. **Problème secondaire** : L'audio casse la timeline (alors qu'il ne devrait pas être affecté)

## 🎯 **Solution Proposée**

### **1. Comprendre l'Algorithme "Fit" Actuel**
D'après [`use-crop-store.ts`](src/features/editor/store/use-crop-store.ts:71-75), l'algorithme "fit" est :
```typescript
const widthScale = containerWidth / mediaWidth;
const heightScale = containerHeight / mediaHeight;
const scaleFactor = Math.min(widthScale, heightScale); // Prendre le plus petit pour "fit"
```

### **2. Modifier la Fonction `doFitSelected`**
Dans [`src/features/editor/timeline/header.tsx`](src/features/editor/timeline/header.tsx:104-139) :

**Problèmes actuels** :
- Calcule seulement le centrage (`left` et `top`)
- Ne calcule pas le scale "fit" 
- Traite tous les types de médias de la même façon
- L'audio est exclu mais pourrait perturber le processus

**Améliorations nécessaires** :
- Appliquer l'algorithme "fit" scaling pour les images et vidéos
- Préserver le comportement actuel pour le texte
- Assurer que l'audio n'interfère pas
- Combiner centrage + scaling selon le type de média

### **3. Algorithme "Fit" par Type de Média**

```mermaid
flowchart TD
    A[Bouton Fit Cliqué] --> B{Type de Média}
    
    B -->|Text| C[Centrage Simple]
    C --> C1[Position: center]
    C1 --> C2[Transform: scale(1)]
    
    B -->|Image/Video| D[Fit Scaling]
    D --> D1[Calculer dimensions originales]
    D1 --> D2[Calculer scale factor fit]
    D2 --> D3[Appliquer scale + centrage]
    
    B -->|Audio| E[Ignorer Complètement]
    
    C2 --> F[Appliquer Changements]
    D3 --> F
    E --> F
    
    F --> G[Mettre à jour Store]
```

### **4. Code de la Solution**

**Fonction à modifier** : `doFitSelected()` dans [`timeline/header.tsx`](src/features/editor/timeline/header.tsx:104-139)

```typescript
const doFitSelected = () => {
  if (!activeIds.length) return;

  const fitPayload: Record<string, { details: any }> = {};

  activeIds.forEach((id) => {
    const item = trackItemDetailsMap[id];
    if (!item) return;

    // IMPORTANT: Ignorer complètement l'audio 
    if (item.type === 'audio') return;

    const elementWidth = item.details.width || 0;
    const elementHeight = item.details.height || 0;

    if (item.type === 'text') {
      // Pour le texte: centrage simple (comportement actuel à préserver)
      const centeredLeft = (size.width - elementWidth) / 2;
      const centeredTop = (size.height - elementHeight) / 2;
      
      fitPayload[id] = {
        details: {
          left: centeredLeft,
          top: centeredTop,
          transform: "scale(1) rotate(0deg)"
        },
      };
    } else if (item.type === 'image' || item.type === 'video') {
      // Pour images/vidéos: appliquer l'algorithme "fit" comme à l'ajout initial
      
      // Calculer le scale factor "fit" (inspiré de use-crop-store.ts)
      const widthScale = size.width / elementWidth;
      const heightScale = size.height / elementHeight;
      const scaleFactor = Math.min(widthScale, heightScale);
      
      // Calculer les nouvelles dimensions après scaling
      const scaledWidth = elementWidth * scaleFactor;
      const scaledHeight = elementHeight * scaleFactor;
      
      // Centrer avec les nouvelles dimensions
      const centeredLeft = (size.width - scaledWidth) / 2;
      const centeredTop = (size.height - scaledHeight) / 2;
      
      fitPayload[id] = {
        details: {
          left: centeredLeft,
          top: centeredTop,
          transform: `scale(${scaleFactor}) rotate(0deg)`,
          // Optionnel: mettre à jour les dimensions dans le store
          width: scaledWidth,
          height: scaledHeight
        },
      };
    }
  });

  // Appliquer les modifications si des éléments ont été traités
  if (Object.keys(fitPayload).length > 0) {
    dispatch(EDIT_OBJECT, {
      payload: fitPayload,
    });
  }
};
```

### **5. Inspiration Remotion**
D'après la documentation Remotion que vous avez fournie :
- Utiliser `justifyContent: "center"` et `alignItems: "center"` pour le centrage
- Utiliser `width: "100%"` et `height: "100%"` pour le fill
- `AbsoluteFill` combine ces deux comportements

Cette approche est similaire à notre calcul du `scaleFactor` avec centrage.

### **6. Tests Nécessaires**
1. **Texte** : Vérifier que le centrage fonctionne toujours
2. **Images** : Vérifier le fit scaling + centrage
3. **Vidéos** : Vérifier le fit scaling + centrage  
4. **Audio** : Vérifier qu'il n'affecte pas la timeline
5. **Sélection multiple** : Tester avec plusieurs types de médias

### **7. Fichiers à Modifier**
- [`src/features/editor/timeline/header.tsx`](src/features/editor/timeline/header.tsx) : Fonction `doFitSelected`

---

## ❓ **Questions de Validation**

Avant de procéder à l'implémentation, voulez-vous :

1. **Valider cette approche** ? Est-ce que l'algorithme "fit" proposé correspond à vos attentes ?
2. **Modifier quelque chose** dans le plan ?
3. **Procéder directement à l'implémentation** ?

Le plan respecte vos exigences :
- ✅ Préserve le comportement du texte
- ✅ Applique le "fit" scaling pour images/vidéos
- ✅ Ignore complètement l'audio pour éviter de casser la timeline
- ✅ S'inspire du code Remotion existant

## 🔧 **Prochaines Étapes**

1. Valider le plan avec l'utilisateur
2. Implémenter la solution dans `timeline/header.tsx`
3. Tester chaque type de média
4. Vérifier que l'audio ne casse plus la timeline
5. Documenter les changements