// AI Service for external AI agent integration
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message: string;
  success: boolean;
  error?: string;
}

export class AIService {
  private static readonly API_URL = process.env.VITE_AI_API_URL || 'https://pedro-production.up.railway.app/ask';
  private static readonly API_KEY = process.env.VITE_AI_API_KEY || 'pedroapikey';
  private static readonly MODEL = process.env.VITE_AI_MODEL || 'pedro-v1';

  /**
   * Send message to external AI agent
   */
  static async sendMessage(
    userMessage: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    try {
      // Pedro já tem contexto médico pediátrico integrado, não precisa de system message
      // Apenas enviamos a mensagem do usuário diretamente

      // Check if API key is configured
      if (!this.API_KEY) {
        return {
          message: 'Desculpe, o serviço de IA não está configurado. Por favor, configure a chave da API.',
          success: false,
          error: 'API key not configured'
        };
      }

      // Make request to Pedro API
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle Pedro API response format
      if (data.response) {
        return {
          message: data.response.trim(),
          success: true
        };
      } else if (data.detail) {
        // Handle API errors
        const errorMsg = Array.isArray(data.detail) 
          ? data.detail.map(d => d.msg).join(', ')
          : data.detail;
        throw new Error(`Pedro API Error: ${errorMsg}`);
      } else {
        throw new Error('Formato de resposta inesperado da API do Pedro');
      }

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback response for when external AI is not available
      return {
        message: this.getFallbackResponse(userMessage),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Fallback responses when external AI is not available
   */
  private static getFallbackResponse(userMessage: string): string {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('dose') || lowercaseMessage.includes('dosagem')) {
      return 'Para cálculos de dosagem, use nossa calculadora de medicamentos. Informe o peso e idade do paciente para obter as doses corretas. (Modo offline - configure a API de IA para respostas mais precisas)';
    }
    
    if (lowercaseMessage.includes('emergência') || lowercaseMessage.includes('urgência')) {
      return 'Em situações de emergência, consulte nossos protocolos de atendimento. Temos protocolos para anafilaxia, parada cardiorrespiratória, convulsões e muito mais. (Modo offline - configure a API de IA para respostas mais precisas)';
    }
    
    if (lowercaseMessage.includes('protocolo')) {
      return 'Nossos protocolos incluem: Anafilaxia, Asma, TCE, Celulite, Convulsões, e muitos outros. Navegue pela seção de protocolos para mais informações. (Modo offline - configure a API de IA para respostas mais precisas)';
    }
    
    if (lowercaseMessage.includes('insulin') || lowercaseMessage.includes('diabetes')) {
      return 'Para cálculos de insulina, use nossa calculadora específica. Ela considera o peso, glicemia e outros fatores importantes. (Modo offline - configure a API de IA para respostas mais precisas)';
    }
    
    if (lowercaseMessage.includes('obrigado') || lowercaseMessage.includes('valeu')) {
      return 'De nada! Estou aqui para ajudar sempre que precisar. Boa prática clínica! 👨‍⚕️';
    }
    
    return 'Entendo sua pergunta. Para melhor atendê-lo, recomendo explorar nossas calculadoras de medicamentos e protocolos clínicos. (Modo offline - configure a API de IA para respostas mais precisas)';
  }

  /**
   * Test connection to AI service
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await this.sendMessage('Teste de conexão');
      return response.success;
    } catch (error) {
      return false;
    }
  }
}
