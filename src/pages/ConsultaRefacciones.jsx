import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom';


function ConsultaRefacciones() {
  const [mesSeleccionadoSalidas, setMesSeleccionadoSalidas] = useState(() => {
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}`; // ej: "2025-04"
  });

  const [mesSeleccionadoEntradas, setMesSeleccionadoEntradas] = useState(() => {
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}`;
  });
  
  const [mesesDisponiblesEntradas, setMesesDisponiblesEntradas] = useState([]);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [stockAgrupado, setStockAgrupado] = useState([])
  const [busquedaParte, setBusquedaParte] = useState("")
  const [historialEntradas, setHistorialEntradas] = useState([])
  const [salidasRefacciones, setSalidasRefacciones] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3000/api/refacciones/historial-entradas?mes=${mesSeleccionadoEntradas}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📅 Historial entradas agrupadas:", data);
        setHistorialEntradas(data);
      })
      .catch((err) => {
        console.error("Error al obtener historial:", err);
        toast.error("Error al cargar historial de entradas");
      });
  }, [mesSeleccionadoEntradas]);
  

  useEffect(() => {
    fetch(`http://localhost:3000/api/refacciones/historial-salidas?mes=${mesSeleccionadoSalidas}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📤 Historial de salidas agrupadas:", data);
        setSalidasRefacciones(data);
      })
      .catch((err) => {
        console.error("Error al obtener historial de salidas:", err);
        toast.error("Error al cargar historial de salidas");
      });
  }, [mesSeleccionadoSalidas]);
  
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
      fetch("http://localhost:3000/api/refacciones/historial-entradas/meses")
      .then(res => res.json())
      .then((data) => {
        console.log("📅 Meses disponibles entradas:", data);
        setMesesDisponiblesEntradas(data);
      })
      .catch((err) => {
        console.error("Error al obtener meses disponibles:", err);
        toast.error("Error al cargar los meses de entradas");
      });
    
      fetch("http://localhost:3000/api/refacciones/historial-salidas/meses")
      .then(res => res.json())
      .then((data) => {
        console.log("📅 Meses disponibles:", data);
        setMesesDisponibles(data);
      })
      .catch((err) => {
        console.error("Error al obtener meses disponibles:", err);
        toast.error("Error al cargar los meses disponibles");
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

  const exportarEntradasAExcel = () => {
    if (historialEntradas.length === 0) {
      toast.error("No hay entradas para exportar.");
      return;
    }
  
    const encabezados = [
      "FECHA",
      "TIPO",
      "NÚMERO DE PARTE",
      "MARCA",
      "PROVEEDOR / PROYECTO",
      "CANTIDAD"
    ];
  
    const rows = historialEntradas.map((entrada) => [
      entrada.fecha,
      entrada.tipo,
      entrada.numero_parte,
      entrada.marca?.nombre || "Sin marca",
      entrada.origenNombre,
      entrada.cantidad
    ]);
  
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([encabezados, ...rows]);
    ws['!cols'] = encabezados.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, "Entradas del Mes");
    XLSX.writeFile(wb, "entradas_refacciones.xlsx");
  };
  
  const exportarSalidasAExcel = () => {
    if (salidasRefacciones.length === 0) {
      toast.error("No hay salidas para exportar.");
      return;
    }
  
    const encabezados = [
      "FECHA",
      "TIPO",
      "NÚMERO DE PARTE",
      "MARCA",
      "PROYECTO / PROVEEDOR",
      "REMISIÓN",
      "CANTIDAD"
    ];
  
    const rows = salidasRefacciones.map((salida) => [
      salida.fecha,
      salida.tipo,
      salida.numero_parte,
      salida.marca?.nombre || "Sin marca",
      salida.origenNombre,
      salida.numero_remision,
      salida.cantidad
    ]);
  
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([encabezados, ...rows]);
    ws['!cols'] = encabezados.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, "Salidas del Mes");
    XLSX.writeFile(wb, "salidas_refacciones.xlsx");
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
                  <th className="border border-gray-300 p-2">Proyecto</th>
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
                    <td className="border border-gray-300 p-2">{ref.proyecto?.nombre || "---"}</td>
                    <td className="border border-gray-300 p-2">{ref.proveedor?.nombre || "---"}</td>
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

        <div className="bg-white shadow-md rounded-lg p-6 mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Historial de Entradas del Mes
          </h3>

          <div className="flex justify-center mb-4">
            <select
              className="p-2 border border-gray-300 rounded text-sm"
              value={mesSeleccionadoEntradas}
              onChange={(e) => setMesSeleccionadoEntradas(e.target.value)}
            >
              {Array.isArray(mesesDisponiblesEntradas) && mesesDisponiblesEntradas.map((mes) => {
                const [year, month] = mes.split('-');
                const nombreMes = new Date(`${mes}-01`).toLocaleString('es-MX', { month: 'long' });
                return (
                  <option key={mes} value={mes}>
                    {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} {year}
                  </option>
                );
              })}
            </select>
          </div>


          <p className="text-gray-600 text-center mb-4">
            Total de refacciones ingresadas este mes:{" "}
            <span className="font-semibold text-blue-600">
              {historialEntradas.reduce((total, r) => total + r.cantidad, 0)}
            </span>
          </p>


          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="border border-gray-300 p-2">Fecha</th>
                  <th className="border border-gray-300 p-2">Tipo</th>
                  <th className="border border-gray-300 p-2">Número de Parte</th>
                  <th className="border border-gray-300 p-2">Marca</th>
                  <th className="border border-gray-300 p-2">Proveedor/Proyecto</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {historialEntradas.map((entrada, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{entrada.fecha}</td>
                    <td className="border border-gray-300 p-2">{entrada.tipo}</td>
                    <td className="border border-gray-300 p-2">{entrada.numero_parte}</td>
                    <td className="border border-gray-300 p-2">{entrada.marca?.nombre || "Sin marca"}</td>
                    <td className="border border-gray-300 p-2">{entrada.origenNombre}</td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">{entrada.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="col-span-full flex justify-center mt-4">
              <button
                type="button"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
                onClick={exportarEntradasAExcel}
              >
                📥 Exportar Entradas a Excel
              </button>
            </div>

          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Historial de Salidas del Mes
          </h3>

          <div className="flex justify-center mb-4">
            <select
              className="p-2 border border-gray-300 rounded text-sm"
              value={mesSeleccionadoSalidas}
              onChange={(e) => setMesSeleccionadoSalidas(e.target.value)}
            >
              {Array.isArray(mesesDisponibles) && mesesDisponibles.map((mes) => {
                const [year, month] = mes.split('-');
                const nombreMes = new Date(`${mes}-01`).toLocaleString('es-MX', { month: 'long' });
                return (
                  <option key={mes} value={mes}>
                    {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} {year}
                  </option>
                );
              })}
            </select>
          </div>


          <p className="text-gray-600 text-center mb-4">
            Total de refacciones salidas este mes:{" "}
            <span className="font-semibold text-blue-600">
              {salidasRefacciones.reduce((total, r) => total + r.cantidad, 0)}
            </span>
          </p>


          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="border border-gray-300 p-2">Fecha</th>
                  <th className="border border-gray-300 p-2">Tipo</th>
                  <th className="border border-gray-300 p-2">Número de Parte</th>
                  <th className="border border-gray-300 p-2">Marca</th>
                  <th className="border border-gray-300 p-2">Proveedor/Proyecto</th>
                  <th className="border border-gray-300 p-2">Remisión</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(salidasRefacciones) && salidasRefacciones.map((salida, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{salida.fecha}</td>
                    <td className="border border-gray-300 p-2">{salida.tipo}</td>
                    <td className="border border-gray-300 p-2">{salida.numero_parte}</td>
                    <td className="border border-gray-300 p-2">{salida.marca?.nombre || "Sin marca"}</td>
                    <td className="border border-gray-300 p-2">{salida.origenNombre}</td>
                    <td className="border border-gray-300 p-2">
                    <Link
                      to={`/remisiones/buscar?numero_remision=${salida.numero_remision}`}
                      className="text-blue-600 hover:underline"
                    >
                      {salida.numero_remision}
                    </Link>


                    </td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">{salida.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="col-span-full flex justify-center mt-4">
              <button
                type="button"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
                onClick={exportarSalidasAExcel}
              >
                📥 Exportar Salidas a Excel
              </button>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
}

export default ConsultaRefacciones;
