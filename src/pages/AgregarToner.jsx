import { useEffect, useState } from "react"
import { toast } from "react-toastify"

function AgregarToner() {
  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [series, setSeries] = useState([])
  const [bloquearCampos, setBloquearCampos] = useState(false)


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

  const eliminarSerie = () => {
    
  }

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Página para Agregar Tóner</h1>
      </div>
    );
  }
  
  export default AgregarToner;
  