function Form1({ data, handleChange, nextStep }) {
  return (
    <div>
      <h2>Formulario 1</h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={data.name}
        onChange={handleChange}
      />
      <br />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={data.email}
        onChange={handleChange}
      />
      <br />
      <button onClick={nextStep}>Siguiente</button>
    </div>
  )
}

export default Form1
