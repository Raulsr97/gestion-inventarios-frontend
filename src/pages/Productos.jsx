import { Link } from "react-router-dom";
import { FaPrint, FaTint, FaImages, FaCogs } from "react-icons/fa";

function Productos() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* 🔹 CARD PARA AGREGAR IMPRESORAS 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaPrint className="text-blue-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Agregar Impresoras</h2>
          <p className="text-gray-500 mb-4">Registra nuevas impresoras en el sistema.</p>
          <Link
            to="/productos/impresoras/agregar"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Ir a Agregar
          </Link>
        </div>

        {/* 🔹 CARD PARA AGREGAR TÓNER 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaTint className="text-green-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Agregar Tóner</h2>
          <p className="text-gray-500 mb-4">Registra nuevos cartuchos de tóner.</p>
          <Link
            to="/productos/toner/agregar"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Ir a Agregar
          </Link>
        </div>

        {/* 🔹 CARD PARA AGREGAR UNIDADES DE IMAGEN 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaImages className="text-purple-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Agregar Unidades de Imagen</h2>
          <p className="text-gray-500 mb-4">Registra nuevas unidades de imagen.</p>
          <Link
            to="/productos/unidades-imagen/agregar"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          >
            Ir a Agregar
          </Link>
        </div>

        {/* 🔹 CARD PARA AGREGAR REFACCIONES 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaCogs className="text-orange-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Agregar Refacciones</h2>
          <p className="text-gray-500 mb-4">Registra nuevas refacciones en el sistema.</p>
          <Link
            to="/productos/refacciones/agregar"
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
          >
            Ir a Agregar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Productos;
