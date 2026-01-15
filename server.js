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
  while (result > 78) {
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
  
  let adjustedNumber = ((cardNumber - 1) % maxCards) + 1;
  
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
    decifraSystem: 'enabled'
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
    interpretation = `${interpretationPrefix}🎙️ O ${deckName} revela ${levelDescription}. As ${cardCount} frequências (${cardNames}) se combinam para responder sua pergunta com clareza vibracional.`;
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

app.post('/oracleConsultWithImage', (req, res) => {
  console.log('✅ /oracleConsultWithImage chamado');
  console.log('Body recebido:', JSON.stringify(req.body));
  
  const { question, rgbValues } = req.body;
  
  if (!question || !rgbValues) {
    console.log('❌ Dados faltando!');
    return res.status(400).json({ error: 'Missing data' });
  }
  
  console.log(`RGB: R=${rgbValues.r}, G=${rgbValues.g}, B=${rgbValues.b}`);
  
  const redCard = reduceToBase(rgbValues.r);
  const greenCard = reduceToBase(rgbValues.g);
  const blueCard = reduceToBase(rgbValues.b);
  
  const cards = [
    { 
      ...getCardFromDeck(redCard, 'CIGANO'),
      source: 'Vermelho', 
      calculation: `${rgbValues.r} → ${redCard}` 
    },
    { 
      ...getCardFromDeck(greenCard, 'CIGANO'),
      source: 'Verde', 
      calculation: `${rgbValues.g} → ${greenCard}` 
    },
    { 
      ...getCardFromDeck(blueCard, 'CIGANO'),
      source: 'Azul', 
      calculation: `${rgbValues.b} → ${blueCard}` 
    }
  ].map((card, idx) => {
    const nums = [redCard, greenCard, blueCard];
    return {
      symbol: card.symbol,
      codedName: `Carta ${nums[idx]}: ${card.name}`,
      greekName: card.name,
      meaning: card.meaning,
      source: card.source,
      calculation: card.calculation
    };
  });
  
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
  console.log(`  - VESTIGIUM: 36 cartas (Oráculo Investigativo - 4 Núcleos)`);
  console.log(`  - BIBLICO: 36 cartas (Oráculo Bíblico - 4 Grupos da Jornada)`);
  console.log(`  - PSIQUE: 36 cartas (Tarot Psicanalítico - Sistema DECIFRA)`);
  console.log(`  - Rider-Waite: 78 cartas (Espiritual)`);
  console.log(`  - Cigano: 36 cartas (Prático)`);
  console.log(`✅ Sistema de detecção automática ativo`);
  console.log(`✅ Sistema VESTIGIUM: 4 núcleos investigativos`);
  console.log(`✅ Sistema BIBLICO: 4 grupos da jornada espiritual`);
  console.log(`✅ Sistema DECIFRA: 6 posições para análise psicológica`);
  console.log(`✅ Análise de complexidade: 1-10 cartas dinâmicas`);
});




