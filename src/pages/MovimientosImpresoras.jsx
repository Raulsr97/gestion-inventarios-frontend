import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function MovimientosImpresoras() {
  // 📌 Estados principales
  const [impresoras, setImpresoras] = useState([]);
  const [empresas, setEmpresas] = useState([]);
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

  // 🟢 Cargar datos al iniciar
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
  }, []);

  // 📌 Filtrar búsqueda por número de serie
  const seriesFiltradas = seriesDisponibles.filter((impresora) =>
    impresora.serie.includes(busquedaSerie.toUpperCase())
  );

  // 📌 Manejar selección de series
  const manejarSeleccionSerie = (serie) => {
    setSeriesSeleccionadas((prev) =>
      prev.includes(serie)
        ? prev.filter((s) => s !== serie)
        : [...prev, serie]
    );
  };

  // 📌 Avanzar al formulario de remisión
  const abrirFormularioRemision = () => {
    if (seriesSeleccionadas.length === 0) {
      toast.warn("Debes seleccionar al menos una serie.");
      return;
    }
    if (!empresaSeleccionada) {
      toast.warn("Debes seleccionar una empresa.");
      return;
    }
    setMostrarFormularioRemision(true);
  };

  // 📌 Generar vista previa de la remisión
  const generarVistaPrevia = () => {
    if (!formularioRemision.destinatario || !formularioRemision.direccion_entrega) {
      toast.warn("Por favor, completa todos los campos obligatorios.");
      return;
    }
    setMostrarVistaPrevia(true);
  };

  // 📌 Enviar remisión al backend
  const generarRemision = async () => {
    const payload = {
      numero_remision: `REM-${Date.now()}`,
      empresa_id: empresaSeleccionada,
      destinatario: formularioRemision.destinatario,
      direccion_entrega: formularioRemision.direccion_entrega,
      notas: formularioRemision.notas,
      series: seriesSeleccionadas,
    };

    try {
      const response = await fetch("http://localhost:3000/api/remisiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al crear la remisión");

      toast.success("✅ Remisión generada con éxito");
      setMostrarVistaPrevia(false);
      setSeriesSeleccionadas([]);
      setEmpresaSeleccionada("");
      setFormularioRemision({ destinatario: "", direccion_entrega: "", notas: "" });
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al generar la remisión");
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

          {mostrarVistaPrevia && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Vista Previa</h3>
                <p><strong>Destinatario:</strong> {formularioRemision.destinatario}</p>
                <p><strong>Dirección de Entrega:</strong> {formularioRemision.direccion_entrega}</p>
                <p><strong>Notas:</strong> {formularioRemision.notas || "Sin notas"}</p>

                <button className="bg-green-600 text-white px-4 py-2 rounded mt-4" onClick={generarRemision}>
                  Confirmar Remisión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovimientosImpresoras;
