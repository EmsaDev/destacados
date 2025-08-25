import { useState, useEffect } from 'react'
import Login from './components/Login'
import Form1 from './components/Form1'
import Form2 from './components/Form2'
import Form3 from './components/Form3'
import SignaturePadStep from './components/SignaturePadStep'
import Summary from './components/Summary'
import './App.css'

function App() {
  const [step, setStep] = useState(0) // 0 = login
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    country: '',
    city: '',
    phone: '',
    job: '',
    company: '',
    experience: ''
  })

   // token guardado en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    if (token && username) {
      setUser(username)
      setStep(1) // ir directo al form
      console.log('CC type:', typeof userData.cc);
    
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

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

   // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userCC')
    localStorage.removeItem('userName')

    // Redirigir al login o recargar la página
    window.location.href = '/login';
    setUser(null)
    setStep(0)
  }

  return (
    <div className="app-wrapper">
      <div className="container">
        
        {!user ? (
          <Login onLogin={(username) => { setUser(username); localStorage.setItem('username', username); setStep(1); }} />
        ) : (
          <>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h1>Formulario paso a paso</h1>
              <div>
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>👤 {user}</span>
                <button onClick={handleLogout} style={{ backgroundColor: 'red' }}>Cerrar sesión</button>
              </div>
            </div>
        {step === 1 && <Form1 data={formData} handleChange={handleChange} nextStep={nextStep} />}
        {step === 2 && <Form2 data={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Form3 data={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <SignaturePadStep data={formData} handleSignature={handleSignature} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Summary data={formData} prevStep={prevStep} />}
          </>
        )}
      </div>
      <footer className="footer">
        ⚡ emsa 2025
      </footer>
    </div>
  )
}

export default App
