import { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";

function CardStockGeneral() {
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null)
  const [stockTotal, setStockTotal] = useState(0);
  const [stockPorModelo, setStockPorModelo] = useState({});
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then((res) => res.json())
      .then((data) => {
        const impresorasEnAlmacen = data.filter(
          (impresora) => impresora.ubicacion === "Almacen"
        );

        setStockTotal(impresorasEnAlmacen.length);

        const conteoModelos = impresorasEnAlmacen.reduce((acc, impresora) => {
          acc[impresora.modelo] = (acc[impresora.modelo] || 0) + 1;
          return acc;
        }, {});

        setStockPorModelo(conteoModelos);
      })
      .catch((error) =>
        console.error("Error al obtener el stock general:", error)
      );
  }, []);

  return (
    <>
      {/* Card de Stock General */}
      <div
        className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-transform hover:scale-105"
        onClick={() => setMostrarDetalle(true)}
      >
        <FaPrint className="text-blue-600 text-4xl mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">Stock General</h2>
        <p className="text-gray-500 text-sm">Total de impresoras en almacén</p>
        <span className="text-3xl font-bold text-blue-700 mt-2">{stockTotal}</span>
      </div>

      {/* 🔹 Mini-card flotante centrada con fondo desenfocado */}
      {mostrarDetalle && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setMostrarDetalle(false)}
        >
          <div 
            className="bg-white shadow-lg rounded-lg
            p-6 w-[350px] max-h-[80vh] overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro de la mini-card
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Desglose por Modelo</h3>
            
            {/* Lista vertical correctamente alineada */}
            <ul className="w-full text-gray-600 text-sm space-y-2 overflow-y-auto max-h-60 px-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
              {Object.entries(stockPorModelo).map(([modelo, cantidad]) => (
                <li 
                  key={modelo} 
                  className="flex justify-between border-b py-2 w-full"
                  onClick={() => {
                    setModeloSeleccionado(modelo)
                    setMostrarDetalle(false)
                  }}
                >
                  <span className="font-medium">{modelo}</span>
                  <span className="font-bold">{cantidad}</span>
                </li>
              ))}
            </ul>

            <button 
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => setMostrarDetalle(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CardStockGeneral;
