import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Droppable } from "@/components/ui/droppable";
import { VIDEOS } from "../data/video";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO, ADD_AUDIO, ADD_IMAGE } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IVideo } from "@designcombo/types";
import React, { useState, useEffect } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Music, Image, Video, AudioLines } from "lucide-react";
import useImportedMediaStore from "../store/use-imported-media-store";
import { MediaType, ImportedMedia } from "../interfaces/editor";

type TabType = 'import' | 'video' | 'pexels';

export const Videos = () => {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  
  // Utiliser le store global pour les médias importés
  const {
    importedMedia,
    addImportedMedia,
    removeImportedMedia,
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

  const handleAddMedia = (payload: ImportedMedia) => {
    switch (payload.type) {
      case 'video':
        dispatch(ADD_VIDEO, {
          payload,
          options: {
            resourceId: "main",
            scaleMode: "fit",
          },
        });
        break;
      case 'audio':
        dispatch(ADD_AUDIO, {
          payload,
          options: {},
        });
        break;
      case 'image':
        dispatch(ADD_IMAGE, {
          payload,
          options: {
            scaleMode: "fit",
          },
        });
        break;
    }
  };

  const handleAddVideo = (payload: Partial<IVideo>) => {
    dispatch(ADD_VIDEO, {
      payload,
      options: {
        resourceId: "main",
        scaleMode: "fit",
      },
    });
  };

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
    const duplicateFiles: string[] = [];
    
    for (const file of files) {
      const fileType = getFileType(file);
      if (!fileType) continue;

      // Vérifier les doublons avant de traiter le fichier
      if (isMediaAlreadyImported(file)) {
        duplicateFiles.push(file.name);
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
    if (duplicateFiles.length > 0) {
      console.info(`Médias déjà importés (ignorés): ${duplicateFiles.join(', ')}`);
      // Vous pouvez ajouter ici une notification toast si disponible
    }
    
    if (addedMedia.length > 0) {
      console.info(`${addedMedia.length} nouveau(x) média(s) importé(s)`);
    }
  };

  const handleRemoveImportedMedia = (mediaId: string) => {
    removeImportedMedia(mediaId);
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
              <div className="media-grid px-4 pb-4 mt-4">
                {importedMedia.map((media, index) => (
                  <MediaItem
                    key={index}
                    media={media}
                    shouldDisplayPreview={!isDraggingOverTimeline}
                    handleAddMedia={handleAddMedia}
                    onRemove={handleRemoveImportedMedia}
                    isImported={true}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="media-grid px-4 pb-4">
            {VIDEOS.map((video, index) => (
              <VideoItemDefault
                key={index}
                video={video}
                shouldDisplayPreview={!isDraggingOverTimeline}
                handleAddImage={handleAddVideo}
              />
            ))}
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

// Composant pour les médias importés (avec bouton X)
const MediaItem = ({
  handleAddMedia,
  media,
  shouldDisplayPreview,
  onRemove,
  isImported,
}: {
  handleAddMedia: (payload: ImportedMedia) => void;
  media: ImportedMedia;
  shouldDisplayPreview: boolean;
  onRemove: (mediaId: string) => void;
  isImported: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const style = React.useMemo(
    () => ({
      backgroundImage: media.type !== 'audio' ? `url(${media.preview})` : undefined,
      backgroundColor: media.type === 'audio' ? '#27272a' : undefined,
      backgroundSize: "cover",
      width: "80px",
      height: "80px",
    }),
    [media.preview, media.type],
  );

  const handleDoubleClick = () => {
    handleAddMedia(media);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isImported && media.id) {
      onRemove(media.id);
    }
  };

  const renderThumbnail = () => {
    if (media.type === 'audio') {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-zinc-800 aspect-square">
          <Music size={24} className="text-white" />
        </div>
      );
    }
    
    return (
      <img
        draggable={false}
        src={media.preview}
        className="h-full w-full rounded-md object-cover cursor-pointer"
        alt={`${media.type} thumbnail`}
      />
    );
  };

  const getMediaIcon = () => {
    switch (media.type) {
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
    <Draggable
      data={{
        ...media,
        metadata: {
          previewUrl: media.preview,
          ...media.metadata,
        },
      }}
      renderCustomPreview={<div style={style} className="draggable" />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div
        className="media-item-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex w-full items-center justify-center overflow-hidden bg-background pb-2 relative">
          {renderThumbnail()}
          
          {/* Icône de type de média */}
          <div className="absolute bottom-1 right-0 mr-1.5 mb-2.5 bg-blue-600/70 rounded p-1 flex items-center justify-center">
            {getMediaIcon()}
          </div>
        </div>
        
        {/* Bouton X flottant - seulement pour les médias importés */}
        <button
          className="media-remove-button"
          onClick={handleRemoveClick}
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <Cross2Icon width={12} height={12} />
        </button>
      </div>
    </Draggable>
  );
};

// Composant pour les vidéos par défaut (sans bouton X)
const VideoItemDefault = ({
  handleAddImage,
  video,
  shouldDisplayPreview,
}: {
  handleAddImage: (payload: Partial<IVideo>) => void;
  video: Partial<IVideo>;
  shouldDisplayPreview: boolean;
}) => {
  const style = React.useMemo(
    () => ({
      backgroundImage: `url(${video.preview})`,
      backgroundSize: "cover",
      width: "80px",
      height: "80px",
    }),
    [video.preview],
  );

  return (
    <Draggable
      data={{
        ...video,
        metadata: {
          previewUrl: video.preview,
        },
      }}
      renderCustomPreview={<div style={style} className="draggable" />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div
        onDoubleClick={() =>
          handleAddImage({
            id: generateId(),
            details: {
              src: video.details!.src,
            },
            metadata: {
              previewUrl: video.preview,
            },
          } as Partial<IVideo>)
        }
        className="flex w-full items-center justify-center overflow-hidden bg-background pb-2"
      >
        <img
          draggable={false}
          src={video.preview}
          className="h-full w-full rounded-md object-cover cursor-pointer"
          alt="video"
        />
      </div>
    </Draggable>
  );
};
