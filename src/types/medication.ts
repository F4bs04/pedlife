import { LucideIcon } from "lucide-react";

// Adicionada interface para parâmetros de cálculo de dose
export interface DosageCalculationParams {
  type: string; // Identificador do tipo de cálculo, ex: 'amoxicilina_suspension_250_5'
  mgPerKg?: number;
  maxDailyDoseMg?: number;
  dosesPerDay?: number;
  concentrationNumeratorMg?: number;
  concentrationDenominatorMl?: number;
  maxVolumePerDoseBeforeCapMl?: number;
  cappedVolumeAtMaxMl?: number;
  // Outros parâmetros conforme necessário para diferentes lógicas
  [key: string]: any; // Permite propriedades adicionais
}

export interface Medication {
  name: string;
  slug: string; // Adicionado para navegação
  form?: string; // e.g., "em Pó / Pomada", "Comprimido", "Solução Oral"
  application: string; // e.g., "EV / IM", "VO"
  description?: string; // Adicionado
  alerts?: string[]; // Adicionado
  commonBrandNames?: string; // Adicionado - Nomes comerciais comuns
  dosageInformation?: { // Adicionado - Para exibir na seção "Informações do Medicamento"
    concentration?: string; // e.g., "100mg/5mL"
    usualDose?: string; // e.g., "10 mg/kg/dia"
    doseInterval?: string; // e.g., "8/8 horas"
    treatmentDuration?: string; // e.g., "7 dias"
    administrationNotes?: string; // e.g., "Administrar com alimentos"
  };
  calculationParams?: DosageCalculationParams; // Adicionado para lógica de cálculo
}

export interface CategoryInfo {
  title: string;
  slug: string;
  icon: LucideIcon;
  iconColorClass: string;
  bgColorClass: string;
  medicationsCount: number;
  lastUpdated: string; // e.g., "Jan/2025"
}

export interface MedicationCategoryData extends CategoryInfo {
  medications: Medication[];
}

// Estrutura para os dados mock
export type MockMedicationData = Record<string, MedicationCategoryData>;
