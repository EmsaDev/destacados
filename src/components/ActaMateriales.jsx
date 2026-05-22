import { useState, useEffect } from 'react';
import styles from './ActaMateriales.module.css';

function ActaMateriales({ data, handleChange, nextStep, prevStep }) {
  
  // Inicializar materiales desde data si existe, si no, usar el objeto por defecto
  const [materiales, setMateriales] = useState(() => {
    if (data.materiales && Object.keys(data.materiales).length > 0) {
      return data.materiales;
    }
    return {
      // Medidor - Datos generales (fasico, F, H)
      medidor: { fasico: '', fases: '', hilos: '' },
      // Medidores
      medidorElectroMecanico: { estado: '', cantidad: 0, especificaciones: { fasico: '', fases: '', hilos: '', tipo: '', amperios: '', voltios: '', clase: '' } },
      medidorElectronicoRegis: { estado: '', cantidad: 0, especificaciones: { tipo: '', amperios: '', voltios: '', clase: '' } },
      medidorElectronicoDisplay: { estado: '', cantidad: 0, especificaciones: { tipo: '', amperios: '', voltios: '', clase: '' } },
      // Protecciones y Herrajes
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
      breakers: { estado: '', cantidad: 0, amperios: '' },
      conectorVarilla: { estado: '', cantidad: 0 },
      alambreCobre: { estado: '', cantidad: 0, calibre: '' },
      varillaPuestaTierra: { estado: '', cantidad: 0, metros: '' },
      terminalMT: { estado: '', cantidad: 0, medida: '' },
      curvaMT: { estado: '', cantidad: 0, medida: '' },
      flexiConduit: { estado: '', cantidad: 0, medida: '' },
      terminalFlexi: { estado: '', cantidad: 0, medida: '' },
      // Sellos
      rotoseal: { estado: '', cantidad: 0, color: '' },
      estampilla: { estado: '', cantidad: 0 },
      // Material Retirado
      materialRetirado: { descripcion: '', estado: '', cantidad: 0 }
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
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select className={styles.select} value={materiales.materialRetirado?.estado || ''}
                  onChange={(e) => handleMaterialChange('materialRetirado', 'estado', e.target.value)}>
                  {opcionesEstadoRetirado.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cantidad</label>
                <div className={styles.cantidadChip}>
                  <button type="button" onClick={() => {
                    setMateriales(prev => ({
                      ...prev,
                      materialRetirado: { ...prev.materialRetirado, cantidad: Math.max(0, (prev.materialRetirado?.cantidad || 0) - 1) }
                    }));
                  }} className={styles.cantidadChipBtn}>-</button>
                  <span className={styles.cantidadChipValor}>{String(materiales.materialRetirado?.cantidad || 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => {
                    setMateriales(prev => ({
                      ...prev,
                      materialRetirado: { ...prev.materialRetirado, cantidad: (prev.materialRetirado?.cantidad || 0) + 1 }
                    }));
                  }} className={styles.cantidadChipBtn}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

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