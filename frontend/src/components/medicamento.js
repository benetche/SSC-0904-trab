import React, { useEffect, useState } from "react";

const MedicamentoPage = () => {
  const [medicamento, setMedicamento] = useState(null);
  const [codigo, setCodigo] = useState("");

  const handleGetMedicamento = () => {
    fetch(`http://localhost:3333/api/medicamento/get/${codigo}`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(
      `http://localhost:3333/subscribe/medicamento/get/${codigo}`
    );

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.data);
      setMedicamento(data);
      kafkaConsumer.close();
    };
  };

  useEffect(() => {
    const method = "getAll";
    fetch(`http://localhost:3333/api/medicamento/getAll`, {
      method: "GET",
    });
    const kafkaConsumer = new EventSource(
      `http://localhost:3333/subscribe/medicamento/${method}`
    );

    kafkaConsumer.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      kafkaConsumer.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Buscar Medicamento
        </h1>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código do medicamento"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleGetMedicamento}
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
        {medicamento && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Medicamento:</h2>
            <pre className="p-2 mt-2 bg-gray-200 rounded">
              {JSON.stringify(medicamento, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicamentoPage;
