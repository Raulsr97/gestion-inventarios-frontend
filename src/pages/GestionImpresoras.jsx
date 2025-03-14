import { useEffect, useState } from "react";

function GestionImpresoras() {
  const [impresorasDisponibles ,setImpresorasDisponibles] = useState([])
  const [busquedaSerie, setBusquedaSerie] = useState('')

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then(res => res.json())
      .then(data => {
        // Filtrar solo las impresoras que no tienen fecha de salida
        const disponibles = data.filter(impresora => !impresora.fecha_salida)
        setImpresorasDisponibles(disponibles)
      })
      .catch(error => console.error('Error al obtener las impresoras', error))
  })

  const impresorasFiltradas = impresorasDisponibles.filter(impresora => impresora.serie.toLowerCase().includes(busquedaSerie.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Input de busqueda */}
        <input 
          type="text" 
          placeholder="Buscar Serie..."
          value={busquedaSerie}
          onChange={e => setBusquedaSerie(e.target.value)}
          className="w-1/2 m-6 p-2 border rounded mb-4"
        />

        {/* Lista de series disponibles */}
        <ul>
          {impresorasFiltradas.map(impresora => (
            <li key={impresora.serie} className="p-2 border-b flex justify-between"> 
              <span>{impresora.modelo} - {impresora.serie}</span>
            </li>
          ))}
        </ul>
    </div>
    
  )
}

export default GestionImpresoras;
