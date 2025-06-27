import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { generateId } from "@designcombo/timeline";
import Draggable from "@/components/shared/draggable";
import { IImage } from "@designcombo/types";
import React, { useRef } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { ADD_ITEMS } from "@designcombo/state";
import { Masonry, useInfiniteLoader } from "masonic";
import { useThumbnailSelectionStore } from "../store/use-thumbnail-selection-store";
import { usePexelsSearch, PexelsPhoto, PexelsVideo } from "../hooks/usePexelsSearch";

interface MasonryImageData extends Partial<IImage> {
  _key: string;
  preview: string; // Ajouté pour les images Pexels
  details: {
    src: string; // Ajouté pour les images Pexels
  };
}

export const Images = () => {
  const masonryRef = useRef<Masonry>(null);
  const { allPexelsItems, search, loading, currentPage, totalResults } = usePexelsSearch();
  const [pexelsImages, setPexelsImages] = React.useState<MasonryImageData[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    // Initial load or when allPexelsItems changes
    setPexelsImages(allPexelsItems.map((item, index) => ({
      ...item,
      id: item.id.toString(),
      _key: item.id.toString(),
      preview: 'src' in item ? item.src.medium : item.image, // Use appropriate preview URL
      details: {
        src: 'src' in item ? item.src.original : item.image, // Use appropriate full URL
      }
    })));
  }, [allPexelsItems]);

  const maybeLoadMore = useInfiniteLoader(
    async (startIndex, stopIndex, currentItems) => {
      if (loading || !currentSearchQuery) return;

      const nextPage = Math.floor(startIndex / 15) + 1; // Assuming perPage is 15
      if (nextPage > currentPage && pexelsImages.length < totalResults) {
        console.log(`Loading more Pexels images: Page ${nextPage}`);
        await search({ query: currentSearchQuery, type: 'photos', page: nextPage }, true);
      }
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 15, // Match perPage in usePexelsSearch
      threshold: 5,
    }
  );

  React.useEffect(() => {
    // Initial search for popular images
    if (!currentSearchQuery) {
      setCurrentSearchQuery('popular');
      search({ query: 'popular', type: 'photos' });
    }
  }, [search, currentSearchQuery]);

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Photos
      </div>
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          <Masonry
            ref={masonryRef}
            items={pexelsImages}
            columnWidth={120}
            columnGutter={8}
            rowGutter={8}
            render={MasonryImageItem}
            overscanBy={2}
            itemKey={(data: MasonryImageData) => data?._key || 'fallback-key'}
            onRender={maybeLoadMore}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

// Composant pour Masonic - Images avec nom de fichier affiché
const MasonryImageItem = ({ data, width }: { data: Partial<IImage>; width: number }) => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const { isSelected, setSelectedItem, setSelectedItemOnAdd } = useThumbnailSelectionStore();
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    // Potentiellement déclencher un recalcul de Masonry ici si nécessaire
    // masonryRef.current?.clearPositions(); // Ceci sera géré au niveau parent
  };

  const imageId = data.id || data._key || `image-${Date.now()}`;
  const isCurrentlySelected = isSelected(imageId, 'image');

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
    setSelectedItem({ id: imageId, type: 'image' });
  };

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
    // Sélectionner cette miniature quand elle est ajoutée à la timeline
    setSelectedItemOnAdd(imageId, 'image');
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
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`thumbnail-container flex w-full items-center justify-center overflow-hidden bg-background relative ${
            isCurrentlySelected ? 'thumbnail-selected' : ''
          }`}
        >
          <img
            draggable={false}
            src={data.preview}
            className={`h-full w-full rounded-md object-cover cursor-pointer ${isImageLoaded ? '' : 'opacity-0'}`}
            alt="image"
            onLoad={handleImageLoad}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-md">
              Chargement...
            </div>
          )}
        </div>
      </Draggable>
      
      {/* Nom de l'image avec ellipsis */}
      <div className="masonic-media-name" title={getImageName()}>
        {getImageName()}
      </div>
    </div>
  );
};
