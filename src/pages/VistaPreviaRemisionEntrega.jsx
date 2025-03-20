import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


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

  useEffect(() => {
    fetch("http://localhost:3000/api/marcas")
      .then(res => res.json())
      .then(data => setMarcas(data))
      .catch(error => console.error("Error al obtener las marcas", error));
  }, [])

  // Logos de cada empresa
  const logosEmpresas = {
    1: '/logos/imme.png',
    2: '/logos/colour_klub.png',
    3: '/logos/coneltec.png'
  }

  // Obtener el logo correcto segun la empresa seleccionada
  const logoEmpresa = logosEmpresas[datosRemision.empresa]

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
      console.log("📤 Enviando datos al backend...");

      const remisionData = {
        numero_remision: `REM-${Date.now()}`,
        empresa_id: datosRemision.empresa,
        cliente_id: datosRemision.cliente_id, 
        proyecto_id: datosRemision.proyecto_id || null, 
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

      if (!pdfResponse.ok) {
        throw new Error("⚠️ Error al generar el PDF.");
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
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <img src={logoEmpresa} alt="Logo de la Empresa" className="h-16"/>
        <h2 className="text-2xl font-bold">Remisión de Entrega</h2>
      </div>

      {/* 🔹 Datos Generales */}
      <div className="mb-4">
        <p><strong>Cliente:</strong> {datosRemision.cliente}</p>
        {datosRemision.proyecto && datosRemision.proyecto !== 'Sin Proyecto' && (
          <p><strong>Proyecto: </strong>{datosRemision.proyecto}</p>
        )}
      </div>

      {/* 🔹 Campos Editables */}
      <div className="mb-4">
           {/* 🔹 Destinatario */}
          <label className="text-sm font-medium text-gray-600">📌 Destinatario:</label>
          <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
          />

          {/* 🔹 Dirección de Entrega */}
          <label className="text-sm font-medium text-gray-600 mt-2">📍 Dirección de Entrega:</label>
          <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={direccionEntrega}
              onChange={(e) => setDireccionEntrega(e.target.value)}
          />

          {/* 🔹 Notas */}
          <label className="text-sm font-medium text-gray-600 mt-2">📝 Notas:</label>
          <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
          />
      </div>

      {/* Tabla de impresoras */}
      <table className="w-full border-collapse border border-gray-300 my-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Marca</th>
            <th className="border p-2">Modelo</th>
            <th className="border p-2">Serie</th>
            {hayAccesorios && <th className="border p-2">Accesorios</th>}
         </tr>
        </thead>
        <tbody>
          {datosRemision.series.map((impresora, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{impresora.marca?.nombre || marcas.find(m => m.id === impresora.marca_id)?.nombre}</td>
              <td className="border p-2">{impresora.modelo}</td>
              <td className="border p-2">{impresora.serie}</td>
              {hayAccesorios && (
                <td className="border p-2">
                {Array.isArray(impresora.accesorios) && impresora.accesorios.length > 0
                  ? impresora.accesorios.map(a => a.numero_parte).join(', ')
                  : ''
                }
                </td>
              )}
            </tr>
          ))}
       </tbody>
     </table>

      {/* 🔹 Sección de Firmas */}
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

      {/* Botones */}
      <div className="flex justify-between mt-6">
        <button 
            onClick={() => navigate("/gestion-productos/gestion-impresoras")} 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
            🔄 Regresar
        </button>
        <button 
            onClick={crearRemision} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
            ✅ Confirmar Remisión
        </button>
      </div>
    </div>
  )
}

export default VistaPreviaRemisionEntrega;
