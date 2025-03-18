import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ListaImpresoras from "../components/ListaImpresoras";
import SeleccionEmpresa from "../components/SeleccionEmpresa";
import AsignarCliente from "../components/AsignarCliente";
import FormularioRemision from "../components/FormularioRemision";



function GestionImpresoras() {
  // Estado para almacenar las impresoras que se encuentran en almacen
  const [impresorasDisponibles ,setImpresorasDisponibles] = useState([])
  // Estado para almacenar las impresoras que se van a seleccionar para la remisión
  const [impresorasSeleccionadas, setImpresorasSeleccionadas] = useState([])
  // Control de qué pasos están activos (solo el primero inicia activo)
  const [pasoActivo, setPasoActivo] = useState(1)
  // Estado para almacenar las empresas traídas del backend
  const [empresas, setEmpresas] = useState([])
  // Estado para almacenar la empresa seleccionada
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('')
  // Estado que indica si se debe seleccionar un cliente
  const [requireCliente, setRequireCliente] = useState(false)
  // Estado que valida que todas las series seleccionadas tengan el mismo cliente
  const [clienteUnico, setClienteUnico] = useState(null)
  // Estado que almacena la lista de clientes
  const [clientes, setClientes] = useState([])  
  // Estado que almacena la lista de proyectos
  const [proyectos, setProyectos] = useState([])  
  // Estado para almacenar el cliente selecionado
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')
  
  
  const navigate = useNavigate()
  

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then(res => res.json())
      .then(data => {
        // Filtrar solo las impresoras que no tienen fecha de salida
        const disponibles = data.filter(impresora => !impresora.fecha_salida)
        setImpresorasDisponibles(disponibles)
      })
      .catch(error => console.error('Error al obtener las impresoras', error))
    
    fetch("http://localhost:3000/api/empresas")
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(error => console.error('Error al obtener las empresas', error))
    
    fetch("http://localhost:3000/api/clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(error => console.error("Error al obtener clientes", error));
  
    fetch("http://localhost:3000/api/proyectos")
      .then(res => res.json())
      .then(data => setProyectos(data))
      .catch(error => console.error("Error al obtener proyectos", error));

    
  }, [])

  // Funcion para avanzar al siguiente paso
  const avanzarPaso = () => {
    if (pasoActivo === 1) {
      if(!requireCliente) {
        setPasoActivo(3) //Saltamos directo al paso 3 si ya hay cliente
      } else {
        setPasoActivo(2) //Si falta cliente, avanzamos al paso 2
      }
    } else if(pasoActivo === 2) {
      setPasoActivo(3); // Después de seleccionar cliente, avanzamos al paso 3
    } else if (pasoActivo === 3) {
      setPasoActivo(4) // Despues de seleccionar empresa pasamos al paso 4
    }
  }

  // Funcion para manejar las impresoras seleccionadas
  const manejarSeleccion = (serie) => {
    setImpresorasSeleccionadas(prevSeleccionadas => {
      let nuevaSeleccion

      if (prevSeleccionadas.includes(serie)) {
        // Si ya esta seleccionada la quitamos
        nuevaSeleccion = prevSeleccionadas.filter(s => s !== serie)
        console.log(`❌ Eliminada: ${serie}`);
      } else {
        // Si no esta seleccionada la agregamos
        nuevaSeleccion = [...prevSeleccionadas, serie]
        console.log(`✅ Agregada: ${serie}`);
      }

      // Obtener los objetos de impresoras que corresponden a las series seleccionadas
      const impresorasFiltradas = nuevaSeleccion.map(serie => impresorasDisponibles.find(i => i.serie === serie))

      // Extraer clientes y proyectos de las impresoras seleccionadas
      const clientes = impresorasFiltradas.map(i => i?.cliente_id).filter(Boolean)
      const proyectos = impresorasFiltradas.map(i => i?.proyecto_id).filter(Boolean)

      // Validaciones
      const clienteDiferente = new Set(clientes).size > 1 // Si hay mas de un cliente
      const algunasSinCliente = clientes.length !== nuevaSeleccion.length // Si hay series sin cliente
      const proyectoDiferente = new Set(proyectos).size > 1 // Si hay mas de un proyecto
      const haySeriesConProyecto = proyectos.length > 0 // Si al menos una serie tiene proyecto
      const haySeriesSinProyecto = proyectos.length !== nuevaSeleccion.length // Si alguna serie no tiene proyecto

      // ❌ Si hay clientes diferentes, bloquear la selección
      if (clienteDiferente) {
        toast.warn("No puedes seleccionar impresoras con diferentes clientes.")
        return prevSeleccionadas
      }

      // ✅ Si algunas series no tienen cliente, pero otras sí, asignamos automáticamente el primero encontrado
      if (algunasSinCliente && clientes.length > 0) {
        setClienteUnico(clientes[0]) // Asignar el cliente automaticamente
      } else if (clientes.length === 0) {
        setRequireCliente(true) // Activar la seleccion manual del cliente
        setClienteUnico(null)
      } else {
        setRequireCliente(false)
        setClienteUnico(clientes[0])
      }

      // ❌ Si hay diferentes proyectos, bloquear la selección
      if (proyectoDiferente) {
        toast.warn("No puedes seleccionar impresoras con diferentes proyectos.");
        return prevSeleccionadas; // No permite la selección
      }

      // ❌ Si hay series con proyecto y otras sin, bloquear la selección
      if (haySeriesConProyecto && haySeriesSinProyecto) {
        toast.warn("No puedes seleccionar impresoras con proyecto junto con otras que no tienen proyecto.");
        return prevSeleccionadas;
      }

      console.log("Estado actual de seleccionadas:", nuevaSeleccion);
      return nuevaSeleccion
    });
  }

  // Funcion para recopilar los datos que se enviaran a la pagina VistaPreviaRemisionEntrega.jsx
  const manejarGenerarRemision = ({ destinatario, direccionEntrega, notas}) => {
    // 🔹 Extraer clientes y proyectos desde las series seleccionadas
    const clientesUnicos = new Set(impresorasSeleccionadas.map(i => i.cliente_id).filter(Boolean));
    const proyectosUnicos = new Set(impresorasSeleccionadas.map(i => i.proyecto_id).filter(Boolean));

    // 🔹 Determinar el nombre del cliente
    let clienteFinal = "Sin Cliente";
    if (clientesUnicos.size === 1) {
        const clienteId = [...clientesUnicos][0];
        const clienteEncontrado = clientes.find(c => c.id === clienteId);
        clienteFinal = clienteEncontrado ? clienteEncontrado.nombre : "Cliente No Encontrado";
    } else if (clientesUnicos.size > 1) {
        clienteFinal = "Varios Clientes";
    } else if (clienteSeleccionado) {
        const clienteManual = clientes.find(c => c.id === Number(clienteSeleccionado));
        clienteFinal = clienteManual ? clienteManual.nombre : "Cliente No Encontrado";
    }

    // 🔹 Determinar el nombre del proyecto
    let proyectoFinal = "Sin Proyecto";
    if (proyectosUnicos.size === 1) {
        const proyectoId = [...proyectosUnicos][0];
        const proyectoEncontrado = proyectos.find(p => p.id === proyectoId);
        proyectoFinal = proyectoEncontrado ? proyectoEncontrado.nombre : "Proyecto No Encontrado";
    } else if (proyectosUnicos.size > 1) {
        proyectoFinal = "Varios Proyectos";
    }

    // 🔹 Si las series ya tienen cliente/proyecto asignado, usarlos
    if (clienteFinal === "Sin Cliente" && impresorasSeleccionadas.length > 0) {
        const primeraSerie = impresorasSeleccionadas[0];
        const clienteExistente = clientes.find(c => c.id === primeraSerie.cliente_id);
        if (clienteExistente) {
            clienteFinal = clienteExistente.nombre;
        }
    }

    if (proyectoFinal === "Sin Proyecto" && impresorasSeleccionadas.length > 0) {
        const primeraSerie = impresorasSeleccionadas[0];
        const proyectoExistente = proyectos.find(p => p.id === primeraSerie.proyecto_id);
        if (proyectoExistente) {
            proyectoFinal = proyectoExistente.nombre;
        }
    }
    

    // Recopilamos todam la informacion
    const remisionData = {
      destinatario,
      direccionEntrega,
      notas,
      cliente: clienteFinal,
      proyecto: proyectoFinal,
      series: impresorasSeleccionadas,
      empresa: empresaSeleccionada
    }

    // Redirigir a VistaPreviaRemisionEntrega.jsx con los datos de la remisión
    navigate('/gestion-productos/gestionimpresoras/generar-remision', { state: remisionData})
  }



  return (
    <div className="min-h-screen h-screen flex flex-col  py-4 px-4 overflow-hidden">
      <h1 className="text-xl font-bold text-gray-800 mb-4 p-0">Gestión de Impresoras</h1>
      {/* Contenedor de las cards */}
      <div className="grid grid-cols-3 gap-4 justify-between flex-grow overflow-hidden">

      {/* 🔹 Selección de Impresoras (Card Grande) */}
      <div className={`bg-white shadow-lg rounded-lg p-4 col-span-1 row-span-2 h-full overflow-hidden ${pasoActivo >= 1 ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <div className="flex justify-between align-center">
          <h3 className="text-lg font-semibold mb-1">1️⃣ Selección de Impresoras</h3>
          {pasoActivo === 1 && impresorasSeleccionadas.length > 0 && (
          <button
            onClick={avanzarPaso}
          >
            <p className="text-2xl">➡️</p>
          </button>
          )}
        </div>
        
        <ListaImpresoras 
          impresoras={impresorasDisponibles}
          seleccionadas={impresorasSeleccionadas}
          manejarSeleccion={manejarSeleccion}
          clientes={clientes}
          proyectos={proyectos}
        />
      </div>

      {/* 🔹 Asignación de Cliente */}
      <div className={`bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-100px)] overflow-auto 
        ${pasoActivo >= 2 ? "opacity-100" : "opacity-50 pointer-events-none"} 
        ${!requireCliente ? "opacity-50 pointer-events-none grayscale cursor-not-allowed" : ""} 
        ${pasoActivo > 2 ? "opacity-50 pointer-events-none" : ""}`}>

        <div className="flex justify-between align-center">
          <h3 className="text-lg font-semibold mb-2">2️⃣ Asignación de Cliente</h3>
          {requireCliente && pasoActivo === 2 && clienteSeleccionado && (
            <button onClick={avanzarPaso} >
              <p className="text-2xl">➡️</p>
            </button>
          )}
        </div>

  <AsignarCliente 
    clientes={clientes}
    setClientes={setClientes}
    setClienteSeleccionado={setClienteSeleccionado}
  />
      </div>

      {/* 🔹 Selección de Empresa (Compacta) */}
      <div className={`bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-100px)] overflow-auto ${pasoActivo >= 3 ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <div className="flex justify-between align-center">
          <h3 className="text-lg font-semibold mb-4">3️⃣ Asignación de Empresa</h3>
          {pasoActivo === 3 && empresaSeleccionada && (
          <button
            onClick={avanzarPaso}
          >
            <p className="text-2xl">➡️</p>
          </button>
          )}
        </div>
        <SeleccionEmpresa 
          empresas={empresas}
          empresaSeleccionada={empresaSeleccionada}
          setEmpresaSeleccionada={setEmpresaSeleccionada}
        />
      </div>

      {/* 🔹 Datos de la Remisión (Ocupa el espacio restante a la derecha) */}
      <div className={`bg-white shadow-lg rounded-lg p-4 col-span-2 row-span-1 max-h-[calc(100vh-100px)] overflow-auto ${pasoActivo >= 4 ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <h3 className="text-lg font-semibold mb-2">4️⃣ Datos de la Remisión</h3>
        <FormularioRemision 
          onGenerarRemision={manejarGenerarRemision}
        />
      </div>


      </div>
    </div>
  )
}

export default GestionImpresoras;
