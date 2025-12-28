const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'online', timestamp: Date.now() });
});

app.post('/createSession', (req, res) => {
  const sessionId = Math.random().toString(36).substring(2, 15);
  res.json({ session_id: sessionId, expires_at: Date.now() + 1800000 });
});

app.post('/oracleConsult', (req, res) => {
  res.json({
    level: 3,
    bases: [
      { symbol: "X7", greekName: "A Lua", meaning: "Transformação chegando" },
      { symbol: "Q3", greekName: "O Espelho", meaning: "Reflexão necessária" },
      { symbol: "K15", greekName: "Mudança", meaning: "Novos caminhos" }
    ],
    interpretation: "As energias revelam mudanças.",
    timestamp: Date.now()
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));