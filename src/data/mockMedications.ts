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

// Importando o JSON do banco de dosagens
import jsonData from '@/medications/banco_dosagens_medicas_formatado.json';

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
  const durationMatch = logicaJs.match(/por (\d+(?:-\d+)? dias?)/i);
  if (durationMatch) {
    return durationMatch[1];
  }
  
  if (logicaJs.includes('dose única')) {
    return 'Dose única';
  }
  
  return 'Conforme prescrição médica';
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

// Função para converter medicamentos do JSON
function convertMedications(jsonData: any): MockMedicationData {
  const convertedData: MockMedicationData = {};

  // Iterar sobre cada categoria no JSON
  for (const category in jsonData) {
    if (category === 'Outros') continue; // Pular categoria "Outros" que contém apenas variáveis

    const categoryInfo = categoryIconMap[category] || {
      icon: Package,
      iconColorClass: 'text-gray-500',
      bgColorClass: 'bg-gray-100'
    };

    const medications: Medication[] = jsonData[category].map((med: any) => {
      const medicationName = med.medicamento;
      const logicaJs = med.logica_js;
      
      return {
        name: medicationName,
        slug: slugify(medicationName),
        form: determineForm(medicationName, logicaJs),
        application: determineApplication(medicationName, logicaJs),
        description: `Medicamento da categoria ${category}. Consulte sempre um profissional de saúde antes do uso.`,
        alerts: ['Verificar alergias antes da administração.', 'Respeitar doses máximas recomendadas.'],
        commonBrandNames: 'Consultar bula para nomes comerciais',
        dosageInformation: {
          concentration: extractConcentration(logicaJs),
          usualDose: 'Conforme cálculo baseado em peso/idade',
          doseInterval: extractDoseInterval(logicaJs),
          treatmentDuration: extractTreatmentDuration(logicaJs),
          administrationNotes: 'Seguir orientações médicas específicas'
        },
        calculationParams: {
          type: slugify(medicationName),
          originalLogic: logicaJs, // Mantendo a lógica original para referência
          mgPerKg: 10, // Valor padrão - deve ser extraído da lógica específica
          maxDailyDoseMg: 1000, // Valor padrão - deve ser extraído da lógica específica
          dosesPerDay: 1, // Valor padrão - deve ser extraído da lógica específica
        } as DosageCalculationParams,
      };
    });

    convertedData[slugify(category)] = {
      title: category,
      slug: slugify(category),
      icon: categoryInfo.icon,
      iconColorClass: categoryInfo.iconColorClass,
      bgColorClass: categoryInfo.bgColorClass,
      medicationsCount: medications.length,
      lastUpdated: 'Dez/2024',
      medications: medications,
    };
  }

  return convertedData;
}

// Gerando as categorias dinamicamente baseadas no JSON
export const allCategories: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>[] = 
  Object.keys(jsonData)
    .filter(category => category !== 'Outros') // Excluir categoria "Outros"
    .map(category => {
      const categoryInfo = categoryIconMap[category] || {
        icon: Package,
        iconColorClass: 'text-gray-500',
        bgColorClass: 'bg-gray-100'
      };
      
      return {
        title: category,
        slug: slugify(category),
        icon: categoryInfo.icon,
        iconColorClass: categoryInfo.iconColorClass,
        bgColorClass: categoryInfo.bgColorClass,
      };
    });

// Convertendo os dados do JSON
export const mockMedicationsData: MockMedicationData = convertMedications(jsonData);

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
