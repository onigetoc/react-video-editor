import React, { useState, useEffect, useMemo, useCallback } from "react";
import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Droppable } from "@/components/ui/droppable";
import { Input } from "@/components/ui/input";
import { VIDEOS } from "../data/video";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO, ADD_AUDIO, ADD_IMAGE, ADD_ITEMS } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IVideo } from "@designcombo/types";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Music, Image, Video, AudioLines } from "lucide-react";
import useImportedMediaStore from "../store/use-imported-media-store";
import { MediaType, ImportedMedia } from "../interfaces/editor";
import { Masonry } from "masonic";
import {
  usePexelsSearch,
  PexelsPhoto,
  PexelsVideo,
  PexelsMediaType,
  getFullHDUrl
} from "../hooks/usePexelsSearch";
import { useThumbnailSelectionStore } from "../store/use-thumbnail-selection-store";

type TabType = 'import' | 'video' | 'pexels';

interface MasonryMediaData extends ImportedMedia {
  _key: string;
}

interface MasonryVideoData extends Partial<IVideo> {
  _key: string;
}

import useStore from "../store/use-store";

const getPlayerFormat = (size: { width: number; height: number }) => {
  const ratio = size.width / size.height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.05) return '9:16';
  if (Math.abs(ratio - 1) < 0.05) return '1:1';
  // fallback
  return '16:9';
};



export const Videos = () => {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  
  // States pour la recherche Pexels
  const [pexelsQuery, setPexelsQuery] = useState('');
  const [pexelsMediaType, setPexelsMediaType] = useState<PexelsMediaType>('photos');
  const { data: pexelsData, loading: pexelsLoading, error: pexelsError, search: searchPexels, loadNextPage, hasMore } = usePexelsSearch();
  
  // Utiliser le store global pour les médias importés
  const {
    importedMedia,
    addImportedMedia,
    isMediaAlreadyImported,
    clearAllData
  } = useImportedMediaStore();

  // L'initialisation se fait maintenant au niveau global dans editor.tsx
  // Pas besoin d'initialiser ici

  // Exposer les fonctions de debug en mode développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as Window & { debugImportedMedia?: object }).debugImportedMedia = {
        clearCache: clearAllData,
        getImportedMedia: () => importedMedia,
        getStore: () => useImportedMediaStore.getState(),
        forceReload: () => {
          clearAllData();
          window.location.reload();
        },
        logStatus: () => {
          console.log('📊 STATUS DEBUG:');
          console.log('   - Médias dans le store:', importedMedia.length);
          console.log('   - Détail:', importedMedia.map(m => ({ name: m.name, id: m.id, type: m.type })));
          console.log('   - LocalStorage:', localStorage.getItem(useImportedMediaStore.getState().constructor.name || 'video-editor-imported-media'));
        }
      };
      console.log('🔧 Debug: window.debugImportedMedia disponible');
      console.log('   - clearCache() - Vider le cache');
      console.log('   - getImportedMedia() - Voir les médias');
      console.log('   - logStatus() - Voir le statut');
      console.log('   - forceReload() - Vider et recharger');
    }
  }, [clearAllData, importedMedia]);


  const getFileType = (file: File): MediaType | null => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('image/')) return 'image';
    return null;
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Timeout de 10 secondes pour éviter les blocages
      const timeout = setTimeout(() => {
        console.warn(`⏱️ Timeout génération thumbnail pour ${file.name}`);
        URL.revokeObjectURL(video.src);
        resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=');
      }, 10000);
      
      const cleanup = () => {
        clearTimeout(timeout);
        // Ne pas révoquer l'URL ici car elle peut être utilisée ailleurs
      };
      
      video.addEventListener('loadeddata', () => {
        console.log(`📹 Métadonnées vidéo chargées pour ${file.name}`);
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        video.currentTime = Math.min(1, video.duration * 0.1); // 10% de la durée ou 1 sec
      });
      
      video.addEventListener('seeked', () => {
        console.log(`🎬 Seek terminé pour ${file.name}`);
        if (ctx) {
          try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            cleanup();
            console.log(`✅ Thumbnail généré avec succès pour ${file.name}`);
            resolve(thumbnail);
          } catch (error) {
            console.error(`❌ Erreur lors de la génération thumbnail pour ${file.name}:`, error);
            cleanup();
            resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=');
          }
        }
      });
      
      video.addEventListener('error', (error) => {
        console.error(`❌ Erreur vidéo pour ${file.name}:`, error);
        cleanup();
        resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=');
      });
      
      const url = URL.createObjectURL(file);
      video.src = url;
      video.muted = true; // Important pour éviter les problèmes autoplay
      video.load();
      
      console.log(`🎥 Début génération thumbnail pour ${file.name}`);
    });
  };

  const generateAudioThumbnail = (): string => {
    // Use the same audio icon as in audios.tsx
    return 'https://cdn.designcombo.dev/thumbnails/music-preview.png';
  };


  const handleFileUpload = async (files: File[]) => {
    console.log(`🎬 DÉBUT UPLOAD: ${files.length} fichiers reçus`);
    
    const newMediaItems: ImportedMedia[] = [];
    let duplicateCount = 0;
    let processedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📁 Traitement fichier [${i + 1}/${files.length}]: ${file.name} (${file.size} bytes)`);
      
      const fileType = getFileType(file);
      if (!fileType) {
        console.warn(`⚠️ Type de fichier non supporté: ${file.name}`);
        continue;
      }

      console.log(`📋 Type détecté: ${fileType} pour ${file.name}`);

      // Vérifier les doublons avant de traiter le fichier
      if (isMediaAlreadyImported(file)) {
        console.log(`🔄 Doublon ignoré: ${file.name}`);
        duplicateCount++;
        continue;
      }

      const url = URL.createObjectURL(file);
      console.log(`🔗 URL blob créée: ${url.substring(0, 50)}... pour ${file.name}`);
      
      let thumbnail: string;

      try {
        console.log(`🖼️ Génération thumbnail pour ${file.name}...`);
        
        // Generate appropriate thumbnail based on file type
        switch (fileType) {
          case 'video':
            try {
              thumbnail = await generateVideoThumbnail(file);
              console.log(`✅ Thumbnail vidéo généré pour ${file.name}`);
            } catch (error) {
              console.warn(`⚠️ Erreur thumbnail vidéo pour ${file.name}:`, error);
              thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=';
            }
            break;
          case 'audio':
            thumbnail = generateAudioThumbnail();
            console.log(`✅ Thumbnail audio généré pour ${file.name}`);
            break;
          case 'image':
            thumbnail = url; // Utiliser l'URL blob directement
            console.log(`✅ Thumbnail image (URL blob) pour ${file.name}`);
            break;
          default:
            thumbnail = '';
        }
        
        const newMedia: ImportedMedia = {
          id: generateId(),
          type: fileType,
          details: { src: url },
          preview: thumbnail,
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          // Ne plus stocker fileData ni previewData - trop lourd pour la mémoire
          metadata: {
            previewUrl: thumbnail,
            originalFile: file,
          },
        };
        
        console.log(`✅ Média créé avec ID: ${newMedia.id} pour ${file.name}`);
        newMediaItems.push(newMedia);
        processedCount++;
        
      } catch (error) {
        console.error(`❌ Erreur lors du traitement du fichier ${file.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`📊 RÉSUMÉ TRAITEMENT:`);
    console.log(`   - Fichiers reçus: ${files.length}`);
    console.log(`   - Traités avec succès: ${processedCount}`);
    console.log(`   - Doublons ignorés: ${duplicateCount}`);
    console.log(`   - Erreurs: ${errorCount}`);
    console.log(`   - Médias prêts à ajouter: ${newMediaItems.length}`);
    
    // Ajouter les médias uniques au store
    console.log(`🏪 Envoi vers le store de ${newMediaItems.length} médias...`);
    const addedMedia = addImportedMedia(newMediaItems);
    console.log(`📥 Store a confirmé l'ajout de ${addedMedia.length} médias`);
    
    // Afficher un message si des doublons ont été détectés
    if (duplicateCount > 0) {
      console.info(`${duplicateCount} média(s) déjà importé(s) (ignoré(s))`);
    }
    
    if (addedMedia.length > 0) {
      console.info(`${addedMedia.length} nouveau(x) média(s) importé(s)`);
    }
    
    console.log(`🎬 FIN UPLOAD`);
  };
// Fonctions pour la recherche Pexels
  const handlePexelsSearch = useCallback(async () => {
    if (pexelsQuery.trim()) {
      await searchPexels({
        query: pexelsQuery.trim(),
        type: pexelsMediaType,
        perPage: 20
      });
    }
  }, [pexelsQuery, pexelsMediaType, searchPexels]);

  const handlePexelsQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPexelsQuery(e.target.value);
  };

  const handlePexelsTypeChange = (type: PexelsMediaType) => {
    setPexelsMediaType(type);
    // Relancer automatiquement la recherche si il y a déjà un terme
    if (pexelsQuery.trim()) {
      searchPexels({
        query: pexelsQuery.trim(),
        type: type,
        perPage: 20
      });
    }
  };

  // Effet pour rechercher quand on appuie sur Entrée
  const handlePexelsKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePexelsSearch();
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'import':
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-4">
              <Droppable
                onValueChange={handleFileUpload}
                accept={{
                  "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv", ".m4v"],
                  "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"],
                  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
                }}
                maxSize={1024 * 1024 * 500} // 500MB max for videos
                maxFileCount={100} // Augmenté de 20 à 100 fichiers
                multiple={true}
                noClick={false}
                className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center hover:border-zinc-400 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <PlusIcon className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      Add Media
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Videos, Audio, Images
                  </p>
                </div>
              </Droppable>
            </div>
            
            {importedMedia.length > 0 && (
              <div className="px-4 pb-4 mt-4">
                <Masonry
                  key={`masonry-imported-${importedMedia.length}`}
                  items={importedMedia.map((media, index) => ({
                    ...media,
                    id: media.id || `media-${index}-${Date.now()}`,
                    _key: media.id || `media-${index}-${Date.now()}`
                  }))}
                  columnWidth={120}
                  columnGutter={8}
                  rowGutter={8}
                  render={MasonryMediaItem}
                  overscanBy={20} // Augmenté pour afficher plus d'éléments hors écran
                  itemKey={(data: MasonryMediaData) => data?._key || 'fallback-key'}
                />
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="px-4 pb-4">
            <Masonry
              key={`masonry-videos-${VIDEOS.length}`}
              items={VIDEOS.map((video, index) => ({
                ...video,
                id: video.id || `video-${index}-${Date.now()}`,
                _key: video.id || `video-${index}-${Date.now()}`
              }))}
              columnWidth={120}
              columnGutter={8}
              rowGutter={8}
              render={MasonryVideoItem}
              overscanBy={2}
              itemKey={(data: MasonryVideoData) => data?._key || 'fallback-key'}
            />
          </div>
        );
      
      case 'pexels':
        return (
          <div className="flex flex-col h-full">
            {/* Interface de recherche */}
            <div className="px-4 pt-4 pb-3 border-b border-border">
              {/* Input de recherche */}
              <div className="relative mb-3">
                <Input
                  type="text"
                  placeholder="Media search on Pexels..."
                  value={pexelsQuery}
                  onChange={handlePexelsQueryChange}
                  onKeyPress={handlePexelsKeyPress}
                  className="w-full pr-10"
                />
                <button
                  onClick={handlePexelsSearch}
                  disabled={!pexelsQuery.trim() || pexelsLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MagnifyingGlassIcon className="size-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Boutons Image/Video */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePexelsTypeChange('photos')}
                  className={`${
                    pexelsMediaType === 'photos'
                      ? 'font-bold text-white'
                      : 'font-normal text-text-primary'
                  } hover:text-foreground transition-colors`}
                >
                  Images
                </button>
                <span className="text-border">|</span>
                <button
                  onClick={() => handlePexelsTypeChange('videos')}
                  className={`${
                    pexelsMediaType === 'videos'
                      ? 'font-bold text-white'
                      : 'font-normal text-text-primary'
                  } hover:text-foreground transition-colors`}
                >
                  Videos
                </button>
              </div>
            </div>

            {/* Contenu des résultats */}
            <div className="flex-1">
              {pexelsLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Recherche en cours...
                    </p>
                  </div>
                </div>
              )}

              {pexelsError && (
                <div className="flex items-center justify-center h-full px-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-500 mb-1">
                      Erreur de recherche
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pexelsError}
                    </p>
                  </div>
                </div>
              )}

              {!pexelsLoading && !pexelsError && !pexelsData && !pexelsQuery && (
                <div className="flex items-center justify-center h-full px-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Search {pexelsMediaType === 'photos' ? 'images' : 'videos'} on Pexels
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a search term above
                    </p>
                  </div>
                </div>
              )}

              {!pexelsLoading && !pexelsError && pexelsData && (
                <div className="px-4 pb-4">
                  <Masonry
                    key={`masonry-pexels-${pexelsMediaType}-${pexelsData.total_results}`}
                    items={(() => {
                      const items = pexelsMediaType === 'photos' ? pexelsData.photos || [] : pexelsData.videos || [];
                      return items.map((item, index) => ({
                        ...item,
                        _key: `pexels-${pexelsMediaType}-${item.id}-${index}`
                      }));
                    })()}
                    columnWidth={120}
                    columnGutter={8}
                    rowGutter={8}
                    render={MasonryPexelsItem}
                    overscanBy={2}
                    itemKey={(data) => data._key}
                  />
                  {hasMore && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={loadNextPage}
                        disabled={pexelsLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pexelsLoading ? 'Chargement...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!pexelsLoading && !pexelsError && pexelsData &&
                ((pexelsMediaType === 'photos' && (!pexelsData.photos || pexelsData.photos.length === 0)) ||
                 (pexelsMediaType === 'videos' && (!pexelsData.videos || pexelsData.videos.length === 0))) && (
                <div className="flex items-center justify-center h-full px-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Aucun résultat trouvé
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Essayez un autre terme de recherche
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Navigation Tabs */}
      <div className="flex h-12 flex-none items-center px-4 text-sm border-b border-border">
        <button
          onClick={() => setActiveTab('import')}
          className={`${activeTab === 'import' ? 'font-bold' : 'font-normal'} text-text-primary hover:text-foreground transition-colors`}
        >
          Import
        </button>
        <span className="mx-3 text-border">|</span>
        <button
          onClick={() => setActiveTab('video')}
          className={`${activeTab === 'video' ? 'font-bold' : 'font-normal'} text-text-primary hover:text-foreground transition-colors`}
        >
          Video
        </button>
        <span className="mx-3 text-border">|</span>
        <button
          onClick={() => setActiveTab('pexels')}
          className={`${activeTab === 'pexels' ? 'font-bold' : 'font-normal'} text-text-primary hover:text-foreground transition-colors`}
        >
          Pexels
        </button>
      </div>

      {/* Tab Content */}
      <ScrollArea className="flex-1">
        {renderTabContent()}
      </ScrollArea>
    </div>
  );
};


// Composant pour Masonic - avec nom de fichier affiché
const MasonryMediaItem = ({ data, width }: { data: ImportedMedia; width: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const { isSelected, setSelectedItem, setSelectedItemOnAdd } = useThumbnailSelectionStore();

  const isCurrentlySelected = isSelected(data.id, data.type);

  const style = useMemo(
    () => ({
      backgroundImage: data.type !== 'audio' ? `url(${data.preview})` : undefined,
      backgroundColor: data.type === 'audio' ? '#27272a' : undefined,
      backgroundSize: "cover",
      width: "80px",
      height: "80px",
    }),
    [data.preview, data.type],
  );

  const handleClick = () => {
    setSelectedItem({ id: data.id, type: data.type });
  };

  const handleDoubleClick = () => {
    switch (data.type) {
      case 'video':
        dispatch(ADD_VIDEO, {
          payload: data,
          options: {
            resourceId: "main",
            scaleMode: "fit",
          },
        });
        break;
      case 'audio':
        dispatch(ADD_AUDIO, {
          payload: data,
          options: {},
        });
        break;
      case 'image':
        dispatch(ADD_IMAGE, {
          payload: data,
          options: {
            scaleMode: "fit",
          },
        });
        break;
    }
    // Sélectionner cette miniature quand elle est ajoutée à la timeline
    setSelectedItemOnAdd(data.id, data.type);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Utiliser le store global directement
    const { removeImportedMedia } = useImportedMediaStore.getState();
    if (data.id) {
      removeImportedMedia(data.id);
    }
  };

  const renderThumbnail = () => {
    if (data.type === 'audio') {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-zinc-800 aspect-square">
          <Music size={24} className="text-white" />
        </div>
      );
    }
    
    return (
      <img
        draggable={false}
        src={data.preview}
        className="h-full w-full rounded-md object-cover cursor-pointer"
        alt={`${data.type} thumbnail`}
      />
    );
  };

  const getMediaIcon = () => {
    switch (data.type) {
      case 'video':
        return <Video size={16} className="text-white" />;
      case 'audio':
        return <AudioLines size={16} className="text-white" />;
      case 'image':
        return <Image size={16} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width }} className="masonic-media-item">
      <Draggable
        data={{
          ...data,
          metadata: {
            previewUrl: data.preview,
            ...data.metadata,
          },
        }}
        renderCustomPreview={<div style={style} className="draggable" />}
        shouldDisplayPreview={!isDraggingOverTimeline}
      >
        <div
          className="media-item-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <div className={`thumbnail-container flex w-full items-center justify-center overflow-hidden bg-background relative ${
            isCurrentlySelected ? 'thumbnail-selected' : ''
          }`}>
            {renderThumbnail()}
            
            {/* Icône de type de média */}
            <div className="absolute bottom-1 right-0 mr-1.5 mb-2.5 bg-blue-600/70 rounded p-1 flex items-center justify-center">
              {getMediaIcon()}
            </div>
          </div>
          
          {/* Bouton X flottant */}
          <button
            className="media-remove-button"
            onClick={handleRemoveClick}
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            ✕
          </button>
        </div>
      </Draggable>
      
      {/* Nom du fichier avec ellipsis */}
      <div className="masonic-media-name" title={data.name}>
        {data.name}
      </div>
    </div>
  );
};

// Composant pour Masonic - Vidéos par défaut avec nom de fichier affiché
const MasonryVideoItem = ({ data, width }: { data: Partial<IVideo>; width: number }) => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const { isSelected, setSelectedItem, setSelectedItemOnAdd } = useThumbnailSelectionStore();

  const videoId = data.id || `video-${Date.now()}`;
  const isCurrentlySelected = isSelected(videoId, 'video');

  const style = React.useMemo(
    () => ({
      backgroundImage: `url(${data.preview})`,
      backgroundSize: "cover",
      width: "80px",
      height: "80px",
    }),
    [data.preview],
  );

  const handleClick = () => {
    setSelectedItem({ id: videoId, type: 'video' });
  };

  const handleDoubleClick = () => {
    dispatch(ADD_VIDEO, {
      payload: data,
      options: {
        resourceId: "main",
        scaleMode: "fit",
      },
    });
    // Sélectionner cette miniature quand elle est ajoutée à la timeline
    setSelectedItemOnAdd(videoId, 'video');
  };

  // Extraire le nom du fichier depuis l'URL ou utiliser un nom par défaut
  const getVideoName = () => {
    if (data.preview) {
      const urlParts = data.preview.split('/');
      const filename = urlParts[urlParts.length - 1];
      // Supprimer l'extension et nettoyer le nom
      return filename.split('.')[0].replace(/[-_]/g, ' ') || 'Video';
    }
    return 'Video';
  };

  return (
    <div style={{ width }} className="masonic-media-item">
      <Draggable
        data={{
          ...data,
          metadata: {
            previewUrl: data.preview,
          },
        }}
        renderCustomPreview={<div style={style} className="draggable" />}
        shouldDisplayPreview={!isDraggingOverTimeline}
      >
        <div
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`thumbnail-container flex w-full items-center justify-center overflow-hidden bg-background relative ${
            isCurrentlySelected ? 'thumbnail-selected' : ''
          }`}
        >
          <img
            draggable={false}
            src={data.preview}
            className="h-full w-full rounded-md object-cover cursor-pointer"
            alt="video"
          />
        </div>
      </Draggable>
      
      {/* Nom de la vidéo avec ellipsis */}
      <div className="masonic-media-name" title={getVideoName()}>
        {getVideoName()}
      </div>
    </div>
  );
};


// Composant pour Masonic - Éléments Pexels
const MasonryPexelsItem = ({ data, width }: { data: (PexelsPhoto | PexelsVideo) & { _key: string }; width: number }) => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const { isSelected, setSelectedItem, setSelectedItemOnAdd } = useThumbnailSelectionStore();

  // Déterminer si c'est une photo ou vidéo
  const isPhoto = 'photographer' in data;
  const isVideo = 'user' in data;

  // ID unique pour le contenu Pexels
  const pexelsId = `pexels-${data.id}`;
  const pexelsType = isPhoto ? 'image' : 'video';
  const isCurrentlySelected = isSelected(pexelsId, pexelsType);

  // Générer l'URL du thumbnail en utilisant les URLs Pexels valides
  // Déterminer dynamiquement le format du player à chaque rendu
  const size = useStore().size;
  const playerFormat = getPlayerFormat(size);

  const thumbnailUrl = useMemo(() => {
    if (isPhoto) {
      if (playerFormat === '16:9') return (data as PexelsPhoto).src.landscape || (data as PexelsPhoto).src.small;
      if (playerFormat === '9:16') return (data as PexelsPhoto).src.portrait || (data as PexelsPhoto).src.small;
      if (playerFormat === '1:1') {
        const base = (data as PexelsPhoto).src.original || (data as PexelsPhoto).src.small;
        return base.includes('?')
          ? `${base}&fit=crop&w=130&h=130`
          : `${base}?fit=crop&w=130&h=130`;
      }
      return (data as PexelsPhoto).src.small;
    } else if (isVideo) {
      const base = data.image;
      if (playerFormat === '16:9') {
        return base.includes('?')
          ? `${base}&fit=crop&w=130&h=74`
          : `${base}?fit=crop&w=130&h=74`;
      }
      if (playerFormat === '9:16') {
        return base.includes('?')
          ? `${base}&fit=crop&w=74&h=130`
          : `${base}?fit=crop&w=74&h=130`;
      }
      if (playerFormat === '1:1') {
        return base.includes('?')
          ? `${base}&fit=crop&w=130&h=130`
          : `${base}?fit=crop&w=130&h=130`;
      }
      return base;
    }
    return '';
  }, [data, isPhoto, isVideo, playerFormat]);

  // URL complète HD pour le lecteur vidéo
  // Générer l'URL full HD vidéo adaptée au format du player
  // Utiliser le playerFormat déjà défini plus haut
  const fullHDUrl = useMemo(() => {
    if (isPhoto) {
      return getFullHDUrl(data, playerFormat as '16:9' | '9:16');
    }
    if (isVideo) {
      const base = (data as PexelsVideo).image;
      if (playerFormat === '16:9') {
        return base.includes('?')
          ? `${base}&fit=crop&w=1200&h=630`
          : `${base}?fit=crop&w=1200&h=630`;
      }
      if (playerFormat === '9:16') {
        return base.includes('?')
          ? `${base}&fit=crop&w=630&h=1200`
          : `${base}?fit=crop&w=630&h=1200`;
      }
      if (playerFormat === '1:1') {
        return base.includes('?')
          ? `${base}&fit=crop&w=1080&h=1080`
          : `${base}?fit=crop&w=1080&h=1080`;
      }
      return base;
    }
    return '';
  }, [data, playerFormat, isPhoto, isVideo]);

  // Nom à afficher (selon vos spécifications)
  const displayName = useMemo(() => {
    if (isPhoto) {
      return data.alt || `Photo by ${data.photographer}`;
    } else if (isVideo) {
      return `By: ${data.user.name}`;
    }
    return 'Média Pexels';
  }, [data, isPhoto, isVideo]);

  const style = useMemo(
    () => ({
      backgroundImage: `url(${thumbnailUrl})`,
      backgroundSize: "cover",
      width: "80px",
      height: "80px",
    }),
    [thumbnailUrl],
  );

  const handleClick = () => {
    setSelectedItem({ id: pexelsId, type: pexelsType });
  };

  const handleDoubleClick = () => {
    if (isPhoto) {
      // Ajouter l'image à la timeline (utiliser ADD_ITEMS comme dans images.tsx)
      const id = generateId();
      dispatch(ADD_ITEMS, {
        payload: {
          trackItems:
          [
            {
              id,
              type: "image",
              display: {
                from: 0,
                to: 5000,
              },
              details: {
                src: fullHDUrl,
              },
              metadata: {
                photographer: data.photographer,
                photographer_url: data.photographer_url,
                pexels_url: data.url,
                source: 'pexels'
              },
            },
          ],
        },
      });
    } else if (isVideo) {
      // Ajouter la vidéo à la timeline
      // Trouver le meilleur fichier vidéo (HD ou meilleure qualité disponible)
      const videoFile = data.video_files.find(file => file.quality === 'hd') || data.video_files[0];
      
      dispatch(ADD_VIDEO, {
        payload: {
          id: data.id.toString(),
          details: {
            src: videoFile?.link || data.image
          },
          preview: data.image,
          metadata: {
            user: data.user.name,
            user_url: data.user.url,
            pexels_url: data.url,
            duration: data.duration,
            source: 'pexels'
          }
        },
        options: {
          resourceId: "main",
          scaleMode: "fit",
        },
      });
    }
    // Sélectionner cette miniature quand elle est ajoutée à la timeline
    setSelectedItemOnAdd(pexelsId, pexelsType);
  };

  // Données pour le drag & drop (format simplifié pour éviter les erreurs de sérialisation)
  const dragData = useMemo(() => {
    if (isPhoto) {
      return {
        id: data.id.toString(),
        type: 'image',
        details: { src: fullHDUrl },
        preview: thumbnailUrl,
        name: displayName,
        metadata: {
          photographer: data.photographer || '',
          photographer_url: data.photographer_url || '',
          pexels_url: data.url || '',
          source: 'pexels',
          previewUrl: thumbnailUrl,
        }
      };
    } else if (isVideo) {
      const videoFile = data.video_files?.find(file => file.quality === 'hd') || data.video_files?.[0];
      return {
        id: data.id.toString(),
        type: 'video',
        details: { src: videoFile?.link || data.image },
        preview: data.image,
        name: displayName,
        metadata: {
          user: data.user?.name || '',
          user_url: data.user?.url || '',
          pexels_url: data.url || '',
          duration: data.duration || 0,
          source: 'pexels',
          previewUrl: data.image,
        }
      };
    }
    // Ce cas ne devrait jamais se produire car on vérifie isPhoto ou isVideo
    return null;
  }, [data, isPhoto, isVideo, fullHDUrl, thumbnailUrl, displayName]);

  return (
    <div style={{ width }} className="masonic-media-item">
      <Draggable
        data={dragData || undefined}
        renderCustomPreview={<div style={style} className="draggable" />}
        shouldDisplayPreview={!isDraggingOverTimeline}
      >
        <div
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`thumbnail-container flex w-full items-center justify-center overflow-hidden bg-background relative ${
            isCurrentlySelected ? 'thumbnail-selected' : ''
          }`}
        >
          <img
            draggable={false}
            src={thumbnailUrl}
            className="rounded-md cursor-pointer"
            style={{ width: 130, height: 'auto', maxHeight: 260 }}
            alt={displayName}
          />
          
          {/* Icône de type de média */}
          <div className="absolute bottom-1 right-0 mr-1.5 mb-2.5 bg-blue-600/70 rounded p-1 flex items-center justify-center">
            {isPhoto ? (
              <Image size={16} className="text-white" />
            ) : (
              <Video size={16} className="text-white" />
            )}
          </div>
        </div>
      </Draggable>
      
      {/* Nom du média avec ellipsis */}
      <div className="masonic-media-name" title={displayName}>
        {displayName}
      </div>
    </div>
  );
};
