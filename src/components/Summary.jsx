export default function Summary({ data, prevStep }) {
  return (
    <div>
      <h2>Resumen</h2>
      <p><strong>Nombre:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Edad:</strong> {data.age}</p>
      <p><strong>País:</strong> {data.country}</p>
      <p><strong>Ciudad:</strong> {data.city}</p>
      <p><strong>Teléfono:</strong> {data.phone}</p>
      <p><strong>Puesto:</strong> {data.job}</p>
      <p><strong>Empresa:</strong> {data.company}</p>
      <p><strong>Experiencia:</strong> {data.experience}</p>

      {data.signature && (
        <div>
          <strong>Firma:</strong>
          <br />
          <img src={data.signature} alt="Firma" />
        </div>
      )}

      <div>
        <button onClick={prevStep}>Atrás</button>
      </div>
    </div>
  )
}
