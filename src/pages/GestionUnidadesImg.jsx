import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import ListaUnidadesImg from "../components/ListaUnidadesImg";
import SeleccionEmpresa from "../components/SeleccionEmpresa";
import AsignarClienteUnidadesImg from "../components/AsignarClienteUnidadesImg";
import FormularioRemision from "../components/FormularioRemision";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function GestionUnidadesImg() {
  const [unidadesDisponibles, setUnidadesDisponibles] = useState([]);
  const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState([]);
  const [pasoActivo, setPasoActivo] = useState(1);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [requireCliente, setRequireCliente] = useState(false);
  const [clienteUnico, setClienteUnico] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  const location = useLocation();
  const datosDesdeVistaPrevia = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (clienteSeleccionado && clienteSeleccionado !== clienteUnico) {
      setClienteUnico(clienteSeleccionado);
    }
  }, [clienteSeleccionado]);

  useEffect(() => {
    if (!datosDesdeVistaPrevia) return;

    if (Array.isArray(datosDesdeVistaPrevia.series)) {
      setUnidadesSeleccionadas(datosDesdeVistaPrevia.series);
    }

    if (datosDesdeVistaPrevia.empresa) {
      setEmpresaSeleccionada(datosDesdeVistaPrevia.empresa);
    }

    if (datosDesdeVistaPrevia.cliente && clienteSeleccionado === '') {
      setClienteSeleccionado(datosDesdeVistaPrevia.cliente);
      setClienteUnico(datosDesdeVistaPrevia.cliente);

      if (datosDesdeVistaPrevia.clienteAsignadoManual) {
        setRequireCliente(false);
      } else {
        setRequireCliente(true);
      }
    } else {
      setClienteSeleccionado('');
      setClienteUnico(null);
      setRequireCliente(true);
    }

    if (
      datosDesdeVistaPrevia.series?.length > 0 &&
      datosDesdeVistaPrevia.empresa &&
      (datosDesdeVistaPrevia.cliente || clienteUnico)
    ) {
      setPasoActivo(4);
    } else if (datosDesdeVistaPrevia.series?.length > 0 && !datosDesdeVistaPrevia.cliente) {
      setPasoActivo(2);
    } else {
      setPasoActivo(1);
    }
  }, []);

  useEffect(() => {
    fetch(`${backendUrl}/api/unidades-imagen`)
      .then(res => res.json())
      .then(data => {
        const disponibles = data.filter(u => !u.fecha_salida);
        setUnidadesDisponibles(disponibles);
      });

    fetch(`${backendUrl}/api/empresas`)
      .then(res => res.json())
      .then(data => setEmpresas(data));

    fetch(`${backendUrl}/api/clientes`)
      .then(res => res.json())
      .then(data => setClientes(data));

    fetch(`${backendUrl}/api/proyectos`)
      .then(res => res.json())
      .then(data => setProyectos(data));
  }, []);

  const avanzarPaso = () => {
    if (pasoActivo === 1) {
      if (!requireCliente) setPasoActivo(3);
      else setPasoActivo(2);
    } else if (pasoActivo === 2) {
      setPasoActivo(3);
    } else if (pasoActivo === 3) {
      setPasoActivo(4);
    }
  };

  const manejarSeleccion = (serie) => {
    setUnidadesSeleccionadas(prev => {
      const unidadSeleccionada = unidadesDisponibles.find(u => u.serie === serie);
      if (!unidadSeleccionada) return prev;

      let nuevaSeleccion;
      if (prev.some(u => u.serie === serie)) {
        nuevaSeleccion = prev.filter(u => u.serie !== serie);
      } else {
        nuevaSeleccion = [unidadSeleccionada, ...prev];
      }

      const clientesSet = new Set(nuevaSeleccion.map(u => u.cliente_id).filter(Boolean));
      const proyectosSet = new Set(nuevaSeleccion.map(u => u.proyecto_id).filter(Boolean));

      if (clientesSet.size > 1) {
        toast.warn("No puedes seleccionar unidades con diferentes clientes.");
        return prev;
      }

      if (proyectosSet.size > 1) {
        toast.warn("No puedes seleccionar unidades con diferentes proyectos.");
        return prev;
      }

      if (clientesSet.size === 0) {
        setRequireCliente(true);
        setClienteUnico(null);
      } else {
        setRequireCliente(false);
        setClienteUnico([...clientesSet][0]);
      }

      return nuevaSeleccion;
    });
  };

  const manejarGenerarRemision = ({ destinatario, direccionEntrega, notas }) => {
    const clientesUnicos = new Set(unidadesSeleccionadas.map(i => i.cliente_id).filter(Boolean));
    const proyectosUnicos = new Set(unidadesSeleccionadas.map(i => i.proyecto_id).filter(Boolean));

    const clienteIdFinal = clienteSeleccionado || clienteUnico;
    const clienteFinal = clienteIdFinal 
      ? (clientes.find(c => c.id === Number(clienteIdFinal))?.nombre || 'Cliente Desconocido')
      : 'Sin Cliente';

    const proyectoIdFinal = [...proyectosUnicos][0] || null;
    const proyectoFinal = proyectoIdFinal 
      ? (proyectos.find(p => p.id === proyectoIdFinal)?.nombre || 'Proyecto Desconocido') 
      : 'Sin Proyecto';

    const seriesConCliente = unidadesSeleccionadas.map(u => ({
      ...u,
      cliente_id: u.cliente_id || clienteIdFinal
    }));

    const remisionData = {
      destinatario,
      direccionEntrega,
      notas,
      cliente: clienteIdFinal,
      proyecto: {
        id: proyectoIdFinal,
        nombre: proyectoFinal
      },
      series: seriesConCliente,
      empresa: empresaSeleccionada,
      clienteAsignadoManual: (clienteUnico === null || clienteUnico !== clienteSeleccionado) && !!clienteIdFinal
    };

    navigate('/gestion-productos/gestionimpresoras/generar-remision', { state: {...remisionData, tipoProducto: 'unidad_imagen'}})
  };

  return (
    <div className="min-h-screen h-screen flex flex-col py-4 px-4 overflow-hidden">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Gestión de Unidades de Imagen</h1>
      <div className="grid grid-cols-3 gap-4 flex-grow overflow-hidden">
        <div className={`bg-white shadow-lg rounded-lg p-4 col-span-1 row-span-2 overflow-hidden ${pasoActivo >= 1 ? "" : "opacity-50 pointer-events-none"}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-1">1️⃣ Selección de Unidades</h3>
            {pasoActivo === 1 && unidadesSeleccionadas.length > 0 && (
              <button onClick={avanzarPaso}><p className="text-2xl">➡️</p></button>
            )}
          </div>
          <ListaUnidadesImg 
            unidadesImg={unidadesDisponibles}
            seleccionadas={unidadesSeleccionadas}
            manejarSeleccion={manejarSeleccion}
            clientes={clientes}
            proyectos={proyectos}
          />
        </div>

        <div className={`bg-white shadow-lg rounded-lg p-4 ${pasoActivo >= 2 ? "" : "opacity-50 pointer-events-none"}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-2">2️⃣ Asignación de Cliente</h3>
            {requireCliente && pasoActivo === 2 && clienteSeleccionado && (
              <button onClick={avanzarPaso}><p className="text-2xl">➡️</p></button>
            )}
          </div>
          <AsignarClienteUnidadesImg 
            clientes={clientes}
            setClientes={setClientes}
            clienteSeleccionado={clienteSeleccionado}
            setClienteSeleccionado={setClienteSeleccionado}
            setUnidadesImgSeleccionadas={setUnidadesSeleccionadas}
            requireCliente={requireCliente}
          />
        </div>

        <div className={`bg-white shadow-lg rounded-lg p-4 ${pasoActivo >= 3 ? "" : "opacity-50 pointer-events-none"}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-4">3️⃣ Asignación de Empresa</h3>
            {pasoActivo === 3 && empresaSeleccionada && (
              <button onClick={avanzarPaso}><p className="text-2xl">➡️</p></button>
            )}
          </div>
          <SeleccionEmpresa 
            empresas={empresas}
            empresaSeleccionada={empresaSeleccionada}
            setEmpresaSeleccionada={setEmpresaSeleccionada}
          />
        </div>

        <div className={`bg-white shadow-lg rounded-lg p-4 col-span-2 ${pasoActivo >= 4 ? "" : "opacity-50 pointer-events-none"}`}>
          <h3 className="text-lg font-semibold mb-2">4️⃣ Datos de la Remisión</h3>
          <FormularioRemision 
            onGenerarRemision={manejarGenerarRemision}
            datosIniciales={datosDesdeVistaPrevia}
          />
        </div>
      </div>
    </div>
  );
}

export default GestionUnidadesImg;
