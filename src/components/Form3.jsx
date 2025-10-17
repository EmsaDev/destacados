import React from 'react';
import './Form3.css'; // Crearemos este archivo CSS

/*
const Form3 = ({ nextStep, prevStep }) => {

  return (
    <div className="placeholder-container">
      <div className="placeholder-content">
        {/* Icono o ilustración *}
        <div className="animation-container">
          <div className="construction-icon">🚧</div>
          <div className="pulse-animation"></div>
        </div>
        
        {/* Título principal *}
        <h1 className="placeholder-title">
          ¡Próximamente!
        </h1>
        
        {/* Subtítulo *}
        <p className="placeholder-subtitle">
          Esta sección está en desarrollo
        </p>
        
        {/* Descripción *}
        <div className="placeholder-description">
          <p>Estamos trabajando arduamente para traerte</p>
          <p>funcionalidades increíbles muy pronto.</p>
        </div>
        
        {/* Contador o progreso (opcional) *}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">65% completado</span>
        </div>
        
        {/* Botón de acción *}
        <button 
          className="action-button"
          onClick={nextStep}
        >
          Ir a Acta de Diagramas →
        </button>
        
        {/* Botón de retroceso *}
        <button 
          className="action-button"
          onClick={prevStep}
        >
          ← Ir a form3
        </button>
        
        {/* Elementos decorativos *}
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Form3;
*/

import './Form3.css';

const Form3 = ({ data, updateData, onNext, onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="form3-container">
      <h2>Relación de Sellos</h2>
      
      <form onSubmit={handleSubmit}>
        {/* TAPA PRINCIPAL ENCONTRADOS */}
        <div className="section">
          <h3>Med Activa Tapa Principal Encontrados</h3>
          <div className="input-group">
            <label>Tipo/Col</label>
            <div className="input-row">
              <input type="text" name="tapaPrincipal_tipoCol1" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_tipoCol2" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_tipoCol3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>Número</label>
            <div className="input-row">
              <input type="text" name="tapaPrincipal_numero1" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_numero2" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_numero3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>E</label>
            <div className="input-row">
              <input type="text" name="tapaPrincipal_E1" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_E2" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_E3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>R</label>
            <div className="input-row">
              <input type="text" name="tapaPrincipal_R1" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_R2" onChange={handleChange} />
              <input type="text" name="tapaPrincipal_R3" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* TAPA PRINCIPAL INSTALADOS */}
        <div className="section">
          <h3>Med Activa Tapa Principal Instalados</h3>
          <div className="input-group">
            <label>Tipo/Col</label>
            <div className="input-row">
              <input type="text" name="tapaPrincipalInst_tipoCol1" onChange={handleChange} />
              <input type="text" name="tapaPrincipalInst_tipoCol2" onChange={handleChange} />
              <input type="text" name="tapaPrincipalInst_tipoCol3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>Número</label>
            <div className="input-row">
              <input type="text" name="tapaPrincipalInst_numero1" onChange={handleChange} />
              <input type="text" name="tapaPrincipalInst_numero2" onChange={handleChange} />
              <input type="text" name="tapaPrincipalInst_numero3" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* TAPA BORNERA ENCONTRADOS */}
        <div className="section">
          <h3>Tapa Bornera Encontrados</h3>
          <div className="input-group">
            <label>Tipo/Col</label>
            <div className="input-row">
              <input type="text" name="tapaBornera_tipoCol1" onChange={handleChange} />
              <input type="text" name="tapaBornera_tipoCol2" onChange={handleChange} />
              <input type="text" name="tapaBornera_tipoCol3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>Número</label>
            <div className="input-row">
              <input type="text" name="tapaBornera_numero1" onChange={handleChange} />
              <input type="text" name="tapaBornera_numero2" onChange={handleChange} />
              <input type="text" name="tapaBornera_numero3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>E</label>
            <div className="input-row">
              <input type="text" name="tapaBornera_E1" onChange={handleChange} />
              <input type="text" name="tapaBornera_E2" onChange={handleChange} />
              <input type="text" name="tapaBornera_E3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>R</label>
            <div className="input-row">
              <input type="text" name="tapaBornera_R1" onChange={handleChange} />
              <input type="text" name="tapaBornera_R2" onChange={handleChange} />
              <input type="text" name="tapaBornera_R3" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* TAPA BORNERA INSTALADOS */}
        <div className="section">
          <h3>Tapa Bornera Instalados</h3>
          <div className="input-group">
            <label>Tipo/Col</label>
            <div className="input-row">
              <input type="text" name="tapaBorneraInst_tipoCol1" onChange={handleChange} />
              <input type="text" name="tapaBorneraInst_tipoCol2" onChange={handleChange} />
              <input type="text" name="tapaBorneraInst_tipoCol3" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>Número</label>
            <div className="input-row">
              <input type="text" name="tapaBorneraInst_numero1" onChange={handleChange} />
              <input type="text" name="tapaBorneraInst_numero2" onChange={handleChange} />
              <input type="text" name="tapaBorneraInst_numero3" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* BLOQUE DE PRUEBAS ENCONTRADOS */}
        <div className="section">
          <h3>Bloque de Pruebas Encontrados</h3>
          <div className="input-group">
            <label>Tipo/Col</label>
            <div className="input-row">
              <input type="text" name="bloquePruebas_tipoCol1" onChange={handleChange} />
              <input type="text" name="bloquePruebas_tipoCol2" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>Número</label>
            <div className="input-row">
              <input type="text" name="bloquePruebas_numero1" onChange={handleChange} />
              <input type="text" name="bloquePruebas_numero2" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>E</label>
            <div className="input-row">
              <input type="text" name="bloquePruebas_E1" onChange={handleChange} />
              <input type="text" name="bloquePruebas_E2" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>R</label>
            <div className="input-row">
              <input type="text" name="bloquePruebas_R1" onChange={handleChange} />
              <input type="text" name="bloquePruebas_R2" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* BLOQUE DE PRUEBAS INSTALADOS */}
        <div className="section">
          <h3>Bloque de Pruebas Instalados</h3>
          <div className="input-group">
            <label>Tipo Color</label>
            <div className="input-row">
              <input type="text" name="bloquePruebasInst_tipoColor1" onChange={handleChange} />
              <input type="text" name="bloquePruebasInst_tipoColor2" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label>Número</label>
            <div className="input-row">
              <input type="text" name="bloquePruebasInst_numero1" onChange={handleChange} />
              <input type="text" name="bloquePruebasInst_numero2" onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-navigation">
          <button type="button" onClick={onBack} className="back-button">
            Anterior
          </button>
          <button type="submit" className="next-button">
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form3;