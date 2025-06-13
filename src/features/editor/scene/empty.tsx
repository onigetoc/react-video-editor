import useStore from "../store/use-store";
import { useEffect, useRef, useState } from "react";
import { Droppable } from "@/components/ui/droppable";
import { PlusIcon } from "lucide-react";
import { DroppableArea } from "./droppable";
import { dispatch } from "@designcombo/events";
import { ADD_AUDIO, ADD_IMAGE, ADD_VIDEO } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";

const SceneEmpty = () => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [desiredSize, setDesiredSize] = useState({ width: 0, height: 0 });
  const { size } = useStore();

  useEffect(() => {
    const container = containerRef.current!;
    const PADDING = 96;
    const containerHeight = container.clientHeight - PADDING;
    const containerWidth = container.clientWidth - PADDING;
    const { width, height } = size;

    const desiredZoom = Math.min(
      containerWidth / width,
      containerHeight / height,
    );
    setDesiredSize({
      width: width * desiredZoom,
      height: height * desiredZoom,
    });
    setIsLoading(false);
  }, [size]);

  const getFileType = (file: File): "image" | "video" | "audio" | null => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return null;
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.crossOrigin = 'anonymous';
      
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Aller à 1 seconde pour éviter le frame noir
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob);
            resolve(thumbnailUrl);
          } else {
            resolve(''); // Fallback si la génération échoue
          }
        }, 'image/jpeg', 0.8);
      };
      
      video.onerror = () => {
        resolve(''); // Fallback en cas d'erreur
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const onSelectFiles = async (files: File[]) => {
    console.log("Fichiers sélectionnés:", files);
    
    for (const file of files) {
      const fileType = getFileType(file);
      if (!fileType) {
        console.error("Type de fichier non supporté:", file.type);
        continue;
      }

      // Créer une URL blob locale - exactement comme les vidéos du serveur mais local
      const blobUrl = URL.createObjectURL(file);
      
      console.log("Création blob URL:", blobUrl, "pour fichier:", file.name);

      // Générer thumbnail pour les vidéos
      let previewUrl = undefined;
      if (fileType === "image") {
        previewUrl = blobUrl; // Pour les images, utiliser l'image elle-même
      } else if (fileType === "video") {
        console.log("Génération du thumbnail pour la vidéo...");
        previewUrl = await generateVideoThumbnail(file);
        console.log("Thumbnail généré:", previewUrl);
      }

      // Créer le payload avec la même structure que les vidéos du serveur
      const payload = {
        id: generateId(),
        details: {
          src: blobUrl, // URL blob au lieu d'URL serveur
        },
        type: fileType,
        preview: previewUrl, // Thumbnail généré pour les vidéos, image pour les images
        metadata: {
          previewUrl: previewUrl, // Ajouter le previewUrl dans metadata pour la compatibilité
          originalFile: file, // Stocker le fichier original pour éviter les problèmes de blob URL
        },
        duration: fileType === "video" || fileType === "audio" ? 0 : undefined,
      };

      console.log("Dispatching payload:", payload);
      console.log("Original file in metadata:", payload.metadata?.originalFile);
      console.log("Original file is File instance:", payload.metadata?.originalFile instanceof File);

      // Dispatcher comme les vidéos du serveur
      switch (fileType) {
        case "image":
          dispatch(ADD_IMAGE, { payload });
          break;
        case "video":
          dispatch(ADD_VIDEO, { payload });
          break;
        case "audio":
          dispatch(ADD_AUDIO, { payload });
          break;
      }
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onSelectFiles(files);
    }
    // Reset la valeur pour permettre de sélectionner le même fichier
    event.target.value = '';
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div ref={containerRef} className="absolute z-50 flex h-full w-full flex-1">
      {/* Input file caché pour le bouton + */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      {!isLoading ? (
        <Droppable
          maxFileCount={10}
          maxSize={500 * 1024 * 1024} // 500MB pour les vidéos
          disabled={false}
          onValueChange={onSelectFiles}
          accept={{
            "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
            "video/*": [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
            "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"]
          }}
          multiple={true}
          noClick={true}
          className="h-full w-full flex-1 bg-background"
        >
          <DroppableArea
            onDragStateChange={setIsDraggingOver}
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center border-2 border-dashed text-center transition-colors duration-200 ease-in-out border-gray-100/15 ${
              isDraggingOver ? "border-white bg-white/10" : "border-white/15"
            }`}
            style={{
              width: desiredSize.width,
              height: desiredSize.height,
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4 pb-12">
              <div
                className="hover:bg-primary-dark cursor-pointer rounded-md border bg-primary p-2 text-secondary transition-colors duration-200"
                onClick={handlePlusClick}
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-px">
                <p className="text-sm text-muted-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground/70">
                  Or drag and drop images, videos, or audio files here
                </p>
              </div>
            </div>
          </DroppableArea>
        </Droppable>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-background-subtle text-sm text-muted-foreground">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SceneEmpty;
