import { useState } from "react"

function SelectDinamico ({
    opciones, 
    valorSeleccionado, 
    setValorSeleccionado, 
    placeholder, 
    disabled, 
    permitirNuevo, 
    setNuevoValor
  }) {
  const [nuevoValorLocal, setNuevoValorLocal] = useState('')

  return (
    <div>
      {valorSeleccionado === 'nuevo' ? (
        // Si el usuario selecciona "Agregar nuevo" mostramos un input
        <input 
          type="text"
          placeholder={`Nuevo ${placeholder}`}
          // value={nuevoValor} 
          onChange={(e) => {
            const valorEnMayusculas = e.target.value.toUpperCase()
            setNuevoValor(valorEnMayusculas)
            setNuevoValorLocal(valorEnMayusculas) // Guardamos temporalmente el valor local
          }}
          onBlur={() => {
            if (!nuevoValorLocal.trim()) {
              setValorSeleccionado('') // Si el input queda vacío , volvemos al select
            } 
          }}
          className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700 focus:ring-0 focus:outline-none uppercase"
          autoFocus
        />
      ) : (

      // Si no ha seleccionado 'Agregar Nuevo' mostramos el select 
      <select
        className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
        value={valorSeleccionado || ''}
        onChange={(e) => {
          const seleccionado = e.target.value;
          if (seleccionado === "nuevo") {
            setNuevoValorLocal(""); // 🔹 Reseteamos el input cuando selecciona "Agregar nuevo"
          }
          setValorSeleccionado(seleccionado); // 🔹 Mantenemos el estado del select actualizado
        }}
        disabled={disabled}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion.nombre.toUpperCase()}
          </option>
        ))}
        {permitirNuevo && <option value="nuevo"> Agregar {placeholder}</option>}
      </select>
      )}
    </div>
  )
    
}

export default SelectDinamico