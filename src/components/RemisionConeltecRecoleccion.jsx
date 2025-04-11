function RemisionConeltecRecoleccion ({ datos }) {
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
        {/* 🟧 Encabezado */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left flex-1">
            <p className="mb-2">
              {typeof window !== "undefined" && window.location.pathname.includes("recoleccion/vista-previa") ? (
                <input
                  type="date"
                  value={fechaVisual}
                  onChange={(e) => setFechaVisual(e.target.value)}
                  className="border border-gray-300 rounded px-1 text-sm"
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
            <p>{numero_remision}</p>
          </div>
          <img src="/logos/coneltec.png" alt="Logo Coneltec" className="h-20" />
        </div>
  
        {/* 🧾 Información del Cliente */}
        <div className="mb-8 mt-4 ml-2">
          <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
          {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
          <p><strong>Recolección en:</strong> {destinatario || "---"}</p>
          <p><strong>Dirección de Recolección:</strong> {direccion_recoleccion|| "---"}</p>
          {notas && <p><strong>Notas:</strong> {notas}</p>}
        </div>
  
        {/* 📋 Tabla de Series */}
        <table className="w-full border-collapse border border-gray-500 text-sm">
            <thead className="print:table-header-group">
              <tr className="bg-gray-200 text-center">
                <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Marca</th>
                {hayModelo && <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Modelo</th>}
                {haySerie && <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Serie</th>}
                {hayNumeroParte && <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">N° Parte</th>}
                <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Observaciones</th>
                <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Cantidad</th>
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
                  className="border border-b-gray-400 p-1 text-right"
                >
                  Total de piezas:
                </td>
                <td className="border border-b-gray-400 p-1 text-center">
                  {productos.reduce((sum, p) => sum + (p.cantidad || 1), 0)}
                </td>
              </tr>
            </tbody>
          </table>
  
        {/* Firma: tabla alineada al centro, columnas iguales */}
        <div className="mt-6 mx-auto w-[60%] text-sm">
          <table className="w-full border-collapse border border-gray-400">
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-3 font-semibold text-center w-1/2">Nombre de quien entrega</td>
                <td className="border border-gray-400 px-4 py-3 w-1/2"></td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3 font-semibold text-center">Firma</td>
                <td className="border border-gray-400 px-4 py-3"></td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3 font-semibold text-center">Fecha</td>
                <td className="border border-gray-400 px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
}

export default RemisionConeltecRecoleccion

