import { GEMINI_MODEL } from '@/utils/constants';

const SYSTEM_PROMPT = `Você é Stellar, uma assistente de IA especialista em astronomia e exploração solar com profundo conhecimento em astrofísica, ciência planetária, evolução estelar, cosmologia e missões espaciais (NASA, ESA, ISRO, CNSA, JAXA). Sua expertise abrange: objetos do sistema solar, astronomia estelar, técnicas observacionais, missões de exploração espacial, exoplanetas, astrobiologia e cosmologia.

CAPACIDADES PRINCIPAIS:
- Calcular mecânica orbital, distâncias astronômicas (UA, anos-luz, parsecs)
- Explicar coordenadas celestes (AR/Dec, Alt/Az) e técnicas observacionais
- Fornecer status atual de missões espaciais e descobertas científicas
- Analisar conceitos espectroscópicos e fenômenos astronômicos
- Oferecer orientação observacional baseada em localização, tempo e equipamento

ESTILO DE COMUNICAÇÃO:
- Adaptar complexidade ao nível do usuário: iniciantes recebem analogias e explicações simples, especialistas recebem profundidade técnica
- Começar com respostas diretas, depois enriquecer com contexto e detalhes fascinantes
- Usar comparações de escala para distâncias e escalas de tempo cósmicas (ex: 'Se a Terra fosse uma bola de basquete, a Lua seria uma bola de tênis a 7 metros de distância')
- Equilibrar precisão científica com admiração e entusiasmo
- Pintar descrições vívidas de fenômenos celestes
- Conectar fatos a missões em andamento e descobertas recentes

REGRAS CRÍTICAS DE SEGURANÇA:
- SEMPRE avisar: NUNCA olhe para o Sol sem óculos de eclipse certificados ISO 12312-2 ou vidro de soldador #14+. Óculos de sol comuns, filtros de câmera ou filtros improvisados são PERIGOSOS e podem causar cegueira
- Enfatizar filtros solares adequados necessários para telescópios/binóculos
- Corrigir equívocos (Terra plana, astrologia como ciência) suavemente com evidências

ESTRUTURA DE RESPOSTA:
1. Responder a pergunta diretamente primeiro
2. Adicionar enriquecimento contextual e detalhes fascinantes relacionados
3. Fornecer escala/perspectiva para ajudar a compreender magnitudes cósmicas
4. Conectar a missões atuais ou descobertas recentes quando relevante
5. Sugerir observações, exploração adicional ou tópicos relacionados

PARA OBSERVAÇÕES:
- Recomendar horários e condições ideais de visualização
- Sugerir equipamento apropriado (olho nu, binóculos, telescópio)
- Considerar poluição luminosa e localização do usuário
- Fornecer avisos de segurança para observação solar

PARA CÁLCULOS:
- Explicar física conceitualmente primeiro
- Mostrar equações com todas as variáveis definidas
- Trabalhar exemplos passo a passo
- Usar algarismos significativos e unidades apropriados
- Relacionar resultados de volta ao significado físico

DIRETRIZES ESPECIAIS:
- Distinguir ciência estabelecida de modelos teóricos
- Reconhecer fronteiras de pesquisa e incertezas
- Nunca inventar detalhes de missões, datas ou descobertas
- Fonte de dados críticos (bancos de dados NASA, ESA)
- Usar sistema métrico principalmente, adicionar imperial para acessibilidade
- Compartilhar fatos menos conhecidos e histórias humanas de descoberta
- Fomentar curiosidade com perguntas instigantes
- Construir conhecimento progressivamente em conversas

TRATAMENTO DE TÓPICOS:
- Exoplanetas: Explicar métodos de detecção (trânsito, velocidade radial), discutir fatores de habitabilidade
- Buracos negros: Linguagem cuidadosa sobre horizontes de eventos, conectar a observações (EHT, LIGO)
- Missões espaciais: Status atual, objetivos, conquistas em todas as agências
- Fenômenos extremos: Explicar efeitos relativísticos, mecânica quântica quando relevante

Sua missão: Tornar o universo compreensível, inspirar curiosidade cósmica e criar entusiastas espaciais cientificamente alfabetizados. Todo especialista já foi um iniciante olhando para as estrelas.`;

export interface GeminiResponse {
  text: string | null;
  reason: string | null;
}

function getGeminiApiKey(): string {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export async function fetchGeminiResponse(
  message: string,
  providedApiKey?: string
): Promise<GeminiResponse> {
  const apiKey = providedApiKey || getGeminiApiKey();
  if (!apiKey) {
    return {
      text: null,
      reason: 'Respostas ao vivo do Gemini estão indisponíveis porque a chave da API está faltando.',
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            role: 'system',
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            topK: 24,
            topP: 0.85,
            maxOutputTokens: 320,
          },
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        `Requisição à API do Gemini falhou com status ${response.status}`;
      throw new Error(errorMessage);
    }

    const text = extractGeminiText(data);
    if (text) {
      return { text, reason: null };
    }

    const promptFeedback = data?.promptFeedback;
    const blockReason = promptFeedback?.blockReason;
    const safetyRatings = Array.isArray(promptFeedback?.safetyRatings)
      ? promptFeedback.safetyRatings
      : [];

    let reason = 'Gemini retornou uma resposta vazia.';
    if (blockReason) {
      reason = `Gemini bloqueou a resposta (${blockReason.replace(/_/g, ' ').toLowerCase()}).`;
    }

    if (safetyRatings.length) {
      const safetySummary = safetyRatings
        .map((rating: { category?: string; probability?: string }) => {
          const category = rating?.category
            ?.replace('HARM_CATEGORY_', '')
            .toLowerCase()
            .replace(/_/g, ' ');
          const probability = rating?.probability
            ? rating.probability.toLowerCase().replace(/_/g, ' ')
            : 'probabilidade não especificada';
          return `${category || 'segurança'}: ${probability}`;
        })
        .join(', ');
      reason += ` Feedback de segurança: ${safetySummary}.`;
    }

    console.warn('Resposta do Gemini não continha texto; usando conteúdo curado como fallback.', {
      promptFeedback,
      data,
    });
    return { text: null, reason };
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Problema de conexão com Gemini: ${errorMessage}`);
  }
}

function extractGeminiText(data: unknown): string | null {
  const candidates = (data as { candidates?: unknown[] })?.candidates;
  if (!Array.isArray(candidates) || !candidates.length) {
    return null;
  }

  for (const candidate of candidates) {
    const parts = (candidate as { content?: { parts?: unknown[] } })?.content
      ?.parts;
    if (!Array.isArray(parts)) {
      continue;
    }

    const text = (parts as Array<{ text?: string }>)
      .map((part) => part?.text || '')
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (text) {
      return text;
    }
  }

  return null;
}

export function getFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('sun') || lowerMsg.includes('sol')) {
    return '- **Sol**: Estrela anã amarela com 99,86% da massa do sistema e superfície próxima a 5.778 K.';
  }
  if (lowerMsg.includes('mercury') || lowerMsg.includes('mercúrio')) {
    return '- **Mercúrio**: Menor planeta com oscilações extremas de -173°C à noite a 427°C durante o dia devido à atmosfera escassa.';
  }
  if (lowerMsg.includes('venus') || lowerMsg.includes('vênus')) {
    return "- **Vênus**: Gêmeo do tamanho da Terra envolto em uma atmosfera densa de CO₂ que produz a superfície mais quente do sistema solar.";
  }
  if (lowerMsg.includes('earth') || lowerMsg.includes('terra')) {
    return "- **Terra**: Terceiro planeta, 71% oceanos, e o único mundo onde a vida é confirmada.";
  }
  if (lowerMsg.includes('mars') || lowerMsg.includes('marte')) {
    return "- **Marte**: 'Planeta Vermelho' rico em ferro com ar rarefeito e pequenas luas Fobos e Deimos.";
  }
  if (lowerMsg.includes('jupiter') || lowerMsg.includes('júpiter')) {
    return "- **Júpiter**: Mundo gasoso gigante com mais de 80 luas e a tempestade secular da Grande Mancha Vermelha.";
  }
  if (lowerMsg.includes('saturn') || lowerMsg.includes('saturno')) {
    return "- **Saturno**: Segundo maior planeta destacado por anéis brilhantes de gelo e rocha.";
  }
  if (lowerMsg.includes('uranus') || lowerMsg.includes('urano')) {
    return "- **Urano**: Gigante de gelo tingido de metano inclinado 98° de lado, proporcionando estações extremas.";
  }
  if (lowerMsg.includes('neptune') || lowerMsg.includes('netuno')) {
    return "- **Netuno**: Gigante de gelo distante com ventos supersônicos e um tom azul profundo.";
  }
  if (lowerMsg.includes('moon') || lowerMsg.includes('luna') || lowerMsg.includes('lua')) {
    return "- **Lua da Terra**: Quinto maior satélite, provavelmente nascido de um impacto gigante há 4,5 bilhões de anos.";
  }
  if (lowerMsg.includes('solar system') || lowerMsg.includes('sistema solar')) {
    return "- **Sistema Solar**: A gravidade une o Sol, planetas, luas, asteroides e cometas formados de uma nuvem de gás de 4,6 bilhões de anos.";
  }
  if (lowerMsg.includes('galaxy') || lowerMsg.includes('galáxia')) {
    return "- **Galáxia**: Vastas ilhas gravitacionais de estrelas, gás e poeira; a Via Láctea abriga nosso sistema solar.";
  }
  if (lowerMsg.includes('black hole') || lowerMsg.includes('buraco negro')) {
    return "- **Buraco negro**: Núcleo de estrela colapsado onde a gravidade é tão intensa que nem mesmo a luz escapa.";
  }
  if (lowerMsg.includes('comet') || lowerMsg.includes('cometa')) {
    return "- **Cometa**: Corpo gelado do sistema solar externo que desenvolve uma coma brilhante e cauda perto do Sol.";
  }
  if (lowerMsg.includes('asteroid') || lowerMsg.includes('asteroide')) {
    return "- **Asteroide**: Corpo rochoso que orbita o Sol, frequentemente no cinturão entre Marte e Júpiter, variando de seixos a escala de planeta anão.";
  }
  if (lowerMsg.includes('control') || lowerMsg.includes('como usar') || lowerMsg.includes('usar') || lowerMsg.includes('controle')) {
    return "- **Explorar**: Arraste para orbitar, role para ampliar e clique nos planetas para perfis; ajuste velocidade e órbitas no painel de Controle de Missão.";
  }
  if (lowerMsg.includes('music') || lowerMsg.includes('sound') || lowerMsg.includes('música') || lowerMsg.includes('som')) {
    return "- **Música**: Toque no botão de música no Controle de Missão ou no ícone de vinil flutuante para iniciar ou silenciar a trilha sonora.";
  }
  if (lowerMsg.includes('eclipse') || lowerMsg.includes('eclipse')) {
    return "- **Tours de eclipse**: Use os botões do painel de Eventos Especiais para sobrevoos guiados de eclipses solares e lunares com narração amigável para crianças.";
  }

  return "- **IA Espacial**: Pergunte sobre planetas, luas, missões ou como usar os controles do explorador.";
}

