// Importamos BrowserRouter para manejar las rutas y ToastContainer para notificaciones
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente LayoutConSidebar: Maneja la estructura de la app
function LayoutConSidebar() {
  // Obtenemos la ubicación actual de la ruta
  const location = useLocation()
  // Verificamos si estamos en una vista de PDF para ocultar el Sidebar
  const esVistaPDF = location.pathname.startsWith('/vista-remision')

  return (
    <div className={esVistaPDF ? "" : "flex h-screen"}>
      {/* Mostrar Sidebar solo si no estamos en modo PDF */}
      {!esVistaPDF && <Sidebar />}

      {/* Contenedor principal con Router de la aplicación */}
      <div className="flex-1 p-0 bg-gray-200 overflow-auto">
        <AppRouter />
      </div>

      {/* Configuración de notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  )
}

// Componente principal App: Define el Router general
function App() {
  return (
    <Router>
      <LayoutConSidebar />
    </Router>
  )
}


export default App;
