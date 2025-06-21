import { ITrackItem } from "@designcombo/types";
import { PlayerRef } from "@remotion/player";

export interface ClipNavigationData {
  trackItemsMap: Record<string, ITrackItem>;
  trackItemIds: string[];
  fps: number;
  playerRef: React.RefObject<PlayerRef> | null;
}

/**
 * Récupère tous les clips de la timeline et les trie par position chronologique
 */
export const getAllClipsSorted = (data: ClipNavigationData): ITrackItem[] => {
  const clips = data.trackItemIds
    .map(id => data.trackItemsMap[id])
    .filter(Boolean)
    .sort((a, b) => a.display.from - b.display.from);
  
  // Debug: Log des clips trouvés
  console.log('Clips trouvés:', clips.length, clips.map(c => ({ id: c.id, from: c.display.from, to: c.display.to })));
  
  return clips;
};

/**
 * Trouve le clip qui contient le temps actuel
 */
export const findCurrentClip = (
  clips: ITrackItem[], 
  currentTimeMs: number
): ITrackItem | null => {
  return clips.find(clip => 
    currentTimeMs >= clip.display.from && 
    currentTimeMs <= clip.display.to
  ) || null;
};

/**
 * Trouve le clip précédent - le plus proche À GAUCHE (temps plus petit)
 */
export const findPreviousClip = (
  clips: ITrackItem[],
  currentTimeMs: number
): ITrackItem | null => {
  console.log('findPreviousClip - Position actuelle:', currentTimeMs);
  console.log('Clips disponibles:', clips.map(c => ({ id: c.id, from: c.display.from, to: c.display.to })));
  
  if (clips.length === 0) return null;
  
  // Trouver le clip le plus proche À GAUCHE (début du clip < position actuelle)
  let closestClip: ITrackItem | null = null;
  let closestDistance = Infinity;
  
  for (const clip of clips) {
    if (clip.display.from < currentTimeMs) {
      const distance = currentTimeMs - clip.display.from;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestClip = clip;
      }
    }
  }
  
  if (closestClip) {
    console.log('Clip précédent (à gauche) trouvé:', { id: closestClip.id, from: closestClip.display.from, to: closestClip.display.to });
    return closestClip;
  }
  
  // Si aucun clip à gauche, ne rien faire
  console.log('Aucun clip à gauche - pas de navigation');
  return null;
};

/**
 * Trouve le clip suivant - le plus proche À DROITE (temps plus grand)
 */
export const findNextClip = (
  clips: ITrackItem[],
  currentTimeMs: number
): ITrackItem | null => {
  console.log('findNextClip - Position actuelle:', currentTimeMs);
  console.log('Clips disponibles:', clips.map(c => ({ id: c.id, from: c.display.from, to: c.display.to })));
  
  if (clips.length === 0) return null;
  
  // Trouver le clip le plus proche À DROITE (fin du clip > position actuelle)
  let closestClip: ITrackItem | null = null;
  let closestDistance = Infinity;
  
  for (const clip of clips) {
    // Utiliser display.to au lieu de display.from pour être cohérent avec la logique
    if (clip.display.to > currentTimeMs) {
      const distance = clip.display.to - currentTimeMs;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestClip = clip;
      }
    }
  }
  
  if (closestClip) {
    console.log('Clip suivant (à droite) trouvé:', { id: closestClip.id, from: closestClip.display.from, to: closestClip.display.to });
    return closestClip;
  }
  
  // Si aucun clip à droite, ne rien faire
  console.log('Aucun clip à droite - pas de navigation');
  return null;
};

/**
 * Navigue vers un clip spécifique en positionnant le lecteur au début du clip
 */
export const navigateToClip = (
  clip: ITrackItem,
  fps: number,
  playerRef: React.RefObject<PlayerRef> | null
): void => {
  if (!playerRef?.current) return;
  
  // Convertir le temps en millisecondes vers frame
  const targetFrame = (clip.display.from / 1000) * fps;
  playerRef.current.seekTo(targetFrame);
};

/**
 * Navigue vers la fin d'un clip spécifique
 */
export const navigateToClipEnd = (
  clip: ITrackItem,
  fps: number,
  playerRef: React.RefObject<PlayerRef> | null
): void => {
  if (!playerRef?.current) return;
  
  // Convertir le temps en millisecondes vers frame (fin du clip)
  const targetFrame = (clip.display.to / 1000) * fps;
  playerRef.current.seekTo(targetFrame);
};