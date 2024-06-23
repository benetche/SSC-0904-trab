import React, { useState, useEffect } from 'react';

function PainelFarmaceutico() {
    const [estoque, setEstoque] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [medicamentos, setMedicamentos] = useState([
        { codigo: '001', nome: 'Ibuprofeno', quantidade: 0 },
        { codigo: '002', nome: 'Paracetamol', quantidade: 0 },
        { codigo: '003', nome: 'Amoxicilina', quantidade: 0 },
        { codigo: '004', nome: 'Aspirina', quantidade: 10 } // Este aparecerá no estoque
    ]); // Inicializado com alguns medicamentos de teste
    const [novoPedido, setNovoPedido] = useState({ codigo: '', quantidade: '' });

    useEffect(() => {
        // Atualiza o estoque para filtrar medicamentos com quantidade maior que 0
        setEstoque(medicamentos.filter(med => med.quantidade > 0));
    }, [medicamentos]);

    const enviarPedidoParaConsumo = async (pedido) => {
        const novoEstoque = [...estoque];
        const indiceEstoque = novoEstoque.findIndex(item => item.codigo === pedido.codigo);
        if (indiceEstoque !== -1) {
            novoEstoque[indiceEstoque].quantidade += pedido.quantidade;
        } else {
            novoEstoque.push({ codigo: pedido.codigo, nome: pedido.nome, quantidade: pedido.quantidade });
        }
        setEstoque(novoEstoque.sort((a, b) => a.nome.localeCompare(b.nome)));
        setPedidos(prevPedidos => prevPedidos.filter(item => item.codigo !== pedido.codigo));
    };

    const adicionarNovoPedido = async (e) => {
        e.preventDefault();
        if (novoPedido.codigo && novoPedido.quantidade > 0) {
            const medicamentoEncontrado = medicamentos.find(med => med.codigo === novoPedido.codigo);
            if (medicamentoEncontrado) {
                const updatedPedido = { ...medicamentoEncontrado, quantidade: parseInt(novoPedido.quantidade) };
                setPedidos([...pedidos, updatedPedido]);
                setNovoPedido({ codigo: '', quantidade: '' });
            }
        }
    };

    return (
        <div className="container mx-auto p-4 flex gap-4">
            <div className="w-1/2 p-4 bg-blue-100 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Estoque de Medicamentos</h2>
                <ul>
                    {estoque.map(medicamento => (
                        <li key={medicamento.codigo} className="mb-2">
                            {medicamento.nome} ({medicamento.codigo}) - Quantidade: {medicamento.quantidade}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-1/2 p-4 bg-green-100 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Pedidos do Posto</h2>
                <ul>
                    {pedidos.map(pedido => (
                        <li key={pedido.codigo} className="mb-2">
                            {pedido.nome} ({pedido.codigo}) - Quantidade: {pedido.quantidade}
                            <button className="ml-2 p-1 bg-blue-500 text-white rounded"
                                    onClick={() => enviarPedidoParaConsumo(pedido)}>
                                Enviar para Consumo
                            </button>
                        </li>
                    ))}
                </ul>
                <form onSubmit={adicionarNovoPedido} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Código do Medicamento:</label>
                        <select
                            name="codigo"
                            value={novoPedido.codigo}
                            onChange={(e) => setNovoPedido({ ...novoPedido, codigo: e.target.value })}
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
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Quantidade:</label>
                        <input
                            type="number"
                            name="quantidade"
                            value={novoPedido.quantidade}
                            onChange={(e) => setNovoPedido({ ...novoPedido, quantidade: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm"
                            required
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Adicionar Pedido
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PainelFarmaceutico;
