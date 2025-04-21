import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function ListaUnidadesimg ({unidadesImg, seleccionadas, manejarSeleccion, clientes, proyectos}) {
  // Estado para almacenar lo que se va escribiendo en el input
  const [busquedaSerie, setBusquedaSerie] = useState('')
  
  const unidadesImgOrdenadas = [...unidadesImg].sort((a, b) => {
    const aSeleccionada = seleccionadas.some(sel => sel.serie === a.serie) ? 0 : 1;
    const bSeleccionada = seleccionadas.some(sel => sel.serie === b.serie) ? 0 : 1; 
    return aSeleccionada - bSeleccionada;
  });
  

  // Impresoras que coinciden con lo escrito en el input
  const unidadesImgFiltradas = unidadesImgOrdenadas.filter(unidadImg => unidadImg.serie.toLowerCase().includes(busquedaSerie.toLowerCase()))

  console.log("🆙 Lista FINAL de unidades de imagen para mostrar:");
  console.log(unidadesImgFiltradas.map(ui => ui.serie));


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
        Unidades de imagen seleccionadas: <span className="text-blue-600">{seleccionadas.length}</span>
      </p>

      {/* Lista de series disponibles */}
      <div className="flex-1 h-full overflow-y-auto gap-2">
        {unidadesImgFiltradas.length > 0 ? (
          unidadesImgFiltradas.map((unidadImg) => (
            <label
              key={unidadImg.serie}
              className={`flex items-center justify-between p-2 rounded-lg shadow-md cursor-pointer border transition ${
                seleccionadas.some(ui => ui.serie === unidadImg.serie)
                  ? "bg-green-300 border-green-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <div>
                <p className="text-md font-semibold text-gray-700">{unidadImg.serie}</p>
                <p className="text-gray-500 text-xs">
                  {unidadImg.modelo} 
                  {unidadImg.cliente_id && ` - ${clientes.find(c => c.id === unidadImg.cliente_id)?.nombre}`}
                  {unidadImg.proyecto_id && ` - ${proyectos.find(p => p.id === unidadImg.proyecto_id)?.nombre}`}
                </p>
              </div>
              <input
                type="checkbox"
                checked={seleccionadas.some(ui => ui.serie === unidadImg.serie)}
                onChange={() => manejarSeleccion(unidadImg.serie)}
                className="w-5 h-5 rounded"
              />
            </label>
          ))
        ) : (
          <p className="text-gray-500 text-center">No se encontraron unidades de imagen.</p>
        )}
      </div>
    </div>
  )
}

export default ListaUnidadesimg