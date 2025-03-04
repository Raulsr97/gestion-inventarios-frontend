import { toast } from 'react-toastify';
import * as XLSX from 'xlsx'
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
    proveedor: '',
    marca: '',
    flujo: '',
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
  // Eliminamos los tipos repetidos
  const tiposUnicos = [...new Set(impresoras.map((impresora) => impresora.tipo))]
  // Eliminamos los cliente repetidos
  const clientesUnicos = ['Sin cliente', ...new Set(impresoras.map((impresora) => impresora.cliente?.nombre).filter(Boolean))]
  // Eliminamos los proyectos repetidos
  const proyectosUnicos = ['Sin proyecto', ...new Set(impresoras.map((impresora) => impresora.proyecto?.nombre).filter(Boolean))]
  // Eliminamos los proveedores respetidos
  const proveedoresUnicos = ['Sin proveedor', ... new Set(impresoras.map(impresora => impresora.proveedor?.nombre).filter(Boolean))]
  // Eliminamos las marcas repetidas
  const marcasUnicas = ['Sin marca', ...new Set(impresoras.map((impresora) => impresora.marca?.nombre).filter(Boolean))]
  // Eliminamos los flujos repetidos
  const flujosUnicos = [...new Set(impresoras.map(impresora => impresora.flujo))]

  const exportarAExcel = (resultados) => {
    if (resultados.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }
  
    // Definir los encabezados de la tabla
    const encabezados = [
      ["Serie", "Modelo", "Estado", "Tipo", "Ubicación", "Cliente", "Proyecto", "Proveedor", "Marca", "Flujo", "Fecha de Entrada", "Fecha de Salida"]
    ];
  
    // Convertir los datos en formato adecuado para XLSX
    const datos = resultados.map((impresora) => [
      impresora.serie,
      impresora.modelo,
      impresora.estado,
      impresora.tipo,
      impresora.ubicacion,
      impresora.cliente?.nombre || "Sin cliente",
      impresora.proyecto?.nombre || "Sin proyecto",
      impresora.proveedor?.nombre || 'Sin proveedor',
      impresora.marca?.nombre || "Sin marca",
      impresora.flujo,
      impresora.fecha_entrada ? new Date(impresora.fecha_entrada).toLocaleDateString() : "No registrada",
      impresora.fecha_salida ? new Date(impresora.fecha_salida).toLocaleDateString() : "No registrada"
    ]);
  
    // Crear la hoja de trabajo (worksheet)
    const ws = XLSX.utils.aoa_to_sheet([...encabezados, ...datos]);
  
    // Aplicar estilos a los encabezados
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell_address]) continue;
      ws[cell_address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, // Texto blanco
        fill: { fgColor: { rgb: "4472C4" } }, // Azul oscuro
        alignment: { horizontal: "center" }
      };
    }
  
    // Crear el libro de Excel y agregar la hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Impresoras");
  
    // Descargar el archivo
    XLSX.writeFile(wb, "reporte_impresoras.xlsx");
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
              const resultadosFiltrados = impresoras.filter((impresora) => {
                  const fechaEntradaImpresora = impresora.fecha_entrada ? new Date(impresora.fecha_entrada).toISOString().split("T")[0] : null;

                  const fechaSalidaImpresora = impresora.fecha_salida ? new Date(impresora.fecha_salida).toISOString().split('T')[0] : null

                  return (
                    (!filtrosAplicados.serie || impresora.serie.includes(filtrosAplicados.serie)) &&
                    (!filtrosAplicados.modelo || impresora.modelo === filtrosAplicados.modelo) &&
                    (!filtrosAplicados.estado || impresora.estado === filtrosAplicados.estado) &&
                    (!filtrosAplicados.tipo || impresora.tipo === filtrosAplicados.tipo) && 
                    (!filtrosAplicados.cliente || (filtrosAplicados.cliente === 'Sin cliente' && !impresora.cliente) || impresora.cliente?.nombre === filtrosAplicados.cliente) &&
                    (!filtrosAplicados.proyecto || (filtrosAplicados.proyecto === 'Sin proyecto' && !impresora.proyecto) || impresora.proyecto?.nombre === filtrosAplicados.proyecto) && 
                    (!filtrosAplicados.proveedor || (filtrosAplicados.proveedor === 'Sin proveedor' && !impresora.proveedor) || impresora.proveedor?.nombre === filtrosAplicados.proveedor) &&
                    (!filtrosAplicados.marca || (filtrosAplicados.marca === 'Sin marca' && !impresora.marca) || impresora.marca?.nombre === filtrosAplicados.marca) &&
                    (!filtrosAplicados.flujo || impresora.flujo === filtrosAplicados.flujo) &&
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
              
              if(resultadosFiltrados.length === 0) {
                toast.warn('No se encontraron resultados con los filtros aplicados')
              } 

              setResultados(resultadosFiltrados)

              setFiltrosAplicados({
                serie: '',
                modelo: '',
                estado: '',
                tipo: '',
                cliente: '',
                proyecto: '',
                proveedor: '',
                marca: '',
                flujo: '',
                fechaEntradaInicio: '',
                fechaEntradaFin: '',
                fechaSalidaInicio: '',
                fechaSalidaFin: '',
                enAlmacen: ''
              })
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

             {/* Proveedor */}
             <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.proveedor || ''}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, proveedor: e.target.value})}
            >
              <option value="" disabled hidden>Proveedor</option>
              {proveedoresUnicos.map((proveedor) => (
                <option key={proveedor} value={proveedor}>
                  {proveedor}
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

            {/* Flujo */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.flujo}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, flujo: e.target.value})}
            >
              <option value="" disabled hidden>Flujo</option>
              {flujosUnicos.map((flujoUnico => (
                <option key={flujoUnico} value={flujoUnico}>
                  {flujoUnico}
                </option>
              )))}
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
                    <th className="border border-gray-300 p-2">Proveedor</th>
                    <th className="border border-gray-300 p-2">Marca</th>
                    <th className="border border-gray-300 p-2">Flujo</th>
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
                      <td className="border border-gray-300 p-2">{impresora.proveedor?.nombre || "Sin proveedor"}</td>
                      <td className="border border-gray-300 p-2">{impresora.marca?.nombre || "Sin marca"}</td>
                      <td className="border border-gray-300 p-2">{impresora.flujo}</td>
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
            {/* Botón para exportar a Excel */}
            <div className="col-span-full flex justify-center mt-3">
              <button
                type="button"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
                onClick={() => exportarAExcel(resultados)} // 🔥 Llama a la función directamente
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

export default ConsultaImpresoras;
