import { useState, useEffect } from 'react'
import Login from './components/Login'
import Form1 from './components/Form1'
import Form2 from './components/Form2'
import Form3 from './components/Form3'
import DiagramSelectionStep from './components/DiagramSelectionStep';
import SignaturePadStep from './components/SignaturePadStep'
import Summary from './components/Summary'
import HelpPanel from './components/HelpPanel'
import './App.css'
import { Toaster } from "react-hot-toast";
import { Code,Zap,CodeXml,Copyright } from "lucide-react";
import {FiFileText, FiChevronUp, FiChevronDown, FiLayers, FiEdit3, FiFile, FiCheckCircle,FiHelpCircle, FiLogOut, FiClipboard } from 'react-icons/fi';

function App() {
  const [step, setStep] = useState(0) // 0 = login
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState({ name: '', cc: '' })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    diagramaUnifilar: '',
    diagramaFasorial: '',
    diagramaConexiones: ''
  })
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false
  })

  const [expandedSections, setExpandedSections] = useState({});

  // token guardado en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const name = localStorage.getItem('userName')
    const cc = localStorage.getItem('userCC')
    
    if (token && username) {
      setUser(username)
      if (name && cc) {
        setUserData({ name, cc })
      }
      setStep(1) // ir directo al form
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignature = (sig) => {
    setFormData({
      ...formData,
      signature: sig
    })
  }

  const handleLogin = (username, name, cc) => {
    setUser(username)
    setUserData({ name, cc })
    localStorage.setItem('username', username)
    localStorage.setItem('userName', name)
    localStorage.setItem('userCC', cc)
    setStep(1)
    setIsMenuOpen(true) // Abrir menú después del login
  }

  const nextStep = () => {
  // Marcar el paso actual como completado antes de avanzar
  markStepAsCompleted(step);
  setStep(step + 1);
};
  const prevStep = () => setStep(prev => prev - 1)


  const goToStep = (targetStep) => {
    // Verificar si el paso target está disponible
    if (isStepAvailable(targetStep)) {
      setStep(targetStep);
    } else {
      toast.error('Complete los pasos anteriores primero');
    }
  };
  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userCC')
    localStorage.removeItem('userName')

    setUser(null)
    setUserData({ name: '', cc: '' })
    setStep(0)
    setIsMenuOpen(false)
    setShowHelp(false)
    setFormData({
      name: '',
      diagramaUnifilar: '',
      diagramaFasorial: '',
      diagramaConexiones: ''
    })
  }

  const toggleHelp = () => {
    setShowHelp(!showHelp)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (showHelp) setShowHelp(false)
  }

  const handleFormData = (newData) => {
  setFormData(prev => ({ ...prev, ...newData }));
};

  const markStepAsCompleted = (stepNumber) => {
  setCompletedSteps(prev => ({
    ...prev,
    [`step${stepNumber}`]: true
  }));
};

  const isStepAvailable = (targetStep) => {
    // El paso 1 siempre está disponible
    if (targetStep === 1) return true;
    
    // Verificar que todos los pasos anteriores estén completados
    for (let i = 1; i < targetStep; i++) {
      if (!completedSteps[`step${i}`]) {
        return false;
      }
    }
    return true;
  };

  const toggleSection = (sectionName) => {
  setExpandedSections(prev => ({
    ...prev,
    [sectionName]: !prev[sectionName]
  }));
};


  return (
    <div className="app-wrapper">
      {/* Header - Solo mostrar botones cuando user existe */}
      {user && (
      <header className="app-header">
        <div className="header-left">
          
            <button 
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          
          <h1>Sistema EMSA - Actas de Revisión</h1>
        </div>
  
        {user && (
          <div className="header-right">
            <button 
              className="help-btn"
              onClick={toggleHelp}
              aria-label="Ayuda"
            >
              <FiHelpCircle />
            </button>
            <span className="user-welcome">Hola, {userData.name || user}</span>
          </div>
        )}
      </header>
      )}
      {/* Menú Lateral - Solo mostrar cuando user existe */}
      {user && (
        <>
          <aside className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`}>
            <div className="user-info-container">
              <div className="user-info">
                <div className="user-avatar">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : user?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <strong>{userData.name || user}</strong>
                  <span>CC: {userData.cc || 'N/A'}</span>
                </div>
              </div>
              
              <button className="close-menu-floating" onClick={toggleMenu}>
                ×
              </button>
            </div>
                  
            <nav className="sidebar-nav">
              <div className={`nav-section ${!expandedSections.formularios && 'collapsed'}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h4>Formularios</h4>
                  <button 
                    className="nav-section-toggle"
                    onClick={() => toggleSection('formularios')}
                  >
                    {expandedSections.formularios ? <FiChevronUp/> : <FiChevronDown/>}
                  </button>
                  
                </div>
                <button 
                    className={`nav-item ${step === 1 ? 'nav-item-active' : ''}`}
                    onClick={() => goToStep(1)}
                  >
                    <FiFileText className="nav-icon" />
                    Formulario 1 - Datos Básicos
                    {completedSteps.step1 && <FiCheckCircle className="nav-completed" />}
                  </button>
                  
                  <button 
                    className={`nav-item ${step === 2 ? 'nav-item-active' : ''} ${!isStepAvailable(2) ? 'nav-item-disabled' : ''}`}
                    onClick={() => goToStep(2)}
                    disabled={!isStepAvailable(2)}
                  >
                    <FiFileText className="nav-icon" />
                    Formulario 2 - Información Adicional
                    {completedSteps.step2 && <FiCheckCircle className="nav-completed" />}
                  </button>
                  
                  <button 
                    className={`nav-item ${step === 3 ? 'nav-item-active' : ''} ${!isStepAvailable(3) ? 'nav-item-disabled' : ''}`}
                    onClick={() => goToStep(3)}
                    disabled={!isStepAvailable(3)}
                  >
                    <FiFileText className="nav-icon" />
                    Formulario 3 - Detalles Finales
                    {completedSteps.step3 && <FiCheckCircle className="nav-completed" />}
                  </button>
                  
                  <button 
                    className={`nav-item ${step === 4 ? 'nav-item-active' : ''} ${!isStepAvailable(4) ? 'nav-item-disabled' : ''}`}
                    onClick={() => goToStep(4)}
                    disabled={!isStepAvailable(4)}
                  >
                    <FiLayers className="nav-icon" />
                    Acta de Diagramas
                    {completedSteps.step4 && <FiCheckCircle className="nav-completed" />}
                  </button>
                  
                  <button 
                    className={`nav-item ${step === 5 ? 'nav-item-active' : ''} ${!isStepAvailable(5) ? 'nav-item-disabled' : ''}`}
                    onClick={() => goToStep(5)}
                    disabled={!isStepAvailable(5)}
                  >
                    <FiEdit3 className="nav-icon" />
                    Firma Digital
                    {completedSteps.step5 && <FiCheckCircle className="nav-completed" />}
                  </button>
                  
                  <button 
                    className={`nav-item ${step === 6 ? 'nav-item-active' : ''} ${!isStepAvailable(6) ? 'nav-item-disabled' : ''}`}
                    onClick={() => goToStep(6)}
                    disabled={!isStepAvailable(6)}
                  >
                    <FiClipboard/> Resumen Final
                  </button>
              </div>

              <div className="nav-section">
                <h4>Acciones</h4>
                <button className="nav-item" onClick={toggleHelp}>
                  <FiHelpCircle className="nav-icon" />
                  Ayuda y Soporte
                </button>
                <button className="nav-item logout-btn" onClick={handleLogout}>
                  <FiLogOut className="nav-icon" />
                  Cerrar Sesión
                </button>
              </div>
            </nav>
          </aside>

          {/* Overlay para cerrar menú al hacer clic fuera - Solo cuando user existe y menú abierto */}
          {isMenuOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}
        </>
      )}

      {/* Panel de Ayuda - Solo cuando user existe */}
      {user && showHelp && <HelpPanel onClose={toggleHelp} />}

      {/* Contenido Principal */}
      <main className="app-main">
        <div className="form-container">
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <>
              {step === 1 && (
                <Form1 
                  data={formData} 
                  handleChange={handleChange} 
                  nextStep={nextStep} 
                  userData={userData}
                />
              )}
              {step === 2 && (
                <Form2 
                  data={formData} 
                  handleChange={handleChange} 
                  nextStep={nextStep} 
                  prevStep={prevStep} 
                />
              )}
              {step === 3 && (
                <Form3 
                  data={formData} 
                  handleChange={handleChange} 
                  updateData={handleFormData} 
                  nextStep={nextStep} 
                  prevStep={prevStep} 
                />
              )}
              {step === 4 && (
                <DiagramSelectionStep 
                  data={formData} 
                  updateData={handleFormData}
                  nextStep={nextStep} 
                  prevStep={prevStep} 
                />
              )}
              {step === 5 && (
                <SignaturePadStep 
                  data={formData} 
                  handleSignature={handleSignature} 
                  nextStep={nextStep} 
                  prevStep={prevStep} 
                />
              )}
              {step === 6 && (
                <Summary 
                  data={formData} 
                  prevStep={prevStep} 
                />
              )}
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p style={{ margin: 0, lineHeight: '1.6' }}>
          <Zap size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          emsa 2025 | Todos los derechos reservados  <Copyright size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> 
          <br />
          <span style={{ fontSize: '16px', color: '#cccccc' }}>
            <Code size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: '#ffa500'}} />
            Desarrollado por Ing. Nicolás Rodriguez <CodeXml size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: '#ffa500'}} />
          </span>
        </p>
      </footer>
      {/* Contenedor global de los toasts */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App