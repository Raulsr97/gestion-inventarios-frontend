import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RemisionEmpresaARecoleccion from "../components/RemisionEmpresaARecoleccion";
import RemisionEmpresaBRecoleccion from '../components/RemisionEmpresaBRecoleccion'
import RemisionEmpresaCRecoleccion from "../components/RemisionEmpresaCRecoleccion";



function VistaPreviaRemisionRecoleccion () {
  const location = useLocation()
  const navigate = useNavigate()
  const datosRemision = location.state

  const [destinatario, setDestinatario] = useState(datosRemision?.destinatario || "")
  const [direccionRecoleccion, setDireccionRecoleccion] = useState(datosRemision?.direccion_recoleccion || "")
  const [notas, setNotas] = useState(datosRemision?.notas || "") 

  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [empresas, setEmpresas] = useState([])


  // Estado para la fecha de entrega
  const getLocalDay = () => {
    const hoy = new Date()
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()) // Ajuste a la zona horaria
    return hoy.toISOString().split('T')[0]
  }

  const [fechaVisual, setFechaVisual] = useState(getLocalDay()) 

  useEffect(() => {
    fetch("http://localhost:3000/api/clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
  
    fetch("http://localhost:3000/api/proyectos")
      .then(res => res.json())
      .then(data => setProyectos(data))

    fetch("http://localhost:3000/api/empresas")
    .then(res => res.json())
    .then(setEmpresas)
  }, [])

  useEffect(() => {
    console.log("📄 Datos recibidos para la vista previa:", datosRemision)
  }, [datosRemision])

  // Validación rápida
  if (!datosRemision) {
    return <p className="text-red-500">❌ No hay datos disponibles para la remisión.</p>
  }

  const remisionParaVista = {
    numero_remision: "REM-PREVIEW",
    fecha_emision: fechaVisual,
    empresa: datosRemision.empresa,
    cliente: datosRemision.cliente,
    proyecto: datosRemision.proyecto,
    destinatario,
    direccion_recoleccion: direccionRecoleccion,
    notas,
    productos: datosRemision.productos,
    setFechaVisual,
    fechaVisual
  }

  const confirmarRemision = async () => {
    try {
      // Armar el payload
      const datosParaEnviar = {
        numero_remision: `RC-${Date.now()}`, // Generador temporal
        empresa_id: datosRemision.empresa.id,
        cliente_id: datosRemision.cliente?.id || null,
        proyecto_id: datosRemision.proyecto?.id || null,
        destinatario,
        direccion_recoleccion: direccionRecoleccion,
        notas: notas.trim() || null,
        productos: datosRemision.productos,
        fecha_programada: fechaVisual,
        usuario_creador: "admin" // ⚠️ Esto es temporal
      }

      console.log("📤 Enviando datos al backend:", datosParaEnviar)

      const response = await fetch("http://localhost:3000/api/remisiones-recoleccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar)
      })

      if (!response.ok) throw new Error("❌ Error al guardar la remisión.")

      const remisionGuardada = await response.json()
      toast.success("✅ Remisión registrada correctamente.")

      // 🔹 Generar PDF
      const pdfRes = await fetch(`http://localhost:3000/api/remisiones-recoleccion/generar-pdf/${remisionGuardada.numero_remision}?fecha=${fechaVisual}`)

      if (!pdfRes.ok || !pdfRes.headers.get("Content-Type")?.includes("pdf")) {
        throw new Error("❌ No se pudo generar el PDF.")
      }
  
      const pdfBlob = await pdfRes.blob()
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `remision_${remisionGuardada.numero_remision}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast.info("📄 PDF descargado. Redirigiendo...")
      setTimeout(() => {
        navigate("/remisiones/recoleccion")
      }, 2000)
  
    } catch (error) {
      console.error("⚠️ Error al confirmar la remisión:", error)
      toast.error(error.message || "Ocurrió un error al guardar la remisión.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Contenedor de remisión: sin fondo blanco aquí */}
      <div className="flex justify-center">
      {Number(datosRemision.empresa?.id) === 1 && (
       <RemisionEmpresaARecoleccion datos={remisionParaVista} />
      )}
      {Number(datosRemision.empresa?.id) === 2 && (
        <RemisionEmpresaBRecoleccion datos={remisionParaVista} />
      )}
      {Number(datosRemision.empresa?.id) === 3 && (
        <RemisionEmpresaCRecoleccion datos={remisionParaVista} />
      )}
      </div>
      
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => navigate("/remisiones/recoleccion", { state: datosRemision })}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          🔄 Modificar
        </button>

        <button
          onClick={confirmarRemision}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          ✅ Confirmar
        </button>
      </div>

    </div>
  )
}

export default VistaPreviaRemisionRecoleccion
