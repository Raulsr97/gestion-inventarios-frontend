import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function ListaToners ({toners, seleccionados, manejarSeleccion, clientes, proyectos}) {
  // Estado para almacenar lo que se va escribiendo en el input
  const [busquedaSerie, setBusquedaSerie] = useState('')
  
  const tonersOrdenados = [...toners].sort((a, b) => {
    const aSeleccionado = seleccionados.some(sel => sel.serie === a.serie) ? 0 : 1;
    const bSeleccionado = seleccionados.some(sel => sel.serie === b.serie) ? 0 : 1; 
    return aSeleccionado - bSeleccionado;
  });
  

  // Toners que coinciden con lo escrito en el input
  const tonersFiltrados = tonersOrdenados.filter(toner => toner.serie.toLowerCase().includes(busquedaSerie.toLowerCase()))

  console.log("🆙 Lista FINAL de toners para mostrar:");
  console.log(tonersFiltrados.map(t => t.serie));


  return (
    <div className="w-full flex flex-col px-2 py-8 bg-white rounded-lg max-h-[calc(100vh-100px)]">
      {/* 🔍 Filtro de búsqueda */}
      <div className="relative mb-2">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar número de serie..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-700 focus:outline-none text-gray-700"
          value={busquedaSerie}
          onChange={(e) => setBusquedaSerie(e.target.value)}
        />
      </div>
      <p className="text-gray-700 font-semibold pb-2">
        Toners seleccionados: <span className="text-blue-600">{seleccionados.length}</span>
      </p>

      {/* Lista de series disponibles */}
      <div className="flex-1 h-full overflow-y-auto gap-2">
        {tonersFiltrados.length > 0 ? (
          tonersFiltrados.map((toner) => (
            <label
              key={toner.serie}
              className={`flex items-center justify-between p-2 rounded-lg shadow-md cursor-pointer border transition ${
                seleccionados.some(t => t.serie === toner.serie)
                  ? "bg-green-300 border-green-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <div>
                <p className="text-md font-semibold text-gray-700">{toner.serie}</p>
                <p className="text-gray-500 text-xs">
                  {toner.modelo} 
                  {toner.cliente_id && ` - ${clientes.find(c => c.id === toner.cliente_id)?.nombre}`}
                  {toner.proyecto_id && ` - ${proyectos.find(p => p.id === toner.proyecto_id)?.nombre}`}
                </p>
              </div>
              <input
                type="checkbox"
                checked={seleccionados.some(t => t.serie === toner.serie)}
                onChange={() => manejarSeleccion(toner.serie)}
                className="w-5 h-5 rounded"
              />
            </label>
          ))
        ) : (
          <p className="text-gray-500 text-center">No se encontraron toners.</p>
        )}
      </div>
    </div>
  )
}

export default ListaToners