import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import RemisionImmeRecoleccion from "../components/RemisionImmeRecoleccion"
import RemisionColourKlubRecoleccion from "../components/RemisionColourKlubRecoleccion"
import RemisionConeltecRecoleccion from "../components/RemisionConeltecRecoleccion"

function VistaRemisionRecoleccionPorNumero() {
  const { numero_remision } = useParams()
  const [remision, setRemision] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const style = document.createElement('style');
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
  
        footer {
          position: relative;
          bottom: 0;
          margin-top: auto;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  useEffect(() => {
    fetch(`http://localhost:3000/api/remisiones-recoleccion/${numero_remision}`)
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

  // IMME (empresa_id = 1)
  if (remision.empresa?.id === 1 && Array.isArray(remision.productos)) {
    return (
      <div id="vista-remision-imme" className="w-[216mm] mx-auto">
        <RemisionImmeRecoleccion datos={{
          numero_remision: remision.numero_remision,
          fecha_emision: remision.fecha_programada,
          cliente: remision.cliente,
          proyecto: remision.proyecto,
          destinatario: remision.destinatario,
          direccion_recoleccion: remision.direccion_recoleccion,
          notas: remision.notas,
          productos: remision.productos
        }} />
      </div>
    )
  }

  // Colour Klub (empresa_id = 2)
  if (remision.empresa?.id === 2 && Array.isArray(remision.productos)) {
    return (
      <div id="vista-remision-imme" className="w-[216mm] mx-auto">
        <RemisionColourKlubRecoleccion datos={{
          numero_remision: remision.numero_remision,
          fecha_emision: remision.fecha_programada,
          cliente: remision.cliente,
          proyecto: remision.proyecto,
          destinatario: remision.destinatario,
          direccion_recoleccion: remision.direccion_recoleccion,
          notas: remision.notas,
          productos: remision.productos
        }} />
      </div>
    )
  }

  // Coneltec (empresa_id = 3)
  if (remision.empresa?.id === 3 && Array.isArray(remision.productos)) {
    return (
      <div id="vista-remision-imme" className="w-[216mm] mx-auto">
        <RemisionConeltecRecoleccion datos={{
          numero_remision: remision.numero_remision,
          fecha_emision: remision.fecha_programada,
          cliente: remision.cliente,
          proyecto: remision.proyecto,
          destinatario: remision.destinatario,
          direccion_recoleccion: remision.direccion_recoleccion,
          notas: remision.notas,
          productos: remision.productos
        }} />
      </div>
    )
  }
 
}

export default VistaRemisionRecoleccionPorNumero
