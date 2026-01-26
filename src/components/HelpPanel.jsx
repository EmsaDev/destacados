import { useState, useEffect } from 'react'
import styles from './HelpPanel.module.css'
import { 
  FiHelpCircle, 
  FiX, 
  FiChevronRight, 
  FiInfo, 
  FiCheckCircle, 
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiClock,
  FiFileText,
  FiLayers,
  FiEdit3,
  FiClipboard
} from 'react-icons/fi'

function HelpPanel({ onClose, currentStep = 1 }) {
  const [activeTab, setActiveTab] = useState('pasoActual')
  
  // Contenido específico por paso del formulario
  const stepContents = {
    1: {
      title: "Formulario 1 - Datos Básicos del Acta",
      description: "Complete la información inicial del acta de revisión técnica",
      steps: [
        {
          title: "📍 Ciudad y Número de Acta",
          description: "Seleccione la ciudad donde se realiza la revisión. El sistema asignará automáticamente un número de acta único."
        },
        {
          title: "🔍 Búsqueda de Cliente",
          description: "Ingrese el CÓDIGO o ASIC del suscriptor. El sistema consultará automáticamente la base de datos para completar dirección, ciudad y nombre."
        },
        {
          title: "👥 Representantes EMSA",
          description: "Complete los datos del otro representante de EMSA que acompaña la visita (nombre y documento)."
        },
        {
          title: "👤 Usuario que Atiende",
          description: "Registre los datos de la persona que recibe la visita en el inmueble (nombre, documento y tipo de usuario)."
        },
        {
          title: "⚖️ Derecho del Suscriptor",
          description: "Seleccione SI o NO según el usuario haga uso de su derecho a tener testigo técnico en la revisión."
        },
        {
          title: "🏢 Dependencia y Contratista",
          description: "Seleccione la dependencia responsable (CGM o Control de Energía) y nombre del contratista."
        },
        {
          title: "💰 Items de Pago (Opcional)",
          description: "Si aplica, ingrese los conceptos por los cuales se generará cobro."
        },
        {
          title: "📄 Texto Generado",
          description: "Revise el texto generado automáticamente con todos los datos ingresados. Se incluirá en el acta final."
        }
      ],
      tips: [
        "💡 Ingrese primero el CÓDIGO o ASIC para autocompletar otros campos",
        "💡 El sistema valida que al menos un código esté completo",
        "💡 Todos los campos marcados con * son obligatorios",
        "💡 Verifique que los documentos tengan el formato correcto"
      ]
    },
    2: {
      title: "Formulario 2 - Información Técnica de Instalación",
      description: "Complete los datos técnicos de la instalación eléctrica y equipos de medida",
      steps: [
        {
          title: "📊 Datos Generales",
          description: "Complete información básica como carga en Kw, ciclo, factores y coordenadas GPS del sitio."
        },
        {
          title: "👤 Datos del Suscriptor",
          description: "Seleccione el tipo de uso (Residencial, Comercial, Industrial, Oficial), ubicación y nivel de tensión."
        },
        {
          title: "⚡ Tipo de Instalación",
          description: "Especifique tipo de medidor (electrónico/electromecánico), ubicación (interior/exterior) y características de la acometida."
        },
        {
          title: "📶 Modem y Comunicación",
          description: "Configure los datos del modem (marca, serie, IP) y tipo de cable utilizado para telemedida."
        },
        {
          title: "🔍 Medidores Encontrados",
          description: "Registre los medidores encontrados en sitio (activa1, activa2, reactiva1, reactiva2) con sus características técnicas."
        },
        {
          title: "🔧 Medidores Instalados",
          description: "Si se realizó reemplazo, registre los nuevos medidores instalados con sus especificaciones."
        },
        {
          title: "🏭 Transformador de Potencia",
          description: "Complete los datos del transformador si aplica (marca, kVA, año, propietario)."
        }
      ],
      tips: [
        "💡 Use las opciones de botón para seleccionar rápidamente",
        "💡 Las marcas de medidores se cargan automáticamente desde la base de datos",
        "💡 Al seleccionar una marca, se cargan automáticamente los tipos disponibles",
        "💡 Complete coordenadas GPS con precisión para georreferenciación"
      ]
    },
    3: {
      title: "Formulario 3 - Detalles Técnicos y Pruebas",
      description: "Registre resultados de mediciones, pruebas técnicas y evidencias",
      steps: [
        {
          title: "📋 Medición de Sellos",
          description: "Registre los sellos encontrados e instalados en tapas principales y borneras para activa y reactiva."
        },
        {
          title: "🔌 TC's, TP's y Celda",
          description: "Documente transformadores de corriente, potencial y celdas de medida encontrados/instalados."
        },
        {
          title: "🧮 Cálculo de Error - Activa",
          description: "Complete el cuadro de cálculo del error para el medidor de energía activa (tensiones, corrientes, potencia)."
        },
        {
          title: "⚡ Cálculo de Error - Reactiva",
          description: "Complete el cuadro de cálculo del error para el medidor de energía reactiva."
        },
        {
          title: "✅ Pruebas de Funcionamiento",
          description: "Realice pruebas de conexiones, continuidad, puentes e integración para ambos medidores."
        },
        {
          title: "🔧 Transformadores",
          description: "Documente características técnicas de TC's y TP's encontrados (marca, serie, relación, clase)."
        },
        {
          title: "📸 Evidencias e Informe",
          description: "Registre irregularidades, tipo de evidencia (fotos/video) y genere el informe final."
        }
      ],
      tips: [
        "💡 Verifique que todos los sellos estén correctamente registrados",
        "💡 Los cálculos de error son críticos para la validez del acta",
        "💡 Realice todas las pruebas de funcionamiento indicadas",
        "💡 Tome fotos/video como evidencia de las condiciones encontradas",
        "💡 Documente cualquier irregularidad encontrada"
      ]
    },
    4: {
      title: "Acta de Diagramas y Pruebas Técnicas",
      description: "Seleccione diagramas y complete pruebas técnicas avanzadas",
      steps: [
        {
          title: "📡 Configuración de Línea",
          description: "Indique si es línea dedicada y seleccione el tipo de frontera según normas técnicas."
        },
        {
          title: "📊 Selección de Diagramas",
          description: "Seleccione un diagrama unifilar, fasorial y de conexiones que represente la instalación."
        },
        {
          title: "🔬 Prueba de TP's",
          description: "Complete las mediciones de voltaje primario/secundario para transformadores de potencial. El sistema calculará automáticamente el % de error promedio."
        },
        {
          title: "⚡ Prueba de TC's",
          description: "Complete las mediciones de corriente primario/secundario para transformadores de corriente. Se calculará el error promedio automáticamente."
        },
        {
          title: "📐 Factor SIEC",
          description: "Registre el factor SIEC, factor encontrado y calcule el error. Este dato es crucial para la corrección de mediciones."
        },
        {
          title: "👁️ Observaciones de Equipos",
          description: "Evalúe el estado de cada componente (Bueno/Regular/Malo) para documentar condiciones encontradas."
        },
        {
          title: "🔧 Adecuaciones Necesarias",
          description: "Marque las adecuaciones requeridas (cambios de medidor, caja, tierra, protecciones, etc.)."
        },
        {
          title: "📋 Informe Final",
          description: "Seleccione el tipo de informe (Instalación Correcta/Incorrecta, etc.) y agregue observaciones si aplica."
        }
      ],
      tips: [
        "💡 Los diagramas seleccionados se guardarán en el acta final",
        "💡 Los cálculos de error se actualizan automáticamente",
        "💡 Documente todas las observaciones para justificar adecuaciones",
        "💡 Tome fotos de respaldo para las observaciones 'Malo'",
        "💡 Revise cuidadosamente todas las pruebas antes de continuar"
      ]
    },
    5: {
      title: "Firma Digital del Acta",
      description: "Capture las firmas digitales de todos los participantes",
      steps: [
        {
          title: "👤 Funcionario Responsable",
          description: "Firma del técnico de EMSA que realizó la revisión. Los datos se obtienen automáticamente del login."
        },
        {
          title: "🏠 Suscriptor o Usuario",
          description: "Firma del cliente o usuario presente en la revisión. Los datos vienen del formulario 1."
        },
        {
          title: "👷 Supervisor/Interventor",
          description: "Firma del supervisor o interventor que acompaña la visita. Los datos vienen del formulario 1."
        }
      ],
      tips: [
        "💡 Use el mouse o un lápiz óptico para una firma más precisa",
        "💡 Puede limpiar y volver a firmar si no está satisfecho",
        "💡 Cada firma se guarda automáticamente en el sistema",
        "💡 Verifique que los datos de cada firmante sean correctos",
        "💡 Las firmas son legalmente vinculantes para el acta"
      ]
    },
    6: {
      title: "Resumen Final del Acta",
      description: "Revise toda la información y genere el acta final en PDF",
      steps: [
        {
          title: "📋 Información Principal",
          description: "Revise datos básicos del acta (número, ciudad, resultado, códigos)."
        },
        {
          title: "🏢 Datos del Cliente",
          description: "Verifique información del suscriptor y representantes."
        },
        {
          title: "📊 Datos Técnicos",
          description: "Confirme todos los datos técnicos de instalación y mediciones."
        },
        {
          title: "🔌 Equipos y Mediciones",
          description: "Revise especificaciones de medidores y transformadores."
        },
        {
          title: "📏 Pruebas y Cálculos",
          description: "Valide resultados de pruebas técnicas y cálculos de error."
        },
        {
          title: "📊 Diagramas Seleccionados",
          description: "Verifique los diagramas unifilar, fasorial y de conexiones."
        },
        {
          title: "🔧 Configuraciones y Pruebas",
          description: "Revise configuración de línea, pruebas TP's/TC's y factor SIEC."
        },
        {
          title: "👀 Observaciones y Adecuaciones",
          description: "Confirme observaciones de equipos y adecuaciones necesarias."
        },
        {
          title: "✍️ Firmas Digitales",
          description: "Verifique que las tres firmas estén presentes y correctas."
        },
        {
          title: "📄 Generación de PDF",
          description: "Genere el documento final en formato PDF de 2 páginas."
        }
      ],
      tips: [
        "💡 Esta es la última oportunidad para corregir errores",
        "💡 El PDF generado incluye TODOS los datos capturados",
        "💡 Verifique especialmente los cálculos técnicos",
        "💡 Confirme que todas las firmas estén presentes",
        "💡 Puede imprimir, descargar o guardar en el sistema",
        "💡 El acta quedará registrada oficialmente en EMSA"
      ]
    }
  }

  // Determinar el contenido basado en el paso actual
  const currentContent = stepContents[currentStep] || stepContents[1]
  
  // Nombres de los pasos para el menú
  const stepNames = {
    1: { icon: <FiFileText />, name: "Datos Básicos" },
    2: { icon: <FiFileText />, name: "Información Técnica" },
    3: { icon: <FiFileText />, name: "Detalles Finales" },
    4: { icon: <FiLayers />, name: "Acta de Diagramas" },
    5: { icon: <FiEdit3 />, name: "Firma Digital" },
    6: { icon: <FiClipboard />, name: "Resumen Final" }
  }

  // Cambiar automáticamente a 'pasoActual' cuando cambie el currentStep
  useEffect(() => {
    setActiveTab('pasoActual')
  }, [currentStep])

  return (
    <div className={styles.helpPanel}>
      <div className={styles.helpContent}>
        <div className={styles.helpHeader}>
          <div className={styles.headerTitle}>
            <FiHelpCircle className={styles.helpIcon} />
            <div>
              <h2>Centro de Ayuda EMSA</h2>
              <p className={styles.stepIndicator}>
                {currentStep && stepNames[currentStep] ? (
                  <>
                    {stepNames[currentStep].icon} 
                    Paso {currentStep}: {stepNames[currentStep].name}
                  </>
                ) : "Ayuda general del sistema"}
              </p>
            </div>
          </div>
          <button className={styles.closeHelp} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'pasoActual' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pasoActual')}
          >
            <FiInfo /> Paso Actual
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'todosPasos' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('todosPasos')}
          >
            <FiClipboard /> Todos los Pasos
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'contacto' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('contacto')}
          >
            <FiHelpCircle /> Soporte
          </button>
        </div>
        
        <div className={styles.tabContent}>
          {activeTab === 'pasoActual' && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3>{currentContent.title}</h3>
                <p className={styles.stepDescription}>{currentContent.description}</p>
              </div>
              
              <div className={styles.stepsList}>
                {currentContent.steps.map((step, index) => (
                  <div key={index} className={styles.stepItem}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepInfo}>
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {currentContent.tips && currentContent.tips.length > 0 && (
                <div className={styles.tipsSection}>
                  <h4>
                    <FiAlertCircle className={styles.tipsIcon} />
                    Consejos Importantes
                  </h4>
                  <ul className={styles.tipsList}>
                    {currentContent.tips.map((tip, index) => (
                      <li key={index} className={styles.tipItem}>
                        <FiCheckCircle className={styles.tipIcon} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'todosPasos' && (
            <div className={styles.allSteps}>
              <h3>Guía Completa de Formularios EMSA</h3>
              <p>Proceso paso a paso para completar el acta de revisión:</p>
              
              <div className={styles.formSteps}>
                {Object.entries(stepNames).map(([step, info]) => (
                  <div 
                    key={step} 
                    className={`${styles.formStep} ${parseInt(step) === currentStep ? styles.currentStep : ''}`}
                  >
                    <div className={styles.stepHeaderRow}>
                      <span className={styles.stepBadge}>Paso {step}</span>
                      <span className={styles.stepIcon}>{info.icon}</span>
                    </div>
                    <h4>{info.name}</h4>
                    <p className={styles.stepSummary}>
                      {stepContents[step]?.description || "Información del formulario"}
                    </p>
                    <div className={styles.stepFeatures}>
                      {stepContents[step]?.steps.slice(0, 3).map((item, idx) => (
                        <div key={idx} className={styles.feature}>
                          <FiChevronRight /> {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'contacto' && (
            <div className={styles.contactContent}>
              <h3>Soporte Técnico EMSA</h3>
              <p>¿Necesitas ayuda adicional? Contáctanos:</p>
              
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <FiMail className={styles.contactIcon} />
                  <div>
                    <strong>Email de Soporte</strong>
                    <p>soporte.tecnico@emsa.com</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <FiPhone className={styles.contactIcon} />
                  <div>
                    <strong>Teléfono</strong>
                    <p>(601) 123-4567 Ext. 123</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <FiClock className={styles.contactIcon} />
                  <div>
                    <strong>Horario de Atención</strong>
                    <p>Lunes a Viernes: 7:00 AM - 5:00 PM</p>
                    <p>Sábados: 8:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.emergencyContact}>
                <h4>⚠️ Contacto de Emergencia Técnica</h4>
                <p>Para problemas críticos durante visitas técnicas:</p>
                <div className={styles.emergencyInfo}>
                  <p><strong>Celular:</strong> 300 123 4567</p>
                  <p><strong>Email:</strong> emergencias.tecnica@emsa.com</p>
                </div>
              </div>
              
              <div className={styles.faqSection}>
                <h4>❓ Preguntas Frecuentes</h4>
                <div className={styles.faqItem}>
                  <strong>¿Cómo restablezco mi contraseña?</strong>
                  <p>Contacta al administrador del sistema o usa la opción "Olvidé mi contraseña" en la pantalla de login.</p>
                </div>
                <div className={styles.faqItem}>
                  <strong>¿Los datos se guardan automáticamente?</strong>
                  <p>Sí, el sistema guarda automáticamente tu progreso en cada formulario.</p>
                </div>
                <div className={styles.faqItem}>
                  <strong>¿Puedo modificar un acta después de finalizarla?</strong>
                  <p>Solo el administrador puede modificar actas finalizadas. Contacta a soporte.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.helpOverlay} onClick={onClose}></div>
    </div>
  )
}

export default HelpPanel