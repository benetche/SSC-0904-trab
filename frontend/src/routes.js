import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
// import PainelFarmaceutico from "./pages/farmaceutico";
import PainelMedico from "./pages/medico";

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<PainelMedico />} />
        {/* <Route path="/farmaceutico" element={<PainelFarmaceutico />} /> */}
        <Route path="/medico" element={<PainelMedico />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
