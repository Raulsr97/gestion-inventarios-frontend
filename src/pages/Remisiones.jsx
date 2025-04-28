import { Link } from "react-router-dom";
import { FaFileAlt, FaFileExport, FaFileImport } from "react-icons/fa";

function Remisiones() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

        {/* 🔍 CONSULTAR REMISIONES */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaFileAlt className="text-blue-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Consultar Remisiones</h2>
          <p className="text-gray-500 mb-4">Busca remisiones por número, revisa sus detalles y accede al PDF.</p>
          <Link
            to="/remisiones/buscar"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Ir a Consultar
          </Link>
        </div>

        {/* 📤 CREAR REMISIÓN DE ENTREGA */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaFileExport className="text-green-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Remisión de Entrega</h2>
          <p className="text-gray-500 mb-4">Selecciona productos del inventario para crear una remisión de entrega.</p>
          <Link
            to="/gestion-productos"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Crear Entrega
          </Link>
        </div>

        {/* 📥 CREAR REMISIÓN DE RECOLECCIÓN */}
        <div className="bg-white shadow-lg rounded-lg p-6 h-[260px] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
          <FaFileImport className="text-yellow-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Remisión de Recolección</h2>
          <p className="text-gray-500 mb-4">Captura manualmente los datos de los productos a recolectar.</p>
          <Link
            to="/remisiones/recoleccion"
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700"
          >
            Crear Recolección
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Remisiones;
