function RemisionIMME({ datos }) {
    const { numero_remision, fecha_emision, cliente, proyecto, destinatario, direccion_entrega, notas, series } = datos;
  
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white text-black text-sm">
        {/* Encabezado */}
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
  
        {/* Datos del cliente */}
        <div className="mb-4">
          <p><strong>Cliente:</strong> {cliente?.nombre || "---"}</p>
          {proyecto?.nombre && <p><strong>Proyecto:</strong> {proyecto.nombre}</p>}
        </div>
  
        {/* Tabla de productos */}
        <table className="w-full border-collapse border border-gray-500 text-sm">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border border-gray-500 p-1">Cant.</th>
              <th className="border border-gray-500 p-1">Modelo</th>
              <th className="border border-gray-500 p-1">Marca</th>
              <th className="border border-gray-500 p-1">N° de Serie</th>
              <th className="border border-gray-500 p-1">Accesorios</th>
            </tr>
          </thead>
          <tbody>
            {series.map((impresora, idx) => (
              <tr key={idx} className="text-center">
                <td className="border border-gray-500 p-1">1</td>
                <td className="border border-gray-500 p-1">{impresora.modelo}</td>
                <td className="border border-gray-500 p-1">{impresora.marca?.nombre || ""}</td>
                <td className="border border-gray-500 p-1">{impresora.serie}</td>
                <td className="border border-gray-500 p-1">
                  {Array.isArray(impresora.accesorios)
                    ? impresora.accesorios.map(a => a.numero_parte).join(", ")
                    : "---"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Sección de firmas */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="border border-gray-500 p-4 text-center">
            <p className="font-bold">Entregado por:</p>
            <p className="text-gray-500">(Nombre, Firma y Fecha)</p>
          </div>
          <div className="border border-gray-500 p-4 text-center">
            <p className="font-bold">Recibido por:</p>
            <p className="text-gray-500">(Nombre, Firma y Fecha)</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default RemisionIMME;
  