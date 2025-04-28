import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardInicio from "../pages/DashboardInicio";
import Productos from '../pages/Productos'
import ConsultaProductos from '../pages/ConsultaProductos'
import AgregarProductos from '../pages/AgregarProductos'
import AgregarImpresora from "../pages/AgregarImpresora";
import AgregarToner from "../pages/AgregarToner";
import AgregarUnidadImagen from "../pages/AgregarUnidadImagen";
import AgregarRefaccion from "../pages/AgregarRefaccion";
import Consultas from "../pages/Consultas";
import ConsultaImpresoras from "../pages/ConsultaImpresoras";
import ConsultaToners from "../pages/ConsultaToners"
import ConsultaUnidadesImagen from "../pages/ConsultaUnidadesImg";
import ConsultaRefacciones from "../pages/ConsultaRefacciones";
import VistaPreviaRemisionEntrega from "../pages/VistaPreviaRemisionEntrega"; 
import Gestiones from "../pages/GestionProductos";
import GestionImpresoras from "../pages/GestionImpresoras";
import GestionToners from "../pages/GestionToners";
import GestionUnidadesImg from "../pages/GestionUnidadesImg";
import GestionRefacciones from "../pages/GestionRefacciones";
import VistaRemisionPorNumero from "../pages/VistaRemisionPorNumero"
import Remisiones from "../pages/Remisiones"
import BuscadorRemisiones from "../pages/BuscadorRemisiones";
import RemisionRecoleccion from "../pages/RemisionRecoleccion";
import VistaPreviaRemisionRecoleccion from "../pages/VistaPreviaRemisionRecoleccion";
import VistaRemisionRecoleccionPorNumero from "../pages/VistaRemisionRecoleccionPorNumero"


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<DashboardInicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/productos/agregar" element={<AgregarProductos />} />
            <Route path="/productos/consulta" element={<ConsultaProductos />} />
            <Route path="/gestion-productos" element={<Gestiones />} />
            <Route path="/gestion-productos/gestion-impresoras" element={<GestionImpresoras />} />
            <Route path="/gestion-productos/gestion-toners" element={<GestionToners />} />
            <Route path="/gestion-productos/gestion-unidades-img" element={<GestionUnidadesImg />} />
            <Route path="/gestion-productos/gestion-refacciones" element={<GestionRefacciones/>} />
            <Route path="/gestion-productos/gestionimpresoras/generar-remision" element={<VistaPreviaRemisionEntrega />} />
            <Route path="/productos/impresoras/agregar" element={<AgregarImpresora />} />
            <Route path="/productos/toner/agregar" element={<AgregarToner />} />
            <Route path="/productos/unidades-imagen/agregar" element={<AgregarUnidadImagen />} />
            <Route path="/productos/refacciones/agregar" element={<AgregarRefaccion />} />
            <Route path="/consultas/impresoras" element={<ConsultaImpresoras />} />
            <Route path="/consultas/toners" element={<ConsultaToners />} />
            <Route path="/consultas/unidades-imagen" element={<ConsultaUnidadesImagen />} />
            <Route path="/consultas/refacciones" element={<ConsultaRefacciones />} />
            <Route path="/vista-remision/:numero_remision" element={<VistaRemisionPorNumero />} />
            <Route path="/remisiones" element={<Remisiones />} />
            <Route path="/remisiones/buscar" element={<BuscadorRemisiones />} />
            <Route path="/remisiones/recoleccion" element={<RemisionRecoleccion />} />
            <Route path="/remisiones/recoleccion/vista-previa" element={<VistaPreviaRemisionRecoleccion />} />
            <Route path="/vista-remision-recoleccion/:numero_remision" element={<VistaRemisionRecoleccionPorNumero />} />
        </Routes>        
    )
}

export default AppRouter

