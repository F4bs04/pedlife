
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InsulinPageBreadcrumb from '@/components/platform/insulin-calculator/InsulinPageBreadcrumb';
import InsulinCalculatorForm, { insulinFormSchema, InsulinFormValues } from '@/components/platform/insulin-calculator/InsulinCalculatorForm';
import InsulinCalculationResults, { CalculatedValues } from '@/components/platform/insulin-calculator/InsulinCalculationResults';
import ImportantNotesCard from '@/components/platform/insulin-calculator/ImportantNotesCard';
import ProtocolTable from '@/components/platform/insulin-calculator/ProtocolTable';
import DoseAdjustmentTable from '@/components/platform/insulin-calculator/DoseAdjustmentTable';

const protocolData = [
  { condition: "GLICEMIA ≥ 180 MG/DL", conduct: "CONDUTA (VIDE TABELA 2)" },
  { condition: "GLICEMIA ↑", conduct: "↑ “2 X Δ”" },
  { condition: "GLICEMIA INALTERADA OU GLICEMIA ↓ DE 1 - 40 MG/DL/H", conduct: "↑ “1 X Δ”" },
  { condition: "GLICEMIA ↓ DE 41 - 80 MG/DL/H", conduct: "NÃO ALTERA" },
  { condition: "GLICEMIA ↓ DE 81 - 120 MG/DL/H", conduct: "↓ “1 X Δ”" },
  { condition: "GLICEMIA ↓ + DE 120 MG/DL/H", conduct: "PARA A INFUSÃO POR 30 MIN. E REINICIE ↓ “2 X Δ”" },
];

const doseAdjustmentData = [
  { doseRange: "< 0,04 UI/KG/H", deltaML: "4,2 ML", twoDeltaML: "8,4 ML" },
  { doseRange: "0,04 - 0,08 UI/KG/H", deltaML: "8,4 ML", twoDeltaML: "16,8 ML" },
  { doseRange: "0,09 - 0,13 UI/KG/H", deltaML: "12,6 ML", twoDeltaML: "25,2 ML" },
  { doseRange: "0,14 - 0,2 UI/KG/H", deltaML: "16,8 ML", twoDeltaML: "33,6 ML" },
  { doseRange: "0,21 - 0,27 UI/KG/H", deltaML: "25,2 ML", twoDeltaML: "50,4 ML" },
  { doseRange: "0,28 - 0,35 UI/KG/H", deltaML: "33,6 ML", twoDeltaML: "67,2 ML" },
  { doseRange: "> 0,35 UI/KG/H", deltaML: "42 ML", twoDeltaML: "84 ML" },
];

const InsulinCalculatorPage: React.FC = () => {
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues | null>(null);

  const form = useForm<InsulinFormValues>({
    resolver: zodResolver(insulinFormSchema),
    defaultValues: {
      peso: undefined,
      glicemia: undefined,
      taxaInfusaoUIKgH: 0.036,
    },
  });

  const onSubmit = (values: InsulinFormValues) => {
    const doseUIH = values.taxaInfusaoUIKgH * values.peso;
    const adminBICMlH = doseUIH * 10; // Baseado em 25 UI em 250 ML (0.1 UI/ML)

    setCalculatedValues({
      doseInsulinaUIH: doseUIH.toFixed(2),
      administracaoBICMlH: adminBICMlH.toFixed(1),
      solucaoInsulina: "INSULINA REGULAR 25 UI + SF 0,9% 250 ML",
    });
    console.log("Form submitted, calculated values:", {
      doseInsulinaUIH: doseUIH.toFixed(2),
      administracaoBICMlH: adminBICMlH.toFixed(1),
      solucaoInsulina: "INSULINA REGULAR 25 UI + SF 0,9% 250 ML",
    });
  };
  
  console.log("Current calculatedValues state:", calculatedValues);
  console.log("Current form values for taxaInfusaoUIKgH:", form.getValues("taxaInfusaoUIKgH"));


  return (
    <div className="max-w-5xl mx-auto py-8 px-4 bg-slate-50 min-h-full rounded-lg">
      <InsulinPageBreadcrumb />

      <InsulinCalculatorForm form={form} onSubmit={onSubmit} />

      {calculatedValues && (
        <InsulinCalculationResults
          calculatedValues={calculatedValues}
          taxaInfusaoUIKgH={form.getValues("taxaInfusaoUIKgH")}
        />
      )}

      <ImportantNotesCard />

      <div className="grid md:grid-cols-1 gap-8">
        <ProtocolTable data={protocolData} />
        <DoseAdjustmentTable data={doseAdjustmentData} />
      </div>
    </div>
  );
};

export default InsulinCalculatorPage;
