import React from "react";
import { toast } from "react-toastify";

function ListaRefacciones({ refacciones, seleccionadas, manejarCantidadSeleccionada }) {
  const tiposYaSeleccionados = new Set(seleccionadas.map(r => r.tipo));

  const manejarAgregar = (ref) => {
    if (
      tiposYaSeleccionados.size > 0 &&
      !tiposYaSeleccionados.has(ref.tipo)
    ) {
      toast.warn("No puedes mezclar refacciones de tipo 'Compra' con 'Distribución'.");
      return;
    }

    const cantidadTexto = prompt(`¿Cuántas unidades de "${ref.numero_parte}" deseas agregar? (Máx: ${ref.cantidad})`);
    if (cantidadTexto === null) return; // Cancelado

    const cantidad = parseInt(cantidadTexto);
    if (isNaN(cantidad) || cantidad < 0) {
      toast.error("Por favor ingresa una cantidad válida.");
      return;
    }

    if (cantidad > ref.cantidad) {
      toast.error(`No puedes entregar más de ${ref.cantidad} unidades.`);
      return;
    }

    manejarCantidadSeleccionada(ref.numero_parte, cantidad, ref);
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-600 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2">Número de Parte</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Proyecto</th>
            <th className="px-4 py-2">Disponible</th>
            <th className="px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {refacciones.map((ref, idx) => {
            const seleccion = seleccionadas.find(s =>
              s.numero_parte === ref.numero_parte &&
              s.tipo === ref.tipo &&
              s.cliente_id === ref.cliente_id &&
              s.proyecto_id === ref.proyecto_id
            );

            return (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 ${
                  ref.tipo === "Distribucion" ? "bg-yellow-50" : ""
                }`}
              >
                <td className="px-4 py-2 font-medium">{ref.numero_parte}</td>
                <td className="px-4 py-2">{ref.tipo}</td>
                <td className="px-4 py-2">{ref.cliente_nombre || "—"}</td>
                <td className="px-4 py-2">{ref.proyecto_nombre || "—"}</td>
                <td className="px-4 py-2">{ref.cantidad}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => manejarAgregar(ref)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                  >
                    ➕ Agregar
                  </button>
                  {seleccion?.cantidad > 0 && (
                    <p className="text-xs mt-1 text-gray-700">
                      Seleccionadas: <strong>{seleccion.cantidad}</strong>
                    </p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {seleccionadas.length > 0 && (
      <div className="mt-6 bg-gray-50 p-4 border-t border-gray-300 rounded-md">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">🛒 Refacciones seleccionadas para remisión</h2>
        <ul className="space-y-2 text-sm">
          {seleccionadas.map((ref, idx) => (
            <li key={idx} className="flex justify-between items-center bg-white border p-2 rounded shadow-sm">
              <span className="text-gray-800">
                <strong>{ref.numero_parte}</strong>
                {ref.cliente_nombre && ` | Cliente: ${ref.cliente_nombre}`}
                {ref.proyecto_nombre && ` | Proyecto: ${ref.proyecto_nombre}`}
                | Cantidad: <strong>{ref.cantidad}</strong>
              </span>

              <button
                onClick={() => manejarCantidadSeleccionada(ref.numero_parte, 0, ref)}
                className="text-red-500 text-xs font-semibold hover:underline"
              >
                🗑️ Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    </div>
  );
}

export default ListaRefacciones;
