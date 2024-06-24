import mongoose from "mongoose";

const convenioSchema = new mongoose.Schema({
  cnpj: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  cobertura: {
    type: Number,
    required: true,
    trim: true,
  },
});

const Convenio = mongoose.model("Convenio", convenioSchema);

export default Convenio;
