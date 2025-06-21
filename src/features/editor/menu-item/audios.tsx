import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AUDIOS } from "../data/audio";
import { dispatch } from "@designcombo/events";
import { ADD_AUDIO } from "@designcombo/state";
import { IAudio } from "@designcombo/types";
import { Music } from "lucide-react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import React from "react";
import { generateId } from "@designcombo/timeline";
import { useThumbnailSelectionStore } from "../store/use-thumbnail-selection-store";

export const Audios = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();

  const handleAddAudio = (payload: Partial<IAudio>) => {
    payload.id = generateId();
    dispatch(ADD_AUDIO, {
      payload,
      options: {},
    });
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Audios
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col px-2 pb-4">
          {AUDIOS.map((audio, index) => {
            return (
              <AudioItem
                shouldDisplayPreview={!isDraggingOverTimeline}
                handleAddAudio={handleAddAudio}
                audio={audio}
                key={index}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

const AudioItem = ({
  handleAddAudio,
  audio,
  shouldDisplayPreview,
}: {
  handleAddAudio: (payload: Partial<IAudio>) => void;
  audio: Partial<IAudio>;
  shouldDisplayPreview: boolean;
}) => {
  const { isSelected, setSelectedItem, setSelectedItemOnAdd } = useThumbnailSelectionStore();
  
  const audioId = audio.id || `audio-${Date.now()}`;
  const isCurrentlySelected = isSelected(audioId, 'audio');

  const style = React.useMemo(
    () => ({
      backgroundImage: `url(https://cdn.designcombo.dev/thumbnails/music-preview.png)`,
      backgroundSize: "cover",
      width: "70px",
      height: "70px",
    }),
    [],
  );

  const handleClick = () => {
    setSelectedItem({ id: audioId, type: 'audio' });
  };

  return (
    <Draggable
      data={audio}
      renderCustomPreview={<div style={style} />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div
        draggable={false}
        onClick={handleClick}
        onDoubleClick={() => {
          handleAddAudio(audio);
          // Sélectionner cette miniature quand elle est ajoutée à la timeline
          setSelectedItemOnAdd(audioId, 'audio');
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr",
        }}
        className={`thumbnail-container flex cursor-pointer gap-4 px-2 py-1 text-sm hover:bg-zinc-800/70 ${
          isCurrentlySelected ? 'thumbnail-selected' : ''
        }`}
      >
        <div className="flex h-12 items-center justify-center bg-zinc-800">
          <Music width={16} />
        </div>
        <div className="flex flex-col justify-center">
          <div>{audio.name}</div>
          <div className="text-zinc-400">{audio.metadata?.author}</div>
        </div>
      </div>
    </Draggable>
  );
};
