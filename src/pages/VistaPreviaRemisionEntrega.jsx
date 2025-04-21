import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RemisionIMME from "../components/RemisionIMME";
import RemisionRefaccionesIMME from "../components/RemisionRefaccionesIMME";
import RemisionColourKlub from "../components/RemisionColourKlub";
import RemisionRefaccionesColourKlub from "../components/RemisionRefaccionesColourKlub";
import RemisionConeltec from "../components/RemisionConeltec";
import RemisionRefaccionesConeltec from "../components/RemisionRefaccionesConeltec";


function VistaPreviaRemisionEntrega() {
  const location = useLocation()
  const navigate = useNavigate()
  const datosRemision = location.state // Recibimos los datos de la navegacion


  const tipoProducto = location.state?.tipoProducto || 'impresora'
  console.log("📦 Tipo de producto:", tipoProducto);

  const esRefacciones = Array.isArray(datosRemision.refacciones)


  // Estados para realizar la edicion solo en los campos del formulario
  const [destinatario, setDestinatario] = useState(datosRemision?.destinatario || "");
  const [direccionEntrega, setDireccionEntrega] = useState(datosRemision?.direccionEntrega || "");
  const [notas, setNotas] = useState(datosRemision?.notas || ""); 

  // Estado para almacenar las marcas
  const [marcas, setMarcas] = useState([])

  // Estado para almacenar los clientes
  const [clientes, setClientes] = useState([])

  // Estado para la fecha de entrega
  const getLocalDay = () => {
    const hoy = new Date()
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()) // Ajuste a la zona horaria
    return hoy.toISOString().split('T')[0]
  }

  const [fechaVisual, setFechaVisual] = useState(getLocalDay()) 

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


  const clienteObjeto = clientes.find(c => 
    c.id === Number(datosRemision.cliente || datosRemision.series?.[0]?.cliente_id)
  )

  const remisionParaVista = {
    numero_remision: "REM-PREVIEW",
    fecha_emision: fechaVisual,
    cliente: clienteObjeto,
    proyecto: 
      datosRemision.proyecto && typeof datosRemision.proyecto === 'object'
        ? datosRemision.proyecto
        : datosRemision.proyecto !== 'Sin proyecto'
        ? { nombre: datosRemision.proyecto}
        : null,
    destinatario,
    direccion_entrega: direccionEntrega,
    notas,
    series: esRefacciones ? datosRemision.refacciones : datosRemision.series,
    setFechaVisual,
    fechaVisual
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
  const hayAccesorios = !esRefacciones && datosRemision.series.some(impresora => {
    return impresora.accesorios && impresora.accesorios.length > 0;
  })

  console.log("📦 ¿Hay accesorios en las impresoras seleccionadas?:", hayAccesorios);

  const crearRemision = async () => {
    const tipo = datosRemision.tipoProducto || 'impresora'

    const rutas = {
      impresora: {
        crear: "/api/remisiones",
        pdf: "/api/remisiones/generar-pdf"
      },
      toner: {
        crear: "/api/remisiones-toner",
        pdf: "/api/remisiones-toner/generar-pdf"
      },
      unidad_imagen: {
        crear: "/api/remisiones-unidad-imagen",
        pdf: "/api/remisiones-unidad-imagen/generar-pdf"
      },
      refaccion: {
        crear: "/api/remisiones-refaccion",
        pdf: "/api/remisiones-refaccion/generar-pdf"
      }
    };
    
    const endpointCrear = rutas[tipo].crear;
    const endpointPDF = rutas[tipo].pdf;
    

    try {
      // Buscar cliente y proyecto desde las impresoras seleccionadas
      const clientesUnicos = new Set(
        (esRefacciones ? datosRemision.refacciones : datosRemision.series || [])
          .map(i => i.cliente_id)
          .filter(Boolean)
      );
      
      const proyectosUnicos = new Set(
        (esRefacciones ? datosRemision.refacciones : datosRemision.series || [])
          .map(i => i.proyecto_id)
          .filter(Boolean)
      );
      

      // Dterminar cliente_id
      let clienteId = null
      if (datosRemision.cliente) {
        clienteId = Number(datosRemision.cliente)
      } else if (clientesUnicos.size === 1) {
        clienteId = [...clientesUnicos][0]
      }

      // Determinamos proyecto_id
      let proyectoId = null
      if (proyectosUnicos.size === 1) {
        proyectoId = [...proyectosUnicos][0]
      } else if (proyectosUnicos > 1) {
        console.warn("⚠️ Hay múltiples proyectos en la selección.");
      }

      console.log("📤 Enviando datos al backend...");

      const remisionData = {
        numero_remision: `REM-${Date.now()}`,
        empresa_id: Number(datosRemision?.empresa),
        cliente_id: Number(clienteId),
        proyecto_id: datosRemision?.proyecto?.id,
        destinatario,
        direccion_entrega: direccionEntrega,
        notas: notas.trim() === '' ? null : notas,
        ...(esRefacciones
          ? {
              refacciones: (datosRemision?.refacciones || []).map(ref => ({
                id: ref.numero_parte,
                cantidad: ref.cantidad
              }))
            }
          : {
              series: (datosRemision?.series || []).map(impresora => impresora.serie)
            }),
        fecha_programada: fechaVisual,
        usuario_creador: "admin"
      };
      
      

      console.log("📦 Datos listos para enviar:", remisionData);

      // Enviar solicitud 'POST' al backend
      const response = await fetch(`http://localhost:3000${endpointCrear}`, {
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
      const pdfResponse = await fetch(`http://localhost:3000${endpointPDF}/${nuevaRemision.numero_remision}?fecha=${fechaVisual}`)

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

      
      // Redirigir al usuario despues de la descarga 
      toast.info("🔄 Redirigiendo...")
      setTimeout(() => {
        const rutasRetorno = {
          impresora: "/gestion-productos/gestion-impresoras",
          toner: "/gestion-productos/gestion-toners",
          unidad_imagen: "/gestion-productos/gestion-unidades-img"
        };
        
        const rutaFinal = rutasRetorno[tipo] || rutasRetorno.impresora;
        navigate(rutaFinal)
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
      {esRefacciones && Number(datosRemision.empresa) === 1 && (
        <RemisionRefaccionesIMME datos={remisionParaVista} />
      )}
      {esRefacciones && Number(datosRemision.empresa) === 2 && (
        <RemisionRefaccionesColourKlub datos={remisionParaVista} />
      )}
      {esRefacciones && Number(datosRemision.empresa) === 3 && (
        <RemisionRefaccionesConeltec datos={remisionParaVista} />
      )}
      {!esRefacciones && Number(datosRemision.empresa) === 1 && (
        <RemisionIMME datos={remisionParaVista} />
      )}
      {!esRefacciones && Number(datosRemision.empresa) === 2 && (
        <RemisionColourKlub datos={remisionParaVista} />
      )}
      {!esRefacciones && Number(datosRemision.empresa) === 3 && (
        <RemisionConeltec datos={remisionParaVista} />
      )}
      </div>

      {/* Botones: alineados a la derecha y fuera de la hoja */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <button
        id="modificar-remision"
        onClick={() => {
          const tipo = datosRemision.tipoProducto || "impresora";
        
          const rutas = {
            impresora: "/gestion-productos/gestion-impresoras",
            toner: "/gestion-productos/gestion-toners",
            unidad_imagen: "/gestion-productos/gestion-unidades-img",
            refaccion: "/gestion-productos/gestion-refacciones"
          };
        
          const rutaRetorno = rutas[tipo] || rutas.impresora;
        
          navigate(rutaRetorno, { state: datosRemision });
        }}
        
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl shadow-lg"
      >
        🔄 Modificar
      </button>

        <button
          id="confirmar-remision"
          onClick={crearRemision}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          ✅ Confirmar
        </button>
      </div>
    </>

  );
  
  
}

export default VistaPreviaRemisionEntrega;
