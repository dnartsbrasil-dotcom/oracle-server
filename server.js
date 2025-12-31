const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/health', (req, res) => {
  console.log('✅ /health chamado');
  res.json({
    status: 'online',
    timestamp: Date.now()
  });
});

app.post('/oracleConsultWithImage', (req, res) => {
  console.log('✅ /oracleConsultWithImage chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, rgbValues } = req.body;
  
  if (!question || !rgbValues) {
    console.log('❌ Dados faltando!');
    return res.status(400).json({ error: 'Missing data' });
  }
  
  console.log(`RGB: R=${rgbValues.r}, G=${rgbValues.g}, B=${rgbValues.b}`);
  
  const cards = [
    { 
      symbol: 'X7', 
      greekName: 'A Lua', 
      meaning: 'Transformação', 
      source: 'Vermelho', 
      calculation: `${rgbValues.r} → 7` 
    },
    { 
      symbol: 'F2', 
      greekName: 'O Portal', 
      meaning: 'Oportunidades', 
      source: 'Verde', 
      calculation: `${rgbValues.g} → 9` 
    },
    { 
      symbol: 'A1', 
      greekName: 'O Sol', 
      meaning: 'Sucesso', 
      source: 'Azul', 
      calculation: `${rgbValues.b} → 8` 
    }
  ];
  
  const response = {
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
  };
  
  console.log('✅ Enviando resposta com', cards.length, 'cartas');
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🔮 Servidor rodando na porta ${PORT}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET  /health`);
  console.log(`  POST /oracleConsultWithImage`);
});
