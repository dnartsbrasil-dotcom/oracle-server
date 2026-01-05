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
  1: { symbol: '0', name: 'O Louco', meaning: 'Novos começos, liberdade, inocência' },
  2: { symbol: 'I', name: 'O Mago', meaning: 'Manifestação, poder pessoal, ação' },
  3: { symbol: 'II', name: 'A Sacerdotisa', meaning: 'Intuição, mistério, sabedoria interior' },
  4: { symbol: 'III', name: 'A Imperatriz', meaning: 'Fertilidade, abundância, natureza' },
  5: { symbol: 'IV', name: 'O Imperador', meaning: 'Autoridade, estrutura, controle' },
  6: { symbol: 'V', name: 'O Hierofante', meaning: 'Tradição, educação, espiritualidade' },
  7: { symbol: 'VI', name: 'Os Amantes', meaning: 'Escolhas, união, amor' },
  8: { symbol: 'VII', name: 'O Carro', meaning: 'Determinação, vitória, controle' },
  9: { symbol: 'VIII', name: 'A Força', meaning: 'Coragem, paciência, compaixão' },
  10: { symbol: 'IX', name: 'O Eremita', meaning: 'Introspecção, sabedoria, solidão' },
  11: { symbol: 'X', name: 'A Roda da Fortuna', meaning: 'Ciclos, destino, mudança' },
  12: { symbol: 'XI', name: 'A Justiça', meaning: 'Equilíbrio, verdade, karma' },
  13: { symbol: 'XII', name: 'O Enforcado', meaning: 'Sacrifício, nova perspectiva' },
  14: { symbol: 'XIII', name: 'A Morte', meaning: 'Transformação, fim de ciclo' },
  15: { symbol: 'XIV', name: 'A Temperança', meaning: 'Equilíbrio, moderação, paciência' },
  16: { symbol: 'XV', name: 'O Diabo', meaning: 'Tentação, materialismo, vícios' },
  17: { symbol: 'XVI', name: 'A Torre', meaning: 'Ruptura, revelação, mudança súbita' },
  18: { symbol: 'XVII', name: 'A Estrela', meaning: 'Esperança, inspiração, renovação' },
  19: { symbol: 'XVIII', name: 'A Lua', meaning: 'Ilusão, medo, intuição' },
  20: { symbol: 'XIX', name: 'O Sol', meaning: 'Alegria, sucesso, vitalidade' },
  21: { symbol: 'XX', name: 'O Julgamento', meaning: 'Renascimento, chamado superior' },
  22: { symbol: 'XXI', name: 'O Mundo', meaning: 'Completude, realização, viagem' },
  
  // Copas (23-36)
  23: { symbol: 'Ás♥', name: 'Ás de Copas', meaning: 'Novo amor, emoções puras' },
  24: { symbol: '2♥', name: 'Dois de Copas', meaning: 'União, parceria, amor' },
  25: { symbol: '3♥', name: 'Três de Copas', meaning: 'Celebração, amizade' },
  26: { symbol: '4♥', name: 'Quatro de Copas', meaning: 'Apatia, reavaliação' },
  27: { symbol: '5♥', name: 'Cinco de Copas', meaning: 'Perda, arrependimento' },
  28: { symbol: '6♥', name: 'Seis de Copas', meaning: 'Nostalgia, inocência' },
  29: { symbol: '7♥', name: 'Sete de Copas', meaning: 'Escolhas, ilusão' },
  30: { symbol: '8♥', name: 'Oito de Copas', meaning: 'Abandono, busca' },
  31: { symbol: '9♥', name: 'Nove de Copas', meaning: 'Satisfação, desejo' },
  32: { symbol: '10♥', name: 'Dez de Copas', meaning: 'Felicidade familiar' },
  33: { symbol: 'V♥', name: 'Valete de Copas', meaning: 'Mensageiro emocional' },
  34: { symbol: 'C♥', name: 'Cavaleiro de Copas', meaning: 'Romance, idealismo' },
  35: { symbol: 'R♥', name: 'Rainha de Copas', meaning: 'Intuição, compaixão' },
  36: { symbol: 'K♥', name: 'Rei de Copas', meaning: 'Equilíbrio emocional' },
  
  // Paus (37-50)
  37: { symbol: 'Ás♣', name: 'Ás de Paus', meaning: 'Novo projeto, inspiração' },
  38: { symbol: '2♣', name: 'Dois de Paus', meaning: 'Planejamento, decisão' },
  39: { symbol: '3♣', name: 'Três de Paus', meaning: 'Expansão, visão' },
  40: { symbol: '4♣', name: 'Quatro de Paus', meaning: 'Celebração, harmonia' },
  41: { symbol: '5♣', name: 'Cinco de Paus', meaning: 'Conflito, competição' },
  42: { symbol: '6♣', name: 'Seis de Paus', meaning: 'Vitória, reconhecimento' },
  43: { symbol: '7♣', name: 'Sete de Paus', meaning: 'Defesa, perseverança' },
  44: { symbol: '8♣', name: 'Oito de Paus', meaning: 'Rapidez, ação' },
  45: { symbol: '9♣', name: 'Nove de Paus', meaning: 'Resiliência, defesa' },
  46: { symbol: '10♣', name: 'Dez de Paus', meaning: 'Responsabilidade' },
  47: { symbol: 'V♣', name: 'Valete de Paus', meaning: 'Mensageiro ativo' },
  48: { symbol: 'C♣', name: 'Cavaleiro de Paus', meaning: 'Aventura, paixão' },
  49: { symbol: 'R♣', name: 'Rainha de Paus', meaning: 'Confiança, carisma' },
  50: { symbol: 'K♣', name: 'Rei de Paus', meaning: 'Liderança, visão' },
  
  // Espadas (51-64)
  51: { symbol: 'Ás♠', name: 'Ás de Espadas', meaning: 'Clareza mental, verdade' },
  52: { symbol: '2♠', name: 'Dois de Espadas', meaning: 'Decisão difícil' },
  53: { symbol: '3♠', name: 'Três de Espadas', meaning: 'Dor, separação' },
  54: { symbol: '4♠', name: 'Quatro de Espadas', meaning: 'Descanso, pausa' },
  55: { symbol: '5♠', name: 'Cinco de Espadas', meaning: 'Conflito, derrota' },
  56: { symbol: '6♠', name: 'Seis de Espadas', meaning: 'Transição, mudança' },
  57: { symbol: '7♠', name: 'Sete de Espadas', meaning: 'Estratégia, cautela' },
  58: { symbol: '8♠', name: 'Oito de Espadas', meaning: 'Restrição, medo' },
  59: { symbol: '9♠', name: 'Nove de Espadas', meaning: 'Ansiedade, pesadelo' },
  60: { symbol: '10♠', name: 'Dez de Espadas', meaning: 'Fim doloroso' },
  61: { symbol: 'V♠', name: 'Valete de Espadas', meaning: 'Vigilância' },
  62: { symbol: 'C♠', name: 'Cavaleiro de Espadas', meaning: 'Ação rápida' },
  63: { symbol: 'R♠', name: 'Rainha de Espadas', meaning: 'Clareza, independência' },
  64: { symbol: 'K♠', name: 'Rei de Espadas', meaning: 'Autoridade intelectual' },
  
  // Ouros (65-78)
  65: { symbol: 'Ás♦', name: 'Ás de Ouros', meaning: 'Nova oportunidade material' },
  66: { symbol: '2♦', name: 'Dois de Ouros', meaning: 'Equilíbrio, adaptação' },
  67: { symbol: '3♦', name: 'Três de Ouros', meaning: 'Trabalho em equipe' },
  68: { symbol: '4♦', name: 'Quatro de Ouros', meaning: 'Controle, segurança' },
  69: { symbol: '5♦', name: 'Cinco de Ouros', meaning: 'Dificuldade financeira' },
  70: { symbol: '6♦', name: 'Seis de Ouros', meaning: 'Generosidade, equilíbrio' },
  71: { symbol: '7♦', name: 'Sete de Ouros', meaning: 'Paciência, investimento' },
  72: { symbol: '8♦', name: 'Oito de Ouros', meaning: 'Dedicação, habilidade' },
  73: { symbol: '9♦', name: 'Nove de Ouros', meaning: 'Abundância, independência' },
  74: { symbol: '10♦', name: 'Dez de Ouros', meaning: 'Riqueza, família' },
  75: { symbol: 'V♦', name: 'Valete de Ouros', meaning: 'Estudante, mensagem prática' },
  76: { symbol: 'C♦', name: 'Cavaleiro de Ouros', meaning: 'Trabalho duro, rotina' },
  77: { symbol: 'R♦', name: 'Rainha de Ouros', meaning: 'Praticidade, nutrição' },
  78: { symbol: 'K♦', name: 'Rei de Ouros', meaning: 'Sucesso material, estabilidade' }
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

function detectDeckType(question) {
  const text = question.toLowerCase();
  
  // ✅ LISTA COMPLETA DE PALAVRAS-CHAVE
  const riderWaiteKeywords = [
    'propósito', 'proposito', 'missão', 'missao',
    'espiritualidade', 'espiritual', 'alma', 'evolução', 'evolucao',
    'transformação', 'transformacao', 'autoconhecimento',
    'crescimento', 'crescer', 'destino', 'karma',
    'consciência', 'consciencia', 'despertar', 'iluminação', 'iluminacao',
    'transcendência', 'transcendencia', 'essência', 'essencia',
    'caminho espiritual', 'jornada interior', 'eu superior'
  ];
  
  const ciganoKeywords = [
    'amor', 'namoro', 'namorado', 'namorada', 'casamento', 'casar',
    'trabalho', 'emprego', 'trampo', 'chefe', 'colega',
    'dinheiro', 'grana', 'salário', 'salario', 'pagar', 'conta',
    'casa', 'apartamento', 'mudança', 'mudanca', 'mudar',
    'família', 'familia', 'mãe', 'mae', 'pai', 'filho', 'irmão', 'irmao',
    'amigo', 'amiga', 'amizade',
    'viagem', 'viajar', 'passeio',
    'saúde', 'saude', 'doença', 'doenca', 'médico', 'medico',
    'sucesso', 'conquistar', 'conseguir', 'ganhar',
    'vai dar certo', 'vai acontecer', 'vou conseguir',
    'quando', 'onde', 'quem', 'como faço', 'como faco',
    'sonhei', 'sonho', 'sonhar', 'pesadelo'
  ];
  
  // Padrões específicos forçam Rider-Waite
  const deepPatterns = [
    /(qual|onde está|onde esta).*(propósito|proposito|missão|missao)/,
    /(como|preciso).*(evoluir|crescer|despertar)/,
    /(meu|minha).*(alma|essência|essencia|ser)/,
    /(caminho|jornada).*(espiritual|interior|consciência|consciencia)/
  ];
  
  if (deepPatterns.some(pattern => pattern.test(text))) {
    console.log('🃏 Baralho selecionado: RIDER_WAITE (padrão espiritual)');
    return 'RIDER_WAITE';
  }
  
  // Padrões específicos forçam Cigano
  const practicalPatterns = [
    /(vai|vou).*(dar certo|conseguir|ganhar|receber)/,
    /(quando|onde|como).*(vou|vai|acontece|consigo)/,
    /(namoro|casamento|amor|trabalho|dinheiro|casa)/,
    /(sonhei|sonho|sonhar|pesadelo)/
  ];
  
  if (practicalPatterns.some(pattern => pattern.test(text))) {
    console.log('🃏 Baralho selecionado: CIGANO (padrão prático)');
    return 'CIGANO';
  }
  
  const riderScore = riderWaiteKeywords.filter(k => text.includes(k)).length;
  const ciganoScore = ciganoKeywords.filter(k => text.includes(k)).length;
  
  const selected = riderScore > ciganoScore ? 'RIDER_WAITE' : 'CIGANO';
  console.log(`🃏 Baralho selecionado: ${selected} (score: R=${riderScore}, C=${ciganoScore})`);
  return selected;
}

// ✅ CORREÇÃO: Ajuste correto de número
function getCardFromDeck(cardNumber, deckType) {
  const deck = deckType === 'RIDER_WAITE' ? RIDER_WAITE_DECK : CIGANO_DECK;
  const maxCards = deckType === 'RIDER_WAITE' ? 78 : 36;
  
  // ✅ CORREÇÃO: Ajustar corretamente para 1-based index
  let adjustedNumber = ((cardNumber - 1) % maxCards) + 1;
  
  if (deck[adjustedNumber]) {
    return deck[adjustedNumber];
  }
  
  // Fallback mais inteligente
  console.log(`⚠️ Carta ${adjustedNumber} não encontrada, usando fallback`);
  return {
    symbol: `#${adjustedNumber}`,
    name: `Arcano ${adjustedNumber}`,
    meaning: `Energia vibracional da carta ${adjustedNumber} do ${deckType === 'RIDER_WAITE' ? 'Tarot' : 'Cigano'}`
  };
}

// =============================================================================
// ENDPOINTS
// =============================================================================

app.get('/health', (req, res) => {
  console.log('✅ /health chamado');
  res.json({
    status: 'online',
    timestamp: Date.now(),
    decks: {
      riderWaite: 78,
      cigano: 36
    }
  });
});

app.post('/oracleConsultWithAudio', (req, res) => {
  console.log('✅ /oracleConsultWithAudio chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, audioValues, deckType, zodiacSign } = req.body;  // ✅ ADICIONAR zodiacSign
  
  if (!question || !audioValues || !Array.isArray(audioValues)) {
    console.log('❌ Dados faltando ou inválidos!');
    return res.status(400).json({ error: 'Missing or invalid data' });
  }
  
  // Detectar baralho se não especificado
  const selectedDeck = deckType || detectDeckType(question);
  
  const cardCount = audioValues.length;
  console.log(`🎙️ Gerando ${cardCount} cartas para: "${question}"`);
  console.log(`🃏 Baralho: ${selectedDeck}`);
  
  // ✅ NOVO: Log do signo
  if (zodiacSign) {
    console.log(`♈ Signo do usuário: ${zodiacSign}`);
  }
  
  console.log(`Valores de áudio: ${audioValues.join(', ')}`);
  
  const sourceNames = [
    'Graves', 'Médios', 'Agudos', 
    'Harmônicos', 'Ressonância', 'Timbre',
    'Amplitude', 'Fase'
  ];
  
  // Gerar cartas com NUMEROLOGIA CORRIGIDA
  const cards = audioValues.map((value, index) => {
    const cardNumber = reduceToBase(value);
    const card = getCardFromDeck(cardNumber, selectedDeck);
    
    console.log(`  Carta ${index + 1}: Valor ${value} → Número ${cardNumber} → ${card.name}`);
    
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
  
  // ✅ NOVO: Adaptar interpretação baseado no signo
  let interpretationPrefix = '';
  if (zodiacSign) {
    const communicationStyle = getZodiacCommunicationStyle(zodiacSign);
    interpretationPrefix = `${getZodiacEmoji(zodiacSign)} Para ${zodiacSign}: ${communicationStyle}\n\n`;
  }
  
  const response = {
    audioValues: audioValues,
    deckType: selectedDeck,
    zodiacSign: zodiacSign || null,  // ✅ NOVO: Retorna signo
    cards: cards,
    audioAnalysis: audioAnalysis,
    questionLevel: cardCount,
    interpretation: `${interpretationPrefix}🎙️ O ${deckName} revela ${levelDescription}. As ${cardCount} frequências (${cardNames}) se combinam para responder sua pergunta com clareza vibracional.`,
    timestamp: Date.now()
  };
  
  console.log(`✅ Enviando resposta com ${cards.length} cartas do baralho ${selectedDeck}`);
  if (zodiacSign) {
    console.log(`♈ Adaptado para ${zodiacSign}`);
  }
  res.json(response);
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
  
  // Gerar cartas usando RGB com numerologia
  const redCard = reduceToBase(rgbValues.r);
  const greenCard = reduceToBase(rgbValues.g);
  const blueCard = reduceToBase(rgbValues.b);
  
  // ImagemScreen sempre usa 3 cartas fixas (RGB)
  const cards = [
    { 
      ...getCardFromDeck(redCard, 'RIDER_WAITE'),
      source: 'Vermelho', 
      calculation: `${rgbValues.r} → ${redCard}` 
    },
    { 
      ...getCardFromDeck(greenCard, 'RIDER_WAITE'),
      source: 'Verde', 
      calculation: `${rgbValues.g} → ${greenCard}` 
    },
    { 
      ...getCardFromDeck(blueCard, 'RIDER_WAITE'),
      source: 'Azul', 
      calculation: `${rgbValues.b} → ${blueCard}` 
    }
  ].map(card => ({
    symbol: card.symbol,
    greekName: card.name,
    meaning: card.meaning,
    source: card.source,
    calculation: card.calculation
  }));
  
  // Análise de cor dominante
  const max = Math.max(rgbValues.r, rgbValues.g, rgbValues.b);
  let dominantColor = 'Equilibrado';
  if (rgbValues.r === max && rgbValues.r > rgbValues.g + 30) dominantColor = 'Vermelho (Paixão)';
  else if (rgbValues.g === max && rgbValues.g > rgbValues.r + 30) dominantColor = 'Verde (Crescimento)';
  else if (rgbValues.b === max && rgbValues.b > rgbValues.r + 30) dominantColor = 'Azul (Tranquilidade)';
  
  const response = {
    rgbValues: {
      r: rgbValues.r,
      g: rgbValues.g,
      b: rgbValues.b
    },
    cardNumbers: {
      red: redCard,
      green: greenCard,
      blue: blueCard
    },
    cards: cards,
    colorAnalysis: {
      dominantColor: dominantColor,
      emotionalState: 'Calma e harmonia',
      energy: 'Energia moderada'
    },
    questionLevel: 3,
    interpretation: `🔮 As cores revelam um momento de equilíbrio. As três cartas (${cards.map(c => c.greekName).join(', ')}) indicam transformação, novas oportunidades e sucesso.`,
    timestamp: Date.now()
  };
  
  console.log('✅ Enviando resposta com', cards.length, 'cartas');
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🔮 Servidor Oracle rodando na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`  GET  /health`);
  console.log(`  POST /oracleConsult`);
  console.log(`  POST /oracleConsultWithImage`);
  console.log(`  POST /oracleConsultWithAudio`);
  console.log(`🃏 Baralhos disponíveis:`);
  console.log(`  - Rider-Waite: 78 cartas (Espiritual)`);
  console.log(`  - Cigano: 36 cartas (Prático)`);
  console.log(`✅ Sistema de detecção automática ativo`);
  console.log(`✅ Análise de complexidade: 1-8 cartas dinâmicas`);
});
