import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import CardStockGeneralUnidadesImg from "../components/CardStockGeneralUnidadesImg";
import CardMovimientosMesUnidadesImg from "../components/CardMovimientosUnidadesImg";
import CardEnTransitoUnidadesImg from "../components/CardEnTransitoUnidadesImg";
import CardEntregadosMesUnidadesImg from "../components/CardEntregadoMesUnidadesImg";

function ConsultaUnidadesImagen() {
  const [unidades, setUnidades] = useState([]);
  const [resultados, setResultados] = useState([]);

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    serie: "",
    modelo: "",
    tipo: "",
    cliente: "",
    proyecto: "",
    proveedor: "",
    marca: "",
    fechaEntradaInicio: "",
    fechaEntradaFin: "",
    fechaSalidaInicio: "",
    fechaSalidaFin: "",
    ubicacion: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/unidades-imagen")
      .then((res) => res.json())
      .then((data) => {
        setUnidades(data);
      })
      .catch((error) => {
        console.error("❌ Error al obtener unidades de imagen:", error.message);
      });
  }, []);

  const exportarAExcel = (datos) => {
    if (datos.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }

    const encabezados = [
      "SERIE", "MODELO", "TIPO", "UBICACIÓN", "CLIENTE", "PROYECTO", "PROVEEDOR", "MARCA",
      "FECHA DE ENTRADA", "FECHA DE SALIDA", "FECHA DE ENTREGA", "REMISIÓN"
    ];

    const rows = datos.map((unidad) => [
      unidad.serie,
      unidad.modelo,
      unidad.tipo,
      unidad.ubicacion,
      unidad.cliente?.nombre || "SIN CLIENTE",
      unidad.proyecto?.nombre || "SIN PROYECTO",
      unidad.proveedor?.nombre || "SIN PROVEEDOR",
      unidad.marca?.nombre || "SIN MARCA",
      unidad.fecha_entrada ? new Date(unidad.fecha_entrada).toLocaleDateString() : "NO REGISTRADA",
      unidad.fecha_salida ? new Date(unidad.fecha_salida).toLocaleDateString() : "NO REGISTRADA",
      unidad.fecha_entrega_final ? new Date(unidad.fecha_entrega_final).toLocaleDateString() : "NO REGISTRADA",
      unidad.numero_remision || "-"
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([encabezados, ...rows]);
    ws['!cols'] = encabezados.map(() => ({ wch: 20 }));
    const rango = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: encabezados.length - 1 } });
    ws['!autofilter'] = { ref: rango };
    XLSX.utils.book_append_sheet(wb, ws, "REPORTE UNIDADES IMG");
    XLSX.writeFile(wb, "reporte_unidades_img.xlsx");
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();
    const filtrados = unidades.filter((t) => {
      const entrada = t.fecha_entrada ? new Date(t.fecha_entrada).toISOString().split("T")[0] : null;
      const salida = t.fecha_salida ? new Date(t.fecha_salida).toISOString().split("T")[0] : null;

      return (
        (!filtrosAplicados.serie || t.serie.includes(filtrosAplicados.serie)) &&
        (!filtrosAplicados.modelo || t.modelo === filtrosAplicados.modelo) &&
        (!filtrosAplicados.tipo || t.tipo === filtrosAplicados.tipo) &&
        (!filtrosAplicados.cliente || t.cliente?.nombre === filtrosAplicados.cliente) &&
        (!filtrosAplicados.proyecto || t.proyecto?.nombre === filtrosAplicados.proyecto) &&
        (!filtrosAplicados.proveedor || t.proveedor?.nombre === filtrosAplicados.proveedor) &&
        (!filtrosAplicados.marca || t.marca?.nombre === filtrosAplicados.marca) &&
        (!filtrosAplicados.ubicacion || t.ubicacion === filtrosAplicados.ubicacion) &&
        (!filtrosAplicados.fechaEntradaInicio || entrada >= filtrosAplicados.fechaEntradaInicio) &&
        (!filtrosAplicados.fechaEntradaFin || entrada <= filtrosAplicados.fechaEntradaFin) &&
        (!filtrosAplicados.fechaSalidaInicio || salida >= filtrosAplicados.fechaSalidaInicio) &&
        (!filtrosAplicados.fechaSalidaFin || salida <= filtrosAplicados.fechaSalidaFin)
      );
    });

    if (filtrados.length === 0) toast.warn("No se encontraron resultados");
    setResultados(filtrados);

    setFiltrosAplicados({
      serie: "",
      modelo: "",
      tipo: "",
      cliente: "",
      proyecto: "",
      proveedor: "",
      marca: "",
      fechaEntradaInicio: "",
      fechaEntradaFin: "",
      fechaSalidaInicio: "",
      fechaSalidaFin: "",
      ubicacion: "",
    });
  };

  const modelosUnicos = [...new Set(unidades.map((t) => t.modelo))];
  const tiposUnicos = [...new Set(unidades.map((t) => t.tipo))];
  const clientesUnicos = [...new Set(unidades.map((t) => t.cliente?.nombre).filter(Boolean))];
  const proyectosUnicos = [...new Set(unidades.map((t) => t.proyecto?.nombre).filter(Boolean))];
  const proveedoresUnicos = [...new Set(unidades.map((t) => t.proveedor?.nombre).filter(Boolean))];
  const marcasUnicas = [...new Set(unidades.map((t) => t.marca?.nombre).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <CardStockGeneralUnidadesImg />
          <CardMovimientosMesUnidadesImg />
          <CardEnTransitoUnidadesImg />
          <CardEntregadosMesUnidadesImg />
        </div>
  
        {/* 🔹 Formulario de Filtros */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Consulta</h2>
  
          <form
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            onSubmit={aplicarFiltros}
          >
            <input type="text" placeholder="Serie" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.serie} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, serie: e.target.value })} />
            
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.modelo} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, modelo: e.target.value })}>
              <option value="">Modelo</option>
              {modelosUnicos.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
  
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.tipo} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, tipo: e.target.value })}>
              <option value="">Tipo</option>
              {tiposUnicos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
  
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.cliente} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, cliente: e.target.value })}>
              <option value="">Cliente</option>
              {clientesUnicos.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
  
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.proyecto} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, proyecto: e.target.value })}>
              <option value="">Proyecto</option>
              {proyectosUnicos.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
  
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.proveedor} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, proveedor: e.target.value })}>
              <option value="">Proveedor</option>
              {proveedoresUnicos.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
  
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.marca} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, marca: e.target.value })}>
              <option value="">Marca</option>
              {marcasUnicas.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
  
            {/* 📆 Fecha de Entrada */}
            <div className="relative w-full flex flex-col">
              <span className="text-xs text-gray-600 text-center mb-1">Fecha de Entrada</span>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.fechaEntradaInicio} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaEntradaInicio: e.target.value })} />
                <input type="date" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.fechaEntradaFin} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaEntradaFin: e.target.value })} />
              </div>
            </div>
  
            {/* 📆 Fecha de Salida */}
            <div className="relative w-full flex flex-col">
              <span className="text-xs text-gray-600 text-center mb-1">Fecha de Salida</span>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.fechaSalidaInicio} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaSalidaInicio: e.target.value })} />
                <input type="date" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.fechaSalidaFin} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaSalidaFin: e.target.value })} />
              </div>
            </div>
  
            <select className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" value={filtrosAplicados.ubicacion} onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, ubicacion: e.target.value })}>
              <option value="">Ubicación</option>
              <option value="Almacen">Almacén</option>
              <option value="Entregado">Entregado</option>
              <option value="En Tránsito">En Tránsito</option>
            </select>
  
            {/* Botón */}
            <div className="col-span-full flex justify-center mt-3">
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition">
                Generar Consulta
              </button>
            </div>
          </form>
        </div>
  
        {/* Resultados */}
        {resultados.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Resultados de la consulta</h2>
            <p className="text-gray-600 text-center mb-4">
              Total de resultados: <span className="font-semibold text-blue-600">{resultados.length}</span>
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="border border-gray-300 p-2">Serie</th>
                    <th className="border border-gray-300 p-2">Modelo</th>
                    <th className="border border-gray-300 p-2">Tipo</th>
                    <th className="border border-gray-300 p-2">Ubicación</th>
                    <th className="border border-gray-300 p-2">Cliente</th>
                    <th className="border border-gray-300 p-2">Proyecto</th>
                    <th className="border border-gray-300 p-2">Proveedor</th>
                    <th className="border border-gray-300 p-2">Marca</th>
                    <th className="border border-gray-300 p-2">Entrada</th>
                    <th className="border border-gray-300 p-2">Salida</th>
                    <th className="border border-gray-300 p-2">Entrega</th>
                    <th className="border border-gray-300 p-2">Remisión</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">{t.serie}</td>
                      <td className="border border-gray-300 p-2">{t.modelo}</td>
                      <td className="border border-gray-300 p-2">{t.tipo}</td>
                      <td className="border border-gray-300 p-2">{t.ubicacion}</td>
                      <td className="border border-gray-300 p-2">{t.cliente?.nombre || "Sin cliente"}</td>
                      <td className="border border-gray-300 p-2">{t.proyecto?.nombre || "Sin proyecto"}</td>
                      <td className="border border-gray-300 p-2">{t.proveedor?.nombre || "Sin proveedor"}</td>
                      <td className="border border-gray-300 p-2">{t.marca?.nombre || "Sin marca"}</td>
                      <td className="border border-gray-300 p-2">{t.fecha_entrada ? new Date(t.fecha_entrada).toLocaleDateString() : "No registrada"}</td>
                      <td className="border border-gray-300 p-2">
                        {t.fecha_salida
                          ? new Date(new Date(t.fecha_salida).setDate(new Date(t.fecha_salida).getDate() + 1)).toLocaleDateString()
                          : "No registrada"
                        }
                      </td>
                      <td className="border border-gray-300 p-2">{t.fecha_entrega_final ? new Date(t.fecha_entrega_final).toLocaleDateString() : "No registrada"}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {["Entregado", "En Tránsito"].includes(t.ubicacion) &&
                        t.relacion_unidadesimg?.[0]?.remision?.numero_remision ? (
                          <a
                            href={`/remisiones/buscar?numero_remision=${t.relacion_unidadesimg[0].remision.numero_remision}`}
                            className="text-blue-600 hover:underline"
                          >
                            {t.relacion_unidadesimg[0].remision.numero_remision}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            <div className="col-span-full flex justify-center mt-3">
              <button
                type="button"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
                onClick={() => exportarAExcel(resultados)}
              >
                📥 Exportar a Excel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default ConsultaUnidadesImagen;
