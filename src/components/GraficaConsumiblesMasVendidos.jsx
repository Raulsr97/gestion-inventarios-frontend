import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function GraficaConsumiblesMasVendidos() {
  const [consumibles, setConsumibles] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/consumibles-mas-vendidos`)
      .then((res) => res.json())
      .then((data) => {
        setConsumibles(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener consumibles:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="text-center text-gray-500">Cargando consumibles...</p>;
  }

  if (consumibles.length === 0) {
    return <p className="text-center text-gray-500">No hay datos de consumibles disponibles.</p>;
  }

  // 🔥 Aquí procesamos los datos para extraer solo el modelo (sin marca)
  const consumiblesProcesados = consumibles.map(item => ({
    ...item,
    modelo: item.nombre.split(' ').slice(1).join(' ') // Recortamos el primer texto (marca) y dejamos solo modelo
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Consumibles más vendidos
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={consumiblesProcesados}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="modelo" // Ahora sí existe modelo
              type="category"
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value, name, props) => [
                `${value} piezas`,
                props.payload.nombre // Nombre completo en Tooltip
              ]}
            />
            <Bar dataKey="cantidad" fill="#8B5CF6" radius={[8, 8, 8, 8]}>
              <LabelList dataKey="cantidad" position="right" style={{ fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficaConsumiblesMasVendidos;
