import { toast } from 'react-toastify';
import Papa from 'papaparse'
import { useEffect, useState } from "react";
import CardStockGeneral from "../components/CardStockGeneral";
import CardMovimientosMes from "../components/CardMovimientos";
import CardStockProyectos from "../components/CardStockProyectos";
import CardStockClientes from "../components/CardStockClientes";

function ConsultaImpresoras() {
  // Guarda todas las impresoras obtenidas desde la API
  const [impresoras, setImpresoras] = useState([]);
  // Guarda las impresoras filtradas, las que coinciden con los filtros aplicados
  const [resultados, setResultados] = useState([]);
  
  // Estados para los filtros. Guarda los valores actuales de los filtros, permite que el usuario aplique filtros sin modificar la lista original de impresoras
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    serie: '',
    modelo: '',
    estado: '',
    tipo: '',
    cliente: '',
    proyecto: '',
    marca: '',
    fechaEntradaInicio: '',
    fechaEntradaFin: '',
    fechaSalidaInicio: '',
    fechaSalidaFin: '',
    enAlmacen: ''
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then((res) => res.json())
      .then((data) => setImpresoras(data))
      .catch((error) => console.error("Error al obtener impresoras:", error));
  }, []);

  // Me devuelve la cantidad(total) de resultados filtrados
  const totalResultados = resultados.length;
  // Eliminamos modelos repetidos con Set y convertimos de vuelta a un array
  const modelosUnicos = [...new Set(impresoras.map((impresora) => impresora.modelo))]
  // Eliminamos los estados repetidos
  const estadosUnicos = [...new Set(impresoras.map((impresora) => impresora.estado))]
  // Eliminamos los estados repetidos
  const tiposUnicos = [...new Set(impresoras.map((impresora) => impresora.tipo))]
  // Eliminamos los cliente repetidos
  const clientesUnicos = ['Sin cliente', ...new Set(impresoras.map((impresora) => impresora.cliente?.nombre).filter(Boolean))]
  // Eliminamos los proyectos repetidos
  const proyectosUnicos = ['Sin proyecto', ...new Set(impresoras.map((impresora) => impresora.proyecto?.nombre).filter(Boolean))]
  // Eliminamos las marcas repetidas
  const marcasUnicas = ['Sin marca', ...new Set(impresoras.map((impresora) => impresora.marca?.nombre).filter(Boolean))]

  const exportarAExcel = () => {
    if (resultados.length === 0) {
      toast.error('No hay datos para exportar.')
      return
    }

    // Covertimos los datos a formato csv
    const csv = Papa.unparse(
      resultados.map((impresora) => ({
        "Serie": impresora.serie,
        "Modelo": impresora.modelo,
        "Estado": impresora.estado,
        "Tipo": impresora.tipo,
        "Ubicación": impresora.ubicacion,
        "Cliente": impresora.cliente?.nombre || "Sin cliente",
        "Proyecto": impresora.proyecto?.nombre || "Sin proyecto",
        "Marca": impresora.marca?.nombre || "Sin marca",
        "Fecha de Entrada": impresora.fecha_entrada
          ? new Date(impresora.fecha_entrada).toLocaleDateString()
          : "No registrada",
        "Fecha de Salida": impresora.fecha_salida
          ? new Date(impresora.fecha_salida).toLocaleDateString()
          : "No registrada",
      }))
    )

    // blob(archivo descargable)
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'})

    // Enlace para la descarga
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'reporte_impresoras.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  
   
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <CardStockGeneral />
          <CardMovimientosMes />
          <CardStockProyectos />
          <CardStockClientes />
        </div>

        {/* 🔹 Formulario de Filtros */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Consulta</h2>

          <form 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            onSubmit={(e) => {
              // Evita el refresh de la pagina 
              e.preventDefault();
              // Aplica los filtros al conjunto de impresoras
              setResultados(
                impresoras.filter((impresora) => {
                  const fechaEntradaImpresora = impresora.fecha_entrada ? new Date(impresora.fecha_entrada).toISOString().split("T")[0] : null;

                  const fechaSalidaImpresora = impresora.fecha_salida ? new Date(impresora.fecha_salida).toISOString().split('T')[0] : null

                  return (
                    (!filtrosAplicados.serie || impresora.serie.includes(filtrosAplicados.serie)) &&
                    (!filtrosAplicados.modelo || impresora.modelo === filtrosAplicados.modelo) &&
                    (!filtrosAplicados.estado || impresora.estado === filtrosAplicados.estado) &&
                    (!filtrosAplicados.tipo || impresora.tipo === filtrosAplicados.tipo) && 
                    (!filtrosAplicados.cliente || (filtrosAplicados.cliente === 'Sin cliente' && !impresora.cliente) || impresora.cliente?.nombre === filtrosAplicados.cliente) &&
                    (!filtrosAplicados.proyecto || (filtrosAplicados.proyecto === 'Sin proyecto' && !impresora.proyecto) || impresora.proyecto?.nombre === filtrosAplicados.proyecto) && 
                    (!filtrosAplicados.marca || (filtrosAplicados.marca === 'Sin marca' && !impresora.marca) || impresora.marca?.nombre === filtrosAplicados.marca) &&
                    (!filtrosAplicados.fechaEntradaInicio || fechaEntradaImpresora >= filtrosAplicados.fechaEntradaInicio) &&
                    (!filtrosAplicados.fechaEntradaFin || fechaEntradaImpresora <= filtrosAplicados.fechaEntradaFin) &&
                    (!filtrosAplicados.fechaSalidaInicio || fechaSalidaImpresora >= filtrosAplicados.fechaSalidaInicio) &&
                    (!filtrosAplicados.fechaSalidaFin || fechaSalidaImpresora <= filtrosAplicados.fechaSalidaFin) &&
                    (filtrosAplicados.enAlmacen === '' || // Si el filtro esta vacio no aplica nada
                      (filtrosAplicados.enAlmacen === 'true' && !fechaSalidaImpresora) ||
                      (filtrosAplicados.enAlmacen === 'false' && fechaSalidaImpresora)
                    )
                  );
                })
              );
            }}
          >
            {/* Número de Serie */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Serie"
                className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
                value={filtrosAplicados.serie}
                onChange={(e) => setFiltrosAplicados({...filtrosAplicados, serie: e.target.value})}
              />
            </div>

            {/* Modelo */}
            <select
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
              value={filtrosAplicados.modelo}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, modelo: e.target.value})}
            >
              <option value="" disabled hidden>Modelo</option>
              {modelosUnicos.map((modeloUnico) => (
                <option key={modeloUnico} value={modeloUnico}>
                  {modeloUnico}
                </option>
              ))}
            </select>

            {/* Estado */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.estado}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, estado: e.target.value})}
            >
              <option value="" disabled hidden>Estado</option>
              {estadosUnicos.map((estadoUnico) => (
                <option key={estadoUnico} value={estadoUnico}>
                  {estadoUnico}
                </option>
              ))}
            </select>

            {/* Tipo */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.tipo}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, tipo: e.target.value})}
            >
              <option value="" disabled hidden>Tipo</option>
              {tiposUnicos.map((tipoUnico => (
                <option key={tipoUnico} value={tipoUnico}>
                  {tipoUnico}
                </option>
              )))}
            </select>

             {/* Cliente */}
             <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.cliente || ''}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, cliente: e.target.value})}
            >
              <option value="" disabled hidden>Cliente</option>
              {clientesUnicos.map((cliente) => (
                <option key={cliente} value={cliente}>
                  {cliente}
                </option>
              ))}
            </select>

            {/* Proyecto */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.proyecto || ''}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, proyecto: e.target.value})}
            >
              <option value="" disabled hidden>Proyecto</option>
              {proyectosUnicos.map((proyecto) => (
                <option key={proyecto} value={proyecto}>
                  {proyecto}
                </option>
              ))}
            </select>

            {/* Marca */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.marca || ''}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, marca: e.target.value})}
            >
              <option value="" disabled hidden>Marca</option>
              {marcasUnicas.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>

            {/* 📆 Grupo de Fecha de Entrada */}
            <div className="relative w-full md:w-auto flex flex-col">
              <span className="text-xs text-gray-600 text-center mb-1">Fecha de Entrada</span>
              <div className="grid grid-cols-2 gap-2">
                {/* Desde */}
                <input
                  type="date"
                  value={filtrosAplicados.fechaEntradaInicio}
                  onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaEntradaInicio: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
                />
                {/* Hasta */}
                <input
                  type="date"
                  value={filtrosAplicados.fechaEntradaFin}
                  onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaEntradaFin: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            {/* 📆 Grupo de Fecha de Salida */}
            <div className="relative w-full md:w-auto flex flex-col">
              <span className="text-xs text-gray-600 text-center mb-1">Fecha de Salida</span>
              <div className="grid grid-cols-2 gap-2">
                {/* Desde */}
                <input
                  type="date"
                  value={filtrosAplicados.fechaSalidaInicio}
                  onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaSalidaInicio: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
                />
                {/* Hasta */}
                <input
                  type="date"
                  value={filtrosAplicados.fechaSalidaFin}
                  onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, fechaSalidaFin: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            <select
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
              value={filtrosAplicados.enAlmacen}
              onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, enAlmacen: e.target.value })}
            >
              <option value="" disabled hidden>Filtrar por ubicación</option>
              <option value="true">En Almacén</option>
              <option value="false">Fuera del Almacén</option>
            </select>


            {/* Botón Generar Reporte */}
            <div className="col-span-full flex justify-center mt-3">
              <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
              >
                Generar Consulta
              </button>
            </div>
          </form>
          {/* Botón para exportar a Excel - FUERA del formulario */}
          <div className="col-span-full flex justify-center mt-3">
            <button
              type="button"
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
              onClick={exportarAExcel} // 🔥 Llama a la función directamente
            >
              📥 Exportar a Excel
            </button>
          </div>
        </div>

        {/* 🔹 Resultados */}
        {resultados.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Resultados de la consulta</h2>

            {/* 🔹 Mostrar total de resultados */}
            <p className="text-gray-600 text-center mb-4">
              Total de resultados: <span className="font-semibold text-blue-600">{totalResultados}</span>
            </p>

            {/* 🔹 Tabla con resultados */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="border border-gray-300 p-2">Serie</th>
                    <th className="border border-gray-300 p-2">Modelo</th>
                    <th className="border border-gray-300 p-2">Estado</th>
                    <th className="border border-gray-300 p-2">Tipo</th>
                    <th className="border border-gray-300 p-2">Ubicación</th>
                    <th className="border border-gray-300 p-2">Cliente</th>
                    <th className="border border-gray-300 p-2">Proyecto</th>
                    <th className="border border-gray-300 p-2">Marca</th>
                    <th className="border border-gray-300 p-2">Fecha de Entrada</th>
                    <th className="border border-gray-300 p-2">Fecha de Salida</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((impresora, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">{impresora.serie}</td>
                      <td className="border border-gray-300 p-2">{impresora.modelo}</td>
                      <td className="border border-gray-300 p-2">{impresora.estado}</td>
                      <td className="border border-gray-300 p-2">{impresora.tipo}</td>
                      <td className="border border-gray-300 p-2">{impresora.ubicacion}</td>
                      <td className="border border-gray-300 p-2">{impresora.cliente?.nombre || "Sin cliente"}</td>
                      <td className="border border-gray-300 p-2">{impresora.proyecto?.nombre || "Sin proyecto"}</td>
                      <td className="border border-gray-300 p-2">{impresora.marca?.nombre || "Sin marca"}</td>
                      <td className="border border-gray-300 p-2">
                        {impresora.fecha_entrada ? new Date(impresora.fecha_entrada).toLocaleDateString() : "No registrada"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {impresora.fecha_salida ? new Date(impresora.fecha_salida).toLocaleDateString() : "No registrada"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultaImpresoras;
