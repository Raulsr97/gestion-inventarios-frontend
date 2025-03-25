function RemisionIMME({ datos }) {
    if (!datos || !Array.isArray(datos.series)) return <p>❌ Datos incompletos</p>

    const { numero_remision, fecha_emision, cliente, proyecto, destinatario, direccion_entrega, notas, series } = datos;

    const hayAccesorios = series.some(
      (impresora) => Array.isArray(impresora.accesorios) && impresora.accesorios.length 
    )

    const totalPiezas = series.reduce((total, impresora) => {
      const accesorios = Array.isArray(impresora.accesorios) ? impresora.accesorios.length : 0
      return total + 1 + accesorios
    }, 0)
  
    return (
      <div className="bg-white text-black mx-auto p-6 w-[216mm] text-sm print:break-after-auto print:break-inside-auto">
    
        {/* ✅ Encabezado: evitar que se corte */}
        <div className="mb-4">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <img src="/logos/imme.png" alt="Logo IMME" className="h-16" />
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold uppercase">Remisión de Entrega</h1>
            </div>
            <div className="text-right">
              <p><strong>No.:</strong> {numero_remision}</p>
              <p><strong>Fecha:</strong> {new Date(fecha_emision).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
            {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
          </div>
      
          <div className="mb-4 mt-4">
            <p><strong>Destinatario:</strong> {destinatario || "---"}</p>
            <p><strong>Dirección de entrega:</strong> {direccion_entrega || "---"}</p>
            {notas && <p><strong>Notas:</strong> {notas}</p>}
          </div>
        </div>
    
        
    
        {/* Tabla */}
        <table className="w-full border-collapse border border-gray-500 text-sm">
          <thead className="print:table-header-group">
            <tr className="bg-gray-200 text-center">
              <th className="border border-[#14375A] bg-blue-400 p-1">Marca</th>
              <th className="border border-[#14375A] bg-blue-400 p-1">Modelo</th>
              <th className="border border-[#14375A] bg-blue-400 p-1">N° de Serie</th>
              {hayAccesorios && <th className="border border-[#14375A] bg-blue-400 p-1">Accesorios</th>}
              <th className="border border-[#14375A] bg-blue-400 p-1">Cant.</th>
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
              <td colSpan={hayAccesorios ? 5 : 4} className="border border-[#14375A] p-1 pr-2 text-right">
                Total: {totalPiezas}
              </td>
            </tr>
          </tbody>
        </table>
    
        {/* ✅ Firmas  */}
        <div className="mt-6 break-inside-avoid page-break-inside-avoid print:break-inside-avoid">
          <div className="flex justify-between gap-4">
            <div className="w-1/2 border border-gray-500 p-4 pt-0">
              <p className="font-bold">Entregado por:</p>
              <p className="text-gray-500">(Nombre, Firma y Fecha)</p>
            </div>
            <div className="w-1/2 border border-gray-500 p-4 pt-0">
              <p className="font-bold">Recibido por:</p>
              <p className="text-gray-500 mb-14">(Nombre, Firma y Fecha)</p>
            </div>
          </div>
        </div>

      </div>
    )
    
}
  
export default RemisionIMME;
  