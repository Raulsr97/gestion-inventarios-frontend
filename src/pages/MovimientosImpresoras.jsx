import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MovimientosImpresoras() {
  const [impresoras, setImpresoras] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [remisiones, setRemisiones] = useState([])
  const [numeroRemision, setNumeroRemision] = useState(null); 
  const [clienteProyecto, setClienteProyecto] = useState({ cliente: '', proyecto: ''})
  const [seriesDisponibles, setSeriesDisponibles] = useState([]);
  const [seriesSeleccionadas, setSeriesSeleccionadas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [mostrarFormularioRemision, setMostrarFormularioRemision] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [busquedaSerie, setBusquedaSerie] = useState("");
  const [formularioRemision, setFormularioRemision] = useState({
    destinatario: "",
    direccion_entrega: "",
    notas: "",
  });
  const [clienteManual, setClienteManual] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState(""); // Nuevo cliente ingresado

  const [proyectoManual, setProyectoManual] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState(""); // Nuevo proyecto ingresado

  const [mostrarFormularioClienteProyecto, setMostrarFormularioClienteProyecto] = useState(false);
  const [datosRemision, setDatosRemision] = useState(null);


  const logosEmpresas = {
    1: '/logos/imme.png',
    2: '/logos/colour_klub.png',
    3: '/logos/coneltec.png'
  }

  const obtenerLogoEmpresa = (id) => logosEmpresas[id] || '/logos/default.png'

  const esModoPDF = window.location.pathname.includes('/remisiones/')

  const navigate = useNavigate()



  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then((res) => res.json())
      .then((data) => {
        const disponibles = data.filter((impresora) => !impresora.fecha_salida);
        setImpresoras(data);
        setSeriesDisponibles(disponibles);
      })
      .catch((error) => console.error("Error al obtener las impresoras:", error));

    fetch("http://localhost:3000/api/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((error) => console.error("Error al obtener las empresas:", error));

    // Obtener remisiones desde el backend
    fetch("http://localhost:3000/api/remisiones/total")
    .then((res) => res.json())
    .then((data) => {
      setRemisiones(data);
    })
  .catch((error) => console.error("Error al obtener las remisiones:", error));
  }, []);

  const seriesFiltradas = seriesDisponibles.filter((impresora) =>
    impresora.serie.includes(busquedaSerie.toUpperCase())
  );

  const manejarSeleccionSerie = (serie) => {
    setSeriesSeleccionadas((prev) =>
      prev.includes(serie)
        ? prev.filter((s) => s !== serie)
        : [...prev, serie]
    );
  };

  const abrirFormularioRemision = () => {
    if (seriesSeleccionadas.length === 0) {
      toast.warn("Debes seleccionar al menos una serie.");
      return;
    }
    if (!empresaSeleccionada) {
      toast.warn("Debes seleccionar una empresa.");
      return;
    }

    // Determinar cliente y proyecto a asignar 
    const seriesSeleccionadasInfo = impresoras.filter(impresora => seriesSeleccionadas.includes(impresora.serie))
   
    // 🔹 Obtener los clientes y proyectos únicos de las series seleccionadas
    const clientesUnicos = [...new Set(seriesSeleccionadasInfo.map(imp => imp.cliente_id).filter(Boolean))];
    const proyectosUnicos = [...new Set(seriesSeleccionadasInfo.map(imp => imp.proyecto_id).filter(Boolean))];

    console.log("🟢 Clientes detectados:", clientesUnicos);
    console.log("🟢 Proyectos detectados:", proyectosUnicos);

     // ✅ Si todas las series tienen el mismo cliente y proyecto, lo asignamos automáticamente
    if (clientesUnicos.length === 1 && proyectosUnicos.length === 1) {
      setClienteProyecto({ cliente: clientesUnicos[0], proyecto: proyectosUnicos[0] });
      setMostrarFormularioRemision(true);
      return;
    }

    // ✅ Si todas tienen el mismo cliente pero no todas tienen proyecto, asignamos el cliente y pedimos el proyecto
    if (clientesUnicos.length === 1 && proyectosUnicos.length === 0) {
      setClienteProyecto({ cliente: clientesUnicos[0], proyecto: "" });
      setMostrarFormularioClienteProyecto(true);
      return;
    }
   
    // Error si hay mas de un cliente o proyecto distinto
    if(clientesUnicos.length > 1 || proyectosUnicos.length > 1) {
      toast.error("Las series seleccionadas tienen diferentes clientes y/o proyectos. Revisa la selección.")
      return
    }

    setMostrarFormularioClienteProyecto(true)
  };

  const generarVistaPrevia = () => {
    if (!formularioRemision.destinatario || !formularioRemision.direccion_entrega) {
      toast.warn("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // 🔍 Verificar si clienteProyecto.cliente es un ID y convertirlo en nombre
    let clienteNombre = clienteProyecto.cliente;
    let proyectoNombre = clienteProyecto.proyecto;

    if (typeof clienteProyecto.cliente === "number") {
        clienteNombre = impresoras.find(imp => imp.cliente_id == clienteProyecto.cliente)?.cliente?.nombre || null;
    }

    if (typeof clienteProyecto.proyecto === "number") {
        proyectoNombre = impresoras.find(imp => imp.proyecto_id == clienteProyecto.proyecto)?.proyecto?.nombre || null;
    }

    console.log("🔍 Vista previa - Cliente Nombre:", clienteNombre);
    console.log("🔍 Vista previa - Proyecto Nombre:", proyectoNombre);

    const empresaObjeto = empresas.find(e => e.id === Number(empresaSeleccionada))

    if (!empresaObjeto) {
      console.error("❌ ERROR: No se encontró la empresa seleccionada", empresaSeleccionada);
      toast.error("No se encontró la empresa seleccionada.");
      return;
    }
   
    console.log("✅ Datos enviados a Vista Previa:", {
      empresa: empresaObjeto.nombre, 
      cliente: clienteNombre,
      proyecto: proyectoNombre,
      destinatario: formularioRemision.destinatario,
      direccion_entrega: formularioRemision.direccion_entrega,
      notas: formularioRemision.notas || "Sin notas",
      series: seriesSeleccionadas,
    });


   // Generar el objeto de la remisión
    const nuevaRemision = {
      empresa: empresaObjeto.nombre,
      cliente: clienteNombre,
      proyecto: proyectoNombre,
      destinatario: formularioRemision.destinatario,
      direccion_entrega: formularioRemision.direccion_entrega,
      notas: formularioRemision.notas || "Sin notas",
      series: seriesSeleccionadas,
    };
  
    // 🔹 Redirigir a la nueva ruta con los datos de la remisión
    navigate("/movimientos/impresoras/generar-remision", { state: { remision: nuevaRemision } })
  };
  
  const generarRemision = async () => {
    try {
      // 🔹 Generamos el número de remisión único con milisegundos
      const fecha = new Date();
      const numeroRemisionGenerado = `REM-${fecha.getFullYear()}${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${fecha.getDate().toString().padStart(2, "0")}-${fecha
        .getHours()
        .toString()
        .padStart(2, "0")}${fecha.getMinutes().toString().padStart(2, "0")}${fecha
        .getSeconds()
        .toString()
        .padStart(2, "0")}${fecha.getMilliseconds().toString().padStart(3, "0")}`;
  
      // Buscar el ID del cliente en la lista de impresoras seleccionadas
      let clienteId = clienteProyecto.cliente 
      ? impresoras.find(imp => imp.cliente_id === clienteProyecto.cliente)?.cliente_id || null 
      : clienteManual || null;

      // Buscar el ID del proyecto en la lista de impresoras seleccionadas
      let proyectoId = clienteProyecto.proyecto 
      ? impresoras.find(imp => imp.proyecto_id === clienteProyecto.proyecto)?.proyecto_id || null 
      : proyectoManual || null;

      // Si no se encontró un ID en las series, usar el valor manual ingresado por el usuario
      clienteId = clienteId || clienteManual || null;
      proyectoId = proyectoId || proyectoManual || null;

      console.log("✅ Cliente ID asignado:", clienteId);
      console.log("✅ Proyecto ID asignado:", proyectoId);

  
      // 🔹 Si el usuario ingresó un nuevo cliente, primero lo creamos en la base de datos
      if (nuevoCliente) {
        console.log("📌 Registrando nuevo cliente:", nuevoCliente);
        const responseCliente = await fetch("http://localhost:3000/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoCliente }),
        });
  
        const dataCliente = await responseCliente.json();
        if (!responseCliente.ok) throw new Error("Error al crear el cliente");
  
        clienteId = dataCliente.id; // 🔹 Asignamos el ID del cliente recién creado
      }
  
      // Si el usuario ingresó un nuevo proyecto, primero lo creamos
      if (nuevoProyecto) {
        console.log("📌 Registrando nuevo proyecto:", nuevoProyecto);
        
        // 🔹 Un proyecto **requiere un cliente**, si no hay cliente, detenemos el proceso
        if (!clienteId) {
            toast.warn("❌ No se puede crear un proyecto sin un cliente asignado.");
            return;
        }
    
        const responseProyecto = await fetch("http://localhost:3000/api/proyectos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoProyecto, cliente_id: clienteId }),
        });
    
        const dataProyecto = await responseProyecto.json();
        console.log("📩 Respuesta del backend al crear proyecto:", dataProyecto);
    
        if (!responseProyecto.ok) throw new Error("Error al crear el proyecto");
    
        proyectoId = dataProyecto.id; // 🔹 Asignamos el ID recién creado
    }
  
      console.log("✅ Cliente asignado:", clienteId);
      console.log("✅ Proyecto asignado:", proyectoId);
  
      // 📌 Validación final: El cliente es obligatorio
      if (!clienteId) {
        toast.warn("Se requiere un cliente para la remisión. Verifica los datos.");
        return;
      }

      setNumeroRemision(numeroRemisionGenerado)
  
      const payload = {
        numero_remision: numeroRemisionGenerado,
        empresa_id: Number(empresaSeleccionada),
        cliente_id: clienteId ? Number(clienteId) : null,
        proyecto_id: proyectoId ? Number(proyectoId) : null,
        destinatario: formularioRemision.destinatario,
        direccion_entrega: formularioRemision.direccion_entrega,
        notas: formularioRemision.notas || null,
        series: seriesSeleccionadas,
        usuario_creador: "admin",
      };
  
      console.log("📤 Enviando datos al backend:", payload);
  
      const response = await fetch("http://localhost:3000/api/remisiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("❌ Respuesta del backend:", data);
        throw new Error(data.message || "Error al generar la remisión");
      }
  
      toast.success(`✅ Remisión ${data.numero_remision} generada con éxito`);

      // Actualizar la lista de remisiones despues de crear una nueva
      fetch("http://localhost:3000/api/remisiones/total")
        .then(res => res.json())
        .then(data => setRemisiones(data))
        .catch(error => console.error("Error al obtener las remisiones:", error)) 

      
      generarPDF(data.numero_remision)
      setMostrarVistaPrevia(false);

  
    } catch (error) {
      console.error("❌ Error en generarRemision:", error.message);
      toast.error("❌ Hubo un problema al generar la remisión");
    }
  };
  
 const hayAccesorios = seriesSeleccionadas.some(serie => {
    const impresora = impresoras.find(imp => imp.serie === serie);
    return impresora?.accesorios?.length > 0;
  });

  const obtenerEstilosEmpresa = (empresaId) => {
    switch (empresaId) {
      case "1": // IMME
        return {
          colorFondo: "bg-blue-800 text-white",
          bordeTabla: "border-blue-800",
          textoColor: "text-blue-800",
          logo: "/logos/imme.png", 
        };
      case "2": // Colour Klub
        return {
          colorFondo: "bg-blue-500 text-white",
          bordeTabla: "border-blue-500",
          textoColor: "text-blue-500",
          logo: "/logos/colour_klub.png", 
        };
      case "3": // Coneltec
        return {
          colorFondo: "bg-orange-600 text-white",
          bordeTabla: "border-orange-600",
          textoColor: "text-orange-600",
          logo: "/logos/coneltec.png", 
        };
      default:
        return {
          colorFondo: "bg-gray-300",
          bordeTabla: "border-gray-300",
          textoColor: "text-gray-600",
          logo: "", // Si no hay empresa seleccionada
        };
    }
  };

  const obtenerEstiloRemision = (empresa) => {
    switch (empresa) {
      case "1": // ID de IMME
        return "border-t-8 border-blue-700"; // Línea superior azul oscuro
      case "2": // ID de Colour Klub
        return "border-t-8 border-blue-400"; // Azul más claro
      case "3": // ID de Coneltec
        return "border-t-8 border-orange-600"; // Línea superior naranja
      default:
        return "border-t-8 border-gray-500"; // Si no hay empresa seleccionada, usa gris
    }
  };

  const generarPDF = async (numeroRemision) => {
    if (!numeroRemision) {
      console.error("❌ No se puede generar el PDF: número de remisión indefinido.");
      return
    }

    try {
        const response = await fetch(`http://localhost:3000/api/remisiones/pdf/${numeroRemision}`);
        if (!response.ok) throw new Error("No se pudo generar el PDF");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${numeroRemision}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url)

        toast.success("✅ PDF generado con éxito");
    } catch (error) {
        console.error("❌ Error al descargar el PDF:", error);
        toast.error("❌ No se pudo generar el PDF");
    }
};

  
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Movimientos de Impresoras
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            placeholder="Buscar serie..."
            className="w-full p-2 border rounded mb-4"
            value={busquedaSerie}
            onChange={(e) => setBusquedaSerie(e.target.value)}
          />

          <ul className="max-h-40 overflow-y-auto">
            {seriesFiltradas.map((impresora) => (
              <li key={impresora.serie} className="flex justify-between items-center border-b p-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={seriesSeleccionadas.includes(impresora.serie)}
                    onChange={() => manejarSeleccionSerie(impresora.serie)}
                  />
                  <span>{impresora.serie}</span>
                </label>
              </li>
            ))}
          </ul>

          <select
            className="w-full p-2 border rounded mt-4"
            value={empresaSeleccionada}
            onChange={(e) => setEmpresaSeleccionada(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una empresa
            </option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white py-2 px-6 rounded mt-4" onClick={abrirFormularioRemision}>
            Siguiente: Datos de Remisión
          </button>

          {mostrarFormularioClienteProyecto && (
            <div className="bg-gray-100 p-4 mt-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Asignar Cliente y Proyecto</h3>

              {/* Selección de Cliente */}
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <select
                className="w-full p-2 border rounded mb-2"
                value={clienteManual}
                onChange={(e) => setClienteManual(e.target.value)}
                disabled={nuevoCliente.trim().length > 0} // Si está escribiendo un nuevo cliente, deshabilitar el select
              >
                <option value="" disabled>Selecciona un cliente (Opcional)</option>
                {impresoras
                  .map(imp => imp.cliente?.nombre)
                  .filter((v, i, a) => v && a.indexOf(v) === i) // Eliminar duplicados
                  .map(cliente => (
                    <option key={cliente} value={cliente}>{cliente}</option>
                  ))}
              </select>

              {/* Opción para agregar nuevo cliente */}
              <input
                type="text"
                placeholder="Nuevo cliente (si no está en la lista)"
                className="w-full p-2 border rounded mb-4"
                value={nuevoCliente}
                onChange={(e) => {
                  setNuevoCliente(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setClienteManual(""); // Limpiar selección si se agrega nuevo
                  }
                }}
                disabled={clienteManual.length > 0} // Si se seleccionó un cliente, no permitir escribir uno nuevo
              />

              {/* Selección de Proyecto */}
              <label className="block text-sm font-medium text-gray-700">Proyecto</label>
              <select
                className="w-full p-2 border rounded mb-2"
                value={proyectoManual}
                onChange={(e) => setProyectoManual(e.target.value)}
                disabled={nuevoProyecto.trim().length > 0} // Si está escribiendo un nuevo proyecto, deshabilitar el select
              >
                <option value="" disabled>Selecciona un proyecto (Opcional)</option>
                {impresoras
                  .map(imp => imp.proyecto?.nombre)
                  .filter((v, i, a) => v && a.indexOf(v) === i) // Eliminar duplicados
                  .map(proyecto => (
                    <option key={proyecto} value={proyecto}>{proyecto}</option>
                  ))}
              </select>

              {/* Opción para agregar nuevo proyecto */}
              <input
                type="text"
                placeholder="Nuevo proyecto (si no está en la lista)"
                className="w-full p-2 border rounded mb-4"
                value={nuevoProyecto}
                onChange={(e) => {
                  setNuevoProyecto(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setProyectoManual(""); // Limpiar selección si se agrega nuevo
                  }
                }}
                disabled={proyectoManual.length > 0} // Si se seleccionó un proyecto, no permitir escribir uno nuevo
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => setMostrarFormularioClienteProyecto(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => {
                    // 🛑 Validación: Si hay un proyecto, debe haber un cliente
                    if ((proyectoManual || nuevoProyecto) && !clienteManual && !nuevoCliente) {
                      toast.warn("Si seleccionas un proyecto, también debes seleccionar o agregar un cliente.");
                      return;
                    }

                    setClienteProyecto({
                      cliente: clienteManual || nuevoCliente || null, // Cliente puede ser null si no hay proyecto
                      proyecto: proyectoManual || nuevoProyecto || null, // Proyecto es opcional
                    });

                    setMostrarFormularioClienteProyecto(false);
                    setMostrarFormularioRemision(true);
                  }}
                >
                  Confirmar Cliente y Proyecto
                </button>
              </div>
            </div>
          )}

          {mostrarFormularioRemision && (
            <div className="bg-gray-100 p-4 mt-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalles de la Remisión</h3>

              <input
                type="text"
                placeholder="Destinatario"
                className="w-full p-2 border rounded mb-2"
                value={formularioRemision.destinatario}
                onChange={(e) => setFormularioRemision({ ...formularioRemision, destinatario: e.target.value })}
              />

              <input
                type="text"
                placeholder="Dirección de Entrega"
                className="w-full p-2 border rounded mb-2"
                value={formularioRemision.direccion_entrega}
                onChange={(e) => setFormularioRemision({ ...formularioRemision, direccion_entrega: e.target.value })}
              />

              <textarea
                placeholder="Notas (Opcional)"
                className="w-full p-2 border rounded mb-2"
                value={formularioRemision.notas}
                onChange={(e) => setFormularioRemision({ ...formularioRemision, notas: e.target.value })}
              />

              <button className="bg-blue-600 text-white py-2 px-6 rounded mt-4" onClick={generarVistaPrevia}>
                Vista Previa
              </button>
            </div>
          )}

          {/* 📌 Sección de remisiones generadas */}
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Remisiones Generadas</h3>

            {remisiones.length === 0 ? (
              <p className="text-gray-600">No hay remisiones generadas aún.</p>
            ) : (
              <table className="w-full border-collapse border text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Número de Remisión</th>
                    <th className="border p-2">Cliente</th>
                    <th className="border p-2">Proyecto</th>
                    <th className="border p-2">Fecha</th>
                    <th className="border p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {remisiones.map((remision) => (
                    <tr key={remision.numero_remision}>
                      <td className="border p-2">{remision.numero_remision}</td>
                      <td className="border p-2">{remision.cliente?.nombre || "Sin cliente"}</td>
                      <td className="border p-2">{remision.proyecto?.nombre || "Sin proyecto"}</td>
                      <td className="border p-2">{new Date(remision.fecha_emision).toLocaleDateString()}</td>
                      <td className="border p-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => generarPDF(remision.numero_remision)}
                        >
                          Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {mostrarVistaPrevia && datosRemision && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
              <div className={`bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${obtenerEstiloRemision(empresaSeleccionada)}`}>
                
                {/* 🔹 Cabecera personalizada según la empresa */}
                {empresaSeleccionada === "1" && ( // IMME
                  <div className="flex justify-between items-center border-b pb-4 p-4">
                    <img src={obtenerLogoEmpresa(empresaSeleccionada)} alt="Logo IMME" className="h-20" />
                    <h3 className="text-lg font-semibold text-blue-800">REMISIÓN ENTREGA</h3>
                  </div>
                )}

                {empresaSeleccionada === "2" && ( // Colour Klub
                  <div className="flex flex-col items-center border-b pb-4 p-4">
                    <img src={obtenerLogoEmpresa(empresaSeleccionada)} alt="Logo Colour Klub" className="h-20 mt-2" />
                    <h3 className="text-lg font-semibold text-blue-500">REMISIÓN ENTREGA</h3>
                  </div>
                )}

                {empresaSeleccionada === "3" && ( // Coneltec
                  <div className="flex justify-between items-center border-b pb-4 p-4">
                    <h3 className="text-lg font-semibold text-orange-700">REMISIÓN ENTREGA</h3>
                    <img src={obtenerLogoEmpresa(empresaSeleccionada)} alt="Logo Coneltec" className="h-20" />
                  </div>
                )}



              {/* 🔹 Información general personalizada */}
              <div className={`p-4 mt-4 rounded-md shadow-md ${obtenerEstilosEmpresa(empresaSeleccionada).bordeTabla}`}>
                {empresaSeleccionada === "1" && ( // IMME - Estilo con bordes definidos
                  <div className="border-2 border-blue-700 p-4 rounded-md">
                    <p className="text-blue-800"><strong> Cliente:</strong> 
                      {typeof clienteProyecto.cliente === "number"
                        ? impresoras.find(imp => imp.cliente_id == clienteProyecto.cliente)?.cliente?.nombre || "Sin cliente"
                        : clienteProyecto.cliente || "Sin cliente"}
                    </p>
                    {datosRemision.proyecto && <p className="text-blue-800"><strong>Proyecto:</strong> {datosRemision.proyecto}</p>}
                    <p className="text-blue-800"><strong>Sitio:</strong> {formularioRemision.destinatario}</p>
                    <p className="text-blue-800"><strong>Dirección de Entrega:</strong> {formularioRemision.direccion_entrega}</p>
                    {formularioRemision.notas && (
                      <p className="text-blue-800"><strong>Detalles Adicionales:</strong> {formularioRemision.notas}</p>
                    )}
                  </div>
                )}

                {empresaSeleccionada === "2" && ( // Colour Klub - Estilo tipo tarjeta
                  <div className="bg-gray-100 p-4 rounded-lg shadow-lg border-l-4 border-yellow-500">
                    <p className="text-gray-800"><strong> Cliente:</strong> 
                      {typeof clienteProyecto.cliente === "number"
                        ? impresoras.find(imp => imp.cliente_id == clienteProyecto.cliente)?.cliente?.nombre || "Sin cliente"
                        : clienteProyecto.cliente || "Sin cliente"}
                    </p>
                    {datosRemision.proyecto && <p className="text-gray-800"><strong>Proyecto:</strong> {datosRemision.proyecto}</p>}
                    <p className="text-gray-800"><strong>Sitio:</strong> {formularioRemision.destinatario}</p>
                    <p className="text-gray-800"><strong>Dirección de Entrega:</strong> {formularioRemision.direccion_entrega}</p>
                    {formularioRemision.notas && (
                      <p className="text-gray-800"><strong>Detalles Adicionales:</strong> {formularioRemision.notas}</p>
                    )}
                  </div>
                )}

                {empresaSeleccionada === "3" && ( // Coneltec - Estilo minimalista con iconos
                  <div className="p-4 rounded-md bg-orange-100 shadow-sm border border-orange-500">
                    <p className="text-orange-800"><strong> Cliente:</strong> 
                      {typeof clienteProyecto.cliente === "number"
                        ? impresoras.find(imp => imp.cliente_id == clienteProyecto.cliente)?.cliente?.nombre || "Sin cliente"
                        : clienteProyecto.cliente || "Sin cliente"}
                    </p>
                    {datosRemision.proyecto && <p className="text-orange-800"><strong>📂 Proyecto:</strong> {datosRemision.proyecto}</p>}
                    <p className="text-orange-800"><strong>👤Sitio:</strong> {formularioRemision.destinatario}</p>
                    <p className="text-orange-800"><strong>📍 Dirección de Entrega:</strong> {formularioRemision.direccion_entrega}</p>
                    {formularioRemision.notas && (
                      <p className="text-orange-800"><strong>Detalles Adicionales:</strong> {formularioRemision.notas}</p>
                    )}
                  </div>
                )}
              </div>


                

                {/* 🔹 Tabla de series */}
                <table className="w-full border-collapse border mt-4 text-sm">
                  <thead className={obtenerEstilosEmpresa(empresaSeleccionada).colorFondo}>
                    <tr>
                      <th className={`border p-2 ${obtenerEstilosEmpresa(empresaSeleccionada).bordeTabla}`}>Marca</th>
                      <th className={`border p-2 ${obtenerEstilosEmpresa(empresaSeleccionada).bordeTabla}`}>Modelo</th>
                      <th className={`border p-2 ${obtenerEstilosEmpresa(empresaSeleccionada).bordeTabla}`}>Serie</th>
                      {hayAccesorios && (
                        <th className={`border p-2 ${obtenerEstilosEmpresa(empresaSeleccionada).bordeTabla}`}>Accesorios</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {seriesSeleccionadas.map((serie) => {
                      const impresora = impresoras.find((imp) => imp.serie === serie);
                      return (
                        <tr key={serie}>
                          <td className="border p-2">{impresora?.marca?.nombre || "Desconocida"}</td>
                          <td className="border p-2">{impresora?.modelo || "Desconocido"}</td>
                          <td className="border p-2">{serie}</td>
                          {hayAccesorios && (
                            <td className="border p-2">
                              {impresora.accesorios && impresora.accesorios.length > 0 ? (
                                <table className="w-full border-collapse">
                                  <tbody>
                                    {impresora.accesorios.map((accesorio, index) => (
                                      <tr key={index}>
                                        <td>{accesorio.numero_parte}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                "Sin accesorios"
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-200 font-semibold">
                      <td colSpan={hayAccesorios ? 3 : 2} className="border p-2 text-right">Total:</td>
                      <td className="border p-2">
                        {seriesSeleccionadas.length + seriesSeleccionadas.reduce((totalAccesorios, serie) => {
                          const impresora = seriesDisponibles.find((imp) => imp.serie === serie);
                          return totalAccesorios + (impresora.accesorios ? impresora.accesorios.length : 0);
                        }, 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* 🔹 Sección de firmas personalizada */}
                <div className="mt-6">
                  {empresaSeleccionada === "1" && ( // IMME - Firmas en dos columnas con líneas gruesas
                    <div className="flex justify-between border-t-4 border-blue-700 pt-4">
                      <div className="text-center w-1/2">
                        <p className="font-semibold text-blue-700 pb-6">Firma de quien recibe</p>
                        <div className="border-t-4 border-blue-700 w-48 mx-auto mt-4"></div>
                        <p className="text-sm text-blue-700">Nombre y Firma</p>
                      </div>
                      <div className="text-center w-1/2">
                        <p className="font-semibold text-blue-700 pb-6">Firma de quien entrega</p>
                        <div className="border-t-4 border-blue-700 w-48 mx-auto mt-4"></div>
                        <p className="text-sm text-blue-700">Nombre y Firma</p>
                      </div>
                    </div>
                  )}

                  {empresaSeleccionada === "2" && ( // Colour Klub - Firmas en dos filas con línea punteada
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 pb-6">Firma de quien recibe</p>
                        <div className="border-t-2 border-dashed border-yellow-500 w-48 mx-auto mt-2"></div>
                        <p className="text-sm text-gray-600">Nombre y Firma</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 pb-6">Firma de quien entrega</p>
                        <div className="border-t-2 border-dashed border-yellow-500 w-48 mx-auto mt-2"></div>
                        <p className="text-sm text-gray-600">Nombre y Firma</p>
                      </div>
                    </div>
                  )}

                  {empresaSeleccionada === "3" && ( // Coneltec - Diseño con rectángulo en fondo naranja
                    <div className="bg-orange-200 p-4 rounded-md">
                      <div className="text-center">
                        <p className="font-semibold text-orange-800 pb-6">Firma de quien recibe</p>
                        <div className="border-t-2 border-orange-800 w-48 mx-auto mt-2"></div>
                        <p className="text-sm text-orange-800">Nombre y Firma</p>
                      </div>
                      <div className="text-center mt-4">
                        <p className="font-semibold text-orange-800 pb-6">Firma de quien entrega</p>
                        <div className="border-t-2 border-orange-800 w-48 mx-auto mt-2"></div>
                        <p className="text-sm text-orange-800">Nombre y Firma</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🔹 Botones de acción */}
                {!esModoPDF && (
                  <div className="flex justify-between mt-4">
                    <button 
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setMostrarVistaPrevia(false)}
                    >
                      Modificar Información
                    </button>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={generarRemision(numeroRemision)}
                    >
                      Confirmar Remisión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovimientosImpresoras;
