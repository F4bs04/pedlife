
import { LucideIcon } from "lucide-react";

export interface Medication {
  name: string;
  form?: string; // e.g., "em Pó / Pomada", "Comprimido", "Solução Oral"
  application: string; // e.g., "EV / IM", "VO"
  // Futuramente: dose, alertas, cuidados, recomendações, etc.
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
