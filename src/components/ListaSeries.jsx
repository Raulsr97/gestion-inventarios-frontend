import { FaTrash } from "react-icons/fa"

function ListaSeries ({ series, onDeleteSerie}) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-2/3 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          Series Escaneadas:
          <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded-md">
            {series.length}
          </span>
        </h3>
  
        {/* Lista de series con scroll interno más sutil */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md max-h-138 border border-gray-200 shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="grid grid-cols-3 gap-4">
            {series.slice(0).reverse().map((serie, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-md shadow-sm transition-all hover:shadow-md"
              >
                <span className="text-gray-700 font-medium">{serie}</span>
                <button
                  onClick={() => onDeleteSerie(serie)}
                  className="text-red-700 hover:text-red-500 transition-all p-1 rounded-md"
                >
                  <FaTrash size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default ListaSeries