import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
import Productos from '../pages/Productos'
import Movimientos from '../pages/Movimientos'

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/movimientos" element={<Movimientos />} />
        </Routes>        
    )
}

export default AppRouter