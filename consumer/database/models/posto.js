import mongoose from "mongoose";

const postoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    trim: true,
    unique: true,
  },
  nome: {
    type: String,
    trim: true,
    unique: true,
  },
  farmaceuticos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmaceutico",
    required: true,
  },
  medicos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medico",
    required: true,
  },
  estoque: {
    type: [
      {
        medicamento: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicamento",
        },
        quantidade: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

const Posto = mongoose.model("Posto", postoSchema);

export default Posto;
