function InputModelo ({
  value,
  onChange,
  disabled
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        id="modelo"
        placeholder=" " // El espacio es necesario para que funcione peer-placeholder-shown
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())} // Convierte a mayúsculas
        disabled={disabled}
        className="peer w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
      />
      <label
        htmlFor="modelo"
        className="absolute left-3 top-2.5 text-gray-500 transition-all 
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
          peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-700
          peer-not-placeholder-shown:top-[-10px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-700
          bg-white px-1"
      >
        Modelo
      </label>
    </div>
  )  
}

export default InputModelo