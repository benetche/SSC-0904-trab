// src/pages/GestaoReceitas.js
import React, { useState, useEffect } from "react";
import { path } from "../components/constants";
const GestaoReceitas = ({ receitas, deleteReceita, updateReceita }) => {
  const [allReceitas, setAllReceitas] = useState([]);
  useEffect(() => {
    const method = "getAll";
    fetch(`${path}/api/receita/getAll`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(
      `${path}/subscribe/receita/${method}`
    );

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAllReceitas(data.data);
      kafkaConsumer.close();
    };
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Gestão de Receitas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código Receita
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medicamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dose
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequência
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allReceitas.length > 0 ? (
              allReceitas.map((receita) => (
                <tr key={receita.cod_receita}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receita.cod_receita}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receita.paciente.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receita.receituario.medicamento.substancia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receita.receituario.dose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receita.receituario.frequencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receita.medico.nome}
                  </td>
                </tr>
              ))
            ) : (
              <p>Não há receitas</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestaoReceitas;
