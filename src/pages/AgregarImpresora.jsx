import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import SelectDinamico from "../components/SelectDinamico"
import InputModelo from "../components/InputModelo"
import InputSerie from "../components/InputSerie"
import BotonAgregar from "../components/BotonAgregar"
import ListaSeries from "../components/ListaSeries"

function AgregarImpresora () {
  const [modelo, setModelo ] = useState('')
  const [estado, setEstado] = useState('')
  const [tipo, setTipo] = useState('')
  const [ubicacion, setUbicacion] = useState('Almacén')
  const [ marca, setMarca] = useState('')
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [flujo, setFlujo] = useState('')
  const [origenRecoleccion, setOrigenRecoleccion] = useState('')
  const [accesorios, setAccesorios] = useState([])

  // Estados para almacenar la lista de clientes, proyectos y marcas
  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [proveedores, setProveedores] = useState([])
  // Etados para manejar nuevos clientes, proyectos, marcas y proovedores
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
    if (e.key === 'Enter') {
      e.preventDefault() // Evita que el formulario se recargue

      let rawInput = e.target.value.toUpperCase().trim()

      // Extraer los signos de pesos si los hay
      const partes = rawInput.split('$')
      const serie = partes.length === 3 ? partes[1] : rawInput

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

    try {
      let marcaId = marca
      let clienteId = cliente
      let proyectoId = proyecto 
      let proveedorId = proveedor 

      // Crear marca si no existe 
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

      // Crear Cliente si no existe
      if (cliente === "nuevo" && nuevoCliente) {
        const nuevoClienteMayusculas = nuevoCliente.toUpperCase()

        const res = await fetch("http://localhost:3000/api/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoClienteMayusculas }),
        });
    
        if (!res.ok) {
            toast.error("Error al registrar el nuevo cliente.");
            return;
        }
    
        const data = await res.json();
        clienteId = data.id;  // ✅ Asignamos el ID correcto del cliente creado
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

        // registramos las impresoras con los IDs ya generados
        const datosRegistro = {
          modelo,
          estado,
          marca_id: marcaId,
          tipo,
          ubicacion,
          cliente_id: clienteId,
          proyecto_id: proyectoId,
          tiene_accesorios: tieneAccesorios,
          accesorios,
          series,
          proveedor_id: proveedorId,
          flujo,
          origen_recoleccion: origenRecoleccion
        };

        console.log("Datos que se enviarán al backend:", {
          modelo,
          estado,
          marca_id: marcaId,
          tipo,
          ubicacion,
          cliente_id: clienteId,
          proyecto_id: proyectoId,
          tiene_accesorios: tieneAccesorios,
          accesorios,
          series,
          proveedorId,
          flujo,
          origen_recoleccion: origenRecoleccion
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

        // Si todo salió bien, mostramos mensaje de éxito y limpiamos el formulario
        toast.success("Impresoras registradas exitosamente!");
      
        setMarca("");
        setTipo("");
        setModelo("");
        setEstado("");
        setCliente("");
        setProyecto("");
        setNuevoCliente("");
        setNuevoProyecto("");
        setSeries([]);
        setBloquearCampos(false);
        setTieneAccesorios(false);
        setProveedor("")
        setFlujo('')
        setOrigenRecoleccion('')
        setAccesorios([])
      
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error(error.message);
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
          <SelectDinamico 
            opciones={marcas}
            valorSeleccionado={marca}
            setValorSeleccionado={setMarca}
            setNuevoValor={setNuevaMarca}
            placeholder={'Marca'}
            disabled={bloquearCampos}
            permitirNuevo={true}
          />
            <div className={`relative ${!marca ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Modelo */}
              <InputModelo 
                value={modelo}
                onChange={setModelo}
                disabled={!marca || bloquearCampos}
              />
            </div>

            <div className={`relative ${!marca || !modelo ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Estado */}
              <SelectDinamico 
                opciones={[
                  { id: "nueva", nombre: "Nueva" },
                  { id: "usada", nombre: "Usada" }
                ]}
                valorSeleccionado={estado} 
                setValorSeleccionado={setEstado} 
                placeholder="Estado"
                disabled={!marca || !modelo || bloquearCampos}
                permitirNuevo={false}
                className={!marca ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>

            <div className={`relative ${!marca || !modelo || !estado ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Tipo */}
              <SelectDinamico 
                opciones={[
                  {id: 'compra', nombre:'Compra'},
                  {id: 'distribucion', nombre:'Distribución'}
                ]}
                valorSeleccionado={tipo}
                setValorSeleccionado={setTipo}
                placeholder='Tipo'
                disabled={!marca || !modelo || !estado || bloquearCampos}
                permitirNuevo={false}
              />
            </div>

            <div className={`relative ${!marca || !modelo || !estado || !tipo ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Cliente */}
              <SelectDinamico 
                opciones={clientes}
                valorSeleccionado={cliente}
                setValorSeleccionado={setCliente}
                setNuevoValor={setNuevoCliente} // Guardamos temporalmente el nuevo cliente
                placeholder='Cliente'
                disabled={!marca || !modelo || !estado || !tipo || bloquearCampos}
                permitirNuevo={true} // Permite agregar nuevos clientes
              />
            </div>
            
            <div className={`relative ${!marca || !modelo || !estado || !tipo || tipo === 'compra' || !cliente ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Proyecto */}
              <SelectDinamico
                opciones={proyectos}
                valorSeleccionado={proyecto}
                setValorSeleccionado={setProyecto}
                setNuevoValor={setNuevoProyecto}
                placeholder={'Proyecto'}
                disabled={!cliente || !marca || !modelo || !estado || !tipo || tipo === 'compra' || bloquearCampos}
                permitirNuevo={true}
              />
            </div>

            <div className={`relative ${!marca || !modelo || !estado || !tipo ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Proveedor */}
              <SelectDinamico
                opciones={proveedores}
                valorSeleccionado={proveedor}
                setValorSeleccionado={setProveedor}
                setNuevoValor={setNuevoProveedor}
                placeholder={'Proveedor'}
                disabled={!marca || !modelo || !estado || !tipo || bloquearCampos}
                permitirNuevo={true}
              />
            </div>

            <div className={`relative ${tipo === 'compra' || !tipo ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Flujo */}
              <SelectDinamico 
                opciones={[
                  {id: 'Recolección', nombre: 'Recolección'},
                  {id: 'Distribución', nombre: 'Distribución'}
                ]}
                valorSeleccionado={flujo}
                setValorSeleccionado={setFlujo}
                placeholder='Flujo'
                disabled={tipo === 'compra' || bloquearCampos}
                permitirNuevo={false}
              />
            </div>

            <div className={`relative ${tipo === 'compra'  ? "opacity-50 " : ""}`}>
              {/* Origen de Recoleccion */}
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded text-sm-bold focus:border-blue-700 focus:ring-0 focus:outline-none"
                placeholder="Origen recolección"
                value={origenRecoleccion}
                onChange={(e) => setOrigenRecoleccion(e.target.value.toUpperCase())}
                disabled={ tipo === 'compra' || bloquearCampos }
              />
            </div>
            
            {/* Tiene Accesorios - Checkbox estilo botón */}
            <div className="flex items-center gap-3 ">
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

            {/* Formulario para ingresar accesorios si el checkbox está activado */}
            {tieneAccesorios && (
              <div className="mt-4 border p-3 rounded-md col-span-2 relative w-full">
                <h3 className="text-gray-700 font-medium text-sm mb-2">Accesorios</h3>

                {accesorios.map((numParte, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                      placeholder="Número de parte"
                      value={numParte}
                      onChange={(e) => {
                        const nuevosAccesorios = [...accesorios];
                        nuevosAccesorios[index] = e.target.value.toUpperCase();
                        setAccesorios(nuevosAccesorios);
                      }}
                    />
                    <button 
                      type="button"
                      className="text-red-500 px-2 py-1 text-xs rounded-md hover:bg-red-100 transition"
                      onClick={() => {
                        setAccesorios(accesorios.filter((_, i) => i !== index));
                      }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
                

                <button
                  type="button"
                  className="mt-2 text-blue-600 text-xs flex items-center gap-1 hover:underline"
                  onClick={() => setAccesorios([...accesorios, ""])}
                >
                  ➕ Agregar Accesorio
                </button>
              </div>
            )}
            
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


