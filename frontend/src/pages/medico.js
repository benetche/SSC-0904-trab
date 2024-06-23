import React, { useState, useEffect } from 'react';

function PainelMedico() {
    const [medicamentos, setMedicamentos] = useState([
        { codigo: '001', nome: 'Ibuprofeno' },
        { codigo: '002', nome: 'Paracetamol' },
        { codigo: '003', nome: 'Amoxicilina' },
        { codigo: '004', nome: 'Aspirina' }
    ]);
    const [receita, setReceita] = useState({
        cpfPaciente: '',
        codigoMedicamento: '',
        dose: '',
        frequencia: ''
    });

    useEffect(() => {
        // Aqui você faria a requisição ao backend para obter os medicamentos
        const fetchMedicamentos = async () => {
            const response = await fetch('/api/medicamentos');
            const data = await response.json();
            setMedicamentos(data);
        };
        fetchMedicamentos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReceita(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Enviar a receita para o backend
        const response = await fetch('/api/receitas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(receita)
        });
        if (response.ok) {
            alert('Receita criada com sucesso!');
            setReceita({
                cpfPaciente: '',
                codigoMedicamento: '',
                dose: '',
                frequencia: ''
            });
        } else {
            alert('Erro ao criar receita');
        }
    };

    return (
        <div className="container mx-auto p-4 flex gap-4">
            <div className="w-1/2 p-4 bg-blue-100 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Medicamentos Disponíveis</h2>
                <ul>
                    {medicamentos.map(med => (
                        <li key={med.codigo} className="mb-2">
                            {med.nome} ({med.codigo})
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-1/2 p-4 bg-green-100 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Receita Médica</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CPF do Paciente:</label>
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
                        <label className="block text-sm font-medium text-gray-700">Medicamento:</label>
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
                                    {med.nome} ({med.codigo})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Dose:</label>
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
                        <label className="block text-sm font-medium text-gray-700">Frequência:</label>
                        <input
                            type="text"
                            name="frequencia"
                            value={receita.frequencia}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
                            required
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Criar Receita
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PainelMedico;
