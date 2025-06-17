import { ScrollArea } from "@/components/ui/scroll-area";
import { IMAGES } from "../data/images";
import { dispatch } from "@designcombo/events";
import { generateId } from "@designcombo/timeline";
import Draggable from "@/components/shared/draggable";
import { IImage } from "@designcombo/types";
import React from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { ADD_ITEMS } from "@designcombo/state";
import { Masonry } from "masonic";

interface MasonryImageData extends Partial<IImage> {
  _key: string;
}

export const Images = () => {

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Photos
      </div>
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          <Masonry
            items={IMAGES.map((image, index) => ({
              ...image,
              id: image.id || `image-${index}`,
              _key: `image-${index}-${image.id || index}`
            }))}
            columnWidth={120}
            columnGutter={8}
            rowGutter={8}
            render={MasonryImageItem}
            overscanBy={2}
            itemKey={(data: MasonryImageData) => data._key}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

// Composant pour Masonic - Images avec nom de fichier affiché
const MasonryImageItem = ({ data, width }: { data: Partial<IImage>; width: number }) => {
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
    const id = generateId();
    dispatch(ADD_ITEMS, {
      payload: {
        trackItems: [
          {
            id,
            type: "image",
            display: {
              from: 0,
              to: 5000,
            },
            details: {
              src: data.details?.src,
            },
            metadata: {},
          },
        ],
      },
    });
  };

  // Extraire le nom du fichier depuis l'URL ou utiliser un nom par défaut
  const getImageName = () => {
    if (data.preview) {
      const urlParts = data.preview.split('/');
      const filename = urlParts[urlParts.length - 1];
      // Supprimer l'extension et nettoyer le nom
      return filename.split('.')[0].replace(/[-_]/g, ' ') || 'Image';
    }
    return 'Image';
  };

  return (
    <div style={{ width }} className="masonic-media-item">
      <Draggable
        data={data}
        renderCustomPreview={<div style={style} />}
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
            alt="image"
          />
        </div>
      </Draggable>
      
      {/* Nom de l'image avec ellipsis */}
      <div className="masonic-media-name" title={getImageName()}>
        {getImageName()}
      </div>
    </div>
  );
};
