const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Ler agendamentos
function lerDados() {
  const data = fs.readFileSync("agendamentos.json");
  return JSON.parse(data);
}

// Salvar agendamentos
function salvarDados(dados) {
  fs.writeFileSync("agendamentos.json", JSON.stringify(dados, null, 2));
}

// Rota para agendar
app.post("/agendar", (req, res) => {
  const { nome, data, hora } = req.body;

  const dia = new Date(data).getDay();
  const horaNum = parseInt(hora.split(":")[0]);

  if (dia === 0 || dia === 6) {
    return res.status(400).json({ erro: "Não atendemos sábado e domingo" });
  }

  if (!((horaNum >= 8 && horaNum < 11) || (horaNum >= 13 && horaNum < 20))) {
    return res.status(400).json({ erro: "Horário fora do funcionamento" });
  }

  let agendamentos = lerDados();

  const existe = agendamentos.find(a => a.data === data && a.hora === hora);
  if (existe) {
    return res.status(400).json({ erro: "Horário já ocupado" });
  }

  agendamentos.push({ nome, data, hora });
  salvarDados(agendamentos);

  res.json({ sucesso: true });
});

// Listar agendamentos
app.get("/agendamentos", (req, res) => {
  const dados = lerDados();
  res.json(dados);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});