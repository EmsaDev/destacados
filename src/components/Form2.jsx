function Form2({ data, handleChange, nextStep, prevStep }) {
  return (
    <div>
      <h2>Formulario 2</h2>
      <input
        type="number"
        name="age"
        placeholder="Edad"
        value={data.age}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="country"
        placeholder="País"
        value={data.country}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="city"
        placeholder="Ciudad"
        value={data.city}
        onChange={handleChange}
      />
      <br />
      <button onClick={prevStep}>Atrás</button>
      <button onClick={nextStep}>Siguiente</button>
    </div>
  )
}

export default Form2
