import React from 'react';
import DraggableTextElement from './DraggableTextElement';

const SnapTestComponent: React.FC = () => {
  const [textPosition, setTextPosition] = React.useState({ x: 100, y: 100 });
  
  const canvasWidth = 800;
  const canvasHeight = 600;

  const handlePositionChange = (x: number, y: number) => {
    setTextPosition({ x, y });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🎯 Test du Système de Snapping</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0ea5e9' }}>📋 Instructions</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Déplacez le texte vers le <strong>centre horizontal</strong> → Ligne <strong>verticale</strong> pointillée apparaît</li>
          <li>Déplacez le texte vers le <strong>centre vertical</strong> → Ligne <strong>horizontale</strong> pointillée apparaît</li>
          <li>Les lignes sont <strong>indépendantes</strong> et peuvent apparaître séparément</li>
          <li>Effet de <strong>magnétisme renforcé</strong> avec snapThreshold = 25px</li>
        </ul>
      </div>

      <div
        style={{
          position: 'relative',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: '3px solid #e5e7eb',
          backgroundColor: '#fafafa',
          margin: '20px 0',
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Lignes de référence pour visualiser le centre */}
        <div style={{
          position: 'absolute',
          left: `${canvasWidth / 2 - 1}px`,
          top: '0',
          width: '2px',
          height: '100%',
          backgroundColor: '#d1d5db',
          opacity: 0.3
        }} />
        <div style={{
          position: 'absolute',
          left: '0',
          top: `${canvasHeight / 2 - 1}px`,
          width: '100%',
          height: '2px',
          backgroundColor: '#d1d5db',
          opacity: 0.3
        }} />
        
        <DraggableTextElement
          initialX={textPosition.x}
          initialY={textPosition.y}
          text="📝 Texte avec Snapping"
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          snapThreshold={35}
          onPositionChange={handlePositionChange}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 }}>
          <strong>📍 Position actuelle:</strong><br />
          x = {Math.round(textPosition.x)}px, y = {Math.round(textPosition.y)}px
        </div>
        <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 }}>
          <strong>🎯 Centre du canvas:</strong><br />
          x = {canvasWidth / 2}px, y = {canvasHeight / 2}px
        </div>
      </div>
    </div>
  );
};

export default SnapTestComponent;