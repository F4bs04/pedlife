import {
  Pill,
  Syringe,
  Stethoscope,
  HeartPulse,
  Microscope,
  FlaskConical,
  Bone,
  Brain,
  Lungs,
  LucideIcon,
  Baby,
  ShieldAlert,
  Thermometer,
  Ear,
  Eye,
  Package,
  Activity,
  Droplets,
  TestTube2,
  Virus
} from 'lucide-react';
import { slugify } from '@/lib/utils';
import { MockMedicationData, CategoryInfo, MedicationCategoryData, Medication, DosageCalculationParams } from '@/types/medication';

export const allCategories: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>[] = [
  { title: 'Antibióticos VO', slug: slugify('Antibióticos VO'), icon: Pill, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
  { title: 'Analgésicos e Antitérmicos', slug: slugify('Analgésicos e Antitérmicos'), icon: Thermometer, iconColorClass: 'text-teal-500', bgColorClass: 'bg-teal-100' },
  { title: 'Corticoides EV', slug: slugify('Corticoides EV'), icon: Syringe, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-100' },
  { title: 'Antieméticos', slug: slugify('Antieméticos'), icon: Package, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-100' },
  { title: 'Broncodilatadores', slug: slugify('Broncodilatadores'), icon: Lungs, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-100' },
  { title: 'Outras Classes', slug: slugify('Outras Classes'), icon: Activity, iconColorClass: 'text-yellow-500', bgColorClass: 'bg-yellow-100' },
  { title: 'Fluidos e Eletrólitos', slug: slugify('Fluidos e Eletrólitos'), icon: Droplets, iconColorClass: 'text-cyan-500', bgColorClass: 'bg-cyan-100' },
  { title: 'Vitaminas e Suplementos', slug: slugify('Vitaminas e Suplementos'), icon: TestTube2, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-100' },
  { title: 'Antivirais', slug: slugify('Antivirais'), icon: Virus, iconColorClass: 'text-pink-500', bgColorClass: 'bg-pink-100' },
];

export const mockMedicationsData: MockMedicationData = {
  [slugify('Antibióticos VO')]: {
    title: 'Antibióticos VO',
    slug: slugify('Antibióticos VO'),
    icon: Pill,
    iconColorClass: 'text-blue-500',
    bgColorClass: 'bg-blue-100',
    medicationsCount: 3,
    lastUpdated: 'Mai/2025',
    medications: [
      {
        name: 'Amoxicilina',
        slug: slugify('Amoxicilina'),
        form: 'Suspensão Oral',
        application: 'VO',
        description: 'Antibiótico beta-lactâmico comum para infecções bacterianas.',
        alerts: ['Alergia à penicilina é uma contraindicação.'],
        commonBrandNames: 'Amoxil®, Novocilin®, Velamox®',
        dosageInformation: {
          concentration: '250mg/5mL',
          usualDose: 'Varia conforme a infecção e peso.',
          doseInterval: '8/8 horas ou 12/12 horas',
          treatmentDuration: '7-10 dias geralmente',
        },
        calculationParams: {
          type: 'amoxicilina_suspension_250_5',
          mgPerKg: 50,
          maxDailyDoseMg: 2000,
          dosesPerDay: 3,
          concentrationNumeratorMg: 250,
          concentrationDenominatorMl: 5,
          maxVolumePerDoseBeforeCapMl: 10,
          cappedVolumeAtMaxMl: 10,
        } as DosageCalculationParams,
      },
      {
        name: 'Amoxicilina Tri-hidratada',
        slug: slugify('Amoxicilina Tri-hidratada'),
        form: 'Suspensão Oral',
        application: 'VO',
        description: 'Formulação de amoxicilina com clavulanato, ampliando espectro.',
        alerts: ['Alergia à penicilina.', 'Ajustar dose em insuficiência renal.'],
        commonBrandNames: 'Clavulin®, SigmaClav BD®, Novamox 2X®',
        dosageInformation: {
          concentration: '400mg/5mL (Amoxicilina)',
          usualDose: 'Baseado no componente amoxicilina.',
          doseInterval: '12/12 horas',
          treatmentDuration: '7-14 dias',
        },
        calculationParams: {
          type: 'amoxicilina_suspension_400_5',
          mgPerKg: 45,
          maxDailyDoseMg: 1000,
          dosesPerDay: 2,
          concentrationNumeratorMg: 400,
          concentrationDenominatorMl: 5,
          maxVolumePerDoseBeforeCapMl: 7.5,
          cappedVolumeAtMaxMl: 7.5,
        } as DosageCalculationParams,
      },
      {
        name: 'Azitromicina Di-hidratada',
        slug: slugify('Azitromicina Di-hidratada'),
        form: 'Suspensão Oral',
        application: 'VO',
        description: 'Antibiótico macrolídeo para diversas infecções.',
        alerts: ['Pode interagir com outros medicamentos.'],
        commonBrandNames: 'Astro®, Zitromax®, Azitrokids®',
        dosageInformation: {
          concentration: '200mg/5mL',
          usualDose: '10 mg/kg/dia',
          doseInterval: 'Uma vez ao dia',
          treatmentDuration: '3-5 dias',
        },
        calculationParams: {
          type: 'azitromicina_suspensao_200_5',
          mgPerKg: 10,
          maxDailyDoseMg: 500,
          dosesPerDay: 1,
          concentrationNumeratorMg: 200,
          concentrationDenominatorMl: 5,
        } as DosageCalculationParams,
      },
    ],
  },
  [slugify('Analgésicos e Antitérmicos')]: {
    title: 'Analgésicos e Antitérmicos',
    slug: slugify('Analgésicos e Antitérmicos'),
    icon: Thermometer,
    iconColorClass: 'text-teal-500',
    bgColorClass: 'bg-teal-100',
    medicationsCount: 2,
    lastUpdated: 'Mai/2025',
    medications: [
      {
        name: 'Paracetamol',
        slug: slugify('Paracetamol'),
        form: 'Solução oral em gotas',
        application: 'VO',
        description: 'Analgésico e antitérmico. Utilizado para alívio da dor e febre em crianças.',
        alerts: ['Não exceder a dose máxima diária.', 'Usar com cautela em pacientes com insuficiência hepática.'],
        commonBrandNames: 'Tylenol®, Pratium®, Tylalgin®',
        dosageInformation: {
          concentration: '200 mg / mL (10 gotas = 1 mL)',
          usualDose: '10 mg/kg/dose. Máximo de 350mg por dose.',
          doseInterval: 'A cada 4 horas (até 5 vezes ao dia)',
          treatmentDuration: 'Conforme necessidade ou prescrição médica',
          administrationNotes: 'Pode ser administrado com ou sem alimentos. Respeitar o intervalo mínimo entre as doses.'
        },
        calculationParams: {
          type: 'paracetamol_gotas_200_ml',
          mgPerKg: 10,
          maxDosePerTakeMg: 350,
          mgInStandardVolume: 200,
          dropsInStandardVolume: 10,
        } as DosageCalculationParams
      },
      {
        name: 'Dipirona',
        slug: slugify('Dipirona'),
        form: 'Solução oral em gotas',
        application: 'VO',
        description: 'Analgésico e antitérmico. Usado para alívio da dor e febre.',
        alerts: ['Pode causar reações de hipersensibilidade.', 'Usar com cautela em pacientes com problemas hematológicos.'],
        commonBrandNames: 'Novalgina®, Anador®, Magnopyrol®',
        dosageInformation: {
          concentration: '500 mg / mL (25 gotas = 1 mL)',
          usualDose: '15 mg/kg/dose. Máximo de 500mg por dose.',
          doseInterval: 'A cada 6 horas (4 vezes ao dia)',
          treatmentDuration: 'Conforme necessidade ou prescrição médica',
          administrationNotes: 'Pode ser administrada com ou sem líquidos.'
        },
        calculationParams: {
          type: 'dipirona_gotas_500_ml',
          mgPerKg: 15,
          maxDosePerTakeMg: 500,
          mgInStandardVolume: 500,
          dropsInStandardVolume: 25,
        } as DosageCalculationParams
      },
    ],
  },
  [slugify('Corticoides EV')]: {
    title: 'Corticoides EV',
    slug: slugify('Corticoides EV'),
    icon: Syringe,
    iconColorClass: 'text-red-500',
    bgColorClass: 'bg-red-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
  [slugify('Antieméticos')]: {
    title: 'Antieméticos',
    slug: slugify('Antieméticos'),
    icon: Package,
    iconColorClass: 'text-purple-500',
    bgColorClass: 'bg-purple-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
  [slugify('Broncodilatadores')]: {
    title: 'Broncodilatadores',
    slug: slugify('Broncodilatadores'),
    icon: Lungs,
    iconColorClass: 'text-green-500',
    bgColorClass: 'bg-green-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
  [slugify('Outras Classes')]: {
    title: 'Outras Classes',
    slug: slugify('Outras Classes'),
    icon: Activity,
    iconColorClass: 'text-yellow-500',
    bgColorClass: 'bg-yellow-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
  [slugify('Fluidos e Eletrólitos')]: {
    title: 'Fluidos e Eletrólitos',
    slug: slugify('Fluidos e Eletrólitos'),
    icon: Droplets,
    iconColorClass: 'text-cyan-500',
    bgColorClass: 'bg-cyan-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
  [slugify('Vitaminas e Suplementos')]: {
    title: 'Vitaminas e Suplementos',
    slug: slugify('Vitaminas e Suplementos'),
    icon: TestTube2,
    iconColorClass: 'text-orange-500',
    bgColorClass: 'bg-orange-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
  [slugify('Antivirais')]: {
    title: 'Antivirais',
    slug: slugify('Antivirais'),
    icon: Virus,
    iconColorClass: 'text-pink-500',
    bgColorClass: 'bg-pink-100',
    medicationsCount: 0,
    lastUpdated: 'N/A',
    medications: [],
  },
};

allCategories.forEach(category => {
  const categoryData = mockMedicationsData[category.slug];
  if (categoryData) {
    (category as CategoryInfo).medicationsCount = categoryData.medications.length;
    (category as CategoryInfo).lastUpdated = categoryData.lastUpdated || 'N/A';
  } else {
    (category as CategoryInfo).medicationsCount = 0;
    (category as CategoryInfo).lastUpdated = 'N/A';
  }
});
