import { Pill, Syringe, Stethoscope, Plus, AlertTriangle, Info } from 'lucide-react'; // Adicionado Plus
import { MockMedicationData, CategoryInfo, Medication } from '@/types/medication';
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
    medicationsCount: 3,
    lastUpdated: 'Fev/2025',
    medications: [
      { name: 'Amoxicilina', slug: slugify('Amoxicilina'), form: 'Suspensão Oral', application: 'VO' },
      { name: 'Azitromicina', slug: slugify('Azitromicina'), form: 'Comprimido', application: 'VO' },
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
    mockMedicationsData[cat.slug].medications = mockMedicationsData[cat.slug].medications.map(m => ({
      ...m,
      slug: m.slug || slugify(m.name),
    }));
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
