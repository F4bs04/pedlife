
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { Medication, CategoryInfo, MedicationCategoryData } from '@/types/medication';
import CalculatorBreadcrumb from './CalculatorBreadcrumb';
import MedicationInfoSummarySection from './MedicationInfoSummarySection';
import DoseCalculatorSection from './DoseCalculatorSection';

type FormValues = {
  weight: number;
  age: number;
};

interface MedicationFormViewProps {
  categorySlug: string;
  categoryData: MedicationCategoryData;
  medication: Medication;
  categoryDisplayInfo: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>;
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  navigate: NavigateFunction;
}

const MedicationFormView = ({
  categorySlug,
  categoryData,
  medication,
  categoryDisplayInfo,
  form,
  onSubmit,
  navigate,
}: MedicationFormViewProps) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-slate-50 min-h-full rounded-lg">
      <CalculatorBreadcrumb
        categorySlug={categorySlug}
        categoryTitle={categoryData.title}
        medicationSlug={medication.slug}
        medicationName={medication.name}
        isResultPage={false}
      />
      <MedicationInfoSummarySection
        medication={medication}
        categoryDisplayInfo={categoryDisplayInfo}
      />
      <DoseCalculatorSection
        medication={medication}
        form={form}
        onSubmit={onSubmit}
        navigate={navigate}
      />
    </div>
  );
};

export default MedicationFormView;
