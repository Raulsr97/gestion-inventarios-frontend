function RemisionIMMERecoleccion({ datos }) {
  if (!datos || !Array.isArray(datos.productos)) {
    return <p>❌ Datos incompletos</p>
  }

  const {
    numero_remision,
    fecha_emision,
    empresa,
    cliente,
    proyecto,
    destinatario,
    direccion_recoleccion,
    notas,
    productos,
    setFechaVisual,
    fechaVisual
  } = datos;

  const hayModelo = productos.some(p => p.modelo && p.modelo.trim() !== '')
  const haySerie = productos.some(p => p.serie && p.serie.trim() !== '')
  const hayNumeroParte = productos.some(p => p.numero_parte && p.numero_parte.trim() !== '')


  return (
    <div className="bg-white text-black mx-auto p-6 w-[216mm] text-sm print:break-after-auto print:break-inside-auto">

      {/* ✅ Encabezado */}
      <div className="mb-4">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <img src="/logos/imme.png" alt="Logo IMME" className="h-16" />
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold uppercase">Remisión de Recolección</h1>
          </div>
          <div className="text-right">
            <p><strong>No.:</strong> {numero_remision}</p>
            <p className="flex justify-end gap-1 items-end">
              {typeof window !== "undefined" && window.location.pathname.includes("recoleccion/vista-previa") ? (
                <input
                  type="date"
                  value={fechaVisual}
                  onChange={(e) => setFechaVisual(e.target.value)}
                  className="border border-gray-300 rounded px-1 text-sm mt-1"
                />
              ) : (
                <span>{
                  fecha_emision
                    ? new Date(fecha_emision).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC"
                      })
                    : "---"
                }</span>
              )}
            </p>
          </div>
        </div>

        {/* Cliente, proyecto y dirección */}
        <div className="mb-4">
          <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
          {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
        </div>

        <div className="mb-4 mt-4">
          <p><strong>Recolección en:</strong> {destinatario || "---"}</p>
          <p><strong>Dirección de recolección:</strong> {direccion_recoleccion || "---"}</p>
          {notas && <p><strong>Notas:</strong> {notas}</p>}
        </div>
      </div>

        {/* Tabla de productos recolectados */}
        <table className="w-full border-collapse border border-gray-500 text-sm">
            <thead className="print:table-header-group">
              <tr className="bg-gray-200 text-center">
                <th className="border border-[#14375A] bg-blue-400 p-1">Marca</th>
                {hayModelo && <th className="border border-[#14375A] bg-blue-400 p-1">Modelo</th>}
                {haySerie && <th className="border border-[#14375A] bg-blue-400 p-1">Serie</th>}
                {hayNumeroParte && <th className="border border-[#14375A] bg-blue-400 p-1">N° Parte</th>}
                <th className="border border-[#14375A] bg-blue-400 p-1">Observaciones</th>
                <th className="border border-[#14375A] bg-blue-400 p-1">Cantidad</th>
              </tr>
            </thead>

            <tbody className="print:table-row-group">
              {productos.map((producto, idx) => (
                <tr key={idx} className="text-center print:break-inside-avoid">
                  <td className="border border-gray-500 p-1">{producto.marca}</td>
                  {hayModelo && <td className="border border-gray-500 p-1">{producto.modelo || ''}</td>}
                  {haySerie && <td className="border border-gray-500 p-1">{producto.serie || ''}</td>}
                  {hayNumeroParte && <td className="border border-gray-500 p-1">{producto.numero_parte || ''}</td>}
                  <td className="border border-gray-500 p-1">{producto.observaciones || ''}</td>
                  <td className="border border-gray-500 p-1 font-semibold">{producto.cantidad}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-[#f3f6f9]">
                <td
                  colSpan={
                    2 + // Marca + Observaciones
                    (hayModelo ? 1 : 0) +
                    (haySerie ? 1 : 0) +
                    (hayNumeroParte ? 1 : 0)
                  }
                  className="border border-[#14375A] p-1 text-right"
                >
                  Total de piezas:
                </td>
                <td className="border border-[#14375A] p-1 text-center">
                  {productos.reduce((sum, p) => sum + (p.cantidad || 1), 0)}
                </td>
              </tr>
            </tbody>
          </table>

        {/* Sección de Firmas */}
        <div className="mt-6 break-inside-avoid page-break-inside-avoid print:break-inside-avoid">
          <div className="flex justify-between gap-4">
            <div className="w-1/2 border border-gray-500 p-4 pt-0">
              <p className="font-bold">Recolectado por:</p>
              <p className="text-gray-500 mb-14">(Nombre, Firma y Fecha)</p>
            </div>
            <div className="w-1/2 border border-gray-500 p-4 pt-0">
              <p className="font-bold">Entregado por:</p>
              <p className="text-gray-500 mb-14">(Nombre, Firma y Fecha)</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RemisionIMMERecoleccion;
