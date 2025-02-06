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
    } else {
      alert('Error al registrar impresoras')
    }

  }

  return (
    <div className="flex min-h-screen bg-gray-100">
     {/* Contenedor principal */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-2/3">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">Agregar Impresoras</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <div>
              <label className="block text-gray-700">Marca</label>
              {marca === "nuevaMarca" ? (
                <input
                  type="text"
                  placeholder="Nueva Marca"
                  value={nuevaMarca}
                  onChange={(e) => setNuevaMarca(e.target.value)}
                  onBlur={() => {
                    if (!nuevaMarca.trim()) setMarca(""); // Si el campo queda vacío, vuelve a ser select
                  }}
                  className="w-full p-2 border-none bg-gray-200 rounded"
                  autoFocus
                />
              ) : (
                <select
                  className="w-full p-2 border-none bg-gray-200 rounded"
                  onChange={(e) => setMarca(e.target.value)}
                  disabled={bloquearCampos}
                >
                  <option value="" hidden>Selecciona una opción</option> {/* ✅ Opción vacía inicial */}
                  <option value="lexmark">Lexmark</option>
                  <option value="nuevaMarca">Agregar Marca</option>
                </select>
              )}
            </div>

  
            {/* Modelo */}
            <div>
              <label className="block text-gray-700">Modelo</label>
              <input
                type="text"
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value.toUpperCase())}
                disabled={bloquearCampos}
                className="w-full p-2 border-none bg-gray-200 rounded"
              />
            </div>
  
            {/* Estado */}
            <div>
              <label className="block text-gray-700">Estado</label>
              <select
                className="w-full p-2 border-none bg-gray-200 rounded"
                onChange={(e) => setEstado(e.target.value)}
                disabled={bloquearCampos}
              >
                <option value="estado">Estado</option>
                <option value="nueva">Nueva</option>
                <option value="usada">Usada</option>
              </select>
            </div>
  
            {/* Tipo */}
            <div>
              <label className="block text-gray-700">Tipo</label>
              <select
                className="w-full p-2 border-none bg-gray-200 rounded"
                onChange={(e) => setTipo(e.target.value)}
                disabled={bloquearCampos}
              >
                <option value="tipo">Tipo</option>
                <option value="propia">Propia</option>
                <option value="proyecto">Proyecto</option>
              </select>
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-gray-700">Cliente</label>
              {cliente === "nuevo" ? (
                <input
                  type="text"
                  placeholder="Nuevo Cliente"
                  value={nuevoCliente}
                  onChange={(e) => setNuevoCliente(e.target.value)}
                  onBlur={() => {
                    if (!nuevoCliente.trim()) setCliente(""); // Si el campo queda vacío, vuelve a ser select
                  }}
                  className="w-full p-2 border-none bg-gray-200 rounded"
                  autoFocus
                />
              ) : (
                <select
                  className="w-full p-2 border-none bg-gray-200 rounded"
                  onChange={(e) => setCliente(e.target.value)}
                  disabled={bloquearCampos}
                >
                  <option value="">Selecciona un Cliente</option>
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
              <label className="block text-gray-700">Proyecto</label>
              {proyecto === "nuevo" ? (
                <input
                  type="text"
                  placeholder="Nuevo Proyecto"
                  value={nuevoProyecto}
                  onChange={(e) => setNuevoProyecto(e.target.value)}
                  onBlur={() => {
                    if (!nuevoProyecto.trim()) setProyecto(""); // Si el campo queda vacío, vuelve a ser select
                  }}
                  className="w-full p-2 border-none bg-gray-200 rounded"
                  autoFocus
                />
              ) : (
                <select
                  className="w-full p-2 border-none bg-gray-200 rounded"
                  onChange={(e) => setProyecto(e.target.value)}
                  disabled={bloquearCampos}
                >
                  <option value="">Selecciona un Proyecto</option>
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                  <option value="nuevo">Agregar Proyecto</option>
                </select>
              )}
            </div>

  
            {/* Escaneo de Series */}
            <div className="col-span-2">
              <label className="block text-gray-700">Escanear Serie</label>
              <input
                type="text"
                placeholder="Escanear número de serie"
                onKeyDown={agregarSerie}
                disabled={modelo === ""}
                className="w-full p-2 border-none bg-gray-200 rounded"
              />
            </div>
  
            {/* Botón de agregar */}
            <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700">
              Agregar
            </button>
            

          </form>
        </div>
  
        {/* Sección de lista de series */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/3 flex flex-col">
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


