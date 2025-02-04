import { useEffect, useState } from "react"

function AgregarImpresora () {
  const [modelo, setModelo ] = useState('')
  const [estado, setEstado] = useState('Nueva')
  const [ubicacion, setUbicacion] = useState('Almacén')
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
      setModelo('')
      setEstado('Nueva')
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

  return(
    <div>
      <form action="" onSubmit={handleSubmit}>
        {/* Input para agregar modelo */}
        <input 
        type="text" 
        name="modelo" 
        placeholder="Modelo" 
        onChange={(e) => setModelo(e.target.value)}
        disabled={bloquearCampos}
        />
        
        {/* Select estado(nuevo o usado) */}
        <select name="Estado" onChange={(e) => setEstado(e.target.value)} disabled={bloquearCampos}>
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
        </select>

        {/* Select cliente */}
        <select name="Cliente" onChange={(e) => setCliente(e.target.value)}  disabled={bloquearCampos}>
          <option value="">Selecciona un Cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
          <option value="nuevo">Agregar nuevo Cliente</option>
        </select>
        {/* Input para escribir un nuevo cliente */}
        {cliente === 'nuevo' && (
          <input 
            type="text"
            placeholder="Nuevo Cliente"
            value={nuevoCliente}
            onChange={(e) => setNuevoCliente(e.target.value)} 
          />
        )}

        {/* Select proyecto */}
        <select name="Proyecto" onChange={(e) => setProyecto(e.target.value)} disabled={bloquearCampos}>
          <option value="">Selecciona un Proyecto</option>
          {proyectos.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
          <option value="nuevo">Agregar nuevo Proyecto</option>
        </select>
        {/* Input para escribir un nuevo cliente */}
        {proyecto === 'nuevo' && (
          <input 
            type="text"
            placeholder="Nuevo Proyecto"
            value={nuevoProyecto}
            onChange={(e) => setNuevoProyecto(e.target.value)} 
          />
        )}

        {/* Input para escanear series */}
        <input 
          type="text"
          placeholder="Escanear número de serie"
          onKeyDown={(e) => agregarSerie(e)} 
          disabled={modelo === ''} // Deshabilita si no de ha seleccionado un modelo
        />
          
        
        {/* Boton para agregar a la lista de series */}
        <button>Agregar</button>
      </form>

      {/* Contador de series */}
      <h3>Series escaneadas: {series.length}</h3>

      {/* Lista de series escaneadas */}
      <ul>
        {series.map((serie, index) => (
          <li key={index}>
            {serie}
            <button onClick={() => eliminarSerie(serie)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default AgregarImpresora