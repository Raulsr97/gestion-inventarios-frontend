import { useEffect, useState } from "react"
import { toast } from "react-toastify"

function AgregarToner() {
  const [marca, setMarca] = useState('')
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [series, setSeries] = useState([])
  const [bloquearCampos, setBloquearCampos] = useState(false)

  // Etados para manejar nuevos clientes, proyectos, marcas y proovedores
  const [nuevoCliente, setNuevoCliente] = useState('')
  const [nuevoProyecto, setNuevoProyecto] = useState('')
  const [nuevaMarca, setNuevaMarca] = useState('')
  const [nuevoProveedor, setNuevoProveedor] = useState('')


  useEffect(() => {
    fetch("http://localhost:3000/api/clientes")
      .then((res) => res.json())
      .then((data) => {
        setClientes(data)
      })
    
    fetch("http://localhost:3000/api/proyectos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Proyectos obtenidos:", data); 
        setProyectos(data)
      })
    
    fetch("http://localhost:3000/api/marcas")
      .then((res) => res.json())
      .then((data) => {
        setMarcas(data)
      }) 

    fetch("http://localhost:3000/api/proveedores")
    .then((res) => res.json())
    .then((data) => {
      setProveedores(data)
    }) 
  }, [])

  const agregarSerie = (e) => {
    if (e.key === 'enter') {
      e.preventDefault()

      const serie = e.target.value.toUpperCase().trim()

      if (serie === '') return
      if (series.includes(serie)) {
        toast.error('Esta serie ya fue escaneada')
        return
      }

      setSeries([...series, serie])
      e.target.value = ''

      if (series.length === 0) {
        setBloquearCampos(true)
      }
    }
  }

  const eliminarSerie = (serie) => {
    const nuevasSeries = series.filter(s => s !== serie)
    setSeries(nuevasSeries)

    if (nuevasSeries.length === 0) {
      setBloquearCampos(false)
    }


  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!modelo && series.length === 0) {
      toast.error("Debes seleccionar un modelo y escanear al menos una serie.")
      return 
    }

    try {
      let marcaId = marca
      let clienteId = cliente
      let proyectoId = proyecto
      let proveedorId = proveedor

      if (marca === 'nuevo' && nuevaMarca) {
        const nuevaMarcaMayusculas = nuevaMarca.toUpperCase()

        const res = await fetch("http://localhost:3000/api/marcas", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({nombre: nuevaMarcaMayusculas})
        })

        if (!res.ok) {
          toast.error('Error al registrar la nueva marca')
          return
        } 
        
        const data = await res.json()
        marcaId = data.id
      }

      if (cliente === 'nuevo' && nuevoCliente) {
        const nuevoClienteMayusuculas = nuevoCliente.toUpperCase()

        const res = await fetch("http://localhost:3000/api/clientes", {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ nombre: nuevoClienteMayusuculas})
        })   
        
        if (!res.ok) {
          toast.error("Error al registrar el nuevo cliente.")
          return
        }

        const data = await res.json()
        clienteId = data.id 
      }

      // Crear Proyecto si no existe (y asignar cliente_id si aplica)
      if (proyecto === "nuevo" && nuevoProyecto) {
        const nuevoProyectoMayusculas = nuevoProyecto.toUpperCase()

        if (!cliente) {
          toast.error("Debes seleccionar un cliente antes de agregar un proyecto.");
          return;
        }
      
        const res = await fetch("http://localhost:3000/api/proyectos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            nombre: nuevoProyectoMayusculas,
            cliente_id: clienteId // Relacionamos el proyecto con el cliente seleccionado
          }),
        });
      
        if (!res.ok) {
          toast.error("Error al registrar el nuevo proyecto.");
          return;
        }
      
        const data = await res.json(); 
        proyectoId = data.id
      }

      // Crear Proveedor si no existe
      if (proveedor === "nuevo" && nuevoProveedor) {
        const nuevoProveedorMayusculas = nuevoProveedor

        const res = await fetch("http://localhost:3000/api/proveedores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoProveedorMayusculas })
        });
        if (!res.ok) throw new Error("Error al registrar el nuevo proveedor.");
        const data = await res.json();
        proveedorId = data.id;
      }

      // Registramos los toners con los ids ya generados
      const datosRegistro = {
        modelo,
        marca_id: marcaId,
        tipo,
        ubicacion,
        cliente_id: clienteId,
        proyecto_id: proyectoId,
        series,
        proveedor_id: proveedorId,
      }
            


      
    } catch (error) {
      
    }
  }

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Página para Agregar Tóner</h1>
      </div>
    );
  }
  
  export default AgregarToner;
  