import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import ListaToners from "../components/ListaToners";
import SeleccionEmpresa from "../components/SeleccionEmpresa";
import AsignarClienteToners from "../components/AsignarClienteToners";
import FormularioRemision from "../components/FormularioRemision";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function GestionToners() {
  // Estado para almacenar las impresoras que se encuentran en almacen
  const [tonersDisponibles ,setTonersDisponibles] = useState([])
  // Estado para almacenar las impresoras que se van a seleccionar para la remisión
  const [tonersSeleccionados, setTonersSeleccionados] = useState([])
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

  const location = useLocation()
  const datosDesdeVistaPrevia = location.state


  const navigate = useNavigate()
  console.log("👤 Cliente seleccionado ACTUAL:", clienteSeleccionado)

  useEffect(() => {
    if (clienteSeleccionado && clienteSeleccionado !== clienteUnico) {
        setClienteUnico(clienteSeleccionado); // Actualiza clienteUnico solo si cambia el clienteSeleccionado
    }
  }, [clienteSeleccionado]);

  useEffect(() => {
    if (!datosDesdeVistaPrevia) return; // ✅ No hacer nada si entras directo

    console.log("🚀 Datos recibidos desde vista previa:", datosDesdeVistaPrevia);
    console.log("Cliente recibido desde vista previa:", datosDesdeVistaPrevia.cliente); // Verifica el cliente al regresar
  
    if (Array.isArray(datosDesdeVistaPrevia.series)) {
      setTonersSeleccionados(datosDesdeVistaPrevia.series)
      console.log("Toners seleccionados:", datosDesdeVistaPrevia.series);
    }
  
    if (datosDesdeVistaPrevia.empresa) {
      setEmpresaSeleccionada(datosDesdeVistaPrevia.empresa)
      console.log("Empresa seleccionada:", datosDesdeVistaPrevia.empresa);
    }
  
    if (datosDesdeVistaPrevia.cliente && clienteSeleccionado === '') {
      // Siempre actaulizamos clienteSeleccionado, incluso si ya tiene un valor asignado
      setClienteSeleccionado(datosDesdeVistaPrevia.cliente)
      setClienteUnico(datosDesdeVistaPrevia.cliente)
      console.log("Cliente seleccionado:", datosDesdeVistaPrevia.cliente);

      if (datosDesdeVistaPrevia.clienteAsignadoManual) {
        setRequireCliente(false); // ❌ No se permite modificar
        console.log("🔒 Cliente fue asignado manualmente, no se permite modificar.");
      } else {
        setRequireCliente(true); // ✅ Se permite modificar
        console.log("✅ Cliente vino sin asignación, se permite modificar.");
      }
      
    } else {
      setClienteSeleccionado(''); // Resetear clienteSeleccionado si no hay cliente
      setClienteUnico(null); // Resetear clienteUnico
      setRequireCliente(true); // Si no hay cliente, se tiene que elegir
      console.log("🟡 No hay cliente asignado, requiere selección manual.");
    } 

    // Establecer el paso correcto
    if (
      datosDesdeVistaPrevia.series?.length > 0 &&
      datosDesdeVistaPrevia.empresa &&
      (datosDesdeVistaPrevia.cliente || clienteUnico)
    ) {
      setPasoActivo(4)
      console.log("Paso 4: Listo para generar la remisión.");
    } else if (datosDesdeVistaPrevia.series?.length > 0 && !datosDesdeVistaPrevia.cliente) {
      setPasoActivo(2)
      console.log("Paso 2: Necesita asignar cliente.");
    } else {
      setPasoActivo(1)
      console.log("Paso 1: Selección de impresoras.");
    }
  
  }, [])
   
  useEffect(() => {
    fetch(`${backendUrl}/api/toners`)
      .then(res => res.json())
      .then(data => {
        // Filtrar solo los toners que no tienen fecha de salida
        const disponibles = data.filter(toner => !toner.fecha_salida)
        setTonersDisponibles(disponibles)

        // 🔹 Imprimir datos en consola para ver si los accesorios llegan correctamente
        console.log("📦 toners recibidos:", JSON.stringify(disponibles, null, 2));
      })
      .catch(error => console.error('Error al obtener los toners', error))
    
    fetch(`${backendUrl}/api/empresas`)
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(error => console.error('Error al obtener las empresas', error))
    
    fetch(`${backendUrl}/api/clientes`)
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(error => console.error("Error al obtener clientes", error));
  
    fetch(`${backendUrl}/api/proyectos`)
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
    setTonersSeleccionados(prevSeleccionadas => {
      let nuevaSeleccion

      // Buscar el objeto completo de la impresora seleccionada
      const tonerSeleccionado = tonersDisponibles.find(i => i.serie === serie);

      if (!tonerSeleccionado) {
        console.warn(`⚠️ No se encontró el toner con serie: ${serie}`);
        return prevSeleccionadas;
    }

      if (prevSeleccionadas.some(t => t.serie === serie)) {
        // Si ya esta seleccionada la quitamos
        nuevaSeleccion = prevSeleccionadas.filter(t => t.serie !== serie)
        console.log(`❌ Eliminada: ${serie}`);
      } else {
        // Si no esta seleccionada la agregamos
        nuevaSeleccion = [tonerSeleccionado, ...prevSeleccionadas]
        console.log(`✅ Agregada:`, tonerSeleccionado);
        console.log("🔄 Nueva lista (ordenada):", nuevaSeleccion.map(t => t.serie));

      }

      // Extraer clientes y proyectos de las impresoras seleccionadas
      const clientes = nuevaSeleccion.map(t => t?.cliente_id).filter(Boolean)
      const proyectos = nuevaSeleccion.map(t => t?.proyecto_id).filter(Boolean)

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
        toast.warn("No puedes seleccionar toners con diferentes proyectos.");
        return prevSeleccionadas; // No permite la selección
      }

      // ❌ Si hay series con proyecto y otras sin, bloquear la selección
      if (haySeriesConProyecto && haySeriesSinProyecto) {
        toast.warn("No puedes seleccionar toners con proyecto junto con otras que no tienen proyecto.");
        return prevSeleccionadas;
      }

      console.log("Estado actual de seleccionadas:", nuevaSeleccion);
      return nuevaSeleccion
    });
  }

  // Funcion para recopilar los datos que se enviaran a la pagina VistaPreviaRemisionEntrega.jsx
  const manejarGenerarRemision = ({ destinatario, direccionEntrega, notas }) => {
    console.log("🚀 Toners Seleccionados:", tonersSeleccionados);
    console.log("Cliente seleccionado para la remisión:", clienteSeleccionado);

    // Verificar si las series seleeccionadas tienen cliente_id y proyecto_id
    tonersSeleccionados.forEach(serie => {
      console.log(`Serie:  ${serie.serie}, Cliente ID: ${serie.cliente_id}, Proyecto ID: ${serie.proyecto_id}`);
    })

    // 🔹 Extraer clientes y proyectos desde las series seleccionadas
    const clientesUnicos = new Set(tonersSeleccionados.map(i => i.cliente_id).filter(Boolean));
    const proyectosUnicos = new Set(tonersSeleccionados.map(i => i.proyecto_id).filter(Boolean));

    // 🔹 Determinar el nombre del cliente
    let clienteFinal = "Sin Cliente";
    if (clientesUnicos.size === 1) {
        const clienteId = [...clientesUnicos][0];
        console.log("Cliente Único ID:", clienteId);
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
        console.log("Proyecto Único ID:", proyectoId);
        const proyectoEncontrado = proyectos.find(p => p.id === proyectoId);
        proyectoFinal = proyectoEncontrado ? proyectoEncontrado.nombre : "Proyecto No Encontrado";
    } else if (proyectosUnicos.size > 1) {
        proyectoFinal = "Varios Proyectos";
    }

    // 🔹 Si las series ya tienen cliente/proyecto asignado, usarlos
    if (clienteFinal === "Sin Cliente" && tonersSeleccionados.length > 0) {
        const primeraSerie = tonersSeleccionados[0];
        console.log("Primera Serie Cliente ID:", primeraSerie.cliente_id);
        const clienteExistente = clientes.find(c => c.id === primeraSerie.cliente_id);
        if (clienteExistente) {
            clienteFinal = clienteExistente.nombre;
        }
    }

    if (proyectoFinal === "Sin Proyecto" && tonersSeleccionados.length > 0) {
        const primeraSerie = tonersSeleccionados[0];
        console.log("Primera Serie Proyecto ID:", primeraSerie.proyecto_id);

        const proyectoExistente = proyectos.find(p => p.id === primeraSerie.proyecto_id);
        if (proyectoExistente) {
            proyectoFinal = proyectoExistente.nombre;
        }
    }

    console.log("Cliente Final:", clienteFinal);
    console.log("Proyecto Final:", proyectoFinal);

    // Asignar cliente_id a cada impresora si no la tienen
    const clienteIdFinal = clienteSeleccionado || clienteUnico  

    console.log("Cliente final que se enviará a la remisión:", clienteIdFinal);
    

    // Creamos una copia profunda de las impresoras seleccionadas
    const seriesConCliente = tonersSeleccionados.map(i => {
      return {
        ...i,
        cliente_id: i.cliente_id || clienteIdFinal
      }
    })
    

    // Recopilamos todam la informacion
    const remisionData = {
      destinatario,
      direccionEntrega,
      notas,
      cliente: clienteIdFinal,
      proyecto: {
        id: [...proyectosUnicos][0] || null,
        nombre: proyectoFinal
      }, 
      series: seriesConCliente,
      empresa: empresaSeleccionada,

      // 🔹 Indicador: si fue el usuario quien asignó el cliente
      clienteAsignadoManual: (clienteUnico === null || clienteUnico !== clienteSeleccionado) && !!clienteIdFinal
    }

    // Redirigir a VistaPreviaRemisionEntrega.jsx con los datos de la remisión
    navigate('/gestion-productos/gestionimpresoras/generar-remision', { state: { ...remisionData, tipoProducto: 'toner'}})
  }

  return (
    <div className="min-h-screen h-screen flex flex-col  py-4 px-4 overflow-hidden">
      <h1 className="text-xl font-bold text-gray-800 mb-4 p-0">Gestión de Toners</h1>
      {/* Contenedor de las cards */}
      <div className="grid grid-cols-3 gap-4 justify-between flex-grow overflow-hidden">

      {/* 🔹 Selección de Toners (Card Grande) */}
      <div className={`bg-white shadow-lg rounded-lg p-4 col-span-1 row-span-2 h-full overflow-hidden ${pasoActivo >= 1 ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <div className="flex justify-between align-center">
          <h3 className="text-lg font-semibold mb-1">1️⃣ Selección de Toners</h3>
          {pasoActivo === 1 && tonersSeleccionados.length > 0 && (
          <button
            onClick={avanzarPaso}
          >
            <p className="text-2xl">➡️</p>
          </button>
          )}
        </div>
        
        <ListaToners 
          toners={tonersDisponibles}
          seleccionados={tonersSeleccionados}
          manejarSeleccion={manejarSeleccion}
          clientes={clientes}
          proyectos={proyectos}
        />
      </div>

      {/* 🔹 Asignación de Cliente */}
      <div className={`bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-100px)] overflow-auto 
         ${pasoActivo >= 2 ? "opacity-100" : "opacity-50 pointer-events-none"} 
         ${pasoActivo === 2 && !requireCliente ? "pointer-events-none opacity-50 grayscale cursor-not-allowed" : ""}`}>

        <div className="flex justify-between align-center">
          <h3 className="text-lg font-semibold mb-2">2️⃣ Asignación de Cliente</h3>
          {requireCliente && pasoActivo === 2 && clienteSeleccionado && (
            <button onClick={avanzarPaso} >
              <p className="text-2xl">➡️</p>
            </button>
          )}
        </div>

        <AsignarClienteToners 
          clientes={clientes}
          setClientes={setClientes}
          clienteSeleccionado={clienteSeleccionado}
          setClienteSeleccionado={setClienteSeleccionado}
          setTonersSeleccionados={setTonersSeleccionados}
          requireCliente={requireCliente}
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
          datosIniciales= {datosDesdeVistaPrevia}
        />
      </div>


      </div>
    </div>
  )
}

export default GestionToners;