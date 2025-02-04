import { useState } from "react";
import { FaSearch, FaBoxOpen } from "react-icons/fa";

function ConsultaProductos() {
  const [criterio, setCriterio] = useState("");
  const [valor, setValor] = useState("");
  const [resultados, setResultados] = useState([]);

  const handleBuscar = () => {
    console.log(`Buscando por ${criterio}: ${valor}`);
    // Aquí iría la lógica para hacer la consulta a la base de datos.

    // Simulamos resultados
    setResultados([
      { modelo: "HP 123", tipo: "Impresora", serie: "ABC123", estado: "Disponible" },
      { modelo: "Samsung X200", tipo: "Toner", serie: "XYZ987", estado: "En uso" },
    ]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Consultar Productos</h1>

      {/* 🔹 Filtros de búsqueda */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-600" /> Buscar Producto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={criterio}
            onChange={(e) => setCriterio(e.target.value)}
            className="p-3 bg-gray-200 border rounded-md"
          >
            <option value="">Selecciona un criterio</option>
            <option value="modelo">Por Modelo</option>
            <option value="serie">Por Número de Serie</option>
            <option value="disponibles">Productos Disponibles</option>
          </select>

          <input
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="p-3 bg-gray-200 border rounded-md"
            placeholder="Ingresa el valor de búsqueda"
            disabled={!criterio}
          />
        </div>

        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mt-4 w-full"
          disabled={!criterio || !valor}
        >
          Buscar
        </button>
      </div>

      {/* 🔹 Resultados de la consulta */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaBoxOpen className="text-gray-600" /> Resultados
        </h2>

        {resultados.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Modelo</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Serie</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((producto, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{producto.modelo}</td>
                  <td className="p-3">{producto.tipo}</td>
                  <td className="p-3">{producto.serie}</td>
                  <td className="p-3">{producto.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}

export default ConsultaProductos;
