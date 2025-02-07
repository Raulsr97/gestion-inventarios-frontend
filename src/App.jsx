import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Navbar lateral */}
        <Sidebar />

        {/* Contenido derecho */}
        <div className="flex-1 p-0 bg-gray-200 overflow-auto">
          <AppRouter />
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </Router>
  )
}

export default App;
