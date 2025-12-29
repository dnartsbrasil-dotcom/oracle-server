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

// ✅ FUNÇÃO PARA GERAR CARTAS
function generateCards(count) {
  const symbols = ['X7', 'Q3', 'K15', 'A1', 'B9', 'C4', 'D12', 'E8', 'F2', 'G11'];
  const names = ['A Lua', 'O Espelho', 'A Transformação', 'O Sol', 'A Estrela', 'O Caminho', 'A Torre', 'A Roda'];
  const meanings = [
    'Transformação chegando',
    'Reflexão necessária',
    'Novos caminhos',
    'Clareza mental',
    'Esperança renovada',
    'Escolhas importantes',
    'Mudanças súbitas',
    'Ciclos se completando'
  ];
  
  const cards = [];
  for (let i = 0; i < count; i++) {
    cards.push({
      symbol: symbols[i % symbols.length],
      greekName: names[i % names.length],
      meaning: meanings[i % meanings.length]
    });
  }
  
  return cards;
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

// ✅ CONSULTAR ORÁCULO (COM ANÁLISE DE COMPLEXIDADE)
app.post('/oracleConsult', (req, res) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  
  // Analisar complexidade
  const analysis = analyzeQuestion(question);
  
  // Gerar cartas baseado na análise
  const cards = generateCards(analysis.cardCount);
  
  // Gerar interpretação
  const interpretation = `As energias revelam ${analysis.description.toLowerCase()}. ${
    analysis.level <= 3 ? 'O caminho está claro.' : 
    analysis.level <= 5 ? 'Múltiplos fatores influenciam a situação.' :
    'Uma análise profunda revela camadas complexas de significado.'
  }`;
  
  res.json({
    level: analysis.level,
    level_info: {