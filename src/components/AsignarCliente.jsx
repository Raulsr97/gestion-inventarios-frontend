import { useState } from "react"
import { toast } from "react-toastify"

function AsignarCliente ({ clientes, setClientes, clienteSeleccionado, setClienteSeleccionado, setImpresorasSeleccionadas, requireCliente}) {
    // Estado para almacenar el nuevo cliente a registrar
    const [nuevoCliente, setNuevoCliente] = useState('')
    

    // Manejar seleccion de un cliente existente
    const manejarSeleccionCliente = (e) => {
        const clienteId = e.target.value
        setClienteSeleccionado(clienteId)
        console.log('nuevo cliente seleccionado:', clienteId)

        setImpresorasSeleccionadas(prevSeleccionadas => {
            return prevSeleccionadas.map(i => {
                if(!i.cliente_id) {
                    return { ...i, cliente_id: clienteId}
                }
                return i
            })
        })
    }

    // Manejar creacion de un nuevo cliente 
    const manejarNuevoCliente = async () => {
        if (!nuevoCliente.trim()) {
            toast.warn('Ingresa un cliente válido')
            return
        }

        try {
            const respuesta = await fetch("http://localhost:3000/api/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: nuevoCliente }),
            })

            if (!respuesta.ok) throw new Error('Error al registrar cliente')
            
            const clienteCreado = await respuesta.json()
            toast.success('Cliente registrado exitosamente')

            // Actualizar la lista de clientes en el frontend
            setClientes(prevClientes => [...prevClientes, clienteCreado])

            // Seleccionar automaticamente el nuevo cliente
            setClienteSeleccionado(clienteCreado.id)
            setNuevoCliente('') // Limpiar el input
        } catch (error) {
            toast.error("Hubo un error al registrar el cliente.");
             console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Seleccionar Cliente Existente */}
            <div>
                <select
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${!requireCliente ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : ''}`}
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
            {/* 🔹 Agregar Cliente Nuevo */}
            <div className="flex gap-2">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nombre del nuevo cliente"
                    value={nuevoCliente}
                    onChange={(e) => setNuevoCliente(e.target.value)}
                />
                <button
                    onClick={manejarNuevoCliente}
                >
                    <p className="text-3xl">✅</p>
                </button>
            </div>
            {/* 🔹 Contenedor con altura fija para mantener el espacio reservado */}
            <div className="flex items-center justify-center">
                {clienteSeleccionado ? (
                <div className="p-2 border-l-4 border-blue-600 bg-blue-50 text-blue-800 rounded-lg text-center w-full">
                    <p className="text-sm font-medium text-gray-700">📌 Cliente seleccionado:</p>
                    <p className="text-md font-semibold">
                    {clientes.find(c => c.id === Number(clienteSeleccionado))?.nombre}
                    </p>
                </div>
                ) : (
                <p className="text-gray-400 text-sm min-h-[50px] flex items-center justify-center">
                    Ninguna empresa seleccionada
                </p>
                )}
            </div>
        </div>
    )
}

export default AsignarCliente
