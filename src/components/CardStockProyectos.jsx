import { useEffect, useState } from "react"
import { FaProjectDiagram } from "react-icons/fa"

function CardStockProyectos() {
  const [ proyectos, setProyectos ] = useState([])
  const [ mostrarDetalle, setMostrarDetalle] = useState(false)
  

  useEffect(() => {
    fetch('http://localhost:3000/api/impresoras/almacen-por-proyecto')
      .then((res) => res.json())
      .then((data) => setProyectos(data))
      .catch((error) => console.error("Error al obtener los proyectos:", error));
  }, [])

  const totalImpresoras = proyectos.reduce((total, proyecto) => total + proyecto.cantidad, 0)

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-transform hover:scale-105" onClick={() => setMostrarDetalle(true)}>
        <FaProjectDiagram className="text-blue-600 text-4xl mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">Impresoras por Proyecto</h2>
        <p className="text-gray-500 text-sm">Total en almacén</p>
        <span className="text-3xl font-bold text-blue-700 mt-2">{totalImpresoras}</span>
      </div>

      {mostrarDetalle && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50" onClick={() => setMostrarDetalle(false)}>
          <div
            className="bg-white shadow-lg rounded-lg
            p-6 w-[350px] max-h-[80vh] overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer click
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Desglose por Proyecto</h3>

            <ul className="w-full text-gray-600 text-sm space-y-2 overflow-y-auto max-h-60 px-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
              {proyectos.map((proyecto, index) => (
                <li key={index} className="flex justify-between border-b py-2 w-full">
                  <span className="font-medium">{proyecto.proyecto}</span>
                  <span className="font-bold">{proyecto.cantidad}</span>
                </li>
              ))}
            </ul>

            <button 
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => setMostrarDetalle(false)}
            >
              Cerrar
            </button>
            
          </div>
        </div>
      )}
    </>
  )
}

export default CardStockProyectos