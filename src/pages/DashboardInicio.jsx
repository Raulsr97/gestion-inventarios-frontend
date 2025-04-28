import React from "react";
import CardStockPrincipal from "../components/CardStockPrincipal";
import CardProductosVendidos from "../components/CardProductosVendidos";
import CardClientesCompradores from "../components/CardClientesCompradores";
import CardProveedoresActivos from "../components/CardProveedoresActivos";
import CardProyectos from "../components/CardProyectos";
import GraficaVentasPorMes from "../components/GraficaVentasPorMes";
import GraficaProveedoresPorcentaje from "../components/GraficasProveedoresPorcentaje";
import GraficaClientesPorcentaje from "../components/GraficaClientesPorcentaje";
import GraficaConsumiblesMasVendidos from "../components/GraficaConsumiblesMasVendidos";

function DashboardInicio() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Encabezado */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Resumen Ejecutivo de Lógistica e Inventario
        </h1>

        {/* Grid de Cards principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardStockPrincipal />
          <CardProductosVendidos />
          <CardClientesCompradores />
          <CardProveedoresActivos />
          <CardProyectos />
        </div>

        {/* Separador visual */}
        <hr className="border-gray-300 my-8" />

        {/* Subtítulo de Gráficas */}
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Análisis de Métricas
        </h2>

        {/* Grid de Gráficas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GraficaVentasPorMes />
          <GraficaProveedoresPorcentaje />
          <GraficaClientesPorcentaje />
          <GraficaConsumiblesMasVendidos />
        </div>

      </div>
    </div>
  );
}

export default DashboardInicio;
