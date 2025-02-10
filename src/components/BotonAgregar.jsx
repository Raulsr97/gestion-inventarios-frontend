function BotonAgregar({ text = "Agregar", onClick }) {
  return (
    <div className="col-span-2 flex justify-end mt-20">
      <button 
        className="bg-blue-600 text-white text-sm px-3 py-3 rounded-md hover:bg-blue-700"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}

export default BotonAgregar