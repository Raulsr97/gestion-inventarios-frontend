import { useState } from "react";
import { toast } from "react-toastify";

const BuscadorRemisiones = () => {
  const [numero, setNumero] = useState('')
  const [remision, setRemision] = useState(null)
  const [error, setError] = useState('')
  const [archivo, setArchivo] = useState(null)

  const buscarRemision = async () => {
    try {
      setError('') // limpiar errores anteriores
      const response = await fetch(`http://localhost:3000/api/remisiones/${numero}`)

      if (!response.ok) {
        toast.error('No se encontro la remision')
      }

      const data = await response.json()
      console.log("✅ Remisión encontrada:", data);
      setRemision(data)
    } catch(error) {
      console.error("❌ Error al buscar la remisión:", error.message);
      setRemision(null);
      setError("No se encontró la remisión o hubo un error.");
    }
  }

  const descargarPDF = async () => {
    try {
      const fechaVisual = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })

      const response = await fetch(`http://localhost:3000/api/remisiones/generar-pdf/${remision.numero_remision}?fecha=${encodeURIComponent(fechaVisual)}`);

      const contentType = response.headers.get("Content-Type");
      if (!response.ok || !contentType.includes("application/pdf")) {
        console.error("⚠️ El PDF no se generó correctamente");
        toast.error("No se pudo generar el PDF.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `remision_${remision.numero_remision}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log("📄 PDF descargado correctamente");
    } catch (error) {
      console.error("❌ Error al descargar el PDF:", error.message);
      toast.error("No se pudo generar el PDF.");
    }
  } 

  const handleSubirEvidencia = async (e) => {
    e.preventDefault()

    if (!archivo) {
      toast.error('Selecciona un archivo primero')
      return
    }

    const formData = new FormData()
    formData.append('archivo', archivo)

    try {
      const response = await fetch(`http://localhost:3000/api/remisiones/${remision.numero_remision}/evidencia`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        toast.error("Error al subir la evidencia")
      }

      const data = await response.json()
      toast.success('Evidencia subida correctamente')

      setRemision(data.remision)
      setArchivo(null)
    } catch (error) {
      console.error(error);
      toast.error("No se pudo subir la evidencia");
    }
  }

  const handleCancelarRemision = async (e) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas cancelar esta remisión?")
    if (!confirmacion) return

    try {
      const response = await (fetch`http://localhost:3000/api/remisiones/${remision.numero_remision}/cancelar`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario_cancelacion: "admin" // 🛡️ Temporal
        })
      })

      if (!response.ok) {
        throw new Error("No se pudo cancelar la remisión.");
      }

      const data = await response.json();
      console.log("✅ Remisión cancelada:", data);
      toast.success("Remisión cancelada con éxito");

      // Recargar para reflejar los cambios
      window.location.reload();
    } catch (error) {
      console.error("❌ Error al cancelar la remisión:", error);
      alert("Hubo un problema al cancelar la remisión");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Consultar Remisión</h1>

      <div className="mb-4">
        <label htmlFor="remision" className="block text-sm font-medium text-gray-700">
          Número de remisión:
        </label>
        <input
          type="text"
          id="remision"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. R-00123"
        />
      </div>

      <button
        onClick={buscarRemision}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Buscar
      </button>

      {remision && (
        <div className="mt-6 p-4 border rounded-lg shadow bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Detalles de la Remisión</h2>

          <div className="space-y-2 text-sm text-gray-800">
            <p><strong>Número:</strong> {remision.numero_remision}</p>
            <p><strong>Empresa:</strong> {remision.empresa?.nombre}</p>
            <p><strong>Cliente:</strong> {remision.cliente?.nombre}</p>
            <p><strong>Proyecto:</strong> {remision.proyecto?.nombre}</p>
            <p><strong>Destinatario:</strong> {remision.destinatario}</p>
            <p><strong>Dirección de Entrega:</strong> {remision.direccion_entrega}</p>
            <p><strong>Estado:</strong> {remision.estado}</p>
            <p><strong>Fecha de emisión:</strong> {new Date(remision.fecha_emision).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {remision && remision.impresoras && remision.impresoras.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Impresoras</h3>
          <table className="w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border-b">Serie</th>
                <th className="p-2 border-b">Modelo</th>
                <th className="p-2 border-b">Marca</th>
                <th className="p-2 border-b">Accesorios</th>
              </tr>
            </thead>
            <tbody>
              {remision.impresoras.map((impresora, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{impresora.serie}</td>
                  <td className="p-2">{impresora.modelo}</td>
                  <td className="p-2">{impresora.marca?.nombre}</td>
                  <td className="p-2">
                    {impresora.accesorios?.length > 0
                      ? impresora.accesorios.map((a) => a.numero_parte).join(", ")
                      : "Sin accesorios"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {remision && (
        <div className="mt-6">
          <button
            onClick={descargarPDF}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Descargar PDF
          </button>
        </div>
      )}

      {remision && remision.estado === "Pendiente" && (
        <button
          onClick={handleCancelarRemision}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-4"
        >
          🛑 Cancelar Remisión
        </button>
      )}

      {remision && remision.estado === 'Pendiente' && (
        <form onSubmit={handleSubirEvidencia} className="mt-4 flex gap-2 items-center">
          <input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setArchivo(e.target.files[0])}
            className="border rounded px-2 py-1"
          />
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Subir Evidencia
          </button>
        </form>
      )}

      {remision && remision.remision_firmada && (
        <div className="mt-4">
          {console.log("🧾 Archivo de evidencia:", remision.remision_firmada)}
          <a 
            href={`http://localhost:3000/uploads/${remision.remision_firmada}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            📄 Ver Evidencia Subida
          </a>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default BuscadorRemisiones;
