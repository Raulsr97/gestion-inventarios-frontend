import { useState } from "react";
import { toast } from "react-toastify";

const BuscadorRemisiones = () => {
  const [numero, setNumero] = useState('')
  const [remision, setRemision] = useState(null)
  const [error, setError] = useState('')

  const buscarRemision = async () => {
    try {
      setError('') // limpiar errores anteriores
      const response = await fetch(`http://localhost:3000/api/remisiones/${numero}`)

      if (!response.ok) {
        toast.error('No se encontro la remision')
      }

      const data = await response.json()
      console.log("✅ Remisión encontrada:", data);
      setRemision(data)
    } catch(error) {
      console.error("❌ Error al buscar la remisión:", error.message);
      setRemision(null);
      setError("No se encontró la remisión o hubo un error.");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Consultar Remisión</h1>

      <div className="mb-4">
        <label htmlFor="remision" className="block text-sm font-medium text-gray-700">
          Número de remisión:
        </label>
        <input
          type="text"
          id="remision"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. R-00123"
        />
      </div>

      <button
        onClick={buscarRemision}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Buscar
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default BuscadorRemisiones;
