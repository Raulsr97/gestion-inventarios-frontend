import { useState, useEffect } from "react";
import { FaTruckMoving } from "react-icons/fa"; // Ícono representativo para tránsito

function CardUnidadesImgEnTransito() {
  const [cantidadEnTransito, setCantidadEnTransito] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/api/unidades-imagen")
      .then((res) => res.json())
      .then((data) => {
        const unidadesimgEnTransito = data.filter(
          (toner) => toner.ubicacion === "En Tránsito"
        );
        setCantidadEnTransito(unidadesimgEnTransito.length);
      })
      .catch((error) =>
        console.error("Error al obtener unidades de imagen en tránsito:", error)
      );
  }, []);

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-transform hover:scale-105"
    >
      <FaTruckMoving className="text-yellow-500 text-4xl mb-3" />
      <h2 className="text-lg font-semibold text-gray-700">En Tránsito</h2>
      <p className="text-gray-500 text-sm">Unidades de Imagen en traslado</p>
      <span className="text-3xl font-bold text-yellow-600 mt-2">
        {cantidadEnTransito}
      </span>
    </div>
  );
}

export default CardUnidadesImgEnTransito;
