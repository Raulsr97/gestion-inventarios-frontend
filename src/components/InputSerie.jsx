function InputSerie ({ onScan, disabled}) {
    return(
    <div className="col-span-2 relative w-full">
      <input
        type="text"
        onKeyDown={onScan} // Detecta Enter y ejecuta la función
        disabled={disabled}
        className="peer w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
      />
      <label
        className="absolute left-3 top-2 text-gray-500 transition-all 
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
          peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
          bg-white p-0"
      >
        Escanear series
      </label>
    </div>
    )
}

export default InputSerie