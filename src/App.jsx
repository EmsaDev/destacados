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

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const goToStep = (stepNumber) => {
    setStep(stepNumber)
    setIsMenuOpen(false) // Cerrar menú al navegar
  }

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
              ❓
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
            <div className="sidebar-header">
              <h3>Menú de Navegación</h3>
              <button 
                className="close-menu"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>
            
            <nav className="sidebar-nav">
              <div className="user-info">
                <div className="user-avatar">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : user?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <strong>{userData.name || user}</strong>
                  <span>CC: {userData.cc || 'N/A'}</span>
                </div>
              </div>

              <div className="nav-section">
                <h4>Formularios</h4>
                <button 
                  className={`nav-item ${step === 1 ? 'nav-item-active' : ''}`}
                  onClick={() => goToStep(1)}
                >
                  📋 Formulario 1 - Datos Básicos
                </button>
                <button 
                  className={`nav-item ${step === 2 ? 'nav-item-active' : ''}`}
                  onClick={() => goToStep(2)}
                >
                  📊 Formulario 2 - Información Adicional
                </button>
                <button 
                  className={`nav-item ${step === 3 ? 'nav-item-active' : ''}`}
                  onClick={() => goToStep(3)}
                >
                  📝 Formulario 3 - Detalles Finales
                </button>
                <button 
                  className={`nav-item ${step === 4 ? 'nav-item-active' : ''}`}
                  onClick={() => goToStep(4)}
                >
                  ✍️ Firma Digital
                </button>
                <button 
                  className={`nav-item ${step === 5 ? 'nav-item-active' : ''}`}
                  onClick={() => goToStep(5)}
                >
                  📄 Resumen Final
                </button>
              </div>

              <div className="nav-section">
                <h4>Acciones</h4>
                <button className="nav-item" onClick={toggleHelp}>
                  ❓ Ayuda y Soporte
                </button>
                <button className="nav-item logout-btn" onClick={handleLogout}>
                  🚪 Cerrar Sesión
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
                  nextStep={nextStep} 
                  prevStep={prevStep} 
                />
              )}
              {step === 4 && (
                <DiagramSelectionStep 
                  data={formData} 
                  updateData={handleFormData} // Necesitarás esta función
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
        <p>⚡ emsa 2025 | Todos los derechos reservados &copy; </p> 
      </footer>
      {/* Contenedor global de los toasts */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App