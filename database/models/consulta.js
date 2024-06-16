import mongoose from 'mongoose';

const codigoAgregadoModel = new mongoose.Schema({
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionario',
    required: true,
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionario',
    required: true,
  },
  dataConsulta: {
    type: Date,
    required: true,
  },
});

const consultaSchema = new mongoose.Schema({
  codigo: {
    type: codigoAgregadoModel,
    required: true,
    trim: true,
    unique: true,
  },
  dadosReceita: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Receita',
  },
});

const consulta = mongoose.model('Consulta', consultaSchema);

export default consulta;
