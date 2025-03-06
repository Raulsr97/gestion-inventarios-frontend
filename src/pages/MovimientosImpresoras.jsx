import { useEffect, useState } from "react";

function MovimientosImpresoras() {
  const [impresoras, setImpresoras] = useState([])
  const [clientesUnicos, setClientesUnicos] = useState([])
  const [proyectosUnicos, setProyectosUnicos] = useState([])
  const [mostrarSalida, setMostrarSalida] = useState(true)
  const [datosSalida, setDatosSalida] = useState({
    cliente: '',
    proyecto: '',
    series: []
  })
  const [seriesDisponibles, setSeriesDisponibles] = useState([])
  const [busquedaSerie, setBusquedaSerie] = useState('') // Guarda el texto del buscador
  const [empresas, setEmpresas] = useState([])
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('')
  const [formularioRemision, setFormularioRemision] = useState({
    destinatario: '',
    direccion_entrega: '',
    notas: ''
  })
  const [mostrarFormularioRemision, setMostrarFormularioRemision] = useState(false)
  


  useEffect(() => {
    fetch('http://localhost:3000/api/impresoras')
      .then((res) => res.json())
      .then((data) => {
        setImpresoras(data)

        // Extraer clientes unicos sin duplicados
        const clientes = [...new Set(data.map((impresora) => impresora.cliente?.nombre).filter(Boolean))]
        const proyectos = [...new Set(data.map((impresora) => impresora.proyecto?.nombre).filter(Boolean))]

        setClientesUnicos(clientes)
        setProyectosUnicos(proyectos)

        // Filtrar series segun cliente y proyecto seleccionados
        let seriesFiltradas = data.filter(impresora =>
          !impresora.fecha_salida && // Solo las que siguen en almacén
          (!datosSalida.cliente || impresora.cliente?.nombre === datosSalida.cliente) &&
          (!datosSalida.proyecto || impresora.proyecto?.nombre === datosSalida.proyecto)
        )

        setSeriesDisponibles(seriesFiltradas)
      })
      .catch(error => console.error('Error al obtener los datos:', error))
    
    fetch('http://localhost:3000/api/empresas')
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch((error) => console.error('Error al obtener las empresas:', error))
  
    }, [datosSalida.cliente, datosSalida.proyecto]) // Dependencias para actualizar cuando cambie cliente/proyecto

  const totalSeriesDisponibles = seriesDisponibles.length
  const totalSeriesSeleccionadas = datosSalida.series.length

 return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Encabezado */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Movimientos de Impresoras
        </h2>

        {/* 🔹 Botones de Selección */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`py-2 px-6 rounded-md transition text-white ${
              mostrarSalida ? "bg-blue-700" : "bg-gray-500 hover:bg-blue-600"
            }`}
            onClick={() => setMostrarSalida(true)}
          >
            Registrar Salida
          </button>
          <button
            className={`py-2 px-6 rounded-md transition text-white ${
              !mostrarSalida ? "bg-blue-700" : "bg-gray-500 hover:bg-blue-600"
            }`}
            onClick={() => setMostrarSalida(false)}
          >
            Registrar Entrega
          </button>
        </div>

        {/* 🔹 Contenedor Dinámico */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {mostrarSalida ? (
            // 🔸 Formulario de Registrar Salida
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Registrar Salida
              </h3>
              {/* Seleccion del Cliente */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" >Cliente</label>
                <select  
                  className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
                  value={datosSalida.cliente || ''}
                  onChange={(e) => setDatosSalida({
                    cliente: e.target.value === 'Sin asignar' ? '' : e.target.value,
                    proyecto: e.target.value !== 'Sin asignar' ? '' : datosSalida.proyecto,
                    series: []
                  })}
                  disabled={!!datosSalida.proyecto}
                >
                  <option value="" disabled hidden>Selecciona un cliente</option>
                  <option value="Sin asignar">Sin asignar</option>
                  {clientesUnicos.map(cliente => (
                    <option key={cliente} value={cliente}>{cliente}</option>
                  ))}
                </select>
              </div>
              {/* Seleccion del Proyecto */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" >Proyecto</label>
                <select  
                  className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
                  value={datosSalida.proyecto || ''}
                  onChange={(e) => setDatosSalida({
                    cliente: e.target.value !== 'Sin asignar' ? '' : datosSalida.cliente,
                    proyecto: e.target.value === 'Sin asignar' ? '' : e.target.value,
                    series: []
                  })}
                  disabled={!!datosSalida.cliente}
                >
                  <option value="" disabled hidden>Selecciona un proyecto</option>
                  <option value="Sin asignar">Sin asignar</option>
                  {proyectosUnicos.map(proyecto => (
                    <option key={proyecto} value={proyecto}>{proyecto}</option>
                  ))}
                </select>
              </div>
              
              {/* Filtrador de Series */}
              <input
                type="text"
                placeholder="Buscar serie..."
                className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
                value={busquedaSerie}
                onChange={(e) => setBusquedaSerie(e.target.value)}
                />
              
              {/* Contador de Series */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">
                  📦 Total disponibles: <strong>{totalSeriesDisponibles}</strong>
                </span>
                <span className="text-blue-600 text-sm">
                  ✅ Seleccionadas: <strong>{totalSeriesSeleccionadas}</strong>
                </span>
              </div>
        
              {/* Lista de series disponibles */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Selecciona las series a dar salida:</h4>

                <ul className="text-gray-600 text-sm space-y-1 max-h-40 overflow-y-auto border p-2 rounded">
                  {seriesDisponibles
                    .filter(impresora => !impresora.fecha_salida) // Solo las impresoras que no tienen salida
                    .filter(impresora => 
                      busquedaSerie === '' || impresora.serie.includes(busquedaSerie.toUpperCase())
                    )
                    .map(impresora => (
                      <li key={impresora.serie} className="flex justify-between items-center border-b py-1">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox text-blue-600"
                            checked={datosSalida.series.includes(impresora.serie)}
                            onChange={() => {
                              setDatosSalida((prev) => ({
                                ...prev,
                                series: prev.series.includes(impresora.serie)
                                  ? prev.series.filter((serie) => serie !== impresora.serie)
                                  : [...prev.series, impresora.serie]
                              }))
                            }}
                          />
                          <span>{impresora.serie}</span>
                        </label>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ) : (
            // 🔸 Formulario de Registrar Entrega
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Registrar Entrega
              </h3>
              {/* Aquí irá el formulario de entrega */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovimientosImpresoras;