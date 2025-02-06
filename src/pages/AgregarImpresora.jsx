import { useEffect, useState } from "react"

function AgregarImpresora () {
  const [modelo, setModelo ] = useState('')
  const [estado, setEstado] = useState('Nueva')
  const [tipo, setTipo] = useState('')
  const [ubicacion, setUbicacion] = useState('Almacén')
  const [ marca, setMarca] = useState('')
  const [ nuevaMarca, setNuevaMarca] = useState('')
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  // Estados para almacenar la lista de clientes y proyectos
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  // Etados para manejar nuevos clientes y proyectos
  const [nuevoCliente, setNuevoCliente] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  // lista de series escaneadas
  const [ series, setSeries] = useState([])
  // Bloquea los selects al escanear
  const [ bloquearCampos, setBloquearCampos] = useState(false)
  const [ tieneAccesorios, setTieneAccesorios] = useState(false)



  useEffect(() => {
    fetch("http://localhost:3000/api/clientes")
      .then((res) => res.json())
      .then((data) => {
        setClientes(data)
      })

    fetch("http://localhost:3000/api/proyectos")
      .then((res) => res.json())
      .then((data) => {
        setProyectos(data)
      })

  }, [])

  const agregarSerie = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Evita que el formulario se recargue

      const serie = e.target.value.toUpperCase().trim()

      if (serie === '') return // Evita agregar una serie vacía  
      if (series.includes(serie)) {
        alert('Esta serie ya fue escaneada')
        return
      }

      setSeries([...series, serie]) // Agrega la serie a la lista
      e.target.value = '' // Limpia el input despues de escanear

      if (series.length === 0) {
        setBloquearCampos(true) // bloquea los selects al escanear la primer serie
      }
    }
  }

  const eliminarSerie = (serie) => {
    const nuevasSeries = series.filter((s) => s !== serie)
    setSeries(nuevasSeries)

    // Si no quedan series escaneadas desbloquear los demas campos
    if (nuevasSeries.length === 0) {
      setBloquearCampos(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!modelo || series.length === 0) {
      alert('Debes seleccionar un modelo y escanear al menos una serie')
      return
    }

    let clienteId = cliente
    let proyectoId = proyecto

    // Si se ingreso un nuevo cliente, lo creamos en la base de datos
    if (cliente === 'nuevo' && nuevoCliente) {
      const res = await fetch("http://localhost:3000/api/clientes", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoCliente })
      })
      const data = await res.json()
      clienteId = data.id // Usamos el ID del cleinte recién creado

    }

     // Si se ingresó un nuevo proyecto, lo creamos en la base de datos
    if (proyecto === "nuevo" && nuevoProyecto) {
    const res = await fetch("http://localhost:3000/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevoProyecto }),
    });
    const data = await res.json();
    proyectoId = data.id; // Usamos el ID del proyecto recién creado
    }

    // Datos finales a enviar
    const datosRegistro = {
      modelo,
      estado,
      marca,
      tipo,
      ubicacion,
      cliente_id: clienteId || null,
      proyecto_id: proyectoId || null,
      tiene_accesorios: tieneAccesorios,
      series
    }

    console.log('Enviando datos las backend:', datosRegistro);
    console.log("Datos que se enviarán al backend:", JSON.stringify(datosRegistro, null, 2));


    // Enviar al backend
    const response = await fetch("http://localhost:3000/api/impresoras/registrar-lote", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosRegistro)
    })

    const responseData = await response.json();
    console.log("Respuesta del backend:", responseData);

    
    if (response.ok) {
      alert('Impresoras registradas exitosamente!')
      // Limpiar el formulario del envío
      setMarca('')
      setTipo('')
      setModelo('')
      setEstado('Estado')
      setCliente('')
      setProyecto('')
      setNuevoCliente('')
      setNuevoProyecto('')
      setSeries([])
      setBloquearCampos(false)
      setTieneAccesorios(false)
    } else {
      alert('Error al registrar impresoras')
    }

  }

  return (
    <div className="flex min-h-screen bg-gray-100">
     {/* Contenedor principal */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-6 px-10 w-full lg:w-1/3">
          <h1 className="text-2xl font-semibold text-gray-700 mb-8 mt-6">Agregar Impresoras</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <div>
             {marca === "nuevaMarca" ? (
                <input
                  type="text"
                  placeholder="Nueva Marca"
                  value={nuevaMarca}
                  onChange={(e) => setNuevaMarca(e.target.value)}
                  onBlur={() => {
                    if (!nuevaMarca.trim()) setMarca(""); // Si el campo queda vacío, vuelve a ser select
                  }}
                  className="w-full p-3 border border-gray-300 rounded  focus:border-blue-700 focus:ring-0 focus:outline-none"
                />
              ) : (
                <select
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
                  onChange={(e) => setMarca(e.target.value)}
                  disabled={bloquearCampos}
                >
                  <option value="" disabled selected hidden>Marca</option>
                  <option value="lexmark">Lexmark</option>
                  <option value="nuevaMarca">Agregar Marca</option>
                </select>
              )}
            </div>

  
            {/* Modelo */}
            <div className="relative w-full">
              <input
                type="text"
                id="modelo"
                placeholder=" " // El espacio es necesario para que funcione peer-placeholder-shown
                value={modelo}
                onChange={(e) => setModelo(e.target.value.toUpperCase())}
                disabled={bloquearCampos}
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

            {/* Estado */}
            <div>
              <select
                className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
                onChange={(e) => setEstado(e.target.value)}
                disabled={bloquearCampos}
              >
                <option value="estado" disabled selected hidden>Estado</option>
                <option value="nueva">Nueva</option>
                <option value="usada">Usada</option>
              </select>
            </div>
  
            {/* Tipo */}
            <div>
              <select
                className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
                onChange={(e) => setTipo(e.target.value)}
                disabled={bloquearCampos}
              >
                <option value="tipo" disabled selected hidden>Tipo</option>
                <option value="propia">Propia</option>
                <option value="proyecto">Proyecto</option>
              </select>
            </div>

            {/* Cliente */}
            <div>
              {cliente === "nuevo" ? (
                <input
                  type="text"
                  placeholder="Nuevo Cliente"
                  value={nuevoCliente}
                  onChange={(e) => setNuevoCliente(e.target.value)}
                  onBlur={() => {
                    if (!nuevoCliente.trim()) setCliente(""); // Si el campo queda vacío, vuelve a ser select
                  }}
                  className="w-full p-3 border border-gray-300 rounded  focus:border-blue-700 focus:ring-0 focus:outline-none"
                  autoFocus
                />
              ) : (
                <select
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
                  onChange={(e) => setCliente(e.target.value)}
                  disabled={bloquearCampos}
                >
                  <option value=""disabled selected hidden>Cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                  <option value="nuevo">Agregar Cliente</option>
                </select>
              )}
            </div>

            {/* Proyecto */}
            <div>
              {proyecto === "nuevo" ? (
                <input
                  type="text"
                  placeholder="Nuevo Proyecto"
                  value={nuevoProyecto}
                  onChange={(e) => setNuevoProyecto(e.target.value)}
                  onBlur={() => {
                    if (!nuevoProyecto.trim()) setProyecto(""); // Si el campo queda vacío, vuelve a ser select
                  }}
                  className="w-full p-3 border border-gray-300 rounded  focus:border-blue-700 focus:ring-0 focus:outline-none"
                  autoFocus
                />
              ) : (
                <select
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-700"
                  onChange={(e) => setProyecto(e.target.value)}
                  disabled={bloquearCampos}
                >
                  <option value="" disabled selected hidden>Proyecto</option>
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                  <option value="nuevo">Agregar Proyecto</option>
                </select>
              )}
            </div>
            
            
        {/* Tiene Accesorios - Checkbox estilo botón */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Tiene Accesorios</span>
          <button
            type="button"
            onClick={() => setTieneAccesorios(!tieneAccesorios)}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${
              tieneAccesorios ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {tieneAccesorios ? "Sí" : "No"}
          </button>
        </div>

        {/* Escaneo de Series */}
            <div className="col-span-2 relative w-full">
              <input
                type="text"
                onKeyDown={agregarSerie}
                disabled={modelo === ""}
                className="peer w-full p-3 border border-gray-300 rounded text-sm focus:border-blue-700 focus:ring-0 focus:outline-none"
              />
              <label
                htmlFor="modelo"
                className="absolute left-3 top-2 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500 bg-white p-0"
              >
                Escanear series
              </label>
            </div>
  
            {/* Botón de agregar */}
            <div className="col-span-2 flex justify-end mt-20">
              <button className="bg-blue-600 text-white text-sm px-3 py-3 rounded-md hover:bg-blue-700">
                Agregar
              </button>
            </div>
            

          </form>
        </div>
  
        {/* Sección de lista de series */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-2/3 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Series Escaneadas: {series.length}
          </h3>
  
          {/* Lista de series con scroll interno */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md">
            <ul>
              {series.map((serie, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border-b last:border-none bg-white shadow-md rounded-md mb-2"
                >
                  <span className="text-gray-700">{serie}</span>
                  <button
                    onClick={() => eliminarSerie(serie)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
  
}
export default AgregarImpresora


