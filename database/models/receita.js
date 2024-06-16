import mongoose from 'mongoose';

const receituarioModel = new mongoose.Schema({
  medicamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicamento',
    required: true,
  },
  frequencia: {
    type: Number,
    required: true,
  },
  dose: {
    type: String,
    required: true,
  },
});

const receitaSchema = new mongoose.Schema({
  cod_receita: {
    type: String,
    required: true,
    index: true,
  },
  receituario: {
    type: [receituarioModel],
    default: () => ({}),
  },
  validade: {
    type: Date,
    required: true,
  },
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionario',
    required: true,
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true,
  },
});

const receita = mongoose.model('Receita', receitaSchema);

export default receita;
