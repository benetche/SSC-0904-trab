import React from "react";

const Sidebar = () => {
  return (
    <div className="min-w-64 max-w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold">Menu</div>
      <nav className="flex flex-col p-4 space-y-2">
        <a href="/medico" className="p-2 bg-gray-700 rounded hover:bg-gray-600">
          Médico
        </a>
        <a
          href="/pacientes"
          className="p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Pacientes
        </a>
        <a
          href="/receitas"
          className="p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Receitas
        </a>
        <a
          href="/estoque"
          className="p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Estoque
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
