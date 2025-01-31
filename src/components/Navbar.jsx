import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between">
            <h1 className="text-xl font-bold text-lila">Inventario</h1>
            <div className="space-x-4">
                <Link to="/" className="text-gray-600 hover:text-lila">Inicio</Link>
                <Link to="/productos" className="text-gray-600 hover:text-lila">Productos</Link>
                <Link to="/movimientos" className="text-gray-600 hover:text-lila">Movimientos</Link>
            </div>
        </nav>
    )
}

export default Navbar