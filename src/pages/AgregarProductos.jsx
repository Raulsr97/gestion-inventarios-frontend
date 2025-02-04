import { useState } from "react";
import { FaTrash, FaRedo, FaCheck, FaBoxOpen } from "react-icons/fa";

function AgregarProductos() {
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("");
  const [serie, setSerie] = useState("");
  const [productos, setProductos] = useState([]);
  const [bloquearSeleccion, setBloquearSeleccion] = useState(false);

  const handleAgregarSerie = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!modelo || !tipo) {
        alert("Selecciona un modelo y tipo antes de escanear.");
        return;
      }
      if (!serie.trim()) return;

      setProductos([...productos, { modelo, tipo, serie }]);
      setSerie("");
      if (!bloquearSeleccion) setBloquearSeleccion(true);
    }
  };

  const handleEliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleConfirmarIngreso = () => {
    if (productos.length === 0) {
      alert("No hay productos para agregar.");
      return;
    }
    console.log("Enviando productos a la API:", productos);
    setProductos([]);
    setBloquearSeleccion(false);
    setModelo("");
    setTipo("");
  };

  const handleReiniciarRegistro = () => {
    setModelo("");
    setTipo("");
    setProductos([]);
    setBloquearSeleccion(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* 🔹 FORMULARIO 🔹 */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaBoxOpen className="text-blue-600" /> Nuevo Producto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select para Tipo de Producto */}
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="p-3 bg-gray-200 border rounded-md uppercase"
            disabled={bloquearSeleccion}
          >
            <option value="" disabled>Selecciona el tipo</option>
            <option value="TONER">Toner</option>
            <option value="IMPRESORA">Impresora</option>
          </select>

          {/* Input para Modelo */}
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value.toUpperCase())}
            className="p-3 bg-gray-200 border rounded-md uppercase"
            placeholder="Modelo"
            disabled={bloquearSeleccion}
          />

          {/* Input para Número de Serie */}
          <input
            type="text"
            value={serie}
            onChange={(e) => setSerie(e.target.value.toUpperCase())}
            onKeyDown={handleAgregarSerie}
            className="p-3 bg-gray-200 border rounded-md uppercase"
            placeholder="Escanea o escribe la serie"
            autoFocus
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleReiniciarRegistro}
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700"
          >
            <FaRedo /> Reiniciar
          </button>
        </div>
      </div>

      {/* 🔹 LISTA DE PRODUCTOS 🔹 */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex-1 overflow-y-auto max-h-[400px]">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Productos Escaneados ({productos.length})</h2>

        {productos.length > 0 ? (
          <>
            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productos.map((producto, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center border hover:shadow-md transition-transform duration-200 hover:scale-105"
                >
                  <span className="text-gray-700 font-medium">{producto.serie}</span>
                  <button
                    onClick={() => handleEliminarProducto(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Botón de Confirmación */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleConfirmarIngreso}
                className="bg-green-600 text-white px-6 py-2 rounded-md text-lg flex items-center gap-2 hover:bg-green-700"
              >
                <FaCheck /> Confirmar
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">No hay productos escaneados.</p>
        )}
      </div>
    </div>
  );
}

export default AgregarProductos;
