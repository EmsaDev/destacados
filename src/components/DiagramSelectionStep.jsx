import React, { useState } from 'react';
import styles from './DiagramSelectionStep.module.css';
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
    factorSiec: '', factorEncontrado: '', errorFactor: '', factorFinal: '' ,equipoPatron: ''
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
  const [informeTexto, setInformeTexto] = useState(data.informeTexto || '');

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
      informe,
      informeTexto
    });
    nextStep();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Información Técnica y Diagramas</h2>
        <p className={styles.subtitle}>Complete toda la información técnica requerida</p>
      </div>

      {/* Sección 1: Línea Dedicada y Tipo de Frontera */}
      <div className={styles.formSection}>
        <h3>Configuración de Línea</h3>
        <div className={`${styles.formRow} ${styles.twoColumns}`}>
          <div className={styles.formGroup}>
            <label className={styles.label}>¿Línea Dedicada?</label>
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                className={`${styles.btnOption} ${lineaDedicada === 'SI' ? styles.btnSelected : ''}`}
                onClick={() => setLineaDedicada('SI')}
              >
                Sí
              </button>
              <button 
                type="button" 
                className={`${styles.btnOption} ${lineaDedicada === 'NO' ? styles.btnSelected : ''}`}
                onClick={() => setLineaDedicada('NO')}
              >
                No
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Frontera</label>
            <select 
              value={tipoFrontera} 
              onChange={(e) => setTipoFrontera(e.target.value)}
              className={styles.formSelect}
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
      <div className={styles.formSection}>
        <h3>Selección de Diagramas</h3>
        
        <div className={styles.diagramSection}>
          <h4>Diagrama Unifilar</h4>
          <div className={styles.diagramGrid}>
            {diagramOptions.unifilar.map(diagram => (
              <div 
                key={diagram.id}
                className={`${styles.diagramCard} ${selectedDiagrams.unifilar === diagram.id ? styles.selected : ''}`}
                onClick={() => handleDiagramSelect('unifilar', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} className={styles.diagramImage} />
                <p className={styles.diagramName}>{diagram.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.diagramSection}>
          <h4>Diagrama Fasorial</h4>
          <div className={styles.diagramGrid}>
            {diagramOptions.fasorial.map(diagram => (
              <div 
                key={diagram.id}
                className={`${styles.diagramCard} ${selectedDiagrams.fasorial === diagram.id ? styles.selected : ''}`}
                onClick={() => handleDiagramSelect('fasorial', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} className={styles.diagramImage} />
                <p className={styles.diagramName}>{diagram.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.diagramSection}>
          <h4>Diagrama de Conexiones</h4>
          <div className={styles.diagramGrid}>
            {diagramOptions.conexiones.map(diagram => (
              <div 
                key={diagram.id}
                className={`${styles.diagramCard} ${selectedDiagrams.conexiones === diagram.id ? styles.selected : ''}`}
                onClick={() => handleDiagramSelect('conexiones', diagram.id, diagram.image)}
              >
                <img src={diagram.image} alt={diagram.name} className={styles.diagramImage} />
                <p className={styles.diagramName}>{diagram.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección 3: Prueba de Transformadores de Potencial (TP's) */}
      <div className={styles.formSection}>
        <h3>Prueba de Transformadores de Potencial (TP's)</h3>
        <div className={styles.testTable}>
          <table className={styles.table}>
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
                <td><input type="number" value={tpData.vRPrimario || ''} onChange={(e) => handleTpChange('vRPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vRSecundario || ''} onChange={(e) => handleTpChange('vRSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vRRtp || ''} onChange={(e) => handleTpChange('vRRtp', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.errorVR || ''} onChange={(e) => handleTpChange('errorVR', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>V_S</td>
                <td><input type="number" value={tpData.vSPrimario || ''} onChange={(e) => handleTpChange('vSPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vSSecundario || ''} onChange={(e) => handleTpChange('vSSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vSRtp || ''} onChange={(e) => handleTpChange('vSRtp', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.errorVS || ''} onChange={(e) => handleTpChange('errorVS', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>V_T</td>
                <td><input type="number" value={tpData.vTPrimario || ''} onChange={(e) => handleTpChange('vTPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vTSecundario || ''} onChange={(e) => handleTpChange('vTSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.vTRtp || ''} onChange={(e) => handleTpChange('vTRtp', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tpData.errorVT || ''} onChange={(e) => handleTpChange('errorVT', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.promedioLabel}>%PROMEDIO:</td>
                <td><input type="number" value={tpData.errorPromedio || ''} readOnly className={styles.readonlyInput} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 4: Prueba de Transformadores de Corriente (TC's) */}
      <div className={styles.formSection}>
        <h3>Prueba de Transformadores de Corriente (TC's)</h3>
        <div className={styles.testTable}>
          <table className={styles.table}>
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
                <td><input type="number" value={tcData.vRPrimario || ''} onChange={(e) => handleTcChange('vRPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vRSecundario || ''} onChange={(e) => handleTcChange('vRSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vRRtc || ''} onChange={(e) => handleTcChange('vRRtc', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.errorVR || ''} onChange={(e) => handleTcChange('errorVR', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>I_S</td>
                <td><input type="number" value={tcData.vSPrimario || ''} onChange={(e) => handleTcChange('vSPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vSSecundario || ''} onChange={(e) => handleTcChange('vSSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vSRtc || ''} onChange={(e) => handleTcChange('vSRtc', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.errorVS || ''} onChange={(e) => handleTcChange('errorVS', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td>I_T</td>
                <td><input type="number" value={tcData.vTPrimario || ''} onChange={(e) => handleTcChange('vTPrimario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vTSecundario || ''} onChange={(e) => handleTcChange('vTSecundario', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.vTRtc || ''} onChange={(e) => handleTcChange('vTRtc', e.target.value)} className={styles.numberInput} /></td>
                <td><input type="number" value={tcData.errorVT || ''} onChange={(e) => handleTcChange('errorVT', e.target.value)} className={styles.numberInput} /></td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.promedioLabel}>% ERROR PROMEDIO:</td>
                <td><input type="number" value={tcData.errorPromedio || ''} readOnly className={styles.readonlyInput} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 5: Factor SIEC */}
      <div className={styles.formSection}>
        <h3>Factor SIEC</h3>
        <div className={styles.factorGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Factor SIEC</label>
            <input type="number" step="0.001" value={factorData.factorSiec || ''} onChange={(e) => handleFactorChange('factorSiec', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Factor Encontrado</label>
            <input type="number" step="0.001" value={factorData.factorEncontrado || ''} onChange={(e) => handleFactorChange('factorEncontrado', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>% Error de Factor</label>
            <input type="number" step="0.001" value={factorData.errorFactor || ''} onChange={(e) => handleFactorChange('errorFactor', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Factor Final</label>
            <input type="number" step="0.001" value={factorData.factorFinal || ''} onChange={(e) => handleFactorChange('factorFinal', e.target.value)} className={styles.numberInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Equipo Patron</label>
            <input type="number" step="0.001" value={factorData.equipoPatron || ''} onChange={(e) => handleFactorChange('equipoPatron', e.target.value)} className={styles.numberInput} />
          </div>
        </div>
      </div>

     {/* Sección 6: Observaciones Generales */}
<div className={styles.formSection}>
  <h3>Observaciones Generales</h3>
  <div className={styles.observacionesGrid}>
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
      <div key={equipo.key} className={styles.observacionItem}>
        <label className={styles.observacionLabel}>{equipo.label}</label>
        <div className={styles.estadoButtons}>
          <button
            type="button"
            className={`${styles.estadoBtn} ${styles.estadoBtnBueno} ${observaciones[equipo.key] === 'Bueno' ? styles.selected : ''}`}
            onClick={() => handleObservacionChange(equipo.key, 'Bueno')}
            title="Bueno"
          >
            B
          </button>
          <button
            type="button"
            className={`${styles.estadoBtn} ${styles.estadoBtnRegular} ${observaciones[equipo.key] === 'Regular' ? styles.selected : ''}`}
            onClick={() => handleObservacionChange(equipo.key, 'Regular')}
            title="Regular"
          >
            R
          </button>
          <button
            type="button"
            className={`${styles.estadoBtn} ${styles.estadoBtnMalo} ${observaciones[equipo.key] === 'Malo' ? styles.selected : ''}`}
            onClick={() => handleObservacionChange(equipo.key, 'Malo')}
            title="Malo"
          >
            M
          </button>
        </div>
        <div className={styles.estadoIndicator}>
          {observaciones[equipo.key] && (
            <span className={`${styles.estadoText} ${styles[observaciones[equipo.key].toLowerCase()]}`}>
              {observaciones[equipo.key].charAt(0)}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Sección 7: Adecuaciones y Mejoras */}
      <div className={styles.formSection}>
        <h3>Adecuaciones y Mejoras</h3>
        <div className={styles.adecuacionesGrid}>
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
            <div key={item.id} className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={adecuaciones[item.id] || false} 
                  onChange={(e) => handleAdecuacionChange(item.id, e.target.checked)} 
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxText}>{item.label}</span>
              </label>
            </div>
          ))}
        </div>

        {adecuaciones.otros && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Especifique otros:</label>
            <input 
              type="text" 
              value={adecuaciones.otrosTexto || ''} 
              onChange={(e) => setAdecuaciones(prev => ({ ...prev, otrosTexto: e.target.value }))} 
              placeholder="Describa las otras adecuaciones necesarias"
              className={styles.textInput}
            />
          </div>
        )}
      </div>

      {/* Sección 8: Informe */}
      <div className={styles.formSection}>
        <h3>Informe</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de Informe</label>
          <select 
            value={informe} 
            onChange={(e) => setInforme(e.target.value)}
            className={styles.formSelect}
          >
            <option value="">Seleccionar tipo de informe...</option>
            <option value="instalacion_correcta">Instalación Correcta</option>
            <option value="instalacion_incorrecta">Instalación Incorrecta</option>
            <option value="medidor_incorrecto">Medidor Incorrecto</option>
            <option value="frontera_incorrecta">Frontera Incorrecta</option>
            <option value="otros">Otros</option>
          </select>
        </div>
  
      {/* Mostrar textarea solo si se selecciona "Otros" */}
      {informe === 'otros' && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Especifique el informe:</label>
          <textarea 
            value={informeTexto || ''} 
            onChange={(e) => setInformeTexto(e.target.value)} 
            placeholder="Describa el informe..."
            rows="4"
            className={styles.informeTextarea}
          />
        </div>
      )}
    </div>

      {/* Botones de navegación */}
      <div className={styles.navigationButtons}>
        <button className={styles.btnBack} onClick={prevStep}>
          ← Anterior
        </button>
        <button className={styles.btnPrimary} onClick={handleContinue}>
          Continuar a Firmas →
        </button>
      </div>
    </div>
  );
};

export default DiagramSelectionStep;