import { useEffect, useState } from "react";
import { FiShoppingCart, FiPrinter, FiDroplet, FiCamera, FiTool } from "react-icons/fi";
import { Dialog } from "@headlessui/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function CardProductosVendidos() {
  const [ventasTotales, setVentasTotales] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/ventas-totales`)
      .then(res => res.json())
      .then(data => setVentasTotales(data.total || 0))
      .catch(err => console.error("Error al obtener ventas totales:", err));

    fetch(`${backendUrl}/api/dashboard/productos-vendidos`)
      .then(res => res.json())
      .then(data => setProductosVendidos(data))
      .catch(err => console.error("Error al obtener productos vendidos:", err));

    fetch(`${backendUrl}/api/dashboard/ventas-meses`)
      .then(res => res.json())
      .then(data => {
        setMesesDisponibles(data);
        if (data.length > 0) setMesSeleccionado(data[0]); // Por defecto el más reciente
      })
      .catch(err => console.error("Error al obtener meses disponibles:", err));
  }, []);

  const productosFiltrados = productosVendidos.filter(prod => {
    if (!mesSeleccionado) return true;
    const fecha = new Date(prod.fecha);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${anio}-${mes}` === mesSeleccionado;
  });

  const iconos = {
    impresora: <FiPrinter className="text-blue-500" />,
    toner: <FiDroplet className="text-green-600" />,
    unidad_imagen: <FiCamera className="text-yellow-500" />,
    refaccion: <FiTool className="text-gray-600" />,
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FiShoppingCart className="text-green-600 text-3xl" />
            <h3 className="text-lg font-semibold text-gray-700">Productos Vendidos</h3>
          </div>
        </div>

        <p className="text-3xl font-bold text-green-700 text-center">{ventasTotales}</p>
        <p className="text-sm text-gray-500 text-center mt-1">Total vendidos este año</p>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-4xl w-full rounded-lg p-6 overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-4">
              Detalle de Productos Vendidos
            </Dialog.Title>

            <div className="flex justify-center mb-4">
              <select
                value={mesSeleccionado || ""}
                onChange={(e) => setMesSeleccionado(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm"
              >
                {mesesDisponibles.map((mes) => {
                  const [anio, numeroMes] = mes.split("-");
                  const nombreMes = new Date(`${mes}-01`).toLocaleString("es-MX", {
                    month: "long",
                  });
                  return (
                    <option key={mes} value={mes}>
                      {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} {anio}
                    </option>
                  );
                })}
              </select>
            </div>

            {productosFiltrados.length === 0 ? (
              <p className="text-center text-gray-500 mt-6">
                No se registraron ventas en este mes.
              </p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="border border-gray-300 p-2">Tipo</th>
                      <th className="border border-gray-300 p-2">Modelo</th>
                      <th className="border border-gray-300 p-2">Marca</th>
                      <th className="border border-gray-300 p-2">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((prod, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-2 flex items-center gap-2 capitalize">
                          {iconos[prod.tipo]} {prod.tipo.replace("_", " ")}
                        </td>
                        <td className="border border-gray-300 p-2">{prod.modelo}</td>
                        <td className="border border-gray-300 p-2">{prod.marca}</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold">
                          {prod.cantidad}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default CardProductosVendidos;
