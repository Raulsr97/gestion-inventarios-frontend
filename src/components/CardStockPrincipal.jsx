import { useEffect, useState } from "react";
import { FiBox, FiPrinter, FiTool, FiDroplet, FiCamera  } from "react-icons/fi";
import { Dialog } from "@headlessui/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function CardStockPrincipal() {
  const [stock, setStock] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/stock`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Stock desglosado:", data);
        setStock(data);
      })
      .catch((err) => console.error("Error al obtener stock:", err));
  }, []);

  const totalProductos = stock
    ? Object.values(stock).reduce((acumTipo, tipo) => {
        return acumTipo + Object.values(tipo).reduce((acumCat, cat) => {
          return acumCat + Object.values(cat).reduce((sum, cantidad) => sum + cantidad, 0);
        }, 0);
      }, 0)
    : 0;
  
  const formatearTipo = (texto) => {
    if (texto === "Distribucion") return "Distribución";
    return texto;
  };
    
    
      

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FiBox className="text-blue-600 text-3xl" />
            <h3 className="text-lg font-semibold text-gray-700">Stock en Almacén</h3>
          </div>
        </div>

        <p className="text-3xl font-bold text-blue-700 text-center">{totalProductos}</p>
        <p className="text-sm text-gray-500 text-center mt-1">Productos totales disponibles</p>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] shadow-2xl border border-gray-200">
            <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-4">
              Desglose de Stock por Tipo y Categoría
            </Dialog.Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Compra', 'Distribucion'].map((tipo) => (
                <div key={tipo} className="border rounded-lg p-4 shadow-md border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                    {formatearTipo(tipo)}
                  </h4>

                  {stock?.[tipo] &&
                    Object.entries(stock[tipo]).map(([categoria, registros]) => (
                      <div key={categoria} className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                        {categoria === 'impresoras' && <FiPrinter className="text-blue-500" />}
                        {categoria === 'toners' && <FiDroplet className="text-green-500" />}
                        {categoria === 'unidad_imagen' && <FiCamera className="text-yellow-500" />}
                        {categoria === 'refacciones' && <FiTool className="text-gray-500" />}

                          <h5 className="font-semibold capitalize text-gray-600">
                            {categoria.replace("_", " ")}
                          </h5>
                        </div>

                        
                        <ul
                          className="text-sm text-gray-700 space-y-1 overflow-y-auto pr-2 max-h-48 
                          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 
                          [mask-image:linear-gradient(to_bottom,transparent_0,black_8px,black_calc(100%-8px),transparent_100%)] 
                          [mask-composite:exclude]"
                        >
                          {Object.entries(registros).map(([clave, cantidad]) => (
                            <li key={clave} className="flex justify-between border-b pb-1">
                              <span>{clave}</span>
                              <span className="font-semibold">{cantidad}</span>
                            </li>
                          ))}
                        </ul>
                        


                      </div>
                    ))}
                </div>
              ))}
            </div>

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

export default CardStockPrincipal;
