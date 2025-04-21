import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import ListaRefacciones from "../components/ListaRefacciones";
import SeleccionEmpresa from "../components/SeleccionEmpresa";
import AsignarClienteRefacciones from "../components/AsignarClienteRefacciones";
import FormularioRemision from "../components/FormularioRemision";

function GestionRefacciones() {
  const [refaccionesDisponibles, setRefaccionesDisponibles] = useState([]);
  const [refaccionesSeleccionadas, setRefaccionesSeleccionadas] = useState([]);

  const [marcas, setMarcas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");

  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [clienteUnico, setClienteUnico] = useState(null);
  const [requireCliente, setRequireCliente] = useState(true);
  const [pasoActivo, setPasoActivo] = useState(1);

  const location = useLocation();
  const datosDesdeVistaPrevia = location.state;

  const navigate = useNavigate();

  useEffect(() => {
    if (clienteSeleccionado && clienteSeleccionado !== clienteUnico) {
      setClienteUnico(clienteSeleccionado);
    }
  }, [clienteSeleccionado]);

  useEffect(() => {
    console.log("📦 Refacciones desde VistaPrevia:", datosDesdeVistaPrevia?.refacciones);
    if (!datosDesdeVistaPrevia || !Array.isArray(datosDesdeVistaPrevia.refacciones)) {
      console.log("❌ No hay refacciones en datosDesdeVistaPrevia. No se puede continuar.");
      return;
    }
    
  
    // 1. Setear refacciones seleccionadas
    if (Array.isArray(datosDesdeVistaPrevia.refacciones)) {
      setRefaccionesSeleccionadas(datosDesdeVistaPrevia.refacciones);
    }
  
    // 2. Setear empresa si viene
    if (datosDesdeVistaPrevia.empresa) {
      setEmpresaSeleccionada(datosDesdeVistaPrevia.empresa);
    }
  
    // 3. Determinar si todas las refacciones ya tienen cliente
    const todasConCliente = datosDesdeVistaPrevia.refacciones?.every(
      (ref) => !!ref.cliente_id
    );
    console.log("🧠 ¿Todas las refacciones tienen cliente?:", todasConCliente);
  
    // 4. Si todas tienen cliente (como al seleccionar refacciones ya asignadas)
    if (todasConCliente) {
      const clienteId = datosDesdeVistaPrevia.refacciones[0].cliente_id;
      setClienteSeleccionado(clienteId);
      setClienteUnico(clienteId);
      setRequireCliente(false); // ❌ no editable
      setPasoActivo(datosDesdeVistaPrevia.empresa ? 4 : 3);
      console.log("✅ Cliente detectado automáticamente, card 2 se debe deshabilitar.");
      return;
    }
  
    // 5. Si viene cliente desde VistaPrevia (caso manual)
    if (datosDesdeVistaPrevia.cliente && clienteSeleccionado === "") {
      setClienteSeleccionado(datosDesdeVistaPrevia.cliente);
      setClienteUnico(datosDesdeVistaPrevia.cliente);
      setRequireCliente(datosDesdeVistaPrevia.clienteAsignadoManual); // true o false
      setPasoActivo(datosDesdeVistaPrevia.empresa ? 4 : 3);
      return;
    }
  
    // 6. Caso base: no hay cliente
    setClienteSeleccionado("");
    setClienteUnico(null);
    setRequireCliente(true);
    setPasoActivo(2);
  }, []);
  
   useEffect(() => {
    fetch("http://localhost:3000/api/refacciones/disponibles-remision")
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          toast.info("No hay refacciones disponibles para remisión.");
        }
        setRefaccionesDisponibles(data);
      })
      .catch((err) => {
        console.error("Error al obtener refacciones disponibles:", err);
        toast.error("Error al cargar refacciones.");
      });

    fetch("http://localhost:3000/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));

    fetch("http://localhost:3000/api/proyectos")
      .then((res) => res.json())
      .then((data) => setProyectos(data));

    fetch("http://localhost:3000/api/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data));

    fetch("http://localhost:3000/api/marcas")
      .then((res) => res.json())
      .then((data) => setMarcas(data));
  }, []);

  useEffect(() => {
    if (refaccionesSeleccionadas.length === 0) return;
  
    const todasConCliente = refaccionesSeleccionadas.every(r => !!r.cliente_id);
  
    // ✅ Solo deshabilitamos si venían con cliente DESDE EL INICIO (paso 1), no después
    if (todasConCliente && pasoActivo === 1) {
      setRequireCliente(false); // deshabilita la card solo si ya venían listas
      setPasoActivo(3);
      setClienteUnico(refaccionesSeleccionadas[0].cliente_id);
      setClienteSeleccionado(refaccionesSeleccionadas[0].cliente_id);
    } else if (!todasConCliente) {
      setRequireCliente(true); // cliente se debe asignar
      setPasoActivo(2);
      setClienteUnico(null);
      setClienteSeleccionado('');
    }
  }, [refaccionesSeleccionadas]);
  
  const avanzarPaso = () => {
    if (pasoActivo === 1) {
      if (!requireCliente) {
        setPasoActivo(3);
      } else {
        setPasoActivo(2);
      }
    } else if (pasoActivo === 2) {
      setPasoActivo(3);
    } else if (pasoActivo === 3) {
      setPasoActivo(4);
    }
  };

  const manejarCantidadSeleccionada = (numero_parte, cantidad, refData) => {
    if (cantidad <= 0) {
      setRefaccionesSeleccionadas((prev) =>
        prev.filter((r) => r.numero_parte !== numero_parte)
      );
      return;
    }

    const nuevaSeleccion = {
      numero_parte,
      cantidad,
      marca_id: refData.marca_id,
      proveedor_id: refData.proveedor_id,
      tipo: refData.tipo,
      cliente_id: refData.cliente_id || null,
      proyecto_id: refData.proyecto_id || null,
    };

    setRefaccionesSeleccionadas((prev) => {
      const sinDuplicados = prev.filter((r) => r.numero_parte !== numero_parte);
      return [...sinDuplicados, nuevaSeleccion];
    });
  };

  const manejarGenerarRemision = ({ destinatario, direccionEntrega, notas }) => {
    const refaccionesConMarca = refaccionesSeleccionadas.map((ref) => {
      const marca = marcas.find((m) => m.id === ref.marca_id);
      return {
        ...ref,
        marca: marca ? { nombre: marca.nombre } : { nombre: "—" },
      };
    });
  
    // ✅ Detectar proyecto único si todas las refacciones tienen el mismo proyecto_id
    const proyectosUnicos = new Set(refaccionesSeleccionadas.map(r => r.proyecto_id).filter(Boolean));
    let proyectoFinal = null;
  
    if (proyectosUnicos.size === 1) {
      const idProyecto = [...proyectosUnicos][0];
      const proyectoEncontrado = proyectos.find(p => p.id === idProyecto);
      if (proyectoEncontrado) {
        proyectoFinal = {
          id: proyectoEncontrado.id,
          nombre: proyectoEncontrado.nombre
        };
      }
    }
  
    const remisionData = {
      destinatario,
      direccionEntrega,
      notas,
      cliente: clienteSeleccionado,
      proyecto: proyectoFinal, // ✅ ahora enviamos el proyecto
      refacciones: refaccionesConMarca,
      empresa: empresaSeleccionada,
      tipoProducto: 'refaccion', 
      clienteAsignadoManual:
        (clienteUnico === null ||
          String(clienteUnico) !== String(clienteSeleccionado)) &&
        !!clienteSeleccionado,
    };
  
    navigate("/gestion-productos/gestionimpresoras/generar-remision", {
      state: remisionData,
    });
  };
  

  return (
    <div className="min-h-screen h-screen flex flex-col py-4 px-4 overflow-hidden">
      <h1 className="text-xl font-bold text-gray-800 mb-4 p-0">Gestión de Refacciones</h1>

      <div className="grid grid-cols-3 gap-4 justify-between flex-grow overflow-hidden">
        {/* Paso 1 */}
        <div
          className={`bg-white shadow-lg rounded-lg p-4 col-span-1 row-span-2 h-full overflow-hidden ${
            pasoActivo >= 1 ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <div className="flex justify-between align-center">
            <h3 className="text-lg font-semibold mb-1">1️⃣ Selección de Refacciones</h3>
            {pasoActivo === 1 && refaccionesSeleccionadas.length > 0 && (
              <button onClick={avanzarPaso}>
                <p className="text-2xl">➡️</p>
              </button>
            )}
          </div>

          <ListaRefacciones
            refacciones={refaccionesDisponibles}
            seleccionadas={refaccionesSeleccionadas}
            manejarCantidadSeleccionada={manejarCantidadSeleccionada}
          />
        </div>

        


        {/* Paso 2: Asignación de Cliente */}
        {console.log("🔍 Valor de requireCliente en card 2:", requireCliente)}
        <div
  className={`bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-100px)] overflow-auto 
    ${pasoActivo >= 2 ? "opacity-100" : "opacity-50 pointer-events-none"} 
    ${!requireCliente ? "pointer-events-none opacity-50 grayscale cursor-not-allowed" : ""}`}
>
  <div className="flex justify-between align-center">
    <h3 className="text-lg font-semibold mb-2">2️⃣ Asignación de Cliente</h3>
    {requireCliente && pasoActivo === 2 && clienteSeleccionado && (
      <button onClick={avanzarPaso}>
        <p className="text-2xl">➡️</p>
      </button>
    )}
  </div>

  <AsignarClienteRefacciones
    clientes={clientes}
    setClientes={setClientes}
    clienteSeleccionado={clienteSeleccionado}
    setClienteSeleccionado={setClienteSeleccionado}
    setRefaccionesSeleccionadas={setRefaccionesSeleccionadas}
    requireCliente={requireCliente}
  />
</div>




        {/* Paso 3 */}
        <div
          className={`bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-100px)] overflow-auto ${
            pasoActivo >= 3 ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <div className="flex justify-between align-center">
            <h3 className="text-lg font-semibold mb-4">3️⃣ Asignación de Empresa</h3>
            {pasoActivo === 3 && empresaSeleccionada && (
              <button onClick={avanzarPaso}>
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

        {/* Paso 4 */}
        <div
          className={`bg-white shadow-lg rounded-lg p-4 col-span-2 row-span-1 max-h-[calc(100vh-100px)] overflow-auto ${
            pasoActivo >= 4 ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">4️⃣ Datos de la Remisión</h3>
          <FormularioRemision
            onGenerarRemision={manejarGenerarRemision}
            datosIniciales={null}
          />
        </div>
      </div>
    </div>
  );
}

export default GestionRefacciones;
