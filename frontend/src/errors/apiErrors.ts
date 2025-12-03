/**
 * Erro customizado para problemas com a API da NASA
 */
export class NasaApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'NasaApiError';
    Object.setPrototypeOf(this, NasaApiError.prototype);
  }
}

/**
 * Erro customizado para problemas com a API do Gemini
 */
export class GeminiApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'GeminiApiError';
    Object.setPrototypeOf(this, GeminiApiError.prototype);
  }
}

/**
 * Erro customizado para problemas de rede
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

