
import React from 'react';
import { Label } from "@/components/ui/label";

export interface CalculatedValues {
  doseInsulinaUIH: string;
  administracaoBICMlH: string;
  solucaoInsulina: string;
}

interface InsulinCalculationResultsProps {
  calculatedValues: CalculatedValues;
  taxaInfusaoUIKgH: number | undefined;
}

const InsulinCalculationResults: React.FC<InsulinCalculationResultsProps> = ({ calculatedValues, taxaInfusaoUIKgH }) => {
  return (
    <div className="mt-8 space-y-3">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">Resultados Calculados:</h3>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 p-4 border rounded-md bg-slate-100">
        <Label className="font-medium text-gray-600">DOSE DE INSULINA (UI/H):</Label>
        <p className="text-gray-800 font-semibold">{calculatedValues.doseInsulinaUIH} UI/H</p>
        
        <Label className="font-medium text-gray-600">TAXA DE INFUSÃO (UI/KG/H):</Label>
        <p className="text-gray-800 font-semibold">{taxaInfusaoUIKgH} UI/KG/H</p>
        
        <Label className="font-medium text-gray-600">SOLUÇÃO DE INSULINA:</Label>
        <p className="text-gray-800 font-semibold">{calculatedValues.solucaoInsulina}</p>
        
        <Label className="font-medium text-gray-600">ADMINISTRAÇÃO EM BIC (ML/H):</Label>
        <p className="text-gray-800 font-semibold">{calculatedValues.administracaoBICMlH} ML/H</p>
      </div>
    </div>
  );
};

export default InsulinCalculationResults;
