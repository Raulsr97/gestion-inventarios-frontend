import { Link } from "react-router-dom";
import { FaHome, FaBox, FaExchangeAlt } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-1/5 h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-6">Inventario</h1>

      {/* Menú de navegación */}
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
          <FaHome /> Inicio
        </Link>
        <Link to="/productos" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
          <FaBox /> Productos
        </Link>
        <Link to="/movimientos" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
          <FaExchangeAlt /> Movimientos
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;