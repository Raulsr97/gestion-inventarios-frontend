function SeleccionEmpresa({ empresas, empresaSeleccionada, setEmpresaSeleccionada }) {
  return (
    <div className="flex flex-col gap-1">
  {/* 🔹 Select de empresas */}
  <select
    id="empresa"
    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
    value={empresaSeleccionada}
    onChange={(e) => setEmpresaSeleccionada(e.target.value)}
  >
    <option value="">Seleccione una empresa</option>
    {empresas.map((empresa) => (
      <option key={empresa.id} value={empresa.id}>
        {empresa.nombre}
      </option>
    ))}
  </select>

  {/* 🔹 Contenedor con altura fija para mantener el espacio reservado */}
  <div className="h-20 flex items-center justify-center">
    {empresaSeleccionada ? (
      <div className="p-2 border-l-4 border-blue-600 bg-blue-50 text-blue-800 rounded-lg text-center w-full">
        <p className="text-sm font-medium text-gray-700">📌 Empresa seleccionada:</p>
        <p className="text-md font-semibold">
          {empresas.find(e => e.id === Number(empresaSeleccionada))?.nombre}
        </p>
      </div>
    ) : (
      <p className="text-gray-400 text-sm min-h-[50px] flex items-center justify-center">
        Ninguna empresa seleccionada
      </p>
    )}
  </div>
</div>

  )
}
export default SeleccionEmpresa