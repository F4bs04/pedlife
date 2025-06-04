
import React from 'react';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pill, Copy } from 'lucide-react';
import { toast } from "@/components/ui/sonner"; // Importando o toast do sonner

interface CalculatedDoseCardProps {
  medication: Medication;
  calculatedDoseText: string;
  detailedCalculation?: string;
}

// Adicionando a função de cópia (pode ser movida para utils se usada em mais lugares)
const copyToClipboard = (text: string, successMessage: string = "Texto copiado para a área de transferência!") => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(successMessage);
  }).catch(err => {
    console.error("Falha ao copiar texto: ", err);
    toast.error("Falha ao copiar texto.");
  });
};


const CalculatedDoseCard: React.FC<CalculatedDoseCardProps> = ({ medication, calculatedDoseText, detailedCalculation }) => {
  
  const textToCopyAll = `
Medicamento: ${medication.name} ${medication.form ? `(${medication.form})` : ''}
Posologia:
- Duração: ${medication.dosageInformation?.treatmentDuration || "Conforme orientação médica"}
- Intervalo: ${medication.dosageInformation?.doseInterval || "Conforme orientação médica"}
- Dose usual: ${medication.dosageInformation?.usualDose || "Conforme orientação médica"}
Cálculo Específico: ${calculatedDoseText}
  `.trim();

  return (
    <Card className="lg:col-span-2 bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800/30 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 text-primary/70 hover:text-primary"
        onClick={() => copyToClipboard(textToCopyAll, "Dose calculada copiada!")}
        title="Copiar dose calculada completa"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2">
        <div className="flex items-center text-pink-600 dark:text-pink-400">
          <Pill className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg font-semibold">Dose Calculada</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-3">
          {medication.name} {medication.form ? `(${medication.form})` : ''}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-3">
          <p><span className="font-semibold">Posologia:</span></p>
          <p>Duração: <span className="italic">{medication.dosageInformation?.treatmentDuration || "Conforme orientação médica"}</span></p>
          <p>Intervalo: <span className="italic">{medication.dosageInformation?.doseInterval || "Conforme orientação médica"}</span></p>
          <p>Dose usual: <span className="italic">{medication.dosageInformation?.usualDose || "Conforme orientação médica"}</span></p>
        </div>
        <Alert variant="default" className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 relative">
          <div className="flex justify-between items-start">
            <AlertTitle className="font-semibold text-gray-900 dark:text-gray-100">Cálculo Específico:</AlertTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary/70 hover:text-primary -mt-1 -mr-1" // Ajuste de posicionamento
              onClick={() => copyToClipboard(calculatedDoseText, "Cálculo específico copiado!")}
              title="Copiar cálculo específico"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <AlertDescription className="text-gray-700 dark:text-gray-100 mt-1">{calculatedDoseText}</AlertDescription>
          
          {detailedCalculation && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Lógica de cálculo detalhada:</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary/70 hover:text-primary -mt-1 -mr-1"
                  onClick={() => copyToClipboard(detailedCalculation, "Lógica de cálculo copiada!")}
                  title="Copiar lógica de cálculo"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <pre className="text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/70 p-3 rounded-md mt-2 text-gray-700 dark:text-gray-200 overflow-auto max-h-60">
                {detailedCalculation}
              </pre>
            </div>
          )}
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CalculatedDoseCard;

