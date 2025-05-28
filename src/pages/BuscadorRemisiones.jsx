import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiDownload } from 'react-icons/fi'
import { useSearchParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL

const BuscadorRemisiones = () => {
  // Estado para manejar la búsqueda y las remisiones cargadas
  const [busquedaNumero, setBusquedaNumero] = useState('')
  const [remisiones, setRemisiones] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [archivos, setArchivos] = useState({})
  const [paginaActual, setPaginaActual] = useState(1)
  const [nuevasFechas, setNuevasFechas] = useState({})
  
  // Parámetro de búsqueda desde la URL (si se proporciona)
  const [searchParams] = useSearchParams()
  const numeroRemisionUrl = searchParams.get('numero_remision')
  
  // Configuración de paginación
  const remisionesPorPagina = 15
  
  // Cargar las remisiones al iniciar
  useEffect(() => {
    obtenerRemisiones()
  }, [])

  // Función para obtener todas las remisiones del backend
  const obtenerRemisiones = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/remisiones-consulta`)
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

   // Buscar una remisión específica por número
  const buscarRemisionPorNumero = async (numeroParam) => {
    const numero = numeroParam || busquedaNumero

    if (!numero) {
      obtenerRemisiones()
      return
    } 

    try {
      const response = await fetch(`${backendUrl}/api/remisiones-consulta?numero_remision=${numero}`)
      if (!response.ok) throw new Error('No se pudo buscar la remisión')

      const data = await response.json()
      setRemisiones(data)
      console.log("🔍 Remisiones después de buscar:", data)
      setPaginaActual(1)
    } catch (error) {
      console.error("❌ Error al buscar por número:", error.message);
      toast.error("No se encontró la remisión.");
    }
  }

  // Detectar búsqueda desde la URL y ejecutar automáticamente
  useEffect(() => {
    if (numeroRemisionUrl) {
      setBusquedaNumero(numeroRemisionUrl)
      buscarRemisionPorNumero(numeroRemisionUrl)
    }
  }, [numeroRemisionUrl])
  
  const descargarPDF = async (remision) => {
    const endpoint = remision.tipo === 'recoleccion'
      ? `${backendUrl}/api/remisiones-recoleccion/generar-pdf/${remision.numero_remision}`
      : `${backendUrl}/api/remisiones/generar-pdf/${remision.numero_remision}`
    
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

    let endpoint = ''

    if (remision.tipo === 'recoleccion') {
      endpoint = `${backendUrl}/api/remisiones-recoleccion/${remision.numero_remision}/cancelar`
    } else {
      // tipo entrega
      switch (remision.categoria) {
        case 'toner':
          endpoint = `${backendUrl}/api/remisiones-toner/${remision.numero_remision}/cancelar`;
          break;
        case 'unidad_imagen':
          endpoint = `${backendUrl}/api/remisiones-unidad-imagen/${remision.numero_remision}/cancelar`;
          break;
        case 'refaccion':
          endpoint = `${backendUrl}/api/remisiones-refaccion/${remision.numero_remision}/cancelar`;
          break;
        default:
          endpoint = `${backendUrl}/api/remisiones/${remision.numero_remision}/cancelar`; // impresora
      }
    }

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

    let endpoint = ""

    if (remision.tipo === "recoleccion") {
      endpoint = `${backendUrl}/api/remisiones-recoleccion/${remision.numero_remision}/evidencia`
    } else {
      switch (remision.categoria) {
        case "toner":
          endpoint = `${backendUrl}/api/remisiones-toner/${remision.numero_remision}/evidencia`
          break;
        case "unidad_imagen":
          endpoint = `${backendUrl}/api/remisiones-unidad-imagen/${remision.numero_remision}/evidencia`
          break;
        case "refaccion":
          endpoint = `${backendUrl}/api/remisiones-refaccion/${remision.numero_remision}/evidencia`
          break;
        default:
          endpoint = `${backendUrl}/api/remisiones/${remision.numero_remision}/evidencia` // impresora
      }
    }


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

  const cambiarFechaProgramada = async (remision) => {
    const nuevaFecha = nuevasFechas[remision.numero_remision]

    if (!nuevaFecha) {
      toast.error("Selecciona una fecha válida.");
      return;
    }

    try {
      let endpoint = ""

      if (remision.tipo === "recoleccion") {
        endpoint = `${backendUrl}/api/remisiones-recoleccion/${remision.numero_remision}/fecha-programada`
      } else {
        switch (remision.categoria) {
          case "toner":
            endpoint = `${backendUrl}/api/remisiones-toner/${remision.numero_remision}/fecha-programada`
            break;
          case "unidad_imagen":
            endpoint = `${backendUrl}/api/remisiones-unidad-imagen/${remision.numero_remision}/fecha-programada`
            break;
          case "refaccion":
            endpoint = `${backendUrl}/api/remisiones-refaccion/${remision.numero_remision}/fecha-programada`
            break;
          default:
            endpoint = `${backendUrl}/api/remisiones/${remision.numero_remision}/fecha-programada` // impresora
        }
      }

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevaFecha }),
      })

      if (!res.ok) throw new Error("No se pudo modificar la fecha.")

      const data = await res.json();
      toast.success("Fecha actualizada correctamente.")

      // Refrescar la lista de remisiones con la fecha nueva:
      setRemisiones((prev) =>
        prev.map((r) =>
          r.numero_remision === remision.numero_remision
            ? { ...r, fecha_programada: nuevaFecha }
            : r
        )
      )
    } catch (error) {
      console.error("❌ Error al actualizar fecha:", error.message);
      toast.error("Error al actualizar la fecha.");
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
          onClick={() => buscarRemisionPorNumero()}
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
            <div className="flex justify-between items-start">
              {/* Información de la remisión */}
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Número:</strong> {remision.numero_remision}</p>
                <p><strong>Tipo:</strong> <span className="capitalize">{remision.tipo}</span></p>
                <p><strong>Empresa:</strong> {remision.empresa?.nombre}</p>
                <p><strong>Fecha emisión:</strong> {new Date(remision.fecha_emision).toLocaleDateString()}</p>
                <p><strong>Fecha programada:</strong> {
                  remision.fecha_programada?.slice(0, 10).split('-').reverse().join('/')
                }</p>
              </div>

              {/* Estado */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                {remision.estado}
              </span>
            </div>

            {/* Sección de acciones para PENDIENTE */}
            {remision.estado === 'Pendiente' && (
              <div className="mt-4 flex flex-col md:flex-row md:justify-between gap-4">
                {/* Botones de acción */}
                <div className="flex flex-col gap-2 md:items-start">
                  <button
                    onClick={() => descargarPDF(remision)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FiDownload className="text-lg" />
                    Descargar PDF
                  </button>

                  <div className="flex gap-2 items-left">
                    <input
                      type="date"
                      value={nuevasFechas[remision.numero_remision] || ''}
                      onChange={(e) =>
                        setNuevasFechas(prev => ({
                          ...prev,
                          [remision.numero_remision]: e.target.value
                        }))
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm text-gray-700"
                    />
                    <button
                      onClick={() => cambiarFechaProgramada(remision)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cambiar fecha
                    </button>
                  </div>

                  
                </div>

                {/* Archivo y fecha */}
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 w-full">
                    {/* Botón elegir archivo y nombre del archivo */}
                    <div className="flex items-center gap-2">
                      <label className="bg-white text-gray-800 px-4 py-2 rounded border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 text-sm font-medium transition whitespace-nowrap">
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

                      {archivos[remision.numero_remision] && (
                        <span className="text-sm text-gray-600 truncate max-w-[180px]">
                          {archivos[remision.numero_remision].name}
                        </span>
                      )}
                    </div>

                  {/* Botón subir */}
                  <button
                    onClick={() => subirEvidencia(remision)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Subir evidencia
                  </button>
                  </div>


                  <button
                    onClick={() => cancelarRemision(remision)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Confirmada */}
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
