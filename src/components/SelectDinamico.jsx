import { useState } from "react"

function SelectDinamico ({opciones, valorSeleccionado, setValorSeleccionado, placeholder, disabled, permitirNuevo}) {
  // Estado para el nuevo valor
  const [nuevoValor, setNuevoValor] = useState('')

  return (
    <div>
      {valorSeleccionado === 'nuevo' ? (
        // Si el usuario selecciona "Agregar nuevo" mostramos un input
        <input 
          type="text"
          placeholder={`Nuevo ${placeholder}`}
          value={nuevoValor} 
          onChange={(e) => setNuevoValor(e.target.value)}
          onBlur={() => {
            if (!nuevoValor.trim()) setValorSeleccionado('') // Si el input queda vacío , volvemos al select
          }}
          className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
        />
      ) : (

      // Si no ha seleccionado 'Agregar Nuevo' mostramos el select 
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
        {permitirNuevo && <option value="nuevo"> Agregar nuevo {placeholder}</option>}
      </select>
      )}
    </div>
  )
    
}

export default SelectDinamico