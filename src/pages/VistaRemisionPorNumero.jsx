import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RemisionIMME from "../components/RemisionIMME";

function VistaRemisionPorNumero() {
  const { numero_remision } = useParams() // Obtenemos el numero desde la URL
  const [remision, setRemision] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        html, body {
        width: 216mm;
        height: auto;
        margin: 0;
        padding: 0;
        overflow: visible;
        }

        #vista-remision-imme {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        table, tr, td, th {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        thead {
          display: table-header-group;
        }

        tfoot {
          display: table-footer-group;
        }

        tr {
          page-break-after: auto;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    fetch (`http://localhost:3000/api/remisiones/${numero_remision}`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró la remisión')
        return res.json()
      })
      .then(data => {
        setRemision(data)
        setTimeout(() => {
          setReady(true)
          setCargando(false)
        }, 100)
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

  if (!ready || !remision) return <p>⏳ Preparando remisión...</p>

  // Si es empresa IMME(ID 1) renderizar su diseño 
  if (remision && remision.empresa?.id == 1 && Array.isArray(remision.impresoras) && remision.impresoras.length > 0) {
    console.log("🧾 Remisión completa:", remision)
    return (
      <div 
        id="vista-remision-imme"
        className="w-[216mm] mx-auto"
      >
        <RemisionIMME datos={{
          numero_remision: remision.numero_remision,
          fecha_emision: localStorage.getItem('fecha_programada') || remision.fecha_emision,
          cliente: remision.cliente,
          proyecto: remision.proyecto,
          destinatario: remision.destinatario,
          direccion_entrega: remision.direccion_entrega,
          notas: remision.notas,
          series: remision.impresoras
        }} />
      </div>
    )
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      {/* Todo tu contenido original aquí... */}
    </div>
  );
}

export default VistaRemisionPorNumero