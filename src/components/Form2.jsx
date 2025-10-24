import React, { useState, useEffect } from 'react';
import styles from './Form2.module.css';

const Form2 = ({ data, handleChange, nextStep, prevStep }) => {
  
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
  
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
      <h3 className={styles.formSectionTitle}>Datos generales</h3>
      <div className={styles.datosGeneralesGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre</label>
          <input 
            name="nombre"
            type="text" 
            value={data.nombre || data.nombre || ''} 
            onChange={handleChange}
            className={styles.input}
            placeholder="Ingrese el nombre"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Dirección de la población</label>
          <input 
            name="direccion"
            type="text" 
            value={data.direccion || data.direccion || ''} 
            onChange={handleChange} 
            className={styles.input}
            placeholder={data.direccion}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Carga Kw</label>
          <input 
            name="cargaKw"
            type="text" 
            value={data.cargaKw  || ''} 
            onChange={handleChange}
            className={styles.input}
            placeholder="Ingrese carga Kw"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Ciclo</label>
          <input
            name="ciclo"
            type="text" 
            value={data.ciclo} 
            onChange={handleChange}
            placeholder="Ingrese ciclo"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Factor</label>
          <input 
            name="factor1"
            type="text" 
            value={data.factor1} 
            onChange={handleChange} 
            placeholder="Ingrese factor"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Factor</label>
          <input
            name="factor2" 
            type="text" 
            value={data.factor2} 
            onChange={handleChange} 
            placeholder="Ingrese factor"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Factor</label>
          <input 
            name="factor3"
            type="text" 
            value={data.factor3} 
            onChange={handleChange} 
            placeholder="Ingrese factor"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Numero de macromedidor</label>
          <input 
            type="text" 
            name='macromedidor'
            value={data.macromedidor} 
            onChange={handleChange} 
            placeholder="Ingrese macromedidor"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nodo trafo</label>
          <input 
            name='nodoTrafo'
            type="text" 
            value={data.nodoTrafo} 
            onChange={handleChange} 
            placeholder="Ingrese nodo trafo"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Comercializador</label>
          <input 
            name='comercializador'
            type="text" 
            value={data.comercializador} 
            onChange={handleChange} 
            placeholder="Ingrese comercializador"
            className={styles.input}
          />
        </div>
      </div>
      <h3 className={styles.formSectionTitle}>Datos del suscriptor y Equipos de Medida Encontrados</h3>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Teléfono</label>
          <input
            name='telefono'
            type="text" 
            value={data.telefono} 
            onChange={handleChange} 
            placeholder="Ingrese teléfono"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Uso</label>
          <div className={styles.buttonGroup}>
              {opcionesUso.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.uso === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'uso',value: opcion}})}
                >
                  {opcion} {opcion === 'R' ? '(Residencial)' : opcion === 'C' ? '(Comercial)' : opcion === 'I' ? '(Industrial)' : '(Oficial)'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ubicación</label>
            <div className={styles.buttonGroup}>
              {opcionesUbicacion.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.ubicacion === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'ubicacion',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.Row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Familias</label>
            <div className="button-group">
              {opcionesFamilias.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.familias === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'familias',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nivel de Tensión</label>
            <div className={styles.buttonGroup}>
              {opcionesNivelTension.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.nivelTension === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'nivelTension',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bloques de Prueba</label>
            <div className={styles.buttonGroup}>
              {opcionesSiNo.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.bloquesPrueba === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'bloquesPrueba',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Sección 2: Protección y Acometida */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Tipo de Instalación y Medidor</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Medidor</label>
            <div className={styles.buttonGroup}>
              {opcionesTipoMedidor.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.tipoMedidor === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'tipoMedidor',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Instalación</label>
            <div className={styles.buttonGroup}>
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.tipoInstalacion === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'tipoInstalacion',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ubicación del Medidor</label>
            <div className={styles.buttonGroup}>
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.ubicacionMedidor === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'ubicacionMedidor',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Protección y Acometida</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Protección General (A)</label>
            <input 
              name="proteccionGeneral"
              type="text" 
              value={data.proteccionGeneral} 
              onChange={handleChange} 
              placeholder="Ej: 100A"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Acometida</label>
            <select 
              name="acometidaTipo"
              value={data.acometidaTipo} 
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar...</option>
              {opcionesAcometida.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>#F #H</label>
            <input 
              type="text" 
              name="hf"
              value={data.hf} 
              onChange={handleChange} 
              placeholder="Ej: "
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Longitud Acometida (M)</label>
            <input 
              name="acometidaLongitud"
              type="number" 
              value={data.acometidaLongitud} 
              onChange={handleChange} 
              placeholder="Metros"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Calibre Acometida</label>
            <input 
              name="acometidaCalibre"
              type="text" 
              value={data.acometidaCalibre} 
              onChange={handleChange} 
              placeholder="Ej: 2/0 AWG"
              className={styles.input}
            />
          </div>
        </div>

        <h3 className={styles.formSectionTitle}>Modem y Configuración</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ubicación del Modem</label>
            <div className={styles.buttonGroup}>
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.modemUbicacion === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'modemUbicacion',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Configuración de la Medida</label>
            <div className={styles.buttonGroup}>
              {opcionesConfiguracion.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.configuracionMedida === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'configuracionMedida',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Medida</label>
            <div className={styles.buttonGroup}>
              {opcionesTipoMedida.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.tipoMedida === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() => handleChange({target: {name: 'tipoMedida',value: opcion}})}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección 5: Medidor Encontrado y Medidor Instalado */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Medidor Encontrado</h3>
        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
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
                <td className={styles.measureType}>Activa1</td>
                <td>
                  <input
                    type="text"
                    name="numeroActiva1"
                    value={data.numeroActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select 
                    name="marcaActiva1"
                    value={data.marcaActiva1 || ''}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Seleccionar marca...</option>
                    <option value="elster">Elster</option>
                    <option value="actaris">Actaris</option>
                    <option value="landys">Landys</option>
                    <option value="microstar">Microstar</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="tipoActiva1"
                    value={data.tipoActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadActiva1"
                    value={data.capacidadActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionActiva1"
                    value={data.tensionActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseActiva1"
                    value={data.claseActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdActiva1"
                    value={data.kdActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khActiva1"
                    value={data.khActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaActiva1"
                    value={data.lecturaActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edActiva1"
                    value={data.edActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabActiva1"
                    value={data.fechaLabActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
              </tr>

              {/* Fila para Activa2 */}
              <tr>
                <td className={styles.measureType}>Activa2</td>
                <td>
                  <input
                    type="text"
                    name="numeroActiva2"
                    value={data.numeroActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select 
                    name="marcaActiva2"
                    value={data.marcaActiva2 || ''}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Seleccionar marca...</option>
                    <option value="elster">Elster</option>
                    <option value="actaris">Actaris</option>
                    <option value="landys">Landys</option>
                    <option value="microstar">Microstar</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="tipoActiva2"
                    value={data.tipoActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadActiva2"
                    value={data.capacidadActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionActiva2"
                    value={data.tensionActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseActiva2"
                    value={data.claseActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdActiva2"
                    value={data.kdActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khActiva2"
                    value={data.khActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaActiva2"
                    value={data.lecturaActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edActiva2"
                    value={data.edActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabActiva2"
                    value={data.fechaLabActiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
              </tr>

              {/* Fila para Reactiva */}
              <tr>
                <td className={styles.measureType}>Reactiva</td>
                <td>
                  <input
                    type="text"
                    name="numeroReactiva"
                    value={data.numeroReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select 
                    name="marcaReactiva1"
                    value={data.marcaReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Seleccionar marca...</option>
                    <option value="elster">Elster</option>
                    <option value="actaris">Actaris</option>
                    <option value="landys">Landys</option>
                    <option value="microstar">Microstar</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="tipoReactiva"
                    value={data.tipoReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactiva"
                    value={data.capacidadReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactiva"
                    value={data.tensionReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactiva"
                    value={data.claseReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactiva"
                    value={data.kdReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactiva"
                    value={data.khReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactiva"
                    value={data.lecturaReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactiva"
                    value={data.edReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactiva"
                    value={data.fechaLabReactiva || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles.formSectionTitle}>Medidor Instalado</h3>
        <div className={styles.tableResponsive}>
        <table className={styles.dataTable}>
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
          <td className={styles.measureType}>Activa1</td>
          <td>
            <input
              type="text"
              name="numeroActivaIns1"
              value={data.numeroActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <select 
              name="marcaActivaIns1"
              value={data.marcaActivaIns1 || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar marca...</option>
              <option value="elster">Elster</option>
              <option value="actaris">Actaris</option>
              <option value="landys">Landys</option>
              <option value="microstar">Microstar</option>
            </select>
          </td>
          <td>
            <input
              type="text"
              name="tipoActivaIns1"
              value={data.tipoActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="capacidadActivaIns1"
              value={data.capacidadActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionActivaIns1"
              value={data.tensionActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseActivaIns1"
              value={data.claseActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdActivaIns1"
              value={data.kdActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khActivaIns1"
              value={data.khActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaActivaIns1"
              value={data.lecturaActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edActivaIns1"
              value={data.edActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabActivaIns1"
              value={data.fechaLabActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
        </tr>

        {/* Fila para Activa2 */}
        <tr>
          <td className={styles.measureType}>Activa2</td>
          <td>
            <input
              type="text"
              name="numeroActivaIns2"
              value={data.numeroActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <select 
              name="marcaActivaIns2"
              value={data.marcaActivaIns2 || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar marca...</option>
              <option value="elster">Elster</option>
              <option value="actaris">Actaris</option>
              <option value="landys">Landys</option>
              <option value="microstar">Microstar</option>
            </select>
          </td>
          <td>
            <input
              type="text"
              name="tipoActivaIns2"
              value={data.tipoActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="capacidadActivaIns2"
              value={data.capacidadActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionActivaIns2"
              value={data.tensionActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseActivaIns2"
              value={data.claseActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdActivaIns2"
              value={data.kdActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khActivaIns2"
              value={data.khActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaActivaIns2"
              value={data.lecturaActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edActivaIns2"
              value={data.edActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabActivaIns2"
              value={data.fechaLabActivaIns2 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
        </tr>

        {/* Fila para Reactiva */}
        <tr>
          <td className={styles.measureType}>Reactiva</td>
          <td>
            <input
              type="text"
              name="numeroReactivaIns"
              value={data.numeroReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <select 
              name="marcaReactivaIns"
              value={data.marcaReactivaIns || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar marca...</option>
              <option value="elster">Elster</option>
              <option value="actaris">Actaris</option>
              <option value="landys">Landys</option>
              <option value="microstar">Microstar</option>
            </select>
          </td>
          <td>
            <input
              type="text"
              name="tipoReactivaIns"
              value={data.tipoReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="capacidadReactivaIns"
              value={data.capacidadReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionReactivaIns"
              value={data.tensionReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseReactivaIns"
              value={data.claseReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdReactivaIns"
              value={data.kdReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khReactivaIns"
              value={data.khReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaReactivaIns"
              value={data.lecturaReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edReactivaIns"
              value={data.edReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabReactivaIns"
              value={data.fechaLabReactivaIns || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div className={styles.formSection}>
  <h3 className={styles.formSectionTitle}>Transformador de Potencia</h3>
  <div className={styles.formRow}>
    <div className={styles.formGroup}>
      <label>Número</label>
      <input 
        type="text" 
        name="transformadorPoNumero"
        value={data.transformadorPoNumero || ''}
        onChange={handleChange}
        className={styles.formInput}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Marca</label>
      <input 
        type="text" 
        name="transformadorPoMarca"
        value={data.transformadorPoMarca || ''}
        onChange={handleChange}
        className={styles.formInput}
      />
    </div>

    <div className={styles.formGroup}>
      <label>kVA</label>
      <input 
        type="text" 
        name="transformadorPoKva"
        value={data.transformadorPoKva || ''}
        onChange={handleChange}
        className={styles.formInput}
      />
    </div>
  </div>

  <div className={styles.formRow}>
    <div className={styles.formGroup}>
      <label>Año</label>
      <input 
        type="text" 
        name="transformadorPoAno"
        value={data.transformadorPoAno || ''}
        onChange={handleChange}
        className={styles.formInput}
      />
    </div>

    <div className={styles.formGroup}>
      <label>V1/V2</label>
      <input 
        type="text" 
        name="transformadorPoV1V2"
        value={data.transformadorPoV1V2 || ''}
        onChange={handleChange}
        className={styles.formInput}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Propietario</label>
      <select 
              name="transformadorPoPropietario"
              value={data.transformadorPoPropietario || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar marca...</option>
              <option value="elster">EMSA</option>
              <option value="actaris">PARTICULAR</option>
            </select>
    </div>

    <div className={styles.formGroup}>
      <label>Circuito</label>
      <input 
        type="text" 
        name="transformadorPoCircuito"
        value={data.transformadorPoCircuito || ''}
        onChange={handleChange}
        className={styles.formInput}
      />
    </div>
  </div>
</div>

<div className={styles.navigationButtons}>
  <button className={styles.btnBack} onClick={prevStep}>
    ← Anterior
  </button>
  <button className={styles.btnPrimary} onClick={nextStep}>
    Continuar →
  </button>
</div>
</div>
  );
};

export default Form2;