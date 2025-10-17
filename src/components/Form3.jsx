import React from 'react';
import './Form3.css'; // Crearemos este archivo CSS

const Form3 = ({ nextStep, prevStep }) => {

  return (
    <div className="placeholder-container">
      <div className="placeholder-content">
        {/* Icono o ilustración */}
        <div className="animation-container">
          <div className="construction-icon">🚧</div>
          <div className="pulse-animation"></div>
        </div>
        
        {/* Título principal */}
        <h1 className="placeholder-title">
          ¡Próximamente!
        </h1>
        
        {/* Subtítulo */}
        <p className="placeholder-subtitle">
          Esta sección está en desarrollo
        </p>
        
        {/* Descripción */}
        <div className="placeholder-description">
          <p>Estamos trabajando arduamente para traerte</p>
          <p>funcionalidades increíbles muy pronto.</p>
        </div>
        
        {/* Contador o progreso (opcional) */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">65% completado</span>
        </div>
        
        {/* Botón de acción */}
        <button 
          className="action-button"
          onClick={nextStep}
        >
          Ir a Acta de Diagramas →
        </button>
        
        {/* Botón de retroceso */}
        <button 
          className="action-button"
          onClick={prevStep}
        >
          ← Ir a Form2
        </button>
        
        {/* Elementos decorativos */}
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Form3;