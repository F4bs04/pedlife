
import React from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { Medication, CategoryInfo, MedicationCategoryData } from '@/types/medication';
import CalculatorBreadcrumb from './CalculatorBreadcrumb';
import MedicationInfoSummarySection from './MedicationInfoSummarySection';
import DoseCalculatorSection from './DoseCalculatorSection';

interface MedicationFormViewProps<T extends FieldValues> {
  categorySlug: string;
  categoryData: MedicationCategoryData;
  medication: Medication;
  categoryDisplayInfo: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  navigate: NavigateFunction;
}

const MedicationFormView = <T extends FieldValues>({
  categorySlug,
  categoryData,
  medication,
  categoryDisplayInfo,
  form,
  onSubmit,
  navigate,
}: MedicationFormViewProps<T>) => {
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
