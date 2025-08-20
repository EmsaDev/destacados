import { useState } from 'react'
import Form1 from './components/Form1'
import Form2 from './components/Form2'
import Form3 from './components/Form3'
import SignaturePadStep from './components/SignaturePadStep'
import Summary from './components/Summary'
import './App.css'

function App() {
  const [step, setStep] = useState(1)
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

  return (
    <div className="app-wrapper">
      <div className="container">
        <h1>Formulario paso a paso</h1>
        {step === 1 && <Form1 data={formData} handleChange={handleChange} nextStep={nextStep} />}
        {step === 2 && <Form2 data={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Form3 data={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <SignaturePadStep data={formData} handleSignature={handleSignature} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Summary data={formData} prevStep={prevStep} />}
      </div>
      <footer className="footer">
        ⚡ emsa 2025
      </footer>
    </div>
  )
}

export default App
