function SelectDinamico ({opciones, valorSeleccionado, setValorSeleccionado, placeholder, disabled}) {
  return (
    <div>
      <select
        className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
        value={valorSeleccionado}
        onChange={(e) => setValorSeleccionado(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion.nombre}
          </option>
        ))}
        <option value="nuevo">Agregar nuevo</option>
      </select>
    </div>
  )
    
}

export default SelectDinamico