import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SelectDinamico from "../components/SelectDinamico"
import InputModelo from "../components/InputModelo"
import InputSerie from "../components/InputSerie"
import BotonAgregar from "../components/BotonAgregar"
import ListaSeries from "../components/ListaSeries"

function AgregarImpresora () {
  const [modelo, setModelo ] = useState('')
  const [estado, setEstado] = useState('Nueva')
  const [tipo, setTipo] = useState('')
  const [ubicacion, setUbicacion] = useState('Almacén')
  const [ marca, setMarca] = useState('')
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [proveedor, setProveedor] = useState('')
  // Estados para almacenar la lista de clientes, proyectos y marcas
  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [proveedores, setProveedores] = useState([])
  // Etados para manejar nuevos clientes, proyectos y marcas
  const [nuevoCliente, setNuevoCliente] = useState('')
  const [nuevoProyecto, setNuevoProyecto] = useState('')
  const [nuevaMarca, setNuevaMarca] = useState('')
  const [nuevoProveedor, setNuevoProveedor] = useState('')
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
    if (e.key === 'Enter') {
      e.preventDefault() // Evita que el formulario se recargue

      const serie = e.target.value.toUpperCase().trim()

      if (serie === '') return // Evita agregar una serie vacía  
      if (series.includes(serie)) {
        toast.error('Esta serie ya fue escaneada')
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
    event.preventDefault();
  
    if (!modelo || series.length === 0) {
      toast.error("Debes seleccionar un modelo y escanear al menos una serie.");
      return;
    }

    // 📌 Intentamos registrar las impresoras primero
    const datosRegistro = {
      modelo,
      estado,
      marca_id: marca === 'nuevo' ? null : marca,
      tipo,
      ubicacion,
      cliente_id: cliente === 'nuevo' ? null : cliente,
      proyecto_id: proyecto === 'nuevo' ? null : proyecto,
      tiene_accesorios: tieneAccesorios,
      series,
      proveedor_id: proveedor === 'nuevo' ? null : proveedor
    };

    console.log("Datos que se enviarán al backend:", {
      modelo,
      estado,
      marca_id: marca === "nuevo" ? null : marca,  // 🔍 Aquí revisamos
      tipo,
      ubicacion,
      cliente_id: cliente === "nuevo" ? null : cliente,
      proyecto_id: proyecto === "nuevo" ? null : proyecto,
      tiene_accesorios: tieneAccesorios,
      series,
      proveedor_id: proveedor === 'nuevo' ? null : proveedor
    });
  
    const response = await fetch("http://localhost:3000/api/impresoras/registrar-lote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosRegistro),
    });
  
    const responseData = await response.json();
    console.log("Respuesta del backend:", responseData);
  
    if (!response.ok) {
      toast.error("Error al registrar impresoras.");
      return; // 🚨 DETENEMOS la ejecución si falla el registro de impresoras
    }

    // 🟢 Si el usuario ingresó una nueva marca, lo enviamos al backend solo si el registro de impresoras fue exitoso
    let marcaId = marca
    if (marca === "nuevo" && nuevaMarca) {
      const res = await fetch("http://localhost:3000/api/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaMarca }),
      });
  
      if (!res.ok) {
        toast.error("Error al registrar la nueva marca.");
        return; // 🚨 Si hay error al registrar la marca, detenemos la ejecución
      }
  
      const data = await res.json();
      marcaId = data.id;
    }
  
    // 🟢 Si el usuario ingresó un nuevo Cliente, lo enviamos al backend solo si el registro de impresoras fue exitoso
    let clienteId = cliente
    if (cliente === "nuevo" && nuevoCliente) {
      const res = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoCliente }),
      });
  
      if (!res.ok) {
        toast.error("Error al registrar el nuevo cliente.");
        return; // 🚨 Si hay error al registrar el cliente, detenemos la ejecución
      }
  
      const data = await res.json();
      clienteId = data.id;
    }
  
    // 🔵 Si el usuario ingresó un nuevo Proyecto, lo enviamos al backend solo si el registro de impresoras fue exitoso
    let proyectoId = proyecto
    if (proyecto === "nuevo" && nuevoProyecto) {
      const res = await fetch("http://localhost:3000/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoProyecto }),
      });
  
      if (!res.ok) {
        toast.error("Error al registrar el nuevo proyecto.");
        return; // 🚨 Si hay error al registrar el proyecto, detenemos la ejecución
      }
  
      const data = await res.json(); 
      proyectoId = data.id;
    }

    let proveedorId = proveedor
    if (proveedor === "nuevo" && nuevoProveedor) {
      const res = await fetch("http://localhost:3000/api/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoProveedor }),
      });
  
      if (!res.ok) {
        toast.error("Error al registrar el nuevo proveedor.");
        return; // Si hay error al registrar el proveedor, detenemos la ejecución
      }
  
      const data = await res.json(); 
      proveedorId = data.id;
    }
  
    // 🔄 Si todo salió bien, mostramos mensaje de éxito y limpiamos el formulario
    toast.success("Impresoras registradas exitosamente!");
  
    setMarca("");
    setTipo("");
    setModelo("");
    setEstado("Estado");
    setCliente("");
    setProyecto("");
    setNuevoCliente("");
    setNuevoProyecto("");
    setSeries([]);
    setBloquearCampos(false);
    setTieneAccesorios(false);
    setProveedor("")
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
     {/* Contenedor principal */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-6 px-10 w-full lg:w-1/3">
          <h1 className="text-2xl font-semibold text-gray-700 mb-8 mt-6">Agregar Impresoras</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <SelectDinamico 
              opciones={marcas}
              valorSeleccionado={marca}
              setValorSeleccionado={setMarca}
              setNuevoValor={setNuevaMarca}
              placeholder={'Marca'}
              disabled={bloquearCampos}
              permitirNuevo={true}
            />
            
            {/* Modelo */}
            <InputModelo 
              value={modelo}
              onChange={setModelo}
              disabled={bloquearCampos}
            />

            {/* Estado */}
            <SelectDinamico 
              opciones={[
                { id: "nueva", nombre: "Nueva" },
                { id: "usada", nombre: "Usada" }
              ]}
              valorSeleccionado={estado} 
              setValorSeleccionado={setEstado} 
              placeholder="Estado"
              disabled={bloquearCampos}
              permitirNuevo={false}
            />

            {/* Tipo */}
            <SelectDinamico 
              opciones={[
                {id: 'propia', nombre:'Compra'},
                {id: 'distribucion', nombre:'Distribucion'}
              ]}
              valorSeleccionado={tipo}
              setValorSeleccionado={setTipo}
              placeholder='Tipo'
              disabled={bloquearCampos}
              permitirNuevo={false}
            />

            {/* Cliente */}
            <SelectDinamico 
              opciones={clientes}
              valorSeleccionado={cliente}
              setValorSeleccionado={setCliente}
              setNuevoValor={setNuevoCliente} // Guardamos temporalmente el nuevo cliente
              placeholder='Cliente'
              disabled={bloquearCampos}
              permitirNuevo={true} // Permite agregar nuevos clientes
            />

            {/* Proyecto */}
            <SelectDinamico
              opciones={proyectos}
              valorSeleccionado={proyecto}
              setValorSeleccionado={setProyecto}
              setNuevoValor={setNuevoProyecto}
              placeholder={'Proyecto'}
              disabled={bloquearCampos}
              permitirNuevo={true}
            />

            {/* Proveedor */}
            <SelectDinamico
              opciones={proveedores}
              valorSeleccionado={proveedor}
              setValorSeleccionado={setProveedor}
              setNuevoValor={setNuevoProveedor}
              placeholder={'Proveedor'}
              disabled={bloquearCampos}
              permitirNuevo={true}
            />
            
            
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
              <InputSerie 
                onScan={agregarSerie}
                disabled={modelo === ''}
              />
  
            {/* Botón de agregar */}
            <BotonAgregar onClick={handleSubmit}/>
          </form>
        </div>
          
        {/* Sección de lista de series */}
        <ListaSeries
          series={series}
          onDeleteSerie={eliminarSerie}
        />
      </div>
    </div>
  );
  
}
export default AgregarImpresora


