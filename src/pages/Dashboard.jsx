import { FaBox, FaExchangeAlt, FaChartBar } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {/* 🔹 Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total de Productos */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
          <FaBox className="text-blue-600 text-5xl mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">Total de Productos</h2>
          <p className="text-gray-500 text-2xl font-bold">350</p>
        </div>

        {/* Últimos Movimientos */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
          <FaExchangeAlt className="text-green-600 text-5xl mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">Últimos Movimientos</h2>
          <p className="text-gray-500 text-2xl font-bold">15 hoy</p>
        </div>

        {/* Gráfica (Placeholder) */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
          <FaChartBar className="text-purple-600 text-5xl mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">Gráfica de Movimientos</h2>
          <p className="text-gray-500">Próximamente...</p>
        </div>
      </div>

      {/* 🔹 Últimos Movimientos */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Últimos Movimientos</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex justify-between">
            <span className="text-gray-600">Ingreso - Impresora HP 123</span>
            <span className="text-gray-500">Hace 10 min</span>
          </li>
          <li className="py-3 flex justify-between">
            <span className="text-gray-600">Salida - Tóner Samsung</span>
            <span className="text-gray-500">Hace 30 min</span>
          </li>
          <li className="py-3 flex justify-between">
            <span className="text-gray-600">Ingreso - Impresora Epson</span>
            <span className="text-gray-500">Hace 1 hora</span>
          </li>
        </ul>
      </div>
      
    </div>
  );
}

export default Dashboard;
