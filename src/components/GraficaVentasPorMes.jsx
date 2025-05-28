import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function GraficaVentasPorMes() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/ventas-por-mes`)
      .then((res) => res.json())
      .then((data) => {
        setVentas(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener ventas por mes:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="text-center text-gray-500">Cargando ventas...</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Ventas por mes (Productos entregados)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ventas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#60a5fa" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficaVentasPorMes;
