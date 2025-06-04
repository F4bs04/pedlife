import {
  Pill,
  Syringe,
  Stethoscope,
  HeartPulse,
  Microscope,
  FlaskConical,
  Bone,
  Brain,
  Activity, // Used instead of Lungs
  LucideIcon,
  Baby,
  ShieldAlert, // Used instead of Virus
  Thermometer,
  Ear,
  Eye,
  Package,
  Droplets,
  TestTube2,
} from 'lucide-react';
import { slugify } from '@/lib/utils';
import { MockMedicationData, CategoryInfo, MedicationCategoryData, Medication, DosageCalculationParams } from '@/types/medication';
// Removido import do mathjs pois estamos usando Function para avaliação segura

// Importando o JSON do banco de dosagens
import jsonDataFormatado from '@/medications/banco_dosagens_medicas_formatado.json';
// Importando o arquivo banco_dosagens_medicas.json que criamos
import medicationsData from '@/medications/banco_dosagens_medicas.json';

// Mapeamento de categorias para ícones e cores
const categoryIconMap: Record<string, { icon: LucideIcon; iconColorClass: string; bgColorClass: string }> = {
  'Antibiótico Vo': { icon: Pill, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
  'Analgésicos E Antitérmicos': { icon: Thermometer, iconColorClass: 'text-teal-500', bgColorClass: 'bg-teal-100' },
  'Antieméticos': { icon: Package, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-100' },
  'Antialérgicos': { icon: ShieldAlert, iconColorClass: 'text-pink-500', bgColorClass: 'bg-pink-100' },
  'Corticoide Oral': { icon: Pill, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-100' },
  'Corticoides Ev': { icon: Syringe, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-100' },
  'Anafilaxia': { icon: HeartPulse, iconColorClass: 'text-red-600', bgColorClass: 'bg-red-100' },
  'Diuréticos': { icon: Droplets, iconColorClass: 'text-cyan-500', bgColorClass: 'bg-cyan-100' },
  'Pcr': { icon: HeartPulse, iconColorClass: 'text-red-700', bgColorClass: 'bg-red-200' },
  'Taquicardia Supraventricular': { icon: Activity, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-100' },
  'Antivirais': { icon: ShieldAlert, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-100' },
  'Antibióticos Ev': { icon: Syringe, iconColorClass: 'text-blue-600', bgColorClass: 'bg-blue-100' },
  'Antibióticos Im': { icon: Syringe, iconColorClass: 'text-blue-700', bgColorClass: 'bg-blue-200' },
  'Sedativos': { icon: Brain, iconColorClass: 'text-purple-600', bgColorClass: 'bg-purple-100' },
  'Bloqueador Neuromuscular': { icon: Brain, iconColorClass: 'text-gray-600', bgColorClass: 'bg-gray-100' },
  'Medicação Para Bradicardia': { icon: HeartPulse, iconColorClass: 'text-yellow-600', bgColorClass: 'bg-yellow-100' },
  'Anticonvulsivantes': { icon: Brain, iconColorClass: 'text-indigo-600', bgColorClass: 'bg-indigo-100' },
  'Drogas De Infusão Contínua': { icon: Syringe, iconColorClass: 'text-purple-700', bgColorClass: 'bg-purple-200' },
  'Fluidoterapia Para Rn Sintomáticos': { icon: Droplets, iconColorClass: 'text-blue-400', bgColorClass: 'bg-blue-50' },
  'Fluidoterapia | Hidratacao': { icon: Droplets, iconColorClass: 'text-cyan-600', bgColorClass: 'bg-cyan-100' },
  'Antagonistas': { icon: FlaskConical, iconColorClass: 'text-gray-700', bgColorClass: 'bg-gray-100' },
  'Broncodilatadores': { icon: Activity, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-100' },
  'Probióticos E Repositores De Flora': { icon: Microscope, iconColorClass: 'text-green-600', bgColorClass: 'bg-green-100' },
  'Laxantes': { icon: Package, iconColorClass: 'text-brown-500', bgColorClass: 'bg-brown-100' },
  'Controle E Prevenção De Sangramentos': { icon: HeartPulse, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-100' },
  'Minerais E Vitaminas': { icon: TestTube2, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-100' },
  'Antiparasitários': { icon: Microscope, iconColorClass: 'text-yellow-600', bgColorClass: 'bg-yellow-100' },
  'Aerosol Hipertônico - Laringite/Bva': { icon: Activity, iconColorClass: 'text-teal-600', bgColorClass: 'bg-teal-100' },
  'Xaropes/Tosse': { icon: Package, iconColorClass: 'text-amber-500', bgColorClass: 'bg-amber-100' },
  'Oftalmológicos': { icon: Eye, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
  'Otologicas': { icon: Ear, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-100' },
  'Nasais': { icon: Package, iconColorClass: 'text-green-400', bgColorClass: 'bg-green-50' },
  'Uso Tópico - Externo': { icon: Package, iconColorClass: 'text-pink-600', bgColorClass: 'bg-pink-100' },
  'Quimioprofilaxia (Influenza)': { icon: ShieldAlert, iconColorClass: 'text-indigo-500', bgColorClass: 'bg-indigo-100' },
  'Antiviral - Influenza Positivo': { icon: ShieldAlert, iconColorClass: 'text-red-400', bgColorClass: 'bg-red-50' },
};

// Função para extrair informações de concentração do texto da lógica
function extractConcentration(logicaJs: string): string {
  const concentrationMatch = logicaJs.match(/(\d+(?:\.\d+)?)\s*mg\/(\d+(?:\.\d+)?)\s*ml/i);
  if (concentrationMatch) {
    return `${concentrationMatch[1]}mg/${concentrationMatch[2]}mL`;
  }
  
  const gotsMatch = logicaJs.match(/(\d+)\s*mg\/ml.*gotas/i);
  if (gotsMatch) {
    return `${gotsMatch[1]}mg/mL (Gotas)`;
  }
  
  return 'Concentração não especificada';
}

// Função para extrair intervalo de dosagem
function extractDoseInterval(logicaJs: string): string {
  const intervalMatch = logicaJs.match(/de (\d+\/\d+ horas)/);
  if (intervalMatch) {
    return intervalMatch[1];
  }
  
  if (logicaJs.includes('uma vez ao dia')) {
    return 'Uma vez ao dia';
  }
  
  if (logicaJs.includes('dose única')) {
    return 'Dose única';
  }
  
  return 'Conforme prescrição médica';
}

// Função para extrair duração do tratamento
function extractTreatmentDuration(logicaJs: string): string {
  const durationMatch = logicaJs.match(/por (\d+(?:-\d+)?\s*dias?)/i);
  if (durationMatch) {
    return durationMatch[1].trim();
  }
  
  if (logicaJs.includes('dose única')) {
    return 'Dose única';
  }
  
  return 'Conforme prescrição médica';
}

// Função para extrair parâmetros de cálculo da lógica JavaScript
function extractCalculationParams(medicamento: string, logicaJs: string): DosageCalculationParams {
  const params: DosageCalculationParams = {
    type: slugify(medicamento),
    originalLogic: logicaJs,
    jsLogic: logicaJs, // Armazenando a lógica JavaScript original
    mgPerKg: 0,
    maxDailyDoseMg: 0,
    dosesPerDay: 1,
    concentrationNumeratorMg: 0,
    concentrationDenominatorMl: 1
  };

  // Extrair concentração (ex: 250mg/5ml)
  const concentrationMatch = logicaJs.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*(\d+(?:\.\d+)?)\s*ml/i);
  if (concentrationMatch) {
    params.concentrationNumeratorMg = parseFloat(concentrationMatch[1]);
    params.concentrationDenominatorMl = parseFloat(concentrationMatch[2]);
  }

  // Extrair dose por kg (ex: peso*10)
  const dosePerKgMatch = logicaJs.match(/peso\s*\*\s*(\d+(?:\.\d+)?)/i);
  if (dosePerKgMatch) {
    params.mgPerKg = parseFloat(dosePerKgMatch[1]);
  }

  // Extrair número de doses por dia
  if (logicaJs.includes('8/8 horas')) {
    params.dosesPerDay = 3;
  } else if (logicaJs.includes('12/12 horas')) {
    params.dosesPerDay = 2;
  } else if (logicaJs.includes('6/6 horas')) {
    params.dosesPerDay = 4;
  } else if (logicaJs.includes('4/4 horas')) {
    params.dosesPerDay = 6;
  }

  // Extrair dose máxima diária (se disponível)
  const maxDoseMatch = logicaJs.match(/Math\.min\([^,]+,\s*(\d+)\)/i) || 
                       logicaJs.match(/MIN\([^,]+,\s*(\d+)\)/i);
  if (maxDoseMatch) {
    params.maxDailyDoseMg = parseFloat(maxDoseMatch[1]);
  }

  return params;
}

// Função para avaliar com segurança a lógica JavaScript do JSON
function safeEvaluateLogic(logic: string, weight: number, age: number): number {
  try {
    // Substituir variáveis comuns usadas nas expressões
    let sanitizedLogic = logic
      .replace(/\bpeso\b/gi, weight.toString())
      .replace(/\bidade\b/gi, age.toString())
      .replace(/\bMIN\b/g, 'Math.min')
      .replace(/\bMAX\b/g, 'Math.max')
      .replace(/\bROUND\b/g, 'Math.round')
      .replace(/\bFLOOR\b/g, 'Math.floor')
      .replace(/\bCEIL\b/g, 'Math.ceil');
    
    // Extrair apenas a parte da expressão matemática
    const mathExpression = sanitizedLogic.match(/[\d\s\*\/\+\-\(\)\.\,\<\>\=\?\:\&\|\!Math\s\.min\s\.max\s\.round\s\.floor\s\.ceil]+/);
    if (!mathExpression) {
      throw new Error('Expressão matemática não encontrada');
    }
    
    // Avaliar a expressão usando Function (mais seguro que eval)
    // eslint-disable-next-line no-new-func
    const result = Function('Math', `"use strict"; return (${mathExpression[0]});`)(Math);
    return typeof result === 'number' ? result : 0;
  } catch (error) {
    console.error('Erro ao avaliar lógica:', error, logic);
    return 0;
  }
}

// Função para calcular a dose com base na lógica do JSON
export function calculateDosage(weight: number, params: DosageCalculationParams, age: number = 5): { dose: number; volume: number; doseText: string } {
  try {
    if (!params.originalLogic) {
      throw new Error('Lógica de cálculo não definida');
    }

    // Tentar usar a lógica JavaScript diretamente do JSON
    let doseMg = 0;
    if (params.originalLogic) {
      // Extrair a parte da lógica que calcula a dose
      doseMg = safeEvaluateLogic(params.originalLogic, weight, age);
    } else if (params.mgPerKg) {
      // Fallback para o cálculo baseado em parâmetros extraídos
      doseMg = weight * params.mgPerKg;
      
      // Aplicar dose máxima diária se definida
      if (params.maxDailyDoseMg && doseMg > params.maxDailyDoseMg) {
        doseMg = params.maxDailyDoseMg;
      }
    }

    // Calcular volume em mL
    let volumeMl = 0;
    if (params.concentrationNumeratorMg && params.concentrationDenominatorMl) {
      const concentration = params.concentrationNumeratorMg / params.concentrationDenominatorMl; // mg/mL
      volumeMl = doseMg / concentration;
    }

    // Gerar texto descritivo da dose
    let doseText = '';
    const doseInterval = extractDoseInterval(params.originalLogic);
    const treatmentDuration = extractTreatmentDuration(params.originalLogic);
    
    if (volumeMl > 0) {
      doseText = `Tomar ${volumeMl.toFixed(1)} mL por via oral ${doseInterval.toLowerCase()} por ${treatmentDuration}.`;
    } else {
      doseText = `Dose: ${doseMg.toFixed(1)} mg ${doseInterval.toLowerCase()} por ${treatmentDuration}.`;
    }

    return {
      dose: parseFloat(doseMg.toFixed(2)),
      volume: parseFloat(volumeMl.toFixed(2)),
      doseText: doseText
    };
  } catch (error) {
    console.error('Erro ao calcular dosagem:', error);
    // Não mostrar erro ao usuário, retornar valores padrão
    return { 
      dose: 0, 
      volume: 0, 
      doseText: 'Consulte um profissional de saúde para orientações específicas.' 
    };
  }
}

// Função para determinar via de administração
function determineApplication(medicamento: string, logicaJs: string): string {
  if (logicaJs.includes('por via oral') || logicaJs.includes('VO') || medicamento.includes('Xarope') || medicamento.includes('Gotas')) {
    return 'VO';
  }
  if (logicaJs.includes('EV') || logicaJs.includes('por via EV')) {
    return 'EV';
  }
  if (logicaJs.includes('IM') || logicaJs.includes('por via IM')) {
    return 'IM';
  }
  if (logicaJs.includes('nebulização') || logicaJs.includes('inalação')) {
    return 'Inalatória';
  }
  if (logicaJs.includes('tópica') || logicaJs.includes('pomada') || logicaJs.includes('creme')) {
    return 'Tópica';
  }
  return 'VO'; // Padrão
}

// Função para determinar forma farmacêutica
function determineForm(medicamento: string, logicaJs: string): string {
  if (medicamento.includes('Xarope') || medicamento.includes('xarope')) {
    return 'Suspensão Oral';
  }
  if (medicamento.includes('Gotas') || medicamento.includes('gotas')) {
    return 'Solução Oral em Gotas';
  }
  if (medicamento.includes('Comprimido') || medicamento.includes('comprimido')) {
    return 'Comprimido';
  }
  if (medicamento.includes('Pó') || medicamento.includes('pó')) {
    return 'Pó para Reconstituição';
  }
  if (medicamento.includes('Pomada') || medicamento.includes('pomada')) {
    return 'Pomada';
  }
  if (medicamento.includes('Creme') || medicamento.includes('creme')) {
    return 'Creme';
  }
  if (logicaJs.includes('nebulização')) {
    return 'Solução para Nebulização';
  }
  return 'Suspensão Oral';
}

// Função para organizar medicamentos por categoria
export function organizeMedicationsByCategory(medications: any[]): MockMedicationData {
  const convertedData: MockMedicationData = {};
  const categoriesMap: Record<string, Medication[]> = {};

  // Agrupar medicamentos por categoria (slug)
  medications.forEach((med: any) => {
    const categorySlug = med.slug;
    if (!categoriesMap[categorySlug]) {
      categoriesMap[categorySlug] = [];
    }
    
    // Remover o texto "(Ver descrição)" do nome do medicamento
    const cleanedName = med.name.replace(/\s*\(Ver descrição\)\s*/g, '');

    // Criar objeto de medicamento formatado
    const medication: Medication = {
      name: cleanedName,
      slug: slugify(cleanedName),
      form: med.form || '',
      application: med.application || 'VO',
      description: med.description || 'Consulte um profissional de saúde antes do uso.',
      alerts: med.alerts || ['Verificar alergias antes da administração.', 'Respeitar doses máximas recomendadas.'],
      commonBrandNames: med.commonBrandNames || 'Consultar bula para nomes comerciais',
      dosageInformation: med.dosageInformation || {
        concentration: '',
        usualDose: 'Conforme cálculo baseado em peso/idade',
        doseInterval: 'Conforme prescrição médica',
        treatmentDuration: 'Conforme prescrição médica',
        administrationNotes: 'Seguir orientações médicas específicas'
      },
      calculationParams: {
        type: slugify(med.name),
        originalLogic: med.calculationParams?.logica_js || '',
        jsLogic: med.calculationParams?.logica_js || '',
        logica_js: med.calculationParams?.logica_js || '',
        mgPerKg: 0,
        maxDailyDoseMg: 0,
        dosesPerDay: 1
      }
    };
    
    categoriesMap[categorySlug].push(medication);
  });

  // Mapear categorias para o formato final
  for (const categorySlug in categoriesMap) {
    // Encontrar um nome de categoria mais amigável baseado no slug
    let categoryTitle = categorySlug.replace(/-/g, ' ');
    categoryTitle = categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1);
    
    // Obter informações de ícone e cores para a categoria
    const categoryInfo = Object.entries(categoryIconMap).find(([key]) => 
      slugify(key) === categorySlug
    );
    
    const iconInfo = categoryInfo ? categoryInfo[1] : {
      icon: Package,
      iconColorClass: 'text-gray-500',
      bgColorClass: 'bg-gray-100'
    };

    convertedData[categorySlug] = {
      title: categoryTitle,
      slug: categorySlug,
      icon: iconInfo.icon,
      iconColorClass: iconInfo.iconColorClass,
      bgColorClass: iconInfo.bgColorClass,
      medicationsCount: categoriesMap[categorySlug].length,
      lastUpdated: 'Jun/2025',
      medications: categoriesMap[categorySlug],
    };
  }

  return convertedData;
}

// Convertendo os dados do banco_dosagens_medicas
const mockMedicationsData: MockMedicationData = organizeMedicationsByCategory(medicationsData);

// Exportando os dados de medicamentos
export { mockMedicationsData };

// Gerando as categorias dinamicamente baseadas nos medicamentos
const allCategories: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>[] = 
  Object.keys(mockMedicationsData).map(categorySlug => {
    const category = mockMedicationsData[categorySlug];
    return {
      title: category.title,
      slug: category.slug,
      icon: category.icon,
      iconColorClass: category.iconColorClass,
      bgColorClass: category.bgColorClass,
    };
  });
  
// Exportando as categorias
export { allCategories };

// Atualizando as categorias com os dados convertidos
allCategories.forEach(category => {
  const categoryData = mockMedicationsData[category.slug];
  if (categoryData) {
    (category as CategoryInfo).medicationsCount = categoryData.medications.length;
    (category as CategoryInfo).lastUpdated = categoryData.lastUpdated || 'Dez/2024';
    // Garantindo que o ícone seja consistente
    if (allCategories.find(c => c.slug === category.slug)) {
      const catInfo = allCategories.find(c => c.slug === category.slug);
      if (catInfo) categoryData.icon = catInfo.icon;
    }
  } else {
    (category as CategoryInfo).medicationsCount = 0;
    (category as CategoryInfo).lastUpdated = 'N/A';
  }
});
