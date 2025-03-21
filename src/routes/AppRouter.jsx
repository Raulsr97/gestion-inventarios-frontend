import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
import Productos from '../pages/Productos'
import ConsultaProductos from '../pages/ConsultaProductos'
import AgregarProductos from '../pages/AgregarProductos'
import AgregarImpresora from "../pages/AgregarImpresora";
import AgregarToner from "../pages/AgregarToner";
import AgregarUnidadImagen from "../pages/AgregarUnidadImagen";
import AgregarRefaccion from "../pages/AgregarRefaccion";
import Consultas from "../pages/Consultas";
import ConsultaImpresoras from "../pages/ConsultaImpresoras";
import VistaPreviaRemisionEntrega from "../pages/VistaPreviaRemisionEntrega"; 
import Gestiones from "../pages/GestionProductos";
import GestionImpresoras from "../pages/GestionImpresoras";
import VistaRemisionPorNumero from "../pages/VistaRemisionPorNumero"

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/productos/agregar" element={<AgregarProductos />} />
            <Route path="/productos/consulta" element={<ConsultaProductos />} />
            <Route path="/gestion-productos" element={<Gestiones />} />
            <Route path="/gestion-productos/gestion-impresoras" element={<GestionImpresoras />} />
            <Route path="/gestion-productos/gestionimpresoras/generar-remision" element={<VistaPreviaRemisionEntrega />} />
            <Route path="/productos/impresoras/agregar" element={<AgregarImpresora />} />
            <Route path="/productos/toner/agregar" element={<AgregarToner />} />
            <Route path="/productos/unidades-imagen/agregar" element={<AgregarUnidadImagen />} />
            <Route path="/productos/refacciones/agregar" element={<AgregarRefaccion />} />
            <Route path="/consultas/impresoras" element={<ConsultaImpresoras />} />
            <Route path="/vista-remision/:numero_remision" element={<VistaRemisionPorNumero />} />
        </Routes>        
    )
}

export default AppRouter

