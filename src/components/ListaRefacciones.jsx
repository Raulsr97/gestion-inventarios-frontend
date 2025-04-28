import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

function ListaRefacciones({ refacciones, seleccionadas, manejarCantidadSeleccionada }) {
  const [busqueda, setBusqueda] = useState("");

  const tiposYaSeleccionados = new Set(seleccionadas.map(r => r.tipo));

  const manejarAgregar = (ref) => {
    if (tiposYaSeleccionados.size > 0 && !tiposYaSeleccionados.has(ref.tipo)) {
      toast.warn("No puedes mezclar refacciones de tipo 'Compra' con 'Distribución'.");
      return;
    }

    const cantidadTexto = prompt(`¿Cuántas unidades de "${ref.numero_parte}" deseas agregar? (Máx: ${ref.cantidad})`);
    if (cantidadTexto === null) return; // Cancelado

    const cantidad = parseInt(cantidadTexto);
    if (isNaN(cantidad) || cantidad <= 0) {
      toast.error("Por favor ingresa una cantidad válida.");
      return;
    }

    if (cantidad > ref.cantidad) {
      toast.error(`No puedes entregar más de ${ref.cantidad} unidades.`);
      return;
    }

    manejarCantidadSeleccionada(ref.numero_parte, cantidad, ref);
    toast.success(`Se agregaron ${cantidad} unidades de ${ref.numero_parte}.`);
  };

  const refaccionesFiltradas = refacciones.filter(ref =>
    ref.numero_parte.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 max-h-[calc(100vh-150px)] overflow-y-auto">

      {/* 🔍 Input de búsqueda */}
      <div className="relative mb-2">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar número de parte..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-700 focus:outline-none text-gray-700"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* 🧩 Lista de refacciones */}
      {refaccionesFiltradas.length > 0 ? (
        refaccionesFiltradas.map((ref, idx) => {
          const seleccion = seleccionadas.find(s =>
            s.numero_parte === ref.numero_parte &&
            s.tipo === ref.tipo &&
            s.cliente_id === ref.cliente_id &&
            s.proyecto_id === ref.proyecto_id
          );

          return (
            <div
              key={idx}
              className="flex flex-col p-4 rounded-lg border border-gray-300 shadow-sm bg-white hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-md font-semibold text-gray-700">{ref.numero_parte}</p>
                <button
                  onClick={() => manejarAgregar(ref)}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full text-xs font-semibold transition"
                >
                  ➕ Agregar
                </button>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>Tipo: <span className="font-semibold">{ref.tipo}</span></p>

                {/* Solo renderizar cliente si existe */}
                {ref.cliente_nombre && (
                  <p>Cliente: <span className="font-semibold">{ref.cliente_nombre}</span></p>
                )}

                {/* Solo renderizar proyecto si existe */}
                {ref.proyecto_nombre && (
                  <p>Proyecto: <span className="font-semibold">{ref.proyecto_nombre}</span></p>
                )}

                <p>Disponible: <span className="font-semibold">{ref.cantidad}</span></p>
              </div>

              {seleccion?.cantidad > 0 && (
                <p className="text-xs mt-2 text-green-600 font-semibold">
                  Seleccionadas: {seleccion.cantidad}
                </p>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center mt-4">No se encontraron refacciones.</p>
      )}

      {/* 🛒 Refacciones seleccionadas */}
      {seleccionadas.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">🛒 Refacciones seleccionadas para remisión</h2>
          <div className="flex flex-col gap-2">
            {seleccionadas.map((ref, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition"
              >
                <div className="flex flex-col text-gray-700 text-sm">
                  <span className="font-semibold">{ref.numero_parte}</span>
                  {ref.cliente_nombre && (
                    <span className="text-xs">Cliente: {ref.cliente_nombre}</span>
                  )}
                  {ref.proyecto_nombre && (
                    <span className="text-xs">Proyecto: {ref.proyecto_nombre}</span>
                  )}
                  <span className="text-xs">Cantidad: {ref.cantidad}</span>
                </div>

                <button
                  onClick={() => manejarCantidadSeleccionada(ref.numero_parte, 0, ref)}
                  className="text-red-500 text-xs font-semibold hover:underline"
                >
                  🗑️ Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaRefacciones;
