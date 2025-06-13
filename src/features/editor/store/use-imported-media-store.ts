import { create } from "zustand";
import { MediaType, ImportedMedia } from "../interfaces/editor";

interface MediaMetadata {
  name: string;
  size: number;
  lastModified: number;
}

interface ImportedMediaStore {
  importedMedia: ImportedMedia[];
  previousSessionMetadata: MediaMetadata[]; // Métadonnées des sessions précédentes
  addImportedMedia: (media: ImportedMedia[]) => ImportedMedia[];
  removeImportedMedia: (id: string) => void;
  validateAndCleanMedia: () => Promise<void>;
  getImportedMediaByType: (type: MediaType) => ImportedMedia[];
  isMediaAlreadyImported: (file: File) => boolean;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  initializeStore: () => Promise<void>;
  clearAllData: () => void; // Pour debug et nettoyage forcé
}

const STORAGE_KEY = 'video-editor-imported-media';
const STORAGE_VERSION_KEY = 'video-editor-media-version';
const CURRENT_VERSION = '2.0'; // Version pour forcer la migration

const useImportedMediaStore = create<ImportedMediaStore>((set, get) => ({
  importedMedia: [],
  previousSessionMetadata: [],

  addImportedMedia: (newMedia: ImportedMedia[]) => {
    const { importedMedia, isMediaAlreadyImported, saveToStorage } = get();
    
    console.log(`🔄 Tentative d'ajout de ${newMedia.length} médias...`);
    
    // Filtrer les doublons
    const uniqueNewMedia = newMedia.filter(media => {
      // Créer un objet File temporaire pour la vérification
      const tempFile = {
        name: media.name,
        size: media.size,
        lastModified: media.lastModified
      } as File;
      
      const isDuplicate = isMediaAlreadyImported(tempFile);
      if (isDuplicate) {
        console.log(`⚠️ Doublon détecté: ${media.name}`);
      }
      return !isDuplicate;
    });

    console.log(`✅ ${uniqueNewMedia.length} médias uniques à ajouter`);

    if (uniqueNewMedia.length > 0) {
      const updatedMedia = [...importedMedia, ...uniqueNewMedia];
      console.log(`📝 Mise à jour du store: ${importedMedia.length} → ${updatedMedia.length} médias`);
      set({ importedMedia: updatedMedia });
      
      // Forcer la sauvegarde immédiatement
      console.log(`💾 Sauvegarde forcée des ${updatedMedia.length} médias...`);
      saveToStorage();
      
      // Vérifier que la sauvegarde a fonctionné
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        console.log(`✅ Sauvegarde confirmée: ${parsedSaved.length} médias dans localStorage`);
      } else {
        console.error(`❌ Échec de sauvegarde: aucune donnée dans localStorage`);
      }
    }
    
    return uniqueNewMedia;
  },

  removeImportedMedia: (id: string) => {
    const { importedMedia, saveToStorage } = get();
    const updatedMedia = importedMedia.filter(media => media.id !== id);
    set({ importedMedia: updatedMedia });
    saveToStorage();
  },

  isMediaAlreadyImported: (file: File): boolean => {
    const { importedMedia, previousSessionMetadata } = get();
    
    // Vérifier dans les médias de la session actuelle
    const isInCurrentSession = importedMedia.some(media =>
      media.name === file.name &&
      media.size === file.size &&
      media.lastModified === file.lastModified
    );
    
    // Vérifier dans les métadonnées des sessions précédentes
    const isInPreviousSessions = previousSessionMetadata.some(metadata =>
      metadata.name === file.name &&
      metadata.size === file.size &&
      metadata.lastModified === file.lastModified
    );
    
    return isInCurrentSession || isInPreviousSessions;
  },

  getImportedMediaByType: (type: MediaType): ImportedMedia[] => {
    const { importedMedia } = get();
    return importedMedia.filter(media => media.type === type);
  },

  validateAndCleanMedia: async (): Promise<void> => {
    const { importedMedia } = get();
    
    // Pour le moment, on garde tous les médias car les URLs blob
    // ne persistent pas entre les sessions. On pourrait implémenter
    // une validation plus sophistiquée avec File System Access API plus tard
    
    // Optionnel : log pour debug
    console.log(`${importedMedia.length} médias chargés depuis le localStorage`);
    
    // Note: La validation réelle des fichiers nécessiterait de stocker
    // le chemin du fichier ou d'utiliser File System Access API
    // Pour l'instant, on fait confiance au localStorage
  },

  loadFromStorage: () => {
    try {
      // Vérifier la version pour forcer la migration si nécessaire
      const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      if (storedVersion !== CURRENT_VERSION) {
        console.log('Migration vers nouvelle version, nettoyage du cache...');
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
        set({ importedMedia: [] });
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedMedia: ImportedMedia[] = JSON.parse(stored);
        
        // Vérifier que les données ont la structure attendue
        const validParsedMedia = parsedMedia.filter(media =>
          media &&
          typeof media === 'object' &&
          media.id &&
          media.type &&
          media.name &&
          media.fileData // Vérifier que les données base64 existent
        );

        if (validParsedMedia.length !== parsedMedia.length) {
          console.warn(`${parsedMedia.length - validParsedMedia.length} médias corrompus ignorés`);
        }
        
        // Les données sauvegardées ne contiennent que les métadonnées
        // Elles servent uniquement à éviter les doublons
        // Les médias complets restent en mémoire pendant la session
        
        const metadata = validParsedMedia.map(media => ({
          name: media.name,
          size: media.size,
          lastModified: media.lastModified
        }));
        
        console.log(`${metadata.length} métadonnées de médias chargées (pour éviter les doublons)`);
        
        // Stocker les métadonnées pour éviter les doublons mais ne pas restaurer visuellement
        set({
          importedMedia: [], // Redémarrer avec une liste vide visuellement
          previousSessionMetadata: metadata // Garder les métadonnées pour les doublons
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médias depuis le storage:', error);
      // En cas d'erreur, nettoyer le storage corrompu
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_VERSION_KEY);
      set({ importedMedia: [] });
    }
  },

  saveToStorage: () => {
    const { importedMedia } = get();
    try {
      // Vérifier que nous avons des médias à sauvegarder
      if (importedMedia.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
        console.log('Sauvegarde: aucun média à sauvegarder');
        return;
      }

      // Sauvegarder seulement les métadonnées (pas les données base64 volumineuses)
      const dataToSave = importedMedia.map(media => ({
        id: media.id,
        type: media.type,
        name: media.name,
        size: media.size,
        lastModified: media.lastModified,
        // Ne pas sauvegarder fileData ni previewData (trop volumineux)
        // Ces données restent en mémoire pendant la session
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      console.log(`Sauvegarde réussie: ${dataToSave.length} médias sauvegardés`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des médias:', error);
      
      // Si le storage est plein, essayer de nettoyer les anciens médias
      if (error instanceof DOMException && error.code === 22) {
        console.warn('Storage plein, nettoyage des anciens médias...');
        // Garder seulement les 20 médias les plus récents pour économiser l'espace
        const recentMedia = importedMedia.slice(-20);
        set({ importedMedia: recentMedia });
        try {
          const dataToSave = recentMedia.map(media => ({
            id: media.id,
            type: media.type,
            name: media.name,
            size: media.size,
            lastModified: media.lastModified,
          }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
          console.log(`Sauvegarde après nettoyage: ${dataToSave.length} médias sauvegardés`);
        } catch (retryError) {
          console.error('Impossible de sauvegarder même après nettoyage:', retryError);
        }
      }
    }
  },

  initializeStore: async (): Promise<void> => {
    const { loadFromStorage, validateAndCleanMedia } = get();
    
    // Charger depuis le storage
    loadFromStorage();
    
    // Valider et nettoyer les médias
    await validateAndCleanMedia();
  },

  clearAllData: () => {
    console.log('Nettoyage forcé de toutes les données...');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
    set({
      importedMedia: [],
      previousSessionMetadata: []
    });
    console.log('Toutes les données ont été supprimées');
  }
}));

export default useImportedMediaStore;