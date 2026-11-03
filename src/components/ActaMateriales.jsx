import { useState, useEffect } from 'react';
import styles from './ActaMateriales.module.css';

function ActaMateriales({ data, handleChange, nextStep, prevStep }) {
  
  // Inicializar materiales desde data si existe, si no, usar el objeto por defecto
  const [materiales, setMateriales] = useState(() => {
  if (data.materiales && Object.keys(data.materiales).length > 0) {
    return data.materiales;
  }
  return {
    // ==================== MEDIDOR - DATOS GENERALES ====================
    medidor: { fasico: '', fases: '', hilos: '' },
    
    // ==================== MEDIDORES ====================
    // Medidor Electromecánico
    medidorElectroMecanico: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        fasico: '', 
        fases: '', 
        hilos: '', 
        tipo: '', 
        amperios: '', 
        voltios: '', 
        clase: '' 
      } 
    },
    
    // Medidor Electrónico Registrador Ciclométrico
    medidorElectronicoRegis: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        tipo: '', 
        amperios: '', 
        voltios: '', 
        clase: '' 
      } 
    },
    
    // Medidor Electrónico con Display
    medidorElectronicoDisplay: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        tipo: '', 
        amperios: '', 
        voltios: '', 
        clase: '' 
      } 
    },
    
    // ==================== MEDIDORES PARA MEDIDA SEMI E INDIRECTA ====================
    // Medidor Electromecánico Semi
    medidorSemiElectro: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        fases: '', 
        hilos: '', 
        clase: '', 
        amperios: '', 
        voltios: '' 
      } 
    },
    
    // Medidor Electrónico Semi (Registrador Ciclométrico)
    medidorSemiElectronico: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        fases: '', 
        hilos: '', 
        clase: '', 
        amperios: '', 
        voltios: '' 
      } 
    },
    
    // Medidor Sin Perfil
    medidorSinPerfil: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        fases: '', 
        hilos: '', 
        clase: '', 
        amperios: '', 
        voltios: '' 
      } 
    },
    
    // Medidor con Perfil de Carga y Comunicaciones
    medidorConPerfil: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        comunicaciones: '', 
        clase: '' 
      } 
    },
    
    // Medidor con Perfil de Carga y Módem Interno
    medidorConPerfilModem: { 
      estado: '', 
      cantidad: 0, 
      especificaciones: { 
        clase: '' 
      } 
    },
    
    // ==================== PROTECCIONES Y HERRAJES ====================
    cintaBandit: { estado: '', cantidad: 0, medida: '' },
    grapaHebilla: { estado: '', cantidad: 0, medida: '' },
    capacete: { estado: '', cantidad: 0, medida: '' },
    conectorCurvo: { estado: '', cantidad: 0, medida: '' },
    conduletas: { estado: '', cantidad: 0, medida: '' },
    conduletaTapa: { estado: '', cantidad: 0, tipo: '', medida: '' },
    tuboGalvanizado: { estado: '', cantidad: 0, medida: '' },
    anclajeAcometida: { estado: '', cantidad: 0, tipo: '' },
    conectorBimetalicoCuna: { estado: '', cantidad: 0, tipo: '' },
    estribo: { estado: '', cantidad: 0, tipo: '' },
    conectorBimetalicoPerno: { estado: '', cantidad: 0, tipo: '' },
    tensorAcometida: { estado: '', cantidad: 0 },
    ojoAluminio: { estado: '', cantidad: 0 },
    tensorCambio: { estado: '', cantidad: 0 }, // ⭐ NUEVO
    breakers: { estado: '', cantidad: 0, amperios: '' },
    conectorVarilla: { estado: '', cantidad: 0 },
    terminalMT: { estado: '', cantidad: 0, medida: '' },
    curvaMT: { estado: '', cantidad: 0, medida: '' },
    flexiConduit: { estado: '', cantidad: 0, medida: '' },
    terminalFlexi: { estado: '', cantidad: 0, medida: '' },
    
    // ==================== ROUTER Y VARIOS ====================
    routerGPRS: { estado: '', cantidad: 0, simCard: '' }, // ⭐ NUEVO
    conversores: { estado: '', cantidad: 0 }, // ⭐ NUEVO
    bloquePrueba: { estado: '', cantidad: 0 }, // ⭐ NUEVO
    
    // ==================== SELLOS ====================
    rotoseal: { estado: '', cantidad: 0, color: '' },
    estampilla: { estado: '', cantidad: 0 },
    
    // ==================== TRANSFORMADORES DE CORRIENTE ====================
    tcUsoExterior600: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      amperios: '', 
      amperios2: '', 
      clase: '' 
    },
    tcUsoInterior600: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      amperios: '', 
      amperios2: '', 
      clase: '' 
    },
    tcUsoExteriorAlta: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      kv: '', 
      primario: '', 
      secundario: '', 
      clase: '' 
    },
    tcUsoInteriorAlta: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      kv: '', 
      kv2: '', 
      primario: '', 
      secundario: '', 
      clase: '' 
    },
    
    // ==================== TRANSFORMADORES DE POTENCIAL ====================
    tpUsoExterior: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      primario: '', 
      secundario: '', 
      clase: '' 
    },
    tpUsoInterior: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      primario: '', 
      secundario: '', 
      clase: '' 
    },
    
    // ==================== CABLES Y ALAMBRE ====================
    cableConcentrico: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      calibre: '', 
      conductores: '', 
      neutro: '' 
    },
    cableControl: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      conductores: '', 
      calibre: '' 
    },
    alambreCobre: { estado: '', cantidad: 0, calibre: '' },
    varillaPuestaTierra: { estado: '', cantidad: 0, metros: '' },
    
    // ==================== CAJAS HERMÉTICAS ====================
    cajaSobreponer: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      fasico: '', 
      tipo: '' 
    },
    cajaIncrustar: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0, 
      fasico: '', 
      tipo: '' 
    },
    cajaGabinete: { // ⭐ NUEVO
      estado: '', 
      cantidad: 0 
    },
    
    // ==================== MATERIAL RETIRADO ====================
    materialRetirado: { descripcion: '' }
  };
});

  // Estado para datos del usuario logueado
  const [userData, setUserData] = useState({ name: '', cc: '' });

  // Obtener datos del usuario al cargar
  useEffect(() => {
    const getUserData = async () => {
      try {
        const name = localStorage.getItem('userName');
        const cc = localStorage.getItem('userCC');
        if (name && cc) {
          setUserData({ name, cc });
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    };
    getUserData();
  }, []);

  const opcionesEstado = [
    { value: '', label: 'Seleccione' },
    { value: 'PR', label: 'PR - Provisional' },
    { value: 'VE', label: 'VE - Venta' },
    { value: 'TE', label: 'TE - Usuario' },
    { value: 'RE', label: 'RE - Reutilizado' },
    { value: 'FI', label: 'FI - Financiado' }
  ];

  const opcionesEstadoRetirado = [
    { value: '', label: 'Seleccione' },
    { value: 'EA', label: 'EA - Entregado al usuario' },
    { value: 'BC', label: 'BC - Bodega Contratista' },
    { value: 'BE', label: 'BE - Bodega' },
    { value: 'EMSA', label: 'EMSA - PR' }
  ];

  const incrementarCantidad = (materialKey) => {
    setMateriales(prev => ({
      ...prev,
      [materialKey]: {
        ...prev[materialKey],
        cantidad: (prev[materialKey]?.cantidad || 0) + 1
      }
    }));
  };

  const decrementarCantidad = (materialKey) => {
    setMateriales(prev => ({
      ...prev,
      [materialKey]: {
        ...prev[materialKey],
        cantidad: Math.max(0, (prev[materialKey]?.cantidad || 0) - 1)
      }
    }));
  };

  const cambiarEstado = (materialKey, value) => {
    setMateriales(prev => ({
      ...prev,
      [materialKey]: {
        ...prev[materialKey],
        estado: value
      }
    }));
  };

  const handleMaterialChange = (materialKey, field, value) => {
    setMateriales(prev => ({
      ...prev,
      [materialKey]: {
        ...prev[materialKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar los materiales en data antes de avanzar
    handleChange({ target: { name: 'materiales', value: materiales } });
    nextStep();
  };

  // Obtener fecha y hora actual
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString('es-ES', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentTime = currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Estado para los precios de los materiales
  const [precios, setPrecios] = useState({
    // Medidores
    medidorElectroMecanico: 1000000,
    medidorElectronicoRegis: 1200000,
    medidorElectronicoDisplay: 1500000,
    medidorSemiElectro: 800000,
    medidorSemiElectronico: 900000,
    medidorSinPerfil: 1100000,
    medidorConPerfil: 1300000,
    medidorConPerfilModem: 1600000,
    // Protecciones y Herrajes
    cintaBandit: 15000,
    grapaHebilla: 8000,
    capacete: 25000,
    conectorCurvo: 12000,
    conduletas: 18000,
    conduletaTapa: 22000,
    tuboGalvanizado: 35000,
    anclajeAcometida: 28000,
    conectorBimetalicoCuna: 32000,
    estribo: 25000,
    conectorBimetalicoPerno: 30000,
    tensorAcometida: 45000,
    ojoAluminio: 15000,
    breakers: 55000,
    conectorVarilla: 12000,
    tensorCambio: 45000,
    alambreCobre: 8000,
    varillaPuestaTierra: 65000,
    terminalMT: 18000,
    curvaMT: 15000,
    flexiConduit: 22000,
    terminalFlexi: 12000,
    // Router y Varios
    routerGPRS: 250000,
    conversores: 180000,
    bloquePrueba: 95000,
    // Sellos
    rotoseal: 5000,
    estampilla: 3000,
    // Cables y Alambre
    cableConcentrico: 120000,
    cableControl: 85000,
    // Caja Hermetica
    cajaSobreponer: 75000,
    cajaIncrustar: 82000,
    cajaGabinete: 120000,
    // Material Retirado
    materialRetirado: 0
  });

  // Función para calcular el subtotal de un material
  const calcularSubtotal = (materialKey) => {
    const cantidad = materiales[materialKey]?.cantidad || 0;
    const precioUnitario = precios[materialKey] || 0;
    return cantidad * precioUnitario;
  };

  // Función para calcular el total general
  const calcularTotalGeneral = () => {
    let total = 0;
    Object.keys(materiales).forEach(key => {
      if (key !== 'materialRetirado') {
        total += calcularSubtotal(key);
      }
    });
    return total;
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        
        {/* INFORMACIÓN DE LA VISITA - Texto generado dinámicamente */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Información de la Visita</h2>
          
          <div className={styles.generatedText}>
            <p>
              A los <span className={styles.resaltado}>{data.fechaDia || currentDay}</span> días del mes de{' '}
              <span className={styles.resaltado}>{data.fechaMes || currentMonth}</span> del{' '}
              <span className={styles.resaltado}>{data.fechaAnio || currentYear}</span>, siendo las{' '}
              <span className={styles.resaltado}>{currentTime}</span> se hicieron presentes los señores{' '}
              <span className={styles.resaltado}>{userData.name || '______'}</span> y{' '}
              <span className={styles.resaltado}>{userData.cc  || '______'}</span> en representación de la EMSA ESP, 
              en el inmueble ubicado en la{' '}
              <span className={styles.resaltado}>{data.direccion || '______'}</span> del Municipio de{' '}
              <span className={styles.resaltado}>{data.ciudad || '______'}</span> con el fin de instalar material eléctrico, 
              el cual tiene las siguientes características.
            </p>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.editSection}>
            <p><strong>ESTADO DEL MATERIAL INSTALADO:</strong> PR:Provisional, VE:Venta, TE:Usuario, RE:Reutilizado, FI:Financiado</p>
            <p><strong>ESTADO DEL MATERIAL RETIRADO:</strong> EA:Entregado al usuario, BC:Bodega Contratista, BE:Bodega, EMSA:PR</p>
          </div>
        </div>

        {/* MEDIDORES */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Medidores</h2>
          
          {/* MEDIDOR - DATOS GENERALES (fasico, F, H) */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fasico</label>
                <input type="text" className={styles.input} placeholder="Ej: 1, 2, 3"
                  value={materiales.medidor?.fasico || ''}
                  onChange={(e) => handleMaterialChange('medidor', 'fasico', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fases (F)</label>
                <input type="text" className={styles.input} placeholder="Fases"
                  value={materiales.medidor?.fases || ''}
                  onChange={(e) => handleMaterialChange('medidor', 'fases', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Hilos (H)</label>
                <input type="text" className={styles.input} placeholder="Hilos"
                  value={materiales.medidor?.hilos || ''}
                  onChange={(e) => handleMaterialChange('medidor', 'hilos', e.target.value)} />
              </div>
            </div>
          </div>

          {/* MEDIDOR ELECTROMECÁNICO */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor Electromecánico</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo"
                  value={materiales.medidorElectroMecanico?.especificaciones?.tipo || ''}
                  onChange={(e) => handleMaterialChange('medidorElectroMecanico', 'especificaciones', { ...materiales.medidorElectroMecanico?.especificaciones, tipo: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios (A)</label>
                <input type="text" className={styles.input} placeholder="Amperios"
                  value={materiales.medidorElectroMecanico?.especificaciones?.amperios || ''}
                  onChange={(e) => handleMaterialChange('medidorElectroMecanico', 'especificaciones', { ...materiales.medidorElectroMecanico?.especificaciones, amperios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios (V)</label>
                <input type="text" className={styles.input} placeholder="Voltios"
                  value={materiales.medidorElectroMecanico?.especificaciones?.voltios || ''}
                  onChange={(e) => handleMaterialChange('medidorElectroMecanico', 'especificaciones', { ...materiales.medidorElectroMecanico?.especificaciones, voltios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorElectroMecanico?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorElectroMecanico', 'especificaciones', { ...materiales.medidorElectroMecanico?.especificaciones, clase: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorElectroMecanico?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorElectroMecanico', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button 
                    type="button" 
                    onClick={() => decrementarCantidad('medidorElectroMecanico')} 
                    className={styles.cantidadChipBtn}
                  >
                    −
                  </button>
                  <span className={styles.cantidadChipValor}>
                    {String(materiales.medidorElectroMecanico?.cantidad || 0).padStart(2, '0')}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => incrementarCantidad('medidorElectroMecanico')} 
                    className={styles.cantidadChipBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIDOR ELECTRÓNICO (REGISTRADOR CICLOMÉTRICO) */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor Electrónico (Registrador Ciclométrico)</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo"
                  value={materiales.medidorElectronicoRegis?.especificaciones?.tipo || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoRegis', 'especificaciones', { ...materiales.medidorElectronicoRegis?.especificaciones, tipo: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios (A)</label>
                <input type="text" className={styles.input} placeholder="Amperios"
                  value={materiales.medidorElectronicoRegis?.especificaciones?.amperios || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoRegis', 'especificaciones', { ...materiales.medidorElectronicoRegis?.especificaciones, amperios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios (V)</label>
                <input type="text" className={styles.input} placeholder="Voltios"
                  value={materiales.medidorElectronicoRegis?.especificaciones?.voltios || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoRegis', 'especificaciones', { ...materiales.medidorElectronicoRegis?.especificaciones, voltios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorElectronicoRegis?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoRegis', 'especificaciones', { ...materiales.medidorElectronicoRegis?.especificaciones, clase: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorElectronicoRegis?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorElectronicoRegis', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('medidorElectronicoRegis')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>
                    {String(materiales.medidorElectronicoRegis?.cantidad || 0).padStart(2, '0')}
                  </span>
                  <button type="button" onClick={() => incrementarCantidad('medidorElectronicoRegis')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIDOR ELECTRÓNICO CON DISPLAY */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor Electrónico con Display</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo"
                  value={materiales.medidorElectronicoDisplay?.especificaciones?.tipo || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoDisplay', 'especificaciones', { ...materiales.medidorElectronicoDisplay?.especificaciones, tipo: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios (A)</label>
                <input type="text" className={styles.input} placeholder="Amperios"
                  value={materiales.medidorElectronicoDisplay?.especificaciones?.amperios || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoDisplay', 'especificaciones', { ...materiales.medidorElectronicoDisplay?.especificaciones, amperios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios (V)</label>
                <input type="text" className={styles.input} placeholder="Voltios"
                  value={materiales.medidorElectronicoDisplay?.especificaciones?.voltios || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoDisplay', 'especificaciones', { ...materiales.medidorElectronicoDisplay?.especificaciones, voltios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorElectronicoDisplay?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorElectronicoDisplay', 'especificaciones', { ...materiales.medidorElectronicoDisplay?.especificaciones, clase: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorElectronicoDisplay?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorElectronicoDisplay', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button 
                    type="button" 
                    onClick={() => decrementarCantidad('medidorElectronicoDisplay')} 
                    className={styles.cantidadChipBtn}
                  >
                    −
                  </button>
                  <span className={styles.cantidadChipValor}>
                    {String(materiales.medidorElectronicoDisplay?.cantidad || 0).padStart(2, '0')}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => incrementarCantidad('medidorElectronicoDisplay')} 
                    className={styles.cantidadChipBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MEDIDORES PARA MEDIDA SEMI E INDIRECTA */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Medidores para Medida Semi e Indirecta</h2>

          {/* MEDIDOR ELECTROMECÁNICO SEMI */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor Electromecánico Semi</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fases (F)</label>
                <input type="text" className={styles.input} placeholder="Fases"
                  value={materiales.medidorSemiElectro?.especificaciones?.fases || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectro', 'especificaciones', { ...materiales.medidorSemiElectro?.especificaciones, fases: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Hilos (H)</label>
                <input type="text" className={styles.input} placeholder="Hilos"
                  value={materiales.medidorSemiElectro?.especificaciones?.hilos || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectro', 'especificaciones', { ...materiales.medidorSemiElectro?.especificaciones, hilos: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorSemiElectro?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectro', 'especificaciones', { ...materiales.medidorSemiElectro?.especificaciones, clase: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios (A)</label>
                <input type="text" className={styles.input} placeholder="Amperios"
                  value={materiales.medidorSemiElectro?.especificaciones?.amperios || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectro', 'especificaciones', { ...materiales.medidorSemiElectro?.especificaciones, amperios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios (V)</label>
                <input type="text" className={styles.input} placeholder="Voltios"
                  value={materiales.medidorSemiElectro?.especificaciones?.voltios || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectro', 'especificaciones', { ...materiales.medidorSemiElectro?.especificaciones, voltios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorSemiElectro?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorSemiElectro', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('medidorSemiElectro')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.medidorSemiElectro?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('medidorSemiElectro')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIDOR ELECTRÓNICO SEMI */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor Electrónico Semi (Registrador Ciclométrico)</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fases (F)</label>
                <input type="text" className={styles.input} placeholder="Fases"
                  value={materiales.medidorSemiElectronico?.especificaciones?.fases || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectronico', 'especificaciones', { ...materiales.medidorSemiElectronico?.especificaciones, fases: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Hilos (H)</label>
                <input type="text" className={styles.input} placeholder="Hilos"
                  value={materiales.medidorSemiElectronico?.especificaciones?.hilos || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectronico', 'especificaciones', { ...materiales.medidorSemiElectronico?.especificaciones, hilos: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorSemiElectronico?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectronico', 'especificaciones', { ...materiales.medidorSemiElectronico?.especificaciones, clase: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios (A)</label>
                <input type="text" className={styles.input} placeholder="Amperios"
                  value={materiales.medidorSemiElectronico?.especificaciones?.amperios || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectronico', 'especificaciones', { ...materiales.medidorSemiElectronico?.especificaciones, amperios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios (V)</label>
                <input type="text" className={styles.input} placeholder="Voltios"
                  value={materiales.medidorSemiElectronico?.especificaciones?.voltios || ''}
                  onChange={(e) => handleMaterialChange('medidorSemiElectronico', 'especificaciones', { ...materiales.medidorSemiElectronico?.especificaciones, voltios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorSemiElectronico?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorSemiElectronico', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('medidorSemiElectronico')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.medidorSemiElectronico?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('medidorSemiElectronico')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* SIN PERFIL */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor Sin Perfil</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fases (F)</label>
                <input type="text" className={styles.input} placeholder="Fases"
                  value={materiales.medidorSinPerfil?.especificaciones?.fases || ''}
                  onChange={(e) => handleMaterialChange('medidorSinPerfil', 'especificaciones', { ...materiales.medidorSinPerfil?.especificaciones, fases: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Hilos (H)</label>
                <input type="text" className={styles.input} placeholder="Hilos"
                  value={materiales.medidorSinPerfil?.especificaciones?.hilos || ''}
                  onChange={(e) => handleMaterialChange('medidorSinPerfil', 'especificaciones', { ...materiales.medidorSinPerfil?.especificaciones, hilos: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorSinPerfil?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorSinPerfil', 'especificaciones', { ...materiales.medidorSinPerfil?.especificaciones, clase: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios (A)</label>
                <input type="text" className={styles.input} placeholder="Amperios"
                  value={materiales.medidorSinPerfil?.especificaciones?.amperios || ''}
                  onChange={(e) => handleMaterialChange('medidorSinPerfil', 'especificaciones', { ...materiales.medidorSinPerfil?.especificaciones, amperios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios (V)</label>
                <input type="text" className={styles.input} placeholder="Voltios"
                  value={materiales.medidorSinPerfil?.especificaciones?.voltios || ''}
                  onChange={(e) => handleMaterialChange('medidorSinPerfil', 'especificaciones', { ...materiales.medidorSinPerfil?.especificaciones, voltios: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorSinPerfil?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorSinPerfil', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('medidorSinPerfil')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.medidorSinPerfil?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('medidorSinPerfil')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* CON PERFIL DE CARGA Y COMUNICACIONES */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor con Perfil de Carga y Comunicaciones</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Comunicaciones</label>
                <input type="text" className={styles.input} placeholder="Ej: RS232, RS485"
                  value={materiales.medidorConPerfil?.especificaciones?.comunicaciones || ''}
                  onChange={(e) => handleMaterialChange('medidorConPerfil', 'especificaciones', { ...materiales.medidorConPerfil?.especificaciones, comunicaciones: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorConPerfil?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorConPerfil', 'especificaciones', { ...materiales.medidorConPerfil?.especificaciones, clase: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorConPerfil?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorConPerfil', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('medidorConPerfil')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.medidorConPerfil?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('medidorConPerfil')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* CON PERFIL DE CARGA Y MODEM INTERNO */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Medidor con Perfil de Carga y Módem Interno</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clase</label>
                <input type="text" className={styles.input} placeholder="Clase"
                  value={materiales.medidorConPerfilModem?.especificaciones?.clase || ''}
                  onChange={(e) => handleMaterialChange('medidorConPerfilModem', 'especificaciones', { ...materiales.medidorConPerfilModem?.especificaciones, clase: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.medidorConPerfilModem?.estado || ''}
                  onChange={(e) => cambiarEstado('medidorConPerfilModem', e.target.value)}>
                  {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('medidorConPerfilModem')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.medidorConPerfilModem?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('medidorConPerfilModem')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROTECCIONES Y HERRAJES */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Protecciones y Herrajes</h2>
          
          <div className={styles.grid4Cols}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Cinta Bandit</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.cintaBandit?.medida || ''}
                  onChange={(e) => handleMaterialChange('cintaBandit', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.cintaBandit?.estado || ''}
                    onChange={(e) => cambiarEstado('cintaBandit', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('cintaBandit')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.cintaBandit?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('cintaBandit')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Grapa Hebilla</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.grapaHebilla?.medida || ''}
                  onChange={(e) => handleMaterialChange('grapaHebilla', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.grapaHebilla?.estado || ''}
                    onChange={(e) => cambiarEstado('grapaHebilla', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('grapaHebilla')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.grapaHebilla?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('grapaHebilla')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Capacete</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.capacete?.medida || ''}
                  onChange={(e) => handleMaterialChange('capacete', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.capacete?.estado || ''}
                    onChange={(e) => cambiarEstado('capacete', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('capacete')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.capacete?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('capacete')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conector Curvo</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.conectorCurvo?.medida || ''}
                  onChange={(e) => handleMaterialChange('conectorCurvo', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conectorCurvo?.estado || ''}
                    onChange={(e) => cambiarEstado('conectorCurvo', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('conectorCurvo')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.conectorCurvo?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('conectorCurvo')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conduletas</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.conduletas?.medida || ''}
                  onChange={(e) => handleMaterialChange('conduletas', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conduletas?.estado || ''}
                    onChange={(e) => cambiarEstado('conduletas', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
               <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('conduletas')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.conduletas?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('conduletas')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conduleta con Tapa</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo"
                  value={materiales.conduletaTapa?.tipo || ''}
                  onChange={(e) => handleMaterialChange('conduletaTapa', 'tipo', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.conduletaTapa?.medida || ''}
                  onChange={(e) => handleMaterialChange('conduletaTapa', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conduletaTapa?.estado || ''}
                    onChange={(e) => cambiarEstado('conduletaTapa', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('conduletaTapa')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.conduletaTapa?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('conduletaTapa')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Tubo Galvanizado</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Medida (pulgadas)</label>
                <input type="text" className={styles.input} placeholder="Medida"
                  value={materiales.tuboGalvanizado?.medida || ''}
                  onChange={(e) => handleMaterialChange('tuboGalvanizado', 'medida', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tuboGalvanizado?.estado || ''}
                    onChange={(e) => cambiarEstado('tuboGalvanizado', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => decrementarCantidad('tuboGalvanizado')} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.tuboGalvanizado?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => incrementarCantidad('tuboGalvanizado')} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
              </div>
            </div>

            {/* CONECTOR BIMETALICO TIPO CUÑA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conector Bimetálico Tipo Cuña</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo de cuña"
                  value={materiales.conectorBimetalicoCuna?.tipo || ''}
                  onChange={(e) => handleMaterialChange('conectorBimetalicoCuna', 'tipo', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conectorBimetalicoCuna?.estado || ''}
                    onChange={(e) => cambiarEstado('conectorBimetalicoCuna', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('conectorBimetalicoCuna')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.conectorBimetalicoCuna?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('conectorBimetalicoCuna')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ESTRIBO */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Estribo</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo de estribo"
                  value={materiales.estribo?.tipo || ''}
                  onChange={(e) => handleMaterialChange('estribo', 'tipo', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.estribo?.estado || ''}
                    onChange={(e) => cambiarEstado('estribo', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('estribo')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.estribo?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('estribo')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CONECTOR BIMETALICO PERNO */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conector Bimetálico Perno</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo de perno"
                  value={materiales.conectorBimetalicoPerno?.tipo || ''}
                  onChange={(e) => handleMaterialChange('conectorBimetalicoPerno', 'tipo', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conectorBimetalicoPerno?.estado || ''}
                    onChange={(e) => cambiarEstado('conectorBimetalicoPerno', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('conectorBimetalicoPerno')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.conectorBimetalicoPerno?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('conectorBimetalicoPerno')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* TENSOR PARA ACOMETIDA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Tensor para Acometida</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tensorAcometida?.estado || ''}
                    onChange={(e) => cambiarEstado('tensorAcometida', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('tensorAcometida')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.tensorAcometida?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('tensorAcometida')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* OJO DE ALUMINIO */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Ojo de Aluminio</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.ojoAluminio?.estado || ''}
                    onChange={(e) => cambiarEstado('ojoAluminio', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('ojoAluminio')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.ojoAluminio?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('ojoAluminio')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* TENSOR PARA ACOMETIDA CABLE CONCENTRICO CAMBIO */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Tensor para Acometida Cable Concéntrico Cambio</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tensorCambio?.estado || ''}
                    onChange={(e) => cambiarEstado('tensorCambio', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('tensorCambio')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.tensorCambio?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('tensorCambio')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Anclaje Acometida</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo</label>
                <input type="text" className={styles.input} placeholder="Tipo"
                  value={materiales.anclajeAcometida?.tipo || ''}
                  onChange={(e) => handleMaterialChange('anclajeAcometida', 'tipo', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.anclajeAcometida?.estado || ''}
                    onChange={(e) => cambiarEstado('anclajeAcometida', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('anclajeAcometida')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.anclajeAcometida?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('anclajeAcometida')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
            {/* BREAKERS */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Breakers</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios</label>
                <input type="text" className={styles.input} placeholder="Ej: 2x15, 1x20"
                  value={materiales.breakers?.amperios || ''}
                  onChange={(e) => handleMaterialChange('breakers', 'amperios', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.breakers?.estado || ''}
                    onChange={(e) => cambiarEstado('breakers', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('breakers')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.breakers?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('breakers')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CONECTOR PARA VARILLA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conector para Varilla</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conectorVarilla?.estado || ''}
                    onChange={(e) => cambiarEstado('conectorVarilla', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('conectorVarilla')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.conectorVarilla?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('conectorVarilla')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTER Y VARIOS */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Router y Varios</h2>
          
          <div className={styles.grid3Cols}>
            {/* ROUTER GPRS */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Router GPRS</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>SIM Card</label>
                <input type="text" className={styles.input} placeholder="Ej: Movistar, Claro"
                  value={materiales.routerGPRS?.simCard || ''}
                  onChange={(e) => handleMaterialChange('routerGPRS', 'simCard', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.routerGPRS?.estado || ''}
                    onChange={(e) => cambiarEstado('routerGPRS', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('routerGPRS')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.routerGPRS?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('routerGPRS')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CONVERSORES */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Conversores</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.conversores?.estado || ''}
                    onChange={(e) => cambiarEstado('conversores', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('conversores')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.conversores?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('conversores')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOQUE DE PRUEBA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Bloque de Prueba</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.bloquePrueba?.estado || ''}
                    onChange={(e) => cambiarEstado('bloquePrueba', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('bloquePrueba')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.bloquePrueba?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('bloquePrueba')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSFORMADORES DE CORRIENTE */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Transformadores de Corriente (TC)</h2>
          
          <div className={styles.grid2Cols}>
            {/* TC USO EXTERIOR 600V */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>TC Uso Exterior 600V</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Amperios (Primario)</label>
                  <input type="text" className={styles.input} placeholder="Primario"
                    value={materiales.tcUsoExterior600?.amperios || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExterior600', 'amperios', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Amperios (Secundario)</label>
                  <input type="text" className={styles.input} placeholder="Secundario"
                    value={materiales.tcUsoExterior600?.amperios2 || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExterior600', 'amperios2', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clase</label>
                  <input type="text" className={styles.input} placeholder="Clase"
                    value={materiales.tcUsoExterior600?.clase || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExterior600', 'clase', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tcUsoExterior600?.estado || ''}
                    onChange={(e) => cambiarEstado('tcUsoExterior600', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('tcUsoExterior600')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.tcUsoExterior600?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('tcUsoExterior600')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* TC USO INTERIOR 600V */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>TC Uso Interior 600V</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Amperios (Primario)</label>
                  <input type="text" className={styles.input} placeholder="Primario"
                    value={materiales.tcUsoInterior600?.amperios || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInterior600', 'amperios', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Amperios (Secundario)</label>
                  <input type="text" className={styles.input} placeholder="Secundario"
                    value={materiales.tcUsoInterior600?.amperios2 || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInterior600', 'amperios2', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clase</label>
                  <input type="text" className={styles.input} placeholder="Clase"
                    value={materiales.tcUsoInterior600?.clase || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInterior600', 'clase', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tcUsoInterior600?.estado || ''}
                    onChange={(e) => cambiarEstado('tcUsoInterior600', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('tcUsoInterior600')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.tcUsoInterior600?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('tcUsoInterior600')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* TC USO EXTERIOR ALTA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>TC Uso Exterior Alta Tensión</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kv</label>
                  <input type="text" className={styles.input} placeholder="Kv"
                    value={materiales.tcUsoExteriorAlta?.kv || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExteriorAlta', 'kv', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primario (Amp)</label>
                  <input type="text" className={styles.input} placeholder="Primario"
                    value={materiales.tcUsoExteriorAlta?.primario || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExteriorAlta', 'primario', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secundario (Amp)</label>
                  <input type="text" className={styles.input} placeholder="Secundario"
                    value={materiales.tcUsoExteriorAlta?.secundario || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExteriorAlta', 'secundario', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clase</label>
                  <input type="text" className={styles.input} placeholder="Clase"
                    value={materiales.tcUsoExteriorAlta?.clase || ''}
                    onChange={(e) => handleMaterialChange('tcUsoExteriorAlta', 'clase', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tcUsoExteriorAlta?.estado || ''}
                    onChange={(e) => cambiarEstado('tcUsoExteriorAlta', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('tcUsoExteriorAlta')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.tcUsoExteriorAlta?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('tcUsoExteriorAlta')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* TC USO INTERIOR ALTA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>TC Uso Interior Alta Tensión</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kv</label>
                  <input type="text" className={styles.input} placeholder="Kv"
                    value={materiales.tcUsoInteriorAlta?.kv || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInteriorAlta', 'kv', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primario (Amp)</label>
                  <input type="text" className={styles.input} placeholder="Primario"
                    value={materiales.tcUsoInteriorAlta?.primario || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInteriorAlta', 'primario', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secundario (Amp)</label>
                  <input type="text" className={styles.input} placeholder="Secundario"
                    value={materiales.tcUsoInteriorAlta?.secundario || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInteriorAlta', 'secundario', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clase</label>
                  <input type="text" className={styles.input} placeholder="Clase"
                    value={materiales.tcUsoInteriorAlta?.clase || ''}
                    onChange={(e) => handleMaterialChange('tcUsoInteriorAlta', 'clase', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.tcUsoInteriorAlta?.estado || ''}
                    onChange={(e) => cambiarEstado('tcUsoInteriorAlta', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('tcUsoInteriorAlta')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.tcUsoInteriorAlta?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('tcUsoInteriorAlta')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSFORMADORES DE POTENCIAL */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Transformadores de Potencial (TP)</h2>
          
          <div className={styles.grid2Cols}>
            {/* TP USO EXTERIOR */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>TP Uso Exterior</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primario (Vol)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ej: 13200"
                    value={materiales.tpUsoExterior?.primario || ''}
                    onChange={(e) => handleMaterialChange('tpUsoExterior', 'primario', e.target.value)} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secundario (Vol)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ej: 120"
                    value={materiales.tpUsoExterior?.secundario || ''}
                    onChange={(e) => handleMaterialChange('tpUsoExterior', 'secundario', e.target.value)} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clase</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ej: 0.3"
                    value={materiales.tpUsoExterior?.clase || ''}
                    onChange={(e) => handleMaterialChange('tpUsoExterior', 'clase', e.target.value)} 
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select 
                    className={styles.select} 
                    value={materiales.tpUsoExterior?.estado || ''}
                    onChange={(e) => cambiarEstado('tpUsoExterior', e.target.value)}
                  >
                    {opcionesEstado.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button 
                      type="button" 
                      onClick={() => decrementarCantidad('tpUsoExterior')} 
                      className={styles.cantidadChipBtn}
                    >
                      −
                    </button>
                    <span className={styles.cantidadChipValor}>
                      {String(materiales.tpUsoExterior?.cantidad || 0).padStart(2, '0')}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => incrementarCantidad('tpUsoExterior')} 
                      className={styles.cantidadChipBtn}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TP USO INTERIOR */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>TP Uso Interior</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primario (Vol)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ej: 13200"
                    value={materiales.tpUsoInterior?.primario || ''}
                    onChange={(e) => handleMaterialChange('tpUsoInterior', 'primario', e.target.value)} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secundario (Vol)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ej: 120"
                    value={materiales.tpUsoInterior?.secundario || ''}
                    onChange={(e) => handleMaterialChange('tpUsoInterior', 'secundario', e.target.value)} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clase</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ej: 0.3"
                    value={materiales.tpUsoInterior?.clase || ''}
                    onChange={(e) => handleMaterialChange('tpUsoInterior', 'clase', e.target.value)} 
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select 
                    className={styles.select} 
                    value={materiales.tpUsoInterior?.estado || ''}
                    onChange={(e) => cambiarEstado('tpUsoInterior', e.target.value)}
                  >
                    {opcionesEstado.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button 
                      type="button" 
                      onClick={() => decrementarCantidad('tpUsoInterior')} 
                      className={styles.cantidadChipBtn}
                    >
                      −
                    </button>
                    <span className={styles.cantidadChipValor}>
                      {String(materiales.tpUsoInterior?.cantidad || 0).padStart(2, '0')}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => incrementarCantidad('tpUsoInterior')} 
                      className={styles.cantidadChipBtn}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CABLES Y ALAMBRE */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Cables y Alambre</h2>
          
          <div className={styles.grid2Cols}>
            {/* CABLE CONCENTRICO */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Cable Concéntrico</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Calibre</label>
                  <input type="text" className={styles.input} placeholder="Calibre"
                    value={materiales.cableConcentrico?.calibre || ''}
                    onChange={(e) => handleMaterialChange('cableConcentrico', 'calibre', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Conductores</label>
                  <input type="text" className={styles.input} placeholder="Ej: 1, 3"
                    value={materiales.cableConcentrico?.conductores || ''}
                    onChange={(e) => handleMaterialChange('cableConcentrico', 'conductores', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Neutro</label>
                  <input type="text" className={styles.input} placeholder="Neutro"
                    value={materiales.cableConcentrico?.neutro || ''}
                    onChange={(e) => handleMaterialChange('cableConcentrico', 'neutro', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.cableConcentrico?.estado || ''}
                    onChange={(e) => cambiarEstado('cableConcentrico', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('cableConcentrico')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.cableConcentrico?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('cableConcentrico')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CABLE DE CONTROL */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Cable de Control</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Conductores</label>
                  <input type="text" className={styles.input} placeholder="N° conductores"
                    value={materiales.cableControl?.conductores || ''}
                    onChange={(e) => handleMaterialChange('cableControl', 'conductores', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Calibre (AWG)</label>
                  <input type="text" className={styles.input} placeholder="Calibre"
                    value={materiales.cableControl?.calibre || ''}
                    onChange={(e) => handleMaterialChange('cableControl', 'calibre', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.cableControl?.estado || ''}
                    onChange={(e) => cambiarEstado('cableControl', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('cableControl')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.cableControl?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('cableControl')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ALAMBRE DE COBRE */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Alambre de Cobre</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Calibre (AWG)</label>
                <input type="text" className={styles.input} placeholder="Calibre"
                  value={materiales.alambreCobre?.calibre || ''}
                  onChange={(e) => handleMaterialChange('alambreCobre', 'calibre', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.alambreCobre?.estado || ''}
                    onChange={(e) => cambiarEstado('alambreCobre', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('alambreCobre')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.alambreCobre?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('alambreCobre')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* VARILLA PUESTA A TIERRA */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Varilla Puesta a Tierra</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Metros</label>
                <input type="text" className={styles.input} placeholder="Metros"
                  value={materiales.varillaPuestaTierra?.metros || ''}
                  onChange={(e) => handleMaterialChange('varillaPuestaTierra', 'metros', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.varillaPuestaTierra?.estado || ''}
                    onChange={(e) => cambiarEstado('varillaPuestaTierra', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('varillaPuestaTierra')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.varillaPuestaTierra?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('varillaPuestaTierra')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERMINAL MT */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Terminal MT</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>Medida (pulgadas)</label>
            <input type="text" className={styles.input} placeholder="Medida"
              value={materiales.terminalMT?.medida || ''}
              onChange={(e) => handleMaterialChange('terminalMT', 'medida', e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estado</label>
              <select className={styles.select} value={materiales.terminalMT?.estado || ''}
                onChange={(e) => cambiarEstado('terminalMT', e.target.value)}>
                {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad</label>
              <div className={styles.cantidadChip}>
                <button type="button" onClick={() => decrementarCantidad('terminalMT')} className={styles.cantidadChipBtn}>-</button>
                <span className={styles.cantidadChipValor}>{String(materiales.terminalMT?.cantidad || 0).padStart(2, '0')}</span>
                <button type="button" onClick={() => incrementarCantidad('terminalMT')} className={styles.cantidadChipBtn}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* CURVA MT */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Curva MT</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>Medida (pulgadas)</label>
            <input type="text" className={styles.input} placeholder="Medida"
              value={materiales.curvaMT?.medida || ''}
              onChange={(e) => handleMaterialChange('curvaMT', 'medida', e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estado</label>
              <select className={styles.select} value={materiales.curvaMT?.estado || ''}
                onChange={(e) => cambiarEstado('curvaMT', e.target.value)}>
                {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad</label>
              <div className={styles.cantidadChip}>
                <button type="button" onClick={() => decrementarCantidad('curvaMT')} className={styles.cantidadChipBtn}>-</button>
                <span className={styles.cantidadChipValor}>{String(materiales.curvaMT?.cantidad || 0).padStart(2, '0')}</span>
                <button type="button" onClick={() => incrementarCantidad('curvaMT')} className={styles.cantidadChipBtn}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* FLEXI CONDUIT METALICO */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Flexi Conduit Metálico</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>Medida (pulgadas)</label>
            <input type="text" className={styles.input} placeholder="Medida"
              value={materiales.flexiConduit?.medida || ''}
              onChange={(e) => handleMaterialChange('flexiConduit', 'medida', e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estado</label>
              <select className={styles.select} value={materiales.flexiConduit?.estado || ''}
                onChange={(e) => cambiarEstado('flexiConduit', e.target.value)}>
                {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad</label>
              <div className={styles.cantidadChip}>
                <button type="button" onClick={() => decrementarCantidad('flexiConduit')} className={styles.cantidadChipBtn}>-</button>
                <span className={styles.cantidadChipValor}>{String(materiales.flexiConduit?.cantidad || 0).padStart(2, '0')}</span>
                <button type="button" onClick={() => incrementarCantidad('flexiConduit')} className={styles.cantidadChipBtn}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* TERMINAL FLEXI */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Terminal Flexi</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>Medida (pulgadas)</label>
            <input type="text" className={styles.input} placeholder="Medida"
              value={materiales.terminalFlexi?.medida || ''}
              onChange={(e) => handleMaterialChange('terminalFlexi', 'medida', e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estado</label>
              <select className={styles.select} value={materiales.terminalFlexi?.estado || ''}
                onChange={(e) => cambiarEstado('terminalFlexi', e.target.value)}>
                {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad</label>
              <div className={styles.cantidadChip}>
                <button type="button" onClick={() => decrementarCantidad('terminalFlexi')} className={styles.cantidadChipBtn}>-</button>
                <span className={styles.cantidadChipValor}>{String(materiales.terminalFlexi?.cantidad || 0).padStart(2, '0')}</span>
                <button type="button" onClick={() => incrementarCantidad('terminalFlexi')} className={styles.cantidadChipBtn}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* CAJAS HERMÉTICAS */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Cajas Herméticas</h2>
          
          <div className={styles.grid3Cols}>
            {/* CAJA SOBREPONER */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Caja Sobreponer</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Fásico</label>
                  <input type="text" className={styles.input} placeholder="1, 2, 3"
                    value={materiales.cajaSobreponer?.fasico || ''}
                    onChange={(e) => handleMaterialChange('cajaSobreponer', 'fasico', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo</label>
                  <input type="text" className={styles.input} placeholder="Tipo de caja"
                    value={materiales.cajaSobreponer?.tipo || ''}
                    onChange={(e) => handleMaterialChange('cajaSobreponer', 'tipo', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.cajaSobreponer?.estado || ''}
                    onChange={(e) => cambiarEstado('cajaSobreponer', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('cajaSobreponer')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.cajaSobreponer?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('cajaSobreponer')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CAJA INCRUSTAR */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Caja Incrustar</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Fásico</label>
                  <input type="text" className={styles.input} placeholder="1, 2, 3"
                    value={materiales.cajaIncrustar?.fasico || ''}
                    onChange={(e) => handleMaterialChange('cajaIncrustar', 'fasico', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo</label>
                  <input type="text" className={styles.input} placeholder="Tipo de caja"
                    value={materiales.cajaIncrustar?.tipo || ''}
                    onChange={(e) => handleMaterialChange('cajaIncrustar', 'tipo', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.cajaIncrustar?.estado || ''}
                    onChange={(e) => cambiarEstado('cajaIncrustar', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('cajaIncrustar')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.cajaIncrustar?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('cajaIncrustar')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CAJA GABINETE */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Caja Gabinete</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.cajaGabinete?.estado || ''}
                    onChange={(e) => cambiarEstado('cajaGabinete', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('cajaGabinete')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.cajaGabinete?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('cajaGabinete')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MATERIAL RETIRADO */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Material Retirado</h2>
          
          <div className={styles.card}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción del material retirado</label>
              <textarea 
                className={styles.textarea} 
                rows={4} 
                placeholder="Describa el material que se retiró durante la instalación..."
                value={materiales.materialRetirado?.descripcion || ''}
                onChange={(e) => handleMaterialChange('materialRetirado', 'descripcion', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sellos */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Sellos</h2>
          
          <div className={styles.grid2Cols}>
            {/* Rotoseal de Color */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Rotoseal de Color</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Color del sello</label>
                <input type="text" className={styles.input} placeholder="Color"
                  value={materiales.rotoseal?.color || ''}
                  onChange={(e) => handleMaterialChange('rotoseal', 'color', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.rotoseal?.estado || ''}
                    onChange={(e) => cambiarEstado('rotoseal', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('rotoseal')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.rotoseal?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('rotoseal')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Estampilla */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Estampilla</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Estado</label>
                  <select className={styles.select} value={materiales.estampilla?.estado || ''}
                    onChange={(e) => cambiarEstado('estampilla', e.target.value)}>
                    {opcionesEstado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cantidad</label>
                  <div className={styles.cantidadChip}>
                    <button type="button" onClick={() => decrementarCantidad('estampilla')} className={styles.cantidadChipBtn}>-</button>
                    <span className={styles.cantidadChipValor}>{String(materiales.estampilla?.cantidad || 0).padStart(2, '0')}</span>
                    <button type="button" onClick={() => incrementarCantidad('estampilla')} className={styles.cantidadChipBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MEDIDOR INSTALADO */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Medidor Instalado</h2>
          <div className={styles.card}>
            <div className={styles.grid3Cols}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Número del Medidor</label>
                <input type="text" name="medidor_numero" value={data.medidor_numero || ''} onChange={handleChange} className={styles.input} placeholder="Número" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Marca</label>
                <input type="text" name="medidor_marca" value={data.medidor_marca || ''} onChange={handleChange} className={styles.input} placeholder="Marca" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fases</label>
                <input type="text" name="medidor_fases" value={data.medidor_fases || ''} onChange={handleChange} className={styles.input} placeholder="Fases" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dígitos</label>
                <input type="text" name="medidor_digitos" value={data.medidor_digitos || ''} onChange={handleChange} className={styles.input} placeholder="Dígitos" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Lectura</label>
                <input type="text" name="medidor_lectura" value={data.medidor_lectura || ''} onChange={handleChange} className={styles.input} placeholder="Lectura" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Voltios</label>
                <input type="text" name="medidor_voltios" value={data.medidor_voltios || ''} onChange={handleChange} className={styles.input} placeholder="Voltios" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Amperios</label>
                <input type="text" name="medidor_amperios" value={data.medidor_amperios || ''} onChange={handleChange} className={styles.input} placeholder="Amperios" />
              </div>
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>Disposición de los Sellos</h3>
            <div className={styles.card}>
              <table className={styles.sellosTable}>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Número 1</th>
                    <th>Número 2</th>
                    <th>Número 3</th>
                    <th>Número 4</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.boldCell}>TP</td>
                    <td><input type="text" name="sello_tp_1" value={data.sello_tp_1 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_tp_2" value={data.sello_tp_2 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_tp_3" value={data.sello_tp_3 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_tp_4" value={data.sello_tp_4 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_color_1" value={data.sello_color_1 || ''} onChange={handleChange} className={styles.tableInput} placeholder="Color" /></td>
    
                  </tr>
                  <tr>
                    <td className={styles.boldCell}>TB</td>
                    <td><input type="text" name="sello_tb_1" value={data.sello_tb_1 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_tb_2" value={data.sello_tb_2 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_tb_3" value={data.sello_tb_3 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_tb_4" value={data.sello_tb_4 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_color_2" value={data.sello_color_2 || ''} onChange={handleChange} className={styles.tableInput} placeholder="Color" /></td>
                  </tr>
                  <tr>
                    <td className={styles.boldCell}>EST</td>
                    <td><input type="text" name="sello_est_1" value={data.sello_est_1 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_est_2" value={data.sello_est_2 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_est_3" value={data.sello_est_3 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_est_4" value={data.sello_est_4 || ''} onChange={handleChange} className={styles.tableInput} placeholder="N°" /></td>
                    <td><input type="text" name="sello_color_3" value={data.sello_color_3 || ''} onChange={handleChange} className={styles.tableInput} placeholder="Color" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>

        {/* MATERIAL RETIRADO */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Material Retirado</h2>
          
          <div className={styles.card}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción del Material Retirado</label>
              <input type="text" className={styles.input} placeholder="Describa el material retirado"
                value={materiales.materialRetirado?.descripcion || ''}
                onChange={(e) => handleMaterialChange('materialRetirado', 'descripcion', e.target.value)} />
            </div>
          </div>
        </div>

        {/* LIQUIDACIÓN DE MATERIALES */}
        {(Object.keys(materiales).some(key => materiales[key]?.cantidad > 0 && key !== 'materialRetirado')) && (
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>💰 Liquidación de Materiales</h2>
            
            <div className={styles.tableContainer}>
              <table className={styles.liquidacionTable}>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th width="100">Cantidad</th>
                    <th width="120">Valor Unitario</th>
                    <th width="120">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Medidor Electromecánico */}
                  {materiales.medidorElectroMecanico?.cantidad > 0 && (
                    <tr>
                      <td>Medidor Electromecánico</td>
                      <td className={styles.center}>{materiales.medidorElectroMecanico.cantidad}</td>
                      <td className={styles.right}>${precios.medidorElectroMecanico.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('medidorElectroMecanico').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Medidor Electrónico Registrador */}
                  {materiales.medidorElectronicoRegis?.cantidad > 0 && (
                    <tr>
                      <td>Medidor Electrónico (Registrador Ciclométrico)</td>
                      <td className={styles.center}>{materiales.medidorElectronicoRegis.cantidad}</td>
                      <td className={styles.right}>${precios.medidorElectronicoRegis.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('medidorElectronicoRegis').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Medidor Electrónico Display */}
                  {materiales.medidorElectronicoDisplay?.cantidad > 0 && (
                    <tr>
                      <td>Medidor Electrónico con Display</td>
                      <td className={styles.center}>{materiales.medidorElectronicoDisplay.cantidad}</td>
                      <td className={styles.right}>${precios.medidorElectronicoDisplay.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('medidorElectronicoDisplay').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Cinta Bandit */}
                  {materiales.cintaBandit?.cantidad > 0 && (
                    <tr>
                      <td>Cinta Bandit (${materiales.cintaBandit?.medida || '-'}")</td>
                      <td className={styles.center}>{materiales.cintaBandit.cantidad}</td>
                      <td className={styles.right}>${precios.cintaBandit.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('cintaBandit').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Grapa Hebilla */}
                  {materiales.grapaHebilla?.cantidad > 0 && (
                    <tr>
                      <td>Grapa Hebilla (${materiales.grapaHebilla?.medida || '-'}")</td>
                      <td className={styles.center}>{materiales.grapaHebilla.cantidad}</td>
                      <td className={styles.right}>${precios.grapaHebilla.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('grapaHebilla').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Capacete */}
                  {materiales.capacete?.cantidad > 0 && (
                    <tr>
                      <td>Capacete (${materiales.capacete?.medida || '-'}")</td>
                      <td className={styles.center}>{materiales.capacete.cantidad}</td>
                      <td className={styles.right}>${precios.capacete.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('capacete').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Conector Curvo */}
                  {materiales.conectorCurvo?.cantidad > 0 && (
                    <tr>
                      <td>Conector Curvo (${materiales.conectorCurvo?.medida || '-'}")</td>
                      <td className={styles.center}>{materiales.conectorCurvo.cantidad}</td>
                      <td className={styles.right}>${precios.conectorCurvo.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('conectorCurvo').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Conduletas */}
                  {materiales.conduletas?.cantidad > 0 && (
                    <tr>
                      <td>Conduletas (${materiales.conduletas?.medida || '-'}")</td>
                      <td className={styles.center}>{materiales.conduletas.cantidad}</td>
                      <td className={styles.right}>${precios.conduletas.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('conduletas').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Tubo Galvanizado */}
                  {materiales.tuboGalvanizado?.cantidad > 0 && (
                    <tr>
                      <td>Tubo Galvanizado (${materiales.tuboGalvanizado?.medida || '-'}" x 3m)</td>
                      <td className={styles.center}>{materiales.tuboGalvanizado.cantidad}</td>
                      <td className={styles.right}>${precios.tuboGalvanizado.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('tuboGalvanizado').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Breakers */}
                  {materiales.breakers?.cantidad > 0 && (
                    <tr>
                      <td>Breakers (${materiales.breakers?.amperios || '-'}Amp.)</td>
                      <td className={styles.center}>{materiales.breakers.cantidad}</td>
                      <td className={styles.right}>${precios.breakers.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('breakers').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Rotoseal */}
                  {materiales.rotoseal?.cantidad > 0 && (
                    <tr>
                      <td>Rotoseal de Color (${materiales.rotoseal?.color || '-'})</td>
                      <td className={styles.center}>{materiales.rotoseal.cantidad}</td>
                      <td className={styles.right}>${precios.rotoseal.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('rotoseal').toLocaleString()}</td>
                    </tr>
                  )}
                  
                  {/* Estampilla */}
                  {materiales.estampilla?.cantidad > 0 && (
                    <tr>
                      <td>Estampilla</td>
                      <td className={styles.center}>{materiales.estampilla.cantidad}</td>
                      <td className={styles.right}>${precios.estampilla.toLocaleString()}</td>
                      <td className={styles.right}>${calcularSubtotal('estampilla').toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className={styles.right}><strong>TOTAL LIQUIDADO</strong></td>
                    <td className={`${styles.right} ${styles.totalAmount}`}>
                      <strong>${calcularTotalGeneral().toLocaleString()}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className={styles.infoBox}>
              <p><strong>Nota:</strong> Los precios mostrados son referenciales. El valor final puede variar según cotización vigente.</p>
            </div>
          </div>
        )}

        {/* ATENCIÓN Y AUTORIZACIÓN */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Atención y Autorización</h2>
          <div className={styles.formGroup}>
                <label className={styles.label}>Autoriza el cobro</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="tipoPago" value="contado" checked={data.tipoPago === 'contado'} onChange={handleChange} />
                    <span>Contado</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="tipoPago" value="financiado" checked={data.tipoPago === 'financiado'} onChange={handleChange} />
                    <span>Financiado</span>
                  </label>
                </div>
              </div>
          <div className={styles.generatedText}>
            <p>
              <span className={styles.boldText}>ATENDIÓ LA VISITA EL (LOS) REPRESENTANTE (S) LEGAL (S) DEL INMUEBLE, EL (LOS) SEÑOR (S):</span>{' '}
              <span className={styles.resaltado}>{data.usuarioVisita || '________________________'}</span>
              <br />
              QUIEN AUTORIZA EL COBRO DE LOS ANTERIORES MATERIALES, DE CONTADO ({' '}
              <span className={styles.resaltado}>{data.tipoPago === 'contado' ? 'X' : ' '}</span>{' '}) , FINANCIADO ({' '}
              <span className={styles.resaltado}>{data.tipoPago === 'financiado' ? 'X' : ' '}</span>{' '}) .
            </p>
          </div>
        </div>

        {/* OBSERVACIONES */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>Observaciones</h2>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Tipo de Informe</label>
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
              <label className={styles.label}>Especifique el tipo de informe:</label>
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

        {/* BOTONES */}
        <div className={styles.formNavigation}>
          <button type="button" onClick={prevStep} className={styles.backButton}>
            ← Anterior
          </button>
          <button type="submit" className={styles.nextButton}>
            Siguiente →
          </button>
        </div>

      </form>
    </div>
  );
}

export default ActaMateriales;