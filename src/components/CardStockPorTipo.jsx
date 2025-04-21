import { useEffect, useState } from "react";
import { FaTags } from "react-icons/fa";

function CardStockPorTipo() {
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras/almacen-por-tipo")
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch((error) =>
        console.error("Error al obtener los tipos de impresora:", error)
      );
  }, []);

  const compra = tipos.find((t) => t.tipo === "Compra")?.cantidad || 0;
  const distribucion = tipos.find((t) => t.tipo === "Distribucion")?.cantidad || 0;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-transform hover:scale-105">
    <FaTags className="text-indigo-600 text-4xl mb-3" />
    <h2 className="text-lg font-semibold text-gray-700">Stock por Tipo</h2>
    <p className="text-gray-500 text-sm">En almacén</p>

    <div className="flex flex-row gap-24 mt-3 text-gray-700 text-center">
      <div>
        <p className="text-sm">Compra</p>
        <p className="text-2xl font-bold text-indigo-700">{compra}</p>
      </div>
      <div>
        <p className="text-sm">Distribución</p>
        <p className="text-2xl font-bold text-indigo-700">{distribucion}</p>
      </div>
    </div>
  </div>
  );
}

export default CardStockPorTipo;
