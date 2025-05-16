
import { Pill, Syringe, Stethoscope, Calendar, HelpCircle } from 'lucide-react'; // HelpCircle como fallback
import { MockMedicationData, CategoryInfo } from '@/types/medication';
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
  { title: 'Oftalmológicos', slug: slugify('Oftalmológicos'), icon: Pill, iconColorClass: 'text-blue-400', bgColorClass: 'bg-blue-50' }, // Example, Eye not available
  { title: 'Otológicas', slug: slugify('Otológicas'), icon: Pill, iconColorClass: 'text-teal-400', bgColorClass: 'bg-teal-50' }, // Example, Ear not available
  { title: 'Uso Tópico - Externo', slug: slugify('Uso Tópico - Externo'), icon: Pill, iconColorClass: 'text-pink-400', bgColorClass: 'bg-pink-50' }, // Example, Hand/Layers not available
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
      { name: 'Hidrocortisona', form: 'em Pó / Pomada', application: 'EV / IM' },
      { name: 'Noradrenalina', form: 'Hypnor®', application: 'EV / IM' },
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
      { name: 'Amoxicilina', form: 'Suspensão Oral', application: 'VO' },
      { name: 'Azitromicina', form: 'Comprimido', application: 'VO' },
      { name: 'Cefalexina', form: 'Suspensão Oral', application: 'VO' },
    ],
  },
  // Adicione mock data para outras categorias conforme necessário
  // Exemplo para Analgésicos:
   [slugify('Analgésicos e Antitérmicos')]: {
    title: 'Analgésicos e Antitérmicos',
    slug: slugify('Analgésicos e Antitérmicos'),
    icon: Pill,
    iconColorClass: 'text-teal-500',
    bgColorClass: 'bg-teal-100',
    medicationsCount: 2,
    lastUpdated: 'Mar/2025',
    medications: [
      { name: 'Paracetamol', form: 'Gotas / Comprimido', application: 'VO' },
      { name: 'Dipirona', form: 'Gotas / Supositório', application: 'VO / Retal' },
    ],
  },
};

// Preencher mock data para todas as categorias, mesmo que vazias por enquanto
allCategories.forEach(cat => {
  if (!mockMedicationsData[cat.slug]) {
    mockMedicationsData[cat.slug] = {
      ...cat,
      medicationsCount: 0,
      lastUpdated: 'Dez/2024', // Default date
      medications: [],
    };
  }
});
