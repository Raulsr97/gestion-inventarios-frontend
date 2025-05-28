import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SelectDinamico from "../components/SelectDinamico";
import BotonAgregar from "../components/BotonAgregar";

const backendUrl = import.meta.env.VITE_BACKEND_URL

function AgregarRefaccion() {
  const [marca, setMarca] = useState("");
  const [tipo, setTipo] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [cliente, setCliente] = useState("");
  const [proyecto, setProyecto] = useState("");

  const [nuevoCliente, setNuevoCliente] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [nuevoProveedor, setNuevoProveedor] = useState("");

  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [numeroParte, setNumeroParte] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [refacciones, setRefacciones] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/clientes`)
      .then((res) => res.json())
      .then((data) => setClientes(data));

    fetch(`${backendUrl}/api/proyectos`)
      .then((res) => res.json())
      .then((data) => setProyectos(data));

    fetch(`${backendUrl}/api/marcas`)
      .then((res) => res.json())
      .then((data) => setMarcas(data));

    fetch(`${backendUrl}/api/proveedores`)
      .then((res) => res.json())
      .then((data) => setProveedores(data));
  }, []);

  const agregarRefaccion = () => {
    const parte = numeroParte.toUpperCase().trim();

    if (!parte || cantidad <= 0) {
      toast.error("Número de parte y cantidad válidos requeridos.");
      return;
    }

    if (refacciones.some((r) => r.numero_parte === parte)) {
      toast.error("Este número de parte ya fue ingresado.");
      return;
    }

    setRefacciones([
      ...refacciones,
      { numero_parte: parte, cantidad: parseInt(cantidad) }
    ]);

    setNumeroParte("");
    setCantidad(1);
  };

  const eliminarRefaccion = (parte) => {
    setRefacciones(refacciones.filter((r) => r.numero_parte !== parte));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipo || refacciones.length === 0) {
      toast.error("Completa todos los campos requeridos.");
      return;
    }

    try {
      let marcaId = marca;
      let clienteId = cliente;
      let proyectoId = proyecto;
      let proveedorId = proveedor;

      if (marca === "nuevo" && nuevaMarca) {
        const res = await fetch(`${backendUrl}/api/marcas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevaMarca.toUpperCase() }),
        });
        if (!res.ok) throw new Error("Error al registrar la nueva marca.");
        const data = await res.json();
        marcaId = data.id;
      }

      if (cliente === "nuevo" && nuevoCliente) {
        const res = await fetch(`${backendUrl}/api/clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoCliente.toUpperCase() }),
        });
        if (!res.ok) throw new Error("Error al registrar el nuevo cliente.");
        const data = await res.json();
        clienteId = data.id;
      }

      if (proyecto === "nuevo" && nuevoProyecto) {
        if (!clienteId) {
          toast.error("Selecciona un cliente antes de registrar un proyecto.");
          return;
        }
        const res = await fetch(`${backendUrl}/api/proyectos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nuevoProyecto.toUpperCase(),
            cliente_id: clienteId
          }),
        });
        if (!res.ok) throw new Error("Error al registrar el nuevo proyecto.");
        const data = await res.json();
        proyectoId = data.id;
      }

      if (proveedor === "nuevo" && nuevoProveedor) {
        const res = await fetch(`${backendUrl}/api/proveedores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoProveedor.toUpperCase() }),
        });
        if (!res.ok) throw new Error("Error al registrar el nuevo proveedor.");
        const data = await res.json();
        proveedorId = data.id;
      }

      const datos = {
        tipo,
        marca_id: marcaId,
        proveedor_id: proveedorId,
        cliente_id: clienteId,
        proyecto_id: proyectoId,
        refacciones
      };

      const res = await fetch(`${backendUrl}/api/refacciones/registro-lote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!res.ok) throw new Error("Error al registrar las refacciones.");

      toast.success("Refacciones registradas correctamente.");

      // Limpiar
      setMarca("");
      setTipo("");
      setProveedor("");
      setCliente("");
      setProyecto("");
      setNuevoCliente("");
      setNuevoProyecto("");
      setNuevaMarca("");
      setNuevoProveedor("");
      setRefacciones([]);

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4">
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-4 px-6 w-full lg:w-1/3">
          <h1 className="text-xl font-semibold text-gray-700 mb-6">Agregar Refacciones</h1>
  
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
  
            <SelectDinamico
              opciones={marcas}
              valorSeleccionado={marca}
              setValorSeleccionado={setMarca}
              setNuevoValor={setNuevaMarca}
              placeholder="Marca"
              permitirNuevo={true}
            />
  
            <SelectDinamico
              opciones={[
                { id: "compra", nombre: "Compra" },
                { id: "distribucion", nombre: "Distribución" }
              ]}
              valorSeleccionado={tipo}
              setValorSeleccionado={setTipo}
              placeholder="Tipo"
              permitirNuevo={false}
            />
  
            <SelectDinamico
              opciones={clientes}
              valorSeleccionado={cliente}
              setValorSeleccionado={setCliente}
              setNuevoValor={setNuevoCliente}
              placeholder="Cliente"
              permitirNuevo={true}
            />
  
            <SelectDinamico
              opciones={proyectos}
              valorSeleccionado={proyecto}
              setValorSeleccionado={setProyecto}
              setNuevoValor={setNuevoProyecto}
              placeholder="Proyecto"
              disabled={!cliente || tipo !== 'distribucion'}
              permitirNuevo={true}
            />
  
            <SelectDinamico
              opciones={proveedores}
              valorSeleccionado={proveedor}
              setValorSeleccionado={setProveedor}
              setNuevoValor={setNuevoProveedor}
              placeholder="Proveedor"
              permitirNuevo={true}
            />
  
            <div className="col-span-2 mt-4 bg-gray-50 border border-gray-300 rounded-md p-3">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Nueva Refacción</h3>
  
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Número de parte</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                  value={numeroParte}
                  onChange={(e) => setNumeroParte(e.target.value.toUpperCase())}
                />
              </div>
  
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                  value={cantidad}
                  min={1}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
  
              <button
                type="button"
                onClick={agregarRefaccion}
                className="bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                ➕ Añadir a lista
              </button>
            </div>
  
            <BotonAgregar onClick={handleSubmit} />
          </form>
        </div>
  
        {/* Lista */}
        <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-2/3 overflow-y-auto max-h-[calc(100vh-40px)]">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Refacciones agregadas</h2>
          <ul className="space-y-2">
            {refacciones.map((ref, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md shadow-sm text-sm">
                <span className="text-gray-800 font-medium tracking-wide">
                  {ref.numero_parte} <span className="text-gray-500 font-normal">(x{ref.cantidad})</span>
                </span>
                <button
                  type="button"
                  onClick={() => eliminarRefaccion(ref.numero_parte)}
                  className="text-red-500 text-xs font-semibold hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
}

export default AgregarRefaccion;

  