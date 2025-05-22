import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns';
// import { ptBR } from 'date-fns/locale'; // ptBR not used in format, can be removed if not used elsewhere
import { slugify } from '@/lib/utils';

import { mockMedicationsData, allCategories } from '@/data/mockMedications';
import { MedicationCategoryData, DosageCalculationParams, Medication } from '@/types/medication';

// New component imports
import MedicationNotFound from '@/components/platform/calculator/MedicationNotFound';
import MedicationFormView from '@/components/platform/calculator/MedicationFormView';
import MedicationResultsView from '@/components/platform/calculator/MedicationResultsView';

// Define the form schema with required fields
const formSchema = z.object({
  weight: z.coerce.number().positive({ message: "Peso deve ser um número positivo." }),
  age: z.coerce.number().int().positive({ message: "Idade deve ser um número inteiro positivo." }),
});

// Define the form values type explicitly from the schema
type FormValues = {
  weight: number;
  age: number;
};

interface CalculationData {
  weight: number;
  age: number;
  calculatedDoseText: string;
  calculationTime: string;
  calculationDate: string;
}

const MedicationCalculatorPage: React.FC = () => {
  const { categorySlug, medicationSlug } = useParams<{ categorySlug: string; medicationSlug: string }>();
  const navigate = useNavigate();

  const categoryData = categorySlug ? mockMedicationsData[categorySlug] : undefined;
  const medication = categoryData?.medications.find(m => m.slug === medicationSlug);
  const categoryDisplayInfo = allCategories.find(c => c.slug === categorySlug);
  
  // Use the explicit FormValues type to ensure type consistency
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Use non-zero defaults to ensure they're valid according to the schema
    defaultValues: {
      weight: 10,
      age: 5,
    },
    // This is important - it tells React Hook Form that all fields are required
    mode: "onSubmit"
  });

  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);

  if (!categoryData || !medication || !categoryDisplayInfo || !categorySlug || !medicationSlug) {
    return <MedicationNotFound />;
  }

  const onSubmit = (values: FormValues) => {
    console.log("Valores do formulário:", values);
    let doseResultText: string;

    // Existing Amoxicilina 250mg/5mL logic
    if (medication.slug === slugify('Amoxicilina') && medication.calculationParams?.type === 'amoxicilina_suspension_250_5') {
      const params = medication.calculationParams as DosageCalculationParams;
      const weight = values.weight;

      if (params.mgPerKg && params.maxDailyDoseMg && params.dosesPerDay && params.concentrationNumeratorMg && params.concentrationDenominatorMl && params.maxVolumePerDoseBeforeCapMl !== undefined && params.cappedVolumeAtMaxMl !== undefined) {
        let totalDailyDoseMg = weight * params.mgPerKg;
        totalDailyDoseMg = Math.min(totalDailyDoseMg, params.maxDailyDoseMg);

        const dosePerTakeMg = totalDailyDoseMg / params.dosesPerDay;
        
        const concentrationRatio = params.concentrationNumeratorMg / params.concentrationDenominatorMl;
        const volumePerTakeMlUncapped = dosePerTakeMg / concentrationRatio;

        let finalVolumePerTakeMlAdjusted = volumePerTakeMlUncapped;
        if (volumePerTakeMlUncapped > params.maxVolumePerDoseBeforeCapMl) {
          finalVolumePerTakeMlAdjusted = params.cappedVolumeAtMaxMl;
        }
        
        const roundedVolumePerTakeMl = Math.round(finalVolumePerTakeMlAdjusted);

        doseResultText = `Tomar ${roundedVolumePerTakeMl} mL do xarope por via oral de 8/8 horas por 7 a 10 dias.`;
      } else {
        doseResultText = `Erro: Parâmetros de cálculo para ${medication.name} estão incompletos. Verifique os dados do medicamento.`;
        console.error(`Parâmetros de cálculo incompletos para ${medication.name}:`, params);
      }
    } 
    // Amoxicilina Tri-hidratada 400mg/5mL logic
    else if (medication.slug === slugify('Amoxicilina Tri-hidratada') && medication.calculationParams?.type === 'amoxicilina_suspension_400_5') {
      const params = medication.calculationParams as DosageCalculationParams;
      const weight = values.weight;

      if (
        params.mgPerKg !== undefined &&
        params.maxDailyDoseMg !== undefined &&
        params.dosesPerDay !== undefined &&
        params.concentrationNumeratorMg !== undefined &&
        params.concentrationDenominatorMl !== undefined &&
        params.maxVolumePerDoseBeforeCapMl !== undefined &&
        params.cappedVolumeAtMaxMl !== undefined
      ) {
        let totalDailyDoseMg = weight * params.mgPerKg;
        totalDailyDoseMg = Math.min(totalDailyDoseMg, params.maxDailyDoseMg);

        const dosePerTakeMg = totalDailyDoseMg / params.dosesPerDay;
        
        const concentrationRatio = params.concentrationNumeratorMg / params.concentrationDenominatorMl;
        const volumePerTakeMlUncapped = dosePerTakeMg / concentrationRatio;

        let finalVolumePerTakeMlAdjusted = volumePerTakeMlUncapped;
        if (volumePerTakeMlUncapped > params.maxVolumePerDoseBeforeCapMl) {
          finalVolumePerTakeMlAdjusted = params.cappedVolumeAtMaxMl;
        }
        
        const roundedVolumePerTakeMl = Math.round(finalVolumePerTakeMlAdjusted);

        doseResultText = `Tomar ${roundedVolumePerTakeMl} mL por via oral de 8/8 horas por 7 a 10 dias.`;
      } else {
        doseResultText = `Erro: Parâmetros de cálculo para ${medication.name} estão incompletos. Verifique os dados do medicamento.`;
        console.error(`Parâmetros de cálculo incompletos para ${medication.name}:`, params);
      }
    }
    // Fallback for other medications
    else {
      doseResultText = `Cálculo para ${medication.name} (${medication.form || 'forma não especificada'}): Para peso ${values.weight}kg e idade ${values.age} anos. Dose: (Lógica de cálculo detalhada ainda não implementada para este medicamento). Verifique a bula e informações adicionais.`;
    }
    
    setCalculationData({
      weight: values.weight,
      age: values.age,
      calculatedDoseText: doseResultText,
      calculationDate: format(new Date(), "dd/MM/yyyy"),
      calculationTime: format(new Date(), "HH:mm"),
    });
  };

  const handleReturnToForm = () => {
    setCalculationData(null);
    form.reset({
      weight: 10,
      age: 5,
    }); // Reset to non-zero defaults instead of zeros
  };

  if (calculationData) {
    return (
      <MedicationResultsView
        categorySlug={categorySlug}
        categoryData={categoryData as MedicationCategoryData}
        medication={medication}
        calculationData={calculationData}
        handleReturnToForm={handleReturnToForm}
      />
    );
  }

  return (
    <MedicationFormView
      categorySlug={categorySlug}
      categoryData={categoryData as MedicationCategoryData}
      medication={medication}
      categoryDisplayInfo={categoryDisplayInfo}
      form={form}
      onSubmit={onSubmit}
      navigate={navigate}
    />
  );
};

export default MedicationCalculatorPage;
