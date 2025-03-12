import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
import Productos from '../pages/Productos'
import ConsultaProductos from '../pages/ConsultaProductos'
import AgregarProductos from '../pages/AgregarProductos'
import Movimientos from '../pages/Movimientos'
import AgregarImpresora from "../pages/AgregarImpresora";
import AgregarToner from "../pages/AgregarToner";
import AgregarUnidadImagen from "../pages/AgregarUnidadImagen";
import AgregarRefaccion from "../pages/AgregarRefaccion";
import Consultas from "../pages/Consultas";
import ConsultaImpresoras from "../pages/ConsultaImpresoras";
import MovimientosImpresoras from "../pages/MovimientosImpresoras";
import VistaPreviaRemisionEntrega from "../pages/VistaPreviaRemisionEntrega"; 

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/productos/agregar" element={<AgregarProductos />} />
            <Route path="/productos/consulta" element={<ConsultaProductos />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/movimientos/impresoras/agregar" element={<MovimientosImpresoras />} />
            <Route path="/movimientos/impresoras/generar-remision" element={<VistaPreviaRemisionEntrega />} />
            <Route path="/productos/impresoras/agregar" element={<AgregarImpresora />} />
            <Route path="/productos/toner/agregar" element={<AgregarToner />} />
            <Route path="/productos/unidades-imagen/agregar" element={<AgregarUnidadImagen />} />
            <Route path="/productos/refacciones/agregar" element={<AgregarRefaccion />} />
            <Route path="/consultas/impresoras" element={<ConsultaImpresoras />} />
        </Routes>        
    )
}

export default AppRouter

