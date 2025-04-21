import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";

function CardEntregadosMesUnidadesImg() {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/api/unidades-imagen")
      .then((res) => res.json())
      .then((data) => {
        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const anioActual = ahora.getFullYear();

        const entregadosEsteMes = data.filter((toner) => {
          if (
            toner.ubicacion === "Entregado" &&
            toner.fecha_salida
          ) {
            const fecha = new Date(toner.fecha_salida);
            return (
              fecha.getMonth() === mesActual &&
              fecha.getFullYear() === anioActual
            );
          }
          return false;
        });

        setCantidad(entregadosEsteMes.length);
      })
      .catch((error) =>
        console.error("Error al obtener unidades de imagen entregados:", error)
      );
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
      <FaBoxOpen className="text-green-600 text-4xl mb-3" />
      <h2 className="text-lg font-semibold text-gray-700">Entregados este mes</h2>
      <p className="text-gray-500 text-sm">Unidades de Imagen entregados en abril</p>
      <span className="text-3xl font-bold text-green-700 mt-2">{cantidad}</span>
    </div>
  );
}

export default CardEntregadosMesUnidadesImg;
