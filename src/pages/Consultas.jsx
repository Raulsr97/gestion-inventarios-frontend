import { Link } from "react-router-dom";
import { FaPrint, FaTint, FaCogs, FaImages} from "react-icons/fa";

function Consultas() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* 🔹 CARD PARA CONSULTAR IMPRESORAS 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaPrint className="text-blue-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Consultar Impresoras</h2>
          <p className="text-gray-500 mb-4">Busca y filtra información sobre las impresoras registradas.</p>
          <Link
            to="/consultas/impresoras"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Ver Impresoras
          </Link>
        </div>

        {/* 🔹 CARD PARA CONSULTAR TÓNER 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaTint className="text-green-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Consultar Tóner</h2>
          <p className="text-gray-500 mb-4">Busca y filtra información sobre los tóners registrados.</p>
          <Link
            to="/consultas/toners"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Ver Tóner
          </Link>
        </div>

        {/* 🔹 CARD PARA CONSULTAR UNIDADES DE IMAGEN 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        <FaImages className="text-purple-600 text-5xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Consultar Unidades de Imagen</h2>
        <p className="text-gray-500 mb-4">Busca y filtra información sobre las unidades de imagen registradas.</p>
        <Link
            to="/consultas/unidades-imagen"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
        >
            Ver Unidades de Imagen
        </Link>
        </div>


        {/* 🔹 CARD PARA CONSULTAR REFACCIONES 🔹 */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaCogs className="text-orange-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Consultar Refacciones</h2>
          <p className="text-gray-500 mb-4">Busca y filtra información sobre las refacciones registradas.</p>
          <Link
            to="/consultas/refacciones"
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
          >
            Ver Refacciones
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Consultas;
