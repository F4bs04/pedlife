/**
 * Utility functions for loading protocol data from controllers
 */

// Importando os controllers dos protocolos
import traumaController from '../protocols/Atualizados/controllers/calculators/traumaCranioencefalico.controller.ts';
import celuliteController from '../protocols/Atualizados/controllers/calculators/celulite.controller.ts';
import erisipelaController from '../protocols/Atualizados/controllers/calculators/erisipela.controller.ts';
import cetoacidoseController from '../protocols/Atualizados/controllers/calculators/cetoacidoseDiabetica.controller.ts';
import asmaController from '../protocols/Atualizados/controllers/calculators/asma.controller.ts';
import anafilaxiaController from '../protocols/Atualizados/controllers/calculators/anafilaxia.controller.ts';
import desidratacaoController from '../protocols/Atualizados/controllers/calculators/desidratacao.controller.ts';
import criseConvulsivaController from '../protocols/Atualizados/controllers/calculators/criseConvulsiva.controller.ts';
import choqueSepticoController from '../protocols/Atualizados/controllers/calculators/choqueSeptico.controller.ts';
import bronquioliteVsrController from '../protocols/Atualizados/controllers/calculators/bronquioliteVsr.controller.ts';
import criseAlgicaController from '../protocols/Atualizados/controllers/calculators/criseAlgicaAnemiaFalciforme.controller.ts';
import doencaDiarreicaController from '../protocols/Atualizados/controllers/calculators/doencaDiarreica.controller.ts';
import glomerulonefriteController from '../protocols/Atualizados/controllers/calculators/glomerulonefrite.controller.ts';
import paradaCardiorrespiratoriaController from '../protocols/Atualizados/controllers/calculators/paradaCardiorrespiratoria.controller.ts';
import pneumoniaController from '../protocols/Atualizados/controllers/calculators/pneumonia.controller.ts';
import politraumatismoController from '../protocols/Atualizados/controllers/calculators/politraumatismo.controller.ts';
import simPController from '../protocols/Atualizados/controllers/calculators/simP.controller.ts';
import sragController from '../protocols/Atualizados/controllers/calculators/srag.controller.ts';
import violenciaSexualController from '../protocols/Atualizados/controllers/calculators/violenciaSexual.controller.ts';

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
  
  // Verificar qual tipo de controller é e extrair dados apropriadamente
  const data: any = {
    controller
  };
  
  // Critérios TCE
  if (controller.getCriteriosTcGerais) {
    data.criterios = controller.getCriteriosTcGerais();
  }
  
  // Escala Glasgow
  if (controller.getEscalaGlasgow) {
    data.escalaGlasgow = controller.getEscalaGlasgow();
  }
  
  // Critérios diagnósticos (para anafilaxia e outros)
  if (controller.getCriteriosDiagnosticos) {
    data.criteriosDiagnosticos = controller.getCriteriosDiagnosticos();
  }
  
  // Manifestações clínicas
  if (controller.getManifestacoesClinias) {
    data.manifestacoesClinias = controller.getManifestacoesClinias();
  } else if (controller.getManifestacaoesClinicas) {
    data.manifestacoesClinias = controller.getManifestacaoesClinicas();
  }
  
  return data;
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
