import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Nuevo componente para detectar ruta
function LayoutConSidebar() {
  const location = useLocation()

  const esVistaPDF = location.pathname.startsWith('/vista-remision')

  return (
    <div className={esVistaPDF ? "" : "flex h-screen"}>
      {/* Mostrar Sidebar solo si no estamos en modo PDF */}
      {!esVistaPDF && <Sidebar />}

      <div className="flex-1 p-0 bg-gray-200 overflow-auto">
        <AppRouter />
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  )
}

function App() {
  return (
    <Router>
      <LayoutConSidebar />
    </Router>
  )
}


export default App;
