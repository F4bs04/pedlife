import { Pill, Syringe, Stethoscope, Plus, AlertTriangle, Info } from 'lucide-react';
import { MockMedicationData, CategoryInfo, Medication, DosageCalculationParams } from '@/types/medication';
import { slugify } from '@/lib/utils';

// Helper para criar informações de categoria, para evitar repetição na CalculatorPage
export const allCategories: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>[] = [
  { title: 'Antibióticos VO', slug: slugify('Antibióticos VO'), icon: Pill, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
  { title: 'Analgésicos e Antitérmicos', slug: slugify('Analgésicos e Antitérmicos'), icon: Pill, iconColorClass: 'text-teal-500', bgColorClass: 'bg-teal-100' },
  { title: 'Antieméticos AD', slug: slugify('Antieméticos AD'), icon: Pill, iconColorClass: 'text-cyan-500', bgColorClass: 'bg-cyan-100' },
  { title: 'Antialérgicos', slug: slugify('Antialérgicos'), icon: Pill, iconColorClass: 'text-indigo-500', bgColorClass: 'bg-indigo-100' },
  { title: 'Corticoide Oral', slug: slugify('Corticoide Oral'), icon: Pill, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-100' },
  { title: 'Corticoides EV', slug: slugify('Corticoides EV'), icon: Syringe, iconColorClass: 'text-pink-500', bgColorClass: 'bg-pink-100' },
  { title: 'Anafilaxia', slug: slugify('Anafilaxia'), icon: Syringe, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-100' },
  { title: 'Diuréticos', slug: slugify('Diuréticos'), icon: Pill, iconColorClass: 'text-lime-500', bgColorClass: 'bg-lime-100' },
  { title: 'Antibióticos IM', slug: slugify('Antibióticos IM'), icon: Syringe, iconColorClass: 'text-sky-500', bgColorClass: 'bg-sky-100' },
  { title: 'Sedativos', slug: slugify('Sedativos'), icon: Pill, iconColorClass: 'text-gray-500', bgColorClass: 'bg-gray-100' },
  { title: 'Medicação para Bradicardia', slug: slugify('Medicação para Bradicardia'), icon: Pill, iconColorClass: 'text-rose-500', bgColorClass: 'bg-rose-100' },
  { title: 'Drogas de Infusão Contínua', slug: slugify('Drogas de Infusão Contínua'), icon: Syringe, iconColorClass: 'text-amber-500', bgColorClass: 'bg-amber-100' },
  { title: 'Antagonistas', slug: slugify('Antagonistas'), icon: Pill, iconColorClass: 'text-yellow-500', bgColorClass: 'bg-yellow-100' },
  { title: 'Broncodilatadores', slug: slugify('Broncodilatadores'), icon: Stethoscope, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-100' },
  { title: 'Probióticos e Repositores de Flora', slug: slugify('Probióticos e Repositores de Flora'), icon: Pill, iconColorClass: 'text-emerald-500', bgColorClass: 'bg-emerald-100' },
  { title: 'Laxantes', slug: slugify('Laxantes'), icon: Pill, iconColorClass: 'text-fuchsia-500', bgColorClass: 'bg-fuchsia-100' },
  { title: 'Controle e Prevenção de Sangramentos', slug: slugify('Controle e Prevenção de Sangramentos'), icon: Pill, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-100' },
  { title: 'Minerais e Vitaminas', slug: slugify('Minerais e Vitaminas'), icon: Pill, iconColorClass: 'text-violet-500', bgColorClass: 'bg-violet-100' },
  { title: 'Oftalmológicos', slug: slugify('Oftalmológicos'), icon: Pill, iconColorClass: 'text-blue-400', bgColorClass: 'bg-blue-50' }, 
  { title: 'Otológicas', slug: slugify('Otológicas'), icon: Pill, iconColorClass: 'text-teal-400', bgColorClass: 'bg-teal-50' }, 
  { title: 'Uso Tópico - Externo', slug: slugify('Uso Tópico - Externo'), icon: Pill, iconColorClass: 'text-pink-400', bgColorClass: 'bg-pink-50' },
  { 
    title: 'Cálculo de Insulina', 
    slug: 'insulina', // Rota: /platform/calculator/insulina
    icon: Plus, // Usando um ícone permitido
    iconColorClass: 'text-orange-500', 
    bgColorClass: 'bg-orange-100' 
  },
];

export const mockMedicationsData: MockMedicationData = {
  [slugify('Corticoides EV')]: {
    title: 'Corticoides EV',
    slug: slugify('Corticoides EV'),
    icon: Syringe,
    iconColorClass: 'text-pink-500',
    bgColorClass: 'bg-pink-100',
    medicationsCount: 2,
    lastUpdated: 'Jan/2025',
    medications: [
      { 
        name: 'Hidrocortisona', 
        slug: slugify('Hidrocortisona'),
        form: 'Pó para solução injetável', 
        application: 'EV / IM',
        description: 'A hidrocortisona é um corticoide com potente ação anti-inflamatória, antialérgica e antirreumática.',
        alerts: ['Usar com cautela em pacientes com infecções ativas.', 'Pode mascarar sinais de infecção.'],
        commonBrandNames: 'Solu-Cortef®, Hidrocor®, Cortisonal®',
        dosageInformation: {
          concentration: '100mg, 250mg, 500mg (frasco-ampola)',
          usualDose: 'Anti-inflamatório/imunossupressor: 0.5-2mg/kg/dose a cada 6h. Crise asmática: 2mg/kg/dose EV (max 250mg).',
          doseInterval: 'A cada 6 horas',
          treatmentDuration: 'Variável conforme indicação',
          administrationNotes: 'Reconstituir com água para injetáveis. Administrar lentamente por via EV ou IM profunda.'
        }
      },
      { name: 'Dexametasona', slug: slugify('Dexametasona'), form: 'Solução injetável', application: 'EV / IM' },
    ],
  },
  [slugify('Antibióticos VO')]: {
    title: 'Antibióticos VO',
    slug: slugify('Antibióticos VO'),
    icon: Pill,
    iconColorClass: 'text-blue-500',
    bgColorClass: 'bg-blue-100',
    medicationsCount: 5, // Incremented from 4 to 5
    lastUpdated: 'Mai/2025', 
    medications: [
      { 
        name: 'Amoxicilina', 
        slug: slugify('Amoxicilina'), 
        form: 'Xarope (suspensão oral)', 
        application: 'VO',
        description: 'A amoxicilina é um antibiótico beta-lactâmico usado para tratar uma variedade de infecções bacterianas (apresentação 250mg/5mL).',
        alerts: ['Alergia a penicilinas é uma contraindicação.', 'Pode causar distúrbios gastrointestinais.'],
        commonBrandNames: 'Amoxil®, Novocilin®, Velamox® (para 250mg/5mL)',
        dosageInformation: {
          concentration: '250 mg / 5 mL',
          usualDose: 'Pediátrico: 25-50 mg/kg/dia divididos a cada 8 horas. Adultos: 250-500 mg a cada 8 horas.',
          doseInterval: 'A cada 8 horas (3 vezes ao dia)',
          treatmentDuration: 'De 7 a 10 dias',
          administrationNotes: 'Pode ser administrado com ou sem alimentos. Agitar bem a suspensão antes de usar.'
        },
        calculationParams: { 
          type: 'amoxicilina_suspension_250_5',
          mgPerKg: 50,
          maxDailyDoseMg: 1750,
          dosesPerDay: 3,
          concentrationNumeratorMg: 250, 
          concentrationDenominatorMl: 5,   
          maxVolumePerDoseBeforeCapMl: 12, 
          cappedVolumeAtMaxMl: 10          
        } as DosageCalculationParams 
      },
      { 
        name: 'Amoxicilina Tri-hidratada', 
        slug: slugify('Amoxicilina Tri-hidratada'), 
        form: 'Xarope (suspensão oral)',
        application: 'VO',
        description: 'Amoxicilina tri-hidratada é um antibiótico beta-lactâmico de amplo espectro (apresentação 400mg/5mL).',
        alerts: ['Contraindicado para pacientes com histórico de reação alérgica às penicilinas.', 'Ajustar dose em insuficiência renal.'],
        commonBrandNames: 'Amoxil BD®, Novocilin BD® (para 400mg/5mL)',
        dosageInformation: {
          concentration: '400 mg / 5 mL',
          usualDose: 'Conforme cálculo por peso (tipicamente 50 mg/kg/dia).',
          doseInterval: 'A cada 8 horas (3 vezes ao dia)',
          treatmentDuration: 'De 7 a 10 dias',
          administrationNotes: 'Agitar bem antes de usar. Pode ser administrado com ou sem alimentos. Completar o tratamento mesmo com melhora dos sintomas.'
        },
        calculationParams: {
          type: 'amoxicilina_suspension_400_5',
          mgPerKg: 50,
          maxDailyDoseMg: 1750,
          dosesPerDay: 3,
          concentrationNumeratorMg: 400,
          concentrationDenominatorMl: 5,
          maxVolumePerDoseBeforeCapMl: 12,
          cappedVolumeAtMaxMl: 10
        } as DosageCalculationParams
      },
      { 
        name: 'Azitromicina Di-hidratada',
        slug: slugify('Azitromicina Di-hidratada'),
        form: 'Xarope (suspensão oral)',
        application: 'VO',
        description: 'Antibiótico macrolídeo utilizado para tratar diversas infecções bacterianas (apresentação 200mg/5mL).',
        alerts: ['Alergia a macrolídeos é uma contraindicação.', 'Pode causar distúrbios gastrointestinais.', 'Monitorar função hepática em tratamentos prolongados.'],
        commonBrandNames: 'Astro®, Zitromax®, Azitromicina Genérico',
        dosageInformation: {
          concentration: '200 mg / 5 mL',
          usualDose: '10 mg/kg/dia, máximo de 1000 mg/dia.',
          doseInterval: 'Uma vez ao dia (1x/dia)',
          treatmentDuration: 'De 3 a 5 dias',
          administrationNotes: 'Pode ser administrado com ou sem alimentos. Agitar bem a suspensão antes de usar. Administrar pelo menos 1 hora antes ou 2 horas após antiácidos.'
        },
        calculationParams: {
          type: 'azitromicina_suspensao_200_5',
          mgPerKg: 10,
          maxDailyDoseMg: 1000,
          dosesPerDay: 1,
          concentrationNumeratorMg: 200,
          concentrationDenominatorMl: 5,
        } as DosageCalculationParams
      },
      { name: 'Azitromicina', slug: slugify('Azitromicina'), form: 'Comprimido', application: 'VO' }, // Placeholder, pode ser atualizado/removido depois
      { name: 'Cefalexina', slug: slugify('Cefalexina'), form: 'Suspensão Oral', application: 'VO' },
    ],
  },
  [slugify('Analgésicos e Antitérmicos')]: {
    title: 'Analgésicos e Antitérmicos',
    slug: slugify('Analgésicos e Antitérmicos'),
    icon: Pill,
    iconColorClass: 'text-teal-500',
    bgColorClass: 'bg-teal-100',
    medicationsCount: 2,
    lastUpdated: 'Mar/2025',
    medications: [
      { name: 'Paracetamol', slug: slugify('Paracetamol'), form: 'Gotas / Comprimido', application: 'VO' },
      { name: 'Dipirona', slug: slugify('Dipirona'), form: 'Gotas / Supositório', application: 'VO / Retal' },
    ],
  },
};

// Preencher mock data para todas as categorias, mesmo que vazias por enquanto
allCategories.forEach(cat => {
  if (!mockMedicationsData[cat.slug]) {
    mockMedicationsData[cat.slug] = {
      ...cat,
      // Para categorias como 'insulina' que não são de medicação, medications pode ser vazio.
      medicationsCount: mockMedicationsData[cat.slug]?.medications?.length || 0, 
      lastUpdated: 'Dez/2024', 
      medications: mockMedicationsData[cat.slug]?.medications?.map(m => ({...m, slug: slugify(m.name)})) || [],
    };
  } else { 
    // Certifique-se de que o slug exista para todos os medicamentos e atualize a contagem
    mockMedicationsData[cat.slug].medications = mockMedicationsData[cat.slug].medications.map(m => ({
      ...m,
      slug: m.slug || slugify(m.name), // Ensure slug exists
    }));
    // Atualiza a contagem de medicamentos para refletir quaisquer adições ou remoções
    mockMedicationsData[cat.slug].medicationsCount = mockMedicationsData[cat.slug].medications.length;
  }
  // Garante que a categoria base (sem medicamentos) seja adicionada se não existir
   if (cat.slug === 'insulina' && !mockMedicationsData['insulina']) {
    mockMedicationsData['insulina'] = {
        title: cat.title,
        slug: cat.slug,
        icon: cat.icon,
        iconColorClass: cat.iconColorClass,
        bgColorClass: cat.bgColorClass,
        medicationsCount: 0,
        lastUpdated: 'Mai/2025', // Data atual
        medications: []
    };
  }
});
