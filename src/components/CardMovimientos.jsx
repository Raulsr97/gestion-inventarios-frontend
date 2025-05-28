import { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function CardMovimientosMes() {
  const [movimientos, setMovimientos] = useState({ entradas: 0, salidas: 0 });
  const [detalleMovimientos, setDetalleMovimientos] = useState([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/impresoras/movimientos-mes`)
      .then((res) => res.json())
      .then((data) => {
        const { entradas, salidas } = data

        setMovimientos({ entradas, salidas });
      })
      .catch((error) =>
        console.error("Error al obtener los movimientos del mes:", error)
      );
  }, []);

  return (
    <>
      {/* Card de Movimientos Durante el Mes */}
      <div
        className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-transform hover:scale-105"
        onClick={() => setMostrarDetalle(true)}
      >
        <FaExchangeAlt className="text-green-600 text-4xl mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">Movimientos del Mes</h2>
        <p className="text-gray-500 text-sm">Entradas y salidas registradas</p>
        
        <div className="flex justify-between w-full mt-3 px-4">
          <div className="text-center">
            <span className="text-sm text-gray-500">Entradas</span>
            <p className="text-2xl font-bold text-green-600">{movimientos.entradas}</p>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500">Salidas</span>
            <p className="text-2xl font-bold text-red-600">{movimientos.salidas}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardMovimientosMes;
