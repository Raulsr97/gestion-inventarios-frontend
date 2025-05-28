// Importamos React y las dependencias necesarias
import { useState } from "react";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL

// Componente AsignarClienteRefacciones: Permite seleccionar o registrar un cliente para refacciones
function AsignarClienteRefacciones({
  clientes, 
  setClientes, 
  clienteSeleccionado, 
  setClienteSeleccionado, 
  setRefaccionesSeleccionadas, 
  requireCliente 
}) {
  // Estado para almacenar el nombre del nuevo cliente a registrar
  const [nuevoCliente, setNuevoCliente] = useState("");

  //  Manejar selección de un cliente existente
  const manejarSeleccionCliente = (e) => {
    if (!requireCliente) return;
  
    const clienteId = e.target.value;
    setClienteSeleccionado(clienteId);
  
    // Asignar el cliente seleccionado a las refacciones que no tienen cliente
    setRefaccionesSeleccionadas((prev) =>
      prev.map((r) => (!r.cliente_id ? { ...r, cliente_id: clienteId } : r))
    );
  };
  
  // Manejar registro de un nuevo cliente
  const manejarNuevoCliente = async () => {
    // Validar que el nombre del cliente no esté vacío
    if (!nuevoCliente.trim()) {
      toast.warn("Ingresa un cliente válido");
      return;
    }

    try {
      // Enviar solicitud para registrar el nuevo cliente en el backend
      const respuesta = await fetch(`${backendUrl}/api/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoCliente }),
      });

      if (!respuesta.ok) throw new Error("Error al registrar cliente");

      const clienteCreado = await respuesta.json();
      toast.success("Cliente registrado exitosamente");

      // Actualizar la lista de clientes en el frontend
      setClientes(prev => [...prev, clienteCreado]);
      setClienteSeleccionado(clienteCreado.id);
      setNuevoCliente("");

      // Asignar el cliente nuevo a las refacciones sin cliente
      setRefaccionesSeleccionadas(prev => {
        return prev.map(r => (!r.cliente_id ? { ...r, cliente_id: clienteCreado.id } : r));
      });

    } catch (error) {
      toast.error("Hubo un error al registrar el cliente.");
      console.error("Error al registrar cliente:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Selección de cliente existente */}
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

      {/* Registro de cliente nuevo */}
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
          className={`p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
            !requireCliente ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ✅
        </button>
      </div>

      {/* Visualización del cliente seleccionado */}
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
