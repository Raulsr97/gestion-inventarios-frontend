import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

function ConsultaRefacciones() {
  const [stockAgrupado, setStockAgrupado] = useState([])
  const [busquedaParte, setBusquedaParte] = useState("")


  useEffect(() => {
    fetch("http://localhost:3000/api/refacciones/stock-agrupado")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Stock agrupado refacciones:", data);
        setStockAgrupado(data);
      })
      .catch((err) => {
        console.error("Error al obtener refacciones:", err);
        toast.error("Error al cargar el stock de refacciones");
      });
  }, []);

  const exportarAExcel = () => {
    if (stockAgrupado.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }

    const encabezados = [
      "NÚMERO DE PARTE",
      "TIPO",
      "MARCA",
      "PROVEEDOR",
      "CANTIDAD EN ALMACÉN",
    ];

    const rows = stockAgrupado.map((ref) => [
      ref.numero_parte,
      ref.tipo || "-",
      ref.marca?.nombre || "Sin marca",
      ref.proveedor?.nombre || "Sin proveedor",
      ref.cantidad_total,
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([encabezados, ...rows]);
    ws['!cols'] = encabezados.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, "Stock Refacciones");
    XLSX.writeFile(wb, "stock_refacciones.xlsx");
  };

  const resultadosFiltrados = stockAgrupado.filter((ref) => 
    ref.numero_parte.toLowerCase().includes(busquedaParte.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Consulta de Refacciones
          </h2>
          <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Buscar por número de parte"
            className="w-full max-w-md p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
            value={busquedaParte}
            onChange={(e) => setBusquedaParte(e.target.value)}
          />
          </div>


          <p className="text-gray-600 text-center mb-4">
            Total de refacciones en almacén:{" "}
            <span className="font-semibold text-blue-600">
              {stockAgrupado.reduce((total, r) => total + r.cantidad_total, 0)}
            </span>
          </p>


          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="border border-gray-300 p-2">Marca</th>
                  <th className="border border-gray-300 p-2">Número de Parte</th>
                  <th className="border border-gray-300 p-2">Tipo</th>
                  <th className="border border-gray-300 p-2">Proveedor</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {resultadosFiltrados.map((ref, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{ref.marca?.nombre || "Sin marca"}</td>
                    <td className="border border-gray-300 p-2">{ref.numero_parte}</td>
                    <td className="border border-gray-300 p-2">{ref.tipo || "-"}</td>
                    <td className="border border-gray-300 p-2">{ref.proveedor?.nombre || "Sin proveedor"}</td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">{ref.cantidad_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-full flex justify-center mt-6">
            <button
              type="button"
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
              onClick={exportarAExcel}
            >
              📥 Exportar a Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultaRefacciones;
