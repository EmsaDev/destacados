import React, { useState } from 'react';
import './Form2.css';

const Form2 = ({ data, updateData, nextStep, prevStep }) => {
  // Estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    telefono: data.telefono || '',
    uso: data.uso || '',
    direccion: data.direccion || '',
    nombre: data.nombre || '',
    ubicacion: data.ubicacion || '',
    familias: data.familias || '',
    nivelTension: data.nivelTension || '',
    bloquesPrueba: data.bloquesPrueba || '',
    tipoMedidor: data.tipoMedidor || '',
    tipoInstalacion: data.tipoInstalacion || '',
    ubicacionMedidor: data.ubicacionMedidor || '',
    proteccionGeneral: data.proteccionGeneral || '',
    hF: data.hF || '',
    acometidaTipo: data.acometidaTipo || '',
    acometidaLongitud: data.acometidaLongitud || '',
    acometidaCalibre: data.acometidaCalibre || '',
    modemUbicacion: data.modemUbicacion || '',
    configuracionMedida: data.configuracionMedida || '',
    tipoMedida: data.tipoMedida || '',
    // Datos de medidor encontrado
    medidorEncontrado: data.medidorEncontrado || {
      // Activa1
      numeroActiva1: '', marcaActiva1: '', tipoActiva1: '', capacidadActiva1: '', 
      tensionActiva1: '', claseActiva1: '', kdActiva1: '', khActiva1: '', 
      lecturaActiva1: '', edActiva1: '', fechaLabActiva1: '',
      
      // Activa2
      numeroActiva2: '', marcaActiva2: '', tipoActiva2: '', capacidadActiva2: '', 
      tensionActiva2: '', claseActiva2: '', kdActiva2: '', khActiva2: '', 
      lecturaActiva2: '', edActiva2: '', fechaLabActiva2: '',
      
      // Reactiva
      numeroReactiva: '', marcaReactiva: '', tipoReactiva: '', capacidadReactiva: '', 
      tensionReactiva: '', claseReactiva: '', kdReactiva: '', khReactiva: '', 
      lecturaReactiva: '', edReactiva: '', fechaLabReactiva: ''
    },
    
    // Datos de medidor instalado
    medidorInstalado: data.medidorInstalado || {
      // Activa1
      numeroActiva1: '', marcaActiva1: '', tipoActiva1: '', capacidadActiva1: '', 
      tensionActiva1: '', claseActiva1: '', kdActiva1: '', khActiva1: '', 
      lecturaActiva1: '', edActiva1: '', fechaLabActiva1: '',
      
      // Activa2
      numeroActiva2: '', marcaActiva2: '', tipoActiva2: '', capacidadActiva2: '', 
      tensionActiva2: '', claseActiva2: '', kdActiva2: '', khActiva2: '', 
      lecturaActiva2: '', edActiva2: '', fechaLabActiva2: '',
      
      // Reactiva
      numeroReactiva: '', marcaReactiva: '', tipoReactiva: '', capacidadReactiva: '', 
      tensionReactiva: '', claseReactiva: '', kdReactiva: '', khReactiva: '', 
      lecturaReactiva: '', edReactiva: '', fechaLabReactiva: ''
    },
    // Datos de transformador de potencia
    transformador: data.transformador || {
      numero: '', marca: '', kva: '', año: '', v1v2: '', propietario: '', circuito: ''
    }
  });

  // Opciones para selects
  const opcionesUso = ['R', 'C', 'I', 'O'];
  const opcionesUbicacion = ['Rural', 'Urbano'];
  const opcionesFamilias = ['1', '2', '3', '4'];
  const opcionesNivelTension = ['I', 'II', 'III', 'IV'];
  const opcionesSiNo = ['SI', 'NO'];
  const opcionesTipoMedidor = ['ELECTRÓNICO', 'ELECTROMECÁNICO'];
  const opcionesInteriorExterior = ['INTERIOR', 'EXTERIOR'];
  const opcionesAcometida = ['ÁREA', 'SUBTERRÁNEA'];
  const opcionesConfiguracion = ['2 ELEM', '3 ELEM'];
  const opcionesTipoMedida = ['DIRECTA', 'SEMIINDIRECTA', 'INDIRECTA'];
  const opcionesPropietario = ['EMSA', 'PARTICULAR'];

  // Handler para cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handler para cambios en objetos anidados
  const handleNestedChange = (objectName, field, value) => {
    setFormData(prev => ({
      ...prev,
      [objectName]: {
        ...prev[objectName],
        [field]: value
      }
    }));
  };

  

  return (
    <div className="form2-container">
      <div className="form-section">
  <h3>Datos generales</h3>
  <div className="datos-generales-grid">
    <div className="form-group">
      <label>Nombre</label>
      <input 
        type="text" 
        value={formData.nombre || data.nombre || ''} 
        onChange={(e) => handleChange('nombre', e.target.value)} 
        placeholder="Ingrese el nombre"
      />
    </div>
    <div className="form-group">
      <label>Dirección de la población</label>
      <input 
        type="text" 
        value={formData.direccion || data.direccion || ''} 
        onChange={(e) => handleChange('direccion', e.target.value)} 
        placeholder={data.direccion}
      />
    </div>
    <div className="form-group">
      <label>Carga Kw</label>
      <input 
        type="text" 
        value={formData.cargaKw} 
        onChange={(e) => handleChange('cargaKw', e.target.value)} 
        placeholder="Ingrese carga Kw"
      />
    </div>
    <div className="form-group">
      <label>Ciclo</label>
      <input 
        type="text" 
        value={formData.ciclo} 
        onChange={(e) => handleChange('ciclo', e.target.value)} 
        placeholder="Ingrese ciclo"
      />
    </div>
    <div className="form-group">
      <label>Factor</label>
      <input 
        type="text" 
        value={formData.factor1} 
        onChange={(e) => handleChange('factor1', e.target.value)} 
        placeholder="Ingrese factor"
      />
    </div>
    <div className="form-group">
      <label>Factor</label>
      <input 
        type="text" 
        value={formData.factor2} 
        onChange={(e) => handleChange('factor2', e.target.value)} 
        placeholder="Ingrese factor"
      />
    </div>
    <div className="form-group">
      <label>Factor</label>
      <input 
        type="text" 
        value={formData.factor3} 
        onChange={(e) => handleChange('factor3', e.target.value)} 
        placeholder="Ingrese factor"
      />
    </div>
    <div className="form-group">
      <label>Numero de macromedidor</label>
      <input 
        type="text" 
        value={formData.macromedidor} 
        onChange={(e) => handleChange('macromedidor', e.target.value)} 
        placeholder="Ingrese macromedidor"
      />
    </div>
    <div className="form-group">
      <label>Nodo trafo</label>
      <input 
        type="text" 
        value={formData.nodoTrafo} 
        onChange={(e) => handleChange('nodoTrafo', e.target.value)} 
        placeholder="Ingrese nodo trafo"
      />
    </div>
    <div className="form-group">
      <label>Comercializador</label>
      <input 
        type="text" 
        value={formData.comercializador} 
        onChange={(e) => handleChange('comercializador', e.target.value)} 
        placeholder="Ingrese comercializador"
      />
    </div>
  </div>
        <h3>Datos del suscriptor y Equipos de Medida Encontrados</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="text" 
              value={formData.telefono} 
              onChange={(e) => handleChange('telefono', e.target.value)} 
              placeholder="Ingrese teléfono"
            />
          </div>
        

          <div className="form-group">
            <label>Uso</label>
            <div className="button-group">
              {opcionesUso.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.uso === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('uso', opcion)}
                >
                  {opcion} {opcion === 'R' ? '(Residencial)' : opcion === 'C' ? '(Comercial)' : opcion === 'I' ? '(Industrial)' : '(Oficial)'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Ubicación</label>
            <div className="button-group">
              {opcionesUbicacion.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.ubicacion === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('ubicacion', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Familias</label>
            <div className="button-group">
              {opcionesFamilias.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.familias === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('familias', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Nivel de Tensión</label>
            <div className="button-group">
              {opcionesNivelTension.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.nivelTension === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('nivelTension', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Bloques de Prueba</label>
            <div className="button-group">
              {opcionesSiNo.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.bloquesPrueba === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('bloquesPrueba', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Sección 2: Protección y Acometida */}
      <div className="form-section">
        <h3>Tipo de Instalación y Medidor</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Medidor</label>
            <div className="button-group">
              {opcionesTipoMedidor.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.tipoMedidor === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('tipoMedidor', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de Instalación</label>
            <div className="button-group">
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.tipoInstalacion === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('tipoInstalacion', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <h3>Ubicación del Medidor</h3>
            <div className="button-group">
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.ubicacionMedidor === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('ubicacionMedidor', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      <div className="form-section">
        
        <h3>Protección y Acometida</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Protección General (A)</label>
            <input 
              type="text" 
              value={formData.proteccionGeneral} 
              onChange={(e) => handleChange('proteccionGeneral', e.target.value)} 
              placeholder="Ej: 100A"
            />
          </div>

          <div className="form-group">
            <label>Tipo de Acometida</label>
            <select 
              value={formData.acometidaTipo} 
              onChange={(e) => handleChange('acometidaTipo', e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {opcionesAcometida.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
        </div>

          <div className="form-group">
            <label>#F #H</label>
            <input 
              type="text" 
              value={formData.hf} 
              onChange={(e) => handleChange('proteccionGeneral', e.target.value)} 
              placeholder="Ej: "
            />
          </div>

        <div className="form-row">
          <div className="form-group">
            <label>Longitud Acometida (M)</label>
            <input 
              type="number" 
              value={formData.acometidaLongitud} 
              onChange={(e) => handleChange('acometidaLongitud', e.target.value)} 
              placeholder="Metros"
            />
          </div>

          <div className="form-group">
            <label>Calibre Acometida</label>
            <input 
              type="text" 
              value={formData.acometidaCalibre} 
              onChange={(e) => handleChange('acometidaCalibre', e.target.value)} 
              placeholder="Ej: 2/0 AWG"
            />
          </div>
        </div>
        <h3>Modem y Configuración</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Ubicación del Modem</label>
            <div className="button-group">
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.modemUbicacion === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('modemUbicacion', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Configuración de la Medida</label>
            <div className="button-group">
              {opcionesConfiguracion.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.configuracionMedida === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('configuracionMedida', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de Medida</label>
            <div className="button-group">
              {opcionesTipoMedida.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={formData.tipoMedida === opcion ? 'btn-selected' : 'btn-option'}
                  onClick={() => handleChange('tipoMedida', opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección 5: Medidor Encontrado y Medidor Instalado */}
      <div className="form-section">
        <h3>Medidor Encontrado</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Medida</th>
                <th>Número</th>
                <th>Marca</th>
                <th>Tipo</th>
                <th>Capac. (A)</th>
                <th>Tensión (V)</th>
                <th>Clase</th>
                <th>Kd (rev/kWh)</th>
                <th>Kh (kWh/rev)</th>
                <th>Lectura</th>
                <th>E/D</th>
                <th>Fecha Lab</th>
              </tr>
            </thead>
            <tbody>
              {/* Fila para Activa1 */}
              <tr>
                <td className="measure-type">Activa1</td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.numeroActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'numeroActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.marcaActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'marcaActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.tipoActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'tipoActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.capacidadActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'capacidadActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.tensionActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'tensionActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.claseActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'claseActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.kdActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'kdActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.khActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'khActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.lecturaActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'lecturaActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.edActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'edActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.fechaLabActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'fechaLabActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
              </tr>

              {/* Fila para Activa2 */}
              <tr>
                <td className="measure-type">Activa2</td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.numeroActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'numeroActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.marcaActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'marcaActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.tipoActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'tipoActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.capacidadActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'capacidadActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.tensionActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'tensionActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.claseActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'claseActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.kdActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'kdActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.khActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'khActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.lecturaActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'lecturaActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.edActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'edActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.fechaLabActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'fechaLabActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
              </tr>

              {/* Fila para Reactiva */}
              <tr>
                <td className="measure-type">Reactiva</td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.numeroReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'numeroReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.marcaReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'marcaReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.tipoReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'tipoReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.capacidadReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'capacidadReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.tensionReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'tensionReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.claseReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'claseReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.kdReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'kdReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.khReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'khReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.lecturaReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'lecturaReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.edReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'edReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorEncontrado.fechaLabReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorEncontrado', 'fechaLabReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Medidor Instalado</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Medida</th>
                <th>Número</th>
                <th>Marca</th>
                <th>Tipo</th>
                <th>Capac. (A)</th>
                <th>Tensión (V)</th>
                <th>Clase</th>
                <th>Kd (rev/kWh)</th>
                <th>Kh (kWh/rev)</th>
                <th>Lectura</th>
                <th>E/D</th>
                <th>Fecha Lab</th>
              </tr>
            </thead>
            <tbody>
              {/* Fila para Activa1 */}
              <tr>
                <td className="measure-type">Activa1</td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.numeroActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'numeroActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.marcaActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'marcaActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.tipoActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'tipoActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.capacidadActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'capacidadActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.tensionActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'tensionActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.claseActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'claseActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.kdActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'kdActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.khActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'khActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.lecturaActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'lecturaActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.edActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'edActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.fechaLabActiva1 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'fechaLabActiva1', e.target.value)}
                    className="table-input"
                  />
                </td>
              </tr>

              {/* Fila para Activa2 */}
              <tr>
                <td className="measure-type">Activa2</td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.numeroActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'numeroActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.marcaActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'marcaActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.tipoActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'tipoActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.capacidadActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'capacidadActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.tensionActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'tensionActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.claseActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'claseActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.kdActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'kdActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.khActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'khActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.lecturaActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'lecturaActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.edActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'edActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.fechaLabActiva2 || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'fechaLabActiva2', e.target.value)}
                    className="table-input"
                  />
                </td>
              </tr>

              {/* Fila para Reactiva */}
              <tr>
                <td className="measure-type">Reactiva</td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.numeroReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'numeroReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.marcaReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'marcaReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.tipoReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'tipoReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.capacidadReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'capacidadReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.tensionReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'tensionReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.claseReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'claseReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.kdReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'kdReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.khReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'khReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.lecturaReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'lecturaReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.edReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'edReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData.medidorInstalado.fechaLabReactiva || ''}
                    onChange={(e) => handleNestedChange('medidorInstalado', 'fechaLabReactiva', e.target.value)}
                    className="table-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 6S: Transformador de Potencia */}
      <div className="form-section">
        <h3>Transformador de Potencia</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Número</label>
            <input 
              type="text" 
              value={formData.transformador.numero} 
              onChange={(e) => handleNestedChange('transformador', 'numero', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Marca</label>
            <input 
              type="text" 
              value={formData.transformador.marca} 
              onChange={(e) => handleNestedChange('transformador', 'marca', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>kVA</label>
            <input 
              type="text" 
              value={formData.transformador.kva} 
              onChange={(e) => handleNestedChange('transformador', 'kva', e.target.value)} 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Año</label>
            <input 
              type="text" 
              value={formData.transformador.año} 
              onChange={(e) => handleNestedChange('transformador', 'año', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>V1/V2</label>
            <input 
              type="text" 
              value={formData.transformador.v1v2} 
              onChange={(e) => handleNestedChange('transformador', 'v1v2', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Propietario</label>
            <select 
              value={formData.transformador.propietario} 
              onChange={(e) => handleNestedChange('transformador', 'propietario', e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {opcionesPropietario.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Circuito</label>
            <input 
              type="text" 
              value={formData.transformador.circuito} 
              onChange={(e) => handleNestedChange('transformador', 'circuito', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="navigation-buttons">
        <button className="btn-back" onClick={prevStep}>
          ← Anterior
        </button>
        <button className="btn-primary" onClick={nextStep}>
          Continuar →
        </button>
      </div>
    </div>
  );
};

export default Form2;