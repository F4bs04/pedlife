
import React from 'react';
import { Medication, MedicationCategoryData } from '@/types/medication';
import CalculatorBreadcrumb from './CalculatorBreadcrumb';
import CalculatedDoseCard from './CalculatedDoseCard';
import PatientDataCard from './PatientDataCard';
import MedicationInfoResultsSection from './MedicationInfoResultsSection';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark } from 'lucide-react';

interface CalculationData {
  weight: number;
  age: number;
  calculatedDoseText: string;
  calculationTime: string;
  calculationDate: string;
}

interface MedicationResultsViewProps {
  categorySlug: string;
  categoryData: MedicationCategoryData;
  medication: Medication;
  calculationData: CalculationData;
  handleReturnToForm: () => void;
}

const MedicationResultsView: React.FC<MedicationResultsViewProps> = ({
  categorySlug,
  categoryData,
  medication,
  calculationData,
  handleReturnToForm,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-[#F1F0FB] dark:bg-gray-900 min-h-full rounded-lg">
      <CalculatorBreadcrumb
        categorySlug={categorySlug}
        categoryTitle={categoryData.title}
        medicationSlug={medication.slug}
        medicationName={medication.name}
        isResultPage={true}
      />

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Resultado do Cálculo</h1>
        <Button variant="outline" onClick={handleReturnToForm}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retornar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CalculatedDoseCard
          medication={medication}
          calculatedDoseText={calculationData.calculatedDoseText}
        />
        <PatientDataCard calculationData={calculationData} />
      </div>

      <MedicationInfoResultsSection medication={medication} />
      
      <div className="mt-8 flex justify-end">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Bookmark className="mr-2 h-4 w-4" /> Favoritar Medicamento
          </Button>
      </div>
    </div>
  );
};

export default MedicationResultsView;
