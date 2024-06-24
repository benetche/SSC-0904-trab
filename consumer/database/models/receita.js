import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema({
  cod_receita: {
    type: String,
    required: true,
    unique: true,
  },
  receituario: {
    type: {
      medicamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicamento",
        required: true,
      },
      frequencia: {
        type: String,
        required: true,
      },
      dose: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  validade: {
    type: String,
    required: true,
  },
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medico",
    required: true,
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true,
  },
});

const receita = mongoose.model("Receita", receitaSchema);

export default receita;
