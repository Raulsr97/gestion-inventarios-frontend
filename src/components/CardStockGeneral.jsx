import { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";

function CardStockGeneral() {
  const [stockTotal, setStockTotal] = useState(0);
  const [stockPorModelo, setStockPorModelo] = useState({});
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then((res) => res.json())
      .then((data) => {
        // Filtrar solo las impresoras en almacén
        const impresorasEnAlmacen = data.filter(
          (impresora) => impresora.ubicacion === "Almacén"
        );

        // Obtener conteo total
        setStockTotal(impresorasEnAlmacen.length);

        // Calcular stock por modelo
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
    <div
      className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-transform hover:scale-105"
      onClick={() => setMostrarDetalle(!mostrarDetalle)}
    >
      <FaPrint className="text-blue-600 text-4xl mb-3" />
      <h2 className="text-lg font-semibold text-gray-700">Stock General</h2>
      <p className="text-gray-500 text-sm">Total de impresoras en almacén</p>

      {/* 🔹 Mostrar el total general o el desglose por modelo */}
      {mostrarDetalle ? (
        <div className="mt-3 text-gray-700 text-sm">
          {Object.entries(stockPorModelo).map(([modelo, cantidad]) => (
            <p key={modelo} className="font-medium">
              {modelo}: <span className="font-bold text-blue-700">{cantidad}</span>
            </p>
          ))}
        </div>
      ) : (
        <span className="text-3xl font-bold text-blue-700 mt-2">
          {stockTotal}
        </span>
      )}
    </div>
  );
}

export default CardStockGeneral;
