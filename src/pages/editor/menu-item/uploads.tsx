import { ScrollArea } from "@/components/ui/scroll-area";
import { createUploadsDetails } from "@/utils/upload";
import { useState } from "react";
import { dispatch } from "@designcombo/events";
import { Plus } from "lucide-react";
import Draggable from "@/components/shared/draggable";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { generateId } from "@designcombo/timeline";
import { ADD_VIDEO } from "@designcombo/state";
import { IVideo, IVideoDetails } from "@designcombo/types";
import { cn } from "@/lib/utils";

interface UploadedMedia {
  id: string;
  details: {
    src: string;
  };
  type: string;
  preview: string;
  duration?: number;
}

interface DraggableMedia extends UploadedMedia {
  metadata: {
    previewUrl: string;
  };
}

const defaultVideoDetails: IVideoDetails = {
  src: "",
  width: 1920,
  height: 1080,
  blur: 0,
  brightness: 100,
  volume: 100,
  flipX: false,
  flipY: false,
  rotate: "0deg",
  visibility: "visible",
};

export const Uploads = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingOverTimeline = useIsDraggingOverTimeline();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await handleUpload(Array.from(files));
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      await handleUpload(Array.from(files));
    }
  };

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL("image/png");
        URL.revokeObjectURL(video.src);
        resolve(thumbnail);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Erreur lors de la génération de la miniature"));
      };
    });
  };

  const getVideoDuration = async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration * 1000);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Erreur lors de la lecture de la durée"));
      };
    });
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        const uploadDetails = await createUploadsDetails(file.name, file);
        const fileType = file.type.split("/")[0];
        
        let preview = "";
        let duration = 0;
        if (fileType === "video") {
          preview = await generateThumbnail(file);
          duration = await getVideoDuration(file);
        }

        if (!uploadDetails.uploadUrl.startsWith("data:")) {
          await fetch(uploadDetails.uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });
        }

        const newMedia: UploadedMedia = {
          id: uploadDetails.id,
          details: {
            src: uploadDetails.url,
          },
          type: fileType,
          preview: preview || uploadDetails.url,
          ...(duration && { duration }),
        };

        setUploads(prev => [...prev, newMedia]);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToTimeline = (media: UploadedMedia) => {
    const videoPayload: Partial<IVideo> = {
      id: generateId(),
      details: {
        ...defaultVideoDetails,
        src: media.details.src,
      },
      metadata: {
        previewUrl: media.preview,
      },
      ...(media.duration && { duration: media.duration }),
    };

    dispatch(ADD_VIDEO, {
      payload: videoPayload,
      options: {
        resourceId: "main",
        scaleMode: "fit",
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Your media
      </div>
      <div className="px-4 pb-4">
        <div 
          className={cn(
            "relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:bg-muted/25",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*"
            multiple
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isDragging ? "Drop files here" : "Drop files here or click to upload"}
            </span>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="masonry-sm px-4">
          {uploads.map((upload) => {
            const style = {
              backgroundImage: `url(${upload.preview})`,
              backgroundSize: "cover",
              width: "80px",
              height: "80px",
            };

            const draggableData: DraggableMedia = {
              ...upload,
              metadata: {
                previewUrl: upload.preview,
              },
            };

            return (
              <Draggable
                key={upload.id}
                data={draggableData}
                renderCustomPreview={<div style={style} className="draggable rounded-lg" />}
                shouldDisplayPreview={!isDraggingOverTimeline}
              >
                <div
                  onClick={() => handleAddToTimeline(upload)}
                  className="flex w-full items-center justify-center overflow-hidden bg-background pb-2 cursor-pointer group break-inside-avoid mb-2"
                >
                  <img
                    draggable={false}
                    src={upload.preview}
                    className="max-w-full rounded-md object-cover"
                    alt="media"
                  />
                  {upload.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded-full">
                      {Math.floor(upload.duration / 60000)}:
                      {Math.floor((upload.duration % 60000) / 1000)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  )}
                </div>
              </Draggable>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
