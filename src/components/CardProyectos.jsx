import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiClipboard, FiExternalLink } from "react-icons/fi";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function CardProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/proyectos-realizados/detalle`)
      .then((res) => res.json())
      .then((data) => {
        setProyectos(data);
      })
      .catch((err) => console.error("Error al obtener proyectos:", err));
  }, []);

  const calcularTotalMovimientos = (proyecto) => {
    return proyecto.distribuciones + proyecto.recolecciones;
  };

  const abrirDetalleProyecto = (proyecto) => {
    setProyectoSeleccionado(proyecto);
  };

  const cerrarDetalleProyecto = () => {
    setProyectoSeleccionado(null);
  };

  return (
    <>
      {/* Card Principal */}
      <div
        onClick={() => setIsOpen(true)}
        className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FiClipboard className="text-yellow-600 text-3xl" />
            <h3 className="text-lg font-semibold text-gray-700">
              Proyectos
            </h3>
          </div>
        </div>

        <p className="text-3xl font-bold text-yellow-600 text-center">
          {proyectos.length}
        </p>
        <p className="text-sm text-gray-500 text-center mt-1">
          Proyectos con movimientos del año
        </p>
      </div>

      {/* Modal Principal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-4xl w-full rounded-lg p-6 overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-6">
              Proyectos y movimientos
            </Dialog.Title>

            <div className="space-y-6">
              {Array.isArray(proyectos) && proyectos.map((proyecto, idx) => (
                <div
                  key={idx}
                  onClick={() => abrirDetalleProyecto(proyecto)}
                  className="mb-4 p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-700">
                      {proyecto.proyecto}
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Total movimientos: {calcularTotalMovimientos(proyecto)}
                      </span>
                      <FiExternalLink className="text-gray-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
              >
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Flotante Detalle Proyecto */}
      {proyectoSeleccionado && (
        <Dialog open={true} onClose={cerrarDetalleProyecto} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white max-w-md w-full rounded-lg p-6 overflow-y-auto max-h-[90vh]">
              <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-6">
                Detalle de {proyectoSeleccionado.proyecto}
              </Dialog.Title>

              <div className="text-gray-700 space-y-4 text-center">
                <div>
                  <span className="font-semibold">Movimientos de Distribución:</span> {proyectoSeleccionado.distribuciones}
                </div>
                <div>
                  <span className="font-semibold">Movimientos de Recolección:</span> {proyectoSeleccionado.recolecciones}
                </div>
                <div>
                  <span className="font-semibold">Total de Movimientos:</span> {calcularTotalMovimientos(proyectoSeleccionado)}
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={cerrarDetalleProyecto}
                  className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default CardProyectos;
