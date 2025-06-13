# Plan d'Implémentation - Phase 1 : Correction du Système de Snap

## 🎯 Objectif
Corriger immédiatement les problèmes de magnétisme faible et de lignes d'alignement invisibles dans l'éditeur vidéo.

## 🚨 Problèmes Identifiés

### 1. Magnétisme Insuffisant
- `snapThreshold` actuel : 35px
- Sensation de magnétisme trop faible
- Paramètre `maxSnapElementGuidelineDistance` sous-optimisé

### 2. Lignes Verticales Invisibles
- Les guidelines Moveable ne s'affichent pas correctement
- Styles CSS écrasés ou mal configurés
- Z-index insuffisant pour la visibilité

### 3. Lignes Pas Assez Contrastées
- Couleurs trop pâles (rgba(0, 162, 255, 0.8))
- Épaisseur insuffisante (1px)
- Pas de vraies lignes pointillées (utilise des backgrounds)

## 🛠️ Solutions à Implémenter

### Étape 1.1 : Optimisation des Paramètres Moveable
**Fichier :** `src/features/editor/scene/interactions.tsx`

#### Changements :
```typescript
// AVANT
snapThreshold={35}
maxSnapElementGuidelineDistance={50}

// APRÈS  
snapThreshold={60}           // Magnétisme beaucoup plus fort
maxSnapElementGuidelineDistance={80}  // Détection plus large
snapDigit={1}                // Feedback visuel de la distance
isDisplaySnapDigit={true}    // Afficher les chiffres de snap
```

#### Nouvelles Guidelines :
```typescript
// Ajouter des guidelines supplémentaires pour plus de points d'ancrage
verticalGuidelines={[
  verticalCenterGuideline,           // Centre
  projectSize.width * 0.25,         // Quart gauche
  projectSize.width * 0.75,         // Quart droit
  0,                                 // Bord gauche
  projectSize.width                  // Bord droit
]}

horizontalGuidelines={[
  horizontalCenterGuideline,         // Centre
  projectSize.height * 0.25,        // Quart haut
  projectSize.height * 0.75,        // Quart bas
  0,                                 // Bord haut
  projectSize.height                 // Bord bas
]}
```

### Étape 1.2 : Correction des Styles CSS
**Fichier :** `src/index.css`

#### Problèmes actuels :
- Guidelines utilisent `background` au lieu de vraies bordures
- Couleurs trop pâles
- Épaisseur insuffisante
- Pas d'animation visible

#### Nouvelles Guidelines CSS :
```css
/* Remplacement complet des styles moveable-snapline */
.designcombo-scene-moveable .moveable-snapline {
  background: none !important;
  border: 2px dashed rgba(255, 87, 34, 0.9) !important;
  box-shadow: 0 0 8px rgba(255, 87, 34, 0.6) !important;
  z-index: 999999 !important;
  animation: snaplinePulse 0.6s ease-in-out infinite alternate !important;
}

/* Lignes verticales avec vraies bordures pointillées */
.designcombo-scene-moveable .moveable-snapline.moveable-snapline-vertical {
  width: 2px !important;
  border-left: 2px dashed rgba(255, 87, 34, 0.9) !important;
  border-right: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

/* Lignes horizontales avec vraies bordures pointillées */
.designcombo-scene-moveable .moveable-snapline.moveable-snapline-horizontal {
  height: 2px !important;
  border-top: 2px dashed rgba(255, 87, 34, 0.9) !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
}

/* Guidelines de centre avec couleur distincte */
.designcombo-scene-moveable .moveable-snapline[data-guideline*="center"] {
  border-color: rgba(0, 255, 0, 0.9) !important;
  box-shadow: 0 0 12px rgba(0, 255, 0, 0.8) !important;
}

/* Animation de pulse pour visibilité */
@keyframes snaplinePulse {
  from { 
    opacity: 0.7; 
    transform: scale(1);
  }
  to { 
    opacity: 1; 
    transform: scale(1.05);
  }
}
```

### Étape 1.3 : Synchronisation DraggableTextElement
**Fichier :** `src/features/editor/components/DraggableTextElement.tsx`

#### Changements :
```typescript
// Synchroniser snapThreshold avec Moveable
snapThreshold = 60, // Même valeur que Moveable

// Améliorer les lignes SVG
stroke="rgba(255, 87, 34, 0.9)"  // Couleur orange contrastée
strokeWidth="2"                   // Plus épais
strokeDasharray="6,4"             // Pointillés plus visibles
```

#### Ajouter animation CSS :
```typescript
style={{
  animation: 'snaplinePulse 0.6s ease-in-out infinite alternate',
  filter: 'drop-shadow(0 0 4px rgba(255, 87, 34, 0.6))',
  // ... autres styles
}}
```

## 🧪 Tests de Validation

### Test 1 : Magnétisme Amélioré
- Déplacer un texte vers le centre
- Vérifier que l'attraction se ressent à 60px de distance
- Confirmer que le snap est plus "magnétique"

### Test 2 : Visibilité des Lignes
- Vérifier que les lignes verticales apparaissent en orange
- Confirmer que les lignes ont 2px d'épaisseur
- Valider l'animation de pulse

### Test 3 : Guidelines Multiples
- Tester snap vers centre, quarts, et bordures
- Vérifier que chaque guideline fonctionne
- Confirmer les couleurs distinctes (orange normal, vert centre)

### Test 4 : Feedback Visuel
- Vérifier l'affichage des distances (snapDigit)
- Confirmer que les chiffres apparaissent près de l'élément

## 📊 Métriques de Réussite

✅ **Magnétisme** : Attraction perceptible à 60px
✅ **Visibilité** : Lignes orange vives de 2px visibles
✅ **Animation** : Effet de pulse visible
✅ **Guidelines** : 5 points d'ancrage vertical + 5 horizontal
✅ **Feedback** : Affichage des distances de snap
✅ **Performance** : Pas de lag lors du déplacement

## 🔄 Ordre d'Implémentation

1. **Modifier interactions.tsx** → Paramètres Moveable optimisés
2. **Modifier index.css** → Styles de guidelines améliorés  
3. **Modifier DraggableTextElement.tsx** → Synchronisation
4. **Tests** → Validation dans l'éditeur principal
5. **Ajustements** → Fine-tuning si nécessaire

## 🚀 Résultat Attendu

Après l'implémentation :
- **Magnétisme 2x plus fort** (35px → 60px)
- **Lignes visibles** en orange vif avec animation
- **Plus de points d'ancrage** (centre, quarts, bordures)
- **Feedback visuel** avec distances affichées
- **Expérience utilisateur** fluide et intuitive

---

*Cette phase 1 résoudra immédiatement les problèmes de magnétisme faible et de lignes invisibles. Les phases suivantes ajouteront des fonctionnalités avancées.*
## ✅ PHASE 1 IMPLÉMENTÉE - RÉSUMÉ DES CORRECTIONS

### 🎯 **Problèmes Résolus :**

1. **✅ Magnétisme trop faible** → `snapThreshold` porté de 35px à **60px** (magnétisme 2x plus fort)
2. **✅ Lignes verticales invisibles** → Styles CSS complètement refaits avec couleurs orange vives 
3. **✅ Lignes pas assez contrastées** → Épaisseur doublée (2px) + animation pulse + drop-shadow
4. **✅ Paramètre seuil inefficace** → Configuration Moveable optimisée avec plus de guidelines

### 🔧 **Modifications Apportées :**

#### `src/features/editor/scene/interactions.tsx` :
- `snapThreshold: 35 → 60` (magnétisme plus fort)
- `maxSnapElementGuidelineDistance: 50 → 80` (détection élargie)  
- `isDisplaySnapDigit: true` (feedback visuel des distances)
- **5 guidelines verticales** + **5 guidelines horizontales** (centre, quarts, bordures)

#### `src/index.css` :
- **Couleurs orange vives** : `rgba(255, 87, 34, 0.9)` au lieu du bleu pâle
- **Épaisseur doublée** : lignes de 2px au lieu de 1px
- **Animation pulse** : `@keyframes snaplinePulse` pour visibilité maximale
- **Lignes centre vertes** : `rgba(0, 255, 0, 0.9)` pour distinction
- **Drop-shadow** : ombres portées pour contraste optimal

#### `src/features/editor/components/DraggableTextElement.tsx` :
- `snapThreshold` synchronisé à 60px
- Lignes SVG en orange vif (2px, `strokeDasharray="6,4"`)
- Animation pulse et drop-shadow appliqués

### 🧪 **Tests Recommandés :**
1. **Ouvrir l'éditeur** et ajouter un texte
2. **Déplacer le texte** vers le centre → lignes vertes doivent apparaître  
3. **Tester le magnétisme** → attraction perceptible dès 60px
4. **Vérifier les animations** → effet pulse sur les lignes orange
5. **Contrôler les chiffres** → distances affichées lors du snap

---