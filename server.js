const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// CONEXÃO COM MONGODB
mongoose.connect("mongodb+srv://daviresende357_db_user:xfkf0WDKUFWytnXM@cluster0.j6iqe2k.mongodb.net/barbearia")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// MODELO
const Agendamento = mongoose.model("Agendamento", {
  nome: String,
  data: String,
  hora: String
});

// ROTA AGENDAR
app.post("/agendar", async (req, res) => {
  const { nome, data, hora } = req.body;

  const dia = new Date(data).getDay();
  const horaNum = parseInt(hora.split(":")[0]);

  if (dia === 0 || dia === 6) {
    return res.status(400).json({ erro: "Não atendemos sábado e domingo" });
  }

  if (!((horaNum >= 8 && horaNum < 11) || (horaNum >= 13 && horaNum < 20))) {
    return res.status(400).json({ erro: "Horário fora do funcionamento" });
  }

  const existe = await Agendamento.findOne({ data, hora });
  if (existe) {
    return res.status(400).json({ erro: "Horário já ocupado" });
  }

  const novo = new Agendamento({ nome, data, hora });
  await novo.save();

  res.json({ sucesso: true });
});

// LISTAR
app.get("/agendamentos", async (req, res) => {
  const dados = await Agendamento.find();
  res.json(dados);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});