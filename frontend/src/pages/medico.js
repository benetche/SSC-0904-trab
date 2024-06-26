import React, { useState, useEffect } from "react";
import axios from "axios";
import { path } from "../components/constants";
function PainelMedico() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receita, setReceita] = useState({
    cpfPaciente: "",
    codigoMedicamento: "",
    dose: "",
    frequencia: "",
    medico: "",
  });

  const [medicos, setMedicos] = useState([]);
  useEffect(() => {
    const method = "getAll";
    fetch(`${path}/api/medicamento/getAll`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(
      `${path}/subscribe/medicamento/${method}`
    );

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMedicamentos(data.data);
      kafkaConsumer.close();
    };
  }, []);

  useEffect(() => {
    const method = "getAll";
    fetch(`${path}/api/medico/getAll`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(`${path}/subscribe/medico/${method}`);

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMedicos(data.data);
      kafkaConsumer.close();
    };
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceita((prev) => ({ ...prev, [name]: value }));
  };

  const filteredMedications = medicamentos.filter((medication) =>
    medication.substancia.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSubmit = async (e) => {
    // e.preventDefault();
    const { cpfPaciente, codigoMedicamento, dose, frequencia, medico } =
      receita;

    const newReceita = {
      paciente: cpfPaciente,
      receituario: {
        medicamento: codigoMedicamento,
        frequencia: frequencia,
        dose: dose,
      },
      medico: medico,
      validade: "30 dias",
    };

    try {
      const response = await axios.post(
        `${path}/api/receita/criar`,
        newReceita
      );
      console.log("Resposta da API:", response.data);
    } catch (error) {
      console.error("Erro ao criar a receita:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex gap-4">
      <div className="w-1/2 p-4 bg-blue-100 rounded-lg shadow min-w-96">
        <h2 className="text-xl font-bold mb-4">Medicamentos Disponíveis</h2>
        <input
          type="text"
          placeholder="Pesquise um medicamento"
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="max-h-96 overflow-y-auto">
          {/* {medicamentos.length > 0 && (
            <ul>
              {filteredMedications.map((med) => (
                <li key={med.codigo} className="mb-2">
                  {med.substancia} ({med.codigo})
                </li>
              ))}
            </ul>
          )} */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Medicamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Substância
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map((medicamento) => (
                <tr key={medicamento.codigo}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicamento.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicamento.substancia}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-1/2 p-4 bg-green-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Receita Médica</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              CPF do Paciente:
            </label>
            <input
              type="text"
              name="cpfPaciente"
              value={receita.cpfPaciente}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Medicamento:
            </label>
            <select
              name="codigoMedicamento"
              value={receita.codigoMedicamento}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
              required
            >
              <option value="">Selecione um Medicamento</option>
              {medicamentos.map((med) => (
                <option key={med.codigo} value={med.codigo}>
                  {med.substancia} ({med.codigo})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Dose:
            </label>
            <input
              type="text"
              name="dose"
              value={receita.dose}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Frequência:
            </label>
            <input
              type="text"
              name="frequencia"
              value={receita.frequencia}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Medico:
            </label>
            <select
              name="medico"
              value={receita.medico}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
              required
            >
              <option value="">Selecione um Medico</option>
              {medicos.map((med) => (
                <option key={med.cpf} value={med.cpf}>
                  {med.nome} ({med.cpf})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Criar Receita
          </button>
        </form>
      </div>
    </div>
  );
}

export default PainelMedico;
