import React, { useState } from 'react';

const SnapDiagnostic: React.FC = () => {
  const [showVertical, setShowVertical] = useState(false);
  const [showHorizontal, setShowHorizontal] = useState(false);
  
  // Utiliser les vraies dimensions du projet en ratio réduit
  // 16:9 (1920x1080) réduit à une taille visible (640x360)
  const canvasWidth = 640;
  const canvasHeight = 360;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 Diagnostic des Lignes de Snapping</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowVertical(!showVertical)}
          style={{ 
            marginRight: '10px', 
            padding: '8px 16px', 
            backgroundColor: showVertical ? '#00A2FF' : '#e5e7eb',
            color: showVertical ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showVertical ? '✅' : '❌'} Ligne Verticale
        </button>
        
        <button 
          onClick={() => setShowHorizontal(!showHorizontal)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: showHorizontal ? '#00A2FF' : '#e5e7eb',
            color: showHorizontal ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showHorizontal ? '✅' : '❌'} Ligne Horizontale
        </button>
      </div>

      <div 
        style={{
          position: 'relative',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: '2px solid #ccc',
          backgroundColor: '#f8f8f8',
          margin: '20px 0',
          overflow: 'visible' // Important pour voir les lignes qui dépassent
        }}
      >
        {/* Ligne de référence grise pour le centre */}
        <div style={{
          position: 'absolute',
          left: `${canvasWidth / 2 - 0.5}px`,
          top: '0',
          width: '1px',
          height: '100%',
          backgroundColor: '#d1d5db',
          opacity: 0.5
        }} />
        <div style={{
          position: 'absolute',
          left: '0',
          top: `${canvasHeight / 2 - 0.5}px`,
          width: '100%',
          height: '1px',
          backgroundColor: '#d1d5db',
          opacity: 0.5
        }} />

        {/* Test de la ligne verticale */}
        {showVertical && (
          <div
            style={{
              position: 'absolute',
              left: `${canvasWidth / 2}px`,
              top: '0px',
              width: '1px',
              height: `${canvasHeight}px`,
              background: 'rgba(0, 162, 255, 0.8)',
              borderLeft: '1px dashed rgba(0, 162, 255, 0.9)',
              pointerEvents: 'none',
              zIndex: 999999,
              boxShadow: '0 0 2px rgba(0, 162, 255, 0.3)',
              opacity: 0.9,
            }}
          />
        )}
        
        {/* Test de la ligne horizontale */}
        {showHorizontal && (
          <div
            style={{
              position: 'absolute',
              left: '0px',
              top: `${canvasHeight / 2}px`,
              width: `${canvasWidth}px`,
              height: '1px',
              background: 'rgba(0, 162, 255, 0.8)',
              borderTop: '1px dashed rgba(0, 162, 255, 0.9)',
              pointerEvents: 'none',
              zIndex: 999999,
              boxShadow: '0 0 2px rgba(0, 162, 255, 0.3)',
              opacity: 0.9,
            }}
          />
        )}

        {/* Élément de test pour voir le z-index */}
        <div style={{
          position: 'absolute',
          left: '50px',
          top: '50px',
          width: '100px',
          height: '100px',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          border: '2px solid red',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}>
          Z-index: 1000
        </div>

        {/* Autre élément de test */}
        <div style={{
          position: 'absolute',
          right: '50px',
          bottom: '50px',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(0, 255, 0, 0.3)',
          border: '2px solid green',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}>
          Z-index: 100000
        </div>
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <h3>📊 Informations de Debug</h3>
        <ul>
          <li><strong>Canvas:</strong> {canvasWidth}x{canvasHeight}px</li>
          <li><strong>Centre vertical:</strong> x = {canvasWidth / 2}px</li>
          <li><strong>Centre horizontal:</strong> y = {canvasHeight / 2}px</li>
          <li><strong>Z-index lignes:</strong> 999999</li>
          <li><strong>Position:</strong> absolute</li>
          <li><strong>Overflow:</strong> visible</li>
        </ul>
      </div>
    </div>
  );
};

export default SnapDiagnostic;