import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function GraficaClientesPorcentaje() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const COLORS = [
    "#7C3AED", // Morado fuerte 
    "#3B82F6", // Azul vibrante
    "#F59E0B", // Amarillo fuerte elegante
    "#10B981", // Verde esmeralda vivo
    "#EC4899", // Rosa fuerte
    "#6366F1", // Azul morado
    "#F43F5E", // Rojo vibrante
    "#06B6D4", // Turquesa vibrante
    "#F87171", // Rojo suave pero claro
    "#22C55E", // Verde vibrante
    "#A855F7", // Morado más suave
    "#FB923C", // Naranja saturado
    "#14B8A6", // Turquesa suave
    "#EAB308", // Amarillo fuerte clásico
    "#8B5CF6"  // Morado elegante (degradado)
  ];

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/clientes-porcentaje`)
      .then((res) => res.json())
      .then((data) => {
        setClientes(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener clientes:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="text-center text-gray-500">Cargando clientes...</p>;
  }

  if (clientes.length === 0) {
    return <p className="text-center text-gray-500">No hay datos de clientes disponibles.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Clientes - Porcentaje de ventas
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={clientes}
            dataKey="cantidad"
            nameKey="cliente"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {Array.isArray(clientes) && clientes.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficaClientesPorcentaje;
