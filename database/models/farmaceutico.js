import mongoose from "mongoose";

const farmaceuticoSchema = new mongoose.Schema({
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
  crf: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Farmaceutico = mongoose.model("Farmaceutico", farmaceuticoSchema);

export default Farmaceutico;
