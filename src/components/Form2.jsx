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
  const [marcas, setMarcas] = useState([]);
  const [tiposPorMarca, setTiposPorMarca] = useState({});
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(""); 
  

  useEffect(() => {
  fetch("http://localhost:5000/marcas")
    .then((res) => res.json())
    .then((data) => {
      console.log("Marcas recibidas:", data);
      setMarcas(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error("Error cargando marcas", err);
      setMarcas([]);
    });
}, []);

  useEffect(() => {
    const marcasIds = [
      data.marcaActiva1,
      data.marcaActiva2,
      data.marcaReactiva1,
      data.marcaReactiva2,
      data.marcaActivaIns1,
      data.marcaActivaIns2,
      data.marcaReactivaIns1,
      data.marcaReactivaIns2,
      data.marcaActiva1Res,
      data.marcaActiva2Res,
      data.marcaReactiva1Res,
      data.marcaReactiva2Res,
      data.marcaActivaIns1Res,
      data.marcaActivaIns2Res,
      data.marcaReactivaIns1Res,
      data.marcaReactivaIns2Res
    ].filter(Boolean);

    marcasIds.forEach((marcaId) => {
      if (tiposPorMarca[marcaId]) return;

      console.log("Cargando tipos para marca:", marcaId);

      fetch(`http://localhost:5000/tipos/${marcaId}`)
        .then((res) => res.json())
        .then((data) => {
          setTiposPorMarca((prev) => ({
            ...prev,
            [marcaId]: Array.isArray(data) ? data : []
          }));
        })
        .catch(() => {
          setTiposPorMarca((prev) => ({
            ...prev,
            [marcaId]: []
          }));
        });
    });
  }, [
    data.marcaActiva1,
    data.marcaActiva2,
    data.marcaReactiva1,
    data.marcaReactiva2,
    data.marcaActivaIns1,
    data.marcaActivaIns2,
    data.marcaReactivaIns1,
    data.marcaReactivaIns2,
    data.marcaActiva1Res,
      data.marcaActiva2Res,
      data.marcaReactiva1Res,
      data.marcaReactiva2Res,
      data.marcaActivaIns1Res,
      data.marcaActivaIns2Res,
      data.marcaReactivaIns1Res,
      data.marcaReactivaIns2Res

  ]);

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
        <div className={styles.formGroup}>
          <label className={styles.label}>Longitud</label>
          <input 
            name='longitud'
            type="number" 
            step="0.001"
            value={data.longitud} 
            onChange={handleChange} 
            placeholder="Ingrese la longitud"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Latitud</label>
          <input 
            name='latitud'
            type="number"
            step="0.001" 
            value={data.latitud} 
            onChange={handleChange} 
            placeholder="Ingrese la latitud"
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
              name="fh"
              value={data.fh} 
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

        {/* Fila 1 - Botones existentes */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ubicación del Modem</label>
            <div className={styles.buttonGroup}>
              {opcionesInteriorExterior.map(opcion => (
                <button
                  key={opcion}
                  type="button"
                  className={data.modemUbicacion === opcion ? styles.btnSelected : styles.btnOption}
                  onClick={() =>
                    handleChange({ target: { name: 'modemUbicacion', value: opcion } })
                  }
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
                  onClick={() =>
                    handleChange({ target: { name: 'configuracionMedida', value: opcion } })
                  }
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
                  onClick={() =>
                    handleChange({ target: { name: 'tipoMedida', value: opcion } })
                  }
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fila 2 - Marca modem */}
        <div className={styles.formRow}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Marca del modem</label>
            <select
              name="marcaModem"
              value={data.marcaModem || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccione una opción</option>
              <option value="Teltonika">Teltonika</option>
              <option value="wLink">wLink</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {data.marcaModem === 'Otro' && (
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Especifique la marca del modem</label>
              <input
                type="text"
                name="marcaModemOtro"
                value={data.marcaModemOtro || ''}
                onChange={handleChange}
                placeholder="Ingrese la marca del modem"
                className={styles.input}
              />
            </div>
          )}
          {/* Serie */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Serie del modem</label>
            <input
              type="text"
              name="serieModem"
              value={data.serieModem || ''}
              onChange={handleChange}
              placeholder="Serie del modem"
              className={styles.input}
            />
          </div>

          {/* IP */}
          <div className={styles.formGroup}>
            <label className={styles.label}>IP</label>
            <input
              type="text"
              name="ipModem"
              value={data.ipModem || ''}
              onChange={handleChange}
              placeholder="Ej: 192.168.1.1"
              className={styles.input}
            />
          </div>
        </div>

        {/* Fila 3 - Marca modem respaldo */}
        <div className={styles.formRow}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Marca del modem de respaldo </label>
            <select
              name="marcaModemRes"
              value={data.marcaModemRes || ''}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccione una opción</option>
              <option value="Teltonika">Teltonika</option>
              <option value="wLink">wLink</option>
              <option value="OtroRes">Otro</option>
            </select>
          </div>

          {data.marcaModemRes === 'OtroRes' && (
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Especifique la marca del modem</label>
              <input
                type="text"
                name="marcaModemOtroRes"
                value={data.marcaModemOtroRes || ''}
                onChange={handleChange}
                placeholder="Ingrese la marca del modem"
                className={styles.input}
              />
            </div>
          )}
          {/* Serie */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Serie del modem</label>
            <input
              type="text"
              name="serieModemRes"
              value={data.serieModemRes || ''}
              onChange={handleChange}
              placeholder="Serie del modem"
              className={styles.input}
            />
          </div>

          {/* IP */}
          <div className={styles.formGroup}>
            <label className={styles.label}>IP</label>
            <input
              type="text"
              name="ipModemRes"
              value={data.ipModemRes || ''}
              onChange={handleChange}
              placeholder="Ej: 192.168.1.1"
              className={styles.input}
            />
          </div>
        </div>

        {/* Fila 4 - Datos técnicos */}
        <div className={styles.formRow}>

          <div className={styles.formGroup}>
            <label className={styles.label}>Marca del cable</label>
            <input
              type="text"
              name="marcaCable"
              value={data.marcaCable || ''}
              onChange={handleChange}
              placeholder="Marca del cable"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Marca de la celda de medida</label>
            <input
              type="text"
              name="marcaCeldaMedida"
              value={data.marcaCeldaMedida || ''}
              onChange={handleChange}
              placeholder="Marca de la celda"
              className={styles.input}
            />
          </div>
        </div>

      </div>

{/* Sección 5: Medidor Encontrado y Medidor Instalado Principal */}
      <div className={styles.formSection}>
      <h2 >Medidor Principal</h2>
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
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1"
                    value={data.tipoActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
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
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1"
                    value={data.tipoActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
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
                <td className={styles.measureType}>Reactiva1</td>
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
                    name="marcaReactiva1"
                    value={data.marcaActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1"
                    value={data.tipoActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactiva1"
                    value={data.capacidadReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactiva1"
                    value={data.tensionReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactiva1"
                    value={data.claseReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactiva1"
                    value={data.kdReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactiva1"
                    value={data.khReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactiva1"
                    value={data.lecturaReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactiva1"
                    value={data.edReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactiva1"
                    value={data.fechaLabReactiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
              </tr>
              {/* Fila para Reactiva2 */}
              <tr>
                <td className={styles.measureType}>Reactiva2</td>
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
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1"
                    value={data.tipoActiva1 || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactiva2"
                    value={data.capacidadReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactiva2"
                    value={data.tensionReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactiva2"
                    value={data.claseReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactiva2"
                    value={data.kdReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactiva2"
                    value={data.khReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactiva2"
                    value={data.lecturaReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactiva2"
                    value={data.edReactiva2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactiva2"
                    value={data.fechaLabReactiva2 || ''}
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
          <td>{/*"marcaActivaIns1"*/}
            <select
              name="marcaActivaIns1"
              value={data.marcaActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1"
              value={data.tipoActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
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
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1"
              value={data.tipoActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
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

        {/* Fila para Reactiva1 */}
        <tr>
          <td className={styles.measureType}>Reactiva1</td>
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
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1"
              value={data.tipoActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              type="text"
              name="capacidadReactivaIns1"
              value={data.capacidadReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionReactivaIns1"
              value={data.tensionReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseReactivaIns1"
              value={data.claseReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdReactivaIns1"
              value={data.kdReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khReactivaIns1"
              value={data.khReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaReactivaIns1"
              value={data.lecturaReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edReactivaIns1"
              value={data.edReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabReactivaIns1"
              value={data.fechaLabReactivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
        </tr>
        {/* Fila para ReactivaIns2 */}
        <tr>
          <td className={styles.measureType}>Reactiva2</td>
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
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1"
              value={data.tipoActivaIns1 || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactivaIns2"
                    value={data.capacidadReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactivaIns2"
                    value={data.tensionReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactivaIns2"
                    value={data.claseReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactivaIns2"
                    value={data.kdReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactivaIns2"
                    value={data.khReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactivaIns2"
                    value={data.lecturaReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactivaIns2"
                    value={data.edReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactivaIns2"
                    value={data.fechaLabReactivaIns2 || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />    
          </td>      
        </tr>        
      </tbody>
    </table>
  </div>
</div>

{/* Sección 5: Medidor Encontrado y Medidor Instalado Respaldo */}
      <div className={styles.formSection}>
        <h2>Medidor de Respaldo</h2>
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
                    name="numeroActiva1Res"
                    value={data.numeroActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select
                    name="marcaActiva1Res"
                    value={data.marcaActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1Res"
                    value={data.tipoActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1Res}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1Res] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadActiva1Res"
                    value={data.capacidadActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionActiva1Res"
                    value={data.tensionActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseActiva1Res"
                    value={data.claseActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdActiva1Res"
                    value={data.kdActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khActiva1Res"
                    value={data.khActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaActiva1Res"
                    value={data.lecturaActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edActiva1Res"
                    value={data.edActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabActiva1Res"
                    value={data.fechaLabActiva1Res || ''}
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
                    name="numeroActiva1Res"
                    value={data.numeroActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select
                    name="marcaActiva1Res"
                    value={data.marcaActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1Res"
                    value={data.tipoActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1Res}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1Res] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadActiva2Res"
                    value={data.capacidadActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionActiva2Res"
                    value={data.tensionActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseActiva2Res"
                    value={data.claseActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdActiva2Res"
                    value={data.kdActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khActiva2Res"
                    value={data.khActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaActiva2Res"
                    value={data.lecturaActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edActiva2Res"
                    value={data.edActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabActiva2Res"
                    value={data.fechaLabActiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
              </tr>

              {/* Fila para Reactiva */}
              <tr>
                <td className={styles.measureType}>Reactiva1</td>
                <td>
                  <input
                    type="text"
                    name="numeroActiva1Res"
                    value={data.numeroActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select
                    name="marcaActiva1"
                    value={data.marcaActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1Res"
                    value={data.tipoActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1Res}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1Res] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactiva1Res"
                    value={data.capacidadReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactiva1Res"
                    value={data.tensionReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactiva1Res"
                    value={data.claseReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactiva1Res"
                    value={data.kdReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactiva1Res"
                    value={data.khReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactiva1Res"
                    value={data.lecturaReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactiva1Res"
                    value={data.edReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactiva1Res"
                    value={data.fechaLabReactiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
              </tr>
              {/* Fila para Reactiva2 */}
              <tr>
                <td className={styles.measureType}>Reactiva2</td>
                <td>
                  <input
                    type="text"
                    name="numeroActiva1Res"
                    value={data.numeroActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <select
                    name="marcaReactiva2Res"
                    value={data.marcaActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="tipoActiva1Res"
                    value={data.tipoActiva1Res || ''}
                    onChange={handleChange}
                    className={styles.tableSelect}
                    disabled={!data.marcaActiva1Res}
                  >
                    <option value="">Seleccione un tipo</option>

                    {(tiposPorMarca[data.marcaActiva1Res] || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactiva2Res"
                    value={data.capacidadReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactiva2Res"
                    value={data.tensionReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactiva2Res"
                    value={data.claseReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactiva2Res"
                    value={data.kdReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactiva2Res"
                    value={data.khReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactiva2Res"
                    value={data.lecturaReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactiva2Res"
                    value={data.edReactiva2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactiva2Res"
                    value={data.fechaLabReactiva2Res || ''}
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
              name="numeroActivaIns1Res"
              value={data.numeroActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>{/*"marcaActivaIns1"*/}
            <select
              name="marcaActivaIns1Res"
              value={data.marcaActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1Res"
              value={data.tipoActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1Res] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              type="text"
              name="capacidadActivaIns1Res"
              value={data.capacidadActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionActivaIns1Res"
              value={data.tensionActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseActivaIns1Res"
              value={data.claseActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdActivaIns1Res"
              value={data.kdActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khActivaIns1Res"
              value={data.khActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaActivaIns1Res"
              value={data.lecturaActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edActivaIns1Res"
              value={data.edActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabActivaIns1Res"
              value={data.fechaLabActivaIns1Res || ''}
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
              name="numeroActivaIns1Res"
              value={data.numeroActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <select
              name="marcaActivaIns1Res"
              value={data.marcaActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1Res"
              value={data.tipoActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1Res}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1Res] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              type="text"
              name="capacidadActivaIns2Res"
              value={data.capacidadActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionActivaIns2Res"
              value={data.tensionActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseActivaIns2Res"
              value={data.claseActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdActivaIns2Res"
              value={data.kdActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khActivaIns2Res"
              value={data.khActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaActivaIns2Res"
              value={data.lecturaActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edActivaIns2Res"
              value={data.edActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabActivaIns2Res"
              value={data.fechaLabActivaIns2Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
        </tr>

        {/* Fila para Reactiva1 */}
        <tr>
          <td className={styles.measureType}>Reactiva1</td>
          <td>
            <input
              type="text"
              name="numeroActivaIns1Res"
              value={data.numeroActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <select
              name="marcaActivaIns1Res"
              value={data.marcaActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1Res"
              value={data.tipoActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1Res}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1Res] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              type="text"
              name="capacidadReactivaIns1Res"
              value={data.capacidadReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="tensionReactivaIns1Res"
              value={data.tensionReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="claseReactivaIns1Res"
              value={data.claseReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="kdReactivaIns1Res"
              value={data.kdReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="khReactivaIns1Res"
              value={data.khReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="lecturaReactivaIns1Res"
              value={data.lecturaReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="edReactivaIns1Res"
              value={data.edReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
          <td>
            <input
              type="text"
              name="fechaLabReactivaIns1Res"
              value={data.fechaLabReactivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableInput}
            />
          </td>
        </tr>
        {/* Fila para ReactivaIns2 */}
        <tr>
          <td className={styles.measureType}>Reactiva2</td>
            <td>
              <input
                type="text"
                name="numeroActivaIns1Res"
                value={data.numeroActivaIns1Res || ''}
                onChange={handleChange}
                className={styles.tableInput}
              />
            </td>
            <td>
              <select
              name="marcaActivaIns1"
              value={data.marcaActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((m) => (
                 <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              name="tipoActivaIns1"
              value={data.tipoActivaIns1Res || ''}
              onChange={handleChange}
              className={styles.tableSelect}
              disabled={!data.marcaActivaIns1Res}
            >
              <option value="">Seleccione un tipo</option>

              {(tiposPorMarca[data.marcaActivaIns1Res] || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="capacidadReactivaIns2Res"
                    value={data.capacidadReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tensionReactivaIns2Res"
                    value={data.tensionReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="claseReactivaIns2Res"
                    value={data.claseReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="kdReactivaIns2Res"
                    value={data.kdReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="khReactivaIns2Res"
                    value={data.khReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="lecturaReactivaIns2Res"
                    value={data.lecturaReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="edReactivaIns2Res"
                    value={data.edReactivaIns2Res || ''}
                    onChange={handleChange}
                    className={styles.tableInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fechaLabReactivaIns2Res"
                    value={data.fechaLabReactivaIns2Res || ''}
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
          <option value="EMSA">EMSA</option>
          <option value="PARTICULAR">PARTICULAR</option>
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