import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Square } from "lucide-react";
import useStore from "../store/use-store";
import { cn } from "@/lib/utils";

interface VideoSize {
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const videoSizes: VideoSize[] = [
  {
    width: 1920,
    height: 1080,
    icon: Monitor,
    label: "Landscape (16:9)",
  },
  {
    width: 1080,
    height: 1920,
    icon: Smartphone,
    label: "Portrait (9:16)",
  },
  {
    width: 1080,
    height: 1080,
    icon: Square,
    label: "Square (1:1)",
  },
];

export default function VideoSizeSelector() {
  const { size, setState } = useStore();

  const handleSizeChange = async (newSize: { width: number; height: number }) => {
    await setState({ size: newSize });
  };

  const isActiveSize = (videoSize: VideoSize) => {
    return size.width === videoSize.width && size.height === videoSize.height;
  };

  return (
    <div className="absolute top-4 right-4 z-[9999] flex flex-col gap-1 bg-white dark:bg-gray-800 rounded-lg p-2 border-2 border-blue-500 shadow-2xl w-fit">
      {videoSizes.map((videoSize, index) => {
        const Icon = videoSize.icon;
        const isActive = isActiveSize(videoSize);
        
        return (
          <Button
            key={index}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 h-auto text-sm transition-all duration-200 justify-start",
              isActive && "bg-primary text-primary-foreground shadow-lg"
            )}
            onClick={() => handleSizeChange(videoSize)}
            title={videoSize.label}
          >
            <Icon className="w-4 h-4" />
            <span className="whitespace-nowrap">{videoSize.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
