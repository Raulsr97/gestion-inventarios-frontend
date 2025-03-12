import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VistaPreviaRemisionEntrega() {
  const location = useLocation();
  const navigate = useNavigate();
  const datosRemision = location.state?.remision; // Obtener los datos pasados por `navigate`

  if (!datosRemision) {
    toast.error("No hay datos para mostrar la vista previa.");
    navigate("/movimientos/impresoras/agregar"); // Redirigir si no hay datos
    return null;
  }

  // 🔍 Extraer datos de la remisión
  const empresaNombre = datosRemision.empresa;
  console.log("Empresa en VistaPreviaRemisionEntrega:", empresaNombre); // Verificar empresa en consola

  // 🔹 Función para obtener el logo de la empresa
  const obtenerLogoEmpresa = (empresa) => {
    const logos = {
      "IMME": "/logos/imme.png",
      "Colour Klub": "/logos/colour_klub.png",
      "Coneltec": "/logos/coneltec.png"
    };
    return logos[empresa] || "/logos/default.png";
  };

  // 🔹 Función para obtener estilos según la empresa
  const obtenerEstilosEmpresa = (empresa) => {
    const estilos = {
      "IMME": { colorFondo: "bg-blue-800 text-white", bordeTabla: "border-blue-800", textoColor: "text-blue-800" },
      "Colour Klub": { colorFondo: "bg-blue-500 text-white", bordeTabla: "border-blue-500", textoColor: "text-blue-500" },
      "Coneltec": { colorFondo: "bg-orange-600 text-white", bordeTabla: "border-orange-600", textoColor: "text-orange-600" }
    };
    return estilos[empresa] || { colorFondo: "bg-gray-300", bordeTabla: "border-gray-300", textoColor: "text-gray-600" };
  };

  // 🔹 Obtener estilos específicos para la empresa
  const estilosEmpresa = obtenerEstilosEmpresa(empresaNombre);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className={`bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto ${estilosEmpresa.bordeTabla}`}>

        {/* 🔹 Cabecera personalizada con logo y título */}
        <div className="flex justify-between items-center border-b pb-4 p-4">
          {empresaNombre === "Coneltec" ? (
            <>
              <h3 className={`text-lg font-semibold ${estilosEmpresa.textoColor}`}>REMISIÓN ENTREGA</h3>
              <img src={obtenerLogoEmpresa(empresaNombre)} alt={`Logo ${empresaNombre}`} className="h-20" />
            </>
          ) : (
            <>
              <img src={obtenerLogoEmpresa(empresaNombre)} alt={`Logo ${empresaNombre}`} className="h-20" />
              <h3 className={`text-lg font-semibold ${estilosEmpresa.textoColor}`}>REMISIÓN ENTREGA</h3>
            </>
          )}
        </div>

        {/* 🔹 Información general de la remisión */}
        <div className="p-4 mt-4 rounded-md shadow-md border">
          <p className={estilosEmpresa.textoColor}><strong>Cliente:</strong> {datosRemision.cliente || "Sin cliente"}</p>
          {datosRemision.proyecto && <p className={estilosEmpresa.textoColor}><strong>Proyecto:</strong> {datosRemision.proyecto}</p>}
          <p className={estilosEmpresa.textoColor}><strong>Sitio:</strong> {datosRemision.destinatario}</p>
          <p className={estilosEmpresa.textoColor}><strong>Dirección de Entrega:</strong> {datosRemision.direccion_entrega}</p>
          {datosRemision.notas && (
            <p className={estilosEmpresa.textoColor}><strong>Detalles Adicionales:</strong> {datosRemision.notas}</p>
          )}
        </div>

        {/* 🔹 Tabla de series */}
        <table className="w-full border-collapse border mt-4 text-sm">
          <thead className={estilosEmpresa.colorFondo}>
            <tr>
              <th className={`border p-2 ${estilosEmpresa.bordeTabla}`}>Marca</th>
              <th className={`border p-2 ${estilosEmpresa.bordeTabla}`}>Modelo</th>
              <th className={`border p-2 ${estilosEmpresa.bordeTabla}`}>Serie</th>
            </tr>
          </thead>

          <tbody>
            {datosRemision.series.map((serie, index) => (
              <tr key={index}>
                <td className="border p-2">Desconocida</td>
                <td className="border p-2">Desconocido</td>
                <td className="border p-2">{serie}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Sección de firmas */}
        <div className="mt-6">
          <div className="flex justify-between pt-4">
            <div className="text-center w-1/2">
              <p className={`font-semibold ${estilosEmpresa.textoColor} pb-6`}>Firma de quien recibe</p>
              <div className={`border-t-2 ${estilosEmpresa.bordeTabla} w-48 mx-auto mt-4`}></div>
              <p className="text-sm">Nombre y Firma</p>
            </div>
            <div className="text-center w-1/2">
              <p className={`font-semibold ${estilosEmpresa.textoColor} pb-6`}>Firma de quien entrega</p>
              <div className={`border-t-2 ${estilosEmpresa.bordeTabla} w-48 mx-auto mt-4`}></div>
              <p className="text-sm">Nombre y Firma</p>
            </div>
          </div>
        </div>

        {/* 🔹 Botones de acción */}
        <div className="flex justify-between mt-4">
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/movimientos/impresoras/agregar")}
          >
            Modificar Información
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => console.log("Confirmar Remisión (pendiente implementación)")}
          >
            Confirmar Remisión
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaPreviaRemisionEntrega;
