import { useState } from "react";
import { FaFilter, FaExchangeAlt } from "react-icons/fa";

function Movimientos() {
  const [filtroFecha, setFiltroFecha] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [movimientos, setMovimientos] = useState([
    { fecha: "2024-06-10", tipo: "Ingreso", producto: "Impresora HP 123", cantidad: 2 },
    { fecha: "2024-06-09", tipo: "Salida", producto: "Tóner Epson X200", cantidad: 1 },
    { fecha: "2024-06-08", tipo: "Ingreso", producto: "Impresora Canon 450", cantidad: 3 },
  ]);

  const handleFiltrar = () => {
    console.log(`Filtrando movimientos: Fecha=${filtroFecha}, Tipo=${tipoMovimiento}`);
    // Aquí iría la lógica de filtrado real con datos de la base de datos.
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Movimientos</h1>

      {/* 🔹 FILTROS 🔹 */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaFilter className="text-blue-600" /> Filtrar Movimientos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por Fecha */}
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="p-3 bg-gray-200 border rounded-md"
          />

          {/* Filtro por Tipo de Movimiento */}
          <select
            value={tipoMovimiento}
            onChange={(e) => setTipoMovimiento(e.target.value)}
            className="p-3 bg-gray-200 border rounded-md"
          >
            <option value="">Todos los movimientos</option>
            <option value="Ingreso">Ingresos</option>
            <option value="Salida">Salidas</option>
          </select>
        </div>

        <button
          onClick={handleFiltrar}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mt-4 w-full"
        >
          Aplicar Filtro
        </button>
      </div>

      {/* 🔹 LISTADO DE MOVIMIENTOS 🔹 */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex-1 overflow-y-auto max-h-[400px]">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaExchangeAlt className="text-gray-600" /> Historial de Movimientos
        </h2>

        {movimientos.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento, index) => (
                <tr key={index} className="border-t hover:bg-gray-100 transition">
                  <td className="p-3">{movimiento.fecha}</td>
                  <td
                    className={`p-3 font-semibold ${
                      movimiento.tipo === "Ingreso" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {movimiento.tipo}
                  </td>
                  <td className="p-3">{movimiento.producto}</td>
                  <td className="p-3">{movimiento.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No hay movimientos registrados.</p>
        )}
      </div>
    </div>
  );
}

export default Movimientos;
