import mongoose from "mongoose";

const medicoSchema = new mongoose.Schema({
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  crm: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Medico = mongoose.model("Medico", medicoSchema);

export default Medico;
