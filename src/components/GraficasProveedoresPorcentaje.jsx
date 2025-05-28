import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function GraficaProveedoresPorcentaje() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  const COLORS = [
    "#0079FF", "#f87171", "#34d399", "#fbbf24", "#a78bfa", 
    "#f472b6", "#38bdf8", "#fb923c", "#4ade80", "#facc15"
  ];

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/proveedores-porcentaje`)
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener proveedores:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="text-center text-gray-500">Cargando proveedores...</p>;
  }

  if (proveedores.length === 0) {
    return <p className="text-center text-gray-500">No hay datos de proveedores disponibles.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Proveedores - Porcentaje de productos ingresados
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={proveedores}
            dataKey="cantidad"
            nameKey="proveedor"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {proveedores.map((_, index) => (
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

export default GraficaProveedoresPorcentaje;
