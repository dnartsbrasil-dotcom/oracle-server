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
// ✅ SISTEMA DE SIGNOS
// =============================================================================

function getZodiacEmoji(zodiacSign) {
  const emojis = {
    'Áries': '♈',
    'Touro': '♉',
    'Gêmeos': '♊',
    'Câncer': '♋',
    'Leão': '♌',
    'Virgem': '♍',
    'Libra': '♎',
    'Escorpião': '♏',
    'Sagitário': '♐',
    'Capricórnio': '♑',
    'Aquário': '♒',
    'Peixes': '♓'
  };
  return emojis[zodiacSign] || '⭐';
}

function getZodiacCommunicationStyle(zodiacSign) {
  const styles = {
    'Áries': 'Direto e energético - vai direto ao ponto',
    'Touro': 'Prático e sensorial - valoriza estabilidade',
    'Gêmeos': 'Versátil e curioso - gosta de detalhes',
    'Câncer': 'Emocional e intuitivo - conecta-se com sentimentos',
    'Leão': 'Confiante e dramático - aprecia grandiosidade',
    'Virgem': 'Analítico e detalhista - busca perfeição',
    'Libra': 'Equilibrado e diplomático - pondera todos os lados',
    'Escorpião': 'Intenso e profundo - vai à raiz das questões',
    'Sagitário': 'Otimista e filosófico - visão ampla',
    'Capricórnio': 'Estruturado e ambicioso - foco em resultados',
    'Aquário': 'Original e humanitário - pensa fora da caixa',
    'Peixes': 'Sensível e místico - conecta-se com o espiritual'
  };
  return styles[zodiacSign] || 'Interpretação personalizada';
}

// =============================================================================
// 🔍 BARALHO VESTIGIUM (Tarot do Espelho Negro - 36 cartas)
// Oráculo Investigativo: 4 núcleos para análise profunda
// =============================================================================
const VESTIGIUM_DECK = {
  // NÚCLEO 1: Observação (1-9) - O que está acontecendo
  1: { symbol: '👁️', name: 'A Cena Observada', meaning: 'O visível: gestos, rotas, expressões, interações', nucleus: 'Observação' },
  2: { symbol: '🌑', name: 'O Padrão de Ausência', meaning: 'Momentos de desaparecimento físico ou emocional', nucleus: 'Observação' },
  3: { symbol: '📋', name: 'O Relato Inicial', meaning: 'A versão oficial dos fatos', nucleus: 'Observação' },
  4: { symbol: '🔄', name: 'A Rotina Oculta', meaning: 'Hábitos não compartilhados, mas observáveis', nucleus: 'Observação' },
  5: { symbol: '🚪', name: 'O Território Pessoal', meaning: 'Espaço físico ou digital protegido', nucleus: 'Observação' },
  6: { symbol: '🗺️', name: 'O Mapa de Hábitos', meaning: 'Sequência previsível de ações', nucleus: 'Observação' },
  7: { symbol: '🤐', name: 'O Silêncio Entre as Linhas', meaning: 'O que não é dito, mas está presente', nucleus: 'Observação' },
  8: { symbol: '🫱', name: 'O Testemunho do Corpo', meaning: 'Tensão muscular, microexpressões, postura', nucleus: 'Observação' },
  9: { symbol: '📱', name: 'O Arquivo Público', meaning: 'O que está nas redes e registros acessíveis', nucleus: 'Observação' },
  
  // NÚCLEO 2: Psicologia (10-18) - O que motiva
  10: { symbol: '😔', name: 'A Culpa Disfarçada', meaning: 'Culpa mascarada como preocupação, amor ou raiva', nucleus: 'Psicologia' },
  11: { symbol: '🔥', name: 'O Desejo Não Nomeado', meaning: 'Anseio profundo não admitido', nucleus: 'Psicologia' },
  12: { symbol: '🪞', name: 'A Autoimagem Fraturada', meaning: 'Identidade instável: vítima, salvador ou vilão', nucleus: 'Psicologia' },
  13: { symbol: '😰', name: 'A Insegurança Silenciosa', meaning: 'Medo de não ser suficiente', nucleus: 'Psicologia' },
  14: { symbol: '🎮', name: 'A Necessidade de Controle', meaning: 'Impulso de gerenciar para sentir segurança', nucleus: 'Psicologia' },
  15: { symbol: '👍', name: 'A Fome de Validação', meaning: 'Busca incessante por aprovação externa', nucleus: 'Psicologia' },
  16: { symbol: '💔', name: 'O Medo do Abandono', meaning: 'Terror de ser deixado', nucleus: 'Psicologia' },
  17: { symbol: '🧊', name: 'A Raiva Congelada', meaning: 'Ódio antigo não expresso', nucleus: 'Psicologia' },
  18: { symbol: '🎭', name: 'O Vazio Disfarçado de Amor', meaning: 'Relação mantida por medo da solidão', nucleus: 'Psicologia' },
  
  // NÚCLEO 3: Estratégia (19-27) - Como a pessoa age
  19: { symbol: '📄', name: 'O Alibi', meaning: 'Explicação preparada para justificar ações', nucleus: 'Estratégia' },
  20: { symbol: '⚖️', name: 'A Contradição Sutil', meaning: 'Incoerência entre discurso e ação', nucleus: 'Estratégia' },
  21: { symbol: '🎲', name: 'O Jogo Duplo', meaning: 'Comportamentos diferentes com pessoas diferentes', nucleus: 'Estratégia' },
  22: { symbol: '📰', name: 'A Versão Oficial', meaning: 'Narrativa imposta para encerrar conflitos', nucleus: 'Estratégia' },
  23: { symbol: '📝', name: 'O Controle Narrativo', meaning: 'Definir como os fatos serão lembrados', nucleus: 'Estratégia' },
  24: { symbol: '🔭', name: 'A Vigilância Silenciosa', meaning: 'Observação constante disfarçada', nucleus: 'Estratégia' },
  25: { symbol: '💋', name: 'A Sedução como Tática', meaning: 'Uso de charme para obter informação', nucleus: 'Estratégia' },
  26: { symbol: '😢', name: 'A Vítima Estratégica', meaning: 'Papel de vítima para evitar responsabilidade', nucleus: 'Estratégia' },
  27: { symbol: '🔇', name: 'O Silêncio como Arma', meaning: 'Retenção de comunicação para controlar', nucleus: 'Estratégia' },
  
  // NÚCLEO 4: Consequência (28-36) - Onde isso leva
  28: { symbol: '🎭', name: 'A Queda da Máscara', meaning: 'Fachada desmorona e verdade surge', nucleus: 'Consequência' },
  29: { symbol: '😵', name: 'O Esgotamento Emocional', meaning: 'Colapso após manter realidade falsa', nucleus: 'Consequência' },
  30: { symbol: '💥', name: 'A Quebra de Confiança', meaning: 'Ruptura silenciosa do vínculo', nucleus: 'Consequência' },
  31: { symbol: '⚡', name: 'O Confronto Inevitável', meaning: 'Encontro direto com a verdade adiada', nucleus: 'Consequência' },
  32: { symbol: '📁', name: 'O Arquivo Final', meaning: 'Registro definitivo sem revisão', nucleus: 'Consequência' },
  33: { symbol: '🖤', name: 'O Espelho Negro', meaning: 'Visão clara da sombra sua e do outro', nucleus: 'Consequência' },
  34: { symbol: '⭕', name: 'O Ciclo que se Fecha', meaning: 'Padrão repetitivo interrompido', nucleus: 'Consequência' },
  35: { symbol: '🔁', name: 'A Lição Não Aprendida', meaning: 'Mesmo erro em novo contexto', nucleus: 'Consequência' },
  36: { symbol: '✅', name: 'O Caso Arquivado', meaning: 'Encerramento com integridade', nucleus: 'Consequência' }
};

// Núcleos do Sistema VESTIGIUM
const VESTIGIUM_NUCLEI = [
  { id: 1, name: 'OBSERVAÇÃO', emoji: '👁️', description: 'O que está acontecendo' },
  { id: 2, name: 'PSICOLOGIA', emoji: '🧠', description: 'O que motiva' },
  { id: 3, name: 'ESTRATÉGIA', emoji: '🕵️', description: 'Como a pessoa age' },
  { id: 4, name: 'CONSEQUÊNCIA', emoji: '⚖️', description: 'Onde isso leva' }
];

// =============================================================================
// 📖 BARALHO BIBLICO (Oráculo Bíblico - 36 cartas)
// Psicologia da Alma: 4 grupos representando a jornada espiritual
// =============================================================================
const BIBLICO_DECK = {
  // GRUPO 1: Almas Desconectadas (1-9)
  1: { symbol: '🌱', name: 'O Inocente no Jardim', meaning: 'Inocência preciosa que precisa da proteção divina', group: 'Almas Desconectadas', verse: 'Gn 2:25' },
  2: { symbol: '🙈', name: 'O Que Foge do Olhar', meaning: 'Vergonha que esconde, mas Deus já viu tudo', group: 'Almas Desconectadas', verse: 'Gn 3:10' },
  3: { symbol: '💎', name: 'O Talentoso Rejeitado', meaning: 'Dor permitida para propósito maior', group: 'Almas Desconectadas', verse: 'Gn 45:5' },
  4: { symbol: '🔥', name: 'O Chamado Relutante', meaning: 'Fraqueza é solo sagrado para Deus', group: 'Almas Desconectadas', verse: 'Êx 3:5' },
  5: { symbol: '💧', name: 'O Sedento no Deserto', meaning: 'Secura não é abandono - a fonte está preparada', group: 'Almas Desconectadas', verse: 'Êx 17:6' },
  6: { symbol: '⛲', name: 'A Buscadora de Poços', meaning: 'Não busque em poços secos - a Fonte está diante de você', group: 'Almas Desconectadas', verse: 'Jo 4:14' },
  7: { symbol: '🤫', name: 'A Mulher Invisível', meaning: 'Silêncio sagrado - Deus transforma lágrimas', group: 'Almas Desconectadas', verse: '1 Sm 2:6' },
  8: { symbol: '🪨', name: 'O Pequeno com Medo do Gigante', meaning: 'Pequenez é força - a batalha é do Senhor', group: 'Almas Desconectadas', verse: '1 Sm 17:45' },
  9: { symbol: '👑', name: 'O Rei Perdido', meaning: 'Cuidado com a ilusão de controle', group: 'Almas Desconectadas', verse: '1 Sm 15:23' },
  
  // GRUPO 2: Líderes e Guerreiros (10-18)
  10: { symbol: '📚', name: 'O Sábio Vazio', meaning: 'Nada preenche o vazio além do Criador', group: 'Líderes e Guerreiros', verse: 'Ec 12:13' },
  11: { symbol: '🌾', name: 'A Estrangeira Leal', meaning: 'Sua fidelidade não passa despercebida', group: 'Líderes e Guerreiros', verse: 'Rt 2:12' },
  12: { symbol: '🗡️', name: 'O Herói com Medo', meaning: 'Fraqueza é cenário perfeito para o poder de Deus', group: 'Líderes e Guerreiros', verse: 'Jz 6:16' },
  13: { symbol: '⚔️', name: 'A Mãe em Israel', meaning: 'Chegou sua hora de liderar com justiça', group: 'Líderes e Guerreiros', verse: 'Jz 5:12' },
  14: { symbol: '🐑', name: 'O Pastor no Vale', meaning: 'O Pastor caminha com você até na escuridão', group: 'Líderes e Guerreiros', verse: 'Sl 23:4' },
  15: { symbol: '😴', name: 'O Profeta Esgotado', meaning: 'Após a batalha, vem o descanso divino', group: 'Líderes e Guerreiros', verse: '1 Rs 19:7' },
  16: { symbol: '👸', name: 'A Rainha com Medo', meaning: 'Sua posição não é acaso - para tal tempo como este', group: 'Líderes e Guerreiros', verse: 'Et 4:14' },
  17: { symbol: '🍷', name: 'O Que Jejua Sozinho', meaning: 'Deus quer seu coração, não performances', group: 'Líderes e Guerreiros', verse: 'Os 6:6' },
  18: { symbol: '😢', name: 'O Vendido pelos Irmãos', meaning: 'Rejeição tinha propósito redentor', group: 'Líderes e Guerreiros', verse: 'Gn 50:20' },
  
  // GRUPO 3: Transformação e Encontro (19-27)
  19: { symbol: '👁️', name: 'O Cego que Grita', meaning: 'Sua persistência será recompensada', group: 'Transformação e Encontro', verse: 'Mc 10:47' },
  20: { symbol: '🍞', name: 'O Menino com Pães', meaning: 'Jesus multiplica o que você entrega', group: 'Transformação e Encontro', verse: 'Jo 6:9' },
  21: { symbol: '🩸', name: 'A Mulher que Toca', meaning: 'Um gesto mínimo é suficiente para Jesus', group: 'Transformação e Encontro', verse: 'Mc 5:28' },
  22: { symbol: '💧', name: 'A Pecadora Perdoada', meaning: 'Quem muito ama, muito é perdoado', group: 'Transformação e Encontro', verse: 'Lc 7:47' },
  23: { symbol: '⛓️', name: 'O Possuído Livre', meaning: 'Sua libertação é para testemunhar', group: 'Transformação e Encontro', verse: 'Mc 5:19' },
  24: { symbol: '💰', name: 'O Cobrador Redimido', meaning: 'Ninguém é irrelevante para Jesus', group: 'Transformação e Encontro', verse: 'Lc 19:9' },
  25: { symbol: '🐓', name: 'O Discípulo Restaurado', meaning: 'Seu fracasso não cancela seu chamado', group: 'Transformação e Encontro', verse: 'Jo 21:17' },
  26: { symbol: '⚡', name: 'O Perseguidor Transformado', meaning: 'Ninguém está além da graça divina', group: 'Transformação e Encontro', verse: '1 Co 15:10' },
  27: { symbol: '⚓', name: 'O Náufrago com Esperança', meaning: 'Mesmo na tempestade, Deus garante sua missão', group: 'Transformação e Encontro', verse: 'At 27:25' },
  
  // GRUPO 4: Restauração Final (28-36)
  28: { symbol: '🌅', name: 'O Exilado Visionário', meaning: 'O mundo parece caótico, mas Cristo já venceu', group: 'Restauração Final', verse: 'Ap 1:8' },
  29: { symbol: '🕯️', name: 'A Noiva Vigilante', meaning: 'Mantenha seu coração cheio de óleo', group: 'Restauração Final', verse: 'Mt 25:13' },
  30: { symbol: '🏺', name: 'O Vaso nas Mãos do Oleiro', meaning: 'Você não está quebrado demais para ser moldado', group: 'Restauração Final', verse: 'Jr 18:6' },
  31: { symbol: '🩹', name: 'O Servo Ferido', meaning: 'Sua dor não é inútil - pode se tornar cura', group: 'Restauração Final', verse: 'Is 53:5' },
  32: { symbol: '🤝', name: 'O Estrangeiro Compassivo', meaning: 'Às vezes você é a vítima, outras o samaritano', group: 'Restauração Final', verse: 'Lc 10:37' },
  33: { symbol: '🌹', name: 'O Portador do Espinho', meaning: 'Sua limitação não é obstáculo - é onde a graça brilha', group: 'Restauração Final', verse: '2 Co 12:9' },
  34: { symbol: '🏺', name: 'A Mulher com a Jarra', meaning: 'Sua história de dor pode se tornar testemunho', group: 'Restauração Final', verse: 'Jo 4:29' },
  35: { symbol: '🐑', name: 'A Ovelha Perdida', meaning: 'Você vale a busca do Pastor', group: 'Restauração Final', verse: 'Lc 15:7' },
  36: { symbol: '✨', name: 'A Nova Criação', meaning: 'Sua dor tem data de validade - eternidade já começou', group: 'Restauração Final', verse: 'Ap 21:4' }
};

// Grupos do Sistema BIBLICO
const BIBLICO_GROUPS = [
  { id: 1, name: 'ALMAS DESCONECTADAS', emoji: '🌱', description: 'Onde começamos' },
  { id: 2, name: 'LÍDERES E GUERREIROS', emoji: '⚔️', description: 'Como lutamos' },
  { id: 3, name: 'TRANSFORMAÇÃO E ENCONTRO', emoji: '✝️', description: 'Onde encontramos Cristo' },
  { id: 4, name: 'RESTAURAÇÃO FINAL', emoji: '✨', description: 'Para onde vamos' }
];

// =============================================================================
// 🧠 BARALHO PSIQUE (Tarot Psicanalítico - 36 cartas)
// Sistema DECIFRA: 6 posições fixas para análise psicológica profunda
// =============================================================================
const PSIQUE_DECK = {
  // GRUPO 1: Estruturas da Mente (1-6)
  1: { symbol: '🎭', name: 'O Consciente', meaning: 'Aquilo que a pessoa mostra ao mundo', group: 'Estruturas da Mente' },
  2: { symbol: '🚪', name: 'O Pré-Consciente', meaning: 'O que está prestes a emergir', group: 'Estruturas da Mente' },
  3: { symbol: '🌑', name: 'O Inconsciente', meaning: 'Desejos ocultos e reprimidos', group: 'Estruturas da Mente' },
  4: { symbol: '🐺', name: 'O Id', meaning: 'Instintos, impulsos, prazer', group: 'Estruturas da Mente' },
  5: { symbol: '⚖️', name: 'O Ego', meaning: 'Razão, controle, identidade', group: 'Estruturas da Mente' },
  6: { symbol: '👁️', name: 'O Superego', meaning: 'Culpa, moral, autocobrança', group: 'Estruturas da Mente' },
  
  // GRUPO 2: Fases do Desenvolvimento (7-12)
  7: { symbol: '👄', name: 'A Fase Oral', meaning: 'Carência, dependência, afeto', group: 'Fases do Desenvolvimento' },
  8: { symbol: '🔒', name: 'A Fase Anal', meaning: 'Poder, rigidez, dominação', group: 'Fases do Desenvolvimento' },
  9: { symbol: '🪞', name: 'A Fase Fálica', meaning: 'Ego, sexualidade, identidade', group: 'Fases do Desenvolvimento' },
  10: { symbol: '🤐', name: 'A Latência', meaning: 'Repressão emocional', group: 'Fases do Desenvolvimento' },
  11: { symbol: '🤝', name: 'A Genital', meaning: 'Maturidade afetiva', group: 'Fases do Desenvolvimento' },
  12: { symbol: '👶', name: 'A Regressão', meaning: 'Retorno a traumas antigos', group: 'Fases do Desenvolvimento' },
  
  // GRUPO 3: Estruturas Clínicas (13-18)
  13: { symbol: '😰', name: 'A Neurose', meaning: 'Conflitos internos constantes', group: 'Estruturas Clínicas' },
  14: { symbol: '🌀', name: 'A Psicose', meaning: 'Ruptura com a realidade', group: 'Estruturas Clínicas' },
  15: { symbol: '⚡', name: 'A Perversão', meaning: 'Prazer no limite', group: 'Estruturas Clínicas' },
  16: { symbol: '🧩', name: 'O Autismo', meaning: 'Isolamento psíquico', group: 'Estruturas Clínicas' },
  17: { symbol: '💔', name: 'A Dissociação', meaning: 'Múltiplas camadas internas', group: 'Estruturas Clínicas' },
  18: { symbol: '⚠️', name: 'O Trauma', meaning: 'Marcas emocionais profundas', group: 'Estruturas Clínicas' },
  
  // GRUPO 4: Correntes Teóricas (19-24)
  19: { symbol: '🔍', name: 'Freud', meaning: 'Mergulho no inconsciente', group: 'Correntes Teóricas' },
  20: { symbol: '🌟', name: 'Jung', meaning: 'Arquétipos e símbolos', group: 'Correntes Teóricas' },
  21: { symbol: '🗝️', name: 'Lacan', meaning: 'Linguagem e desejo', group: 'Correntes Teóricas' },
  22: { symbol: '🌙', name: 'Melanie Klein', meaning: 'Relações primárias', group: 'Correntes Teóricas' },
  23: { symbol: '🤗', name: 'Winnicott', meaning: 'Afeto e vínculo', group: 'Correntes Teóricas' },
  24: { symbol: '💪', name: 'Reich', meaning: 'Corpo e emoção reprimida', group: 'Correntes Teóricas' },
  
  // GRUPO 5: Mecanismos de Defesa (25-30)
  25: { symbol: '🙈', name: 'A Negação', meaning: 'Recusa da realidade', group: 'Mecanismos de Defesa' },
  26: { symbol: '🪞', name: 'A Projeção', meaning: 'Culpa jogada no outro', group: 'Mecanismos de Defesa' },
  27: { symbol: '🔐', name: 'A Repressão', meaning: 'Emoções trancadas', group: 'Mecanismos de Defesa' },
  28: { symbol: '⚖️', name: 'A Racionalização', meaning: 'Justificativas falsas', group: 'Mecanismos de Defesa' },
  29: { symbol: '🏃', name: 'A Fuga', meaning: 'Evitar o confronto', group: 'Mecanismos de Defesa' },
  30: { symbol: '🎨', name: 'A Sublimação', meaning: 'Transformar dor em criação', group: 'Mecanismos de Defesa' },
  
  // GRUPO 6: Tripé da Análise (31-36)
  31: { symbol: '🪞', name: 'A Análise Pessoal', meaning: 'Autoconhecimento', group: 'Tripé da Análise' },
  32: { symbol: '🧭', name: 'A Supervisão', meaning: 'Orientação', group: 'Tripé da Análise' },
  33: { symbol: '📚', name: 'O Estudo', meaning: 'Conhecimento', group: 'Tripé da Análise' },
  34: { symbol: '⛩️', name: 'O Setting', meaning: 'Espaço sagrado da análise', group: 'Tripé da Análise' },
  35: { symbol: '🔗', name: 'A Transferência', meaning: 'Projeção emocional', group: 'Tripé da Análise' },
  36: { symbol: '🌿', name: 'A Cura', meaning: 'Reconciliação interna', group: 'Tripé da Análise' }
};

// Posições do Sistema DECIFRA
const DECIFRA_POSITIONS = [
  { position: 1, name: 'INSTINTO', emoji: '1️⃣', description: 'O impulso primário - reação emocional automática' },
  { position: 2, name: 'CONSCIÊNCIA', emoji: '2️⃣', description: 'A mente racional - pensamento lógico' },
  { position: 3, name: 'RESULTADO', emoji: '3️⃣', description: 'A síntese entre instinto e consciência' },
  { position: 4, name: 'FUTURO', emoji: '4️⃣', description: 'O desdobramento natural da situação' },
  { position: 5, name: 'CONSELHO', emoji: '5️⃣', description: 'O ajuste de rota - orientação do oráculo' },
  { position: 6, name: 'VAI SEGUIR?', emoji: '6️⃣', description: 'A verdade crua - tendência real' }
];

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
  1: { symbol: '🎠', name: 'Cavaleiro', meaning: 'Notícias, movimento, homem jovem' },
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
  12: { symbol: '🦜', name: 'Pássaros', meaning: 'Conversa, ansiedade, casal' },
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
  while (result > 36) {
    result = sumDigits(result);
  }
  return result === 0 ? 1 : result;
}

function detectDeckType(question, requestedDeck) {
  if (requestedDeck === 'VESTIGIUM') {
    console.log('🔍 Baralho solicitado: VESTIGIUM (Tarot do Espelho Negro)');
    return 'VESTIGIUM';
  }
  if (requestedDeck === 'BIBLICO') {
    console.log('📖 Baralho solicitado: BIBLICO (Oráculo Bíblico)');
    return 'BIBLICO';
  }
  if (requestedDeck === 'PSIQUE') {
    console.log('🧠 Baralho solicitado: PSIQUE (Tarot Psicanalítico)');
    return 'PSIQUE';
  }
  if (requestedDeck === 'RIDER_WAITE') {
    console.log('🃏 Baralho solicitado: RIDER_WAITE');
    return 'RIDER_WAITE';
  }
  if (requestedDeck === 'CIGANO') {
    console.log('🃏 Baralho solicitado: CIGANO');
    return 'CIGANO';
  }
  
  const text = question.toLowerCase();
  
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

function getCardFromDeck(cardNumber, deckType) {
  let deck, maxCards;
  
  if (deckType === 'VESTIGIUM') {
    deck = VESTIGIUM_DECK;
    maxCards = 36;
  } else if (deckType === 'BIBLICO') {
    deck = BIBLICO_DECK;
    maxCards = 36;
  } else if (deckType === 'PSIQUE') {
    deck = PSIQUE_DECK;
    maxCards = 36;
  } else if (deckType === 'RIDER_WAITE') {
    deck = RIDER_WAITE_DECK;
    maxCards = 78;
  } else {
    deck = CIGANO_DECK;
    maxCards = 36;
  }
  
  let adjustedNumber = cardNumber;
  while (adjustedNumber > maxCards) {
    adjustedNumber = sumDigits(adjustedNumber);
  }
  if (adjustedNumber === 0) adjustedNumber = 1;
  
  if (deck[adjustedNumber]) {
    return deck[adjustedNumber];
  }
  
  console.log(`⚠️ Carta ${adjustedNumber} não encontrada, usando fallback`);
  return {
    symbol: `#${adjustedNumber}`,
    name: `Arcano ${adjustedNumber}`,
    meaning: `Energia vibracional da carta ${adjustedNumber} do ${deckType}`
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
      vestigium: 36,
      biblico: 36,
      psique: 36,
      riderWaite: 78,
      cigano: 36
    },
    zodiacSystem: 'enabled',
    decifraSystem: 'enabled',
    imageAnalysis: '6 cards enabled'
  });
});

app.post('/oracleConsultWithAudio', (req, res) => {
  console.log('✅ /oracleConsultWithAudio chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, audioValues, deckType, zodiacSign } = req.body;
  
  if (!question || !audioValues || !Array.isArray(audioValues)) {
    console.log('❌ Dados faltando ou inválidos!');
    return res.status(400).json({ error: 'Missing or invalid data' });
  }
  
  const selectedDeck = detectDeckType(question, deckType);
  const cardCount = audioValues.length;
  
  console.log(`🎙️ Gerando ${cardCount} cartas para: "${question}"`);
  console.log(`🃏 Baralho: ${selectedDeck}`);
  
  if (zodiacSign) {
    console.log(`♈ Signo do usuário: ${zodiacSign}`);
  }
  
  console.log(`Valores de áudio: ${audioValues.join(', ')}`);
  
  let sourceNames;
  if (selectedDeck === 'VESTIGIUM') {
    sourceNames = VESTIGIUM_NUCLEI.map(n => n.emoji + ' ' + n.name);
  } else if (selectedDeck === 'BIBLICO') {
    sourceNames = BIBLICO_GROUPS.map(g => g.emoji + ' ' + g.name);
  } else if (selectedDeck === 'PSIQUE') {
    sourceNames = DECIFRA_POSITIONS.map(p => p.emoji + ' ' + p.name);
  } else {
    sourceNames = [
      'Graves', 'Médios', 'Agudos', 
      'Harmônicos', 'Ressonância', 'Timbre',
      'Amplitude', 'Fase', 'Textura', 'Envelope'
    ];
  }
  
  const cards = audioValues.map((value, index) => {
    let cardNumber;
    
    if (selectedDeck === 'VESTIGIUM') {
      const nucleusBase = (index * 9) + 1;
      cardNumber = nucleusBase + ((value - 1) % 9);
    } else if (selectedDeck === 'BIBLICO') {
      const groupBase = (index * 9) + 1;
      cardNumber = groupBase + ((value - 1) % 9);
    } else if (selectedDeck === 'PSIQUE') {
      cardNumber = ((value - 1) % 36) + 1;
    } else {
      cardNumber = reduceToBase(value);
    }
    
    const card = getCardFromDeck(cardNumber, selectedDeck);
    
    console.log(`  Carta ${index + 1}: Valor ${value} → Número ${cardNumber} → ${card.name}`);
    
    return {
      symbol: card.symbol,
      greekName: card.name,
      meaning: card.meaning,
      source: sourceNames[index] || `Frequência ${index + 1}`,
      calculation: `${value} → ${cardNumber}`,
      group: card.group || undefined
    };
  });
  
  const audioAnalysis = {
    dominantFrequency: cardCount >= 5 ? 'Espectro amplo' : 'Médias',
    emotionalTone: cardCount >= 7 ? 'Profundo e complexo' : 'Calmo e assertivo',
    energy: cardCount >= 6 ? 'Energia intensa' : 'Energia equilibrada'
  };
  
  let levelDescription = '';
  if (selectedDeck === 'PSIQUE') {
    levelDescription = 'análise psicológica profunda através do Sistema DECIFRA';
  } else {
    if (cardCount === 1) levelDescription = 'resposta direta';
    else if (cardCount === 2) levelDescription = 'escolha clara';
    else if (cardCount === 3) levelDescription = 'padrão vibracional único';
    else if (cardCount === 4) levelDescription = 'contexto amplo';
    else if (cardCount === 5) levelDescription = 'análise complexa';
    else if (cardCount === 6) levelDescription = 'visão profunda';
    else if (cardCount === 7) levelDescription = 'análise completa';
    else levelDescription = 'máxima profundidade';
  }
  
  const cardNames = cards.map(c => c.greekName).join(', ');
  
  let deckName;
  if (selectedDeck === 'VESTIGIUM') {
    deckName = 'Tarot do Espelho Negro (Sistema VESTIGIUM)';
  } else if (selectedDeck === 'BIBLICO') {
    deckName = 'Oráculo Bíblico (Sistema BIBLICO)';
  } else if (selectedDeck === 'PSIQUE') {
    deckName = 'Tarot Psicanalítico (Sistema DECIFRA)';
  } else if (selectedDeck === 'RIDER_WAITE') {
    deckName = 'Tarot Rider-Waite';
  } else {
    deckName = 'Baralho Cigano';
  }
  
  let interpretationPrefix = '';
  if (zodiacSign) {
    const communicationStyle = getZodiacCommunicationStyle(zodiacSign);
    interpretationPrefix = `${getZodiacEmoji(zodiacSign)} Para ${zodiacSign}: ${communicationStyle}\n\n`;
  }
  
  let interpretation;
  if (selectedDeck === 'VESTIGIUM') {
    interpretation = `${interpretationPrefix}🔍 O Tarot do Espelho Negro revela análise investigativa através de 4 núcleos.

Os 4 núcleos revelam:

👁️ OBSERVAÇÃO → ${cards[0].greekName}: ${cards[0].meaning}
🧠 PSICOLOGIA → ${cards[1].greekName}: ${cards[1].meaning}
🕵️ ESTRATÉGIA → ${cards[2].greekName}: ${cards[2].meaning}
⚖️ CONSEQUÊNCIA → ${cards[3].greekName}: ${cards[3].meaning}

O Espelho Negro mostra o padrão completo - do que é visível até o desfecho inevitável.`;
  } else if (selectedDeck === 'BIBLICO') {
    interpretation = `${interpretationPrefix}📖 O Oráculo Bíblico revela a jornada da alma através de 4 grupos.

Os 4 grupos revelam:

🌱 ALMAS DESCONECTADAS → ${cards[0].greekName}: ${cards[0].meaning}
⚔️ LÍDERES E GUERREIROS → ${cards[1].greekName}: ${cards[1].meaning}
✝️ TRANSFORMAÇÃO E ENCONTRO → ${cards[2].greekName}: ${cards[2].meaning}
✨ RESTAURAÇÃO FINAL → ${cards[3].greekName}: ${cards[3].meaning}

A Palavra mostra o caminho de volta a Deus - não por esforço, mas por encontro.`;
  } else if (selectedDeck === 'PSIQUE') {
    interpretation = `${interpretationPrefix}🧠 O ${deckName} revela ${levelDescription}.

As 6 posições do Sistema DECIFRA revelam:

1️⃣ INSTINTO → ${cards[0].greekName}: O impulso emocional automático
2️⃣ CONSCIÊNCIA → ${cards[1].greekName}: O pensamento racional
3️⃣ RESULTADO → ${cards[2].greekName}: O conflito entre razão e emoção
4️⃣ FUTURO → ${cards[3].greekName}: A tendência natural se nada mudar
5️⃣ CONSELHO → ${cards[4].greekName}: A orientação do oráculo
6️⃣ VAI SEGUIR? → ${cards[5].greekName}: A verdade sobre sua tendência real

Esta leitura revela não apenas o que vai acontecer, mas POR QUE acontece. O DECIFRA mostra o conflito interno, o caminho e a verdade final.`;
  } else {
    // Para Cigano com 3 cartas → Interpretação ORACULAR DECISIVA
    if (selectedDeck === 'CIGANO' && cardCount === 3) {
      // Interpretação profunda de cada carta
      const passadoInterpretacao = interpretarCartaOracular(cards[0], 'passado');
      const presenteInterpretacao = interpretarCartaOracular(cards[1], 'presente');
      const futuroInterpretacao = interpretarCartaOracular(cards[2], 'futuro');
      
      // Síntese conectando as 3 cartas
      const sintese = gerarSinteseOracular(cards[0], cards[1], cards[2]);
      
      // Veredito simbólico
      const veredito = gerarVeredito(cards[0], cards[1], cards[2]);
      
      interpretation = `${interpretationPrefix}🔮 LEITURA ORACULAR

📜 PASSADO — ${cards[0].greekName}
${passadoInterpretacao}

⏳ PRESENTE — ${cards[1].greekName}
${presenteInterpretacao}

🌟 FUTURO — ${cards[2].greekName}
${futuroInterpretacao}

━━━━━━━━━━━━━━━━━━━━━━━━━━

🔮 Síntese do oráculo
${sintese}

🧿 Veredito simbólico
${veredito}`;
    } else {
      // Outros casos (outros decks ou quantidade de cartas)
      interpretation = `${interpretationPrefix}🎙️ O ${deckName} revela ${levelDescription}. As ${cardCount} frequências (${cardNames}) se combinam para responder sua pergunta com clareza vibracional.`;
    }
  }
  
  const response = {
    audioValues: audioValues,
    deckType: selectedDeck,
    zodiacSign: zodiacSign || null,
    cards: cards,
    audioAnalysis: audioAnalysis,
    questionLevel: cardCount,
    interpretation: interpretation,
    decifraSystem: selectedDeck === 'PSIQUE' ? DECIFRA_POSITIONS : undefined,
    vestigiumNuclei: selectedDeck === 'VESTIGIUM' ? VESTIGIUM_NUCLEI : undefined,
    biblicoGroups: selectedDeck === 'BIBLICO' ? BIBLICO_GROUPS : undefined,
    timestamp: Date.now()
  };
  
  console.log(`✅ Enviando resposta com ${cards.length} cartas do baralho ${selectedDeck}`);
  if (zodiacSign) {
    console.log(`♈ Adaptado para ${zodiacSign}`);
  }
  res.json(response);
});

// =============================================================================
// 🔮 INTERPRETAÇÃO ORACULAR PROFUNDA (SEM FRASES MOTIVACIONAIS)
// =============================================================================

// Interpretações profundas por carta e contexto
function interpretarCartaOracular(card, posicao) {
  const interpretacoesProfundas = {
    'Cavaleiro': {
      passado: 'O Cavaleiro fala de movimento que não parou. Notícias que chegaram, decisões que foram tomadas em velocidade. O caminho até aqui foi marcado por pressa, mudanças e mensagens que alteraram rotas.',
      presente: 'O Cavaleiro traz movimento no agora. Há mensagens chegando, decisões sendo tomadas, caminhos se abrindo. A energia está em trânsito, em movimento constante.',
      futuro: 'O Cavaleiro aponta chegada. Notícias virão, mudanças se aproximam, rotas serão alteradas. O que está parado vai se mover.'
    },
    'Trevo': {
      passado: 'O Trevo revela sorte que já passou. Oportunidades que surgiram, momentos leves, soluções rápidas. O caminho foi facilitado por graça inesperada.',
      presente: 'O Trevo traz leveza agora. Há sorte pequena, oportunidade breve, momento favorável. A energia está leve e fluida.',
      futuro: 'O Trevo aponta solução rápida. A sorte vem, a oportunidade se abre, o caminho se facilita. Breve, mas real.'
    },
    'Navio': {
      passado: 'O Navio mostra jornada longa. Distância percorrida, separações, viagens que moldaram. O caminho foi de longe, de espera, de navegação lenta.',
      presente: 'O Navio indica distância no agora. Há separação, espera, jornada em curso. A energia está em movimento lento mas constante.',
      futuro: 'O Navio aponta partida ou chegada. Viagem acontece, distância se estabelece ou se encerra. O movimento é inevitável.'
    },
    'Casa': {
      passado: 'A Casa fala de raízes estabelecidas. Família, base, estrutura que sustentou. O caminho foi construído sobre fundação sólida.',
      presente: 'A Casa traz estabilidade agora. Há base firme, família presente, estrutura que segura. A energia está ancorada.',
      futuro: 'A Casa aponta permanência. O que vier ficará, a base se estabelece, raízes se aprofundam. Estrutura se solidifica.'
    },
    'Árvore': {
      passado: 'A Árvore mostra crescimento lento. Saúde vivida, raízes antigas, processos que levaram tempo. O caminho foi de paciência forçada.',
      presente: 'A Árvore indica saúde e tempo. Há processo lento, raiz profunda, crescimento gradual. A energia está firme mas demorada.',
      futuro: 'A Árvore aponta longevidade. O que vier dura, a saúde se estabelece ou se cobra, raízes se aprofundam. Tempo longo.'
    },
    'Nuvens': {
      passado: 'As Nuvens revelam confusão passada. Incerteza que prevaleceu, clareza que faltou, névoa que cobriu. O caminho foi nebuloso.',
      presente: 'As Nuvens trazem dúvida agora. Há confusão ativa, clareza que falta, névoa que impede visão. A energia está obscura.',
      futuro: 'As Nuvens apontam incerteza à frente. Confusão virá, clareza demorará, névoa permanecerá. A visão será limitada.'
    },
    'Cobra': {
      passado: 'A Cobra fala de manobras nos bastidores. Articulações ocultas, estratégias sinuosas, conflitos velados. O caminho foi marcado por jogos de poder e inimigos disfarçados.',
      presente: 'A Cobra indica traição ou estratégia no agora. Há manobras acontecendo, conflitos velados, alianças questionáveis. A energia está torcida.',
      futuro: 'A Cobra aponta complicação à frente. Traição pode vir, conflito se estabelece, caminhos tortos prevalecem. A sinuosidade vence a linha reta.'
    },
    'Caixão': {
      passado: 'O Caixão mostra fim que já ocorreu. Ciclo encerrado, morte simbólica, transformação forçada. O caminho passou por perda definitiva.',
      presente: 'O Caixão traz encerramento no agora. Há fim acontecendo, ciclo se fechando, morte simbólica em curso. A energia está em dissolução.',
      futuro: 'O Caixão aponta término inevitável. O fim virá, o ciclo se encerra, a transformação se completa. Não há retorno.'
    },
    'Buquê': {
      passado: 'O Buquê revela beleza que foi. Presentes recebidos, momentos de alegria, reconhecimento que chegou. O caminho foi ornamentado.',
      presente: 'O Buquê traz beleza agora. Há presente chegando, alegria presente, reconhecimento vindo. A energia está florida.',
      futuro: 'O Buquê aponta dádiva à frente. Presente virá, beleza se estabelece, alegria se manifesta. O que é belo prevalece.'
    },
    'Foice': {
      passado: 'A Foice mostra corte que aconteceu. Separação brusca, decisão afiada, fim repentino. O caminho foi cortado.',
      presente: 'A Foice indica ruptura no agora. Há corte acontecendo, decisão sendo tomada, fim abrupto em curso. A energia está cortante.',
      futuro: 'A Foice aponta corte à frente. Separação virá, decisão será tomada, fim será repentino. A lâmina cai.'
    },
    'Chicote': {
      passado: 'O Chicote fala de conflito passado. Discussões que aconteceram, agressões trocadas, embates repetidos. O caminho foi combativo.',
      presente: 'O Chicote traz conflito no agora. Há discussão ativa, embate presente, agressão em troca. A energia está combativa.',
      futuro: 'O Chicote aponta briga à frente. Conflito virá, discussão se estabelece, embates se repetem. A disputa prevalece.'
    },
    'Pássaros': {
      passado: 'Os Pássaros mostram conversas que foram. Fofocas circularam, comunicação intensa, vozes múltiplas. O caminho foi barulhento.',
      presente: 'Os Pássaros indicam comunicação no agora. Há conversa acontecendo, fofoca circulando, vozes se multiplicando. A energia está vocal.',
      futuro: 'Os Pássaros apontam fala à frente. Conversas virão, fofocas circularão, comunicação se intensifica. As vozes prevalecerão.'
    },
    'Criança': {
      passado: 'A Criança revela inocência passada. Começos que aconteceram, ingenuidade que prevaleceu, novidade que surgiu. O caminho foi infantil.',
      presente: 'A Criança traz novo começo agora. Há inocência presente, frescor ativo, pequenez atual. A energia está jovem.',
      futuro: 'A Criança aponta início à frente. Novo começa, inocência retorna, pequeno cresce. O começo prevalece.'
    },
    'Raposa': {
      passado: 'A Raposa mostra astúcia passada. Estratégias usadas, inteligência aplicada, manipulação que ocorreu. O caminho foi esperto.',
      presente: 'A Raposa indica inteligência no agora. Há estratégia ativa, astúcia sendo usada, jogo sendo jogado. A energia está calculista.',
      futuro: 'A Raposa aponta esperteza à frente. Estratégia virá, manipulação acontecerá, inteligência prevalecerá. O jogo se estabelece.'
    },
    'Urso': {
      passado: 'O Urso fala de poder que foi. Força estabelecida, autoridade exercida, proteção que existiu. O caminho foi forte.',
      presente: 'O Urso traz força no agora. Há poder presente, autoridade ativa, proteção estabelecida. A energia está dominante.',
      futuro: 'O Urso aponta domínio à frente. Poder virá, autoridade se estabelece, força prevalece. O controle é inevitável.'
    },
    'Estrelas': {
      passado: 'As Estrelas mostram orientação que houve. Destino que guiou, esperança que sustentou, proteção celestial. O caminho foi iluminado.',
      presente: 'As Estrelas trazem guia no agora. Há destino se revelando, esperança presente, luz celestial. A energia está orientada.',
      futuro: 'As Estrelas apontam direção divina. Destino se cumpre, esperança se realiza, proteção se manifesta. O caminho é iluminado.'
    },
    'Cegonha': {
      passado: 'A Cegonha revela mudança que ocorreu. Transformação que aconteceu, nascimento que veio, movimento ascendente. O caminho foi de elevação.',
      presente: 'A Cegonha indica mudança no agora. Há transformação em curso, nascimento acontecendo, movimento para cima. A energia está ascendente.',
      futuro: 'A Cegonha aponta transformação à frente. Mudança virá, nascimento acontece, elevação se dá. O novo prevalece.'
    },
    'Cão': {
      passado: 'O Cão mostra lealdade que existiu. Amizades que sustentaram, fidelidade que prevaleceu, proteção que foi dada. O caminho teve aliados.',
      presente: 'O Cão traz lealdade e sustentação. Há alianças firmes, base fiel, proteção ativa. Não se caminha sozinho agora — existe quem defenda e sustente.',
      futuro: 'O Cão aponta fidelidade à frente. Amizade permanece, lealdade se estabelece, proteção continua. Os aliados ficam.'
    },
    'Torre': {
      passado: 'A Torre fala de isolamento passado. Solidão vivida, separação imposta, distância estabelecida. O caminho foi solitário.',
      presente: 'A Torre indica solidão no agora. Há isolamento ativo, separação presente, distância estabelecida. A energia está fechada.',
      futuro: 'A Torre aponta isolamento à frente. Solidão virá, separação se impõe, distância se estabelece. O afastamento prevalece.'
    },
    'Jardim': {
      passado: 'O Jardim mostra convívio que houve. Socializações passadas, público que esteve presente, comunidade que existiu. O caminho foi coletivo.',
      presente: 'O Jardim traz convívio no agora. Há socialização ativa, público presente, comunidade reunida. A energia está coletiva.',
      futuro: 'O Jardim aponta público à frente. Socialização virá, comunidade se reúne, exposição acontece. O coletivo prevalece.'
    },
    'Montanha': {
      passado: 'A Montanha revela bloqueio que existiu. Obstáculos enfrentados, atrasos vividos, impossibilidades que prevaleceram. O caminho foi travado.',
      presente: 'A Montanha indica bloqueio no agora. Há obstáculo firme, atraso estabelecido, impossibilidade presente. A energia está travada.',
      futuro: 'A Montanha aponta obstrução à frente. Bloqueio virá, obstáculo se estabelece, impossibilidade prevalece. O caminho se fecha.'
    },
    'Caminhos': {
      passado: 'Os Caminhos mostram escolha que foi feita. Bifurcações enfrentadas, decisões tomadas, rotas escolhidas. O caminho teve encruzilhada.',
      presente: 'Os Caminhos indicam escolha no agora. Há decisão sendo tomada, bifurcação presente, rotas se abrindo. A energia está indecisa.',
      futuro: 'Os Caminhos apontam decisão à frente. Escolha virá, bifurcação se apresenta, rota será tomada. A encruzilhada se aproxima.'
    },
    'Ratos': {
      passado: 'Os Ratos falam de desgaste passado. Perdas graduais, corrosão vivida, ansiedade que consumiu. O caminho foi corroído.',
      presente: 'Os Ratos trazem desgaste no agora. Há perda gradual, corrosão ativa, ansiedade consumindo. A energia está sendo roída.',
      futuro: 'Os Ratos apontam corrosão à frente. Perdas graduais virão, desgaste contínuo se estabelece, consumo silencioso prevalece. Não é corte brusco, mas erosão que enfraquece o que parecia sólido.'
    },
    'Coração': {
      passado: 'O Coração revela amor que foi. Sentimentos vividos, paixão que existiu, afeto estabelecido. O caminho foi emocional.',
      presente: 'O Coração traz amor no agora. Há sentimento ativo, paixão presente, afeto estabelecido. A energia está emocional.',
      futuro: 'O Coração aponta amor à frente. Sentimento virá, paixão se estabelece, afeto prevalece. O amor se manifesta.'
    },
    'Anel': {
      passado: 'O Anel mostra compromisso que houve. Promessas feitas, contratos assinados, alianças estabelecidas. O caminho foi comprometido.',
      presente: 'O Anel indica compromisso no agora. Há promessa ativa, contrato válido, aliança estabelecida. A energia está comprometida.',
      futuro: 'O Anel aponta compromisso à frente. Promessa será feita, contrato será assinado, aliança se estabelece. O vínculo se forma.'
    },
    'Livro': {
      passado: 'O Livro fala de segredos passados. Conhecimento oculto, informações escondidas, mistérios que prevaleceram. O caminho foi secreto.',
      presente: 'O Livro indica segredo no agora. Há conhecimento oculto, informação escondida, mistério presente. A energia está velada.',
      futuro: 'O Livro aponta revelação ou ocultação. Segredo será mantido ou revelado, conhecimento virá ou ficará escondido. O mistério prevalece.'
    },
    'Carta': {
      passado: 'A Carta mostra mensagem que chegou. Notícias recebidas, comunicação que aconteceu, informações que vieram. O caminho foi informado.',
      presente: 'A Carta traz notícia no agora. Há mensagem chegando, comunicação ativa, informação em trânsito. A energia está em comunicação.',
      futuro: 'A Carta aponta mensagem à frente. Notícia virá, comunicação se estabelece, informação chega. A mensagem se manifesta.'
    },
    'Homem': {
      passado: 'O Homem revela figura masculina significativa. Influência que prevaleceu, presença que marcou, energia masculina ativa. O caminho teve essa figura.',
      presente: 'O Homem indica presença masculina no agora. Há figura importante, influência ativa, energia masculina presente. A força está personificada.',
      futuro: 'O Homem aponta figura à frente. Presença masculina virá, influência se estabelece, energia se manifesta. O homem prevalece.'
    },
    'Mulher': {
      passado: 'A Mulher mostra figura feminina significativa. Influência que prevaleceu, presença que marcou, energia feminina ativa. O caminho teve essa figura.',
      presente: 'A Mulher indica presença feminina no agora. Há figura importante, influência ativa, energia feminina presente. A força está personificada.',
      futuro: 'A Mulher aponta figura à frente. Presença feminina virá, influência se estabelece, energia se manifesta. A mulher prevalece.'
    },
    'Lírios': {
      passado: 'Os Lírios falam de pureza passada. Paz que existiu, harmonia vivida, maturidade estabelecida. O caminho foi sereno.',
      presente: 'Os Lírios trazem paz no agora. Há pureza presente, harmonia ativa, serenidade estabelecida. A energia está pura.',
      futuro: 'Os Lírios apontam harmonia à frente. Paz virá, pureza se estabelece, serenidade prevalece. A harmonia se manifesta.'
    },
    'Sol': {
      passado: 'O Sol revela vitória passada. Sucesso alcançado, brilho que existiu, calor que aqueceu. O caminho foi vitorioso.',
      presente: 'O Sol traz vitória no agora. Há sucesso presente, brilho ativo, calor estabelecido. A energia está radiante.',
      futuro: 'O Sol aponta triunfo à frente. Vitória virá, sucesso se estabelece, brilho prevalece. A luz vence.'
    },
    'Lua': {
      passado: 'A Lua mostra reconhecimento passado. Fama que veio, intuição que guiou, emoções que prevaleceram. O caminho foi emocional e reconhecido.',
      presente: 'A Lua traz reconhecimento no agora. Há fama presente, intuição ativa, emoções fortes. A energia está reconhecida.',
      futuro: 'A Lua aponta reconhecimento à frente. Fama virá, intuição se manifesta, emoções prevalecem. O brilho noturno se estabelece.'
    },
    'Chave': {
      passado: 'A Chave fala de solução que veio. Portas que se abriram, respostas que chegaram, destino que se cumpriu. O caminho foi destrancado.',
      presente: 'A Chave traz solução no agora. Há porta abrindo, resposta chegando, destino se cumprindo. A energia está destravada.',
      futuro: 'A Chave aponta destrancar à frente. Solução virá, porta se abrirá, resposta chega. O destino se cumpre.'
    },
    'Peixes': {
      passado: 'Os Peixes mostram abundância passada. Dinheiro que fluiu, negócios que aconteceram, multiplicação que veio. O caminho foi próspero.',
      presente: 'Os Peixes trazem abundância no agora. Há dinheiro fluindo, negócios acontecendo, multiplicação ativa. A energia está próspera.',
      futuro: 'Os Peixes apontam prosperidade à frente. Dinheiro virá, negócios se estabelecem, multiplicação acontece. A abundância prevalece.'
    },
    'Âncora': {
      passado: 'A Âncora revela estabilidade ou peso passado. Segurança estabelecida ou lentidão imposta. O caminho foi ancorado.',
      presente: 'A Âncora indica firmeza ou trava no agora. Há segurança estabelecida ou peso que segura. A energia está ancorada.',
      futuro: 'A Âncora aponta permanência ou lentidão. Segurança se estabelece ou peso permanece. O que está ancorado não se move.'
    },
    'Cruz': {
      passado: 'A Cruz mostra fardo que foi carregado. Peso vivido, sacrifício feito, destino cumprido. O caminho foi pesado.',
      presente: 'A Cruz traz fardo no agora. Há peso sendo carregado, sacrifício ativo, destino se cumprindo. A energia está carregada.',
      futuro: 'A Cruz aponta peso à frente. Fardo virá, sacrifício será exigido, destino se cumpre. O peso prevalece.'
    }
  };
  
  const interpretacao = interpretacoesProfundas[card.greekName];
  if (!interpretacao) {
    // Fallback caso a carta não esteja mapeada
    return card.meaning;
  }
  
  return interpretacao[posicao] || card.meaning;
}

// Gerar síntese NARRATIVA ARQUETÍPICA (universal)
function gerarSinteseOracular(passado, presente, futuro) {
  const p = passado.greekName;
  const pr = presente.greekName;
  const f = futuro.greekName;
  
  let narrativa = '';
  
  // ============================================================================
  // NARRATIVAS ARQUETÍPICAS - Aplicam a QUALQUER contexto
  // ============================================================================
  
  // CHICOTE + CEGONHA + FOICE (conflito → transformação → corte)
  if (p === 'Chicote' && pr === 'Cegonha' && f === 'Foice') {
    narrativa = `Passado: Conflitos e embates (${p}).\nPresente: Transformações em curso (${pr}).\nFuturo: Corte abrupto (${f}).\n\nOs embates do passado geraram mudanças no presente. Essas mudanças não se estabilizam — elas pressionam para separação. Ou se corta o que está causando atrito, ou a própria pressão corta. A Foice não espera equilíbrio — ela separa.`;
  }
  
  // QUALQUER + CÃO + RATOS (lealdade → desgaste)
  else if (pr === 'Cão' && f === 'Ratos') {
    narrativa = `Passado: ${p}.\nPresente: Lealdade e sustentação (${pr}).\nFuturo: Desgaste gradual (${f}).\n\nA base fiel do presente cria proteção momentânea, mas os Ratos não poupam alianças — eles corroem estruturas. Ou a lealdade se transforma em ação que preserva, ou o desgaste consome mesmo o que está protegido. Não é colapso — é erosão.`;
  }
  
  // BLOQUEIO PRESENTE + FIM FUTURO
  else if ((pr === 'Montanha' || pr === 'Âncora' || pr === 'Caixão') && (f === 'Caixão' || f === 'Foice' || f === 'Cruz')) {
    narrativa = `Passado: ${p}.\nPresente: ${pr} — bloqueio estrutural.\nFuturo: ${f} — encerramento.\n\nQuando o presente está travado e o futuro mostra fim, a tendência não é destravamento — é conclusão. Ou se rompe antes e se liberta, ou a permanência se torna insustentável até morrer. O bloqueio não se resolve — ele encerra.`;
  }
  
  // PASSADO PESADO + FOICE FUTURO
  else if ((p === 'Cobra' || p === 'Chicote' || p === 'Montanha' || p === 'Nuvens') && f === 'Foice') {
    narrativa = `Passado: ${p} — ${p === 'Chicote' ? 'embates' : p === 'Cobra' ? 'complicações' : p === 'Montanha' ? 'bloqueios' : 'confusão'}.\nPresente: ${pr}.\nFuturo: Foice — separação.\n\nO peso do passado acumula tensão no presente. Tensão acumulada pressiona até que algo se rompe. Ou se corta antes que exploda, ou a própria pressão força o corte. A lâmina não negocia — ela apenas separa.`;
  }
  
  // FIM NO FUTURO (Caixão, Foice, Cruz)
  else if (f === 'Caixão' || f === 'Foice' || f === 'Cruz') {
    const acao = f === 'Caixão' ? 'se encerra' : f === 'Foice' ? 'se separa' : 'pesa até parar';
    narrativa = `Passado: ${p}.\nPresente: ${pr}.\nFuturo: ${f} — ${acao}.\n\nDo passado ao presente, o movimento converge para encerramento. ${f === 'Foice' ? 'A lâmina não negocia — ou se corta conscientemente, ou se é cortado pela pressão.' : f === 'Caixão' ? 'Ciclos não morrem por escolha — morrem quando se esgotam.' : 'O fardo não desaparece — ou se abandona, ou esmaga.'} A questão não é SE termina, mas COMO termina.`;
  }
  
  // VITÓRIA NO FUTURO (Sol, Estrelas, Chave)
  else if (f === 'Sol' || f === 'Estrelas' || f === 'Chave') {
    narrativa = `Passado: ${p}.\nPresente: ${pr}.\nFuturo: ${f} — resolução favorável.\n\nDo que foi construído ao que está sendo vivido, o caminho aponta para ${f === 'Sol' ? 'vitória clara' : f === 'Estrelas' ? 'orientação divina' : 'solução definitiva'}. Ou se aproveita o momento favorável e se consolida, ou se desperdiça e ele passa. O destino oferece a porta — cabe atravessá-la.`;
  }
  
  // DESGASTE FUTURO (Ratos, Nuvens, Cobra)
  else if (f === 'Ratos' || f === 'Nuvens' || f === 'Cobra') {
    const processo = f === 'Ratos' ? 'corrosão' : f === 'Nuvens' ? 'confusão' : 'complicação';
    narrativa = `Passado: ${p}.\nPresente: ${pr}.\nFuturo: ${f} — ${processo} progressiva.\n\nO caminho não se fortalece — se fragiliza. ${f === 'Ratos' ? 'Os Ratos não atacam de frente — eles roem fundações aos poucos.' : f === 'Nuvens' ? 'As Nuvens não bloqueiam — elas obscurecem até que nada se enxerga.' : 'A Cobra não confronta — ela complica até que o simples vire impossível.'} Ou se age antes da deterioração total, ou o desgaste prevalece.`;
  }
  
  // TRANSFORMAÇÃO (Cegonha)
  else if (pr === 'Cegonha' || f === 'Cegonha') {
    narrativa = `Passado: ${p}.\n${pr === 'Cegonha' ? 'Presente: Transformação ativa.' : 'Presente: ' + pr + '.'}\nFuturo: ${f}.\n\nMudança não é promessa — é movimento em curso. ${pr === 'Cegonha' ? 'O que está se transformando agora determina o ' + f + ' futuro.' : 'O caminho leva à transformação.'} Ou se surfam as mudanças e se adapta, ou se é arrastado por elas. Transformação não pede licença.`;
  }
  
  // BLOQUEIO PRESENTE (não necessariamente fim)
  else if (pr === 'Montanha' || pr === 'Âncora' || pr === 'Caixão') {
    narrativa = `Passado: ${p}.\nPresente: ${pr} — bloqueio ou peso.\nFuturo: ${f}.\n\nO presente está travado. ${pr === 'Montanha' ? 'Montanha não se move' : pr === 'Âncora' ? 'Âncora prende' : 'Caixão fecha'} — o que está parado define o que virá. Ou se rompe o bloqueio e ${f} vem como libertação, ou o bloqueio permanece e ${f} vem como consequência da imobilidade.`;
  }
  
  // PODER (Urso)
  else if (f === 'Urso') {
    narrativa = `Passado: ${p}.\nPresente: ${pr}.\nFuturo: Urso — domínio.\n\nO poder não se pede — se estabelece. Do presente ao futuro, a força se consolida. Ou se assume o domínio ativamente, ou outro assume. Autoridade prevalece — questão é de quem.`;
  }
  
  // ESCOLHA (Caminhos)
  else if (f === 'Caminhos' || pr === 'Caminhos') {
    narrativa = `Passado: ${p}.\n${pr === 'Caminhos' ? 'Presente: Bifurcação ativa.' : 'Presente: ' + pr + '.'}\nFuturo: ${f}.\n\n${pr === 'Caminhos' ? 'A encruzilhada está aqui.' : 'A bifurcação se aproxima.'} Quando os Caminhos aparecem, não há destino único — há múltiplas possibilidades. Cada rota leva a um ${f} diferente. Não há caminho errado, mas cada um tem seu destino próprio.`;
  }
  
  // AMOR/SENTIMENTO (Coração)
  else if (f === 'Coração' || pr === 'Coração') {
    narrativa = `Passado: ${p}.\n${pr === 'Coração' ? 'Presente: Amor ativo.' : 'Presente: ' + pr + '.'}\nFuturo: ${f}.\n\n${pr === 'Coração' ? 'Sentimento presente conduz ao futuro.' : 'Caminho leva ao sentimento.'} Amor não é racional — é força que move. Ou se segue a emoção e ela guia, ou se resiste e o afeto se perde. Coração define rota mais que lógica.`;
  }
  
  // PADRÃO GENÉRICO ARQUETÍPICO
  else {
    const energiaP = categorizeCard(p);
    const energiaPr = categorizeCard(pr);
    const energiaF = categorizeCard(f);
    
    // Trajetória ascendente
    if (energiaP === 'negativa' && energiaF === 'positiva') {
      narrativa = `Passado difícil (${p}) leva a futuro favorável (${f}). Trajetória ascendente. Do peso à leveza. Ou se sustenta a melhora, ou se retrocede. Tendência é evolução.`;
    }
    // Trajetória descendente
    else if (energiaP === 'positiva' && energiaF === 'negativa') {
      narrativa = `Passado favorável (${p}) aponta futuro difícil (${f}). Trajetória descendente. Do brilho ao peso. Ou se reverte antes, ou a deterioração completa. Tendência é desgaste.`;
    }
    // Futuro difícil
    else if (energiaF === 'negativa') {
      narrativa = `${p} moldou o caminho. ${pr} define agora. ${f} se aproxima trazendo dificuldade. Ou se prepara e minimiza dano, ou se é pego despreparado. O problema vem — questão é como se recebe.`;
    }
    // Futuro favorável
    else if (energiaF === 'positiva') {
      narrativa = `${p} trouxe o que trouxe. ${pr} sustenta o momento. ${f} se aproxima trazendo resolução. Ou se aproveita e maximiza ganho, ou se desperdiça e perde. A porta abre — questão é atravessá-la.`;
    }
    // Neutro
    else {
      narrativa = `Do ${p} ao ${pr}, chegando em ${f}. Cada carta alimenta a próxima — passado molda presente, presente gera futuro. Não são três eventos separados — é um único fluxo em três estágios. O movimento é contínuo.`;
    }
  }
  
  return narrativa;
}

// Função auxiliar para categorizar energia da carta
function categorizeCard(cardName) {
  const positivas = ['Sol', 'Estrelas', 'Chave', 'Buquê', 'Coração', 'Anel', 'Trevo', 'Casa'];
  const negativas = ['Caixão', 'Foice', 'Cobra', 'Montanha', 'Ratos', 'Nuvens', 'Chicote', 'Cruz', 'Âncora', 'Torre'];
  
  if (positivas.includes(cardName)) return 'positiva';
  if (negativas.includes(cardName)) return 'negativa';
  return 'neutra';
}

// Gerar veredito NARRATIVO com possibilidades (não sentença fechada)
function gerarVeredito(passado, presente, futuro) {
  const f = futuro.greekName;
  const pr = presente.greekName;
  const p = passado.greekName;
  
  // Vereditos NARRATIVOS por carta final
  const vereditos = {
    'Sol': `A vitória se aproxima.\nOu se aproveita o brilho, ou ele passa.\nTendência é triunfo.`,
    
    'Estrelas': `Orientação divina guia.\nOu se segue a luz, ou se perde no escuro.\nDestino favorece quem confia.`,
    
    'Chave': `A solução está próxima.\nOu se gira a chave e abre, ou ela enferruja trancada.\nResposta existe — questão é alcançá-la.`,
    
    'Caixão': `O ciclo se encerra.\nOu se aceita o fim e se liberta, ou se resiste e morre junto.\nNão há como reviver o que morreu.`,
    
    'Foice': `Corte se aproxima.\nOu se corta o que está doente, ou se é cortado pela pressão.\nA lâmina não negocia — só separa.`,
    
    'Ratos': `Desgaste cobra aos poucos.\nOu se protege antes da erosão total, ou tudo se consome.\nNão é queda súbita — é perda gradual.`,
    
    'Montanha': `Bloqueio permanece.\nOu se contorna a montanha, ou se para diante dela.\nObstáculo não cede — se adapta ou se desiste.`,
    
    'Cobra': `Complicação se aproxima.\nOu se navega a sinuosidade, ou se perde nela.\nCaminho não é reto — é tortuoso.`,
    
    'Nuvens': `Confusão obscurece.\nOu se espera a névoa passar, ou se age às cegas.\nClareza não vem rápido.`,
    
    'Cão': `Lealdade se mantém.\nOu se valoriza os aliados, ou se perde o apoio.\nProteção existe — questão é reconhecê-la.`,
    
    'Urso': `Poder se consolida.\nOu se assume o domínio, ou outro assume por você.\nForça prevalece — questão é de quem.`,
    
    'Coração': `Amor define.\nOu se segue o sentimento, ou se perde o afeto.\nEmoção guia mais que razão.`,
    
    'Anel': `Compromisso se aproxima.\nOu se firma o vínculo, ou se perde a aliança.\nPromessa será cobrada.`,
    
    'Casa': `Base se estabelece.\nOu se constrói raízes, ou se fica sem fundação.\nO que vier, fica — para bem ou mal.`,
    
    'Cavaleiro': `Mudança chega rápido.\nOu se surfam as notícias, ou se é engolido por elas.\nMovimento não espera permissão.`,
    
    'Jardim': `Exposição acontece.\nOu se usa o público a favor, ou se expõe vulnerabilidades.\nO privado se tornará visível.`,
    
    'Torre': `Isolamento se aproxima.\nOu se aceita a solidão como proteção, ou se sofre com ela.\nAfastamento é inevitável.`,
    
    'Chicote': `Conflito persiste.\nOu se enfrenta o embate, ou se é consumido por ele.\nDisputa não cessa sozinha.`,
    
    'Raposa': `Astúcia define.\nOu se joga o jogo, ou se é jogado.\nEstratégia vence força bruta.`,
    
    'Cegonha': `Transformação é real.\nOu se adapta ao novo, ou se é deixado no velho.\nMudança não espera consentimento.`,
    
    'Livro': `Segredo prevalece.\nOu se revela no momento certo, ou permanece oculto.\nConhecimento é poder — saber quando usar é sabedoria.`,
    
    'Lírios': `Paz se aproxima.\nOu se aceita a serenidade, ou se rejeita por inquietação.\nHarmonia existe para quem a permite.`,
    
    'Lua': `Reconhecimento vem.\nOu se abraça o brilho, ou se esconde dele.\nFama é faca de dois gumes.`,
    
    'Peixes': `Abundância se manifesta.\nOu se recebe com gratidão, ou se desperdiça.\nProsperidade vem para quem está pronto.`,
    
    'Âncora': `${pr === 'Montanha' ? 'Peso dobrado — bloqueio + trava.\nOu se remove ambos, ou nada se move.\nImobilidade total.' : 'Firmeza se estabelece.\nOu se valoriza a estabilidade, ou se frustra com a lentidão.\nO ancorado não flutua.'}`,
    
    'Cruz': `Fardo permanece.\nOu se carrega com propósito, ou se é esmagado por ele.\nSacrifício será cobrado.`,
    
    'Trevo': `Sorte breve aparece.\nOu se aproveita o momento, ou ele passa.\nOportunidade é rápida — blink e perde.`,
    
    'Navio': `${pr === 'Cão' ? 'Lealdade não impede separação física.\nOu a distância fortalece, ou quebra.\nViagem acontece mesmo com aliados.' : 'Distância se estabelece.\nOu se navega a jornada, ou se fica na margem.\nMovimento é inevitável.'}`,
    
    'Buquê': `Beleza chega.\nOu se recebe a dádiva, ou se ignora.\nO que é bom vem — questão é reconhecer.`,
    
    'Criança': `Novo começa.\nOu se nutre o início, ou se mata no nascimento.\nPequeno pode virar grande — se for cuidado.`,
    
    'Pássaros': `Vozes se multiplicam.\nOu se controla a narrativa, ou se perde o controle.\nO que é dito se espalha — bem ou mal.`,
    
    'Caminhos': `Bifurcação se impõe.\nCada rota leva a destino diferente.\nNão há caminho errado — há destinos distintos.`,
    
    'Carta': `Mensagem chega.\nOu se prepara para a notícia, ou se é pego de surpresa.\nComunicação altera tudo.`,
    
    'Homem': `Figura masculina define.\nOu se alia com essa presença, ou se confronta.\nInfluência é real — questão é como se relaciona.`,
    
    'Mulher': `Figura feminina define.\nOu se alia com essa presença, ou se confronta.\nInfluência é real — questão é como se relaciona.`,
    
    'Árvore': `${pr === 'Ratos' ? 'Saúde será testada.\nOu se cuida antes da corrosão, ou se paga depois.\nTempo não perdoa negligência.' : 'Tempo prevalece.\nOu se tem paciência, ou se frustra.\nCrescimento é lento mas inevitável.'}`,
  };
  
  let veredito = vereditos[f];
  
  if (!veredito) {
    veredito = `${f} define o desfecho.\nOu se alinha com essa energia, ou se resiste a ela.\nTendência está dada — ação determina resultado.`;
  }
  
  return veredito;
}

// =============================================================================
// 🎙️ ANÁLISE DE ÁUDIO - SISTEMA 4 CARTAS
// =============================================================================

app.post('/analyzeAudioWith4Cards', (req, res) => {
  console.log('✅ /analyzeAudioWith4Cards chamado');
  
  const { question, audioValues, deckType, zodiacSign } = req.body;
  
  if (!question || !audioValues || !Array.isArray(audioValues) || audioValues.length === 0) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  
  console.log(`🎙️ Analisando áudio: ${audioValues.length} valores`);
  console.log(`Valores: ${audioValues.join(', ')}`);
  
  const selectedDeck = deckType || 'CIGANO';
  
  // CARTA 1: SOMA TOTAL = TEOR GERAL DO ÁUDIO
  const totalSum = audioValues.reduce((sum, val) => sum + val, 0);
  const card1Number = reduceToBase(totalSum);
  const card1 = getCardFromDeck(card1Number, selectedDeck);
  
  console.log(`🃏 CARTA 1 (Teor Total): Soma ${totalSum} → Carta ${card1Number} - ${card1.name}`);
  
  // Dividir áudio em 3 partes
  const third = Math.floor(audioValues.length / 3);
  const inicio = audioValues.slice(0, third);
  const meio = audioValues.slice(third, third * 2);
  const final = audioValues.slice(third * 2);
  
  // CARTA 2: INÍCIO = IDEIA INICIAL
  const sumInicio = inicio.reduce((sum, val) => sum + val, 0);
  const card2Number = reduceToBase(sumInicio);
  const card2 = getCardFromDeck(card2Number, selectedDeck);
  
  console.log(`🃏 CARTA 2 (Início): Soma ${sumInicio} → Carta ${card2Number} - ${card2.name}`);
  
  // CARTA 3: MEIO = DESENVOLVIMENTO
  const sumMeio = meio.reduce((sum, val) => sum + val, 0);
  const card3Number = reduceToBase(sumMeio);
  const card3 = getCardFromDeck(card3Number, selectedDeck);
  
  console.log(`🃏 CARTA 3 (Meio): Soma ${sumMeio} → Carta ${card3Number} - ${card3.name}`);
  
  // CARTA 4: FINAL = DESFECHO
  const sumFinal = final.reduce((sum, val) => sum + val, 0);
  const card4Number = reduceToBase(sumFinal);
  const card4 = getCardFromDeck(card4Number, selectedDeck);
  
  console.log(`🃏 CARTA 4 (Final): Soma ${sumFinal} → Carta ${card4Number} - ${card4.name}`);
  
  // Interpretação
  let interpretationPrefix = '';
  if (zodiacSign) {
    const communicationStyle = getZodiacCommunicationStyle(zodiacSign);
    interpretationPrefix = `${getZodiacEmoji(zodiacSign)} Para ${zodiacSign}: ${communicationStyle}\n\n`;
  }
  
  const interpretation = 
    `${interpretationPrefix}🎙️ ANÁLISE DE ÁUDIO\n\n` +
    `"${question}"\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🃏 CARTA 1 - TEOR GERAL DO ÁUDIO:\n` +
    `${card1.symbol} #${card1Number} - ${card1.name}\n` +
    `${card1.meaning}\n` +
    `Representa o tom geral de toda a conversa.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🃏 CARTA 2 - INÍCIO DA CONVERSA:\n` +
    `${card2.symbol} #${card2Number} - ${card2.name}\n` +
    `${card2.meaning}\n` +
    `A ideia inicial, o que motivou a falar.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🃏 CARTA 3 - DESENVOLVIMENTO DA IDEIA:\n` +
    `${card3.symbol} #${card3Number} - ${card3.name}\n` +
    `${card3.meaning}\n` +
    `O meio da conversa, como a ideia se desenvolveu.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🃏 CARTA 4 - DESFECHO:\n` +
    `${card4.symbol} #${card4Number} - ${card4.name}\n` +
    `${card4.meaning}\n` +
    `A conclusão, onde a conversa chegou.`;
  
  res.json({
    question: question,
    audioValueCount: audioValues.length,
    deckType: selectedDeck,
    zodiacSign: zodiacSign || null,
    cards: [
      {
        position: 1,
        title: 'Teor Geral do Áudio',
        number: card1Number,
        name: card1.name,
        symbol: card1.symbol,
        meaning: card1.meaning,
        calculation: `Soma total: ${totalSum} → ${card1Number}`
      },
      {
        position: 2,
        title: 'Início da Conversa',
        number: card2Number,
        name: card2.name,
        symbol: card2.symbol,
        meaning: card2.meaning,
        calculation: `Início (${inicio.length} valores): ${sumInicio} → ${card2Number}`
      },
      {
        position: 3,
        title: 'Desenvolvimento da Ideia',
        number: card3Number,
        name: card3.name,
        symbol: card3.symbol,
        meaning: card3.meaning,
        calculation: `Meio (${meio.length} valores): ${sumMeio} → ${card3Number}`
      },
      {
        position: 4,
        title: 'Desfecho',
        number: card4Number,
        name: card4.name,
        symbol: card4.symbol,
        meaning: card4.meaning,
        calculation: `Final (${final.length} valores): ${sumFinal} → ${card4Number}`
      }
    ],
    interpretation: interpretation,
    timestamp: Date.now()
  });
  
  console.log('✅ Análise de 4 cartas enviada');
});

app.post('/oracleConsult', (req, res) => {
  console.log('✅ /oracleConsult chamado (sem imagem)');
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question required' });
  }
  
  const hash1 = question.length % 36 + 1;
  const hash2 = question.charCodeAt(0) % 36 + 1;
  const hash3 = question.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0) % 36 + 1;
  const hash4 = question.split('').reduce((sum, c, i) => sum + c.charCodeAt(0) * (i + 1), 0) % 36 + 1;
  
  const cards = [hash1, hash2, hash3, hash4].map(num => {
    const card = getCardFromDeck(num, 'CIGANO');
    return {
      symbol: card.symbol,
      codedName: `Carta ${num}: ${card.name}`,
      greekName: card.name,
      meaning: card.meaning
    };
  });
  
  res.json({
    level: 3,
    bases: cards,
    interpretation: 'As energias revelam uma pergunta sobre tendências. O caminho está claro.',
    timestamp: Date.now()
  });
});

// =============================================================================
// ✅ ENDPOINT COM 6 CARTAS PARA ANÁLISE DE IMAGEM
// =============================================================================
app.post('/oracleConsultWithImage', (req, res) => {
  console.log('✅ /oracleConsultWithImage chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, rgbValues, aiContext } = req.body;
  
  if (!question || !rgbValues) {
    console.log('❌ Dados faltando!');
    return res.status(400).json({ error: 'Missing data' });
  }
  
  console.log(`RGB: R=${rgbValues.r}, G=${rgbValues.g}, B=${rgbValues.b}`);
  
  // Detecta se tem análise facial
  const hasFaceAnalysis = aiContext && aiContext.faceCount > 0;
  const isCouple = hasFaceAnalysis && aiContext.faceCount === 2;
  
  if (hasFaceAnalysis) {
    console.log(`👤 Análise facial: ${aiContext.faceCount} pessoa(s)`);
    console.log(`😊 Emoção detectada: ${aiContext.person1Emotion}`);
    console.log(`🧠 Estado interno: ${aiContext.internal1State}`);
  }
  
  // ✅ GERAR 6 CARTAS
  const redCard = reduceToBase(rgbValues.r);
  const greenCard = reduceToBase(rgbValues.g);
  const blueCard = reduceToBase(rgbValues.b);
  
  // Cartas adicionais baseadas em combinações RGB
  const card4 = reduceToBase(rgbValues.r + rgbValues.g);
  const card5 = reduceToBase(rgbValues.g + rgbValues.b);
  const card6 = reduceToBase(rgbValues.r + rgbValues.b);
  
  const cardNumbers = [redCard, greenCard, blueCard, card4, card5, card6];
  const sources = [
    'Vermelho (Antes da foto)',
    'Verde (Motivo de tirar)',
    'Azul (Quis transmitir)',
    'R+G (Pessoas entenderam)',
    'G+B (Acha que pensaram)',
    'R+B (Depois da foto)'
  ];
  
  const cards = cardNumbers.map((num, idx) => {
    const card = getCardFromDeck(num, 'CIGANO');
    return {
      symbol: card.symbol,
      greekName: card.name,
      meaning: card.meaning,
      source: sources[idx],
      calculation: `Carta ${num}`
    };
  });
  
  // ✅ MONTAR INTERPRETAÇÃO COM 6 CARTAS
  let interpretation = `📸 **A CENA:**\n`;
  
  if (hasFaceAnalysis) {
    if (isCouple) {
      interpretation += `Casal detectado:\n`;
      interpretation += `• Pessoa 1: ${aiContext.person1Emotion} (${aiContext.internal1State})\n`;
      interpretation += `• Pessoa 2: ${aiContext.person2Emotion || 'detectado'} (${aiContext.internal2State || 'analisando'})\n`;
      interpretation += `A dinâmica emocional entre vocês revelada pelas cartas.\n\n`;
    } else {
      interpretation += `Uma pessoa ${aiContext.person1Emotion}, estado interno ${aiContext.internal1State}.\n`;
      interpretation += `A foto parece ${aiContext.person1Emotion}... mas a alma está em ${aiContext.internal1State}.\n\n`;
    }
  } else {
    interpretation += `Imagem carregada. As 6 cartas revelam a energia invisível por trás da foto.\n\n`;
  }
  
  interpretation += `🔹 **CARTA 1 — O que estava fazendo antes da foto:** ${cards[0].symbol} ${cards[0].greekName}\n`;
  interpretation += `${cards[0].meaning}\n\n`;
  
  interpretation += `Interpretação:\n`;
  interpretation += `Antes do clique, a energia era de movimento e preparação.\n`;
  interpretation += `O ${cards[0].greekName} revela: "${cards[0].meaning}"\n\n`;
  
  interpretation += `🔹 **CARTA 2 — O que fez tirar a foto:** ${cards[1].symbol} ${cards[1].greekName}\n`;
  interpretation += `${cards[1].meaning}\n\n`;
  
  interpretation += `Interpretação:\n`;
  interpretation += `O impulso de capturar esse momento veio de dentro.\n`;
  interpretation += `O ${cards[1].greekName} mostra: desejo de registrar, de guardar, de marcar.\n\n`;
  
  interpretation += `🔹 **CARTA 3 — O que quis transmitir:** ${cards[2].symbol} ${cards[2].greekName}\n`;
  interpretation += `${cards[2].meaning}\n\n`;
  
  interpretation += `Interpretação:\n`;
  interpretation += `A mensagem que quis passar para o mundo.\n`;
  interpretation += `O ${cards[2].greekName} revela a imagem construída.\n\n`;
  
  interpretation += `🔹 **CARTA 4 — O que as pessoas entenderam:** ${cards[3].symbol} ${cards[3].greekName}\n`;
  interpretation += `${cards[3].meaning}\n\n`;
  
  interpretation += `Interpretação:\n`;
  interpretation += `Como a energia foi absorvida por quem viu.\n`;
  interpretation += `O ${cards[3].greekName} mostra a leitura coletiva.\n\n`;
  
  interpretation += `🔹 **CARTA 5 — O que acredita que pensaram:** ${cards[4].symbol} ${cards[4].greekName}\n`;
  interpretation += `${cards[4].meaning}\n\n`;
  
  interpretation += `Interpretação:\n`;
  interpretation += `Sua expectativa, seus medos, sua vaidade ou insegurança.\n`;
  interpretation += `O ${cards[4].greekName} revela como imagina que foi julgado.\n\n`;
  
  interpretation += `🔹 **CARTA 6 — O que fez depois da foto:** ${cards[5].symbol} ${cards[5].greekName}\n`;
  interpretation += `${cards[5].meaning}\n\n`;
  
  interpretation += `Interpretação:\n`;
  interpretation += `O desdobramento energético do momento.\n`;
  interpretation += `O ${cards[5].greekName} mostra: satisfação, arrependimento ou vazio.\n\n`;
  
  interpretation += `💬 **Palavra da Vovó (com ternura realista):**\n`;
  interpretation += `"Filho(a), essa foto não é só imagem.\n`;
  interpretation += `É alma capturada num instante.\n\n`;
  
  interpretation += `O ${cards[0].greekName} preparou.\n`;
  interpretation += `O ${cards[1].greekName} impulsionou.\n`;
  interpretation += `O ${cards[2].greekName} construiu.\n`;
  interpretation += `O ${cards[3].greekName} interpretou.\n`;
  interpretation += `O ${cards[4].greekName} imaginou.\n`;
  interpretation += `E o ${cards[5].greekName}?\n`;
  interpretation += `Mostrou o que veio depois.\n\n`;
  
  if (hasFaceAnalysis) {
    interpretation += `E quem vê só a expressão ${aiContext.person1Emotion}...\n`;
    interpretation += `Não vê o ${aiContext.internal1State} que sustenta o silêncio."\n\n`;
  } else {
    interpretation += `E quem vê só a foto...\n`;
    interpretation += `Não vê a história que ela guarda."\n\n`;
  }
  
  interpretation += `✅ **Resumo simbólico:**\n`;
  interpretation += `| Momento | Energia | Verdade |\n`;
  interpretation += `|---------|---------|----------|\n`;
  interpretation += `| Antes | ${cards[0].greekName} | ${cards[0].meaning} |\n`;
  interpretation += `| Durante (motivo) | ${cards[1].greekName} | ${cards[1].meaning} |\n`;
  interpretation += `| Durante (transmitir) | ${cards[2].greekName} | ${cards[2].meaning} |\n`;
  interpretation += `| Leitura coletiva | ${cards[3].greekName} | ${cards[3].meaning} |\n`;
  interpretation += `| Expectativa | ${cards[4].greekName} | ${cards[4].meaning} |\n`;
  interpretation += `| Depois | ${cards[5].greekName} | ${cards[5].meaning} |\n\n`;
  
  interpretation += `🌙 **Conclusão final:**\n`;
  interpretation += `Não julgue pela foto.\n`;
  interpretation += `Julgue pela alma que ela carrega.\n\n`;
  
  if (hasFaceAnalysis) {
    interpretation += `E quem lê cartas no rosto...\n`;
    interpretation += `Vê o que os olhos escondem.\n\n`;
  }
  
  interpretation += `Se quiser saber mais sobre o que a foto revela, ou se há outras cartas guiando essa história, é só perguntar.\n`;
  interpretation += `A Vovó já guardou as cartas...\n`;
  interpretation += `Não pra esconder —\n`;
  interpretation += `Pra revelar o que merece ser visto. 🖤`;
  
  const response = {
    rgbValues: {
      r: rgbValues.r,
      g: rgbValues.g,
      b: rgbValues.b
    },
    cardNumbers: {
      red: redCard,
      green: greenCard,
      blue: blueCard,
      card4: card4,
      card5: card5,
      card6: card6
    },
    cards: cards,
    colorAnalysis: {
      dominantColor: 'Análise de imagem (6 cartas)',
      emotionalState: hasFaceAnalysis ? aiContext.person1Emotion : 'Detectado via RGB',
      energy: hasFaceAnalysis ? `${aiContext.faceCount} pessoa(s) - ${aiContext.internal1State}` : 'Energia da imagem'
    },
    questionLevel: 6,
    interpretation: interpretation,
    faceAnalysis: hasFaceAnalysis ? {
      faceCount: aiContext.faceCount,
      person1: aiContext.person1Emotion,
      internal1: aiContext.internal1State
    } : null,
    timestamp: Date.now()
  };
  
  console.log('✅ Enviando resposta com 6 cartas para análise de imagem');
  res.json(response);
});

// =============================================================================
// 📝 ANÁLISE DE FRASES COM DETECÇÃO DE COERÊNCIA ENERGÉTICA
// =============================================================================

// Banco de palavras-chave (Análise Superficial)
const POSITIVE_KEYWORDS = {
  'feliz': { sentiment: 'positivo', category: 'elogio', intensity: 0.8 },
  'alegria': { sentiment: 'positivo', category: 'elogio', intensity: 0.9 },
  'parabéns': { sentiment: 'positivo', category: 'elogio', intensity: 0.7 },
  'sucesso': { sentiment: 'positivo', category: 'elogio', intensity: 0.8 },
  'ótimo': { sentiment: 'positivo', category: 'elogio', intensity: 0.7 },
  'maravilhoso': { sentiment: 'positivo', category: 'elogio', intensity: 0.9 },
  'amo': { sentiment: 'positivo', category: 'amor', intensity: 1.0 },
  'amor': { sentiment: 'positivo', category: 'amor', intensity: 1.0 },
  'carinho': { sentiment: 'positivo', category: 'amor', intensity: 0.8 },
  'querido': { sentiment: 'positivo', category: 'amor', intensity: 0.7 },
  'obrigado': { sentiment: 'positivo', category: 'gratidao', intensity: 0.8 },
  'grato': { sentiment: 'positivo', category: 'gratidao', intensity: 0.8 },
  'agradeço': { sentiment: 'positivo', category: 'gratidao', intensity: 0.9 },
  'paz': { sentiment: 'positivo', category: 'bem-estar', intensity: 0.8 },
  'luz': { sentiment: 'positivo', category: 'bem-estar', intensity: 0.7 },
  'bênção': { sentiment: 'positivo', category: 'bem-estar', intensity: 0.9 },
  'bem': { sentiment: 'positivo', category: 'bem-estar', intensity: 0.6 }
};

const NEGATIVE_KEYWORDS = {
  'ódio': { sentiment: 'negativo', category: 'raiva', intensity: 1.0 },
  'raiva': { sentiment: 'negativo', category: 'raiva', intensity: 0.9 },
  'inveja': { sentiment: 'negativo', category: 'raiva', intensity: 0.8 },
  'ciúme': { sentiment: 'negativo', category: 'raiva', intensity: 0.8 },
  'triste': { sentiment: 'negativo', category: 'tristeza', intensity: 0.8 },
  'tristeza': { sentiment: 'negativo', category: 'tristeza', intensity: 0.8 },
  'chorar': { sentiment: 'negativo', category: 'tristeza', intensity: 0.7 },
  'choro': { sentiment: 'negativo', category: 'tristeza', intensity: 0.7 },
  'dor': { sentiment: 'negativo', category: 'tristeza', intensity: 0.9 },
  'sofrer': { sentiment: 'negativo', category: 'tristeza', intensity: 0.9 },
  'medo': { sentiment: 'negativo', category: 'medo', intensity: 0.8 },
  'pavor': { sentiment: 'negativo', category: 'medo', intensity: 0.9 },
  'terror': { sentiment: 'negativo', category: 'medo', intensity: 1.0 },
  'assustado': { sentiment: 'negativo', category: 'medo', intensity: 0.7 },
  'rejeição': { sentiment: 'negativo', category: 'rejeicao', intensity: 0.9 },
  'abandono': { sentiment: 'negativo', category: 'rejeicao', intensity: 0.9 },
  'sozinho': { sentiment: 'negativo', category: 'rejeicao', intensity: 0.7 }
};

// Polaridade das cartas
const CARD_POLARITY_MAP = {
  1: { polarity: 'positiva', tone: 'movimento' },
  2: { polarity: 'positiva', tone: 'sorte' },
  3: { polarity: 'neutra', tone: 'viagem' },
  4: { polarity: 'positiva', tone: 'seguranca' },
  5: { polarity: 'positiva', tone: 'saude' },
  6: { polarity: 'negativa', tone: 'confusao' },
  7: { polarity: 'negativa', tone: 'traicao' },
  8: { polarity: 'negativa', tone: 'fim' },
  9: { polarity: 'positiva', tone: 'presente' },
  10: { polarity: 'neutra', tone: 'corte' },
  11: { polarity: 'negativa', tone: 'conflito' },
  12: { polarity: 'neutra', tone: 'conversa' },
  13: { polarity: 'positiva', tone: 'inicio' },
  14: { polarity: 'neutra', tone: 'astucia' },
  15: { polarity: 'positiva', tone: 'forca' },
  16: { polarity: 'positiva', tone: 'guia' },
  17: { polarity: 'positiva', tone: 'mudanca' },
  18: { polarity: 'positiva', tone: 'amizade' },
  19: { polarity: 'neutra', tone: 'isolamento' },
  20: { polarity: 'positiva', tone: 'social' },
  21: { polarity: 'negativa', tone: 'obstaculo' },
  22: { polarity: 'neutra', tone: 'escolha' },
  23: { polarity: 'negativa', tone: 'perda' },
  24: { polarity: 'positiva', tone: 'amor' },
  25: { polarity: 'positiva', tone: 'compromisso' },
  26: { polarity: 'neutra', tone: 'segredo' },
  27: { polarity: 'neutra', tone: 'mensagem' },
  28: { polarity: 'neutra', tone: 'masculino' },
  29: { polarity: 'neutra', tone: 'feminino' },
  30: { polarity: 'positiva', tone: 'paz' },
  31: { polarity: 'positiva', tone: 'sucesso' },
  32: { polarity: 'neutra', tone: 'emocao' },
  33: { polarity: 'positiva', tone: 'solucao' },
  34: { polarity: 'positiva', tone: 'dinheiro' },
  35: { polarity: 'positiva', tone: 'estabilidade' },
  36: { polarity: 'negativa', tone: 'fardo' }
};

function detectPunctuation(text) {
  const trimmed = text.trim();
  const lastChar = trimmed[trimmed.length - 1];
  
  if (lastChar === '!') return { hasPunctuation: true, type: 'exclamation' };
  if (lastChar === '?') return { hasPunctuation: true, type: 'question' };
  if (lastChar === '.') return { hasPunctuation: true, type: 'period' };
  if (trimmed.endsWith('...') || trimmed.endsWith('…')) return { hasPunctuation: true, type: 'ellipsis' };
  
  return { hasPunctuation: false, type: null };
}

function analyzeSurface(frase) {
  const words = frase.toLowerCase().split(/\s+/);
  
  let positiveScore = 0;
  let negativeScore = 0;
  let detectedKeywords = [];
  
  for (let word of words) {
    if (POSITIVE_KEYWORDS[word]) {
      const kw = POSITIVE_KEYWORDS[word];
      positiveScore += kw.intensity;
      detectedKeywords.push({ word, ...kw });
    }
    
    if (NEGATIVE_KEYWORDS[word]) {
      const kw = NEGATIVE_KEYWORDS[word];
      negativeScore += kw.intensity;
      detectedKeywords.push({ word, ...kw });
    }
  }
  
  let tone;
  if (positiveScore > negativeScore * 1.5) {
    tone = 'positivo';
  } else if (negativeScore > positiveScore * 1.5) {
    tone = 'negativo';
  } else if (positiveScore > 0 && negativeScore > 0) {
    tone = 'misto';
  } else {
    tone = 'neutro';
  }
  
  return {
    keywords: detectedKeywords,
    positiveScore,
    negativeScore,
    tone
  };
}

function analyzeEnergy(frase) {
  const limpo = frase
    .replace(/[.!?…,;:\"'\-]/g, '')
    .replace(/\s+/g, '')
    .toUpperCase();
  
  const arithmiMap = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };
  
  let soma = 0;
  for (let letra of limpo) {
    soma += arithmiMap[letra] || 0;
  }
  
  const cartaNumero = reduceToBase(soma);
  const carta = getCardFromDeck(cartaNumero, 'CIGANO');
  const polarityData = CARD_POLARITY_MAP[cartaNumero] || { polarity: 'neutra', tone: 'desconhecido' };
  
  return {
    essence: limpo,
    totalSum: soma,
    cardNumber: cartaNumero,
    cardName: carta.name,
    polarity: polarityData.polarity,
    tone: polarityData.tone,
    hidden: carta.meaning
  };
}

function compareAnalyses(surface, energy) {
  const surfaceTone = surface.tone;
  const energyPolarity = energy.polarity;
  
  let coherence;
  let warning;
  
  if (surfaceTone === 'positivo' && energyPolarity === 'positiva') {
    coherence = 'COERENTE';
    warning = null;
  } else if (surfaceTone === 'negativo' && energyPolarity === 'negativa') {
    coherence = 'COERENTE';
    warning = null;
  } else if (surfaceTone === 'neutro' || energyPolarity === 'neutra') {
    coherence = 'PARCIAL';
    warning = 'A energia é neutra ou ambígua';
  } else if (surfaceTone === 'misto') {
    coherence = 'PARCIAL';
    warning = 'Sentimentos contraditórios detectados';
  } else {
    coherence = 'INCOERENTE';
    warning = 'ALERTA: A frase NÃO está energéticamente coerente!';
  }
  
  return { status: coherence, surfaceTone, energyPolarity, warning };
}

function generateVovoWisdom(frase, surface, energy, coherence) {
  if (coherence.status === 'COERENTE') {
    return `"Filho(a), sua frase é verdadeira.\n\nVocê disse: "${frase}"\nE a carta ${energy.cardName} confirma:\nNão há máscaras. Não há fingimento.\nO que você sente, você falou.\n\nE isso, meu filho(a), é coragem.\nÉ integridade.\n\nContinue assim - falando o que o coração dita."`;
  }
  
  if (coherence.status === 'INCOERENTE') {
    let wisdom = `"Filho(a), a ${energy.cardName} não mente.\n\n`;
    wisdom += `Você disse: "${frase}"\n`;
    wisdom += `Mas sua alma revelou: ${energy.hidden}\n\n`;
    
    if (surface.tone === 'positivo' && energy.polarity === 'negativa') {
      wisdom += `Palavras positivas... mas energia pesada.\n`;
      wisdom += `Você tentou disfarçar o que sente.\n`;
      wisdom += `Talvez por educação. Talvez por medo.\n`;
      wisdom += `Mas a ${energy.cardName} mostra o que você esconde.\n\n`;
      wisdom += `Não se culpe - somos assim.\n`;
      wisdom += `Mas saiba: quem você engana não é o outro.\n`;
      wisdom += `É você mesmo."\n`;
    } else if (surface.tone === 'negativo' && energy.polarity === 'positiva') {
      wisdom += `Palavras duras... mas alma suave.\n`;
      wisdom += `Você reclama, mas por dentro ainda tem esperança.\n`;
      wisdom += `A ${energy.cardName} revela: você não desistiu.\n\n`;
      wisdom += `Às vezes reclamamos pra não chorar.\n`;
      wisdom += `Às vezes brigamos pra não admitir que ainda amamos.\n\n`;
      wisdom += `Sua frase parece raiva,\n`;
      wisdom += `mas sua alma ainda acredita."\n`;
    } else {
      wisdom += `Há algo não dito nessa frase.\n`;
      wisdom += `Algo que você sente mas não falou.\n\n`;
      wisdom += `A ${energy.cardName} pede: seja honesto.\n`;
      wisdom += `Primeiro com você.\n`;
      wisdom += `Depois com o mundo."\n`;
    }
    
    return wisdom;
  }
  
  return `"Filho(a), sua frase tem duas camadas.\n\nO que você disse: "${frase}"\nO que a ${energy.cardName} mostra: ${energy.hidden}\n\nNão é mentira. Não é verdade completa.\nÉ... complexo.\n\nE a vida é assim mesmo.\nNem tudo é preto ou branco.\n\nSó cuide pra complexidade não virar confusão.\nE pra dúvida não virar paralisia."`;
}

// =============================================================================
// 📝 ANÁLISE DE FRASE - SISTEMA 4 CARTAS
// =============================================================================

function calculateCardFromText(text) {
  const clean = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const letterValues = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };
  
  let sum = 0;
  for (let letter of clean) {
    sum += letterValues[letter] || 0;
  }
  
  while (sum > 36) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum === 0 ? 1 : sum;
}

function splitFraseInto4Parts(frase) {
  const words = frase.trim().split(/\s+/);
  const totalWords = words.length;
  
  if (totalWords <= 4) {
    return {
      parte1: words[0] || '',
      parte2: words[1] || words[0] || '',
      parte3: words[2] || words[0] || '',
      parte4: words[3] || words[0] || ''
    };
  }
  
  const wordsPerPart = Math.floor(totalWords / 4);
  const remainder = totalWords % 4;
  
  let idx = 0;
  const parte1 = words.slice(idx, idx + wordsPerPart + (remainder > 0 ? 1 : 0)).join(' ');
  idx += wordsPerPart + (remainder > 0 ? 1 : 0);
  
  const parte2 = words.slice(idx, idx + wordsPerPart + (remainder > 1 ? 1 : 0)).join(' ');
  idx += wordsPerPart + (remainder > 1 ? 1 : 0);
  
  const parte3 = words.slice(idx, idx + wordsPerPart + (remainder > 2 ? 1 : 0)).join(' ');
  idx += wordsPerPart + (remainder > 2 ? 1 : 0);
  
  const parte4 = words.slice(idx).join(' ');
  
  return { parte1, parte2, parte3, parte4 };
}

const CARD_POLARITY = {
  1: 'positiva', 2: 'positiva', 3: 'neutra', 4: 'positiva', 5: 'positiva',
  6: 'negativa', 7: 'negativa', 8: 'negativa', 9: 'positiva', 10: 'neutra',
  11: 'negativa', 12: 'neutra', 13: 'positiva', 14: 'neutra', 15: 'positiva',
  16: 'positiva', 17: 'positiva', 18: 'positiva', 19: 'neutra', 20: 'positiva',
  21: 'negativa', 22: 'neutra', 23: 'negativa', 24: 'positiva', 25: 'positiva',
  26: 'neutra', 27: 'neutra', 28: 'neutra', 29: 'neutra', 30: 'positiva',
  31: 'positiva', 32: 'neutra', 33: 'positiva', 34: 'positiva', 35: 'positiva',
  36: 'negativa'
};

function analyzeCoherenceSimple(frase, card1Polarity) {
  const positiveWords = ['feliz', 'amor', 'alegria', 'bom', 'ótimo', 'maravilhoso', 'bem', 'amo', 'gosto', 'adoro', 'obrigado'];
  const negativeWords = ['triste', 'raiva', 'ruim', 'mal', 'péssimo', 'ódio', 'medo', 'chato', 'horrível', 'desculpa'];
  
  const textLower = frase.toLowerCase();
  const hasPositive = positiveWords.some(word => textLower.includes(word));
  const hasNegative = negativeWords.some(word => textLower.includes(word));
  
  const frasePolarity = hasPositive ? 'positiva' : (hasNegative ? 'negativa' : 'neutra');
  
  let status, message;
  
  if (card1Polarity === 'neutra') {
    status = 'NEUTRA';
    message = 'A intenção real é neutra';
  } else if (frasePolarity === card1Polarity) {
    status = 'COERENTE';
    message = `Suas palavras ${frasePolarity}s combinam com sua intenção ${card1Polarity}`;
  } else {
    status = 'INCOERENTE';
    if (frasePolarity === 'positiva' && card1Polarity === 'negativa') {
      message = 'Você escreveu palavras positivas, mas sua intenção real é negativa';
    } else if (frasePolarity === 'negativa' && card1Polarity === 'positiva') {
      message = 'Você escreveu palavras negativas, mas sua intenção real é positiva';
    } else {
      message = 'Há diferença entre o que você escreveu e sua intenção real';
    }
  }
  
  return {
    status: status,
    message: message,
    frasePolarity: frasePolarity,
    card1Polarity: card1Polarity
  };
}

app.post('/analyzeFrase', async (req, res) => {
  console.log('✅ /analyzeFrase chamado');
  const { frase } = req.body;
  
  if (!frase || typeof frase !== 'string') {
    return res.status(400).json({ error: 'Frase inválida' });
  }
  
  console.log(`📝 Analisando: "${frase}"`);
  
  try {
    // 🤖 CHAMAR API HUGGING FACE
    let frasePolarity = 'neutra';
    let aiConfidence = 0;
    let usingAPI = false;
    
    try {
      console.log('🌐 Chamando API Hugging Face...');
      const apiResponse = await fetch(
        "https://router.huggingface.co/hf-inference/models/nlptown/bert-base-multilingual-uncased-sentiment",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN || ''}`
          },
          body: JSON.stringify({ inputs: frase })
        }
      );
      
      if (apiResponse.ok) {
        const apiResult = await apiResponse.json();
        console.log(`📦 Resposta da API:`, JSON.stringify(apiResult).substring(0, 200));
        
        const topResult = apiResult[0][0];
        
        // Mapear estrelas para polaridade
        if (topResult.label.includes('1') || topResult.label.includes('2')) {
          frasePolarity = 'negativa';
        } else if (topResult.label.includes('3')) {
          frasePolarity = 'neutra';
        } else {
          frasePolarity = 'positiva';
        }
        
        aiConfidence = (topResult.score * 100).toFixed(1);
        usingAPI = true;
        console.log(`✅ API: ${frasePolarity} (${aiConfidence}%)`);
      } else {
        const errorText = await apiResponse.text();
        console.log(`❌ API erro ${apiResponse.status}: ${errorText.substring(0, 100)}`);
      }
    } catch (apiError) {
      console.log('⚠️ API falhou:', apiError.message);
      const fallback = analyzeCoherenceSimple(frase, 'neutra');
      frasePolarity = fallback.frasePolarity;
    }
    
    // CARTAS
    const card1Number = calculateCardFromText(frase);
    const card1Data = getCardFromDeck(card1Number, 'CIGANO');
    const card1Polarity = CARD_POLARITY[card1Number] || 'neutra';
    
    const parts = splitFraseInto4Parts(frase);
    const card2Number = calculateCardFromText(parts.parte1);
    const card2Data = getCardFromDeck(card2Number, 'CIGANO');
    const card3Number = calculateCardFromText(parts.parte2 + parts.parte3);
    const card3Data = getCardFromDeck(card3Number, 'CIGANO');
    const card4Number = calculateCardFromText(parts.parte4);
    const card4Data = getCardFromDeck(card4Number, 'CIGANO');
    
    // COERÊNCIA
    let coherenceStatus, coherenceMessage;
    if (card1Polarity === 'neutra') {
      coherenceStatus = 'NEUTRA';
      coherenceMessage = 'Intenção neutra';
    } else if (frasePolarity === card1Polarity) {
      coherenceStatus = 'COERENTE';
      coherenceMessage = usingAPI 
        ? `Palavras ${frasePolarity}s combinam (IA: ${aiConfidence}%)`
        : `Palavras ${frasePolarity}s combinam`;
    } else {
      coherenceStatus = 'INCOERENTE';
      coherenceMessage = `Diferença entre escrito (${frasePolarity}) e intenção (${card1Polarity})`;
    }
    
    const iaSection = usingAPI 
      ? `🤖 ANÁLISE DE IA:\nSentimento: ${frasePolarity.toUpperCase()}\nConfiança: ${aiConfidence}%\nModelo: BERT Multilingual (API)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
      : '';
    
    const interpretation = 
      `📝 ANÁLISE DA FRASE\n\n"${frase}"\n\n${iaSection}` +
      `🃏 CARTA 1 - INTENÇÃO REAL:\n${card1Data.symbol} #${card1Number} - ${card1Data.name}\n${card1Data.meaning}\nEnergia: ${card1Polarity}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🃏 CARTA 2 - O QUE LEVOU A ESCREVER:\n${card2Data.symbol} #${card2Number} - ${card2Data.name}\n${card2Data.meaning}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🃏 CARTA 3 - SIGNIFICADO DA MENSAGEM:\n${card3Data.symbol} #${card3Number} - ${card3Data.name}\n${card3Data.meaning}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🃏 CARTA 4 - COMO FOI ENTENDIDO:\n${card4Data.symbol} #${card4Number} - ${card4Data.name}\n${card4Data.meaning}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `⚡ ANÁLISE DE COERÊNCIA:\n\nStatus: ${coherenceStatus}\n${coherenceMessage}`;
    
    const resp = {
      frase, cards: [
        {position:1,title:'Intenção Real',number:card1Number,name:card1Data.name,symbol:card1Data.symbol,meaning:card1Data.meaning,polarity:card1Polarity},
        {position:2,title:'Levou a escrever',number:card2Number,name:card2Data.name,symbol:card2Data.symbol,meaning:card2Data.meaning,polarity:CARD_POLARITY[card2Number]||'neutra'},
        {position:3,title:'Significado',number:card3Number,name:card3Data.name,symbol:card3Data.symbol,meaning:card3Data.meaning,polarity:CARD_POLARITY[card3Number]||'neutra'},
        {position:4,title:'Entendido',number:card4Number,name:card4Data.name,symbol:card4Data.symbol,meaning:card4Data.meaning,polarity:CARD_POLARITY[card4Number]||'neutra'}
      ],
      coherence: {status:coherenceStatus,message:coherenceMessage,frasePolarity,intentionPolarity:card1Polarity},
      interpretation, timestamp:Date.now()
    };
    if (usingAPI) resp.aiAnalysis = {sentiment:frasePolarity,confidence:aiConfidence,model:'BERT Multilingual (API)'};
    res.json(resp);
    console.log('✅ Análise enviada');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({error:'Erro',message:error.message});
  }
});


// =============================================================================
// ⚽ SISTEMA DE FUTEBOL - ORÁCULO DE JOGOS
// =============================================================================

// Mapa de polaridade e significado das cartas para futebol
const FOOTBALL_CARD_ENERGY = {
  1: { energy: 'criacao', risk: 'baixo', meaning: 'Movimento rápido, notícias favoráveis' },
  2: { energy: 'criacao', risk: 'baixo', meaning: 'Sorte momentânea, oportunidade breve' },
  3: { energy: 'neutral', risk: 'medio', meaning: 'Jogo de fora, viagem, distância' },
  4: { energy: 'criacao', risk: 'baixo', meaning: 'Segurança, base sólida' },
  5: { energy: 'criacao', risk: 'baixo', meaning: 'Saúde, força constante' },
  6: { energy: 'bloqueio', risk: 'alto', meaning: 'Confusão, incerteza, névoa' },
  7: { energy: 'bloqueio', risk: 'alto', meaning: 'Traição, rival perigoso' },
  8: { energy: 'bloqueio', risk: 'morrer_na_praia', meaning: '⚠️ FIM - Esforço sem conversão' },
  9: { energy: 'criacao', risk: 'baixo', meaning: 'Presente, alegria, vitória' },
  10: { energy: 'neutral', risk: 'medio', meaning: 'Corte súbito, decisão rápida' },
  11: { energy: 'bloqueio', risk: 'alto', meaning: 'Conflito, discussão, desgaste' },
  12: { energy: 'neutral', risk: 'medio', meaning: 'Conversa, negociação' },
  13: { energy: 'criacao', risk: 'baixo', meaning: 'Início favorável, novidade' },
  14: { energy: 'neutral', risk: 'medio', meaning: 'Astúcia, estratégia' },
  15: { energy: 'criacao', risk: 'baixo', meaning: 'Força, poder, domínio' },
  16: { energy: 'criacao', risk: 'baixo', meaning: 'Orientação divina, caminho claro' },
  17: { energy: 'virada', risk: 'baixo', meaning: 'Mudança positiva, reação' },
  18: { energy: 'criacao', risk: 'baixo', meaning: 'Lealdade, apoio da torcida' },
  19: { energy: 'bloqueio', risk: 'medio', meaning: 'Isolamento, ego, orgulho' },
  20: { energy: 'criacao', risk: 'baixo', meaning: 'Apoio público, festa' },
  21: { energy: 'bloqueio', risk: 'alto', meaning: 'Obstáculo grande, muralha' },
  22: { energy: 'neutral', risk: 'medio', meaning: 'Escolha crítica, bifurcação' },
  23: { energy: 'bloqueio', risk: 'alto', meaning: 'Perda, desgaste, corrosão' },
  24: { energy: 'criacao', risk: 'baixo', meaning: 'Amor verdadeiro, paixão' },
  25: { energy: 'criacao', risk: 'baixo', meaning: 'Compromisso, contrato, aliança' },
  26: { energy: 'neutral', risk: 'medio', meaning: 'Segredo, tática oculta' },
  27: { energy: 'neutral', risk: 'medio', meaning: 'Mensagem, comunicação' },
  28: { energy: 'neutral', risk: 'medio', meaning: 'Jogador homem' },
  29: { energy: 'neutral', risk: 'medio', meaning: 'Jogadora mulher' },
  30: { energy: 'criacao', risk: 'baixo', meaning: 'Paz, maturidade, experiência' },
  31: { energy: 'criacao', risk: 'baixo', meaning: 'Sucesso brilhante, energia máxima' },
  32: { energy: 'neutral', risk: 'medio', meaning: 'Emoção, reconhecimento' },
  33: { energy: 'criacao', risk: 'baixo', meaning: 'Solução, chave da vitória' },
  34: { energy: 'criacao', risk: 'baixo', meaning: 'Abundância, lucro' },
  35: { energy: 'criacao', risk: 'baixo', meaning: 'Estabilidade, porto seguro' },
  36: { energy: 'bloqueio', risk: 'alto', meaning: 'Fardo pesado, cruz, sofrimento' }
};

// Numerologia 1-9 significados
const NUMEROLOGY_MEANINGS = {
  1: 'Jogo de pioneirismo - quem toma iniciativa controla',
  2: 'Jogo de parceria - trabalho coletivo define',
  3: 'Jogo de criatividade - momento de ousadia',
  4: 'Jogo de estrutura - disciplina e organização vencem',
  5: 'Jogo de mudança - viradas inesperadas',
  6: 'Jogo de equilíbrio - empate possível',
  7: 'Jogo de tensão - decisão no limite',
  8: 'Jogo de poder - força física prevalece',
  9: 'Jogo de conclusão - desenlace definitivo'
};

function letterToNumber(char) {
  const upper = char.toUpperCase();
  if (upper < 'A' || upper > 'Z') return 0;
  
  const base = upper.charCodeAt(0) - 'A'.charCodeAt(0);
  return (base % 9) + 1; // A=1, B=2...I=9, J=1, K=2...
}

function sumLetters(text) {
  let sum = 0;
  for (let char of text) {
    sum += letterToNumber(char);
  }
  return sum;
}

function reduceToSingleDigit(num) {
  while (num > 9) {
    num = num.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  }
  return num;
}

function reduceTo36(num) {
  while (num > 36) {
    num = sumDigits(num);
  }
  return num === 0 ? 1 : num;
}

function divideInto6Blocks(question) {
  const total = question.length;
  const baseSize = Math.floor(total / 6);
  const remainder = total % 6;
  
  let blocks = [];
  let start = 0;
  
  for (let i = 0; i < 6; i++) {
    const size = baseSize + (i < remainder ? 1 : 0);
    const block = question.substring(start, start + size);
    blocks.push(block);
    start += size;
  }
  
  return blocks;
}

function blockToCard(block) {
  const sum = sumLetters(block);
  const cardNumber = reduceTo36(sum);
  const card = getCardFromDeck(cardNumber, 'CIGANO');
  const energy = FOOTBALL_CARD_ENERGY[cardNumber] || { energy: 'neutral', risk: 'medio', meaning: 'Energia neutra' };
  
  return {
    block: block,
    sum: sum,
    number: cardNumber,
    name: card.name,
    symbol: card.symbol,
    cardMeaning: card.meaning,
    footballMeaning: energy.meaning,
    energy: energy.energy,
    risk: energy.risk,
    isMorrerNaPraia: energy.risk === 'morrer_na_praia'
  };
}

function analyzeTeamEnergy(cards) {
  let criacao = 0;
  let bloqueio = 0;
  let virada = 0;
  let morrerNaPraia = false;
  
  for (let card of cards) {
    if (card.energy === 'criacao') criacao++;
    else if (card.energy === 'bloqueio') bloqueio++;
    else if (card.energy === 'virada') virada++;
    
    if (card.isMorrerNaPraia) morrerNaPraia = true;
  }
  
  let dominantEnergy;
  if (criacao > bloqueio) {
    dominantEnergy = 'Energia de criação - avanço e conversão';
  } else if (bloqueio > criacao) {
    dominantEnergy = 'Energia de bloqueio - dificuldade e travamento';
  } else {
    dominantEnergy = 'Energia equilibrada - jogo disputado';
  }
  
  let riskLevel;
  if (morrerNaPraia) {
    riskLevel = 'CRÍTICO - Caixão presente (morrer na praia)';
  } else if (bloqueio >= 2) {
    riskLevel = 'ALTO - múltiplos bloqueios';
  } else if (bloqueio === 1) {
    riskLevel = 'MÉDIO - um bloqueio detectado';
  } else {
    riskLevel = 'BAIXO - caminho livre';
  }
  
  return {
    criacao,
    bloqueio,
    virada,
    morrerNaPraia,
    dominantEnergy,
    riskLevel
  };
}

function generateOracleInterpretation(teamX, teamY, numerology, analysisX, analysisY) {
  // System prompt para interpretação mística
  const systemContext = `
Você é um Oráculo Simbólico de jogos esportivos.
Sua linguagem é direta, mística e decisiva.

REGRAS ABSOLUTAS:
- Não use estatísticas, elenco ou favoritismo
- Não seja neutro quando houver diferença clara de energia
- Interprete "morrer na praia" como ponto de falha
- Use linguagem poética mas objetiva
- Foque em: Fluxo/Criação vs Bloqueio/Desgaste
- Conclua com veredito claro quando houver tendência

ESTRUTURA:
1. Numerologia (significado profundo)
2. Time A (cartas + interpretação simbólica)
3. Time B (cartas + interpretação simbólica)
4. Veredito (decisivo, não neutro)
`;

  let interpretation = `🔮 LEITURA SIMBÓLICA DO JOGO\n\n`;
  
  interpretation += `${teamX.name.toUpperCase()} × ${teamY.name.toUpperCase()}\n\n`;
  interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // NUMEROLOGIA com significado profundo
  const numerologyDeep = {
    1: "Arquétipo do Pioneiro. Jogo de iniciativa, quem ataca primeiro define.",
    2: "Arquétipo da Dualidade. Jogo de equilíbrio, decisão nos detalhes.",
    3: "Arquétipo da Criação. Jogo de ousadia, vence quem arrisca.",
    4: "Arquétipo da Estrutura. Jogo de disciplina, vence quem se organiza.",
    5: "Arquétipo da Mudança. Jogo imprevisível, viradas inesperadas.",
    6: "Arquétipo do Equilíbrio. Jogo disputado, tendência ao empate.",
    7: "Arquétipo da Tensão. Jogo no limite, decisão no detalhe.",
    8: "Arquétipo do Poder. Jogo de força, vence quem domina fisicamente.",
    9: "Arquétipo do Fechamento. Destino e colheita. Resultado vem por energia, não por lógica."
  };
  
  interpretation += `🔢 Numerologia do jogo: ${numerology.value}\n`;
  interpretation += `${numerologyDeep[numerology.value]}\n\n`;
  interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // TIME X - Interpretação profunda
  interpretation += `⚪ ${teamX.name.toUpperCase()}\n\n`;
  interpretation += `Cartas: ${teamX.cards.map(c => c.name).join(' • ')}\n\n`;
  
  for (let card of teamX.cards) {
    interpretation += `${card.symbol} ${card.name} → ${card.footballMeaning}\n`;
  }
  interpretation += `\n`;
  
  // Análise interpretativa (não técnica)
  const morrerNaPraiaX = teamX.cards.some(c => c.isMorrerNaPraia);
  interpretation += `💭 Leitura energética:\n`;
  if (analysisX.criacao > analysisX.bloqueio) {
    interpretation += `Energia de criação e movimento. `;
  } else if (analysisX.bloqueio > analysisX.criacao) {
    interpretation += `Energia de bloqueio e resistência. `;
  } else {
    interpretation += `Energia equilibrada entre criar e bloquear. `;
  }
  
  if (morrerNaPraiaX) {
    const morrerCard = teamX.cards.find(c => c.isMorrerNaPraia);
    if (morrerCard.energy === 'criacao') {
      interpretation += `Mas há oscilação emocional (${morrerCard.name}) - instabilidade, não travamento.\n`;
    } else {
      interpretation += `Com bloqueio estrutural (${morrerCard.name}) - esforço sem conversão.\n`;
    }
  } else {
    interpretation += `Fluxo sem grandes travamentos.\n`;
  }
  
  interpretation += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // TIME Y - Interpretação profunda
  interpretation += `🔴 ${teamY.name.toUpperCase()}\n\n`;
  interpretation += `Cartas: ${teamY.cards.map(c => c.name).join(' • ')}\n\n`;
  
  for (let card of teamY.cards) {
    interpretation += `${card.symbol} ${card.name} → ${card.footballMeaning}\n`;
  }
  interpretation += `\n`;
  
  const morrerNaPraiaY = teamY.cards.some(c => c.isMorrerNaPraia);
  interpretation += `💭 Leitura energética:\n`;
  if (analysisY.criacao > analysisY.bloqueio) {
    interpretation += `Energia de criação e movimento. `;
  } else if (analysisY.bloqueio > analysisY.criacao) {
    interpretation += `Energia de bloqueio e resistência. `;
  } else {
    interpretation += `Energia equilibrada entre criar e bloquear. `;
  }
  
  if (morrerNaPraiaY) {
    const morrerCard = teamY.cards.find(c => c.isMorrerNaPraia);
    if (morrerCard.energy === 'criacao') {
      interpretation += `Mas há oscilação emocional (${morrerCard.name}) - instabilidade, não travamento.\n`;
    } else {
      interpretation += `Com bloqueio estrutural (${morrerCard.name}) - esforço sem conversão.\n`;
    }
  } else {
    interpretation += `Fluxo sem grandes travamentos.\n`;
  }
  
  interpretation += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // ============================================================================
  // 🔮 VEREDITO ORACULAR DECISIVO
  // Princípio: Bloqueio pesa mais que criação
  // Morrer na praia SEMPRE inclina o destino
  // Empate é EXCEÇÃO (apenas espelho simbólico)
  // ============================================================================
  
  interpretation += `🔮 VEREDITO SIMBÓLICO\n\n`;
  
  // Cartas de bloqueio PESADO vs LEVE
  const bloqueiosPesados = ['Caixão', 'Âncora', 'Montanha', 'Poço', 'Cobra', 'Cruz'];
  const bloqueiosLeves = ['Nuvens', 'Ratos', 'Foice', 'Lua', 'Homem'];
  
  const morrerXCard = teamX.cards.find(c => c.isMorrerNaPraia);
  const morrerYCard = teamY.cards.find(c => c.isMorrerNaPraia);
  
  let vencedor = null;
  let razao = '';
  let placar = '';
  
  // ============================================================================
  // ANÁLISE DE GATILHOS DE EMPATE (35% dos jogos)
  // Empate é ATIVO, não passivo - precisa 2+ gatilhos
  // ============================================================================
  
  let empateGatilhos = 0;
  const gatilhosDetalhes = [];
  
  // GATILHO 1: Ambos com morrer na praia de peso similar
  if (morrerXCard && morrerYCard) {
    const xPesado = bloqueiosPesados.includes(morrerXCard.name);
    const yPesado = bloqueiosPesados.includes(morrerYCard.name);
    const xLeve = bloqueiosLeves.includes(morrerXCard.name);
    const yLeve = bloqueiosLeves.includes(morrerYCard.name);
    
    if ((xPesado && yPesado) || (xLeve && yLeve)) {
      empateGatilhos++;
      gatilhosDetalhes.push(`Ambos com morrer na praia ${xPesado ? 'pesado' : 'leve'}`);
    }
  }
  
  // GATILHO 2: Bloqueio estrutural bilateral
  const xBloqueiosPesados = teamX.cards.filter(c => bloqueiosPesados.includes(c.name)).length;
  const yBloqueiosPesados = teamY.cards.filter(c => bloqueiosPesados.includes(c.name)).length;
  
  if (xBloqueiosPesados >= 1 && yBloqueiosPesados >= 1) {
    empateGatilhos++;
    gatilhosDetalhes.push(`Bloqueios estruturais bilaterais (${xBloqueiosPesados} vs ${yBloqueiosPesados})`);
  }
  
  // GATILHO 3: Numerologia de suspensão
  const num = numerology.value;
  let numeroSuspende = false;
  
  if (num === 2) {
    // Dualidade - favorece empate quando forças equivalentes
    if (Math.abs(analysisX.criacao - analysisY.criacao) <= 1) {
      empateGatilhos++;
      numeroSuspende = true;
      gatilhosDetalhes.push('Numerologia 2: Dualidade equilibrada');
    }
  } else if (num === 6) {
    // Equilíbrio - favorece empate quando energias próximas
    if (analysisX.criacao === analysisY.criacao || analysisX.bloqueio === analysisY.bloqueio) {
      empateGatilhos++;
      numeroSuspende = true;
      gatilhosDetalhes.push('Numerologia 6: Balança suspensa');
    }
  } else if (num === 9) {
    // Fechamento - empate se ambos perdem muita energia
    if (analysisX.bloqueio >= 2 && analysisY.bloqueio >= 2) {
      empateGatilhos++;
      numeroSuspende = true;
      gatilhosDetalhes.push('Numerologia 9: Ambos esgotados');
    }
  }
  
  // GATILHO 4: Criação espelhada (ambos atacam, ambos erram)
  if (analysisX.criacao === analysisY.criacao && analysisX.criacao >= 1) {
    empateGatilhos++;
    gatilhosDetalhes.push(`Criação espelhada (${analysisX.criacao} vs ${analysisY.criacao})`);
  }
  
  // ============================================================================
  // DECISÃO: EMPATE se 2+ gatilhos ativos
  // ============================================================================
  
  if (empateGatilhos >= 2) {
    interpretation += `EMPATE SIMBÓLICO - TRAVAMENTO BILATERAL\n\n`;
    interpretation += `Gatilhos de espelhamento detectados:\n`;
    for (let detalhe of gatilhosDetalhes) {
      interpretation += `• ${detalhe}\n`;
    }
    interpretation += `\n`;
    
    if (morrerXCard && morrerYCard) {
      interpretation += `${teamX.name}: ${morrerXCard.symbol} ${morrerXCard.name}\n`;
      interpretation += `${teamY.name}: ${morrerYCard.symbol} ${morrerYCard.name}\n\n`;
    }
    
    interpretation += `Ambos os times enfrentam bloqueios simultâneos.\n`;
    interpretation += `Nenhum flui livremente.\n\n`;
    
    if (numeroSuspende) {
      interpretation += `Numerologia ${num} reforça o travamento.\n`;
    }
    
    interpretation += `Tendência: Empate ${num === 6 ? '0x0 ou 1x1' : num === 2 ? '1x1 ou 2x2' : '0x0, 1x1 ou 2x2'}\n`;
    interpretation += `Ou vitória por erro isolado, não por domínio.\n\n`;
    interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    interpretation += `⚡ Quando o cosmos trava ambos, o resultado se divide.\n`;
    interpretation += `Empate é exceção qualificada, não ausência de decisão.\n\n`;
    interpretation += `🔮⚽ O destino não inclina quando o espelho é perfeito.\n`;
    return interpretation;
  }
  
  // ============================================================================
  // NÍVEL 1: MORRER NA PRAIA (se não for empate)
  // ============================================================================
  
  if (morrerXCard || morrerYCard) {
    const xPesado = morrerXCard && bloqueiosPesados.includes(morrerXCard.name);
    const yPesado = morrerYCard && bloqueiosPesados.includes(morrerYCard.name);
    const xLeve = morrerXCard && bloqueiosLeves.includes(morrerXCard.name);
    const yLeve = morrerYCard && bloqueiosLeves.includes(morrerYCard.name);
    
    if (xPesado && !yPesado) {
      vencedor = teamY.name;
      razao = `${teamX.name} enfrenta bloqueio estrutural fatal (${morrerXCard.name}).\n${teamY.name} ${yLeve ? 'oscila levemente' : 'flui livremente'}.\n\nBloqueio pesado é decisivo.`;
      placar = '2x0';
    } else if (yPesado && !xPesado) {
      vencedor = teamX.name;
      razao = `${teamY.name} enfrenta bloqueio estrutural fatal (${morrerYCard.name}).\n${teamX.name} ${xLeve ? 'oscila levemente' : 'flui livremente'}.\n\nBloqueio pesado é decisivo.`;
      placar = '2x0';
    } else if (xLeve && !yLeve) {
      vencedor = teamY.name;
      razao = `${teamX.name} oscila (${morrerXCard.name}).\n${teamY.name} sem travamentos.\n\nFluxo livre vence instabilidade.`;
      placar = '1x0';
    } else if (yLeve && !xLeve) {
      vencedor = teamX.name;
      razao = `${teamY.name} oscila (${morrerYCard.name}).\n${teamX.name} sem travamentos.\n\nFluxo livre vence instabilidade.`;
      placar = '1x0';
    }
  }
  
  // ============================================================================
  // NÍVEL 2: BLOQUEIO ESTRUTURAL (se não decidiu)
  // ============================================================================
  
  if (!vencedor) {
    if (xBloqueiosPesados > yBloqueiosPesados) {
      vencedor = teamY.name;
      razao = `${teamX.name} acumula bloqueios (${xBloqueiosPesados} cartas pesadas).\n${teamY.name} mais leve.\n\nQuem carrega peso, não avança.`;
      placar = '2x1';
    } else if (yBloqueiosPesados > xBloqueiosPesados) {
      vencedor = teamX.name;
      razao = `${teamY.name} acumula bloqueios (${yBloqueiosPesados} cartas pesadas).\n${teamX.name} mais leve.\n\nQuem carrega peso, não avança.`;
      placar = '2x1';
    }
  }
  
  // ============================================================================
  // NÍVEL 3: NUMEROLOGIA DECISIVA (sempre inclina)
  // ============================================================================
  
  if (!vencedor) {
    if (num === 9) {
      // Vence quem perde menos energia
      if (analysisX.bloqueio < analysisY.bloqueio) {
        vencedor = teamX.name;
        razao = `Numerologia 9: Fechamento.\n${teamX.name} conserva mais energia.\n\nQuem fecha melhor, vence.`;
        placar = '1x0';
      } else {
        vencedor = teamY.name;
        razao = `Numerologia 9: Fechamento.\n${teamY.name} conserva mais energia.\n\nQuem fecha melhor, vence.`;
        placar = '1x0';
      }
    } else if (num === 5) {
      vencedor = teamY.name;
      razao = `Numerologia 5: Mudança e virada.\n${teamY.name} surpreende.\n\nCaos favorece reação.`;
      placar = '2x1';
    } else if (num === 7) {
      vencedor = teamY.name;
      razao = `Numerologia 7: Tensão no limite.\n${teamY.name} aguenta pressão.\n\nResistência vence ataque.`;
      placar = '1x0';
    } else if (num === 1 || num === 3 || num === 8) {
      vencedor = teamX.name;
      const motivo = num === 1 ? 'Pioneirismo define' : num === 3 ? 'Ousadia prevalece' : 'Poder domina';
      razao = `Numerologia ${num}: ${motivo}.\n${teamX.name} toma iniciativa.`;
      placar = num === 8 ? '3x1' : '2x1';
    } else if (num === 2 || num === 6) {
      // Se chegou aqui com num 2 ou 6, não tinha gatilhos suficientes
      // Usa criação como desempate
      if (analysisX.criacao > analysisY.criacao) {
        vencedor = teamX.name;
        razao = `Numerologia ${num}: ${num === 2 ? 'Dualidade' : 'Equilíbrio'}.\n${teamX.name} cria mais no detalhe.\n\nDiferença mínima decide.`;
        placar = '1x0';
      } else {
        vencedor = teamY.name;
        razao = `Numerologia ${num}: ${num === 2 ? 'Dualidade' : 'Equilíbrio'}.\n${teamY.name} cria mais no detalhe.\n\nDiferença mínima decide.`;
        placar = '1x0';
      }
    } else {
      vencedor = teamX.name;
      razao = `Numerologia ${num}: Leve vantagem para quem inicia.`;
      placar = '2x1';
    }
  }
  
  // ============================================================================
  // VEREDITO FINAL (65% dos jogos)
  // ============================================================================
  
  interpretation += `${vencedor.toUpperCase()} VENCE O JOGO\n\n`;
  interpretation += `${razao}\n\n`;
  
  const tipoVitoria = {
    1: 'Vitória rápida',
    2: 'Vitória nos detalhes',
    3: 'Vitória criativa',
    4: 'Vitória metódica',
    5: 'Vitória com reviravolta',
    6: 'Vitória mínima',
    7: 'Vitória sofrida',
    8: 'Vitória dominante',
    9: 'Vitória definitiva'
  };
  
  interpretation += `Tendência: ${tipoVitoria[num]}\n`;
  interpretation += `Placar sugerido: ${placar}\n\n`;
  interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  interpretation += `⚡ Bloqueio pesa mais que criação.\n`;
  interpretation += `Morrer na praia inclina o destino.\n`;
  interpretation += `Taxa natural: ~65% vitórias, ~35% empates.\n\n`;
  interpretation += `🔮⚽ Oráculos inclinam quando o desequilíbrio sussurra.\n`;
  
  return interpretation;
}

// Extrair nomes de times de forma INTELIGENTE
function extractTeamNames(question) {
  const normalized = question.toLowerCase();
  
  // Lista expandida de times (principais brasileiros e internacionais)
  const knownTeams = [
    // Série A
    'flamengo', 'palmeiras', 'corinthians', 'são paulo', 'sao paulo',
    'grêmio', 'gremio', 'inter', 'internacional', 'santos',
    'vasco', 'botafogo', 'cruzeiro', 'atlético', 'atletico',
    'fluminense', 'bahia', 'fortaleza', 'cuiabá', 'cuiaba',
    'bragantino', 'athletico', 'goiás', 'goias', 'coritiba',
    
    // Série B e outros brasileiros
    'sport', 'vitória', 'vitoria', 'ceará', 'ceara', 'avaí', 'avai',
    'ponte preta', 'guarani', 'náutico', 'nautico', 'santa cruz',
    'paraná', 'parana', 'csa', 'crb', 'sampaio corrêa', 'sampaio correa',
    'vila nova', 'tombense', 'londrina', 'operário', 'operario',
    'juventude', 'chapecoense', 'figueirense', 'ituano', 'mirassol',
    'novorizontino', 'amazonas', 'paysandu', 'remo', 'camboriú', 'camboriu',
    
    // Internacionais
    'barcelona', 'real madrid', 'bayern', 'psg', 'manchester',
    'liverpool', 'juventus', 'milan', 'chelsea', 'arsenal',
    'tottenham', 'napoli', 'roma', 'ajax', 'benfica',
    'porto', 'sporting', 'dortmund', 'atletico madrid', 'city'
  ];
  
  const foundTeams = [];
  
  // Procurar times conhecidos
  for (let team of knownTeams) {
    const index = normalized.indexOf(team);
    if (index !== -1) {
      foundTeams.push({ name: team, index: index });
    }
  }
  
  // Ordenar por ordem de aparição
  foundTeams.sort((a, b) => a.index - b.index);
  
  // Se não encontrou 2 times conhecidos, tentar extrair palavras-chave
  if (foundTeams.length < 2) {
    // Procurar padrões: "X contra Y", "X x Y", "X vs Y"
    const patterns = [
      /(\w+)\s*(?:x|vs|contra|versus)\s*(\w+)/i,
      /(\w+)\s+(?:e|ou|com)\s+(\w+)/i
    ];
    
    for (let pattern of patterns) {
      const match = question.match(pattern);
      if (match) {
        const team1 = match[1].toLowerCase();
        const team2 = match[2].toLowerCase();
        
        // Se já encontrou pelo menos 1, completar com o extraído
        if (foundTeams.length === 1) {
          const existingTeam = foundTeams[0].name;
          if (team1 !== existingTeam && team2 !== existingTeam) {
            // Adicionar o que falta
            if (!team1.includes(existingTeam)) {
              foundTeams.push({ name: team1, index: question.indexOf(match[1]) });
            } else {
              foundTeams.push({ name: team2, index: question.indexOf(match[2]) });
            }
          }
        } else if (foundTeams.length === 0) {
          // Adicionar ambos extraídos
          foundTeams.push({ name: team1, index: question.indexOf(match[1]) });
          foundTeams.push({ name: team2, index: question.indexOf(match[2]) });
        }
        break;
      }
    }
  }
  
  // Capitalizar nomes
  function capitalize(name) {
    // Casos especiais
    const special = {
      'sao paulo': 'São Paulo',
      'gremio': 'Grêmio',
      'atletico': 'Atlético',
      'goias': 'Goiás',
      'parana': 'Paraná',
      'ceara': 'Ceará',
      'nautico': 'Náutico',
      'avai': 'Avaí',
      'cuiaba': 'Cuiabá',
      'sampaio correa': 'Sampaio Corrêa',
      'operario': 'Operário',
      'camboriu': 'Camboriú'
    };
    
    if (special[name]) return special[name];
    
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  if (foundTeams.length >= 2) {
    return {
      teamX: capitalize(foundTeams[0].name),
      teamY: capitalize(foundTeams[1].name)
    };
  } else if (foundTeams.length === 1) {
    return {
      teamX: capitalize(foundTeams[0].name),
      teamY: 'ADVERSÁRIO'
    };
  } else {
    return {
      teamX: 'TIME 1',
      teamY: 'TIME 2'
    };
  }
}

app.post('/oracleConsultFootball', (req, res) => {
  console.log('✅ /oracleConsultFootball chamado');
  
  const { question } = req.body;
  
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pergunta inválida' });
  }
  
  console.log(`⚽ Pergunta: "${question}"`);
  
  // Dividir em 6 blocos
  const blocks = divideInto6Blocks(question);
  console.log(`📦 Blocos: ${blocks.map(b => `"${b}"`).join(', ')}`);
  
  // Numerologia (1-9)
  const totalSum = sumLetters(question);
  const numerologyValue = reduceToSingleDigit(totalSum);
  const numerology = {
    value: numerologyValue,
    meaning: NUMEROLOGY_MEANINGS[numerologyValue] || 'Temperamento indefinido'
  };
  console.log(`🔢 Numerologia: ${numerologyValue} - ${numerology.meaning}`);
  
  // Gerar cartas Time X (blocos 0, 1, 2)
  const teamXCards = [
    blockToCard(blocks[0]),
    blockToCard(blocks[1]),
    blockToCard(blocks[2])
  ];
  
  // Gerar cartas Time Y (blocos 3, 4, 5)
  const teamYCards = [
    blockToCard(blocks[3]),
    blockToCard(blocks[4]),
    blockToCard(blocks[5])
  ];
  
  // Análise energética
  const analysisX = analyzeTeamEnergy(teamXCards);
  const analysisY = analyzeTeamEnergy(teamYCards);
  
  console.log(`🔵 Time X: ${analysisX.dominantEnergy}`);
  console.log(`🔴 Time Y: ${analysisY.dominantEnergy}`);
  
  // Extrair nomes dos times da pergunta
  const teamNames = extractTeamNames(question);
  console.log(`⚽ Times identificados: ${teamNames.teamX} vs ${teamNames.teamY}`);
  
  const teamX = {
    name: teamNames.teamX,
    blocks: [blocks[0], blocks[1], blocks[2]],
    cards: teamXCards,
    analysis: analysisX
  };
  
  const teamY = {
    name: teamNames.teamY,
    blocks: [blocks[3], blocks[4], blocks[5]],
    cards: teamYCards,
    analysis: analysisY
  };
  
  // Interpretação oracular
  const interpretation = generateOracleInterpretation(teamX, teamY, numerology, analysisX, analysisY);
  
  const response = {
    question: question,
    numerology: numerology,
    teamX: teamX,
    teamY: teamY,
    interpretation: interpretation,
    timestamp: Date.now()
  };
  
  console.log('✅ Leitura oracular enviada');
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🔮 Servidor Oracle rodando na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`  GET  /health`);
  console.log(`  POST /oracleConsult`);
  console.log(`  POST /oracleConsultWithImage (6 cartas)`);
  console.log(`  POST /oracleConsultWithAudio`);
  console.log(`  POST /analyzeFrase (análise de coerência)`);
  console.log(`  POST /oracleConsultFootball ⚽ NOVO`);
  console.log(`🃏 Baralhos disponíveis:`);
  console.log(`  - VESTIGIUM: 36 cartas (Oráculo Investigativo - 4 Núcleos)`);
  console.log(`  - BIBLICO: 36 cartas (Oráculo Bíblico - 4 Grupos da Jornada)`);
  console.log(`  - PSIQUE: 36 cartas (Tarot Psicanalítico - Sistema DECIFRA)`);
  console.log(`  - Rider-Waite: 78 cartas (Espiritual)`);
  console.log(`  - Cigano: 36 cartas (Prático)`);
  console.log(`✅ Sistema de detecção automática ativo`);
  console.log(`✅ Sistema VESTIGIUM: 4 núcleos investigativos`);
  console.log(`✅ Sistema BIBLICO: 4 grupos da jornada espiritual`);
  console.log(`✅ Sistema DECIFRA: 6 posições para análise psicológica`);
  console.log(`✅ Análise de imagem: 6 cartas estruturadas`);
  console.log(`✅ Detecção facial: suportado via aiContext`);
  console.log(`✅ Análise de frases: coerência energética com IA`);
  console.log(`✅ Oráculo de Futebol: 6 blocos + numerologia 1-9 ⚽`);
});















