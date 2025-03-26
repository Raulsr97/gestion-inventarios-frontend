import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RemisionIMME from "../components/RemisionIMME";


function VistaPreviaRemisionEntrega() {
  const location = useLocation()
  const navigate = useNavigate()
  const datosRemision = location.state // Recibimos los datos de la navegacion

  // Estados para realizar la edicion solo en los campos del formulario
  const [destinatario, setDestinatario] = useState(datosRemision?.destinatario || "");
  const [direccionEntrega, setDireccionEntrega] = useState(datosRemision?.direccionEntrega || "");
  const [notas, setNotas] = useState(datosRemision?.notas || ""); 

  // Estado para almacenar las marcas
  const [marcas, setMarcas] = useState([])

  // Estado para almacenar los clientes
  const [clientes, setClientes] = useState([])

  // Estado para la fecha de entrega
  const [fechaVisual, setFechaVisual] = useState(new Date().toISOString().split('T')[0]) // formato YYYY-MM-DD

  useEffect(() => {
    localStorage.setItem('fecha_programada', fechaVisual)
  }, [fechaVisual])


  useEffect(() => {
    fetch("http://localhost:3000/api/marcas")
      .then(res => res.json())
      .then(data => setMarcas(data))
      .catch(error => console.error("Error al obtener las marcas", error))

      fetch("http://localhost:3000/api/clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(error => console.error("Error al obtener los clientes", error))
  }, [])


  const clienteObjeto = clientes.find(c => c.id === Number(datosRemision.cliente))

  const remisionParaVista = {
    numero_remision: "REM-PREVIEW",
    fecha_emision: fechaVisual,
    cliente: clienteObjeto,
    proyecto: datosRemision.proyecto !== 'Sin Proyecto' ? { nombre: datosRemision.proyecto } : null,
    destinatario,
    direccion_entrega: direccionEntrega,
    notas,
    series: datosRemision.series,
    setFechaVisual
  }

  // Logos de cada empresa
  const logosEmpresas = {
    1: '/logos/imme.png',
    2: '/logos/colour_klub.png',
    3: '/logos/coneltec.png'
  }

  // Obtener el logo correcto segun la empresa seleccionada
  // const logoEmpresa = logosEmpresas[datosRemision.empresa]

  console.log("📄 Datos de la remisión recibidos:", datosRemision);

  if (!datosRemision) {
    return  <p className="text-red-500">❌ No hay datos disponibles para la remisión.</p>
  }

  // Verificar si alguna impresora tiene accesorios
  const hayAccesorios = datosRemision.series.some(impresora => {
    return impresora.accesorios && impresora.accesorios.length > 0;
  })

  console.log("📦 ¿Hay accesorios en las impresoras seleccionadas?:", hayAccesorios);

  const crearRemision = async () => {
    try {
      // Buscar cliente y proyecto desde las impresoras seleccionadas
      const clientesUnicos = new Set(datosRemision.series.map(i => i.cliente_id).filter(Boolean))
      const proyectosUnicos = new Set(datosRemision.series.map(i => i.proyecto_id).filter(Boolean))

      // Dterminar cliente_id
      let clienteId = null
      if (clientesUnicos.size === 1) {
        clienteId = [...clientesUnicos][0]
      } else if (datosRemision.cliente_id) {
        clienteId = datosRemision.cliente_id
      } else if (clientesUnicos.size > 1) {
        console.warn("⚠️ Hay múltiples clientes en la selección.");
      }

      // Determinamos proyecto_id
      let proyectoId = null
      if (proyectosUnicos.size === 1) {
        proyectoId = [...clientesUnicos][0]
      } else if (proyectosUnicos > 1) {
        console.warn("⚠️ Hay múltiples proyectos en la selección.");
      }

      console.log("📤 Enviando datos al backend...");

      const remisionData = {
        numero_remision: `REM-${Date.now()}`,
        empresa_id: Number(datosRemision.empresa),
        cliente_id: clienteId,
        proyecto_id: proyectoId || null, 
        destinatario,
        direccion_entrega: direccionEntrega, 
        notas: notas.trim() === '' ? null : notas, 
        series: datosRemision.series.map(impresora => impresora.serie), // Solo enviamos los números de serie
        usuario_creador: "admin"  // Temporal, se cambiará cuando haya autenticación
      }

      console.log("📦 Datos listos para enviar:", remisionData);

      // Enviar solicitud 'POST' al backend
      const response = await fetch("http://localhost:3000/api/remisiones", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(remisionData)
      })

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error("⚠️ Error al crear la remisión en el backend");
      }
      
      //Obtener la respuesta JSON del backend
      const nuevaRemision = await response.json()
      console.log("✅ Remisión creada con éxito:", nuevaRemision)
      toast.success('✅ Remisión creada correctamente')

      
      
      // Generar y descargar el pdf
      const pdfResponse = await fetch(`http://localhost:3000/api/remisiones/generar-pdf/${nuevaRemision.numero_remision}`)

      const contentType = pdfResponse.headers.get("Content-Type")
      console.log("🧾 Headers de la respuesta PDF:", contentType)
      
      if (!pdfResponse.ok || !contentType.includes('application/pdf')) {
        console.error("⚠️ Error en la respuesta del PDF:")
        toast.error("❌ El PDF no se generó correctamente.")
        return
      }

      const pdfBlob = await pdfResponse.blob()
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `remision_${nuevaRemision.numero_remision}.pdf`;
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      console.log("📄 PDF descargado correctamente");

      localStorage.removeItem('fecha_programada')

      // Redirigir al usuario despues de la descarga 
      toast.info("🔄 Redirigiendo a Gestión de Impresoras...")
      setTimeout(() => {
        navigate("/gestion-productos/gestion-impresoras")
      }, 2000)

    } catch (error) {
      console.error("❌ Error al crear la remisión:", error);
      toast.error("⚠️ No se pudo crear la remisión. Inténtalo de nuevo.");
    }
  }

  return (
    <>
      {/* Contenedor de remisión: sin fondo blanco aquí */}
      <div className="flex justify-center">
        {Number(datosRemision.empresa) === 1 ? (
          <RemisionIMME datos={remisionParaVista} />
        ) : (
          <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            {/* Aquí va el diseño base que aún vas a mejorar después */}
          </div>
        )}
      </div>

      {/* Botones: alineados a la derecha y fuera de la hoja */}
      <div className="flex justify-end gap-2 mt-4 pr-6 pb-6">
        <button
          id="modificar-remision"
          onClick={() => navigate("/gestion-productos/gestion-impresoras")}
          className="bg-gray-500 text-white px-3 py-1 text-sm rounded hover:bg-gray-600"
        >
          🔄 Modificar
        </button>
        <button
          id="confirmar-remision"
          onClick={crearRemision}
          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
        >
          ✅ Confirmar
        </button>
      </div>
    </>

  );
  
  
}

export default VistaPreviaRemisionEntrega;
