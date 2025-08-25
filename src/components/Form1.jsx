import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Form1.module.css';

function Form1({ data, handleChange, nextStep }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [userData, setUserData] = useState({ name: '', cc: '' });
  
  // Efecto para consultar la base de datos cuando cambia el código o ASIC
  useEffect(() => {
    const consultarCliente = async () => {
      // Determinar qué valor buscar (código tiene prioridad sobre asic)
      const valorBusqueda = data.codigo || data.asic;
      
      // Solo consultar si hay un valor de búsqueda pero no dirección
      if (valorBusqueda && !(data.direccion && !data.ciudad)) {
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
  }, [data.codigo, data.asic, data.direccion, data.ciudad, handleChange]);

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

    // Validar representante
    if (!data.otroRepresentante) {
      newErrors.otroRepresentante = 'Representante es obligatorio';
    }

    // Validar empresa
    if (!data.empresa1) {
      newErrors.empresa1 = 'Empresa es obligatoria';
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
      <h2 className={styles.mainTitle}>Acta de revisión <span className={styles.redText}>N°52976</span></h2>
      
      {/* Mostrar información del usuario */}
      {userData.name && (
        <div className={styles.userInfo}>
          <p><strong>Usuario:</strong> {userData.name} - CC: {userData.cc}</p>
        </div>
      )}
      
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
            <strong>Dirección encontrada:</strong> {data.direccion}
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
              Documento otro representante
            </label>
            <input
              type="text"
              name="ccOtroRepresentante"
              placeholder="Documento del representante"
              value={data.ccOtroRepresentante || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Frontera Comercial</label>
            <input
              type="text"
              name="fronteraComercial"
              placeholder="Frontera comercial"
              value={data.fronteraComercial || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
        
        {errors.otroRepresentante && (
          <div className={styles.errorMessage}>
            {errors.otroRepresentante}
          </div>
        )}
        
        {/* Cuarta fila - Empresas y derecho */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Empresa 1 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="empresa1"
              placeholder="Nombre de la empresa"
              value={data.empresa1 || ''}
              onChange={handleChange}
              className={`${styles.input} ${errors.empresa1 ? styles.errorInput : ''}`}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Empresa 2
            </label>
            <input
              type="text"
              name="empresa2"
              placeholder="Nombre de la empresa"
              value={data.empresa2 || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>El suscriptor hace uso de su derecho</label>
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
        
        {errors.empresa1 && (
          <div className={styles.errorMessage}>
            {errors.empresa1}
          </div>
        )}
        
        {/* Texto generado */}
        <div className={styles.generatedTextSection}>
          <h3 className={styles.sectionTitle}>Texto generado:</h3>
          <div className={styles.generatedText}>
            <p>
              A los {new Date().getDate()} días del mes de {new Date().toLocaleString('es-ES', { month: 'long' })} del {new Date().getFullYear()}, a las {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} se hacen presentes en el inmueble de la dirección {data.direccion || '______'} los representantes de EMSA ESP {userData.name || '______'} con C.C: {userData.cc || '______'} y {data.otroRepresentante || '______'} con C.C: {data.ccOtroRepresentante || '______'} en representación de las empresas {data.empresa1 || '______'} y {data.empresa2 || '______'} respectivamente, con el fin de realizar una revisión al equipo de sistema de medida del inmueble. Se informa al suscriptor y/o usuario su derecho de solicitar la asesoría o participación de un técnico particular conforme a lo establecido en las Condiciones Uniformes del Contrato de Servicio Público suscrito con el Representante de la frontera. Cumplido este tiempo se procede a efectuar la revisión. El suscriptor hace uso de su derecho SÍ({data.derecho === 'SI' ? 'X' : ' '}) NO ({data.derecho === 'NO' ? 'X' : ' '}).
            </p>
            <p>
              En las mediciones correspondientes a fronteras comerciales representadas por {data.fronteraComercial || '"    "'}, se procede a conformidad con las Resoluciones emitidas por la CREG, en particular lo establecido en el reglamento de comercialización y código de medida.
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