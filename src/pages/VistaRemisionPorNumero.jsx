import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function VistaRemisionPorNumero() {
  const { numero_remision } = useParams() // Obtenemos el numero desde la URL
  const [remision, setRemision] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch (`http://localhost:3000/api/remisiones/${numero_remision}`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró la remisión')
        return res.json()
      })
      .then(data => {
        setRemision(data)
        setCargando(false)
      })
      .catch(err => {
        console.error("❌ Error al cargar la remisión:", err)
        setError(true)
        setCargando(false)
      })
  }, [numero_remision])

  if (cargando) return <p>⏳ Cargando remisión...</p>
  if (error) return <p className="text-red-500">❌ No se pudo cargar la remisión.</p>

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
    {/* Encabezado */}
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <h2 className="text-2xl font-bold">Remisión de Entrega</h2>
      <p className="text-gray-500">Núm. {remision.numero_remision}</p>
    </div>

    {/* Datos del cliente/proyecto */}
    <div className="mb-4">
      <p><strong>Cliente:</strong> {remision.cliente?.nombre || "Sin cliente"}</p>
      {remision.proyecto?.nombre && (
        <p><strong>Proyecto:</strong> {remision.proyecto.nombre}</p>
      )}
    </div>

    {/* Campos del formulario */}
    <div className="mb-4">
      <p><strong>📌 Destinatario:</strong> {remision.destinatario}</p>
      <p><strong>📍 Dirección de entrega:</strong> {remision.direccion_entrega}</p>
      {remision.notas && <p><strong>📝 Notas:</strong> {remision.notas}</p>}
    </div>

    {/* Tabla de impresoras */}
    {Array.isArray(remision.impresoras) && remision.impresoras.length > 0 && (
      <table className="w-full border-collapse border border-gray-300 my-4">
        <thead>
          <tr className="bg-gray-200 text-sm">
            <th className="border p-2">Marca</th>
            <th className="border p-2">Modelo</th>
            <th className="border p-2">Serie</th>
            {remision.impresoras.some(i => Array.isArray(i.accesorios) && i.accesorios.length > 0) && (
              <th className="border p-2">Accesorios</th>
            )}
          </tr>
        </thead>
        <tbody>
          {remision.impresoras.map((impresora, index) => (
            <tr key={index} className="text-center border text-sm">
              <td className="border p-2">{impresora.marca?.nombre || "Marca desconocida"}</td>
              <td className="border p-2">{impresora.modelo}</td>
              <td className="border p-2">{impresora.serie}</td>
              {remision.impresoras.some(i => Array.isArray(i.accesorios) && i.accesorios.length > 0) && (
                <td className="border p-2">
                  {Array.isArray(impresora.accesorios)
                    ? impresora.accesorios.map(a => a.numero_parte).join(", ")
                    : ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )}

    {/* Sección de Firmas */}
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="border p-4 text-center">
        <p className="font-semibold">✍ Entregado por:</p>
        <p className="text-sm text-gray-500">(Nombre, Firma y Fecha)</p>
      </div>
      <div className="border p-4 text-center">
        <p className="font-semibold">📝 Recibido por:</p>
        <p className="text-sm text-gray-500">(Nombre, Firma y Fecha)</p>
      </div>
    </div>
  </div>

  )
}

export default VistaRemisionPorNumero