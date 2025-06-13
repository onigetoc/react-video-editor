import {
  Control,
  Pattern,
  Video as VideoBase,
  VideoProps as VideoPropsBase,
  timeMsToUnits,
  unitsToTimeMs,
} from "@designcombo/timeline";
import { Filmstrip, FilmstripBacklogOptions } from "../types";
import ThumbnailCache from "../../utils/thumbnail-cache";
import { IDisplay, IMetadata, ITrim } from "@designcombo/types";
import {
  calculateOffscreenSegments,
  calculateThumbnailSegmentLayout,
} from "../../utils/filmstrip";
import { getFileFromUrl } from "../../utils/file";
import { type MP4Clip } from "@designcombo/frames";
import { createMediaControls } from "../controls";

const EMPTY_FILMSTRIP: Filmstrip = {
  offset: 0,
  startTime: 0,
  thumbnailsCount: 0,
  widthOnScreen: 0,
};

interface VideoProps extends VideoPropsBase {
  aspectRatio: number;
  metadata: Partial<IMetadata> & {
    previewUrl: string;
  };
}
class Video extends VideoBase {
  static type = "Video";
  public clip?: MP4Clip | null;
  declare id: string;
  public resourceId: string = "";
  declare tScale: number;
  public isSelected = false;
  declare display: IDisplay;
  declare trim: ITrim;
  declare playbackRate: number;
  declare duration: number;
  public prevDuration: number;
  public itemType = "video";
  public metadata?: Partial<IMetadata>;
  declare src: string;

  public aspectRatio = 1;
  public scrollLeft = 0;
  public filmstripBacklogOptions?: FilmstripBacklogOptions;
  public thumbnailsPerSegment = 0;
  public segmentSize = 0;

  public offscreenSegments = 0;
  public thumbnailWidth: number = 0;
  public thumbnailHeight: number = 40;
  public thumbnailsList: { url: string; ts: number }[] = [];
  public isFetchingThumbnails = false;
  public thumbnailCache = new ThumbnailCache();

  public currentFilmstrip: Filmstrip = EMPTY_FILMSTRIP;
  public nextFilmstrip: Filmstrip = { ...EMPTY_FILMSTRIP, segmentIndex: 0 };
  public loadingFilmstrip: Filmstrip = EMPTY_FILMSTRIP;

  private offscreenCanvas: OffscreenCanvas | null = null;
  private offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;

  private isDirty: boolean = true;

  private fallbackSegmentIndex: number = 0;
  private fallbackSegmentsCount: number = 0;
  private previewUrl: string = "";

  static createControls(): { controls: Record<string, Control> } {
    return { controls: createMediaControls() };
  }

  constructor(props: VideoProps) {
    super(props);
    console.log("Video constructor: Creating video with props", props);
    this.id = props.id;
    this.tScale = props.tScale;
    this.objectCaching = false;
    this.rx = 4;
    this.ry = 4;
    this.display = props.display;
    this.trim = props.trim;
    this.duration = props.duration;
    this.prevDuration = props.duration;
    this.fill = "#27272a";
    this.borderOpacityWhenMoving = 1;
    this.metadata = props.metadata;

    this.aspectRatio = props.aspectRatio;

    this.src = props.src;
    this.strokeWidth = 0;

    this.transparentCorners = false;
    this.hasBorders = false;

    this.previewUrl = props.metadata?.previewUrl;
    console.log("Video constructor: previewUrl =", this.previewUrl);
    console.log("Video constructor: metadata =", this.metadata);
    console.log("Video constructor: src =", this.src); // Added log
    this.initOffscreenCanvas();
    this.initialize();
  }

  private initOffscreenCanvas() {
    if (!this.offscreenCanvas) {
      this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
      this.offscreenCtx = this.offscreenCanvas.getContext("2d");
    }

    // Resize if dimensions changed
    if (
      this.offscreenCanvas.width !== this.width ||
      this.offscreenCanvas.height !== this.height
    ) {
      this.offscreenCanvas.width = this.width;
      this.offscreenCanvas.height = this.height;
      this.isDirty = true;
    }
  }

  public initDimensions() {
    // S'assurer qu'on a des dimensions valides
    if (this.thumbnailWidth <= 0) {
      // Utiliser une largeur par défaut basée sur l'aspect ratio ou une valeur par défaut
      this.thumbnailWidth = this.thumbnailHeight * (this.aspectRatio || 16/9);
      console.log("initDimensions: Using default thumbnailWidth =", this.thumbnailWidth);
    }

    const segmentOptions = calculateThumbnailSegmentLayout(this.thumbnailWidth);
    this.thumbnailsPerSegment = segmentOptions.thumbnailsPerSegment;
    this.segmentSize = segmentOptions.segmentSize;
    
    console.log("initDimensions: thumbnailWidth =", this.thumbnailWidth, "thumbnailsPerSegment =", this.thumbnailsPerSegment, "segmentSize =", this.segmentSize);
  }

  public async initialize() {
    // Pour les vidéos locales, générer le fallback depuis le fichier local
    const hasLocalFile = this.metadata && 'originalFile' in this.metadata && this.metadata.originalFile instanceof File;
    
    if (hasLocalFile && !this.previewUrl) {
      await this.generateLocalFallbackThumbnail();
    } else {
      await this.loadFallbackThumbnail();
    }

    this.initDimensions();
    this.onScrollChange({ scrollLeft: 0 });

    this.canvas?.requestRenderAll();

    this.createFallbackPattern();
    await this.prepareAssets();

    this.onScrollChange({ scrollLeft: 0 });
  }

  public async prepareAssets() {
    if (typeof window === "undefined") return;

    try {
      console.log("prepareAssets: Attempting to load video from:", this.src);
      const { MP4Clip } = await import("@designcombo/frames");
      
      let file: File;
      
      // Si nous avons un fichier original dans les métadonnées (pour les uploads locaux),
      // l'utiliser directement au lieu de faire un fetch sur le blob URL
      console.log("prepareAssets: Checking for original file...");
      console.log("prepareAssets: this.metadata =", this.metadata);
      console.log("prepareAssets: 'originalFile' in metadata =", this.metadata && 'originalFile' in this.metadata);
      console.log("prepareAssets: originalFile instanceof File =", this.metadata && 'originalFile' in this.metadata && this.metadata.originalFile instanceof File);
      
      if (this.metadata && 'originalFile' in this.metadata && this.metadata.originalFile instanceof File) {
        console.log("prepareAssets: Using original file from metadata");
        file = this.metadata.originalFile;
      } else {
        console.log("prepareAssets: Fetching file from URL");
        file = await getFileFromUrl(this.src);
      }
      
      console.log("prepareAssets: File loaded successfully:", file, "file.name:", file.name, "file.size:", file.size, "file.type:", file.type); // Added file details
      const stream = file.stream();
      console.log("prepareAssets: Stream created successfully");
      this.clip = new MP4Clip(stream);
      console.log("prepareAssets: MP4Clip created successfully");
    } catch (error) {
      console.error("Error loading MP4Clip for src:", this.src, error);
    }
  }

  private calculateFilmstripDimensions({
    segmentIndex,
    widthOnScreen,
  }: {
    segmentIndex: number;
    widthOnScreen: number;
  }) {
    const filmstripOffset = segmentIndex * this.segmentSize;
    const shouldUseLeftBacklog = segmentIndex > 0;
    const leftBacklogSize = shouldUseLeftBacklog ? this.segmentSize : 0;

    const totalWidth = timeMsToUnits(
      this.duration,
      this.tScale,
      this.playbackRate,
    );

    const rightRemainingSize =
      totalWidth - widthOnScreen - leftBacklogSize - filmstripOffset;
    const rightBacklogSize = Math.min(this.segmentSize, rightRemainingSize);

    const filmstripStartTime = unitsToTimeMs(filmstripOffset, this.tScale);
    const filmstrimpThumbnailsCount =
      1 +
      Math.round(
        (widthOnScreen + leftBacklogSize + rightBacklogSize) /
          this.thumbnailWidth,
      );

    return {
      filmstripOffset,
      leftBacklogSize,
      rightBacklogSize,
      filmstripStartTime,
      filmstrimpThumbnailsCount,
    };
  }

  // load fallback thumbnail, resize it and cache it
  private async loadFallbackThumbnail() {
    const fallbackThumbnail = this.previewUrl;
    if (!fallbackThumbnail) {
      console.log("loadFallbackThumbnail: No previewUrl provided, skipping");
      return;
    }

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = fallbackThumbnail + "?t=" + Date.now();
      img.onload = () => {
        // Create a temporary canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Calculate new width maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        const targetHeight = 40;
        const targetWidth = Math.round(targetHeight * aspectRatio);
        // Set canvas size and draw resized image
        canvas.height = targetHeight;
        canvas.width = targetWidth;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Create new image from resized canvas
        const resizedImg = new Image();
        resizedImg.src = canvas.toDataURL();
        // Update aspect ratio and cache the resized image
        this.aspectRatio = aspectRatio;
        this.thumbnailWidth = targetWidth;
        this.thumbnailCache.setThumbnail("fallback", resizedImg);
        resolve();
      };
      img.onerror = (error) => {
        console.error("loadFallbackThumbnail: Error loading fallback thumbnail:", error);
        resolve(); // Continue even if fallback fails
      };
    });
  }

  // Générer un fallback thumbnail depuis le fichier local
  private async generateLocalFallbackThumbnail() {
    console.log("generateLocalFallbackThumbnail: Starting for local video");
    
    if (!this.metadata || !('originalFile' in this.metadata) || !(this.metadata.originalFile instanceof File)) {
      console.log("generateLocalFallbackThumbnail: No original file found");
      return;
    }
    
    const file = this.metadata.originalFile;
    
    return new Promise<void>((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        console.log("generateLocalFallbackThumbnail: Video metadata loaded, duration =", video.duration, "dimensions:", video.videoWidth, "x", video.videoHeight);
        
        // Calculer l'aspect ratio et les dimensions
        const aspectRatio = video.videoWidth / video.videoHeight;
        const targetHeight = 40;
        const targetWidth = Math.round(targetHeight * aspectRatio);
        
        // Mettre à jour les propriétés
        this.aspectRatio = aspectRatio;
        this.thumbnailWidth = targetWidth;
        
        // Générer la miniature à t=0
        video.currentTime = 0;
      };
      
      video.onseeked = () => {
        console.log("generateLocalFallbackThumbnail: Video seeked to", video.currentTime);
        
        const canvas = document.createElement('canvas');
        canvas.width = this.thumbnailWidth;
        canvas.height = this.thumbnailHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill with black background first
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Calculer le ratio pour maintenir l'aspect ratio
          const videoAspectRatio = video.videoWidth / video.videoHeight;
          const canvasAspectRatio = canvas.width / canvas.height;
          
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (videoAspectRatio > canvasAspectRatio) {
            drawHeight = canvas.width / videoAspectRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * videoAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          }
          
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        // Créer l'image et la mettre en cache
        const img = new Image();
        img.src = canvas.toDataURL();
        img.onload = () => {
          this.thumbnailCache.setThumbnail("fallback", img);
          console.log("generateLocalFallbackThumbnail: Fallback thumbnail cached successfully");
          URL.revokeObjectURL(video.src);
          resolve();
        };
      };
      
      video.onerror = (error) => {
        console.error("generateLocalFallbackThumbnail: Video error", error);
        URL.revokeObjectURL(video.src);
        resolve(); // Continue even if fallback generation fails
      };
    });
  }

  private generateTimestamps(startTime: number, count: number): number[] {
    const timePerThumbnail = unitsToTimeMs(
      this.thumbnailWidth,
      this.tScale,
      this.playbackRate,
    );

    return Array.from({ length: count }, (_, i) => {
      const timeInFilmstripe = startTime + i * timePerThumbnail;
      return Math.ceil(timeInFilmstripe / 1000);
    });
  }

  private createFallbackPattern() {
    const canvas = this.canvas;
    if (!canvas) return;

    const canvasWidth = this.canvas!.width;
    const maxPatternSize = 12000;
    const fallbackSource = this.thumbnailCache.getThumbnail("fallback");

    if (!fallbackSource) return;

    // Compute the total width and number of segments needed
    const totalWidthNeeded = Math.min(canvasWidth * 20, maxPatternSize);
    const segmentsRequired = Math.ceil(totalWidthNeeded / this.segmentSize);
    this.fallbackSegmentsCount = segmentsRequired;
    const patternWidth = segmentsRequired * this.segmentSize;

    // Setup canvas dimensions
    const offCanvas = document.createElement("canvas");
    offCanvas.height = this.thumbnailHeight;
    offCanvas.width = patternWidth;

    const context = offCanvas.getContext("2d")!;
    const thumbnailsTotal = segmentsRequired * this.thumbnailsPerSegment;

    // Draw the fallback image across the entirety of the canvas horizontally
    for (let i = 0; i < thumbnailsTotal; i++) {
      const x = i * this.thumbnailWidth;
      context.drawImage(
        fallbackSource,
        x,
        0,
        this.thumbnailWidth,
        this.thumbnailHeight,
      );
    }

    // Create the pattern and apply it
    const fillPattern = new Pattern({
      source: offCanvas,
      repeat: "no-repeat",
      offsetX: 0,
    });

    this.set("fill", fillPattern);
    this.canvas?.requestRenderAll();
  }
  public async loadAndRenderThumbnails() {
    console.log("loadAndRenderThumbnails: Starting for video", this.src);
    console.log("loadAndRenderThumbnails: isFetchingThumbnails =", this.isFetchingThumbnails);
    console.log("loadAndRenderThumbnails: this.clip =", this.clip);
    
    // Vérifier si nous avons un fichier local
    const hasLocalFile = this.metadata && 'originalFile' in this.metadata && this.metadata.originalFile instanceof File;
    console.log("loadAndRenderThumbnails: hasLocalFile =", hasLocalFile);
    
    if (this.isFetchingThumbnails) {
      console.log("loadAndRenderThumbnails: Already fetching thumbnails, returning");
      return;
    }
    
    // Pour les vidéos du serveur, nous avons besoin de this.clip
    // Pour les vidéos locales, nous pouvons utiliser le fichier original
    if (!hasLocalFile && !this.clip) {
      console.log("loadAndRenderThumbnails: No clip available for server video, returning");
      return;
    }
    
    console.log("loadAndRenderThumbnails: Proceeding with thumbnail generation");
    // set segmentDrawn to segmentToDraw
    this.loadingFilmstrip = { ...this.nextFilmstrip };
    this.isFetchingThumbnails = true;

    // Calculate dimensions and offsets
    const { startTime, thumbnailsCount } = this.loadingFilmstrip;
    console.log("loadAndRenderThumbnails: startTime =", startTime, "thumbnailsCount =", thumbnailsCount);
    console.log("loadAndRenderThumbnails: loadingFilmstrip =", this.loadingFilmstrip);

    // Generate required timestamps
    const timestamps = this.generateTimestamps(startTime, thumbnailsCount);
    console.log("loadAndRenderThumbnails: Generated timestamps =", timestamps);

    try {
      let updatedThumbnails: { ts: number; img: Blob }[];
      
      if (hasLocalFile) {
        console.log("loadAndRenderThumbnails: Using local file thumbnail generation");
        // Utiliser notre méthode pour les fichiers locaux
        const localThumbnails = await this.generateLocalThumbnails(timestamps);
        console.log("loadAndRenderThumbnails: localThumbnails generated =", localThumbnails.length);
        updatedThumbnails = localThumbnails.map((thumbnail) => ({
          ts: Math.round(thumbnail.ts), // timestamps sont déjà en secondes
          img: thumbnail.img,
        }));
        console.log("loadAndRenderThumbnails: updatedThumbnails mapped =", updatedThumbnails.map(t => t.ts));
      } else {
        console.log("loadAndRenderThumbnails: Using MP4Clip for server videos");
        // Utiliser MP4Clip pour les vidéos du serveur
        const thumbnailsArr = await this.clip.thumbnailsList(this.thumbnailWidth, {
          timestamps: timestamps.map((timestamp) => timestamp * 1e6),
        });
        console.log("loadAndRenderThumbnails: thumbnailsList returned =", thumbnailsArr.length, "thumbnails");

        updatedThumbnails = thumbnailsArr.map((thumbnail) => {
          return {
            ts: Math.round(thumbnail.ts / 1e6),
            img: thumbnail.img,
          };
        });
      }

      // Load all thumbnails in parallel
      await this.loadThumbnailBatch(updatedThumbnails);
      console.log("loadAndRenderThumbnails: Thumbnail batch loaded successfully");

      this.isDirty = true; // Mark as dirty after preparing new thumbnails
      // this.isFallbackDirty = true;
      this.isFetchingThumbnails = false;

      this.currentFilmstrip = { ...this.loadingFilmstrip };

      requestAnimationFrame(() => {
        this.canvas?.requestRenderAll();
      });
      console.log("loadAndRenderThumbnails: Completed successfully");
    } catch (error) {
      console.error("loadAndRenderThumbnails: Error during thumbnail generation:", error);
      this.isFetchingThumbnails = false;
    }
  }

  // Méthode alternative pour générer des thumbnails pour les fichiers locaux
  private async generateLocalThumbnails(timestamps: number[]): Promise<{ ts: number; img: Blob }[]> {
    console.log("generateLocalThumbnails: Starting for timestamps", timestamps);
    
    if (!this.metadata || !('originalFile' in this.metadata) || !(this.metadata.originalFile instanceof File)) {
      throw new Error("No original file found in metadata");
    }
    
    const file = this.metadata.originalFile;
    const thumbnails: { ts: number; img: Blob }[] = [];
    
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.src = URL.createObjectURL(file);
      console.log("generateLocalThumbnails: Video element created, src:", video.src);
      
      let currentIndex = 0;
      
      video.onloadedmetadata = () => {
        console.log("generateLocalThumbnails: Video metadata loaded, duration =", video.duration, "videoWidth:", video.videoWidth, "videoHeight:", video.videoHeight);
        console.log("generateLocalThumbnails: Will process", timestamps.length, "timestamps");
        processNextTimestamp();
      };
      
      const processNextTimestamp = () => {
        if (currentIndex >= timestamps.length) {
          console.log("generateLocalThumbnails: All timestamps processed, total thumbnails =", thumbnails.length);
          URL.revokeObjectURL(video.src);
          resolve(thumbnails);
          return;
        }
        
        const timestamp = timestamps[currentIndex];
        console.log("generateLocalThumbnails: Processing timestamp", timestamp, "at index", currentIndex);
        
        // Ensure we don't seek beyond video duration
        const seekTime = Math.min(timestamp, video.duration - 0.1);
        console.log("generateLocalThumbnails: Seeking to", seekTime, "seconds");
        video.currentTime = seekTime;
      };
      
      video.onseeked = () => {
        console.log("generateLocalThumbnails: Video seeked to", video.currentTime, "s");
        const canvas = document.createElement('canvas');
        canvas.width = this.thumbnailWidth;
        canvas.height = this.thumbnailHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill with black background first
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Calculer le ratio pour maintenir l'aspect ratio
          const videoAspectRatio = video.videoWidth / video.videoHeight;
          const canvasAspectRatio = canvas.width / canvas.height;
          
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (videoAspectRatio > canvasAspectRatio) {
            drawHeight = canvas.width / videoAspectRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * videoAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          }
          
          console.log("generateLocalThumbnails: Drawing video frame at", offsetX, offsetY, drawWidth, drawHeight);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            console.log("generateLocalThumbnails: Blob created for timestamp", timestamps[currentIndex], "size:", blob.size);
            thumbnails.push({
              ts: timestamps[currentIndex],
              img: blob
            });
          } else {
            console.warn("generateLocalThumbnails: Failed to create blob for timestamp", timestamps[currentIndex]);
          }
          currentIndex++;
          setTimeout(processNextTimestamp, 10); // Small delay to ensure proper seeking
        }, 'image/jpeg', 0.8);
      };
      
      video.onerror = (error) => {
        console.error("generateLocalThumbnails: Video error", error);
        URL.revokeObjectURL(video.src);
        reject(error);
      };
      
      video.oncanplay = () => {
        console.log("generateLocalThumbnails: Video can play");
      };
    });
  }

  private async loadThumbnailBatch(thumbnails: { ts: number; img: Blob }[]) {
    console.log("loadThumbnailBatch: Loading batch of", thumbnails.length, "thumbnails");
    const loadPromises = thumbnails.map(async (thumbnail) => {
      if (this.thumbnailCache.getThumbnail(thumbnail.ts)) {
        console.log("loadThumbnailBatch: Thumbnail already in cache for ts", thumbnail.ts);
        return;
      }

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(thumbnail.img);
        img.onload = () => {
          URL.revokeObjectURL(img.src); // Clean up the blob URL after image loads
          this.thumbnailCache.setThumbnail(thumbnail.ts, img);
          console.log("loadThumbnailBatch: Cached thumbnail for ts", thumbnail.ts);
          resolve();
        };
        img.onerror = (error) => {
          console.error("loadThumbnailBatch: Error loading image for ts", thumbnail.ts, error); // Added error log
          URL.revokeObjectURL(img.src);
          resolve(); // Resolve even on error to not block Promise.all
        };
      });
    });

    await Promise.all(loadPromises);
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);

    ctx.save();
    ctx.translate(-this.width / 2, -this.height / 2);

    // Clip the area to prevent drawing outside
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();

    this.renderToOffscreen();

    ctx.drawImage(this.offscreenCanvas!, 0, 0);

    ctx.restore();
    // this.drawTextIdentity(ctx);
    this.updateSelected(ctx);
  }

  public setDuration(duration: number) {
    this.duration = duration;
    this.prevDuration = duration;
  }

  public async setSrc(src: string) {
    super.setSrc(src);
    this.clip = null;
    await this.initialize();
    await this.prepareAssets();
    this.thumbnailCache.clearCacheButFallback();
    this.onScale();
  }
  public onResizeSnap() {
    this.renderToOffscreen(true);
  }
  public onResize() {
    this.renderToOffscreen(true);
  }

  public renderToOffscreen(force?: boolean) {
    if (!this.offscreenCtx) return;
    if (!this.isDirty && !force) return;

    this.offscreenCanvas!.width = this.width;
    const ctx = this.offscreenCtx;
    const { startTime, offset, thumbnailsCount } = this.currentFilmstrip;
    const thumbnailWidth = this.thumbnailWidth;
    const thumbnailHeight = this.thumbnailHeight;

    console.log("renderToOffscreen: Rendering with currentFilmstrip =", this.currentFilmstrip);
    console.log("renderToOffscreen: thumbnailsCount =", thumbnailsCount, "thumbnailWidth =", thumbnailWidth);

    // Calculate the offset caused by the trimming
    const trimFromSize = timeMsToUnits(
      this.trim.from,
      this.tScale,
      this.playbackRate,
    );

    let timeInFilmstripe = startTime;
    const timePerThumbnail = unitsToTimeMs(
      thumbnailWidth,
      this.tScale,
      this.playbackRate,
    );

    // Clear the offscreen canvas
    ctx.clearRect(0, 0, this.width, this.height);

    // Clip with rounded corners
    ctx.beginPath();
    ctx.roundRect(0, 0, this.width, this.height, this.rx);
    ctx.clip();
    
    let thumbnailsRendered = 0;
    // Draw thumbnails
    for (let i = 0; i < thumbnailsCount; i++) {
      const timestampKey = Math.ceil(timeInFilmstripe / 1000);
      let img = this.thumbnailCache.getThumbnail(timestampKey);

      console.log("renderToOffscreen: Looking for thumbnail at timestamp", timestampKey, "found:", !!img);

      if (!img) {
        img = this.thumbnailCache.getThumbnail("fallback");
        console.log("renderToOffscreen: Using fallback thumbnail");
      }

      if (img && img.complete) {
        const xPosition = i * thumbnailWidth + offset - trimFromSize;
        ctx.drawImage(img, xPosition, 0, thumbnailWidth, thumbnailHeight);
        thumbnailsRendered++;
        timeInFilmstripe += timePerThumbnail;
      }
    }
    
    console.log("renderToOffscreen: Rendered", thumbnailsRendered, "thumbnails out of", thumbnailsCount);
    this.isDirty = false;
  }

  public drawTextIdentity(ctx: CanvasRenderingContext2D) {
    const iconPath = new Path2D(
      "M16.5625 0.925L12.5 3.275V0.625L11.875 0H0.625L0 0.625V9.375L0.625 10H11.875L12.5 9.375V6.875L16.5625 9.2125L17.5 8.625V1.475L16.5625 0.925ZM11.25 8.75H1.25V1.25H11.25V8.75ZM16.25 7.5L12.5 5.375V4.725L16.25 2.5V7.5Z",
    );
    ctx.save();
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.translate(0, 14);
    ctx.font = "600 12px 'Geist variable'";
    ctx.fillStyle = "#f4f4f5";
    ctx.textAlign = "left";
    ctx.clip();
    ctx.fillText("Video", 36, 10);

    ctx.translate(8, 1);

    ctx.fillStyle = "#f4f4f5";
    ctx.fill(iconPath);
    ctx.restore();
  }

  public setSelected(selected: boolean) {
    this.isSelected = selected;
    this.set({ dirty: true });
  }

  public updateSelected(ctx: CanvasRenderingContext2D) {
    const borderColor = this.isSelected
      ? "rgba(255, 255, 255,1.0)"
      : "rgba(255, 255, 255,0.1)";
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
      6,
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.restore();
  }

  public calulateWidthOnScreen() {
    const canvasEl = document.getElementById("designcombo-timeline-canvas");
    const canvasWidth = canvasEl?.clientWidth;
    const scrollLeft = this.scrollLeft;
    const timelineWidth = canvasWidth!;
    const cutFromBottomEdge = Math.max(
      timelineWidth - (this.width + this.left + scrollLeft),
      0,
    );
    const visibleHeight = Math.min(
      timelineWidth - this.left - scrollLeft,
      timelineWidth,
    );

    return Math.max(visibleHeight - cutFromBottomEdge, 0);
  }

  // Calculate the width that is not visible on the screen measured from the left
  public calculateOffscreenWidth({ scrollLeft }: { scrollLeft: number }) {
    const offscreenWidth = Math.min(this.left + scrollLeft, 0);

    return Math.abs(offscreenWidth);
  }

  public onScrollChange({
    scrollLeft,
    force,
  }: {
    scrollLeft: number;
    force?: boolean;
  }) {
    const offscreenWidth = this.calculateOffscreenWidth({ scrollLeft });
    const trimFromSize = timeMsToUnits(
      this.trim.from,
      this.tScale,
      this.playbackRate,
    );

    const offscreenSegments = calculateOffscreenSegments(
      offscreenWidth,
      trimFromSize,
      this.segmentSize,
    );

    this.offscreenSegments = offscreenSegments;

    // calculate start segment to draw
    const segmentToDraw = offscreenSegments;

    if (this.currentFilmstrip.segmentIndex === segmentToDraw) {
      return false;
    }

    if (segmentToDraw !== this.fallbackSegmentIndex) {
      const fillPattern = this.fill as Pattern;
      if (fillPattern instanceof Pattern) {
        fillPattern.offsetX =
          this.segmentSize *
          (segmentToDraw - Math.floor(this.fallbackSegmentsCount / 2));
      }

      this.fallbackSegmentIndex = segmentToDraw;
    }
    if (!this.isFetchingThumbnails || force) {
      this.scrollLeft = scrollLeft;
      const widthOnScreen = this.calulateWidthOnScreen();
      // With these lines:
      const { filmstripOffset, filmstripStartTime, filmstrimpThumbnailsCount } =
        this.calculateFilmstripDimensions({
          widthOnScreen: this.calulateWidthOnScreen(),
          segmentIndex: segmentToDraw,
        });

      this.nextFilmstrip = {
        segmentIndex: segmentToDraw,
        offset: filmstripOffset,
        startTime: filmstripStartTime,
        thumbnailsCount: filmstrimpThumbnailsCount,
        widthOnScreen,
      };

      this.loadAndRenderThumbnails();
    }
  }
  public onScale() {
    this.currentFilmstrip = { ...EMPTY_FILMSTRIP };
    this.nextFilmstrip = { ...EMPTY_FILMSTRIP, segmentIndex: 0 };
    this.loadingFilmstrip = { ...EMPTY_FILMSTRIP };
    this.onScrollChange({ scrollLeft: this.scrollLeft, force: true });
  }
}

export default Video;
