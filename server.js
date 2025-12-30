const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));

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

// ✅ FUNÇÃO PARA ANALISAR COMPLEXIDADE DA PERGUNTA
function analyzeQuestion(question) {
  const text = question.toLowerCase().trim();
  const wordCount = text.split(/\s+/).length;
  
  // Nível 1: Perguntas sim/não (1 carta)
  const yesNoPatterns = [
    /^(vai|vou|será|devo|posso|consigo|conseguirei|terei)/,
    /\?(sim|não|certo|errado)$/,
    /(vai dar certo|vai acontecer|é possível)/
  ];
  
  if (wordCount <= 5 && yesNoPatterns.some(pattern => pattern.test(text))) {
    return { level: 1, cardCount: 1, description: "Pergunta simples (Sim/Não)" };
  }
  
  // Nível 2: Escolha binária (2 cartas)
  const choicePatterns = [
    /(ou|vs|versus|entre)/,
    /(ficar ou|aceitar ou|escolher entre)/,
    /(qual.*melhor|qual caminho)/
  ];
  
  if (wordCount <= 10 && choicePatterns.some(pattern => pattern.test(text))) {
    return { level: 2, cardCount: 2, description: "Escolha entre opções" };
  }
  
  // Nível 3: Temporal/Tendência (3 cartas) - PADRÃO
  if (wordCount <= 15) {
    return { level: 3, cardCount: 3, description: "Pergunta sobre tendências" };
  }
  
  // Nível 4: Situação com contexto (4 cartas)
  const contextPatterns = [
    /(como posso|como melhorar|como resolver)/,
    /(melhor caminho|estratégia|solução)/
  ];
  
  if (wordCount <= 20 && contextPatterns.some(pattern => pattern.test(text))) {
    return { level: 4, cardCount: 4, description: "Situação com contexto" };
  }
  
  // Nível 5: Complexa (5 cartas)
  const complexPatterns = [
    /(propósito|missão|destino|jornada)/,
    /(todos os aspectos|equilibrar|integrar)/,
    /(vida pessoal|vida profissional|relacionamentos)/
  ];
  
  if (wordCount <= 30 && complexPatterns.some(pattern => pattern.test(text))) {
    return { level: 5, cardCount: 5, description: "Pergunta complexa" };
  }
  
  // Nível 6: Muito complexa (6 cartas)
  const veryComplexPatterns = [
    /(múltiplos|diversos|vários|todas as áreas)/,
    /(desafios e oportunidades|passado.*presente.*futuro)/,
    /(transformar completamente|mudança profunda)/
  ];
  
  if (wordCount <= 50 && veryComplexPatterns.some(pattern => pattern.test(text))) {
    return { level: 6, cardCount: 6, description: "Muito complexa" };
  }
  
  // Nível 7: Requer IA (7 cartas)
  if (wordCount > 50 || 
      text.includes('analise profundamente') || 
      text.includes('visão completa') ||
      (text.match(/,/g) || []).length >= 3) {
    return { level: 7, cardCount: 7, description: "Requer análise profunda (IA)" };
  }
  
  // Fallback: Nível 3
  return { level: 3, cardCount: 3, description: "Pergunta média" };
}

// ✅ BANCO DE DADOS DE CARTAS (78 BASES)
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
  // Adicione as outras 63 cartas aqui...
};

// Completar com cartas genéricas para as bases 16-78
for (let i = 16; i <= 78; i++) {
  CARD_DATABASE[i] = {
    symbol: `C${i}`,
    greekName: `Arcano ${i}`,
    meaning: `Energia da Base ${i}`
  };
}

// ✅ FUNÇÃO PARA CONVERTER RGB EM NÚMEROS DE CARTAS
function rgbToCardNumbers(rgb) {
  // Função para somar dígitos
  function sumDigits(num) {
    return num.toString()
      .split('')
      .map(d => parseInt(d))
      .reduce((a, b) => a + b, 0);
  }
  
  // Reduzir até ficar entre 1-78
  function reduceToBase(num) {
    let result = num;
    while (result > 78) {
      result = sumDigits(result);
    }
    return result === 0 ? 1 : result;
  }
  
  return {
    red: reduceToBase(rgb.r),
    green: reduceToBase(rgb.g),
    blue: reduceToBase(rgb.b)
  };
}

// ✅ FUNÇÃO PARA BUSCAR CARTA
function getCard(cardNumber) {
  return CARD_DATABASE[cardNumber] || CARD_DATABASE[1];
}

// ✅ FUNÇÃO PARA GERAR CARTAS ALEATÓRIAS
function generateRandomCards(count) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const randomBase = Math.floor(Math.random() * 78) + 1;
    cards.push(getCard(randomBase));
  }
  return cards;
}

// ✅ ANALISAR CORES (ESTADO EMOCIONAL)
function analyzeColors(rgb) {
  const total = rgb.r + rgb.g + rgb.b;
  const analysis = {
    dominantColor: '',
    emotionalState: '',
    energy: ''
  };
  
  // Cor dominante
  if (rgb.r > rgb.g && rgb.r > rgb.b) {
    analysis.dominantColor = 'Vermelho';
    analysis.emotionalState = 'Paixão, energia, intensidade';
  } else if (rgb.g > rgb.r && rgb.g > rgb.b) {
    analysis.dominantColor = 'Verde';
    analysis.emotionalState = 'Equilíbrio, harmonia, crescimento';
  } else if (rgb.b > rgb.r && rgb.b > rgb.g) {
    analysis.dominantColor = 'Azul';
    analysis.emotionalState = 'Calma, introspecção, melancolia';
  } else {
    analysis.dominantColor = 'Equilibrado';
    analysis.emotionalState = 'Estado neutro e balanceado';
  }
  
  // Nível de energia
  const avgIntensity = total / 3;
  if (avgIntensity > 170) {
    analysis.energy = 'Alta energia, momento vibrante';
  } else if (avgIntensity > 85) {
    analysis.energy = 'Energia moderada, estado equilibrado';
  } else {
    analysis.energy = 'Energia baixa, momento introspectivo';
  }
  
  return analysis;
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: Date.now()
  });
});

// Criar Sessão
app.post('/createSession', (req, res) => {
  const sessionId = Math.random().toString(36).substring(2, 15);
  res.json({
    session_id: sessionId,
    expires_at: Date.now() + (30 * 60 * 1000)
  });
});

// ✅ CONSULTAR ORÁCULO (SÓ PERGUNTA)
app.post('/oracleConsult', (req, res) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  
  // Analisar complexidade
  const analysis = analyzeQuestion(question);
  
  // Gerar cartas aleatórias baseado na análise
  const cards = generateRandomCards(analysis.cardCount);
  
  // Gerar interpretação
  const interpretation = `As energias revelam ${analysis.description.toLowerCase()}. ${
    analysis.level <= 3 ? 'O caminho está claro.' : 
    analysis.level <= 5 ? 'Múltiplos fatores influenciam a situação.' :
    'Uma análise profunda revela camadas complexas de significado.'
  }`;
  
  res.json({
    level: analysis.level,
    level_info: {
      blocks: analysis.cardCount,
      bases: analysis.cardCount,
      description: analysis.description,
      requiresAI: analysis.level === 7
    },
    cards: cards,
    interpretation: interpretation,
    timestamp: Date.now()
  });
});

// ✅ CONSULTAR ORÁCULO COM IMAGEM (RGB)
app.post('/oracleConsultWithImage', (req, res) => {
  const { question, rgbValues } = req.body;
  
  if (!question || !rgbValues) {
    return res.status(400).json({ error: 'Question and RGB values are required' });
  }
  
  // 1. Converter RGB em números de cartas
  const cardNumbers = rgbToCardNumbers(rgbValues);
  
  // 2. Buscar as 3 cartas
  const cards = [
    { ...getCard(cardNumbers.red), source: 'Vermelho', calculation: `${rgbValues.r} → ${cardNumbers.red}` },
    { ...getCard(cardNumbers.green), source: 'Verde', calculation: `${rgbValues.g} → ${cardNumbers.green}` },
    { ...getCard(cardNumbers.blue), source: 'Azul', calculation: `${rgbValues.b} → ${cardNumbers.blue}` }
  ];
  
  // 3. Analisar cores
  const colorAnalysis = analyzeColors(rgbValues);
  
  // 4. Analisar pergunta
  const questionAnalysis = analyzeQuestion(question);
  
  // 5. Gerar interpretação completa
  const interpretation = `
🎨 Análise da Imagem:
${colorAnalysis.emotionalState}. ${colorAnalysis.energy}.

A cor dominante é ${colorAnalysis.dominantColor}, revelando o estado emocional capturado no momento da foto.

🔢 Conversão Numerológica:
- Vermelho (${rgbValues.r}): ${cardNumbers.red}
- Verde (${rgbValues.g}): ${cardNumbers.green}
- Azul (${rgbValues.b}): ${cardNumbers.blue}

✨ Interpretação das Cartas:
As três cartas reveladas pela imagem mostram ${questionAnalysis.description.toLowerCase()}.
${cards[0].greekName}, ${cards[1].greekName} e ${cards[2].greekName} combinam-se para responder sua pergunta.

🔮 Resposta:
${questionAnalysis.level <= 3 ? 'A resposta é clara e direta.' : 'A situação requer reflexão profunda.'}
  `.trim();
  
  res.json({
    rgbValues: {
      r: rgbValues.r,
      g: rgbValues.g,
      b: rgbValues.b
    },
    cardNumbers: {
      red: cardNumbers.red,
      green: cardNumbers.green,
      blue: cardNumbers.blue
    },
    cards: cards,
    colorAnalysis: {
      dominantColor: colorAnalysis.dominantColor,
      emotionalState: colorAnalysis.emotionalState,
      energy: colorAnalysis.energy
    },
    questionLevel: questionAnalysis.level,
    interpretation: interpretation,
    timestamp: Date.now()
  });
});

app.listen(PORT, () => console.log(`🔮 Servidor Oracle rodando na porta ${PORT}`));
