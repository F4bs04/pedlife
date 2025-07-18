/**
 * Utility functions for loading protocol data from controllers
 */

// Importando os controllers dos protocolos
import traumaController from '../protocols/Atualizados/controllers/calculators/traumaCranioencefalico.controller';
import celuliteController from '../protocols/Atualizados/controllers/calculators/celulite.controller';
import erisipelaController from '../protocols/Atualizados/controllers/calculators/erisipela.controller';
import cetoacidoseController from '../protocols/Atualizados/controllers/calculators/cetoacidoseDiabetica.controller';
import asmaController from '../protocols/Atualizados/controllers/calculators/asma.controller';
import anafilaxiaController from '../protocols/Atualizados/controllers/calculators/anafilaxia.controller';
import desidratacaoController from '../protocols/Atualizados/controllers/calculators/desidratacao.controller';
import criseConvulsivaController from '../protocols/Atualizados/controllers/calculators/criseConvulsiva.controller';
import choqueSepticoController from '../protocols/Atualizados/controllers/calculators/choqueSeptico.controller';
import bronquioliteVsrController from '../protocols/Atualizados/controllers/calculators/bronquioliteVsr.controller';
import criseAlgicaController from '../protocols/Atualizados/controllers/calculators/criseAlgicaAnemiaFalciforme.controller';
import doencaDiarreicaController from '../protocols/Atualizados/controllers/calculators/doencaDiarreica.controller';
import glomerulonefriteController from '../protocols/Atualizados/controllers/calculators/glomerulonefrite.controller';
import paradaCardiorrespiratoriaController from '../protocols/Atualizados/controllers/calculators/paradaCardiorrespiratoria.controller';
import pneumoniaController from '../protocols/Atualizados/controllers/calculators/pneumonia.controller';
import politraumatismoController from '../protocols/Atualizados/controllers/calculators/politraumatismo.controller';
import simPController from '../protocols/Atualizados/controllers/calculators/simP.controller';
import sragController from '../protocols/Atualizados/controllers/calculators/srag.controller';
import violenciaSexualController from '../protocols/Atualizados/controllers/calculators/violenciaSexual.controller';

// Mapeamento de IDs de protocolos para controllers
export const protocolMap: Record<string, any> = {
  'tce': traumaController,
  'celulite': celuliteController,
  'erisipela': erisipelaController,
  'cetoacidose': cetoacidoseController,
  'asma': asmaController,
  'anafilaxia': anafilaxiaController,
  'desidratacao': desidratacaoController,
  'crise-convulsiva': criseConvulsivaController,
  'choque-septico': choqueSepticoController,
  'bronquiolite': bronquioliteVsrController,
  'crise-algica': criseAlgicaController,
  'doenca-diarreica': doencaDiarreicaController,
  'glomerulonefrite': glomerulonefriteController,
  'parada-cardiorrespiratoria': paradaCardiorrespiratoriaController,
  'pneumonia': pneumoniaController,
  'politraumatismo': politraumatismoController,
  'simp': simPController,
  'srag': sragController,
  'violencia-sexual': violenciaSexualController
};

// Utilitários para extrair e formatar dados estruturados de cada controlador
const extractControllerData = (controller: any) => {
  // Extrair dados genéricos e específicos de cada controller
  // Esta função transforma os dados dos controllers em um formato consistente
  return {
    // Dados extraídos do controller que serão usados na interface
    controller,
    criterios: controller.getCriteriosTcGerais ? controller.getCriteriosTcGerais() : [],
    escalaGlasgow: controller.getEscalaGlasgow ? controller.getEscalaGlasgow() : null,
    // Outros dados específicos que podem ser extraídos do controller
  };
};

// Importação dinâmica dos arquivos markdown
const markdownFiles = import.meta.glob('../protocols/**/*.md', { eager: true, query: '?raw', import: 'default' });

/**
 * Carrega os dados de um protocolo pelo ID
 * @param protocolId ID do protocolo a ser carregado
 * @returns Dados estruturados do protocolo
 */
export const loadProtocolContent = async (protocolId: string): Promise<any> => {
  if (!protocolId) {
    throw new Error('ID do protocolo não especificado');
  }

  try {
    // Tenta encontrar o controlador (pode não existir para todos os protocolos)
    const controller = protocolMap[protocolId] || null;
    
    // Tenta carregar o conteúdo markdown
    let content = null;
    
    // Busca correspondências nos arquivos markdown disponíveis
    const filePattern = new RegExp(`${protocolId}|${protocolId.replace(/-/g, '_')}`, 'i');
    
    // Tenta encontrar o arquivo markdown correspondente ao ID
    for (const filePath in markdownFiles) {
      if (filePattern.test(filePath)) {
        content = markdownFiles[filePath];
        break;
      }
    }
    
    // Se não encontrou pelo ID, tenta pelo nome numérico (01_TCE.md, etc)
    if (!content) {
      for (const filePath in markdownFiles) {
        const fileName = filePath.split('/').pop() || '';
        if (fileName.toLowerCase().includes(protocolId.toLowerCase())) {
          content = markdownFiles[filePath];
          break;
        }
      }
    }
    
    // Retorna os dados estruturados com controller (se disponível) e conteúdo markdown
    return {
      controller,
      content,
      protocolId
    };
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
    'bronquiolite': 'Bronquiolite VSR',
    'crise-algica': 'Crise Álgica em Anemia Falciforme',
    'doenca-diarreica': 'Doença Diarreica Aguda',
    'glomerulonefrite': 'Glomerulonefrite',
    'parada-cardiorrespiratoria': 'Parada Cardiorrespiratória',
    'pneumonia': 'Pneumonia',
    'politraumatismo': 'Politraumatismo',
    'simp': 'Síndrome Inflamatória Multissistêmica Pediátrica (SIM-P)',
    'srag': 'Síndrome Respiratória Aguda Grave (SRAG)',
    'violencia-sexual': 'Violência Sexual'
  };

  return titles[protocolId] || 'Protocolo';
};
