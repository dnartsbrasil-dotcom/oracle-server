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

// =============================================================================
// BARALHO RIDER-WAITE (Tarot - 78 cartas)
// =============================================================================
const RIDER_WAITE_DECK = {
  // Arcanos Maiores (0-21)
  0: { symbol: '0', name: 'O Louco', meaning: 'Novos começos, liberdade, inocência' },
  1: { symbol: 'I', name: 'O Mago', meaning: 'Manifestação, poder pessoal, ação' },
  2: { symbol: 'II', name: 'A Sacerdotisa', meaning: 'Intuição, mistério, sabedoria interior' },
  3: { symbol: 'III', name: 'A Imperatriz', meaning: 'Fertilidade, abundância, natureza' },
  4: { symbol: 'IV', name: 'O Imperador', meaning: 'Autoridade, estrutura, controle' },
  5: { symbol: 'V', name: 'O Hierofante', meaning: 'Tradição, educação, espiritualidade' },
  6: { symbol: 'VI', name: 'Os Amantes', meaning: 'Escolhas, união, amor' },
  7: { symbol: 'VII', name: 'O Carro', meaning: 'Determinação, vitória, controle' },
  8: { symbol: 'VIII', name: 'A Força', meaning: 'Coragem, paciência, compaixão' },
  9: { symbol: 'IX', name: 'O Eremita', meaning: 'Introspecção, sabedoria, solidão' },
  10: { symbol: 'X', name: 'A Roda da Fortuna', meaning: 'Ciclos, destino, mudança' },
  11: { symbol: 'XI', name: 'A Justiça', meaning: 'Equilíbrio, verdade, karma' },
  12: { symbol: 'XII', name: 'O Enforcado', meaning: 'Sacrifício, nova perspectiva' },
  13: { symbol: 'XIII', name: 'A Morte', meaning: 'Transformação, fim de ciclo' },
  14: { symbol: 'XIV', name: 'A Temperança', meaning: 'Equilíbrio, moderação, paciência' },
  15: { symbol: 'XV', name: 'O Diabo', meaning: 'Tentação, materialismo, vícios' },
  16: { symbol: 'XVI', name: 'A Torre', meaning: 'Ruptura, revelação, mudança súbita' },
  17: { symbol: 'XVII', name: 'A Estrela', meaning: 'Esperança, inspiração, renovação' },
  18: { symbol: 'XVIII', name: 'A Lua', meaning: 'Ilusão, medo, intuição' },
  19: { symbol: 'XIX', name: 'O Sol', meaning: 'Alegria, sucesso, vitalidade' },
  20: { symbol: 'XX', name: 'O Julgamento', meaning: 'Renascimento, chamado superior' },
  21: { symbol: 'XXI', name: 'O Mundo', meaning: 'Completude, realização, viagem' },
  
  // Copas (22-35)
  22: { symbol: 'Ás♥', name: 'Ás de Copas', meaning: 'Novo amor, emoções puras' },
  23: { symbol: '2♥', name: 'Dois de Copas', meaning: 'União, parceria, amor' },
  24: { symbol: '3♥', name: 'Três de Copas', meaning: 'Celebração, amizade' },
  25: { symbol: '4♥', name: 'Quatro de Copas', meaning: 'Apatia, reavaliação' },
  26: { symbol: '5♥', name: 'Cinco de Copas', meaning: 'Perda, arrependimento' },
  27: { symbol: '6♥', name: 'Seis de Copas', meaning: 'Nostalgia, inocência' },
  28: { symbol: '7♥', name: 'Sete de Copas', meaning: 'Escolhas, ilusão' },
  29: { symbol: '8♥', name: 'Oito de Copas', meaning: 'Abandono, busca' },
  30: { symbol: '9♥', name: 'Nove de Copas', meaning: 'Satisfação, desejo' },
  31: { symbol: '10♥', name: 'Dez de Copas', meaning: 'Felicidade familiar' },
  32: { symbol: 'V♥', name: 'Valete de Copas', meaning: 'Mensageiro emocional' },
  33: { symbol: 'C♥', name: 'Cavaleiro de Copas', meaning: 'Romance, idealismo' },
  34: { symbol: 'R♥', name: 'Rainha de Copas', meaning: 'Intuição, compaixão' },
  35: { symbol: 'K♥', name: 'Rei de Copas', meaning: 'Equilíbrio emocional' },
  
  // Paus (36-49)
  36: { symbol: 'Ás♣', name: 'Ás de Paus', meaning: 'Novo projeto, inspiração' },
  37: { symbol: '2♣', name: 'Dois de Paus', meaning: 'Planejamento, decisão' },
  38: { symbol: '3♣', name: 'Três de Paus', meaning: 'Expansão, visão' },
  39: { symbol: '4♣', name: 'Quatro de Paus', meaning: 'Celebração, harmonia' },
  40: { symbol: '5♣', name: 'Cinco de Paus', meaning: 'Conflito, competição' },
  41: { symbol: '6♣', name: 'Seis de Paus', meaning: 'Vitória, reconhecimento' },
  42: { symbol: '7♣', name: 'Sete de Paus', meaning: 'Defesa, perseverança' },
  43: { symbol: '8♣', name: 'Oito de Paus', meaning: 'Rapidez, ação' },
  44: { symbol: '9♣', name: 'Nove de Paus', meaning: 'Resiliência, defesa' },
  45: { symbol: '10♣', name: 'Dez de Paus', meaning: 'Responsabilidade' },
  46: { symbol: 'V♣', name: 'Valete de Paus', meaning: 'Mensageiro ativo' },
  47: { symbol: 'C♣', name: 'Cavaleiro de Paus', meaning: 'Aventura, paixão' },
  48: { symbol: 'R♣', name: 'Rainha de Paus', meaning: 'Confiança, carisma' },
  49: { symbol: 'K♣', name: 'Rei de Paus', meaning: 'Liderança, visão' },
  
  // Espadas (50-63)
  50: { symbol: 'Ás♠', name: 'Ás de Espadas', meaning: 'Clareza mental, verdade' },
  51: { symbol: '2♠', name: 'Dois de Espadas', meaning: 'Decisão difícil' },
  52: { symbol: '3♠', name: 'Três de Espadas', meaning: 'Dor, separação' },
  53: { symbol: '4♠', name: 'Quatro de Espadas', meaning: 'Descanso, pausa' },
  54: { symbol: '5♠', name: 'Cinco de Espadas', meaning: 'Conflito, derrota' },
  55: { symbol: '6♠', name: 'Seis de Espadas', meaning: 'Transição, mudança' },
  56: { symbol: '7♠', name: 'Sete de Espadas', meaning: 'Estratégia, cautela' },
  57: { symbol: '8♠', name: 'Oito de Espadas', meaning: 'Restrição, medo' },
  58: { symbol: '9♠', name: 'Nove de Espadas', meaning: 'Ansiedade, pesadelo' },
  59: { symbol: '10♠', name: 'Dez de Espadas', meaning: 'Fim doloroso' },
  60: { symbol: 'V♠', name: 'Valete de Espadas', meaning: 'Vigilância' },
  61: { symbol: 'C♠', name: 'Cavaleiro de Espadas', meaning: 'Ação rápida' },
  62: { symbol: 'R♠', name: 'Rainha de Espadas', meaning: 'Clareza, independência' },
  63: { symbol: 'K♠', name: 'Rei de Espadas', meaning: 'Autoridade intelectual' },
  
  // Ouros (64-77)
  64: { symbol: 'Ás♦', name: 'Ás de Ouros', meaning: 'Nova oportunidade material' },
  65: { symbol: '2♦', name: 'Dois de Ouros', meaning: 'Equilíbrio, adaptação' },
  66: { symbol: '3♦', name: 'Três de Ouros', meaning: 'Trabalho em equipe' },
  67: { symbol: '4♦', name: 'Quatro de Ouros', meaning: 'Controle, segurança' },
  68: { symbol: '5♦', name: 'Cinco de Ouros', meaning: 'Dificuldade financeira' },
  69: { symbol: '6♦', name: 'Seis de Ouros', meaning: 'Generosidade, equilíbrio' },
  70: { symbol: '7♦', name: 'Sete de Ouros', meaning: 'Paciência, investimento' },
  71: { symbol: '8♦', name: 'Oito de Ouros', meaning: 'Dedicação, habilidade' },
  72: { symbol: '9♦', name: 'Nove de Ouros', meaning: 'Abundância, independência' },
  73: { symbol: '10♦', name: 'Dez de Ouros', meaning: 'Riqueza, família' },
  74: { symbol: 'V♦', name: 'Valete de Ouros', meaning: 'Estudante, mensagem prática' },
  75: { symbol: 'C♦', name: 'Cavaleiro de Ouros', meaning: 'Trabalho duro, rotina' },
  76: { symbol: 'R♦', name: 'Rainha de Ouros', meaning: 'Praticidade, nutrição' },
  77: { symbol: 'K♦', name: 'Rei de Ouros', meaning: 'Sucesso material, estabilidade' }
};

// =============================================================================
// BARALHO CIGANO (Lenormand - 36 cartas)
// =============================================================================
const CIGANO_DECK = {
  1: { symbol: '🐎', name: 'Cavaleiro', meaning: 'Notícias, movimento, homem jovem' },
  2: { symbol: '🍀', name: 'Trevo', meaning: 'Sorte, oportunidade breve' },
  3: { symbol: '⛵', name: 'Navio', meaning: 'Viagem, comércio, distância' },
  4: { symbol: '🏠', name: 'Casa', meaning: 'Lar, família, segurança' },
  5: { symbol: '🌳', name: 'Árvore', meaning: 'Saúde, raízes, crescimento lento' },
  6: { symbol: '☁️', name: 'Nuvens', meaning: 'Confusão, incerteza, dúvidas' },
  7: { symbol: '🐍', name: 'Cobra', meaning: 'Traição, mulher rival, complicação' },
  8: { symbol: '⚰️', name: 'Caixão', meaning: 'Fim, doença, transformação' },
  9: { symbol: '💐', name: 'Buquê', meaning: 'Presente, convite, alegria' },
  10: { symbol: '⚔️', name: 'Foice', meaning: 'Corte rápido, decisão súbita' },
  11: { symbol: '🔨', name: 'Chicote', meaning: 'Conflito, discussão, esforço' },
  12: { symbol: '🐦', name: 'Pássaros', meaning: 'Conversa, ansiedade, casal' },
  13: { symbol: '👶', name: 'Criança', meaning: 'Início, ingenuidade, filho' },
  14: { symbol: '🦊', name: 'Raposa', meaning: 'Astúcia, trabalho, emprego' },
  15: { symbol: '🐻', name: 'Urso', meaning: 'Força, autoridade, chefe, poder' },
  16: { symbol: '⭐', name: 'Estrelas', meaning: 'Orientação, espiritualidade, clareza' },
  17: { symbol: '🦩', name: 'Cegonha', meaning: 'Mudança positiva, gravidez' },
  18: { symbol: '🐕', name: 'Cão', meaning: 'Amizade, lealdade, fidelidade' },
  19: { symbol: '🗼', name: 'Torre', meaning: 'Solidão, autoridade, ego, orgulho' },
  20: { symbol: '🌺', name: 'Jardim', meaning: 'Evento social, público, festa' },
  21: { symbol: '⛰️', name: 'Montanha', meaning: 'Obstáculo, bloqueio, dificuldade' },
  22: { symbol: '🛤️', name: 'Caminho', meaning: 'Escolha, decisão, bifurcação' },
  23: { symbol: '🐀', name: 'Ratos', meaning: 'Perda, roubo, ansiedade, corrosão' },
  24: { symbol: '❤️', name: 'Coração', meaning: 'Amor verdadeiro, romance, paixão' },
  25: { symbol: '💍', name: 'Anel', meaning: 'Compromisso, contrato, aliança' },
  26: { symbol: '📖', name: 'Livro', meaning: 'Segredo, conhecimento, estudo' },
  27: { symbol: '✉️', name: 'Carta', meaning: 'Mensagem, documento, comunicação' },
  28: { symbol: '👨', name: 'Homem', meaning: 'Consulente masculino, parceiro' },
  29: { symbol: '👩', name: 'Mulher', meaning: 'Consulente feminino, parceira' },
  30: { symbol: '🌸', name: 'Lírios', meaning: 'Paz, maturidade, sexualidade' },
  31: { symbol: '☀️', name: 'Sol', meaning: 'Sucesso, energia, vitalidade' },
  32: { symbol: '🌙', name: 'Lua', meaning: 'Emoções, reconhecimento, honra' },
  33: { symbol: '🔑', name: 'Chave', meaning: 'Solução, destino, certeza' },
  34: { symbol: '🐟', name: 'Peixes', meaning: 'Dinheiro, negócios, abundância' },
  35: { symbol: '⚓', name: 'Âncora', meaning: 'Estabilidade, trabalho fixo, porto seguro' },
  36: { symbol: '✝️', name: 'Cruz', meaning: 'Fardo, destino, sofrimento, karma' }
};

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

// Numerologia
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

// Detectar baralho ideal
function detectDeckType(question) {
  const text = question.toLowerCase();
  
  const riderWaiteKeywords = [
    'propósito', 'proposito', 'missão', 'missao', 'alma',
    'espiritual', 'evolução', 'evolucao', 'transformação',
    'autoconhecimento', 'destino', 'karma', 'consciência'
  ];
  
  const ciganoKeywords = [
    'amor', 'namoro', 'trabalho', 'emprego', 'dinheiro',
    'casa', 'família', 'familia', 'amigo', 'viagem',
    'saúde', 'saude', 'vai dar certo', 'vou conseguir'
  ];
  
  const riderScore = riderWaiteKeywords.filter(k => text.includes(k)).length;
  const ciganoScore = ciganoKeywords.filter(k => text.includes(k)).length;
  
  return riderScore > ciganoScore ? 'RIDER_WAITE' : 'CIGANO';
}

// Pegar carta do baralho correto
function getCardFromDeck(cardNumber, deckType) {
  const deck = deckType === 'RIDER_WAITE' ? RIDER_WAITE_DECK : CIGANO_DECK;
  const maxCards = deckType === 'RIDER_WAITE' ? 78 : 36;
  
  // Ajustar número para o baralho
  const adjustedNumber = ((cardNumber - 1) % maxCards);
  
  if (deck[adjustedNumber]) {
    return deck[adjustedNumber];
  }
  
  return {
    symbol: `${adjustedNumber}`,
    name: `Arcano ${adjustedNumber}`,
    meaning: `Energia da carta ${adjustedNumber}`
  };
}

// =============================================================================
// ENDPOINTS
// =============================================================================

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

app.post('/oracleConsultWithAudio', (req, res) => {
  console.log('✅ /oracleConsultWithAudio chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, audioValues, deckType } = req.body;
  
  if (!question || !audioValues || !Array.isArray(audioValues)) {
    console.log('❌ Dados faltando ou inválidos!');
    return res.status(400).json({ error: 'Missing or invalid data' });
  }
  
  // Detectar baralho se não especificado
  const selectedDeck = deckType || detectDeckType(question);
  
  const cardCount = audioValues.length;
  console.log(`🎙️ Gerando ${cardCount} cartas para: "${question}"`);
  console.log(`🃏 Baralho: ${selectedDeck}`);
  console.log(`Valores de áudio: ${audioValues.join(', ')}`);
  
  const sourceNames = [
    'Graves', 'Médios', 'Agudos', 
    'Harmônicos', 'Ressonância', 'Timbre',
    'Amplitude', 'Fase'
  ];
  
  // Gerar cartas com NUMEROLOGIA
  const cards = audioValues.map((value, index) => {
    const cardNumber = reduceToBase(value);
    const card = getCardFromDeck(cardNumber, selectedDeck);
    
    return {
      symbol: card.symbol,
      greekName: card.name,
      meaning: card.meaning,
      source: sourceNames[index] || `Frequência ${index + 1}`,
      calculation: `${value} → ${cardNumber}`
    };
  });
  
  const audioAnalysis = {
    dominantFrequency: cardCount >= 5 ? 'Espectro amplo' : 'Médias',
    emotionalTone: cardCount >= 7 ? 'Profundo e complexo' : 'Calmo e assertivo',
    energy: cardCount >= 6 ? 'Energia intensa' : 'Energia equilibrada'
  };
  
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
  const deckName = selectedDeck === 'RIDER_WAITE' ? 'Tarot Rider-Waite' : 'Baralho Cigano';
  
  const response = {
    audioValues: audioValues,
    deckType: selectedDeck,
    cards: cards,
    audioAnalysis: audioAnalysis,
    questionLevel: cardCount,
    interpretation: `🎙️ O ${deckName} revela ${levelDescription}. As ${cardCount} frequências (${cardNames}) se combinam para responder sua pergunta com clareza vibracional.`,
    timestamp: Date.now()
  };
  
  console.log(`✅ Enviando resposta com ${cards.length} cartas do baralho ${selectedDeck}`);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🔮 Servidor rodando na porta ${PORT}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET  /health`);
  console.log(`  POST /oracleConsult`);
  console.log(`  POST /oracleConsultWithImage`);
  console.log(`  POST /oracleConsultWithAudio`);
  console.log(`🃏 Baralhos: Rider-Waite (78) + Cigano (36)`);
});
