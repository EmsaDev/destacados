import React, { useState } from 'react';
import './DiagramSelectionStep.css';
import unifilar from '../assets/images/unifilar/unifilar.png';
import fasorial from '../assets/images/fasorial/fasorial.png';
import conexiones from '../assets/images/conexiones/conexiones.png';

const DiagramSelectionStep = ({ data, updateData, nextStep, prevStep }) => {
  const [selectedDiagrams, setSelectedDiagrams] = useState({
    unifilar: data.diagramaUnifilar || '',
    fasorial: data.diagramaFasorial || '',
    conexiones: data.diagramaConexiones || ''
  });

  // Datos de ejemplo - reemplaza con tus imágenes reales
  const diagramOptions = {
    unifilar: [
      { id: 'unifilar1', name: 'Diagrama Unifilar 1', image: unifilar },
      { id: 'unifilar2', name: 'Diagrama Unifilar 2', image: '/imagenes/unifilar2.png' },
      { id: 'unifilar3', name: 'Diagrama Unifilar 3', image: '/imagenes/unifilar3.png' }
    ],
    fasorial: [
      { id: 'fasorial1', name: 'Diagrama Fasorial 1', image: fasorial },
      { id: 'fasorial2', name: 'Diagrama Fasorial 2', image: '/imagenes/fasorial2.png' },
      { id: 'fasorial3', name: 'Diagrama Fasorial 3', image: '/imagenes/fasorial3.png' }
    ],
    conexiones: [
      { id: 'conexiones1', name: 'Diagrama Conexiones 1', image: conexiones },
      { id: 'conexiones2', name: 'Diagrama Conexiones 2', image: '/imagenes/conexiones2.png' },
      { id: 'conexiones3', name: 'Diagrama Conexiones 3', image: '/imagenes/conexiones3.png' }
    ]
  };

  const handleDiagramSelect = (diagramType, diagramId) => {
    const updatedSelection = {
      ...selectedDiagrams,
      [diagramType]: diagramId
    };
    
    setSelectedDiagrams(updatedSelection);
    
    // Actualizar data del formulario
    updateData({
      diagramaUnifilar: updatedSelection.unifilar,
      diagramaFasorial: updatedSelection.fasorial,
      diagramaConexiones: updatedSelection.conexiones
    });
  };

  const handleContinue = () => {
    // Guardar selecciones antes de continuar
    updateData({
      diagramaUnifilar: selectedDiagrams.unifilar,
      diagramaFasorial: selectedDiagrams.fasorial,
      diagramaConexiones: selectedDiagrams.conexiones
    });
    nextStep();
  };

  return (
    <div className="diagram-selection-container">
      <h2>Selección de Diagramas</h2>
      <p className="subtitle">Seleccione los diagramas correspondientes para el acta</p>
      
      <div className="diagram-section">
        <h3>Diagrama Unifilar</h3>
        <div className="diagram-grid">
          {diagramOptions.unifilar.map(diagram => (
            <div 
              key={diagram.id}
              className={`diagram-card ${selectedDiagrams.unifilar === diagram.id ? 'selected' : ''}`}
              onClick={() => handleDiagramSelect('unifilar', diagram.id)}
            >
              <img src={diagram.image} alt={diagram.name} />
              <p>{diagram.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="diagram-section">
        <h3>Diagrama Fasorial</h3>
        <div className="diagram-grid">
          {diagramOptions.fasorial.map(diagram => (
            <div 
              key={diagram.id}
              className={`diagram-card ${selectedDiagrams.fasorial === diagram.id ? 'selected' : ''}`}
              onClick={() => handleDiagramSelect('fasorial', diagram.id)}
            >
              <img src={diagram.image} alt={diagram.name} />
              <p>{diagram.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="diagram-section">
        <h3>Diagrama de Conexiones</h3>
        <div className="diagram-grid">
          {diagramOptions.conexiones.map(diagram => (
            <div 
              key={diagram.id}
              className={`diagram-card ${selectedDiagrams.conexiones === diagram.id ? 'selected' : ''}`}
              onClick={() => handleDiagramSelect('conexiones', diagram.id)}
            >
              <img src={diagram.image} alt={diagram.name} />
              <p>{diagram.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="btn-back" onClick={prevStep}>
          ← Anterior
        </button>
        <button className="btn-primary" onClick={handleContinue}>
          Continuar a Firmas →
        </button>
      </div>
    </div>
  );
};

export default DiagramSelectionStep;