/**
 * Utility functions for loading protocol markdown files
 */

// Mapeamento de IDs de protocolos para arquivos
export const protocolMap: Record<string, string> = {
  'tce': '01_TCE.md',
  'celulite': '02_CELULITE.md',
  'erisipela': '03_ERISIPELA.md',
  'cetoacidose': '04_CETOACIDOSE_DIABETICA.md',
  'asma': '05_ASMA.md',
  'anafilaxia': '06_ANAFILAXIA.md',
  'desidratacao': '07_DESIDRATACAO.md',
  'crise-convulsiva': '08_CRISE_CONVULSIVA.md',
  'choque-septico': '09_CHOQUE_SEPTICO.md',
};

// Importa todos os arquivos markdown de protocolos
const protocolModules = import.meta.glob('../protocols/*.md', { as: 'raw' });

/**
 * Carrega o conteúdo de um protocolo pelo ID
 * @param protocolId ID do protocolo a ser carregado
 * @returns Promise com o conteúdo do markdown ou erro
 */
export const loadProtocolContent = async (protocolId: string): Promise<string> => {
  if (!protocolId || !protocolMap[protocolId]) {
    throw new Error('Protocolo não encontrado');
  }

  const fileName = protocolMap[protocolId];
  const modulePath = `../protocols/${fileName}`;
  
  try {
    if (protocolModules[modulePath]) {
      const content = await protocolModules[modulePath]();
      return content;
    } else {
      throw new Error(`Arquivo de protocolo não encontrado: ${fileName}`);
    }
  } catch (error) {
    console.error('Erro ao carregar protocolo:', error);
    throw new Error('Falha ao carregar o protocolo');
  }
};

/**
 * Retorna o título do protocolo com base no ID
 * @param protocolId ID do protocolo
 * @returns Título formatado do protocolo
 */
export const getProtocolTitle = (protocolId: string): string => {
  const titles: Record<string, string> = {
    'tce': 'Traumatismo Cranioencefálico (TCE)',
    'celulite': 'Celulite',
    'erisipela': 'Erisipela',
    'cetoacidose': 'Cetoacidose Diabética',
    'asma': 'Asma',
    'anafilaxia': 'Anafilaxia',
    'desidratacao': 'Desidratação',
    'crise-convulsiva': 'Crise Convulsiva',
    'choque-septico': 'Choque Séptico',
  };

  return titles[protocolId] || 'Protocolo';
};
