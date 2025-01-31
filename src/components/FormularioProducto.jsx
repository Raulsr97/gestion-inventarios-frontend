import { useState } from "react";

function FormularioProducto() {
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
    <div className="h-screen flex flex-col">
      {/* Formulario en la parte superior, ocupando toda la pantalla */}
      <div className="bg-white shadow-md p-4 flex items-center gap-4 w-full fixed top-0 left-0 z-10">
        
        {/* Input para Modelo */}
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value.toUpperCase())}
          className="p-2 border rounded-md uppercase flex-1"
          placeholder="Modelo"
          disabled={bloquearSeleccion}
        />

        {/* Input para Tipo de Producto */}
        <input
          type="text"
          value={tipo}
          onChange={(e) => setTipo(e.target.value.toUpperCase())}
          className="p-2 border rounded-md uppercase flex-1"
          placeholder="Tipo de Producto"
          disabled={bloquearSeleccion}
        />

        {/* Input para Número de Serie */}
        <input
          type="text"
          value={serie}
          onChange={(e) => setSerie(e.target.value.toUpperCase())}
          onKeyDown={handleAgregarSerie}
          className="p-2 border rounded-md uppercase flex-1"
          placeholder="Escanea o escribe la serie"
          autoFocus
        />

        {/* Botón de Reiniciar */}
        <button
          onClick={handleReiniciarRegistro}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          🔄 Reiniciar
        </button>
      </div>

      {/* Espacio para que el contenido no quede detrás del formulario */}
      <div className="mt-20 flex-1 overflow-auto p-4">
        {productos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Productos Escaneados:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productos.map((producto, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
                >
                  <span>{producto.serie}</span>
                  <button
                    onClick={() => handleEliminarProducto(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            
            {/* Sección de contador y botón de confirmación */}
            <div className="flex justify-between items-center mt-4">
            {/* Contador de productos escaneados */}
            <span className="text-gray-700 font-semibold">
                Productos escaneados: {productos.length}
            </span>

            {/* Botón para Confirmar Ingreso */}
            <button
                onClick={handleConfirmarIngreso}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
            >
                ✅ Confirmar
            </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default FormularioProducto;





