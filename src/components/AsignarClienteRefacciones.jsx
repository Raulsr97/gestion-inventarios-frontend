import { useState } from "react";
import { toast } from "react-toastify";

function AsignarClienteRefacciones({
  clientes,
  setClientes,
  clienteSeleccionado,
  setClienteSeleccionado,
  setRefaccionesSeleccionadas,
  requireCliente
}) {
  const [nuevoCliente, setNuevoCliente] = useState("");

  const manejarSeleccionCliente = (e) => {
    if (!requireCliente) return;
  
    const clienteId = e.target.value;
    setClienteSeleccionado(clienteId);
  
    setRefaccionesSeleccionadas((prev) =>
      prev.map((r) => (!r.cliente_id ? { ...r, cliente_id: clienteId } : r))
    );
  };
  

  const manejarNuevoCliente = async () => {
    if (!nuevoCliente.trim()) {
      toast.warn("Ingresa un cliente válido");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoCliente }),
      });

      if (!respuesta.ok) throw new Error("Error al registrar cliente");

      const clienteCreado = await respuesta.json();
      toast.success("Cliente registrado exitosamente");

      setClientes(prev => [...prev, clienteCreado]);
      setClienteSeleccionado(clienteCreado.id);
      setNuevoCliente("");

      // 🔹 También asignar ese cliente a las refacciones sin cliente
      setRefaccionesSeleccionadas(prev => {
        return prev.map(r => {
          if (!r.cliente_id) {
            return { ...r, cliente_id: clienteCreado.id };
          }
          return r;
        });
      });

    } catch (error) {
      toast.error("Hubo un error al registrar el cliente.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🔸 Selección de cliente existente */}
      <div>
        <select
          className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            !requireCliente ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" : ""
          }`}
          value={clienteSeleccionado}
          onChange={manejarSeleccionCliente}
          disabled={!requireCliente}
        >
          <option value="" disabled>Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
      </div>

      {/* 🔸 Registro de cliente nuevo */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nuevo cliente"
          value={nuevoCliente}
          onChange={(e) => setNuevoCliente(e.target.value)}
          disabled={!requireCliente}
          className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            !requireCliente ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
          }`}
        />
        <button
          onClick={manejarNuevoCliente}
          disabled={!requireCliente}
          className={`${!requireCliente ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <p className="text-3xl">✅</p>
        </button>
      </div>

      {/* 🔸 Visualización del cliente actual */}
      <div className="flex items-center justify-center">
        {clienteSeleccionado ? (
          <div className="p-2 border-l-4 border-blue-600 bg-blue-50 text-blue-800 rounded-lg text-center w-full">
            <p className="text-sm font-medium text-gray-700">📌 Cliente seleccionado:</p>
            <p className="text-md font-semibold">
              {clientes.find((c) => c.id === Number(clienteSeleccionado))?.nombre}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm min-h-[50px] flex items-center justify-center">
            Ningún cliente seleccionado
          </p>
        )}
      </div>
    </div>
  );
}

export default AsignarClienteRefacciones;
