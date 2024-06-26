import axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { path } from "../components/constants";
const EstoqueGerenciamento = ({ receitas, deleteReceita, updateReceita }) => {
  const [estoque, setEstoque] = useState([]);
  const posto = "12345";
  const [formData, setFormData] = useState({
    posto: posto,
    medicamento: "",
    quantidade: "",
  });

  useEffect(() => {
    fetch(`${path}/api/posto/getByCodigo/${posto}`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(
      `${path}/subscribe/posto/getByCodigo/${posto}`
    );

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      console.log(data);
      setEstoque(data.estoque);
      kafkaConsumer.close();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${path}/api/posto/estoque/update`, formData);
      Navigate("/estoque");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Gestão de Estoque</h2>
      <div className="flex space-x-4">
        <div className="overflow-x-auto w-3/4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Medicamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Substância
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estoque.length > 0 ? (
                estoque.map((item) => (
                  <tr key={item.medicamento.codigo}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {posto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {item.medicamento.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-56">
                      {item.medicamento.substancia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {item.quantidade}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Não há estoque
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-1/4 bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Atualizar Estoque</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="medicamento"
              >
                Medicamento
              </label>
              <input
                type="text"
                name="medicamento"
                id="medicamento"
                value={formData.medicamento}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="quantidade"
              >
                Quantidade
              </label>
              <input
                type="number"
                name="quantidade"
                id="quantidade"
                value={formData.quantidade}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Atualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EstoqueGerenciamento;
