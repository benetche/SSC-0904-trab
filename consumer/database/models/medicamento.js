import mongoose from "mongoose";

const medicamentoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  nome: {
    type: String,
    require: true,
    trim: true,
  },
  preco: {
    type: Number,
    require: false,
  },
});

const Medicamento = mongoose.model("Medicamento", medicamentoSchema);

export default Medicamento;
