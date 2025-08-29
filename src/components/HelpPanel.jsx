import { useState } from 'react'
import styles from './HelpPanel.module.css'

function HelpPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className={styles.helpPanel}>
      <div className={styles.helpContent}>
        <div className={styles.helpHeader}>
          <h2>❓ Centro de Ayuda</h2>
          <button className={styles.closeHelp} onClick={onClose}>✕</button>
        </div>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'general' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'formularios' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('formularios')}
          >
            Formularios
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'contacto' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('contacto')}
          >
            Contacto
          </button>
        </div>
        
        <div className={styles.tabContent}>
          {activeTab === 'general' && (
            <div>
              <h3>Bienvenido al Sistema EMSA</h3>
              <p>Este sistema te permite gestionar las actas de revisión de manera digital y eficiente.</p>
              <ul>
                <li>✅ Navega entre formularios usando el menú lateral</li>
                <li>✅ Guarda tu progreso automáticamente</li>
                <li>✅ Firma digitalmente tus documentos</li>
                <li>✅ Revisa el resumen antes de finalizar</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'formularios' && (
            <div>
              <h3>Guía de Formularios</h3>
              <div className={styles.formGuide}>
                <h4>📋 Formulario 1 - Datos Básicos</h4>
                <p>Información principal del acta de revisión.</p>
                
                <h4>📊 Formulario 2 - Información Adicional</h4>
                <p>Detalles específicos del proceso de revisión.</p>
                
                <h4>📝 Formulario 3 - Detalles Finales</h4>
                <p>Observaciones y conclusiones del proceso.</p>
                
                <h4>✍️ Firma Digital</h4>
                <p>Firma electrónica del documento.</p>
                
                <h4>📄 Resumen Final</h4>
                <p>Revisión completa antes de enviar.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'contacto' && (
            <div>
              <h3>Soporte Técnico</h3>
              <p>¿Necesitas ayuda? Contáctanos:</p>
              <div className={styles.contactInfo}>
                <p>📧 <strong>Email:</strong> soporte@emsa.com</p>
                <p>📞 <strong>Teléfono:</strong> (601) 123-4567</p>
                <p>🕒 <strong>Horario:</strong> Lunes a Viernes 8:00 AM - 5:00 PM</p>
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