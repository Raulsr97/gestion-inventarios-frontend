// Importamos componentes necesarios para el enrutamiento
import { Routes, Route } from "react-router-dom";
// Importamos todas las páginas de la aplicación
import DashboardInicio from "../pages/DashboardInicio";

import Productos from '../pages/Productos'
import AgregarImpresora from "../pages/AgregarImpresora";
import AgregarToner from "../pages/AgregarToner";
import AgregarUnidadImagen from "../pages/AgregarUnidadImagen";
import AgregarRefaccion from "../pages/AgregarRefaccion";

import Consultas from "../pages/Consultas";
import ConsultaImpresoras from "../pages/ConsultaImpresoras";
import ConsultaToners from "../pages/ConsultaToners"
import ConsultaUnidadesImagen from "../pages/ConsultaUnidadesImg";
import ConsultaRefacciones from "../pages/ConsultaRefacciones";

import Gestiones from "../pages/GestionProductos";
import GestionImpresoras from "../pages/GestionImpresoras";
import GestionToners from "../pages/GestionToners";
import GestionUnidadesImg from "../pages/GestionUnidadesImg";
import GestionRefacciones from "../pages/GestionRefacciones";

import VistaPreviaRemisionEntrega from "../pages/VistaPreviaRemisionEntrega"; 
import VistaRemisionPorNumero from "../pages/VistaRemisionPorNumero"
import VistaPreviaRemisionRecoleccion from "../pages/VistaPreviaRemisionRecoleccion";
import VistaRemisionRecoleccionPorNumero from "../pages/VistaRemisionRecoleccionPorNumero"

import Remisiones from "../pages/Remisiones"
import BuscadorRemisiones from "../pages/BuscadorRemisiones";
import RemisionRecoleccion from "../pages/RemisionRecoleccion";


// Configuración del Router principal
function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<DashboardInicio />} />
            
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/impresoras/agregar" element={<AgregarImpresora />} />
            <Route path="/productos/toner/agregar" element={<AgregarToner />} />
            <Route path="/productos/unidades-imagen/agregar" element={<AgregarUnidadImagen />} />
            <Route path="/productos/refacciones/agregar" element={<AgregarRefaccion />} />

            <Route path="/consultas" element={<Consultas />} />
            <Route path="/consultas/impresoras" element={<ConsultaImpresoras />} />
            <Route path="/consultas/toners" element={<ConsultaToners />} />
            <Route path="/consultas/unidades-imagen" element={<ConsultaUnidadesImagen />} />
            <Route path="/consultas/refacciones" element={<ConsultaRefacciones />} />
            
            <Route path="/gestion-productos" element={<Gestiones />} />
            <Route path="/gestion-productos/gestion-impresoras" element={<GestionImpresoras />} />
            <Route path="/gestion-productos/gestion-toners" element={<GestionToners />} />
            <Route path="/gestion-productos/gestion-unidades-img" element={<GestionUnidadesImg />} />
            <Route path="/gestion-productos/gestion-refacciones" element={<GestionRefacciones/>} />
            
            <Route path="/gestion-productos/gestionimpresoras/generar-remision" element={<VistaPreviaRemisionEntrega />} />
            <Route path="/vista-remision/:numero_remision" element={<VistaRemisionPorNumero />} />
            <Route path="/remisiones/recoleccion/vista-previa" element={<VistaPreviaRemisionRecoleccion />} />
            <Route path="/vista-remision-recoleccion/:numero_remision" element={<VistaRemisionRecoleccionPorNumero />} />
            
            <Route path="/remisiones" element={<Remisiones />} />
            <Route path="/remisiones/buscar" element={<BuscadorRemisiones />} />
            <Route path="/remisiones/recoleccion" element={<RemisionRecoleccion />} />
        </Routes>        
    )
}

export default AppRouter

