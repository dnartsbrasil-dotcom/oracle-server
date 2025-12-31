const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health Check
app.get('/health', (req, res) => {
  console.log('✅ /health chamado');
  res.json({
    status: 'online',
    timestamp: Date.now()
  });
});

// Consultar Oráculo COM IMAGEM (RGB)
app.post('/oracleConsultWithImage', (req, res) => {
  console.log('✅ /oracleConsultWithImage chamado');
  console.log('Body recebido:', req.body);
  
  const { question, rgbValues } = req.body;
  
  if (!question || !rgbValues) {
    return res.status(400).json({ error: 'Missing data' });
  }
  
  // Cartas fixas para teste
  const cards = [
    { symbol: 'X7', greekName: 'A Lua', meaning: 'Transformação', source: 'Vermelho', calculation: `${rgbValues.r} → 7` },
    { symbol: 'F2', greekName: 'O Portal', meaning: 'Oportunidades', source: 'Verde', calculation: `${rgbValues.g} → 9` },
    { symbol: 'A1', greekName: 'O Sol', meaning: 'Sucesso', source: 'Azul', calculation: `${rgbValues.b} → 8` }
  ];
  
  res.json({
    rgbValues: {
      r: rgbValues.r,
      g: rgbValues.g,
      b: rgbValues.b
    },
    cardNumbers: {
      red: 7,
      green: 9,
      blue: 8
    },
    cards: cards,
    colorAnalysis: {
      dominantColor: 'Equilibrado',
      emotionalState: 'Calma e harmonia',
      energy: 'Energia moderada'
    },
    questionLevel: 3,
    interpretation: '🔮 As cores revelam um momento de equilíbrio. As três cartas indicam transformação, novas oportunidades e sucesso.',
    timestamp: Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`🔮 Servidor rodando na porta ${PORT}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET  /health`);
  console.log(`  POST /oracleConsultWithImage`);
});
