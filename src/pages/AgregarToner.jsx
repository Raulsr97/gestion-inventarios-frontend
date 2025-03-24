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

      if (cliente === 'nuevo' && nuevoCliente) {
        
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
  