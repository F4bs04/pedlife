/**
 * Utilitários para validação e normalização de cálculos de protocolos clínicos
 */

/**
 * Valida os campos obrigatórios dos dados de entrada
 * @param inputs Dados de entrada para validação
 * @param requiredFields Lista de campos obrigatórios
 * @returns Objeto com status de validação e mensagem de erro (se houver)
 */
export const validateInputs = (
  inputs: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; error?: string } => {
  for (const field of requiredFields) {
    if (inputs[field] === undefined || inputs[field] === '' || inputs[field] === null) {
      return { 
        isValid: false, 
        error: `O campo ${field.replace('_', ' ')} é obrigatório` 
      };
    }
    
    // Validação específica para campos numéricos
    if (['idade', 'peso', 'temperatura', 'frequencia_respiratoria', 'saturacao'].includes(field)) {
      const value = parseFloat(inputs[field]);
      if (isNaN(value)) {
        return {
          isValid: false,
          error: `O campo ${field.replace('_', ' ')} deve ser um número válido`
        };
      }
    }
  }
  
  return { isValid: true };
};

/**
 * Normaliza os resultados para garantir uma estrutura consistente
 * @param results Resultados do cálculo
 * @param protocolId ID do protocolo para aplicar regras específicas
 * @returns Resultados normalizados
 */
export const normalizeResults = (results: any, protocolId: string): any => {
  // Se não há resultados ou os resultados não são um objeto, retornar um objeto vazio
  if (!results || typeof results !== 'object' || results === null) {
    console.warn(`[${protocolId}] Resultados inválidos ou vazios:`, results);
    return {};
  }
  
  // Estrutura padrão para todos os protocolos
  const defaultStructure = {
    classificacao: '',
    criterios_internacao: [],
    exames_complementares: [],
    orientacoes: []
  };
  
  // Estruturas específicas por protocolo
  const protocolStructures: Record<string, any> = {
    'doenca-diarreica': {
      etiologia_provavel: '',
      hidratacao: [],
      medicacoes: [],
      antibioticoterapia: []
    },
    'glomerulonefrite': {
      diagnostico: '',
      manejo_hipertensao: [],
      manejo_edema: [],
      antibioticoterapia: [],
      criterios_avaliacao_nefrologica: []
    },
    'pneumonia': {
      etiologia_provavel: '',
      oxigenoterapia: [],
      antibioticoterapia: [],
      medicacoes_suporte: []
    }
  };
  
  // Combinar a estrutura padrão com a estrutura específica do protocolo
  const structure = {
    ...defaultStructure,
    ...(protocolStructures[protocolId] || {})
  };
  
  // Garantir que todos os campos esperados existam no resultado
  const normalized = { ...structure };
  
  // Adicionar todos os campos do resultado, mesmo que não estejam na estrutura padrão
  Object.keys(results).forEach(key => {
    if (results[key] !== undefined) {
      // Se a estrutura espera um array para este campo
      if (structure[key] !== undefined && Array.isArray(structure[key])) {
        normalized[key] = Array.isArray(results[key]) ? results[key] : [results[key]];
      } else {
        normalized[key] = results[key];
      }
    }
  });
  
  return normalized;
};

/**
 * Prepara os dados de entrada para o cálculo
 * @param inputs Dados de entrada brutos
 * @param protocolId ID do protocolo para aplicar conversões específicas
 * @returns Dados processados prontos para cálculo
 */
export const prepareInputs = (
  inputs: Record<string, any>,
  protocolId: string
): Record<string, any> => {
  const processed: Record<string, any> = { ...inputs };
  
  // Converter campos numéricos
  const numericFields = ['idade', 'peso', 'temperatura', 'frequencia_respiratoria', 'saturacao'];
  
  numericFields.forEach(field => {
    if (inputs[field] !== undefined && inputs[field] !== '') {
      // Converter para número, tratando vírgula como separador decimal
      const value = inputs[field].toString().replace(',', '.');
      processed[field] = field.includes('idade') ? parseInt(value) : parseFloat(value);
    }
  });
  
  // Conversões específicas por protocolo
  if (protocolId === 'pneumonia') {
    // Garantir que os campos específicos de pneumonia estejam presentes
    processed.febre = processed.febre || false;
    processed.tosse = processed.tosse || false;
    processed.dispneia = processed.dispneia || false;
  } else if (protocolId === 'doenca-diarreica') {
    // Garantir que os campos específicos de doença diarreica estejam presentes
    processed.sinais_desidratacao = processed.sinais_desidratacao || [];
    processed.diarreia_com_sangue = processed.diarreia_com_sangue || false;
  } else if (protocolId === 'glomerulonefrite') {
    // Garantir que os campos específicos de glomerulonefrite estejam presentes
    processed.hipertensao = processed.hipertensao || false;
    processed.edema = processed.edema || false;
  }
  
  return processed;
};

/**
 * Executa o cálculo do protocolo com tratamento de erros
 * @param controller Controlador do protocolo
 * @param inputs Dados de entrada
 * @param protocolId ID do protocolo
 * @returns Resultados do cálculo ou mensagem de erro
 */
export const calculateWithErrorHandling = async (
  controller: any,
  inputs: Record<string, any>,
  protocolId: string
): Promise<{ success: boolean; results?: any; error?: string }> => {
  try {
    console.log(`[${protocolId}] Dados de entrada:`, inputs);
    
    // Validar se o controller tem o método calcular
    if (!controller || typeof controller.calcular !== 'function') {
      throw new Error('Controlador de cálculo não disponível para este protocolo');
    }
    
    // Executar o cálculo com timeout para evitar bloqueios
    let results;
    try {
      // Usar Promise.race para implementar um timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tempo limite excedido ao calcular')), 10000);
      });
      
      results = await Promise.race([
        controller.calcular(inputs),
        timeoutPromise
      ]);
    } catch (calcError) {
      console.error(`[${protocolId}] Erro durante o cálculo:`, calcError);
      throw calcError;
    }
    
    // Verificar se os resultados são válidos
    if (results === undefined || results === null) {
      throw new Error('O cálculo não retornou resultados válidos');
    }
    
    console.log(`[${protocolId}] Resultados do cálculo:`, results);
    
    // Normalizar resultados
    const normalizedResults = normalizeResults(results, protocolId);
    
    return { success: true, results: normalizedResults };
  } catch (error) {
    console.error(`[${protocolId}] Erro ao calcular:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao processar o cálculo' 
    };
  }
};
