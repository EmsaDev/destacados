import { useState } from 'react';
import styles from './Form3.module.css';
import { FiVideo,FiCamera } from "react-icons/fi";

const Form3 = ({ data, handleChange, nextStep, prevStep}) => {

  const [codigosDisponibles, setCodigosDisponibles] = useState([
    '10001', '10002', '10003', '10004', '10005'
  ]);

  const [codigoSeleccionado, setCodigoSeleccionado] = useState('');
  const [codigosSeleccionados, setCodigosSeleccionados] = useState(() => {
    // Inicializar con los códigos que ya estén en data
    if (data.codigosIrregularidades) {
      try {
        // Si está guardado como JSON
        return JSON.parse(data.codigosIrregularidades);
      } catch {
        // Si está guardado como string separado por comas
        return data.codigosIrregularidades.split(',').filter(c => c.trim());
      }
    }
    return [];
  });

  // Función para agregar un código
  const handleSelectCodigo = (e) => {
    const codigo = e.target.value;
    if (codigo && !codigosSeleccionados.includes(codigo)) {
      const nuevosSeleccionados = [...codigosSeleccionados, codigo];
      setCodigosSeleccionados(nuevosSeleccionados);
      
      // Actualizar también el data del padre
      const syntheticEvent = {
        target: {
          name: 'codigosIrregularidades',
          value: JSON.stringify(nuevosSeleccionados)
        }
      };
      handleChange(syntheticEvent);
      
      // Remover de disponibles
      setCodigosDisponibles(codigosDisponibles.filter(c => c !== codigo));
    }
  };

    // Función para remover un código
    const handleRemoverCodigo = (codigo) => {
      const nuevosSeleccionados = codigosSeleccionados.filter(c => c !== codigo);
      setCodigosSeleccionados(nuevosSeleccionados);
      
      // Actualizar también el data del padre
      const syntheticEvent = {
        target: {
          name: 'codigosIrregularidades',
          value: nuevosSeleccionados.length > 0 ? JSON.stringify(nuevosSeleccionados) : ''
        }
      };
      handleChange(syntheticEvent);
      
      // Agregar de vuelta a disponibles
      setCodigosDisponibles([...codigosDisponibles, codigo].sort());
    };

  return (
    <div className={styles.form3Container}>
      <h2 className={styles.formSectionTitle}>Medición Activa y Reactiva</h2>
        <div className={styles.tableContainer}>
        <table className={styles.medicionTable}>
          <thead>
            <tr>
              <th colSpan="5">Encontrados</th>
              <th colSpan="4">Instalados</th>
            </tr>
            <tr>
              <th colSpan="2" className={styles.medicionType}>Ubicación</th>
              <th>Tipo/Col</th>
              <th>Número</th>
              <th>E</th>
              <th>R</th>
              <th>Tipo/Color</th>
              <th>Número</th>
            </tr>
          </thead>
          <tbody>
            {/* MEDICIÓN ACTIVA - TAPA PRINCIPAL */}
            <tr>
              <td rowSpan="5" className={styles.medicionType}>Medición Activa</td>
              <td rowSpan="3" className={styles.ubicacion}>
                Tapa Principal
              </td>
              {/* Encontrados - Fila 1 */}
              <td><input type="text" name="medActivaTipoCol1" value={data.medActivaTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="medActivaNum1" value={data.medActivaNum1 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="medActivaE1" value={data.medActivaE1 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="medActivaR1" value={data.medActivaR1 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 1 */}
              <td><input type="text" name="medActivaInstTipoColor1" value={data.medActivaInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="medActivaInstNum1" value={data.medActivaInstNum1 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 2 */}
              <td><input type="text" name="medActivaTipoCol2" value={data.medActivaTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="medActivaNum2" value={data.medActivaNum2 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="medActivaE2" value={data.medActivaE2 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="medActivaR2" value={data.medActivaR2 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 2 */}
              <td><input type="text" name="medActivaInstTipoColor2" value={data.medActivaInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="medActivaInstNum2" value={data.medActivaInstNum2 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 3 */}
              <td><input type="text" name="medActivaTipoCol3" value={data.medActivaTipoCol3 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="medActivaNum3" value={data.medActivaNum3 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="medActivaE3" value={data.medActivaE3 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="medActivaR3" value={data.medActivaR3 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 3 */}
              <td><input type="text" name="medActivaInstTipoColor3" value={data.medActivaInstTipoColor3 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="medActivaInstNum3" value={data.medActivaInstNum3 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>

            {/* MEDICIÓN ACTIVA - TAPA BORNERA */}
            <tr>
              <td rowSpan="2" className={styles.ubicacion}>
                Tapa Bornera
              </td>
              {/* Encontrados - Fila 1 */}
              <td><input type="text" name="tapaBorneraActivaTipoCol1" value={data.tapaBorneraActivaTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaNum1" value={data.tapaBorneraActivaNum1 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaE1" value={data.tapaBorneraActivaE1 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaR1" value={data.tapaBorneraActivaR1 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 1 */}
              <td><input type="text" name="tapaBorneraActivaInstTipoColor1" value={data.tapaBorneraActivaInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaInstNum1" value={data.tapaBorneraActivaInstNum1 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 2 */}
              <td><input type="text" name="tapaBorneraActivaTipoCol2" value={data.tapaBorneraActivaTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaNum2" value={data.tapaBorneraActivaNum2 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaE2" value={data.tapaBorneraActivaE2 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaR2" value={data.tapaBorneraActivaR2 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 2 */}
              <td><input type="text" name="tapaBorneraActivaInstTipoColor2" value={data.tapaBorneraActivaInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraActivaInstNum2" value={data.tapaBorneraActivaInstNum2 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>

            {/* MEDICIÓN REACTIVA - TAPA PRINCIPAL */}
            <tr>
              <td rowSpan="5" className={styles.medicionType}>Medición Reactiva</td>
              <td rowSpan="3" className={styles.ubicacion}>
                Tapa Principal
              </td>
              {/* Encontrados - Fila 1 */}
              <td><input type="text" name="medReactivaTipoCol1" value={data.medReactivaTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaNum1" value={data.medReactivaNum1 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaE1" value={data.medReactivaE1 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaR1" value={data.medReactivaR1 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 1 */}
              <td><input type="text" name="medReactivaInstTipoColor1" value={data.medReactivaInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaInstNum1" value={data.medReactivaInstNum1 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 2 */}
              <td><input type="text" name="medReactivaTipoCol2" value={data.medReactivaTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaNum2" value={data.medReactivaNum2 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaE2" value={data.medReactivaE2 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaR2" value={data.medReactivaR2 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 2 */}
              <td><input type="text" name="medReactivaInstTipoColor2" value={data.medReactivaInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaInstNum2" value={data.medReactivaInstNum2 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 3 */}
              <td><input type="text" name="medReactivaTipoCol3" value={data.medReactivaTipoCol3 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaNum3" value={data.medReactivaNum3 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaE3" value={data.medReactivaE3 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaR3" value={data.medReactivaR3 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 3 */}
              <td><input type="text" name="medReactivaInstTipoColor3" value={data.medReactivaInstTipoColor3 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="medReactivaInstNum3" value={data.medReactivaInstNum3 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>

            {/* MEDICIÓN REACTIVA - TAPA BORNERA */}
            <tr>
              <td rowSpan="2" className={styles.ubicacion}>
                Tapa Bornera
              </td>
              {/* Encontrados - Fila 1 */}
              <td><input type="text" name="tapaBorneraReactivaTipoCol1" value={data.tapaBorneraReactivaTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaNum1" value={data.tapaBorneraReactivaNum1 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaE1" value={data.tapaBorneraReactivaE1 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaR1" value={data.tapaBorneraReactivaR1 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 1 */}
              <td><input type="text" name="tapaBorneraReactivaInstTipoColor1" value={data.tapaBorneraReactivaInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaInstNum1" value={data.tapaBorneraReactivaInstNum1 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 2 */}
              <td><input type="text" name="tapaBorneraReactivaTipoCol2" value={data.tapaBorneraReactivaTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaNum2" value={data.tapaBorneraReactivaNum2 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaE2" value={data.tapaBorneraReactivaE2 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaR2" value={data.tapaBorneraReactivaR2 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 2 */}
              <td><input type="text" name="tapaBorneraReactivaInstTipoColor2" value={data.tapaBorneraReactivaInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="tapaBorneraReactivaInstNum2" value={data.tapaBorneraReactivaInstNum2 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>

            {/* BLOQUE DE PRUEBAS */}
            <tr>
              <td colSpan="2" rowSpan="2" className={styles.ubicacion}>
                Bloque de Pruebas
              </td>
              {/* Encontrados - Fila 1 */}
              <td><input type="text" name="bloquePruebasTipoCol1" value={data.bloquePruebasTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasNum1" value={data.bloquePruebasNum1 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasE1" value={data.bloquePruebasE1 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasR1" value={data.bloquePruebasR1 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 1 */}
              <td><input type="text" name="bloquePruebasInstTipoColor1" value={data.bloquePruebasInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasInstNum1" value={data.bloquePruebasInstNum1 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
            <tr>
              {/* Encontrados - Fila 2 */}
              <td><input type="text" name="bloquePruebasTipoCol2" value={data.bloquePruebasTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasNum2" value={data.bloquePruebasNum2 || ''} placeholder='Número' onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasE2" value={data.bloquePruebasE2 || ''} placeholder='E' onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasR2" value={data.bloquePruebasR2 || ''} placeholder='R' onChange={handleChange} /></td>
              {/* Instalados - Fila 2 */}
              <td><input type="text" name="bloquePruebasInstTipoColor2" value={data.bloquePruebasInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
              <td><input type="text" name="bloquePruebasInstNum2" value={data.bloquePruebasInstNum2 || ''} placeholder='Número' onChange={handleChange}/></td>
            </tr>
          </tbody>
        </table>
      </div>

        {/*TABLA PARA Tc's, Tp's y Celda de Medida */}
        <div className={styles.tableContainer} style={{marginTop: '40px'}}>
          <table className={styles.medicionTable}>
            <thead>
              <tr>
                <th colSpan="4">Encontrados</th>
                <th colSpan="4">Instalados</th>
              </tr>
              <tr>
                <th className={styles.medicionType}>Ubicación</th>
                <th>Tipo/Col</th>
                <th>Número</th>
                <th>E</th>
                <th>R</th>
                <th>Tipo/Color</th>
                <th>Número</th>
              </tr>
            </thead>
            <tbody>
              {/* TC'S */}
              <tr>
                <td rowSpan="3" className={styles.ubicacion}>
                  Tc's
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="tcsTipoCol1" value={data.tcsTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tcsNumero1" value={data.tcsNumero1 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tcsE1" value={data.tcsE1 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tcsR1" value={data.tcsR1 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="tcsInstTipoColor1" value={data.tcsInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tcsInstNumero1" value={data.tcsInstNumero1 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="tcsTipoCol2" value={data.tcsTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tcsNumero2" value={data.tcsNumero2 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tcsE2" value={data.tcsE2 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tcsR2" value={data.tcsR2 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="tcsInstTipoColor2" value={data.tcsInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tcsInstNumero2" value={data.tcsInstNumero2 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="tcsTipoCol3" value={data.tcsTipoCol3 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tcsNumero3" value={data.tcsNumero3 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tcsE3" value={data.tcsE3 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tcsR3" value={data.tcsR3 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="tcsInstTipoColor3" value={data.tcsInstTipoColor3 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tcsInstNumero3" value={data.tcsInstNumero3 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* TP'S */}
              <tr>
                <td rowSpan="3" className={styles.ubicacion}>
                  Tp's
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="tpsTipoCol1" value={data.tpsTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tpsNumero1" value={data.tpsNumero1 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tpsE1" value={data.tpsE1 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tpsR1" value={data.tpsR1 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="tpsInstTipoColor1" value={data.tpsInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tpsInstNumero1" value={data.tpsInstNumero1 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="tpsTipoCol2" value={data.tpsTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tpsNumero2" value={data.tpsNumero2 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tpsE2" value={data.tpsE2 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tpsR2" value={data.tpsR2 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="tpsInstTipoColor2" value={data.tpsInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tpsInstNumero2" value={data.tpsInstNumero2 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="tpsTipoCol3" value={data.tpsTipoCol3 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tpsNumero3" value={data.tpsNumero3 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tpsE3" value={data.tpsE3 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tpsR3" value={data.tpsR3 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="tpsInstTipoColor3" value={data.tpsInstTipoColor3 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tpsInstNumero3" value={data.tpsInstNumero3 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* CELDA DE MEDIDA */}
              <tr>
                <td rowSpan="3" className={styles.ubicacion}>
                  Celda de Medida
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="celdaTipoCol1" value={data.celdaTipoCol1 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="celdaNumero1" value={data.celdaNumero1 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="celdaE1" value={data.celdaE1 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="celdaR1" value={data.celdaR1 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="celdaInstTipoColor1" value={data.celdaInstTipoColor1 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="celdaInstNumero1" value={data.celdaInstNumero1 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="celdaTipoCol2" value={data.celdaTipoCol2 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="celdaNumero2" value={data.celdaNumero2 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="celdaE2" value={data.celdaE2 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="celdaR2" value={data.celdaR2 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="celdaInstTipoColor2" value={data.celdaInstTipoColor2 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="celdaInstNumero2" value={data.celdaInstNumero2 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="celdaTipoCol3" value={data.celdaTipoCol3 || ''} placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="celdaNumero3" value={data.celdaNumero3 || ''} placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="celdaE3" value={data.celdaE3 || ''} placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="celdaR3" value={data.celdaR3 || ''} placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="celdaInstTipoColor3" value={data.celdaInstTipoColor3 || ''} placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="celdaInstNumero3" value={data.celdaInstNumero3 || ''} placeholder='Número' onChange={handleChange}/></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MEDIDOR ACTIVA */}
        <div className={styles.tableContainer}>
          <table className={styles.calculosTable}>
            <thead>
              <tr>
                <th colSpan="10">Medidor Activa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan="10">Cuadro de Cálculo del Error</th>
              </tr>
              <tr>
                <th colSpan="2">Fase</th>
                <th colSpan="2">Tensión (V)</th>
                <th colSpan="2">CORRIENTE (A)</th>
                <th colSpan="2">P.Inst (W)</th>
                <th colSpan="2" rowSpan="2">Secuencia de Fases</th>
              </tr>
              <tr>
                <td colSpan="2" className={styles.fase}>R</td>
                <td colSpan="2"><input type="text" name="activaTensionR" value={data.activaTensionR || ''} placeholder='Tensión (V) R' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaCorrienteR" value={data.activaCorrienteR || ''} placeholder='Corriente (A) R' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaPinstR" value={data.activaPinstR || ''} placeholder='P.inst. (W) R' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className={styles.fase}>S</td>
                <td colSpan="2"><input type="text" name="activaTensionS" value={data.activaTensionS || ''} placeholder='Tensión (V) S' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaCorrienteS" value={data.activaCorrienteS || ''} placeholder='Corriente (A) S' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaPinstS" value={data.activaPinstS || ''} placeholder='P.inst. (W) S' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>RST</td>
                <td><input type="text" name="activaRst" value={data.activaRst || ''} placeholder='RST' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className={styles.fase}>T</td>
                <td colSpan="2"><input type="text" name="activaTensionT" value={data.activaTensionT || ''} placeholder='Tensión (V) T' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaCorrienteT" value={data.activaCorrienteT || ''} placeholder='Corriente (A) T' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaPinstT" value={data.activaPinstT || ''} placeholder='P.inst. (W) T' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>RTS</td>
                <td><input type="text" name="activaRts" value={data.activaRts || ''} placeholder='RTS' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className={styles.faseTotal}>TOTAL (L-L)</td>
                <td colSpan="2"><input type="text" name="activaTensionTotal" value={data.activaTensionTotal || ''} placeholder='Tensión Total (V)' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaCorrienteTotal" value={data.activaCorrienteTotal || ''} placeholder='Corriente Total (A)' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activaPinstTotal" value={data.activaPinstTotal || ''} placeholder='P.inst. (W) Total' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>F.P.</td>
                <td><input type="text" name="activaFp" value={data.activaFp || ''} placeholder='F.P.' onChange={handleChange} /></td>          
              </tr>
              <tr>
                <td className={styles.porcentajeError}>% Error</td>
                <td><input type="text" name="activaPorcentajeError" value={data.activaPorcentajeError || ''} placeholder='% Error' onChange={handleChange} /></td>
                <td className={styles.giros}>Giros</td>
                <td><input type="text" name="activaGiros" value={data.activaGiros || ''} placeholder='giros' onChange={handleChange} /></td>
                <td className={styles.tiempo}>Tiempo (S)</td>
                <td><input type="text" name="activaTiempo" value={data.activaTiempo || ''} placeholder='Tiempo (S)' onChange={handleChange} /></td>
                <td className={styles.horas}>Horas</td>
                <td><input type="text" name="activaHoras" value={data.activaHoras || ''} placeholder='Horas' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>W</td>
                <td><input type="text" name="activaW" value={data.activaW || ''} placeholder='W' onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>
          
        {/* MEDIDOR REACTIVA */}
        <div className={styles.tableContainer}>
          <table className={styles.calculosTable}>
            <thead>
              <tr>
                <th colSpan="10">Medidor Reactiva</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan="10">Cuadro de Cálculo del Error</th>
              </tr>
              <tr>
                <th colSpan="2">Fase</th>
                <th colSpan="2">Tensión (V)</th>
                <th colSpan="2">CORRIENTE (A)</th>
                <th colSpan="2">P.Inst (W)</th>
                <th colSpan="2" rowSpan="2">Secuencia de Fases</th>
              </tr>
              <tr>
                <td colSpan="2" className={styles.fase}>R</td>
                <td colSpan="2"><input type="text" name="reactivaTensionR" value={data.reactivaTensionR || ''} placeholder='Tensión (V) R' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaCorrienteR" value={data.reactivaCorrienteR || ''} placeholder='Corriente (A) R' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaPinstR" value={data.reactivaPinstR || ''} placeholder='P.inst. (W) R' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className={styles.fase}>S</td>
                <td colSpan="2"><input type="text" name="reactivaTensionS" value={data.reactivaTensionS || ''} placeholder='Tensión (V) S' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaCorrienteS" value={data.reactivaCorrienteS || ''} placeholder='Corriente (A) S' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaPinstS" value={data.reactivaPinstS || ''} placeholder='P.inst. (W) S' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>RST</td>
                <td><input type="text" name="reactivaRst" value={data.reactivaRst || ''} placeholder='RST' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className={styles.fase}>T</td>
                <td colSpan="2"><input type="text" name="reactivaTensionT" value={data.reactivaTensionT || ''} placeholder='Tensión (V) T' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaCorrienteT" value={data.reactivaCorrienteT || ''} placeholder='Corriente (A) T' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaPinstT" value={data.reactivaPinstT || ''} placeholder='P.inst. (W) T' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>RTS</td>
                <td><input type="text" name="reactivaRts" value={data.reactivaRts || ''} placeholder='RTS' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className={styles.faseTotal}>TOTAL (L-L)</td>
                <td colSpan="2"><input type="text" name="reactivaTensionTotal" value={data.reactivaTensionTotal || ''} placeholder='Tensión Total (V)' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaCorrienteTotal" value={data.reactivaCorrienteTotal || ''} placeholder='Corriente Total (A)' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="reactivaPinstTotal" value={data.reactivaPinstTotal || ''} placeholder='P.inst. (W) Total' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>F.P.</td>
                <td><input type="text" name="reactivaFp" value={data.reactivaFp || ''} placeholder='F.P.' onChange={handleChange} /></td>          
              </tr>
              <tr>
                <td className={styles.porcentajeError}>% Error</td>
                <td><input type="text" name="reactivaPorcentajeError" value={data.reactivaPorcentajeError || ''} placeholder='% Error' onChange={handleChange} /></td>
                <td className={styles.giros}>Giros</td>
                <td><input type="text" name="reactivaGiros" value={data.reactivaGiros || ''} placeholder='giros' onChange={handleChange} /></td>
                <td className={styles.tiempo}>Tiempo (S)</td>
                <td><input type="text" name="reactivaTiempo" value={data.reactivaTiempo || ''} placeholder='Tiempo (S)' onChange={handleChange} /></td>
                <td className={styles.horas}>Horas</td>
                <td><input type="text" name="reactivaHoras" value={data.reactivaHoras || ''} placeholder='Horas' onChange={handleChange} /></td>
                <td className={styles.secuenciaFases}>W</td>
                <td><input type="text" name="reactivaW" value={data.reactivaW || ''} placeholder='W' onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRUEBAS DE FUNCIONAMIENTO - MEDIDOR ACTIVA */}
        <div className={styles.tableContainer}>
          <table className={styles.pruebasTable}>
            <thead>
              <tr>
                <th colSpan="8">Pruebas de Funcionamiento del Medidor de Activa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={styles.tipoHeader}>Tipo</th>
                <th className={styles.conformeHeader}>Conforme</th>
                <th colSpan="3" className={styles.pruebaIntegracionHeader}>Prueba de Integración</th>
              </tr>
              <tr>
                <td className={styles.tipoItem}>Conexiones</td>
                <td className={styles.conformeItem}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaConexiones" value="si" checked={data.activaConexiones === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaConexiones" value="no" checked={data.activaConexiones === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integracionLabel}>Lectura Inicial</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="activaLecturaInicial" value={data.activaLecturaInicial || ''} placeholder='Lectura' onChange={handleChange} />
                </td>
                <td className={styles.integracionLabel}>% Error</td>
              </tr>
              <tr>
                <td className={styles.tipoItem}>Continuidad</td>
                <td className={styles.conformeItem}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaContinuidad" value="si" checked={data.activaContinuidad === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaContinuidad" value="no" checked={data.activaContinuidad === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integracionLabel}>Lectura Final</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="activaLecturaFinal" value={data.activaLecturaFinal || ''} placeholder='Lectura' onChange={handleChange} />
                </td>
                <td rowSpan="3" className={styles.integracionInput}>
                  <input type="text" name="activaPorcentajeErrorPruebas" value={data.activaPorcentajeErrorPruebas || ''} placeholder='% Error' onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td rowSpan="2" className={styles.tipoItem}>Prueba de Puentes</td>
                <td rowSpan="2" className={styles.conformeItem}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaPuentes" value="si" checked={data.activaPuentes === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaPuentes" value="no" checked={data.activaPuentes === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integracionLabel}>Diferencia</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="activaDiferencia" value={data.activaDiferencia || ''} placeholder='Diferencia' onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td className={styles.integracionLabel}>Patron</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="activaPatron" value={data.activaPatron || ''} placeholder='Patron' onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.integrationLabel}>Estado del integrador</td>
                <td className={styles.integrationLabel}>Medidor se frena</td>
              </tr>
              <tr>
                <td className={styles.integrationLabel}>¿Giro en vacio?</td>
                <td>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaGiroVacio" value="si" checked={data.activaGiroVacio === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaGiroVacio" value="no" checked={data.activaGiroVacio === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integrationLabel}>¿Registra?</td>
                <td>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaRegistra" value="si" checked={data.activaRegistra === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaRegistra" value="no" checked={data.activaRegistra === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaSeFrena" value="si" checked={data.activaSeFrena === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="activaSeFrena" value="no" checked={data.activaSeFrena === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRUEBAS DE FUNCIONAMIENTO - MEDIDOR REACTIVA */}
        <div className={styles.tableContainer}>
          <table className={styles.pruebasTable}>
            <thead>
              <tr>
                <th colSpan="5">Pruebas de Funcionamiento del Medidor de Reactiva</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={styles.tipoHeader}>Tipo</th>
                <th className={styles.conformeHeader}>Conforme</th>
                <th colSpan="3" className={styles.pruebaIntegracionHeader}>Prueba de Integración</th>
              </tr>
              <tr>
                <td className={styles.tipoItem}>Conexiones</td>
                <td className={styles.conformeItem}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaConexiones" value="si" checked={data.reactivaConexiones === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaConexiones" value="no" checked={data.reactivaConexiones === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integracionLabel}>Lectura Inicial</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="reactivaLecturaInicial" value={data.reactivaLecturaInicial || ''} placeholder='Lectura' onChange={handleChange} />
                </td>
                <td className={styles.integracionLabel}>% Error</td>
              </tr>
              <tr>
                <td className={styles.tipoItem}>Continuidad</td>
                <td className={styles.conformeItem}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaContinuidad" value="si" checked={data.reactivaContinuidad === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaContinuidad" value="no" checked={data.reactivaContinuidad === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integracionLabel}>Lectura Final</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="reactivaLecturaFinal" value={data.reactivaLecturaFinal || ''} placeholder='Lectura' onChange={handleChange} />
                </td>
                <td rowSpan="3" className={styles.integracionInput}>
                  <input type="text" name="reactivaPorcentajeErrorPruebas" value={data.reactivaPorcentajeErrorPruebas || ''} placeholder='% Error' onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td rowSpan="2" className={styles.tipoItem}>Prueba de Puentes</td>
                <td rowSpan="2" className={styles.conformeItem}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaPuentes" value="si" checked={data.reactivaPuentes === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaPuentes" value="no" checked={data.reactivaPuentes === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integracionLabel}>Diferencia</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="reactivaDiferencia" value={data.reactivaDiferencia || ''} placeholder='Diferencia' onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td className={styles.integracionLabel}>Patron</td>
                <td className={styles.integracionInput}>
                  <input type="text" name="reactivaPatron" value={data.reactivaPatron || ''} placeholder='Patron' onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.integrationLabel}>Estado del integrador</td>
                <td className={styles.integrationLabel}>Medidor se frena</td>
              </tr>
              <tr>
                <td className={styles.integrationLabel}>¿Giro en vacio?</td>
                <td>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaGiroVacio" value="si" checked={data.reactivaGiroVacio === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaGiroVacio" value="no" checked={data.reactivaGiroVacio === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td className={styles.integrationLabel}>¿Registra?</td>
                <td>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaRegistra" value="si" checked={data.reactivaRegistra === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaRegistra" value="no" checked={data.reactivaRegistra === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
                <td>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaSeFrena" value="si" checked={data.reactivaSeFrena === 'si'} onChange={handleChange} />
                      <span>Sí</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="radio" name="reactivaSeFrena" value="no" checked={data.reactivaSeFrena === 'no'} onChange={handleChange} />
                      <span>No</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TRANSFORMADORES DE CORRIENTE TC'S ENCONTRADOS */}
        <div className={styles.tableContainer}>
          <table className={styles.transformadoresTable}>
            <thead>
              <tr>
                <th colSpan="6">Características Transformadores de Corriente TC'S Encontrados</th>
              </tr>
              <tr>
                <th>Marca</th>
                <th>Series</th>
                <th>Tipo</th>
                <th>Relación</th>
                <th>Clase</th>
                <th>VA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" name="tcMarca1" value={data.tcMarca1 || ''} placeholder='Marca' onChange={handleChange} /></td>
                <td><input type="text" name="tcSeries1" value={data.tcSeries1 || ''} placeholder='Series' onChange={handleChange} /></td>
                <td><input type="text" name="tcTipo1" value={data.tcTipo1 || ''} placeholder='Tipo' onChange={handleChange} /></td>
                <td><input type="text" name="tcRelacion1" value={data.tcRelacion1 || ''} placeholder='Relación' onChange={handleChange} /></td>
                <td><input type="text" name="tcClase1" value={data.tcClase1 || ''} placeholder='Clase' onChange={handleChange} /></td>
                <td><input type="text" name="tcVa1" value={data.tcVa1 || ''} placeholder='VA' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><input type="text" name="tcMarca2" value={data.tcMarca2 || ''} placeholder='Marca' onChange={handleChange} /></td>
                <td><input type="text" name="tcSeries2" value={data.tcSeries2 || ''} placeholder='Series' onChange={handleChange} /></td>
                <td><input type="text" name="tcTipo2" value={data.tcTipo2 || ''} placeholder='Tipo' onChange={handleChange} /></td>
                <td><input type="text" name="tcRelacion2" value={data.tcRelacion2 || ''} placeholder='Relación' onChange={handleChange} /></td>
                <td><input type="text" name="tcClase2" value={data.tcClase2 || ''} placeholder='Clase' onChange={handleChange} /></td>
                <td><input type="text" name="tcVa2" value={data.tcVa2 || ''} placeholder='VA' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><input type="text" name="tcMarca3" value={data.tcMarca3 || ''} placeholder='Marca' onChange={handleChange} /></td>
                <td><input type="text" name="tcSeries3" value={data.tcSeries3 || ''} placeholder='Series' onChange={handleChange} /></td>
                <td><input type="text" name="tcTipo3" value={data.tcTipo3 || ''} placeholder='Tipo' onChange={handleChange} /></td>
                <td><input type="text" name="tcRelacion3" value={data.tcRelacion3 || ''} placeholder='Relación' onChange={handleChange} /></td>
                <td><input type="text" name="tcClase3" value={data.tcClase3 || ''} placeholder='Clase' onChange={handleChange} /></td>
                <td><input type="text" name="tcVa3" value={data.tcVa3 || ''} placeholder='VA' onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TRANSFORMADORES DE POTENCIA TP'S ENCONTRADOS */}
        <div className={styles.tableContainer}>
          <table className={styles.transformadoresTable}>
            <thead>
              <tr>
                <th colSpan="6">Características Transformadores de Potencia TP'S Encontrados</th>
              </tr>
              <tr>
                <th>Marca</th>
                <th>Series</th>
                <th>Tipo</th>
                <th>Relación</th>
                <th>Clase</th>
                <th>VA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" name="tpMarca1" value={data.tpMarca1 || ''} placeholder='Marca' onChange={handleChange} /></td>
                <td><input type="text" name="tpSeries1" value={data.tpSeries1 || ''} placeholder='Series' onChange={handleChange} /></td>
                <td><input type="text" name="tpTipo1" value={data.tpTipo1 || ''} placeholder='Tipo' onChange={handleChange} /></td>
                <td><input type="text" name="tpRelacion1" value={data.tpRelacion1 || ''} placeholder='Relación' onChange={handleChange} /></td>
                <td><input type="text" name="tpClase1" value={data.tpClase1 || ''} placeholder='Clase' onChange={handleChange} /></td>
                <td><input type="text" name="tpVa1" value={data.tpVa1 || ''} placeholder='VA' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><input type="text" name="tpMarca2" value={data.tpMarca2 || ''} placeholder='Marca' onChange={handleChange} /></td>
                <td><input type="text" name="tpSeries2" value={data.tpSeries2 || ''} placeholder='Series' onChange={handleChange} /></td>
                <td><input type="text" name="tpTipo2" value={data.tpTipo2 || ''} placeholder='Tipo' onChange={handleChange} /></td>
                <td><input type="text" name="tpRelacion2" value={data.tpRelacion2 || ''} placeholder='Relación' onChange={handleChange} /></td>
                <td><input type="text" name="tpClase2" value={data.tpClase2 || ''} placeholder='Clase' onChange={handleChange} /></td>
                <td><input type="text" name="tpVa2" value={data.tpVa2 || ''} placeholder='VA' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><input type="text" name="tpMarca3" value={data.tpMarca3 || ''} placeholder='Marca' onChange={handleChange} /></td>
                <td><input type="text" name="tpSeries3" value={data.tpSeries3 || ''} placeholder='Series' onChange={handleChange} /></td>
                <td><input type="text" name="tpTipo3" value={data.tpTipo3 || ''} placeholder='Tipo' onChange={handleChange} /></td>
                <td><input type="text" name="tpRelacion3" value={data.tpRelacion3 || ''} placeholder='Relación' onChange={handleChange} /></td>
                <td><input type="text" name="tpClase3" value={data.tpClase3 || ''} placeholder='Clase' onChange={handleChange} /></td>
                <td><input type="text" name="tpVa3" value={data.tpVa3 || ''} placeholder='VA' onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* EVIDENCIAS E INFORME */}
        <div className={styles.tableContainer}>
          <div className={styles.evidenciasSection}>
            <h3 className={styles.sectionTitle}>Evidencias e Informe</h3>
            
            <div className={styles.evidenciasGrid}>
              <div className={styles.formGroup}>
              <label>Códigos de las Irregularidades</label>
              
              {/* Dropdown sin botón */}
              <select 
                className={styles.informeSelect}
                value=""
                onChange={handleSelectCodigo}
                disabled={codigosDisponibles.length === 0}
                style={{ marginBottom: '12px' }}
              >
                <option value="">
                  {codigosDisponibles.length === 0 
                    ? 'No hay códigos disponibles' 
                    : 'Seleccione un código'}
                </option>
                {codigosDisponibles.map(codigo => (
                  <option key={codigo} value={codigo}>
                    {codigo}
                  </option>
                ))}
              </select>

              {/* Chips de códigos seleccionados */}
              {codigosSeleccionados.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  minHeight: '44px',
                  border: '1px solid #dee2e6'
                }}>
                  {codigosSeleccionados.map(codigo => (
                    <div 
                      key={codigo} 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '16px',
                        padding: '6px 10px 6px 14px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <span>{codigo}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoverCodigo(codigo)}
                        style={{
                          marginLeft: '8px',
                          background: 'rgba(255,255,255,0.2)',
                          border: 'none',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          padding: '0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f44336';
                          e.currentTarget.style.borderColor = '#f44336';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Campo oculto para mantener la compatibilidad con el formulario */}
              <input 
                type="hidden"
                name="codigosIrregularidades"
                value={codigosSeleccionados.length > 0 ? JSON.stringify(codigosSeleccionados) : ''}
              />
            </div>
              
              <div className={styles.formGroup}>
                <label>Tipo de Evidencia</label>
                <div className={styles.evidenciaOptions}>
                  <label className={styles.evidenciaOption}>
                    <input 
                      type="radio" 
                      name="tipoEvidencia" 
                      value="foto" 
                      onChange={handleChange}
                      checked={data.tipoEvidencia === 'foto'}
                    />
                    <FiCamera className={styles.evidenciaIcon} />
                    <span>Fotos</span>
                  </label>
                  <label className={styles.evidenciaOption}>
                    <input 
                      type="radio" 
                      name="tipoEvidencia" 
                      value="video" 
                      onChange={handleChange}
                      checked={data.tipoEvidencia === 'video'}
                    />
                    <FiVideo className={styles.evidenciaIcon} />
                    <span>Video</span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Irregularidad Corregida</label>
                <div className={styles.checkboxGroupHorizontal}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="radio" 
                      name="irregularidadCorrida" 
                      value="si" 
                      onChange={handleChange}
                      checked={data.irregularidadCorrida === 'si'}
                    />
                    <span>Sí</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="radio" 
                      name="irregularidadCorrida" 
                      value="no" 
                      onChange={handleChange}
                      checked={data.irregularidadCorrida === 'no'}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Medidor Retirado</label>
                <div className={styles.checkboxGroupHorizontal}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="radio" 
                      name="medidorRetirado" 
                      value="si" 
                      onChange={handleChange}
                      checked={data.medidorRetirado === 'si'}
                    />
                    <span>Sí</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="radio" 
                      name="medidorRetirado" 
                      value="no" 
                      onChange={handleChange}
                      checked={data.medidorRetirado === 'no'}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Tipo de Informe</label>
                <select 
                  name="tipoInforme" 
                  onChange={handleChange} 
                  className={styles.informeSelect}
                  value={data.tipoInforme || ''}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="visita_sitio">Se realizó visita al sitio encontrando etc ...</option>
                  <option value="instalacion_completada">Instalación completada</option>
                  <option value="medicion_realizada">Medición realizada</option>
                  <option value="pruebas_completadas">Pruebas completadas</option>
                  <option value="documentacion_entregada">Documentación entregada</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              {data.tipoInforme === 'otro' && (
                <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.especifiqueOtro}`}>
                  <label>Especifique el tipo de informe:</label>
                  <input 
                    type="text" 
                    name="tipoInformeOtro"
                    value={data.tipoInformeOtro || ''} 
                    onChange={handleChange}
                    placeholder="Describa el tipo de informe realizado"
                    className={styles.informeInput}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formNavigation}>
          <button type="button" onClick={prevStep} className={styles.backButton}>
            ← Anterior
          </button>
          <button type="submit" className={styles.nextButton} onClick={nextStep}>
            Continuar →
          </button>
        </div>
    </div>
  );
};

export default Form3;