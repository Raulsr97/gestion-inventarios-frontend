// Componente BotonAgregar: Botón reutilizable para agregar productos 
function BotonAgregar({ 
  text = "Agregar", // Texto del botón (valor por defecto: "Agregar")
  onClick          // Función que se ejecuta al hacer clic en el botón
}) {
  return (
    <div className="col-span-2 flex justify-end mt-20">
      {/* Botón principal */}
      <button 
        className="bg-blue-600 text-white text-sm px-3 py-3 rounded-md hover:bg-blue-700"
        onClick={onClick} // Ejecuta la función recibida al hacer clic
      >
        {text} {/* Muestra el texto configurado para el botón */}
      </button>
    </div>
  );
}

// Exportar el componente para su uso en otras partes de la aplicación
export default BotonAgregar;
