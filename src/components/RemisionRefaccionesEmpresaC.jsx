function RemisionRefaccionesEmpresaC({ datos }) {
    if (!datos || !Array.isArray(datos.series)) return <p>❌ Datos incompletos</p>;
  
    const {
      numero_remision,
      fecha_emision,
      cliente,
      proyecto,
      destinatario,
      direccion_entrega,
      notas,
      series,
      setFechaVisual,
      fechaVisual,
    } = datos;
  
    const totalPiezas = series.reduce((total, ref) => total + (ref.cantidad || 0), 0);
  
    return (
      <div className="bg-white text-black mx-auto p-6 w-[216mm] text-sm print:break-after-auto print:break-inside-auto">
        {/* 🟧 Encabezado */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left flex-1">
            <p className="mb-2">
              {typeof window !== "undefined" && window.location.pathname.includes("generar-remision") ? (
                <input
                  type="date"
                  value={fechaVisual}
                  onChange={(e) => setFechaVisual(e.target.value)}
                  className="border border-gray-300 rounded px-1 text-sm"
                />
              ) : (
                <span>
                  {fecha_emision
                    ? new Date(fecha_emision).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      })
                    : "---"}
                </span>
              )}
            </p>
            <p>{numero_remision}</p>
          </div>
          {/* Logo Genérico con Letra C */}
          <div className="flex items-center justify-center w-16 h-16 bg-[#ef4d31] text-white font-bold text-3xl rounded">
            C
          </div>
        </div>
  
        {/* 🧾 Información del Cliente */}
        <div className="mb-8 mt-4 ml-2">
          <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
          {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
          <p><strong>Destino:</strong> {destinatario || "---"}</p>
          <p><strong>Dirección de entrega:</strong> {direccion_entrega || "---"}</p>
          {notas && <p><strong>Notas:</strong> {notas}</p>}
        </div>
  
        {/* 📋 Tabla de Refacciones */}
        <table className="w-full border-collapse border border-gray-500 text-sm">
          <thead className="print:table-header-group">
            <tr className="text-center">
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Marca</th>
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Número de Parte</th>
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Cant.</th>
            </tr>
          </thead>
          <tbody className="print:table-row-group">
            {series.map((ref, idx) => (
              <tr key={idx} className="text-center print:break-inside-avoid">
                <td className="border border-gray-500 p-1">{ref.marca?.nombre || "---"}</td>
                <td className="border border-gray-500 p-1">{ref.numero_parte}</td>
                <td className="border border-gray-500 p-1">{ref.cantidad}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-[#f3f6f9] text-center">
              <td colSpan={2} className="border border-[#ef4d31] p-1 text-right">Total:</td>
              <td className="border border-[#ef4d31] p-1">{totalPiezas}</td>
            </tr>
          </tbody>
        </table>
  
        {/* 🖊️ Firmas */}
        <div className="mt-6 mx-auto w-[60%] text-sm">
          <table className="w-full border-collapse border border-gray-400">
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-3 font-semibold text-center w-1/2">Nombre de quien recibe</td>
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
    );
  }
  
  export default RemisionRefaccionesEmpresaC;
  