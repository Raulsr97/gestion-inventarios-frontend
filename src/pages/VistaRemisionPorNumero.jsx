import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import RemisionEmpresaA from "../components/RemisionEmpresaA";
import RemisionEmpresaB from "../components/RemisionEmpresaB";
import RemisionEmpresaC from "../components/RemisionEmpresaC";
import RemisionRefaccionesEmpresaA from "../components/RemisionRefaccionesEmpresaA";
import RemisionRefaccionesEmpresaB from "../components/RemisionRefaccionesEmpresaB";
import RemisionRefaccionesEmpresaC from "../components/RemisionRefaccionesEmpresaC";

function VistaRemisionPorNumero() {
  const { numero_remision } = useParams() // Obtenemos el numero desde la URL
  const [remision, setRemision] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fechaVisual = queryParams.get("fecha");

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
    const cargarRemision = async () => {
      try {
        const endpoints = [
          { endpoint: "remisiones", tipo: "impresora", campo: "impresoras" },
          { endpoint: "remisiones-toner", tipo: "toner", campo: "toners" },
          { endpoint: "remisiones-unidad-imagen", tipo: "unidad_imagen", campo: "unidadesimg" },
          { endpoint: "remisiones-refaccion", tipo: "refaccion", campo: "refacciones" }
        ];
  
        let data = null;
  
        for (const { endpoint, tipo, campo } of endpoints) {
          const res = await fetch(`http://localhost:3000/api/${endpoint}/${numero_remision}`);
          if (!res.ok) continue;
  
          const respuesta = await res.json();
          console.log("🧪 Verificando respuesta:", respuesta);
  
          // ✅ Confirmar que el campo de productos venga con información
          if (Array.isArray(respuesta[campo]) && respuesta[campo].length > 0) {
            respuesta.tipo = tipo;
            respuesta.series = respuesta[campo];
            data = respuesta;
            break;
          }
        }
  
        if (!data) throw new Error("No se encontró la remisión con productos");
  
        setRemision(data);
        setTimeout(() => {
          setReady(true);
          setCargando(false);
        }, 100);
      } catch (err) {
        console.error("❌ Error al cargar la remisión:", err);
        setError(true);
        setCargando(false);
      }
    };
  
    cargarRemision();
  }, [numero_remision]);
  
  

  if (cargando) return <p>⏳ Cargando remisión...</p>
  if (error) return <p className="text-red-500">❌ No se pudo cargar la remisión.</p>

  if (!ready || !remision) return <p>⏳ Preparando remisión...</p>

  if (remision && remision.tipo && remision.empresa?.id) {
    console.log("🧪 remision recibida:", remision)

    const productos = remision.tipo === 'refaccion' ? remision.refacciones.map(ref => ({
      numero_parte: ref.numero_parte,
      marca: ref.marca,
      cantidad: ref.RemisionRefaccion?.cantidad || 1
    })) : remision.series || []

    const datos = {
      numero_remision: remision.numero_remision,
      fecha_emision: fechaVisual || remision.fecha_programada,
      cliente: remision.cliente,
      proyecto: remision.proyecto,
      destinatario: remision.destinatario,
      direccion_entrega: remision.direccion_entrega,
      notas: remision.notas,
      series: productos
    };
  
    return (
      <div 
        id="vista-remision-imme"
        className="w-[216mm] mx-auto"
      >
        {/* Remisiones de impresoras, toner o unidad_imagen */}
        {remision.tipo !== "refaccion" && remision.empresa.id === 1 && (
          <RemisionEmpresaA datos={datos} />
        )}
        {remision.tipo !== "refaccion" && remision.empresa.id === 2 && (
          <RemisionEmpresaB datos={datos} />
        )}
        {remision.tipo !== "refaccion" && remision.empresa.id === 3 && (
          <RemisionEmpresaC datos={datos} />
        )}

        {/* Remisiones de refacciones */}
        {remision.tipo === "refaccion" && remision.empresa.id === 1 && (
          <RemisionRefaccionesEmpresaA datos={datos} />
        )}
        {remision.tipo === "refaccion" && remision.empresa.id === 2 && (
          <RemisionRefaccionesEmpresaB datos={datos} />
        )}
        {remision.tipo === "refaccion" && remision.empresa.id === 3 && (
          <RemisionRefaccionesEmpresaC datos={datos} />
        )}
      </div>
    );
  }

  
  
}

export default VistaRemisionPorNumero