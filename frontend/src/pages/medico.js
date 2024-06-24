import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [allReceitas, setAllReceitas] = useState([]);

  const [medicos, setMedicos] = useState([{ nome: "Joao", cpf: "123456" }]);
  const path = "http://localhost:6018";
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
      console.log(data.data);
      setAllReceitas(data.data);
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
      <div className="w-1/2 p-4 bg-blue-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Medicamentos Disponíveis</h2>
        <input
          type="text"
          placeholder="Pesquise um medicamento"
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {medicamentos.length > 0 && (
          <ul>
            {filteredMedications.map((med) => (
              <li key={med.codigo} className="mb-2">
                {med.substancia} ({med.codigo})
              </li>
            ))}
          </ul>
        )}
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Todas as receitas:
          </label>
          <ul>
            {allReceitas.length > 0 &&
              allReceitas.map((receita) => (
                <li className="mb-2 bg-green-200">
                  COD: {receita.cod_receita}, PACIENTE: {receita.paciente.nome},
                  MEDICO: {receita.medico.nome}, PRESCRIÇÃO:
                  {receita.receituario.medicamento.substancia},{" "}
                  {receita.receituario.dose}, {receita.receituario.frequencia}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PainelMedico;
