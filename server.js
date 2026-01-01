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

app.post('/oracleConsult', (req, res) => {
  console.log('✅ /oracleConsult chamado (sem imagem)');
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question required' });
  }
  
  const cards = [
    { symbol: 'X7', greekName: 'A Lua', meaning: 'Transformação e intuição' },
    { symbol: 'F2', greekName: 'O Portal', meaning: 'Novas oportunidades' },
    { symbol: 'A1', greekName: 'O Sol', meaning: 'Energia vital e sucesso' }
  ];
  
  res.json({
    level: 3,
    bases: cards,
    interpretation: 'As energias revelam uma pergunta sobre tendências. O caminho está claro.',
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

// Funções de numerologia (igual ao Kotlin)
function sumDigits(num) {
  return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

function reduceToBase(num) {
  let result = num;
  while (result > 78) {
    result = sumDigits(result);
  }
  return result === 0 ? 1 : result;
}

app.post('/oracleConsultWithAudio', (req, res) => {
  console.log('✅ /oracleConsultWithAudio chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, audioValues } = req.body;
  
  if (!question || !audioValues || !Array.isArray(audioValues)) {
    console.log('❌ Dados faltando ou inválidos!');
    return res.status(400).json({ error: 'Missing or invalid data' });
  }
  
  const cardCount = audioValues.length;
  console.log(`🎙️ Gerando ${cardCount} cartas para: "${question}"`);
  console.log(`Valores de áudio: ${audioValues.join(', ')}`);
  
  // Nomes dinâmicos de fonte baseados no índice
  const sourceNames = [
    'Graves', 'Médios', 'Agudos', 
    'Harmônicos', 'Ressonância', 'Timbre',
    'Amplitude', 'Fase'
  ];
  
  // Gerar cartas baseadas nos valores com NUMEROLOGIA
  const cards = audioValues.map((value, index) => {
    const cardNumber = reduceToBase(value);  // ✅ NUMEROLOGIA!
    const card = getCard(cardNumber);
    
    return {
      symbol: card.symbol,
      greekName: card.greekName,
      meaning: card.meaning,
      source: sourceNames[index] || `Frequência ${index + 1}`,
      calculation: `${value} → ${cardNumber}`
    };
  });
  
  // Análise de áudio baseada na quantidade de cartas
  const audioAnalysis = {
    dominantFrequency: cardCount >= 5 ? 'Espectro amplo' : 'Médias',
    emotionalTone: cardCount >= 7 ? 'Profundo e complexo' : 'Calmo e assertivo',
    energy: cardCount >= 6 ? 'Energia intensa' : 'Energia equilibrada'
  };
  
  // Interpretação baseada no nível
  let levelDescription = '';
  if (cardCount === 1) levelDescription = 'resposta direta';
  else if (cardCount === 2) levelDescription = 'escolha clara';
  else if (cardCount === 3) levelDescription = 'padrão vibracional único';
  else if (cardCount === 4) levelDescription = 'contexto amplo';
  else if (cardCount === 5) levelDescription = 'análise complexa';
  else if (cardCount === 6) levelDescription = 'visão profunda';
  else if (cardCount === 7) levelDescription = 'análise completa';
  else levelDescription = 'máxima profundidade';
  
  const cardNames = cards.map(c => c.greekName).join(', ');
  
  const response = {
    audioValues: audioValues,
    cards: cards,
    audioAnalysis: audioAnalysis,
    questionLevel: cardCount,
    interpretation: `🎙️ A análise de áudio revela ${levelDescription}. As ${cardCount} frequências (${cardNames}) se combinam para responder sua pergunta com clareza vibracional.`,
    timestamp: Date.now()
  };
  
  console.log(`✅ Enviando resposta com ${cards.length} cartas`);
  res.json(response);
});

function getCard(cardNumber) {
  const CARD_DATABASE = {
    1: { symbol: 'X7', greekName: 'A Lua', meaning: 'Transformação e intuição' },
    2: { symbol: 'Q3', greekName: 'O Espelho', meaning: 'Reflexão necessária' },
    3: { symbol: 'K15', greekName: 'A Clareza', meaning: 'Visão clara do caminho' },
    4: { symbol: 'A1', greekName: 'O Sol', meaning: 'Energia vital e sucesso' },
    5: { symbol: 'B9', greekName: 'A Estrela', meaning: 'Esperança e guia' },
    6: { symbol: 'C4', greekName: 'O Caminho', meaning: 'Escolhas importantes' },
    7: { symbol: 'D12', greekName: 'A Torre', meaning: 'Mudanças súbitas' },
    8: { symbol: 'E8', greekName: 'A Roda', meaning: 'Ciclos se completando' },
    9: { symbol: 'F2', greekName: 'O Portal', meaning: 'Novas oportunidades' },
    10: { symbol: 'G11', greekName: 'O Amor', meaning: 'Conexões profundas' },
    11: { symbol: 'H5', greekName: 'A Força', meaning: 'Coragem e determinação' },
    12: { symbol: 'I14', greekName: 'O Tempo', meaning: 'Paciência necessária' },
    13: { symbol: 'J6', greekName: 'A Morte', meaning: 'Fim e recomeço' },
    14: { symbol: 'L10', greekName: 'O Renascimento', meaning: 'Nova fase chegando' },
    15: { symbol: 'M3', greekName: 'O Destino', meaning: 'Caminhos predestinados' }
  };
  
  if (!CARD_DATABASE[cardNumber]) {
    return {
      symbol: `C${cardNumber}`,
      greekName: `Arcano ${cardNumber}`,
      meaning: `Energia da Base ${cardNumber}`
    };
  }
  
  return CARD_DATABASE[cardNumber];
}

app.listen(PORT, () => {
  console.log(`🔮 Servidor rodando na porta ${PORT}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET  /health`);
  console.log(`  POST /oracleConsult`);
  console.log(`  POST /oracleConsultWithImage`);
  console.log(`  POST /oracleConsultWithAudio`);
});
