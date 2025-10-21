import { useState } from 'react';
import './Form3.css';

const Form3 = ({ data, updateData, nextStep, prevStep,type, files}) => {
  const [showOtroInforme, setShowOtroInforme] = useState(false);

  // Estados para todos los datos de Form3
  const [form3Data, setForm3Data] = useState({
    // Medición Activa
    medActiva_tipoCol1: '', medActiva_tipoCol2: '', medActiva_tipoCol3: '',
    medActiva_num1: '', medActiva_num2: '', medActiva_num3: '',
    medActiva_E1: '', medActiva_E2: '', medActiva_E3: '',
    medActiva_R1: '', medActiva_R2: '', medActiva_R3: '',
    medActivaInst_tipoColor1: '', medActivaInst_tipoColor2: '', medActivaInst_tipoColor3: '',
    medActivaInst_num1: '', medActivaInst_num2: '', medActivaInst_num3: '',
    
    tapaBorneraActiva_tipoCol1: '', tapaBorneraActiva_tipoCol2: '', tapaBorneraActiva_tipoCol3: '',
    tapaBorneraActiva_num1: '', tapaBorneraActiva_num2: '', tapaBorneraActiva_num3: '',
    tapaBorneraActiva_E1: '', tapaBorneraActiva_E2: '', tapaBorneraActiva_E3: '',
    tapaBorneraActiva_R1: '', tapaBorneraActiva_R2: '', tapaBorneraActiva_R3: '',
    tapaBorneraActivaInst_tipoColor1: '', tapaBorneraActivaInst_tipoColor2: '', tapaBorneraActivaInst_tipoColor3: '',
    tapaBorneraActivaInst_num1: '', tapaBorneraActivaInst_num2: '', tapaBorneraActivaInst_num3: '',

    // Medición Reactiva
    medReactiva_tipoCol1: '', medReactiva_tipoCol2: '', medReactiva_tipoCol3: '',
    medReactiva_num1: '', medReactiva_num2: '', medReactiva_num3: '',
    medReactiva_E1: '', medReactiva_E2: '', medReactiva_E3: '',
    medReactiva_R1: '', medReactiva_R2: '', medReactiva_R3: '',
    medReactivaInst_tipoColor1: '', medReactivaInst_tipoColor2: '', medReactivaInst_tipoColor3: '',
    medReactivaInst_num1: '', medReactivaInst_num2: '', medReactivaInst_num3: '',
    
    tapaBorneraReactiva_tipoCol1: '', tapaBorneraReactiva_tipoCol2: '', tapaBorneraReactiva_tipoCol3: '',
    tapaBorneraReactiva_num1: '', tapaBorneraReactiva_num2: '', tapaBorneraReactiva_num3: '',
    tapaBorneraReactiva_E1: '', tapaBorneraReactiva_E2: '', tapaBorneraReactiva_E3: '',
    tapaBorneraReactiva_R1: '', tapaBorneraReactiva_R2: '', tapaBorneraReactiva_R3: '',
    tapaBorneraReactivaInst_tipoColor1: '', tapaBorneraReactivaInst_tipoColor2: '', tapaBorneraReactivaInst_tipoColor3: '',
    tapaBorneraReactivaInst_num1: '', tapaBorneraReactivaInst_num2: '', tapaBorneraReactivaInst_num3: '',

    // Bloque de Pruebas
    bloquePruebas_tipoCol1: '', bloquePruebas_tipoCol2: '',
    bloquePruebas_num1: '', bloquePruebas_num2: '',
    bloquePruebas_E1: '', bloquePruebas_E2: '',
    bloquePruebas_R1: '', bloquePruebas_R2: '',
    bloquePruebasInst_tipoColor1: '', bloquePruebasInst_tipoColor2: '',
    bloquePruebasInst_num1: '', bloquePruebasInst_num2: '',

    // Transformadores TC's
    tc_marca_1: '', tc_marca_2: '', tc_marca_3: '',
    tc_series_1: '', tc_series_2: '', tc_series_3: '',
    tc_tipo_1: '', tc_tipo_2: '', tc_tipo_3: '',
    tc_relacion_1: '', tc_relacion_2: '', tc_relacion_3: '',
    tc_clase_1: '', tc_clase_2: '', tc_clase_3: '',
    tc_va_1: '', tc_va_2: '', tc_va_3: '',

    // Transformadores TP's
    tp_marca_1: '', tp_marca_2: '', tp_marca_3: '',
    tp_series_1: '', tp_series_2: '', tp_series_3: '',
    tp_tipo_1: '', tp_tipo_2: '', tp_tipo_3: '',
    tp_relacion_1: '', tp_relacion_2: '', tp_relacion_3: '',
    tp_clase_1: '', tp_clase_2: '', tp_clase_3: '',
    tp_va_1: '', tp_va_2: '', tp_va_3: '',

    // Celda de Medida
    celda_tipoCol1: '', celda_tipoCol2: '', celda_tipoCol3: '',
    celda_numero1: '', celda_numero2: '', celda_numero3: '',
    celda_E1: '', celda_E2: '', celda_E3: '',
    celda_R1: '', celda_R2: '', celda_R3: '',
    celdaInst_tipoColor1: '', celdaInst_tipoColor2: '', celdaInst_tipoColor3: '',
    celdaInst_numero1: '', celdaInst_numero2: '', celdaInst_numero3: '',

    // Medidor Activa
    activa_tension_r: '', activa_tension_s: '', activa_tension_t: '', activa_tension_total: '',
    activa_corriente_r: '', activa_corriente_s: '', activa_corriente_t: '', activa_corriente_total: '',
    activa_pinst_r: '', activa_pinst_s: '', activa_pinst_t: '', activa_pinst_total: '',
    activa_rst: '', activa_rts: '', activa_fp: '', activa_w: '',
    activa_porcentaje_error: '', activa_giros: '', activa_tiempo: '', activa_horas: '',

    // Medidor Reactiva
    reactiva_tension_r: '', reactiva_tension_s: '', reactiva_tension_t: '', reactiva_tension_total: '',
    reactiva_corriente_r: '', reactiva_corriente_s: '', reactiva_corriente_t: '', reactiva_corriente_total: '',
    reactiva_pinst_r: '', reactiva_pinst_s: '', reactiva_pinst_t: '', reactiva_pinst_total: '',
    reactiva_rst: '', reactiva_rts: '', reactiva_fp: '', reactiva_w: '',
    reactiva_porcentaje_error: '', reactiva_giros: '', reactiva_tiempo: '', reactiva_horas: '',

    // Pruebas de Funcionamiento Activa
    activa_conexiones: '', activa_continuidad: '', activa_puentes: '', activa_integrador: '',
    activa_lectura_inicial: '', activa_lectura_final: '', activa_diferencia: '', activa_patron: '',
    activa_porcentaje_error_prueba: '', activa_giro_vacio: '', activa_registra: '', activa_se_frena: '',

    // Pruebas de Funcionamiento Reactiva
    reactiva_conexiones: '', reactiva_continuidad: '', reactiva_puentes: '', reactiva_integrador: '',
    reactiva_lectura_inicial: '', reactiva_lectura_final: '', reactiva_diferencia: '', reactiva_patron: '',
    reactiva_porcentaje_error_prueba: '', reactiva_giro_vacio: '', reactiva_registra: '', reactiva_se_frena: '',

    // Evidencias e Informe
    codigos_irregularidades: '',
    tipo_evidencia: '',
    evidencia_archivo: null,
    irregularidad_corrida: '',
    medidor_retirado: '',
    tipo_informe: '',
    otro_informe: ''
  });

  const formData = data || {};
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });

    let newValue = value;
    
    // Manejar archivos
    if (type === 'file') {
      newValue = files;
    }
    
    // Manejar radios
    if (type === 'radio') {
      newValue = value;
    }
    
    // Actualizar los datos usando updateData
    if (updateData) {
      updateData({ [name]: newValue });
    }
    // Manejar la visibilidad del campo "Otro"
    if (name === 'tipo_informe') {
      setShowOtroInforme(value === 'otro');
    }
  };

  return (
    <div className="form3-container">
      <h2>Medición Activa y Reactiva</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="table-container">
          <table className="medicion-table">
            <thead>
              <tr>
                <th colSpan="5">Encontrados</th>
                <th colSpan="4">Instalados</th>
              </tr>
              <tr>
                <th colSpan="2" className="medicion-type">Ubicación</th>
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
                <td rowSpan="6" className="medicion-type activa">Medición Activa</td>
                <td rowSpan="3" className="ubicacion principal">
                  Tapa Principal
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="medActiva_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_num1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="medActivaInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="medActivaInst_num1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="medActiva_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_num2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="medActivaInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="medActivaInst_num2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="medActiva_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_num3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="medActiva_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="medActivaInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="medActivaInst_num3" placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* MEDICIÓN ACTIVA - TAPA BORNERA */}
              <tr>
                <td rowSpan="3" className="ubicacion bornera">
                  Tapa Bornera
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="tapaBorneraActiva_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_num1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="tapaBorneraActivaInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActivaInst_num1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="tapaBorneraActiva_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_num2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="tapaBorneraActivaInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActivaInst_num2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="tapaBorneraActiva_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_num3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActiva_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="tapaBorneraActivaInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraActivaInst_num3" placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* MEDICIÓN REACTIVA - TAPA PRINCIPAL */}
              <tr>
                <td rowSpan="6" className="medicion-type reactiva">Medición Reactiva</td>
                <td rowSpan="3" className="ubicacion principal">
                  Tapa Principal
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="medReactiva_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_num1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="medReactivaInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="medReactivaInst_num1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="medReactiva_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_num2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="medReactivaInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="medReactivaInst_num2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="medReactiva_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_num3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="medReactiva_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="medReactivaInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="medReactivaInst_num3" placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* MEDICIÓN REACTIVA - TAPA BORNERA */}
              <tr>
                <td rowSpan="3" className="ubicacion bornera">
                  Tapa Bornera
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="tapaBorneraReactiva_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_num1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="tapaBorneraReactivaInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactivaInst_num1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="tapaBorneraReactiva_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_num2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="tapaBorneraReactivaInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactivaInst_num2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="tapaBorneraReactiva_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_num3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactiva_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="tapaBorneraReactivaInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tapaBorneraReactivaInst_num3" placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* BLOQUE DE PRUEBAS */}
              <tr>
                <td colSpan="2" rowSpan="2" className="ubicacion pruebas header-pruebas">
                  Bloque de Pruebas
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="bloquePruebas_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebas_num1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebas_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebas_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="bloquePruebasInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebasInst_num1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="bloquePruebas_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebas_num2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebas_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebas_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="bloquePruebasInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="bloquePruebasInst_num2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/*TABLA PARA Tc's, Tp's y Celda de Medida */}
        <div className="table-container" style={{marginTop: '40px'}}>
          <table className="medicion-table">
            <thead>
              <tr>
                <th colSpan="4">Encontrados</th>
                <th colSpan="4">Instalados</th>
              </tr>
              <tr>
                <th className="medicion-type">Ubicación</th>
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
                <td rowSpan="3" className="ubicacion tcs">
                  Tc's
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="tcs_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tcs_numero1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tcs_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tcs_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="tcsInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tcsInst_numero1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="tcs_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tcs_numero2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tcs_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tcs_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="tcsInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tcsInst_numero2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="tcs_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tcs_numero3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tcs_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tcs_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="tcsInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tcsInst_numero3" placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* TP'S */}
              <tr>
                <td rowSpan="3" className="ubicacion tps">
                  Tp's
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="tps_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tps_numero1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tps_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tps_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="tpsInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tpsInst_numero1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="tps_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tps_numero2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tps_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tps_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="tpsInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tpsInst_numero2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="tps_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="tps_numero3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="tps_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="tps_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="tpsInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="tpsInst_numero3" placeholder='Número' onChange={handleChange}/></td>
              </tr>

              {/* CELDA DE MEDIDA */}
              <tr>
                <td rowSpan="3" className="ubicacion celda">
                  Celda de Medida
                </td>
                {/* Encontrados - Fila 1 */}
                <td><input type="text" name="celda_tipoCol1" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="celda_numero1" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="celda_E1" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="celda_R1" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 1 */}
                <td><input type="text" name="celdaInst_tipoColor1" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="celdaInst_numero1" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 2 */}
                <td><input type="text" name="celda_tipoCol2" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="celda_numero2" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="celda_E2" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="celda_R2" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 2 */}
                <td><input type="text" name="celdaInst_tipoColor2" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="celdaInst_numero2" placeholder='Número' onChange={handleChange}/></td>
              </tr>
              <tr>
                {/* Encontrados - Fila 3 */}
                <td><input type="text" name="celda_tipoCol3" placeholder="Tipo/Col" onChange={handleChange} /></td>
                <td><input type="text" name="celda_numero3" placeholder='Número' onChange={handleChange} /></td>
                <td><input type="text" name="celda_E3" placeholder='E' onChange={handleChange} /></td>
                <td><input type="text" name="celda_R3" placeholder='R' onChange={handleChange} /></td>
                {/* Instalados - Fila 3 */}
                <td><input type="text" name="celdaInst_tipoColor3" placeholder="Tipo/Color" onChange={handleChange} /></td>
                <td><input type="text" name="celdaInst_numero3" placeholder='Número' onChange={handleChange}/></td>
              </tr>
            </tbody>
          </table>
        </div>

        
          {/* MEDIDOR ACTIVA */}
        <div className="table-container">
          <table className="calculos-table">
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
                <td colSpan="2" className="fase">R</td>
                <td colSpan="2"><input type="text" name="activa_tension_r" placeholder='Tensión (V) R' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_corriente_r" placeholder='Corriente (A) R' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_pinst_r" placeholder='P.inst. (W) R' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className="fase">S</td>
                <td colSpan="2"><input type="text" name="activa_tension_s" placeholder='Tensión (V) S' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_corriente_s" placeholder='Corriente (A) S' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_pinst_s" placeholder='P.inst. (W) S' onChange={handleChange} /></td>
                <td className="secuencia-fases">RST</td>
                <td><input type="text" name="activa_rst" placeholder='RST' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className="fase">T</td>
                <td colSpan="2"><input type="text" name="activa_tension_t" placeholder='Tensión (V) T' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_corriente_t" placeholder='Corriente (A) T' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_pinst_t" placeholder='P.inst. (W) T' onChange={handleChange} /></td>
                <td className="secuencia-fases">RTS</td>
                <td><input type="text" name="activa_rts" placeholder='RTS' onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className="fase total">TOTAL (L-L)</td>
                <td colSpan="2"><input type="text" name="activa_tension_total" placeholder='Tensión Total (V)' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_corriente_total" placeholder='Corriente Total (A)' onChange={handleChange} /></td>
                <td colSpan="2"><input type="text" name="activa_pinst_total" placeholder='P.inst. (W) Total' onChange={handleChange} /></td>
                <td className="secuencia-fases">F.P.</td>
                <td><input type="text" name="activa_fp" placeholder='F.P.' onChange={handleChange} /></td>          
              </tr>
              <tr>
                <td className='porcentaje_error'>% Error</td>
                <td><input type="text" name="activa_porcentaje_error" placeholder='% Error' onChange={handleChange} /></td>
                <td className='giros'>Giros</td>
                <td><input type="text" name="activa_giros" placeholder='giros' onChange={handleChange} /></td>
                <td className='tiempo'>Tiempo (S)</td>
                <td><input type="text" name="activa_tiempo" placeholder='Tiempo (S)' onChange={handleChange} /></td>
                <td className='horas' >Horas</td>
                <td ><input type="text" name="activa_horas" placeholder='Horas' onChange={handleChange} /></td>
                <td className="secuencia-fases">W</td>
                <td><input type="text" name="activa_w" placeholder='W' onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>
          
          {/* MEDIDOR REACTIVA */}
          <div className="table-container">
            <table className="calculos-table">
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
                  <td colSpan="2" className="fase">R</td>
                  <td colSpan="2"><input type="text" name="reactiva_tension_r" placeholder='Tensión (V) R' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_corriente_r" placeholder='Corriente (A) R' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_pinst_r" placeholder='P.inst. (W) R' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td colSpan="2" className="fase">S</td>
                  <td colSpan="2"><input type="text" name="reactiva_tension_s" placeholder='Tensión (V) S' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_corriente_s" placeholder='Corriente (A) S' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_pinst_s" placeholder='P.inst. (W) S' onChange={handleChange} /></td>
                  <td className="secuencia-fases">RST</td>
                  <td><input type="text" name="reactiva_rst" placeholder='RST' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td colSpan="2" className="fase">T</td>
                  <td colSpan="2"><input type="text" name="reactiva_tension_t" placeholder='Tensión (V) T' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_corriente_t" placeholder='Corriente (A) T' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_pinst_t" placeholder='P.inst. (W) T' onChange={handleChange} /></td>
                  <td className="secuencia-fases">RTS</td>
                  <td><input type="text" name="reactiva_rts" placeholder='RTS' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td colSpan="2" className="fase total">TOTAL (L-L)</td>
                  <td colSpan="2"><input type="text" name="reactiva_tension_total" placeholder='Tensión Total (V)' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_corriente_total" placeholder='Corriente Total (A)' onChange={handleChange} /></td>
                  <td colSpan="2"><input type="text" name="reactiva_pinst_total" placeholder='P.inst. (W) Total' onChange={handleChange} /></td>
                  <td className="secuencia-fases">F.P.</td>
                  <td><input type="text" name="reactiva_fp" placeholder='F.P.' onChange={handleChange} /></td>          
                </tr>
                <tr>
                  <td className='porcentaje_error'>% Error</td>
                  <td><input type="text" name="reactiva_porcentaje_error" placeholder='% Error' onChange={handleChange} /></td>
                  <td className='giros'>Giros</td>
                  <td><input type="text" name="reactiva_giros" placeholder='giros' onChange={handleChange} /></td>
                  <td className='tiempo'>Tiempo (S)</td>
                  <td><input type="text" name="reactiva_tiempo" placeholder='Tiempo (S)' onChange={handleChange} /></td>
                  <td className='horas' >Horas</td>
                  <td ><input type="text" name="reactiva_horas" placeholder='Horas' onChange={handleChange} /></td>
                  <td className="secuencia-fases">W</td>
                  <td><input type="text" name="reactiva_w" placeholder='W' onChange={handleChange} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PRUEBAS DE FUNCIONAMIENTO - MEDIDOR ACTIVA */}
          <div className="table-container">
            <table className="pruebas-table">
              <thead>
                <tr>
                  <th colSpan="8">Pruebas de Funcionamiento del Medidor de Activa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="tipo-header">Tipo</th>
                  <th className="conforme-header">Conforme</th>
                  <th colSpan="3" className="prueba-integracion-header">Prueba de Integración</th>
                </tr>
                <tr>
                  <td className="tipo-item">Conexiones</td>
                  <td className="conforme-item">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="activa_conexiones" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="activa_conexiones" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className="integracion-label">Lectura Inicial</td>
                  <td className="integracion-input">
                    <input type="text" name="activa_lectura_inicial" placeholder='Lectura' onChange={handleChange} />
                  </td>
                  <td className="integracion-label">% Error</td>
                </tr>
                <tr>
                  <td className="tipo-item">Continuidad</td>
                  <td className="conforme-item">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="activa_continuidad" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="activa_continuidad" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className="integracion-label">Lectura Final</td>
                  <td className="integracion-input">
                    <input type="text" name="activa_lectura_final" placeholder='Lectura' onChange={handleChange} />
                  </td>
                  <td rowSpan="3" className="integracion-input">
                    <input type="text" name="activa_porcentaje_error" placeholder='% Error' onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2" className="tipo-item">Prueba de Puentes</td>
                  <td rowSpan="2" className="conforme-item">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="activa_puentes" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="activa_puentes" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className="integracion-label">Diferencia</td>
                  <td className="integracion-input">
                    <input type="text" name="activa_diferencia" placeholder='Diferencia' onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <td className="integracion-label">Patron</td>
                  <td className="integracion-input">
                    <input type="text" name="activa_patron" placeholder='Patron' onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className='integration_label'>Estado del integrador</td>
                  <td className='integration_label'> Medidor se frena</td>
                </tr>
                <tr>
                  <td className='integration-label'>¿Giro en vacio?</td>
                  <td>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="activa_giro_vacio" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="activa_giro_vacio" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className='integration-label'>¿Registra?</td>
                  <td>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="activa_registra" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="activa_registra" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="activa_se_frena" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="activa_se_frena" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PRUEBAS DE FUNCIONAMIENTO - MEDIDOR REACTIVA */}
          <div className="table-container">
            <table className="pruebas-table">
              <thead>
                <tr>
                  <th colSpan="5">Pruebas de Funcionamiento del Medidor de Reactiva</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="tipo-header">Tipo</th>
                  <th className="conforme-header">Conforme</th>
                  <th colSpan="3" className="prueba-integracion-header">Prueba de Integración</th>
                </tr>
                <tr>
                  <td className="tipo-item">Conexiones</td>
                  <td className="conforme-item">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_conexiones" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_conexiones" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className="integracion-label">Lectura Inicial</td>
                  <td className="integracion-input">
                    <input type="text" name="reactiva_lectura_inicial" placeholder='Lectura' onChange={handleChange} />
                  </td>
                  <td className="integracion-label">% Error</td>
                </tr>
                <tr>
                  <td className="tipo-item">Continuidad</td>
                  <td className="conforme-item">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_continuidad" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_continuidad" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className="integracion-label">Lectura Final</td>
                  <td className="integracion-input">
                    <input type="text" name="reactiva_lectura_final" placeholder='Lectura' onChange={handleChange} />
                  </td>
                  <td rowSpan="3" className="integracion-input">
                    <input type="text" name="reactiva_porcentaje_error" placeholder='% Error' onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2" className="tipo-item">Prueba de Puentes</td>
                  <td rowSpan="2" className="conforme-item">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_puentes" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_puentes" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className="integracion-label">Diferencia</td>
                  <td className="integracion-input">
                    <input type="text" name="reactiva_diferencia" placeholder='Diferencia' onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <td className="integracion-label">Patron</td>
                  <td className="integracion-input">
                    <input type="text" name="reactiva_patron" placeholder='Patron' onChange={handleChange} />
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className='integration_label'>Estado del integrador</td>
                  <td className='integration_label'> Medidor se frena</td>
                </tr>
                <tr>
                  <td className='integration-label'>¿Giro en vacio?</td>
                  <td>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_giro_vacio" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_giro_vacio" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td className='integration-label'>¿Registra?</td>
                  <td>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_registra" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_registra" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_se_frena" value="si" onChange={handleChange} />
                        <span>Sí</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="radio" name="reactiva_se_frena" value="no" onChange={handleChange} />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TRANSFORMADORES DE CORRIENTE TC'S ENCONTRADOS */}
          <div className="table-container">
            <table className="transformadores-table">
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
                  <td><input type="text" name="tc_marca_1" placeholder='Marca' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_series_1" placeholder='Series' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_tipo_1" placeholder='Tipo' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_relacion_1" placeholder='Relación' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_clase_1" placeholder='Clase' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_va_1" placeholder='VA' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td><input type="text" name="tc_marca_2" placeholder='Marca' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_series_2" placeholder='Series' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_tipo_2" placeholder='Tipo' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_relacion_2" placeholder='Relación' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_clase_2" placeholder='Clase' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_va_2" placeholder='VA' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td><input type="text" name="tc_marca_3" placeholder='Marca' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_series_3" placeholder='Series' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_tipo_3" placeholder='Tipo' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_relacion_3" placeholder='Relación' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_clase_3" placeholder='Clase' onChange={handleChange} /></td>
                  <td><input type="text" name="tc_va_3" placeholder='VA' onChange={handleChange} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TRANSFORMADORES DE POTENCIA TP'S ENCONTRADOS */}
          <div className="table-container">
            <table className="transformadores-table">
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
                  <td><input type="text" name="tp_marca_1" placeholder='Marca' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_series_1" placeholder='Series' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_tipo_1" placeholder='Tipo' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_relacion_1" placeholder='Relación' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_clase_1" placeholder='Clase' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_va_1" placeholder='VA' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td><input type="text" name="tp_marca_2" placeholder='Marca' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_series_2" placeholder='Series' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_tipo_2" placeholder='Tipo' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_relacion_2" placeholder='Relación' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_clase_2" placeholder='Clase' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_va_2" placeholder='VA' onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td><input type="text" name="tp_marca_3" placeholder='Marca' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_series_3" placeholder='Series' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_tipo_3" placeholder='Tipo' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_relacion_3" placeholder='Relación' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_clase_3" placeholder='Clase' onChange={handleChange} /></td>
                  <td><input type="text" name="tp_va_3" placeholder='VA' onChange={handleChange} /></td>
                </tr>
              </tbody>
            </table>
          </div>

        {/* EVIDENCIAS E INFORME */}
{/* EVIDENCIAS E INFORME */}
        <div className="table-container">
          <div className="evidencias-section">
            <h3 className="section-title">Evidencias e Informe</h3>
            
            <div className="evidencias-grid">
              <div className="form-group">
                <label>Códigos de las Irregularidades</label>
                <input 
                  type="text" 
                  name="codigos_irregularidades" 
                  placeholder='Ingrese códigos' 
                  onChange={handleChange}
                  value={formData.codigos_irregularidades || ''}
                />
              </div>
              
              <div className="form-group">
                <label>Tipo de Evidencia</label>
                <div className="evidencia-options">
                  <label className="evidencia-option">
                    <input 
                      type="radio" 
                      name="tipo_evidencia" 
                      value="foto" 
                      onChange={handleChange}
                      checked={formData.tipo_evidencia === 'foto'}
                    />
                    <span className="evidencia-icon">📷</span>
                    <span>Fotos</span>
                  </label>
                  <label className="evidencia-option">
                    <input 
                      type="radio" 
                      name="tipo_evidencia" 
                      value="video" 
                      onChange={handleChange}
                      checked={formData.tipo_evidencia === 'video'}
                    />
                    <span className="evidencia-icon">🎥</span>
                    <span>Video</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Subir Evidencia</label>
                <input 
                  type="file" 
                  name="evidencia_archivo" 
                  accept={formData.tipo_evidencia === 'foto' ? 'image/*' : 'video/*'}
                  multiple={formData.tipo_evidencia === 'foto'}
                  onChange={handleChange} 
                  className="file-input"
                  disabled={!formData.tipo_evidencia}
                />
                <small className="file-hint">
                  {formData.tipo_evidencia === 'foto' ? 'Puede seleccionar múltiples fotos' : 'Seleccione un video'}
                </small>
              </div>
              
              <div className="form-group">
                <label>Irregularidad Corrida</label>
                <div className="checkbox-group-horizontal">
                  <label className="checkbox-label">
                    <input 
                      type="radio" 
                      name="irregularidad_corrida" 
                      value="si" 
                      onChange={handleChange}
                      checked={formData.irregularidad_corrida === 'si'}
                    />
                    <span>Sí</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="radio" 
                      name="irregularidad_corrida" 
                      value="no" 
                      onChange={handleChange}
                      checked={formData.irregularidad_corrida === 'no'}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Medidor Retirado</label>
                <div className="checkbox-group-horizontal">
                  <label className="checkbox-label">
                    <input 
                      type="radio" 
                      name="medidor_retirado" 
                      value="si" 
                      onChange={handleChange}
                      checked={formData.medidor_retirado === 'si'}
                    />
                    <span>Sí</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="radio" 
                      name="medidor_retirado" 
                      value="no" 
                      onChange={handleChange}
                      checked={formData.medidor_retirado === 'no'}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Tipo de Informe</label>
                <select 
                  name="tipo_informe" 
                  onChange={handleChange} 
                  className="informe-select"
                  value={formData.tipo_informe || ''}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="visita_sitio">Se realizó visita al sitio</option>
                  <option value="instalacion_completada">Instalación completada</option>
                  <option value="medicion_realizada">Medición realizada</option>
                  <option value="pruebas_completadas">Pruebas completadas</option>
                  <option value="documentacion_entregada">Documentación entregada</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              {showOtroInforme && (
                <div className="form-group full-width">
                  <label>Especifique</label>
                  <input 
                    type="text" 
                    name="otro_informe" 
                    placeholder='Especifique el tipo de informe' 
                    onChange={handleChange}
                    value={formData.otro_informe || ''}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-navigation">
          <button type="button" onClick={prevStep} className="back-button">
            Anterior
          </button>
          <button type="submit" className="next-button" onClick={nextStep}>
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form3;