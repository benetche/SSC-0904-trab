import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import PainelMedico from "./pages/medico";
import Sidebar from "./components/sidebar";
import GestaoReceitas from "./pages/receitas";
import EstoqueGerenciamento from "./pages/estoque";
import PacientesGerenciamento from "./pages/pacientes";

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/">
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<PainelMedico />} />
          <Route path="/medico" element={<PainelMedico />} />
          <Route path="/receitas" element={<GestaoReceitas />} />
          <Route path="/estoque" element={<EstoqueGerenciamento />} />
          <Route path="/pacientes" element={<PacientesGerenciamento />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
