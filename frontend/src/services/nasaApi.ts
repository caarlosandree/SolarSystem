import { NASA_API_KEY } from '@/utils/constants';
import { NasaApiError, NetworkError } from '@/errors/apiErrors';

/**
 * Elementos orbitais de um asteroide (parâmetros de Kepler)
 */
export interface AsteroidOrbitalElements {
  /** Semieixo maior (UA) */
  a: number;
  /** Excentricidade (0-1) */
  e: number;
  /** Inclinação (graus) */
  i: number;
  /** Longitude do nó ascendente (graus) */
  om: number;
  /** Argumento do periélio (graus) */
  w: number;
  /** Anomalia média (graus) */
  ma: number;
}

/**
 * Objeto próximo à Terra (Near Earth Object)
 */
export interface NEOObject {
  /** Identificador único do objeto */
  id: string;
  /** Nome do objeto */
  name: string;
  /** Outras propriedades dinâmicas */
  [key: string]: unknown;
}

/**
 * Objeto monitorado pelo sistema Sentry (objetos com risco de impacto)
 */
export interface SentryObject {
  /** Designação do objeto */
  des: string;
  /** Outras propriedades dinâmicas */
  [key: string]: unknown;
}

/**
 * Objeto cometa do sistema solar
 */
export interface CometObject {
  /** Designação do cometa */
  des: string;
  /** Outras propriedades dinâmicas */
  [key: string]: unknown;
}

/**
 * Busca elementos orbitais de um asteroide específico
 * @param designation - Designação do asteroide (ex: "Apophis", "433")
 * @returns Elementos orbitais do asteroide ou null se não encontrado/disponível
 */
export async function fetchAsteroidOrbitalElements(
  designation: string
): Promise<AsteroidOrbitalElements | null> {
  if (!designation || typeof designation !== 'string') {
    console.warn('Designação de asteroide inválida:', designation);
    return null;
  }

  const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${designation}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Para elementos orbitais, não é crítico - apenas log e retorna null
      console.warn(
        `Não foi possível buscar elementos orbitais para ${designation}: HTTP ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    
    if (data && data.orb && typeof data.orb === 'object') {
      const orb = data.orb;
      
      // Validação básica dos elementos orbitais
      const elements = {
        a: parseFloat(String(orb.a)),
        e: parseFloat(String(orb.e)),
        i: parseFloat(String(orb.i)),
        om: parseFloat(String(orb.om)),
        w: parseFloat(String(orb.w)),
        ma: parseFloat(String(orb.ma)),
      };

      // Verifica se os valores são válidos
      if (
        !isNaN(elements.a) &&
        !isNaN(elements.e) &&
        !isNaN(elements.i) &&
        !isNaN(elements.om) &&
        !isNaN(elements.w) &&
        !isNaN(elements.ma)
      ) {
        return elements;
      }
    }
    
    return null;
  } catch (err) {
    // Para elementos orbitais individuais, apenas log - não lança erro
    // para não quebrar o processo de buscar múltiplos asteroides
    console.warn(`Erro ao buscar elementos orbitais para ${designation}:`, err);
    return null;
  }
}

/**
 * Busca objetos próximos à Terra (NEOs) da API da NASA
 * @returns Array de objetos próximos à Terra
 * @throws {NasaApiError} Se a API retornar erro ou chave não configurada
 * @throws {NetworkError} Se houver erro de conexão
 */
export async function fetchNEOs(): Promise<NEOObject[]> {
  if (!NASA_API_KEY) {
    throw new NasaApiError(
      'Chave da API da NASA não configurada. Configure VITE_NASA_API_KEY no arquivo .env'
    );
  }

  const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${NASA_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NasaApiError(
        `Erro na API de NEO: HTTP ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new NasaApiError('Resposta inválida da API de NEO');
    }

    return Array.isArray(data.near_earth_objects) ? data.near_earth_objects : [];
  } catch (err) {
    if (err instanceof NasaApiError) {
      throw err;
    }
    
    console.error('Erro na API de NEO:', err);
    throw new NetworkError(
      'Erro de conexão ao buscar objetos próximos à Terra',
      err
    );
  }
}

/**
 * Busca objetos do sistema Sentry (objetos com risco de impacto)
 * @returns Array de objetos monitorados pelo Sentry
 * @throws {NasaApiError} Se a API retornar erro
 * @throws {NetworkError} Se houver erro de conexão
 */
export async function fetchSentryObjects(): Promise<SentryObject[]> {
  const url = 'https://ssd-api.jpl.nasa.gov/sentry.api';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NasaApiError(
        `Erro na API Sentry: HTTP ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new NasaApiError('Resposta inválida da API Sentry');
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    if (err instanceof NasaApiError) {
      throw err;
    }
    
    console.error('Erro na API Sentry:', err);
    throw new NetworkError(
      'Erro de conexão ao buscar objetos do sistema Sentry',
      err
    );
  }
}

/**
 * Busca cometas do sistema solar
 * @returns Array de objetos cometa
 * @throws {NasaApiError} Se a API retornar erro
 * @throws {NetworkError} Se houver erro de conexão
 */
export async function fetchComets(): Promise<CometObject[]> {
  // Use 'kind=c' parameter to filter for comets in the CAD API
  // The 'body' parameter is for target bodies (planets), not object types
  const url = 'https://ssd-api.jpl.nasa.gov/cad.api?kind=c';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NasaApiError(
        `Erro na API de Cometas: HTTP ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new NasaApiError('Resposta inválida da API de Cometas');
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    if (err instanceof NasaApiError) {
      throw err;
    }
    
    console.error('Erro na API de Cometas:', err);
    throw new NetworkError(
      'Erro de conexão ao buscar cometas',
      err
    );
  }
}

/**
 * Dados de um asteroide famoso com seus elementos orbitais
 */
export interface FamousAsteroidData {
  /** Nome do asteroide */
  name: string;
  /** Elementos orbitais do asteroide, ou null se não disponível */
  orb: AsteroidOrbitalElements | null;
}

/**
 * Busca asteroides famosos com elementos orbitais
 * Implementa retry logic e delay entre requisições para evitar rate limiting
 * @returns Array de dados de asteroides famosos
 */
export async function fetchFamousAsteroids(): Promise<FamousAsteroidData[]> {
  const famousAsteroids = [
    'Apophis', 'Bennu', 'Ryugu', 'Didymos', 'Dimorphos', 'Itokawa', 'Psyche', 'Vesta',
    'Ceres', 'Pallas', 'Hygiea', 'Eros', 'Gaspra', 'Ida', 'Mathilde', 'Steins',
    'Lutetia', 'Dinkinesh', 'Toutatis', 'Florence', 'Icarus', 'Geographos', 'Castalia',
    'Toro', 'Amor', 'Apollo', 'Anteros', 'Ganymed', 'Ivar', 'Daphne', 'Europa',
    'Davida', 'Interamnia', 'Hebe', 'Iris', 'Flora', 'Metis', 'Parthenope', 'Eunomia',
    'Juno', 'Astraea', 'Thisbe', 'Cybele', 'Herculina', 'Sylvia', 'Patroclus', 'Hektor',
    'Euphrosyne', 'Fortuna', 'Massalia', 'Kleopatra', 'Dactyl', 'Linus', 'Eurybates',
    'Polymele', 'Leucus', 'Orus', 'Donaldjohanson',
  ];

  const asteroidData: FamousAsteroidData[] = [];
  const MAX_RETRIES = 2;
  const DELAY_MS = 50; // Delay entre requisições para evitar rate limiting
  
  /**
   * Função auxiliar para buscar um asteroide com retry
   */
  const fetchAsteroidWithRetry = async (
    asteroidName: string,
    retries = MAX_RETRIES
  ): Promise<AsteroidOrbitalElements | null> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const orb = await fetchAsteroidOrbitalElements(asteroidName);
        return orb;
      } catch (error) {
        const isLastAttempt = attempt === retries;
        if (isLastAttempt) {
          console.warn(
            `Falha ao buscar elementos orbitais para ${asteroidName} após ${retries + 1} tentativas:`,
            error
          );
          return null;
        }
        
        // Espera antes de tentar novamente (exponential backoff)
        const backoffDelay = DELAY_MS * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    return null;
  };
  
  // Busca asteroides sequencialmente com delay para evitar rate limiting
  for (const asteroid of famousAsteroids) {
    const orb = await fetchAsteroidWithRetry(asteroid);
    if (orb) {
      asteroidData.push({ name: asteroid, orb });
    }
    
    // Delay entre requisições para evitar rate limiting
    // Não aplica delay após o último item
    if (asteroid !== famousAsteroids[famousAsteroids.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  return asteroidData;
}

