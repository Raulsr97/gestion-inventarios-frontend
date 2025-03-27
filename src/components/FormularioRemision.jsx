import { useState } from "react";
import { toast } from "react-toastify";

function FormularioRemision ({ onGenerarRemision, datosIniciales }) {
    // Estados para los valores del fomulario
    const [destinatario, setDestinatario] = useState(datosIniciales?.destinatario || "")
    const [direccionEntrega, setDireccionEntrega] = useState(datosIniciales?.direccionEntrega || "")
    const [notas, setNotas] = useState(datosIniciales?.notas || "")


    // Funcion para validar y generar la remision
    const manejarGenerarRemision = () => {
        if(!destinatario.trim() || !direccionEntrega.trim()) {
            toast.warn("Faltan datos importantes en la remisión.")
        }

        // Pasamos los datos a la funcion que maneja la navegacion a VistaPreviaRemisionEntrega.jsx
        onGenerarRemision({
            destinatario,
            direccionEntrega,
            notas
        })
    }

    return (
        <div className="flex flex-col gap-4">
            {/* 🔹 Campo: Destinatario */}
            <div>
                <label className="text-sm font-medium text-gray-600">📌 Destino:</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nombre del destinatario"
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                />
            </div>

            {/* 🔹 Campo: Dirección de Entrega */}
            <div>
                <label className="text-sm font-medium text-gray-600">📍 Dirección de Entrega:</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Dirección de entrega"
                    value={direccionEntrega}
                    onChange={(e) => setDireccionEntrega(e.target.value)}
                />
            </div>

            {/* 🔹 Campo: Notas */}
            <div>
                <label className="text-sm font-medium text-gray-600">📝 Notas:</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Notas adicionales (opcional)"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                />
            </div>

            {/* 🔹 Botón para generar la remisión */}
            <div className="flex justify-end">
                <button
                    onClick={manejarGenerarRemision}
                    className="w-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <p>Generar Remisión ✅</p>
                </button>
            </div>
        </div>
    );
}

export default FormularioRemision