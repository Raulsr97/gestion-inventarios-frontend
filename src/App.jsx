import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import AppRouter from "./routes/AppRouter";

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
      </div>
    </Router>
  )
}

export default App;
