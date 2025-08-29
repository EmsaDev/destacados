import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Form1.module.css';

function Form1({ data, handleChange, nextStep }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [userData, setUserData] = useState({ name: '', cc: '' });
  const [reviewNumber, setReviewNumber] = useState('1000'); // Estado para el número de acta
  
// Efecto para obtener el número de acta al cargar el componente
  useEffect(() => {
    const getNextReviewNumber = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('⚠️ No hay token, usando número por defecto');
          setReviewNumber('1000');
          return;
        }
        
        console.log('🔄 Solicitando próximo número de acta...');
        const response = await axios.get('http://172.18.27.53:5000/api/next-review-number', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000 // 10 segundos de timeout
        });
        
        console.log('✅ Respuesta del servidor:', response.data);
        
        if (response.data.success) {
          setReviewNumber(response.data.next_review_number.toString());
          handleChange({ target: { name: 'numero_acta', value: response.data.next_review_number } });
          console.log('🎉 Número de acta asignado:', response.data.next_review_number);
        } else {
          console.warn('⚠️ Servidor respondió con success: false');
          setReviewNumber('1000');
        }
      } catch (error) {
        console.error('❌ Error obteniendo número de acta:', error);
        setReviewNumber('1000'); // Valor por defecto
      }
    };
    
    getNextReviewNumber();
  }, []);

  // Efecto para consultar la base de datos cuando cambia el código o ASIC
  useEffect(() => {
    const consultarCliente = async () => {
      // Determinar qué valor buscar (código tiene prioridad sobre asic)
      const valorBusqueda = data.codigo || data.asic;
      
      // Solo consultar si hay un valor de búsqueda pero no dirección
      if (valorBusqueda && !(data.direccion && !data.ciudad && !data.nombre)) {
        setIsLoading(true);
        try {
          console.log('Enviando consulta con:', { codigo: data.codigo, asic: data.asic });
          
          const response = await axios.post('http://172.18.27.53:5000/api/consultar-cliente', {
            codigo: data.codigo,
            asic: data.asic
          });
          
          console.log('Respuesta del servidor:', response.data);
          
          if (response.data.success) {
            // Actualizar dirección si viene en la respuesta y no tenemos
            if (response.data.direccion && !data.direccion) {
              handleChange({ target: { name: 'direccion', value: response.data.direccion } });
            }
            
            // Actualizar ciudad si viene en la respuesta y no tenemos
            if (response.data.ciudad && !data.ciudad) {
              handleChange({ target: { name: 'ciudad', value: response.data.ciudad } });
            }
            
            // Actualizar nombre si viene en la respuesta y no tenemos
            if (response.data.nombre && !data.nombre) {
              handleChange({ target: { name: 'nombre', value: response.data.nombre } });
            }
        }

          }catch (error) {
          console.error('Error al consultar cliente:', error);
          if (error.response) {
            console.error('Respuesta de error:', error.response.data);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(consultarCliente, 800);
    return () => clearTimeout(timeoutId);
  }, [data.codigo, data.asic, data.direccion, data.ciudad, data.nombre, handleChange]);

    // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        const cc = localStorage.getItem('userCC');
        
        if (name && cc) {
          setUserData({ name, cc });
        } else if (token) {
          // Si no están en localStorage, hacer request al servidor
          const response = await axios.get('http://172.18.27.53:5000/api/user-data', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            setUserData({
              name: response.data.user.name,
              cc: response.data.user.cc
            });
            // Guardar en localStorage para próximas veces
            localStorage.setItem('userName', response.data.user.name);
            localStorage.setItem('userCC', response.data.user.cc);
            console.log('Datos del usuario obtenidos:', response.data.user);
          }
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    };
    
    getUserData();
  }, []);

  // Validar campos
  const validateForm = () => {
    const newErrors = {};
    
    // Validar ciudad (obligatoria)
    if (!data.ciudad) {
      newErrors.ciudad = 'Ciudad es obligatoria';
    }
    
    // Validar que al menos uno de los códigos esté completo
    if (!data.codigo && !data.asic) {
      newErrors.suscriptorOrCodigo = 'Debe ingresar código suscriptor o código ASIC';
    }

    // Validar otro representante
    if (!data.otroRepresentante) {
      newErrors.otroRepresentante = 'Otro representante es obligatorio';
    }
    // Validar documento del otro representante
     if(!data.ccOtroRepresentante) {
      newErrors.ccOtroRepresentante = 'Documento del otro representante es obligatorio';
    }
    // Validar usuario quien atiende la visita
    if(!data.usuarioVisita) {
      newErrors.usuarioVisita = 'Usuario de visita es obligatorio';
    }
    // Validar documento quien atiende la visita
    if (!data.documentoVisitante) {
      newErrors.documentoVisitante = 'Documento quien atiende la visita es obligatorio';
    }

   // validar tipoUsuario
  if (!data.tipoUsuario) {
    newErrors.tipoUsuario = 'Tipo de usuario es obligatorio';
  }

  // validar derecho
  if (!data.derecho) {
    newErrors.derecho = 'Debe seleccionar SI o NO';
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  // Manejar cambio en código
  const handleCodigoChange = (e) => {
    setSearchField('codigo');
    handleChange(e);
  };

  // Manejar cambio en ASIC
  const handleAsicChange = (e) => {
    setSearchField('asic');
    handleChange(e);
  };

  

  return (
    <div className={styles.container}>
      <h2 className={styles.mainTitle}>
        Acta de revisión <span className={styles.redText}>N°{reviewNumber}</span>
      </h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Primera fila de inputs */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Ciudad <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="ciudad"
              placeholder="Ingrese la ciudad"
              value={data.ciudad || ''}
              onChange={handleChange}
              className={`${styles.input} ${errors.ciudad ? styles.errorInput : ''}`}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Resultado</label>
            <input
              type="text"
              name="resultado"
              placeholder="Ingrese el resultado"
              value={data.resultado || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Solicitud No</label>
            <input
              type="text"
              name="solicitudNo"
              placeholder="Número de solicitud"
              value={data.solicitudNo || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
        
        {errors.ciudad && (
          <div className={styles.errorMessage}>
            {errors.ciudad}
          </div>
        )}
        
        {/* Segunda fila de inputs */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Código <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="codigo"
                placeholder="Ingrese el código"
                value={data.codigo || ''}
                onChange={handleCodigoChange}
                className={`${styles.input} ${errors.suscriptorOrCodigo ? styles.errorInput : ''}`}
                disabled={isLoading && searchField !== 'codigo'}
              />
              {isLoading && searchField === 'codigo' && (
                <div className={styles.loadingSpinner}></div>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              ASIC <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="asic"
                placeholder="Ingrese ASIC"
                value={data.asic || ''}
                onChange={handleAsicChange}
                className={`${styles.input} ${errors.suscriptorOrCodigo ? styles.errorInput : ''}`}
                disabled={isLoading && searchField !== 'asic'}
              />
              {isLoading && searchField === 'asic' && (
                <div className={styles.loadingSpinner}></div>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Revisión No</label>
            <input
              type="text"
              name="revisionNo"
              placeholder="Número de revisión"
              value={data.revisionNo || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
        
        {errors.suscriptorOrCodigo && (
          <div className={styles.errorMessage}>
            {errors.suscriptorOrCodigo}
          </div>
        )}
        
        {/* Dirección obtenida de la base de datos */}
        {data.direccion && (
          <div className={styles.infoMessage}>
            <strong>Cliente:</strong> {data.nombre} <br/>
            <strong> Dirección:</strong> {data.direccion}
          </div>
        )}
        
        {/* Tercera fila - Representantes */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Otro representante <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="otroRepresentante"
              placeholder="Nombre del representante"
              value={data.otroRepresentante || ''}
              onChange={handleChange}
              className={`${styles.input} ${errors.otroRepresentante ? styles.errorInput : ''}`}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Documento otro representante <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="ccOtroRepresentante"
              placeholder="Documento del representante"
              value={data.ccOtroRepresentante || ''}
              onChange={handleChange}
              className={`${styles.input} ${errors.ccOtroRepresentante ? styles.errorInput : ''}`}
            />
          </div>
          
          <div className={styles.formGroup}>
          <label className={styles.label}>
            Usuario que recibe la visita <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="usuarioVisita"
            placeholder="Ingrese el nombre de la persona que recibe la visita"
            value={data.usuarioVisita || ''}
            onChange={handleChange}
            className={`${styles.input} ${errors.usuarioVisita ? styles.errorInput : ''}`}
          />
        </div>
        </div>
        
        {(errors.otroRepresentante || errors.ccOtroRepresentante || errors.usuarioVisita) && (
          <div className={styles.errorMessage}>
            {errors.otroRepresentante && <p>{errors.otroRepresentante}</p>}
            {errors.ccOtroRepresentante && <p>{errors.ccOtroRepresentante}</p>}
            {errors.usuarioVisita && <p>{errors.usuarioVisita}</p>}
          </div>
        )}
        
        {/* Cuarta fila - Empresas y derecho */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Documento de quien atiende la visita<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="documentoVisitante"
              placeholder="Documento de quien atiende la visita"
              value={data.documentoVisitante || ''}
              onChange={handleChange}
              className={`${styles.input} ${errors.documentoVisitante ? styles.errorInput : ''}`}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tipo de usuario <span className={styles.required}>*</span>
            </label>
            <div className={styles.selectContainer}>
              <select
                name="tipoUsuario"
                value={data.tipoUsuario || ''}
                onChange={handleChange}
                className={`${styles.select} ${errors.tipoUsuario ? styles.errorSelect : ''}`}
              >
                <option value="">👤 Seleccione una opción</option>
                <option value="usuario">👥 Usuario</option>
                <option value="cliente">💼 Cliente</option>
                <option value="tecnico">🔧 Técnico</option>
                <option value="administrador">⚙️ Administrador</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              El suscriptor hace uso de su derecho <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <button
                type="button"
                className={`${styles.radioButton} ${data.derecho === 'SI' ? styles.radioButtonSelected : ''}`}
                onClick={() => handleChange({ target: { name: 'derecho', value: 'SI' } })}
              >
                SI
              </button>
              <button
                type="button"
                className={`${styles.radioButton} ${data.derecho === 'NO' ? styles.radioButtonSelected : ''}`}
                onClick={() => handleChange({ target: { name: 'derecho', value: 'NO' } })}
              >
                NO
              </button>
            </div>
          </div>
        </div>

        {/* Errores */}
        {(errors.documentoVisitante || errors.tipoUsuario || errors.derecho) && (
          <div className={styles.errorMessage}>
            {errors.documentoVisitante && <p>{errors.documentoVisitante}</p>}
            {errors.tipoUsuario && <p>{errors.tipoUsuario}</p>}
            {errors.derecho && <p>{errors.derecho}</p>}
          </div>
        )}
        
        {/* Texto generado */}
        <div className={styles.generatedTextSection}>
          <h3 className={styles.sectionTitle}>Texto generado:</h3>
          <div className={styles.generatedText}>
            <p>
              A los <span className="resaltado">{new Date().getDate()}</span> días del mes de <span className="resaltado">{new Date().toLocaleString('es-ES', { month: 'long' })}</span> del <span className="resaltado">{new Date().getFullYear()}</span>, siendo las <span className="resaltado">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span> se hacen presentes 
              en el inmueble de la dirección <span className="resaltado">{data.direccion || '______'}</span> los representantes de EMSA ESP <span className="resaltado">{userData.name || '______'}</span> con C.C: <span className="resaltado">{userData.cc || '______'}</span> y <span className="resaltado">{data.otroRepresentante || '______'}</span> con C.C: <span className="resaltado">{data.ccOtroRepresentante || '______'}</span> en presencia 
              del señor(a) <span className="resaltado">{data.usuarioVisita || '______'}</span> con <span className="resaltado">{data.documentoVisitante || '______'}</span> calidad de <span className="resaltado">{data.tipoUsuario || '______'}</span> con el fin de efectuar una revisión de los equipos de medida e instalaciones del inmueble con el código indicado.
              Habiéndose identificado los empleados y/o contratistas informan al usuario que de acuerdo al Contrato de Servicios Públicos con Condiciones Uniformes vigente su derecho a solicitar asesoría y/o participación de un técnico particular,
              o de cualquier persona para que sirva de testigo en el proceso de revisión. Sin embargo, si transcurre un plazo máximo de 15 minutos sin hacerse presente se hará la revisión sin su presencia. El cliente/usuario hace uso de su derecho:
              SÍ (<span className="resaltado">{data.derecho === 'SI' ? 'X' : ' '}</span>) NO (<span className="resaltado">{data.derecho === 'NO' ? 'X' : ' '}</span>). Transcurrido ese tiempo, se procede a hacer la revisión.
            </p>

          </div>
        </div>
        
        {/* Botón de enviar */}
        <div className={styles.buttonContainer}>
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Buscando dirección...' : 'Siguiente'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form1;