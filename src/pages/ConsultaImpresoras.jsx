import { toast } from 'react-toastify';
import * as XLSX from 'xlsx'
import { useEffect, useState } from "react";
import CardStockGeneral from "../components/CardStockGeneral";
import CardMovimientosMes from "../components/CardMovimientos";
import CardStockProyectos from "../components/CardStockProyectos";
import CardStockPorTipo from '../components/CardStockPorTipo';

function ConsultaImpresoras() {
  // Guarda todas las impresoras obtenidas desde la API
  const [impresoras, setImpresoras] = useState([]);
  // Guarda las impresoras filtradas, las que coinciden con los filtros aplicados
  const [resultados, setResultados] = useState([]);
  const [ accesoriosDisponibles, setAccesoriosDisponibles ] = useState([])
  const [ accesorioSeleccionado, setAccesorioSeleccionado ] = useState('')
  
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
    origenRecoleccion: '',
    ubicacion: ''
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then((res) => res.json())
      .then((data) => {
        console.log("📌 Impresoras obtenidas:", data);
        setImpresoras(data);
      })
      .catch((error) => console.error("Error al obtener impresoras:", error))

    fetch('http://localhost:3000/api/accesorios')
      .then(res => res.json())
      .then((data) => {
        console.log("📌 Accesorios obtenidos:", data);
        setAccesoriosDisponibles(data);
      })
      .catch((error) => console.error("Error al obtener impresoras:", error))
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
  const flujosUnicos = [...new Set(impresoras.map(impresora => impresora.flujo).filter(Boolean))]
  // Eliminamos los origenes de recoleccion repetidos
  const origenesRecolecccionUnicos = [...new Set(impresoras.map(impresora => impresora.origen_recoleccion).filter(Boolean))]

  const exportarAExcel = (resultados) => {
    if (resultados.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }
  
    const encabezados = [
      "SERIE", "MODELO", "ESTADO", "TIPO", "UBICACIÓN", "CLIENTE", "PROYECTO", "PROVEEDOR", "MARCA",
      "FLUJO", "ORIGEN RECOLECCIÓN", "ACCESORIOS", "FECHA DE ENTRADA", "FECHA DE SALIDA", "FECHA DE ENTREGA"
    ];
  
    const datos = resultados.map((impresora) => [
      impresora.serie,
      impresora.modelo,
      impresora.estado,
      impresora.tipo,
      impresora.ubicacion,
      impresora.cliente?.nombre || "SIN CLIENTE",
      impresora.proyecto?.nombre || "SIN PROYECTO",
      impresora.proveedor?.nombre || "SIN PROVEEDOR",
      impresora.marca?.nombre || "SIN MARCA",
      impresora.flujo || "NO APLICA",
      impresora.origen_recoleccion || "NO APLICA",
      impresora.accesorios?.map(a => a.numero_parte).join(", ") || "SIN ACCESORIOS",
      impresora.fecha_entrada ? new Date(impresora.fecha_entrada).toLocaleDateString() : "NO REGISTRADA",
      impresora.fecha_salida ? new Date(impresora.fecha_salida).toLocaleDateString() : "NO REGISTRADA",
      impresora.fecha_entrega_final ? new Date(impresora.fecha_entrega_final).toLocaleDateString() : "NO REGISTRADA"
    ]);
  
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
  
    // Agregamos encabezados con formato negritas
    XLSX.utils.sheet_add_aoa(ws, [encabezados], { origin: "A1" });
  
    encabezados.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellRef]) return;
      ws[cellRef].s = {
        font: { bold: true }, // 🔥 Negrita
      };
    });
  
    // Agregamos los datos después de los encabezados
    XLSX.utils.sheet_add_aoa(ws, datos, { origin: "A2" });
  
    // Ajustar el ancho de columnas
    ws['!cols'] = encabezados.map(() => ({ wch: 20 }));
  
    // Activar autofiltro
    const rango = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: datos.length, c: encabezados.length - 1 }
    });
    ws['!autofilter'] = { ref: rango };
  
    // Finalizar
    XLSX.utils.book_append_sheet(wb, ws, "REPORTE DE IMPRESORAS");
    XLSX.writeFile(wb, "reporte_impresoras.xlsx");
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <CardStockGeneral />
          <CardMovimientosMes />
          <CardStockProyectos />
          <CardStockPorTipo />
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
                    (!filtrosAplicados.origenRecoleccion || impresora.origen_recoleccion === filtrosAplicados.origenRecoleccion) &&
                    (!accesorioSeleccionado || (impresora.accesorios && impresora.accesorios.some(accesorio => accesorio.numero_parte === accesorioSeleccionado))) &&
                    (!filtrosAplicados.fechaEntradaInicio || fechaEntradaImpresora >= filtrosAplicados.fechaEntradaInicio) &&
                    (!filtrosAplicados.fechaEntradaFin || fechaEntradaImpresora <= filtrosAplicados.fechaEntradaFin) &&
                    (!filtrosAplicados.fechaSalidaInicio || fechaSalidaImpresora >= filtrosAplicados.fechaSalidaInicio) &&
                    (!filtrosAplicados.fechaSalidaFin || fechaSalidaImpresora <= filtrosAplicados.fechaSalidaFin) &&
                    (!filtrosAplicados.ubicacion || impresora.ubicacion === filtrosAplicados.ubicacion)
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
                accesorios: '',
                fechaEntradaInicio: '',
                fechaEntradaFin: '',
                fechaSalidaInicio: '',
                fechaSalidaFin: '',
                enAlmacen: '',
                origenRecoleccion: '',
                ubicacion: ''
              })

              setAccesorioSeleccionado('')
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

            {/* Origen Recoleccion */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none" 
              value={filtrosAplicados.origenRecoleccion}
              onChange={(e) => setFiltrosAplicados({...filtrosAplicados, origenRecoleccion: e.target.value})}
            >
              <option value="" disabled hidden>Origen Recolección</option>
              {origenesRecolecccionUnicos.map((origenUnico => (
                <option key={origenUnico} value={origenUnico}>
                  {origenUnico}
                </option>
              )))}
            </select>

            {/* Accesorios seleccionados */}
            <select 
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"  
              value={accesorioSeleccionado}
              onChange={e => setAccesorioSeleccionado(e.target.value)} 
            >
              <option value="" disabled hidden>Accesorios</option>
              {accesoriosDisponibles.map((accesorio) => (
                <option key={accesorio.numero_parte} value={accesorio.numero_parte}>
                  {accesorio.numero_parte}
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
              value={filtrosAplicados.ubicacion}
              onChange={(e) => setFiltrosAplicados({ ...filtrosAplicados, ubicacion: e.target.value })}
            >
              <option value="" disabled hidden>Ubicación</option>
              <option value="Almacen">Almacén</option>
              <option value="Entregado">Entregado</option>
              <option value="En Tránsito">En Tránsito</option>
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
                    <th className="border border-gray-300 p-2">Origen Recolección</th>
                    <th className="border border-gray-300 p-2">Accesorios</th>
                    <th className="border border-gray-300 p-2">Fecha de Entrada</th>
                    <th className="border border-gray-300 p-2">Fecha de Salida</th>
                    <th className="border border-gray-300 p-2">Fecha de Entrega</th>
                    <th className="border border-gray-300 p-2">Remisión</th>

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
                      <td className="border border-gray-300 p-2">{impresora.flujo ? impresora.flujo: 'No Aplica'}</td>
                      <td className="border border-gray-300 p-2">{impresora.origen_recoleccion ? impresora.origen_recoleccion: 'No Aplica'}</td>
                      <td className="border border-gray-300 p-2">
                        {impresora.accesorios?.length > 0 
                          ? impresora.accesorios.map(acc => acc.numero_parte).join(', ') 
                          : "Sin accesorios"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {impresora.fecha_entrada ? new Date(impresora.fecha_entrada).toLocaleDateString() : "No registrada"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {impresora.fecha_salida ? new Date(impresora.fecha_salida).toLocaleDateString("es-MX", {
                          timeZone: "UTC"
                        }) : "No registrada"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {impresora.fecha_entrega_final ? new Date(impresora.fecha_entrega_final).toLocaleDateString("es-MX", {
                          timeZone: "UTC"
                        }) : "No registrada"}
                      </td>

                      <td className="border border-gray-300 p-2 text-center">
                        {['Entregado', 'En Tránsito'].includes(impresora.ubicacion) &&
                        impresora.relacion_impresoras?.[0]?.remision?.numero_remision ? (
                          <a
                            href={`/remisiones/buscar?numero_remision=${impresora.relacion_impresoras[0].remision.numero_remision}`}
                            className="text-blue-600 hover:underline"
                          >
                            {impresora.relacion_impresoras[0].remision.numero_remision}
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
