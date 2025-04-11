function RemisionColourKlub({ datos }) {
  if (!datos || !Array.isArray(datos.series)) return <p>❌ Datos incompletos</p>

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
    fechaVisual
  } = datos;

  const hayAccesorios = series.some(
    (impresora) => Array.isArray(impresora.accesorios) && impresora.accesorios.length
  );

  const totalPiezas = series.reduce((total, impresora) => {
    const accesorios = Array.isArray(impresora.accesorios) ? impresora.accesorios.length : 0;
    return total + 1 + accesorios;
  }, 0);

  return (
    <div className="bg-white text-black mx-auto p-6 w-[216mm] text-sm print:break-after-auto print:break-inside-auto">

      {/* 🟦 Encabezado */}
      <div className="flex items-start mb-4">
        <img src="/logos/colour_klub.png" alt="Logo Colour Klub" className="h-16 mr-4" />
        <div className="flex-1">
          <div className="h-2 w-full bg-[#324973] mb-1"></div>
          <div className="h-2 w-full bg-[#38659e]"></div>
        </div>
      </div>

      {/* 📅 Fecha y Remisión */}
      <div className="text-right mb-2">
        <p> {
          typeof window !== "undefined" && window.location.pathname.includes("generar-remision") ? (
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
          )
        }</p>
        <p><strong>Remisión No.:</strong> {numero_remision}</p>
      </div>

      {/* 🧾 Información del Cliente */}
      <div className="mb-8 mt-2 ml-8">
        <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
        {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
        <p><strong>Destino:</strong> {destinatario || "---"}</p>
        <p><strong>Dirección de entrega:</strong> {direccion_entrega || "---"}</p>
        {notas && <p><strong>Notas:</strong> {notas}</p>}
      </div>

      {/* 📋 Tabla de Series */}
      <table className="w-full border-collapse border border-gray-500 text-sm">
        <thead className="print:table-header-group">
          <tr className="bg-gray-200 text-center">
            <th className="border border-[#38659e] bg-[#38659e] p-1 text-white">Marca</th>
            <th className="border border-[#38659e] bg-[#38659e] p-1 text-white">Modelo</th>
            <th className="border border-[#38659e] bg-[#38659e] p-1 text-white">N° de Serie</th>
            {hayAccesorios && <th className="border border-[#38659e] bg-[#38659e] p-1 text-white">Accesorios</th>}
            <th className="border border-[#38659e] bg-[#38659e] p-1 text-white">Cant.</th>
          </tr>
        </thead>
        <tbody className="print:table-row-group">
          {series.map((impresora, idx) => (
            <tr key={idx} className="text-center print:break-inside-avoid">
              <td className="border border-gray-500 p-1">{impresora.marca?.nombre || ""}</td>
              <td className="border border-gray-500 p-1">{impresora.modelo}</td>
              <td className="border border-gray-500 p-1">{impresora.serie}</td>
              {hayAccesorios && (
                <td className="border border-gray-500 p-1">
                  {Array.isArray(impresora.accesorios)
                    ? impresora.accesorios.map(a => a.numero_parte).join(", ")
                    : "---"}
                </td>
              )}
              <td className="border border-gray-500 p-1">
                {1 + (Array.isArray(impresora.accesorios) ? impresora.accesorios.length : 0)}
              </td>
            </tr>
          ))}
          <tr className="font-semibold bg-[#f3f6f9]">
            <td colSpan={hayAccesorios ? 5 : 4} className="border border-[##38659e] p-1 pr-2 text-right">
              Total: {totalPiezas}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Firma: tabla alineada al centro, columnas iguales, sin bordes gruesos */}
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
  )
}

export default RemisionColourKlub;
