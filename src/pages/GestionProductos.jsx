import { Link } from 'react-router-dom'
import { FaPrint, FaTint, FaImages, FaCogs } from "react-icons/fa";


function Gestiones() {
  return(
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* 🔹 CARD PARA AGREGAR IMPRESORAS 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaPrint className="text-blue-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestión Impresoras</h2>
          <p className="text-gray-500 mb-4">Realiza movimientos en el sistema y genera remisiones.</p>
          <Link
            to="/gestion-productos/gestion-impresoras"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Ir a movimientos
          </Link>
        </div>

        {/* 🔹 CARD PARA AGREGAR TÓNER 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaTint className="text-green-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestión Tóner</h2>
          <p className="text-gray-500 mb-4">Realiza movimientos en el sistema y genera remisiones.</p>
          <Link
            to="/gestion-productos/gestion-toners"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Ir a Agregar
          </Link>
        </div>

        {/* 🔹 CARD PARA AGREGAR UNIDADES DE IMAGEN 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaImages className="text-purple-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestion Unidades de Imagen</h2>
          <p className="text-gray-500 mb-4">Realiza movimientos en el sistema y genera remisiones.</p>
          <Link
            to="/gestion-productos/gestion-unidades-img"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          >
            Ir a Agregar
          </Link>
        </div>

        {/* 🔹 CARD PARA AGREGAR REFACCIONES 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaCogs className="text-orange-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gestion Refacciones</h2>
          <p className="text-gray-500 mb-4">Realiza movimientos en el sistema y genera remisiones.</p>
          <Link
            to="/gestion-productos/gestion-refacciones"
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
          >
            Ir a Agregar
          </Link>
        </div>
      </div>
    </div>
  )
  
}

export default Gestiones;
