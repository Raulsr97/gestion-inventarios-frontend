import { FaWarehouse } from "react-icons/fa";
import { useEffect, useState } from "react";

function ImpresorasAlmacenCard() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/api/impresoras/almacen-por-proyecto')
      .then((res) => res.json())
      .then((data) => {
        console.log("📡 Datos recibidos del backend:", data); // 🔍 Ver qué datos llegan
        setDatos(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al obtener los datos', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">📊 Impresoras por proyecto</h2>
  
      {loading ? (
        <p className="text-gray-500 text-center">Cargando...</p>
      ) : datos.length === 0 ? (
        <p className="text-gray-500 text-center">No hay impresoras en almacén.</p>
      ) : (
        <ul className="space-y-3">
          {datos.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 transition-transform transform hover:scale-105">
              <span className="text-gray-700 font-medium">{item.proyecto}</span>
              <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-md">
                {item.cantidad}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  
}

export default ImpresorasAlmacenCard;
