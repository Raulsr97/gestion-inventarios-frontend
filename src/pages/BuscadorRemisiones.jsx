import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiDownload } from 'react-icons/fi'


const BuscadorRemisiones = () => {
  const [busquedaNumero, setBusquedaNumero] = useState('')
  const [remisiones, setRemisiones] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [archivos, setArchivos] = useState({})
  const [paginaActual, setPaginaActual] = useState(1)

  const remisionesPorPagina = 15
  

  useEffect(() => {
    const obtenerRemisiones = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/remisiones-consulta")
        if (!response.ok) throw new Error("No se pudo obtener la lista de remisiones")

        const data = await response.json()
        setRemisiones(data)
        setCargando(false)
      } catch (error) {
        console.error("❌ Error al obtener remisiones:", error.message)
        toast.error("Error al cargar remisiones")
        setCargando(false)
      }
    }

    obtenerRemisiones()
  }, [])

  const buscarRemisionPorNumero = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/remisiones-consulta?numero_remision=${busquedaNumero}`)
      if (!response.ok) throw new Error('No se pudo buscar la remisión')

      const data = await response.json()
      setRemisiones(data)
      setPaginaActual(1)
    } catch (error) {
      console.error("❌ Error al buscar por número:", error.message);
      toast.error("No se encontró la remisión.");
    }
  }

  const descargarPDF = async (remision) => {
    const endpoint = remision.tipo === 'recoleccion'
      ? `http://localhost:3000/api/remisiones-recoleccion/generar-pdf/${remision.numero_remision}`
      : `http://localhost:3000/api/remisiones/generar-pdf/${remision.numero_remision}`
    
    try {
      const response = await fetch(endpoint)

      const contentType = response.headers.get('Content-Type')
      if (!response.ok || !contentType.includes("application/pdf")) {
        toast.error("No se pudo generar el PDF.")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `remision_${remision.numero_remision}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast.success("📄 PDF descargado correctamente")
    
    } catch (error) {
      console.error("❌ Error al descargar el PDF:", error.message)
      toast.error("Hubo un problema al descargar el PDF.")
    }
  
  }

  const cancelarRemision = async (remision) => {
    const confirmacion = window.confirm(`¿Estás seguro de cancelar la remisión ${remision.numero_remision}?`)

    if (!confirmacion) return

    const endpoint = remision.tipo === 'recoleccion'
    ? `http://localhost:3000/api/remisiones-recoleccion/${remision.numero_remision}/cancelar`
    : `http://localhost:3000/api/remisiones/${remision.numero_remision}/cancelar`

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_cancelacion: 'admin' })
      })

      if (!response.ok) throw new Error('Error al cancelar la remisión')

      toast.success('Remisión cancelada con éxito')

      // Actualizar lista de remisiones después de cancelar
      setRemisiones((prev) =>
        prev.map((r) =>
          r.numero_remision === remision.numero_remision
            ? { ...r, estado: 'Cancelada' }
            : r
        )
      )
    } catch (error) {
      console.error("❌ Error al cancelar:", error.message)
      toast.error("No se pudo cancelar la remisión.")
    }
  }

  const subirEvidencia = async (remision) => {
    const archivo = archivos[remision.numero_remision]
    if (!archivo) {
      toast.error("Selecciona un archivo para subir")
      return
    }

    const formData = new FormData()
    formData.append('archivo', archivo)

    const endpoint = remision.tipo === 'recoleccion'
    ? `http://localhost:3000/api/remisiones-recoleccion/${remision.numero_remision}/evidencia`
    : `http://localhost:3000/api/remisiones/${remision.numero_remision}/evidencia`

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      })

      if (!response.ok) throw new Error("No se pudo subir la evidencia")

      const data = await response.json()
      toast.success("✅ Evidencia subida correctamente")

      // Actualizar lista
      setRemisiones((prev) =>
        prev.map((r) =>
          r.numero_remision === remision.numero_remision ? { ...r, remision_firmada: data.remision.remision_firmada, estado: "Confirmada" } : r
        )
      )
      setArchivos(prev => ({ ...prev, [remision.numero_remision]: null }))
    } catch (error) {
      console.error("❌ Error al subir evidencia:", error.message)
      toast.error("Error al subir evidencia")
    }
  }

  const pendientes = remisiones?.filter(r => r.estado === 'Pendiente') || []

  const indiceUltima = paginaActual * remisionesPorPagina
  const indicePrimera = indiceUltima - remisionesPorPagina
  const remisionesActuales = remisiones?.slice(indicePrimera, indiceUltima)
  const totalPaginas = Array.isArray(remisiones)
  ? Math.ceil(remisiones.length / remisionesPorPagina)
  : 0

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Consulta de Remisiones</h2>
        <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
          🔴 Pendientes: {pendientes.length}
        </span>
      </div>
  
      <div className="mb-6 flex gap-2 shadow-sm p-4 bg-white rounded-lg items-center">
        <input
          type="text"
          value={busquedaNumero}
          onChange={(e) => setBusquedaNumero(e.target.value.toUpperCase())}
          placeholder="Buscar por número de remisión"
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={buscarRemisionPorNumero}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Buscar
        </button>
      </div>
  
      {!cargando && remisiones && remisiones.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-4 text-gray-700 text-lg">Resultados:</h3>
          <ul className="grid grid-cols-1 gap-4">
            {remisionesActuales.map((remision, index) => {
              const badgeColor = remision.estado === 'Pendiente'
                ? 'bg-blue-100 text-blue-800'
                : remision.estado === 'Confirmada'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800';
  
              return (
                <div key={index} className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><strong>Número:</strong> {remision.numero_remision}</p>
                      <p><strong>Tipo:</strong> <span className="capitalize">{remision.tipo}</span></p>
                      <p><strong>Empresa:</strong> {remision.empresa?.nombre}</p>
                      <p><strong>Fecha:</strong> {new Date(remision.fecha_emision).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                      {remision.estado}
                    </span>
                  </div>
  
                  {remision.estado === 'Pendiente' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => descargarPDF(remision)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex gap-1"
                      >
                        <FiDownload className="text-lg" />
                        Descargar PDF
                      </button>
  
                      <button
                        onClick={() => cancelarRemision(remision)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
  
  {remision.estado === 'Pendiente' && (
  <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3">
    <label className="bg-white text-gray-800 px-4 py-2 rounded border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 text-sm font-medium transition">
      📂 Elegir archivo
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          setArchivos(prev => ({
            ...prev,
            [remision.numero_remision]: e.target.files[0]
          }))
        }
        className="hidden"
      />
    </label>

    <span className="text-sm text-gray-600">
      {archivos[remision.numero_remision]?.name || 'Ningún archivo seleccionado'}
    </span>

    <button
      onClick={() => subirEvidencia(remision)}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
    >
       Subir evidencia
    </button>
  </div>
)}

  
                  {remision.estado === 'Confirmada' && remision.remision_firmada && (
                    <div className="mt-3">
                      <a
                        href={`http://localhost:3000/uploads/${remision.remision_firmada}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded"
                      >
                        Ver archivo firmado
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </ul>
        </div>
      )}
  
      {!cargando && remisiones?.length === 0 && (
        <p className="text-gray-600 mt-4 text-center">No se encontraron remisiones.</p>
      )}
  
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(totalPaginas)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPaginaActual(index + 1)}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-150 ${
                paginaActual === index + 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
  
  
  
  

  

  
};

export default BuscadorRemisiones;
