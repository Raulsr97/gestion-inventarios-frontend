import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'

const backendUrl = import.meta.env.VITE_BACKEND_URL

function RemisionRecoleccion() {
  const navigate = useNavigate()
  const location = useLocation()
  const datosRecibidos = location.state

  // Estados para campos principales
  const [empresa, setEmpresa] = useState('')
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [destinatario, setDestinatario] = useState('')
  const [direccionRecoleccion, setDireccionRecoleccion] = useState('')
  const [notas, setNotas] = useState('')
  

  // TODO: Estados para almacenar datos desde la API
  const [empresas, setEmpresas] = useState([])
  const [clientes, setClientes] = useState([])
  const [proyectos, setProyectos] = useState([])
  const [proyectosDelCliente, setProyectosDelCliente] = useState([])

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')

  // Estados para capturar productos a recolectar
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [numeroParte, setNumeroParte] = useState('');


  // Estado para alamacenar la lista de productos agregados
  const [productosRecoleccion, setProductosRecoleccion] = useState([]);
  const [cantidad, setCantidad] = useState(1);

  // Estados para almacenar nuevos clientes y proyectos
  const [nuevoCliente, setNuevoCliente] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState("");

  useEffect(() => {
  fetch(`${backendUrl}/api/empresas`)
    .then(res => res.json())
    .then(data => {
      console.log("📦 Empresas obtenidas:", data);
      setEmpresas(data)
    })
    .catch((error) => {
      console.error("❌ Error al cargar las empresas:", error)
    });

  fetch(`${backendUrl}/api/clientes`)
    .then(res => res.json())
    .then(data => {
      console.log("📦 Clientes obtenidos:", data);
      setClientes(data)
    })
    .catch((error) => {
      console.error("❌ Error al cargar las empresas:", error)
    });

  fetch(`${backendUrl}/api/proyectos`)
    .then(res => res.json())
    .then(data => {
      console.log("📦 Proyectos obtenidos:", data);
      setProyectos(data)
    })
    .catch((error) => {
      console.error("❌ Error al cargar los proyectos:", error)
    });
  }, [])

  useEffect(() => {
    if (clienteSeleccionado) {
      const filtrados = proyectos.filter(p => p.cliente_id === Number(clienteSeleccionado))
      setProyectosDelCliente(filtrados)
    } else {
      setProyectosDelCliente([]) // Si no hay cliente seleccionado, vaciamos la lista
    }
  }, [clienteSeleccionado, proyectos])

  useEffect(() => {
    if (datosRecibidos) {
      // Asignar valores a los estados
      setEmpresaSeleccionada(datosRecibidos.empresa?.id?.toString() || "");
      setClienteSeleccionado(datosRecibidos.cliente?.id?.toString() || "");
      setProyecto(datosRecibidos.proyecto?.id?.toString() || "");
      setDestinatario(datosRecibidos.destinatario || "");
      setDireccionRecoleccion(datosRecibidos.direccion_recoleccion || "");
      setNotas(datosRecibidos.notas || "");
      setProductosRecoleccion(datosRecibidos.productos || []);
    }
  }, [datosRecibidos])
  

  const handleAgregarProducto = () => {
    const productoNuevo = {
      marca, 
      modelo,
      serie,
      numero_parte: numeroParte,
      observaciones,
      cantidad
    }

    const indexExistente = productosRecoleccion.findIndex(prod =>
      prod.marca === productoNuevo.marca &&
      prod.modelo === productoNuevo.modelo &&
      prod.serie === productoNuevo.serie &&
      prod.numero_parte === productoNuevo.numero_parte &&
      prod.observaciones === productoNuevo.observaciones
    );

    if (indexExistente !== -1) {
      // Ya existe → sumamos la cantidad
      const productosActualizados = [...productosRecoleccion];
      productosActualizados[indexExistente].cantidad += cantidad;
      setProductosRecoleccion(productosActualizados);
    } else {
      // No existe → lo agregamos como nuevo
      setProductosRecoleccion([...productosRecoleccion, productoNuevo]);
    }

  }

  const handleEliminarProducto = (index) => {
    const nuevaLista = [...productosRecoleccion]
    nuevaLista.splice(index, 1)
    setProductosRecoleccion(nuevaLista)
  }

  const irAVistaPrevia = async () => {
    try {
      let clienteObj = null
      let proyectoObj = null
  
      // 🔹 Crear cliente si hay uno nuevo
      if (nuevoCliente.trim() !== '') {
        const res = await fetch(`${backendUrl}/api/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevoCliente.trim() })
        })
  
        if (!res.ok) throw new Error('❌ No se pudo crear el cliente.')
        const nuevoClienteCreado = await res.json()
        clienteObj = nuevoClienteCreado
      } else {
        clienteObj = clientes.find(c => c.id === Number(clienteSeleccionado))
      }
  
      // 🔸 Crear proyecto si hay uno nuevo
      if (nuevoProyecto.trim() !== '') {
        const res = await fetch(`${backendUrl}/api/proyectos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nuevoProyecto.trim(),
            cliente_id: clienteObj.id
          })
        })

        if (!res.ok) throw new Error('❌ No se pudo crear el proyecto.')
        proyectoObj = await res.json()
      } else {
        proyectoObj = proyectos.find(p => p.id === Number(proyecto))
      }
  
      const empresaObj = empresas.find(e => e.id === Number(empresaSeleccionada))
  
      const datosRemision = {
        empresa: empresaObj,
        cliente: clienteObj,
        proyecto: proyectoObj,
        destinatario,
        direccion_recoleccion: direccionRecoleccion,
        notas,
        productos: productosRecoleccion
      }
  
      navigate('/remisiones/recoleccion/vista-previa', { state: datosRemision })
  
    } catch (error) {
      console.error("⚠️ Error al preparar la remisión:", error.message)
      toast.error("No se pudo preparar la remisión.")
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Nueva Remisión de Recolección</h2>

      {/* GRID DE 3 SECCIONES ARRIBA */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Empresa */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-2">1️⃣ Empresa</h3>
          <select
            value={empresaSeleccionada}
            onChange={(e) => setEmpresaSeleccionada(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="" disabled>Selecciona una empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>{empresa.nombre}</option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-2">2️⃣ Cliente</h3>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="" disabled>Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="O agrega un nuevo cliente"
            value={nuevoCliente}
            onChange={(e) => setNuevoCliente(e.target.value.toUpperCase())}
            className="border border-gray-300 p-2 rounded w-full mt-2"
          />
        </div>

        {/* Proyecto */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-2">3️⃣ Proyecto</h3>
          <select
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="">Sin proyecto</option>
            {proyectosDelCliente.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="O agrega un nuevo proyecto"
            value={nuevoProyecto}
            onChange={(e) => setNuevoProyecto(e.target.value.toUpperCase())}
            className="border border-gray-300 p-2 rounded w-full mt-2"
          />
        </div>
      </div>

      {/* DATOS DE LA REMISION */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">4️⃣ Datos de la Remisión</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            placeholder="Nombre del destinatario"
            className="border border-gray-300 p-2 rounded w-full"
          />
          <textarea
            value={direccionRecoleccion}
            onChange={(e) => setDireccionRecoleccion(e.target.value)}
            placeholder="Dirección de recolección"
            className="border border-gray-300 p-2 rounded w-full"
            rows="1"
          />
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas adicionales (opcional)"
            className="border border-gray-300 p-2 rounded w-full col-span-2"
            rows="2"
          />
        </div>
      </div>

      {/* AGREGAR PRODUCTO */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">5️⃣ Productos a recolectar</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value.toUpperCase())} placeholder="Marca" className="border border-gray-300 p-2 rounded" />
          <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value.toUpperCase())} placeholder="Modelo" className="border border-gray-300 p-2 rounded" />
          <input type="text" value={serie} onChange={(e) => setSerie(e.target.value.toUpperCase())} placeholder="Serie" className="border border-gray-300 p-2 rounded" />
          <input type="text" value={numeroParte} onChange={(e) => setNumeroParte(e.target.value.toUpperCase())} placeholder="Número de parte" className="border border-gray-300 p-2 rounded" />
          <input type="text" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones" className="border border-gray-300 p-2 rounded" />
          <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} placeholder="Cantidad" className="border border-gray-300 p-2 rounded" />
        </div>
        <button onClick={handleAgregarProducto} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">➕ Agregar producto</button>

        {/* Tabla de productos */}
        {productosRecoleccion.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="border px-2 py-1">Marca</th>
                  <th className="border px-2 py-1">Modelo</th>
                  <th className="border px-2 py-1">Serie</th>
                  <th className="border px-2 py-1">N° Parte</th>
                  <th className="border px-2 py-1">Observaciones</th>
                  <th className="border px-2 py-1">Cantidad</th>
                  <th className="border px-2 py-1">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosRecoleccion.map((producto, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-2 py-1">{producto.marca}</td>
                    <td className="border px-2 py-1">{producto.modelo}</td>
                    <td className="border px-2 py-1">{producto.serie}</td>
                    <td className="border px-2 py-1">{producto.numero_parte}</td>
                    <td className="border px-2 py-1">{producto.observaciones}</td>
                    <td className="border px-2 py-1">{producto.cantidad}</td>
                    <td className="border px-2 py-1">
                      <button onClick={() => handleEliminarProducto(index)} className="text-red-500 hover:text-red-700 font-bold">❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOTÓN FINAL */}
      <div className="flex justify-end">
        <button onClick={irAVistaPrevia} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">Vista previa</button>
      </div>
    </div>
  )
  

  
}

export default RemisionRecoleccion
