import mongoose from "mongoose";
import receita from "./receita";

const pedidoSchema = new mongoose.Schema({
  cod_pedido: {
    type: String,
    required: true,
    unique: true,
  },
  posto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posto",
    required: true,
  },
  farmaceutico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmaceutico",
    required: true,
  },
  dados: {
    medicamento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicamento",
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
    },
  },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);

export default Pedido;
