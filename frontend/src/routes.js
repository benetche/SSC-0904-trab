// src/Routes.js
import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import PainelFarmaceutico from "./pages/farmaceutico";
import MedicamentoPage from "./components/medicamento";
// import MedicamentoDetalhes from "./pages/MedicamentoDetalhes";

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<MedicamentoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
