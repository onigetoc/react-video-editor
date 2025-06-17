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
        forceReload: () => {
          clearAllData();
          window.location.reload();
        }
      };
      console.log('🔧 Debug: window.debugImportedMedia disponible pour le debug');
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
      
      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // Seek to 1 second to get a good frame
      });
      
      video.addEventListener('seeked', () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
          resolve(thumbnail);
        }
      });
      
      video.addEventListener('error', () => {
        // Fallback to a default video icon or placeholder
        resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzI3MjcyNyIvPgo8cGF0aCBkPSJNMzIgMjhMMzIgNTJMNTIgNDBMMzIgMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=');
      });
      
      video.src = URL.createObjectURL(file);
      video.load();
    });
  };

  const generateAudioThumbnail = (): string => {
    // Use the same audio icon as in audios.tsx
    return 'https://cdn.designcombo.dev/thumbnails/music-preview.png';
  };

  // Fonction helper pour convertir un fichier en base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (files: File[]) => {
    const newMediaItems: ImportedMedia[] = [];
    let duplicateCount = 0;
    
    for (const file of files) {
      const fileType = getFileType(file);
      if (!fileType) continue;

      // Vérifier les doublons avant de traiter le fichier
      if (isMediaAlreadyImported(file)) {
        duplicateCount++;
        continue;
      }

      const url = URL.createObjectURL(file);
      let thumbnail: string;
      let fileData: string;
      let previewData: string;

      try {
        // Convertir le fichier en base64 pour la persistance
        fileData = await fileToBase64(file);

        // Generate appropriate thumbnail based on file type
        switch (fileType) {
          case 'video':
            thumbnail = await generateVideoThumbnail(file);
            previewData = thumbnail; // Le thumbnail est déjà en base64
            break;
          case 'audio':
            thumbnail = generateAudioThumbnail();
            previewData = thumbnail; // URL statique
            break;
          case 'image':
            thumbnail = url; // Pour l'affichage immédiat
            previewData = fileData; // Utiliser les données du fichier pour la persistance
            break;
          default:
            thumbnail = '';
            previewData = '';
        }
        
        const newMedia: ImportedMedia = {
          id: generateId(),
          type: fileType,
          details: { src: url },
          preview: thumbnail,
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          fileData, // Données base64 pour la persistance
          previewData, // Thumbnail base64 pour la persistance
          metadata: {
            previewUrl: thumbnail,
            originalFile: file,
          },
        };
        
        newMediaItems.push(newMedia);
      } catch (error) {
        console.error(`Erreur lors du traitement du fichier ${file.name}:`, error);
      }
    }
    
    // Ajouter les médias uniques au store
    const addedMedia = addImportedMedia(newMediaItems);
    
    // Afficher un message si des doublons ont été détectés
    if (duplicateCount > 0) {
      console.info(`${duplicateCount} média(s) déjà importé(s) (ignoré(s))`);
      // Vous pouvez ajouter ici une notification toast si disponible
    }
    
    if (addedMedia.length > 0) {
      console.info(`${addedMedia.length} nouveau(x) média(s) importé(s)`);
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
                maxFileCount={20}
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
                  items={importedMedia.map((media, index) => ({
                    ...media,
                    id: media.id || `media-${index}`,
                    _key: `media-${index}-${media.id || index}`
                  }))}
                  columnWidth={120}
                  columnGutter={8}
                  rowGutter={8}
                  render={MasonryMediaItem}
                  overscanBy={2}
                  itemKey={(data: MasonryMediaData) => data._key}
                />
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="px-4 pb-4">
            <Masonry
              items={VIDEOS.map((video, index) => ({
                ...video,
                id: video.id || `video-${index}`,
                _key: `video-${index}-${video.id || index}`
              }))}
              columnWidth={120}
              columnGutter={8}
              rowGutter={8}
              render={MasonryVideoItem}
              overscanBy={2}
              itemKey={(data: MasonryVideoData) => data._key}
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

