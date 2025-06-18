import React, { useState, useEffect, useMemo } from "react";
import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Droppable } from "@/components/ui/droppable";
import { VIDEOS } from "../data/video";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO, ADD_AUDIO, ADD_IMAGE } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IVideo } from "@designcombo/types";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { PlusIcon } from "@radix-ui/react-icons";
import { Music, Image, Video, AudioLines } from "lucide-react";
import useImportedMediaStore from "../store/use-imported-media-store";
import { MediaType, ImportedMedia } from "../interfaces/editor";
import { Masonry } from "masonic";

type TabType = 'import' | 'video' | 'pexels';

interface MasonryMediaData extends ImportedMedia {
  _key: string;
}

interface MasonryVideoData extends Partial<IVideo> {
  _key: string;
}

export const Videos = () => {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  
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
            resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=');
          }
        }
      });
      
      video.addEventListener('error', (error) => {
        console.error(`❌ Erreur vidéo pour ${file.name}:`, error);
        cleanup();
        resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=');
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
              thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=';
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
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Intégration Pexels à venir
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                L'API Pexels sera intégrée prochainement
              </p>
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
          onDoubleClick={handleDoubleClick}
        >
          <div className="flex w-full items-center justify-center overflow-hidden bg-background relative">
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

  const style = React.useMemo(
    () => ({
      backgroundImage: `url(${data.preview})`,
      backgroundSize: "cover",
      width: "80px",
      height: "80px",
    }),
    [data.preview],
  );

  const handleDoubleClick = () => {
    dispatch(ADD_VIDEO, {
      payload: data,
      options: {
        resourceId: "main",
        scaleMode: "fit",
      },
    });
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
          onDoubleClick={handleDoubleClick}
          className="flex w-full items-center justify-center overflow-hidden bg-background relative"
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

