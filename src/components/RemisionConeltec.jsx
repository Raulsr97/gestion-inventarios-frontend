function RemisionConeltec({ datos }) {
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
      setFechaVisual
    } = datos;
  
    const formatearFechaLarga = (fecha) => {
      const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', opciones);
    };
  
    const hayAccesorios = series.some(
      (impresora) => Array.isArray(impresora.accesorios) && impresora.accesorios.length
    );
  
    const totalPiezas = series.reduce((total, impresora) => {
      const accesorios = Array.isArray(impresora.accesorios) ? impresora.accesorios.length : 0;
      return total + 1 + accesorios;
    }, 0);
  
    return (
      <div className="bg-white text-black mx-auto p-6 w-[216mm] text-sm print:break-after-auto print:break-inside-auto">
        {/* 🟧 Encabezado */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left flex-1">
            <p className="mb-2">
              {typeof window !== "undefined" && window.location.pathname.includes("generar-remision") ? (
                <input
                  type="date"
                  value={fecha_emision}
                  onChange={(e) => setFechaVisual(e.target.value)}
                  className="border border-gray-300 rounded px-1 text-sm"
                />
              ) : formatearFechaLarga(fecha_emision)}
            </p>
            <p>{numero_remision}</p>
          </div>
          <img src="/logos/coneltec.png" alt="Logo Coneltec" className="h-20" />
        </div>
  
        {/* 🧾 Información del Cliente */}
        <div className="mb-8 mt-4 ml-2">
          <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
          {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
          <p><strong>Destino:</strong> {destinatario || "---"}</p>
          <p><strong>Dirección de entrega:</strong> {direccion_entrega || "---"}</p>
          {notas && <p><strong>Notas:</strong> {notas}</p>}
        </div>
  
        {/* 📋 Tabla de Series */}
        <table className="w-full border-collapse border border-gray-500 text-sm">
          <thead className="print:table-header-group">
            <tr className="text-center">
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Marca</th>
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Modelo</th>
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">N° de Serie</th>
              {hayAccesorios && <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Accesorios</th>}
              <th className="border border-[#ef4d31] bg-[#ef4d31] p-1 text-white">Cant.</th>
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
              <td colSpan={hayAccesorios ? 5 : 4} className="border border-[#ef4d31] p-1 pr-2 text-right">
                Total: {totalPiezas}
              </td>
            </tr>
          </tbody>
        </table>
  
        {/* Firma: tabla alineada al centro, columnas iguales */}
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
  
  export default RemisionConeltec;
  