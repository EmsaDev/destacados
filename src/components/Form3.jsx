function Form3({ data, handleChange, nextStep, prevStep }) {
  return (
    <div>
      <h2>Formulario 3</h2>
      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={data.phone}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="job"
        placeholder="Puesto de trabajo"
        value={data.job}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="company"
        placeholder="Empresa"
        value={data.company}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="experience"
        placeholder="Años de experiencia"
        value={data.experience}
        onChange={handleChange}
      />
      <br />
      <button onClick={prevStep}>Atrás</button>
      <button onClick={nextStep}>Siguiente</button>
    </div>
  )
}

export default Form3
