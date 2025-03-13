import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VistaPreviaRemisionEntrega() {
  const location = useLocation();
  const navigate = useNavigate();
  const datosRemision = location.state?.remision;

  if (!datosRemision) {
    toast.error("No hay datos para mostrar la vista previa.");
    navigate("/movimientos/impresoras/agregar");
    return null;
  }

  // Obtener estilos y logos según la empresa
  const obtenerLogoEmpresa = (empresa) => {
    const logos = {
      "IMME": "/logos/imme.png",
      "COLOUR KLUB": "/logos/colour_klub.png",
      "CONELTEC": "/logos/coneltec.png"
    };
    return logos[empresa] || "/logos/default.png";
  };

  const obtenerEstilosEmpresa = (empresa) => {
    const estilos = {
      "IMME": { fondo: "bg-blue-700", texto: "text-blue-800", cabecera: "border-b pb-4 p-4 flex justify-between items-center " },
      "COLOUR KLUB": { fondo: "bg-gray-100 border-l-4 border-yellow-500", texto: "text-gray-800", cabecera: "border-b pb-4 p-4 flex flex-col items-center" },
      "CONELTEC": { fondo: "bg-orange-500 border-black-300", texto: "text-orange-800", cabecera: "border-b pb-4 p-4 flex justify-between items-center" }
    };
    return estilos[empresa] || { fondo: "border-gray-300", texto: "text-gray-600", cabecera: "border-b pb-4 p-4" };
  };

  const estilosEmpresa = obtenerEstilosEmpresa(datosRemision.empresa);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className={`bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full ${estilosEmpresa.fondo}`}> 
        
        {/* Cabecera con logo y título */}
        <div className={estilosEmpresa.cabecera}>
          {datosRemision.empresa === "Coneltec" ? (
            <>
              <h3 className={`text-lg font-semibold ${estilosEmpresa.texto}`}>REMISIÓN ENTREGA</h3>
              <img src={obtenerLogoEmpresa(datosRemision.empresa)} alt="Logo" className="h-20" />
            </>
          ) : (
            <>
              <img src={obtenerLogoEmpresa(datosRemision.empresa)} alt="Logo" className="h-20" />
              <h3 className={`text-lg font-semibold ${estilosEmpresa.texto}`}>REMISIÓN ENTREGA</h3>
            </>
          )}
        </div>

        {/* Información general */}
        <div className={`p-4 mt-4 rounded-md shadow-md`}>
          <p className={estilosEmpresa.texto}><strong>Cliente:</strong> {datosRemision.cliente}</p>
          {datosRemision.proyecto && <p className={estilosEmpresa.texto}><strong>Proyecto:</strong> {datosRemision.proyecto}</p>}
          <p className={estilosEmpresa.texto}><strong>Destinatario:</strong> {datosRemision.destinatario}</p>
          <p className={estilosEmpresa.texto}><strong>Dirección de Entrega:</strong> {datosRemision.direccion_entrega}</p>
          {datosRemision.notas && <p className={estilosEmpresa.texto}><strong>Notas:</strong> {datosRemision.notas}</p>}
        </div>

        {/* Tabla de series */}
        <table className="w-full border-collapse border mt-4 text-sm">
          <thead className={`text-white ${estilosEmpresa.fondo}`}>
            <tr>
              <th className="border p-2">Marca</th>
              <th className="border p-2">Modelo</th>
              <th className="border p-2">Serie</th>
            </tr>
          </thead>
          <tbody>
            {datosRemision.series.map((serie, index) => (
              <tr key={index}>
                <td className="border p-2">{serie.marca}</td>
                <td className="border p-2">{serie.modelo}</td>
                <td className="border p-2">{serie.serie}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sección de firmas */}
        <div className="mt-6 flex justify-between">
          <div className="text-center">
            <p className={`font-semibold ${estilosEmpresa.texto} pb-2`}>Firma de quien recibe</p>
            <div className={`border-t-2 w-48 mx-auto ${estilosEmpresa.texto}`}></div>
          </div>
          <div className="text-center">
            <p className={`font-semibold ${estilosEmpresa.texto} pb-2`}>Firma de quien entrega</p>
            <div className={`border-t-2 w-48 mx-auto ${estilosEmpresa.texto}`}></div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => navigate("/movimientos/impresoras/agregar")}>
            Modificar Información
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => console.log("Confirmar Remisión (pendiente implementación)")}> 
            Confirmar Remisión
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaPreviaRemisionEntrega;
