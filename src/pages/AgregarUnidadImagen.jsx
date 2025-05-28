import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SelectDinamico from "../components/SelectDinamico"
import InputModelo from "../components/InputModelo"
import InputSerie from "../components/InputSerie"
import BotonAgregar from "../components/BotonAgregar"
import ListaSeries from "../components/ListaSeries"

const backendUrl = import.meta.env.VITE_BACKEND_URL

function AgregarUnidadImagen() {
  const [modelo, setModelo] = useState('')
  const [tipo, setTipo] = useState('')
  const [ubicacion, setUbicacion] = useState('Almacén')
  const [marca, setMarca] = useState('')
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [proveedor, setProveedor] = useState('')

  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [proveedores, setProveedores] = useState([])

  const [nuevoCliente, setNuevoCliente] = useState('')
  const [nuevoProyecto, setNuevoProyecto] = useState('')
  const [nuevaMarca, setNuevaMarca] = useState('')
  const [nuevoProveedor, setNuevoProveedor] = useState('')

  const [series, setSeries] = useState([])
  const [bloquearCampos, setBloquearCampos] = useState(false)

  useEffect(() => {
     fetch(`${backendUrl}/api/clientes`)
      .then((res) => res.json())
      .then((data) => {
        setClientes(data)
      })
    
    fetch(`${backendUrl}/api/proyectos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Proyectos obtenidos:", data); 
        setProyectos(data)
      })
    
    fetch(`${backendUrl}/api/marcas`)
      .then((res) => res.json())
      .then((data) => {
        setMarcas(data)
      }) 

    fetch(`${backendUrl}/api/proveedores`)
    .then((res) => res.json())
    .then((data) => {
      setProveedores(data)
    }) 
  }, [])

  const agregarSerie = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const serie = e.target.value.toUpperCase().trim()
      if (serie === '') return
      if (series.includes(serie)) {
        toast.error('Esta serie ya fue escaneada')
        return
      }
      setSeries([...series, serie])
      e.target.value = ''
      if (series.length === 0) setBloquearCampos(true)
    }
  }

  const eliminarSerie = (serie) => {
    const nuevasSeries = series.filter((s) => s !== serie)
    setSeries(nuevasSeries)
    if (nuevasSeries.length === 0) setBloquearCampos(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!modelo || series.length === 0) {
      toast.error("Debes seleccionar un modelo y escanear al menos una serie.")
      return
    }

    try {
      let marcaId = marca
      let clienteId = cliente
      let proyectoId = proyecto
      let proveedorId = proveedor

      if (marca === 'nuevo' && nuevaMarca) {
        const res = await fetch(`${backendUrl}/api/marcas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevaMarca.toUpperCase() })
        })
        if (!res.ok) {
          toast.error('Error al registrar la nueva marca')
          return
        }
        const data = await res.json()
        marcaId = data.id
      }

      if (cliente === 'nuevo' && nuevoCliente) {
        const res = await fetch(`${backendUrl}/api/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevoCliente.toUpperCase() })
        })
        if (!res.ok) {
          toast.error('Error al registrar el nuevo cliente')
          return
        }
        const data = await res.json()
        clienteId = data.id
      }

      if (proyecto === 'nuevo' && nuevoProyecto) {
        if (!clienteId) {
          toast.error('Debes seleccionar un cliente antes de agregar un proyecto.')
          return
        }
        const res = await fetch(`${backendUrl}/api/proyectos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nuevoProyecto.toUpperCase(),
            cliente_id: clienteId
          })
        })
        if (!res.ok) {
          toast.error('Error al registrar el nuevo proyecto')
          return
        }
        const data = await res.json()
        proyectoId = data.id
      }

      if (proveedor === 'nuevo' && nuevoProveedor) {
        const res = await fetch(`${backendUrl}/api/proveedores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevoProveedor.toUpperCase() })
        })
        if (!res.ok) {
          toast.error('Error al registrar el nuevo proveedor')
          return
        }
        const data = await res.json()
        proveedorId = data.id
      }

      const datosRegistro = {
        modelo,
        tipo,
        ubicacion,
        marca_id: marcaId,
        cliente_id: clienteId,
        proyecto_id: proyectoId,
        proveedor_id: proveedorId,
        series
      }

      const response = await fetch(`${backendUrl}/api/unidades-imagen/registro-lote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosRegistro),
      });

      if (!response.ok) {
        toast.error("Error al registrar unidades de imagen.");
        return;
      }

      toast.success("Unidades de imagen registradas exitosamente!");

      setMarca("");
      setModelo("");
      setTipo("");
      setCliente("");
      setProyecto("");
      setNuevoCliente("");
      setNuevoProyecto("");
      setSeries([]);
      setBloquearCampos(false);
      setProveedor("");
      setNuevoProveedor("");
      setNuevaMarca("");
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error(error.message);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-6 px-10 w-full lg:w-1/3">
          <h1 className="text-2xl font-semibold text-gray-700 mb-8 mt-6">Agregar Unidades de Imagen</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

            <SelectDinamico 
              opciones={marcas}
              valorSeleccionado={marca}
              setValorSeleccionado={setMarca}
              setNuevoValor={setNuevaMarca}
              placeholder="Marca"
              disabled={bloquearCampos}
              permitirNuevo={true}
            />

            <div className={`relative ${!marca ? "opacity-50 pointer-events-none" : ""}`}>
              <InputModelo 
                value={modelo}
                onChange={setModelo}
                disabled={!marca || bloquearCampos}
              />
            </div>

            <div className={`relative ${!marca || !modelo ? "opacity-50 pointer-events-none" : ""}`}>
              <SelectDinamico 
                opciones={[
                  { id: 'compra', nombre: 'Compra' },
                  { id: 'distribucion', nombre: 'Distribución' }
                ]}
                valorSeleccionado={tipo}
                setValorSeleccionado={setTipo}
                placeholder="Tipo"
                disabled={!marca || !modelo || bloquearCampos}
                permitirNuevo={false}
              />
            </div>

            <div className={`relative ${!marca || !modelo || !tipo ? "opacity-50 pointer-events-none" : ""}`}>
              <SelectDinamico 
                opciones={clientes}
                valorSeleccionado={cliente}
                setValorSeleccionado={setCliente}
                setNuevoValor={setNuevoCliente}
                placeholder="Cliente"
                disabled={!marca || !modelo || !tipo || bloquearCampos}
                permitirNuevo={true}
              />
            </div>

            <div className={`relative ${!marca || !modelo || tipo !== 'distribucion' || !cliente ? "opacity-50 pointer-events-none" : ""}`}>
              <SelectDinamico 
                opciones={proyectos}
                valorSeleccionado={proyecto}
                setValorSeleccionado={setProyecto}
                setNuevoValor={setNuevoProyecto}
                placeholder="Proyecto"
                disabled={!marca || !modelo || tipo !== 'distribucion' || !cliente || bloquearCampos}
                permitirNuevo={true}
              />
            </div>

            <div className={`relative ${!marca || !modelo || !tipo ? "opacity-50 pointer-events-none" : ""}`}>
              <SelectDinamico 
                opciones={proveedores}
                valorSeleccionado={proveedor}
                setValorSeleccionado={setProveedor}
                setNuevoValor={setNuevoProveedor}
                placeholder="Proveedor"
                disabled={!marca || !modelo || !tipo || bloquearCampos}
                permitirNuevo={true}
              />
            </div>

            <InputSerie 
              onScan={agregarSerie}
              disabled={modelo === ''}
            />

            <BotonAgregar onClick={handleSubmit} />

          </form>
        </div>

        <ListaSeries 
          series={series}
          onDeleteSerie={eliminarSerie}
        />
      </div>
    </div>
  );
}

export default AgregarUnidadImagen;
