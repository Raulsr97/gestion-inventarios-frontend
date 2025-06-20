import { Link } from "react-router-dom";
import { FaHome, FaBox, FaSearch, FaClipboardList, FaFileAlt} from "react-icons/fa";
import { useState } from "react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
  className={`h-screen bg-gray-900 text-white flex flex-col justify-between p-4 transition-all duration-300 print:hidden ${
    isCollapsed ? "w-16" : "w-1/6"
  }`}
  onMouseEnter={() => setIsCollapsed(false)}
  onMouseLeave={() => setIsCollapsed(true)}
>
  {/* Parte superior: Logo + Menú */}
  <div>
    <h1 className={`text-2xl font-bold mb-10 transition-all ${isCollapsed ? "hidden" : "block"}`}>
      Sistema de Logística
    </h1>

    <nav className="flex flex-col space-y-4">
      <Link to="/" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
        <FaHome className="text-xl" />
        <span className={`${isCollapsed ? "hidden" : "block"}`}>Inicio</span>
      </Link>
      <Link to="/productos" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
        <FaBox className="text-xl" />
        <span className={`${isCollapsed ? "hidden" : "block"}`}>Productos</span>
      </Link>
      <Link to="/consultas" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
        <FaSearch className="text-xl"/>
        <span className={`${isCollapsed ? "hidden" : "block"}`}>Consultas</span>
      </Link>
      <Link to="/gestion-productos" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
        <FaClipboardList className="text-xl" />
        <span className={`${isCollapsed ? "hidden" : "block"}`}>Gestión de productos</span>
      </Link>
      <Link to="/remisiones" className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-700">
        <FaFileAlt className="text-xl" />
        <span className={`${isCollapsed ? "hidden" : "block"}`}>Remisiones</span>
      </Link>
    </nav>
  </div>

  {/* Parte inferior: Footer */}
  <div className="text-xs text-gray-400 mt-4">
    {isCollapsed ? "v1.0" : "Versión 1.0"}
  </div>
</div>

  
  );
}

export default Sidebar;
