import { Link } from "react-router-dom";
import { FaHome, FaBox, FaExchangeAlt } from "react-icons/fa";
import { useState } from "react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col p-4 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-1/6"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo */}
      <h1 className={`text-2xl font-bold mb-6 transition-all ${isCollapsed ? "hidden" : "block"}`}>
        Inventario
      </h1>

      {/* Menú de navegación */}
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
          <FaHome className="text-xl" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>Inicio</span>
        </Link>
        <Link to="/productos" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
          <FaBox className="text-xl" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>Productos</span>
        </Link>
        <Link to="/movimientos" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
          <FaExchangeAlt className="text-xl" />
          <span className={`${isCollapsed ? "hidden" : "block"}`}>Movimientos</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
