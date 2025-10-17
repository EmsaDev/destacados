import React, { useState } from 'react';
import './DiagramSelectionStep.css';
// Importar imágenes de diagramas (ajusta las rutas según tu estructura)
//unifilar
import unifilar1 from '../assets/images/unifilar/unifilar.png';
import unifilar2 from '../assets/images/unifilar/unifilar2.png';
import unifilar3 from '../assets/images/unifilar/unifilar3.png';
//fasorial
import fasorial1 from '../assets/images/fasorial/fasorial.png';
import fasorial2 from '../assets/images/fasorial/fasorial2.png';
import fasorial3 from '../assets/images/fasorial/fasorial3.png';
//conexiones
import conexiones1 from '../assets/images/conexiones/conexiones.png';
import conexiones2 from '../assets/images/conexiones/conexiones2.png';
import conexiones3 from '../assets/images/conexiones/conexiones3.png';

const DiagramSelectionStep = ({ data, updateData, nextStep, prevStep }) => {
  // Estado para todas las secciones
  const [selectedDiagrams, setSelectedDiagrams] = useState({
    unifilar: data.diagramaUnifilar || '',
    fasorial: data.diagramaFasorial || '',
    conexiones: data.diagramaConexiones || ''
  });

  const [lineaDedicada, setLineaDedicada] = useState(data.lineaDedicada || '');
  const [tipoFrontera, setTipoFrontera] = useState(data.tipoFrontera || '');

  const [tpData, setTpData] = useState(data.tpData || {
    vRPrimario: '', vSPrimario: '', vTPrimario: '',
    vRSecundario: '', vSSecundario: '', vTSecundario: '',
    rtp: '', errorVR: '', errorVS: '', errorVT: '', errorPromedio: ''
  });

  const [tcData, setTcData] = useState(data.tcData || {
    vRPrimario: '', vSPrimario: '', vTPrimario: '',
    vRSecundario: '', vSSecundario: '', vTSecundario: '',
    rtc: '', errorVR: '', errorVS: '', errorVT: '', errorPromedio: ''
  });

  const [factorData, setFactorData] = useState(data.factorData || {
    factorSiec: '', factorEncontrado: '', errorFactor: '', factorFinal: ''
  });

  const [observaciones, setObservaciones] = useState(data.observaciones || {
    redMT: '', redBT: '', crucetas: '', pararrayos: '', cortacircuitos: '',
    fusibles: '', bajantes: '', transformador: '', tps: '', tcs: '',
    bloquesPrueba: '', celda: '', gabinetes: '', modem: '', cableSenal: ''
  });

  const [adecuaciones, setAdecuaciones] = useState(data.adecuaciones || {
      cambiarMedidor: false, 
      instalarMedidor: false,
      cambiarCaja: false, 
      instalarCaja: false,
      cambiarPuestaTierra: false, 
      instalarPuestaTierra: false,
      cambiaroInstalarMedidor: false,
      cambiaroInstalarCaja: false,
      cambiaroInstalarPuestaTierra: false,
      cambiaroInstalarBloquePruebas: false,
      cambiaroInstalarProteccionesElectricas: false,
      cambiaroInstalarCableSenal: false,
      adecuaroInstalaraSeguridadCeldas: false,
      cambiaroInstalarCelda: false,
      cambiaroInstalarSistemaComunicacion: false,
      cambiaroInstalarModem: false,
      cambiaroInstalarProteccionesCommunicacion: false,
      cambiaroInstalarDuctosCableSeñal: false,
      otros: false, 
      otrosTexto: ''
  });

  const [informe, setInforme] = useState(data.informe || '');

  // Opciones para selects
  const opcionesFrontera = ['MCM', 'RGP', 'NRP', 'NRO', 'REGO', 'SNT', 'CAMB COM'];
  const opcionesEstado = ['Bueno', 'Regular', 'Malo'];

  // Datos de diagramas
  const diagramOptions = {
    unifilar: [
      { id: 'unifilar1', name: 'Diagrama Unifilar 1', image: unifilar1 },
      { id: 'unifilar2', name: 'Diagrama Unifilar 2', image: unifilar2 },
      { id: 'unifilar3', name: 'Diagrama Unifilar 3', image: unifilar3 }
    ],
    fasorial: [
      { id: 'fasorial1', name: 'Diagrama Fasorial 1', image: fasorial1},
      { id: 'fasorial2', name: 'Diagrama Fasorial 2', image: fasorial2},
      { id: 'fasorial3', name: 'Diagrama Fasorial 3', image: fasorial3}
    ],
    conexiones: [
      { id: 'conexiones1', name: 'Diagrama Conexiones 1', image: conexiones1 },
      { id: 'conexiones2', name: 'Diagrama Conexiones 2', image: conexiones2 },
      { id: 'conexiones3', name: 'Diagrama Conexiones 3', image: conexiones3 }
    ]
  };

  // Función para guardar imagen en localStorage (igual que las firmas)
  const saveImageToLocalStorage = async (key, imageSrc) => {
    try {
      // Convertir la imagen a base64
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = function() {
        localStorage.setItem(key, reader.result);
      }
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error guardando imagen en localStorage:', error);
    }
  };

  // Handlers
  const handleDiagramSelect = async (diagramType, diagramId, imageSrc) => {
    const updatedSelection = {
      ...selectedDiagrams,
      [diagramType]: diagramId
    };
    setSelectedDiagrams(updatedSelection);
    
    // Guardar la imagen en localStorage (igual que las firmas)
    await saveImageToLocalStorage(`diagrama_${diagramType}`, imageSrc);
  };

  const handleTpChange = (field, value) => {
    const updated = { ...tpData, [field]: value };
    setTpData(updated);
    
    // Calcular % error promedio si todos los campos están llenos
    if (updated.errorVR && updated.errorVS && updated.errorVT) {
      const promedio = ((parseFloat(updated.errorVR) + parseFloat(updated.errorVS) + parseFloat(updated.errorVT)) / 3).toFixed(2);
      setTpData(prev => ({ ...prev, errorPromedio: promedio }));
    }
  };

  const handleTcChange = (field, value) => {
    const updated = { ...tcData, [field]: value };
    setTcData(updated);
    
    if (updated.errorVR && updated.errorVS && updated.errorVT) {
      const promedio = ((parseFloat(updated.errorVR) + parseFloat(updated.errorVS) + parseFloat(updated.errorVT)) / 3).toFixed(2);
      setTcData(prev => ({ ...prev, errorPromedio: promedio }));
    }
  };

  const handleFactorChange = (field, value) => {
    setFactorData(prev => ({ ...prev, [field]: value }));
  };

  const handleObservacionChange = (equipo, valor) => {
    setObservaciones(prev => ({ ...prev, [equipo]: valor }));
  };

  const handleAdecuacionChange = (tipo, checked) => {
    setAdecuaciones(prev => ({ ...prev, [tipo]: checked }));
  };

  const handleContinue = () => {
    // Guardar todos los datos antes de continuar
    updateData({
      diagramaUnifilar: selectedDiagrams.unifilar,
      diagramaFasorial: selectedDiagrams.fasorial,
      diagramaConexiones: selectedDiagrams.conexiones,
      lineaDedicada,
      tipoFrontera,
      tpData,
      tcData,
      factorData,
      observaciones,
      adecuaciones,
      informe
    });
    nextStep();
  };

  return (
    <div className="diagram-selection-container">
      <h2>Información Técnica y Diagramas</h2>
      <p className="subtitle">Complete toda la información técnica requerida</p>

      {/* Sección 1: Línea Dedicada y Tipo de Frontera */}
      <div className="form-section">
        <h3>Configuración de Línea</h3>
        <div className="form-row">
          <div className="form-group">
            <label>¿Línea Dedicada?</label>
            <div className="button-group">
              <button 
                type="button" 
                className={lineaDedicada === 'SI' ? 'btn-selected' : 'btn-option'}
                onClick={() => setLineaDedicada('SI')}
              >
                Sí
              </button>
              <button 
                type="button" 
                className={lineaDedicada === 'NO' ? 'btn-selected' : 'btn-option'}
                onClick={() => setLineaDedicada('NO')}
              >
                No
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de Frontera</label>
            <select 
              value={tipoFrontera} 
              onChange={(e) => setTipoFrontera(e.target.value)}
              className="form-select"
            >
              <option value="">Seleccionar...</option>
              {opcionesFrontera.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección 2: Diagramas */}
      <div className="form-section">
        <h3>Selección de Diagramas</h3>
        
        <div className="diagram-section">
          <h4>Diagrama Unifilar</h4>
          <div className="diagram-grid">
            {diagramOptions.unifilar.map(diagram => (
              <div 
                key={diagram.id}
                className={`diagram-card ${selectedDiagrams.unifilar === diagram.id ? 'selected' : ''}`}
                onClick={() => handleDiagramSelect('unifilar', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} />
                <p>{diagram.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-section">
          <h4>Diagrama Fasorial</h4>
          <div className="diagram-grid">
            {diagramOptions.fasorial.map(diagram => (
              <div 
                key={diagram.id}
                className={`diagram-card ${selectedDiagrams.fasorial === diagram.id ? 'selected' : ''}`}
                onClick={() => handleDiagramSelect('fasorial', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} />
                <p>{diagram.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="diagram-section">
          <h4>Diagrama de Conexiones</h4>
          <div className="diagram-grid">
            {diagramOptions.conexiones.map(diagram => (
              <div 
                key={diagram.id}
                className={`diagram-card ${selectedDiagrams.conexiones === diagram.id ? 'selected' : ''}`}
                onClick={() => handleDiagramSelect('conexiones', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} />
                <p>{diagram.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección 3: Prueba de Transformadores de Potencial (TP's) */}
      <div className="form-section">
        <h3>Prueba de Transformadores de Potencial (TP's)</h3>
        <div className="test-table">
          <table>
            <thead>
              <tr>
                <th>Voltaje</th>
                <th>Primario</th>
                <th>Secundario</th>
                <th>RTP (Vp/VS)</th>
                <th>% ERROR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>V_R</td>
                <td><input type="number" value={tpData.vRPrimario} onChange={(e) => handleTpChange('vRPrimario', e.target.value)} /></td>
                <td><input type="number" value={tpData.vRSecundario} onChange={(e) => handleTpChange('vRSecundario', e.target.value)} /></td>
                <td><input type="number" value={tpData.vRRtp} onChange={(e) => handleTpChange('vRRtp', e.target.value)} /></td>
                <td><input type="number" value={tpData.errorVR} onChange={(e) => handleTpChange('errorVR', e.target.value)} /></td>
              </tr>
              <tr>
                <td>V_S</td>
                <td><input type="number" value={tpData.vSPrimario} onChange={(e) => handleTpChange('vSPrimario', e.target.value)} /></td>
                <td><input type="number" value={tpData.vSSecundario} onChange={(e) => handleTpChange('vSSecundario', e.target.value)} /></td>
                <td><input type="number" value={tpData.vSRtp} onChange={(e) => handleTpChange('vSRtp', e.target.value)} /></td>
                <td><input type="number" value={tpData.errorVS} onChange={(e) => handleTpChange('errorVS', e.target.value)} /></td>
              </tr>
              <tr>
                <td>V_T</td>
                <td><input type="number" value={tpData.vTPrimario} onChange={(e) => handleTpChange('vTPrimario', e.target.value)} /></td>
                <td><input type="number" value={tpData.vTSecundario} onChange={(e) => handleTpChange('vTSecundario', e.target.value)} /></td>
                <td><input type="number" value={tpData.vTRtp} onChange={(e) => handleTpChange('vTRtp', e.target.value)} /></td>
                <td><input type="number" value={tpData.errorVT} onChange={(e) => handleTpChange('errorVT', e.target.value)} /></td>
              </tr>
              <tr>
                <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>%PROMEDIO:</td>
                <td><input type="number" value={tpData.errorPromedio} readOnly className="readonly-input" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 4: Prueba de Transformadores de Corriente (TC's) */}
      <div className="form-section">
        <h3>Prueba de Transformadores de Corriente (TC's)</h3>
        <div className="test-table">
          <table>
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Primario</th>
                <th>Secundario</th>
                <th>RTC (Ip/IS)</th>
                <th>% ERROR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>I_R</td>
                <td><input type="number" value={tcData.vRPrimario} onChange={(e) => handleTcChange('vRPrimario', e.target.value)} /></td>
                <td><input type="number" value={tcData.vRSecundario} onChange={(e) => handleTcChange('vRSecundario', e.target.value)} /></td>
                <td><input type="number" value={tcData.vRRtc} onChange={(e) => handleTcChange('vRRtc', e.target.value)} /></td>
                <td><input type="number" value={tcData.errorVR} onChange={(e) => handleTcChange('errorVR', e.target.value)} /></td>
              </tr>
              <tr>
                <td>I_S</td>
                <td><input type="number" value={tcData.vSPrimario} onChange={(e) => handleTcChange('vSPrimario', e.target.value)} /></td>
                <td><input type="number" value={tcData.vSSecundario} onChange={(e) => handleTcChange('vSSecundario', e.target.value)} /></td>
                <td><input type="number" value={tcData.vSRtc} onChange={(e) => handleTcChange('vSRtc', e.target.value)} /></td>
                <td><input type="number" value={tcData.errorVS} onChange={(e) => handleTcChange('errorVS', e.target.value)} /></td>
              </tr>
              <tr>
                <td>I_T</td>
                <td><input type="number" value={tcData.vTPrimario} onChange={(e) => handleTcChange('vTPrimario', e.target.value)} /></td>
                <td><input type="number" value={tcData.vTSecundario} onChange={(e) => handleTcChange('vTSecundario', e.target.value)} /></td>
                <td><input type="number" value={tcData.vTRtc} onChange={(e) => handleTcChange('vTRtc', e.target.value)} /></td>
                <td><input type="number" value={tcData.errorVT} onChange={(e) => handleTcChange('errorVT', e.target.value)} /></td>
              </tr>
              <tr>
                <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>% ERROR PROMEDIO:</td>
                <td><input type="number" value={tcData.errorPromedio} readOnly className="readonly-input" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 5: Factor SIEC */}
      <div className="form-section">
        <h3>Factor SIEC</h3>
        <div className="factor-grid">
          <div className="form-group">
            <label>Factor SIEC</label>
            <input type="number" step="0.001" value={factorData.factorSiec} onChange={(e) => handleFactorChange('factorSiec', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Factor Encontrado</label>
            <input type="number" step="0.001" value={factorData.factorEncontrado} onChange={(e) => handleFactorChange('factorEncontrado', e.target.value)} />
          </div>
          <div className="form-group">
            <label>% Error de Factor</label>
            <input type="number" step="0.001" value={factorData.errorFactor} onChange={(e) => handleFactorChange('errorFactor', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Factor Final</label>
            <input type="number" step="0.001" value={factorData.factorFinal} onChange={(e) => handleFactorChange('factorFinal', e.target.value)} />
          </div>
        </div>
      </div>

     {/* Sección 6: Observaciones Generales */}
<div className="form-section">
  <h3>Observaciones Generales</h3>
  <div className="observaciones-grid">
    {[
      { key: 'redMT', label: 'Red MT ( ) BT ( )' },
      { key: 'crucetas', label: 'Crucetas' },
      { key: 'pararrayos', label: 'Pararrayos' },
      { key: 'cortacircuitos', label: 'Cortacircuitos' },
      { key: 'fusibles', label: 'Fusibles' },
      { key: 'bajantes', label: 'Bajantes' },
      { key: 'transformador', label: 'Transformador' },
      { key: 'tps', label: 'TPs' },
      { key: 'tcs', label: 'TCs' },
      { key: 'bloquesPrueba', label: 'Bloques de Prueba' },
      { key: 'celda', label: 'Celda' },
      { key: 'gabinetes', label: 'Gabinetes' },
      { key: 'modem', label: 'Modem' },
      { key: 'cableSenal', label: 'Cable de Señal' }
    ].map(equipo => (
      <div key={equipo.key} className="observacion-item">
        <label className="observacion-label">{equipo.label}</label>
        <div className="estado-buttons">
          <button
            type="button"
            className={`estado-btn ${observaciones[equipo.key] === 'Bueno' ? 'estado-btn-bueno selected' : 'estado-btn-bueno'}`}
            onClick={() => handleObservacionChange(equipo.key, 'Bueno')}
            title="Bueno"
          >
            B
          </button>
          <button
            type="button"
            className={`estado-btn ${observaciones[equipo.key] === 'Regular' ? 'estado-btn-regular selected' : 'estado-btn-regular'}`}
            onClick={() => handleObservacionChange(equipo.key, 'Regular')}
            title="Regular"
          >
            R
          </button>
          <button
            type="button"
            className={`estado-btn ${observaciones[equipo.key] === 'Malo' ? 'estado-btn-malo selected' : 'estado-btn-malo'}`}
            onClick={() => handleObservacionChange(equipo.key, 'Malo')}
            title="Malo"
          >
            M
          </button>
        </div>
        <div className="estado-indicator">
          {observaciones[equipo.key] && (
            <span className={`estado-text ${observaciones[equipo.key].toLowerCase()}`}>
              {observaciones[equipo.key].charAt(0)}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Sección 7: Adecuaciones y Mejoras */}
      <div className="form-section">
        <h3>Adecuaciones y Mejoras</h3>
        <div className="adecuaciones-grid">
          {[
            { id: 'cambiaroInstalarMedidor', label: 'Cambiar o Instalar medidor' },
            { id: 'cambiaroInstalarCaja', label: 'Cambiar o Instalar caja para el medidor' },
            { id: 'cambiaroInstalarPuestaTierra', label: 'Cambiar o Instalar sistema de puesta de tierra' },
            {id:'cambiaroInstalarBloquePruebas', label:'Cambiar o Instalar bloque de prueba'},
            {id:'cambiaroInstalarProteccionesElectricas', label:'Cambiar o Instalar protecciones electricas'},
            {id:'cambiaroInstalarCableSenal', label:'Cambiar o Instalar cable de señal (segun norma)'},
            {id:'adecuaroInstalaraSeguridadCeldas', label:'Adecuar o Instalar seguridad en las celdas de medida'},
            {id:'cambiaroInstalarCelda', label:'Cambiar o Instalar celda para medida(TP´S y TC´S) norma'},
            {id:'cambiaroInstalarSistemaComunicacion', label:'Cambiar o Instalar sistema de comunicación'},
            {id:'cambiaroInstalarModem', label:'Cambiar o Instalar MODEM'},
            {id:'cambiaroInstalarProteccionesCommunicacion', label:'Cambiar o Instalar protecciones en comunicaciones'},
            {id:'cambiaroInstalarDuctosCableSeñal', label:'Cambiar o Instalar ductos para cable de señal'},
            { id: 'otros', label: 'Otros' }
          ].map(item => (
            <div key={item.id} className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={adecuaciones[item.id] || false} 
                  onChange={(e) => handleAdecuacionChange(item.id, e.target.checked)} 
                />
                {item.label}
              </label>
            </div>
          ))}
        </div>

        {adecuaciones.otros && (
          <div className="form-group">
            <label>Especifique otros:</label>
            <input 
              type="text" 
              value={adecuaciones.otrosTexto || ''} 
              onChange={(e) => setAdecuaciones(prev => ({ ...prev, otrosTexto: e.target.value }))} 
              placeholder="Describa las otras adecuaciones necesarias"
            />
          </div>
        )}
      </div>

      {/* Sección 8: Informe */}
      <div className="form-section">
        <h3>Informe</h3>
        <div className="form-group">
          <textarea 
            value={informe} 
            onChange={(e) => setInforme(e.target.value)} 
            placeholder="Escriba aquí el informe completo..."
            rows="6"
            className="informe-textarea"
          />
        </div>
      </div>

      {/* Botones de navegación */}
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