import axios from "axios";
import React, { useState, useEffect } from "react";
import { path } from "../components/constants";
const PacientesGerenciamento = ({ receitas, deleteReceita, updateReceita }) => {
  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    idade: 0,
    endereco: "",
  });

  useEffect(() => {
    fetch(`${path}/api/pacientes/getAll`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(`${path}/subscribe/pacientes/getAll`);

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data).data;
      console.log(data);
      setPacientes(data);
      kafkaConsumer.close();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    const newPaciente = { ...formData, idade: Number(formData.idade) };
    try {
      await axios.post(`${path}/api/pacientes/criar`, newPaciente);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pacientes</h2>
      <div className="flex space-x-4">
        <div className=" w-96 ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pacientes.map((paciente) => (
                <tr key={paciente.cpf}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.nome}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.cpf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" bg-gray-50 p-4 rounded-lg shadow-md min-w-72">
          <h3 className="text-lg font-medium mb-4">Criar paciente</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="medicamento"
              >
                Nome
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={formData.nome}
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
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                id="cpf"
                value={formData.cpf}
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
                Endereço
              </label>
              <input
                type="text"
                name="endereco"
                id="endereco"
                value={formData.endereco}
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
                Idade
              </label>
              <input
                type="number"
                name="idade"
                id="idade"
                value={formData.idade}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PacientesGerenciamento;
