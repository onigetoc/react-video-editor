import React, { useState, useEffect, useRef } from 'react';

interface DraggableTextElementProps {
  initialX: number;
  initialY: number;
  text: string;
  canvasWidth: number;
  canvasHeight: number;
  snapThreshold?: number; // Pixels for snapping. Augmentez cette valeur pour un effet "plus magnétique".
  onPositionChange: (x: number, y: number) => void;
}

const DraggableTextElement: React.FC<DraggableTextElementProps> = ({
  initialX,
  initialY,
  text,
  canvasWidth,
  canvasHeight,
  snapThreshold = 1000, // Magnétisme fortement augmenté pour être perceptible
  onPositionChange,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);
  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  
  const textRef = useRef<HTMLDivElement>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // textWidth and textHeight are not used from component scope, they are read dynamically in handleMouseMove
  // const textWidth = textRef.current?.offsetWidth || 0; 
  // const textHeight = textRef.current?.offsetHeight || 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      // Calculate offset from mouse to top-left of element
      dragStartOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    // Prevent text selection during drag
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !textRef.current) return;

      const parentRect = textRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const newX = e.clientX - parentRect.left - dragStartOffset.current.x;
      const newY = e.clientY - parentRect.top - dragStartOffset.current.y;

      const currentTextWidth = textRef.current.offsetWidth;
      const currentTextHeight = textRef.current.offsetHeight;

      const textLeft = newX;
      const textCenterX = newX + currentTextWidth / 2;
      const textRight = newX + currentTextWidth;
      const textTop = newY;
      const textCenterY = newY + currentTextHeight / 2;
      const textBottom = newY + currentTextHeight;

      const canvasLeft = 0;
      const canvasCenterX = canvasWidth / 2;
      const canvasRight = canvasWidth;
      const canvasTop = 0;
      const canvasCenterY = canvasHeight / 2;
      const canvasBottom = canvasHeight;

      let snappedX = newX;
      let snappedY = newY;

      let isSnappedToHorizontalCenter = false;
      let isSnappedToVerticalCenter = false;

      // Magnétisme horizontal avec sensibilité améliorée
      if (Math.abs(textCenterX - canvasCenterX) < snapThreshold) {
        snappedX = canvasCenterX - currentTextWidth / 2;
        isSnappedToHorizontalCenter = true;
      } else if (Math.abs(textLeft - canvasLeft) < snapThreshold) {
        snappedX = canvasLeft;
      } else if (Math.abs(textRight - canvasRight) < snapThreshold) {
        snappedX = canvasRight - currentTextWidth;
      }
      setShowVerticalGuide(isSnappedToHorizontalCenter);

      // Magnétisme vertical avec sensibilité améliorée
      if (Math.abs(textCenterY - canvasCenterY) < snapThreshold) {
        snappedY = canvasCenterY - currentTextHeight / 2;
        isSnappedToVerticalCenter = true;
      } else if (Math.abs(textTop - canvasTop) < snapThreshold) {
        snappedY = canvasTop;
      } else if (Math.abs(textBottom - canvasBottom) < snapThreshold) {
        snappedY = canvasBottom - currentTextHeight;
      }
      setShowHorizontalGuide(isSnappedToVerticalCenter);
      
      // Contraindre dans les limites du canvas
      snappedX = Math.max(0, Math.min(snappedX, canvasWidth - currentTextWidth));
      snappedY = Math.max(0, Math.min(snappedY, canvasHeight - currentTextHeight));

      setPosition({ x: snappedX, y: snappedY });
      onPositionChange(snappedX, snappedY);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setShowHorizontalGuide(false);
        setShowVerticalGuide(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, canvasWidth, canvasHeight, snapThreshold, onPositionChange]);

  useEffect(() => {
    // Guide visibility logic handled by state
  }, [showHorizontalGuide, showVerticalGuide, canvasWidth, canvasHeight]);


  return (
    <>
      {/* Ligne d'alignement verticale pointillée - Couleurs bleues originales restaurées */}
      {showVerticalGuide && (
        <div
          style={{
            position: 'absolute',
            left: `${canvasWidth / 2 - 0.5}px`,
            top: '0px',
            width: '1px',
            height: `${canvasHeight}px`,
            pointerEvents: 'none',
            zIndex: 999999,
          }}
        >
          <svg
            width="1"
            height={canvasHeight}
            style={{
              width: '1px',
              height: `${canvasHeight}px`,
              opacity: 0.9,
            }}
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={canvasHeight}
              stroke="rgba(0, 162, 255, 0.9)"
              strokeWidth="1"
              strokeDasharray="4,4"
              fill="none"
            />
          </svg>
        </div>
      )}
      
      {/* Ligne d'alignement horizontale pointillée - Couleurs bleues originales restaurées */}
      {showHorizontalGuide && (
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: `${canvasHeight / 2 - 0.5}px`,
            width: `${canvasWidth}px`,
            height: '1px',
            pointerEvents: 'none',
            zIndex: 999999,
          }}
        >
          <svg
            width={canvasWidth}
            height="1"
            style={{
              width: `${canvasWidth}px`,
              height: '1px',
              opacity: 0.9,
            }}
          >
            <line
              x1="0"
              y1="0"
              x2={canvasWidth}
              y2="0"
              stroke="rgba(0, 162, 255, 0.9)"
              strokeWidth="1"
              strokeDasharray="4,4"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Élément de texte draggable */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: '10px',
          border: '1px solid transparent',
          userSelect: 'none',
          zIndex: isDragging ? 10001 : 'auto', // Au-dessus des lignes pendant le drag
        }}
        onMouseDown={handleMouseDown}
      >
        {text}
      </div>
    </>
  );
};

export default DraggableTextElement;
