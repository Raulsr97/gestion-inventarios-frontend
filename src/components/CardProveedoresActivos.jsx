import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiTruck, FiExternalLink } from "react-icons/fi";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function CardProveedoresActivos() {
  const [proveedores, setProveedores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/proveedores-activos/detalle`)
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data);
      })
      .catch((err) => console.error("Error al obtener proveedores:", err));
  }, []);

  const calcularTotalProductos = (productos) => {
    return productos.reduce((acc, prod) => acc + prod.cantidad, 0);
  };

  const abrirDetalleProveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
  };

  const cerrarDetalleProveedor = () => {
    setProveedorSeleccionado(null);
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
            <FiTruck className="text-green-600 text-3xl" />
            <h3 className="text-lg font-semibold text-gray-700">
              Proveedores
            </h3>
          </div>
        </div>

        <p className="text-3xl font-bold text-green-700 text-center">
          {proveedores.length}
        </p>
        <p className="text-sm text-gray-500 text-center mt-1">
          Proveedores activos del año
        </p>
      </div>

      {/* Modal Principal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-5xl w-full rounded-lg p-6 overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-6">
              Proveedores y productos ingresados
            </Dialog.Title>

            <div className="space-y-6">
              {proveedores.map((proveedor, idx) => (
                <div
                  key={idx}
                  onClick={() => abrirDetalleProveedor(proveedor)}
                  className="mb-4 p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-700">
                      {proveedor.proveedor}
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Total productos: {calcularTotalProductos(proveedor.productos)}
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
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Flotante Detalle Proveedor */}
      {proveedorSeleccionado && (
        <Dialog open={true} onClose={cerrarDetalleProveedor} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white max-w-4xl w-full rounded-lg p-6 overflow-y-auto max-h-[90vh]">
              <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-6">
                Productos de {proveedorSeleccionado.proveedor}
              </Dialog.Title>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 border">Fecha</th>
                      <th className="py-2 px-3 border">Tipo</th>
                      <th className="py-2 px-3 border">Marca</th>
                      <th className="py-2 px-3 border">Modelo / N° Parte</th>
                      <th className="py-2 px-3 border">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proveedorSeleccionado.productos.map((prod, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2 px-3 text-center">{prod.fecha}</td>
                        <td className="py-2 px-3 text-center capitalize">{prod.tipo.replace('_', ' ')}</td>
                        <td className="py-2 px-3 text-center">{prod.marca}</td>
                        <td className="py-2 px-3 text-center">{prod.modelo}</td>
                        <td className="py-2 px-3 text-center font-semibold">{prod.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={cerrarDetalleProveedor}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
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

export default CardProveedoresActivos;
