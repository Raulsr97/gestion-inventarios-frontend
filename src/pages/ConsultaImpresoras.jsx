import { useEffect } from "react";
import { useState } from "react";
import CardStockGeneral from "../components/CardStockGeneral";
import CardMovimientosMes from "../components/CardMovimientos";
import CardStockProyectos from "../components/CardStockProyectos";

function ConsultaImpresoras() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Stock General */}
          <CardStockGeneral />

          {/* Movimientos del último mes */}
          <CardMovimientosMes />

          {/* Impresoras por Proyecto */}
          <CardStockProyectos />

          {/* Impresoras por Cliente */}
          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-700">Por Cliente</h3>
            <p className="text-3xl font-bold text-purple-600">30</p>
            <p className="text-sm text-gray-500">Clientes con impresoras</p>
          </div>

          {/* Impresoras en Reparación */}
          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-700">En Reparación</h3>
            <p className="text-3xl font-bold text-red-600">5</p>
            <p className="text-sm text-gray-500">Equipos en mantenimiento</p>
          </div>

          {/* Impresoras Entregadas */}
          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-700">Entregadas</h3>
            <p className="text-3xl font-bold text-teal-600">20</p>
            <p className="text-sm text-gray-500">Total entregadas este mes</p>
          </div>

          {/* Promedio de tiempo en almacén */}
          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-700">Tiempo en Almacén</h3>
            <p className="text-3xl font-bold text-indigo-600">15 días</p>
            <p className="text-sm text-gray-500">Promedio antes de entrega</p>
          </div>

          {/* Impresoras fuera de servicio */}
          <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-700">Fuera de Servicio</h3>
            <p className="text-3xl font-bold text-gray-600">2</p>
            <p className="text-sm text-gray-500">Equipos dados de baja</p>
          </div>
        </div>

        {/* 🔹 Sección de Detalles */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Detalles de Consulta</h2>
          <p className="text-gray-500">Selecciona una consulta para ver más información.</p>

          {/* 🔍 Simulación de tabla de datos */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2">Proyecto</th>
                  <th className="border border-gray-300 p-2">Cliente</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                  <th className="border border-gray-300 p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">Suburbia</td>
                  <td className="border border-gray-300 p-2">Cliente A</td>
                  <td className="border border-gray-300 p-2">10</td>
                  <td className="border border-gray-300 p-2">Almacén</td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">Liverpool</td>
                  <td className="border border-gray-300 p-2">Cliente B</td>
                  <td className="border border-gray-300 p-2">5</td>
                  <td className="border border-gray-300 p-2">En uso</td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">Sears</td>
                  <td className="border border-gray-300 p-2">Cliente C</td>
                  <td className="border border-gray-300 p-2">8</td>
                  <td className="border border-gray-300 p-2">Almacén</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ConsultaImpresoras;
