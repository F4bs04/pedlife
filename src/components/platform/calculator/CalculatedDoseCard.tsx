
import React from 'react';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pill, Copy } from 'lucide-react';

interface CalculatedDoseCardProps {
  medication: Medication;
  calculatedDoseText: string;
}

// Adicionando a função de cópia (pode ser movida para utils se usada em mais lugares)
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    // Opcional: Adicionar toast de sucesso
    console.log("Texto copiado para a área de transferência!");
  }).catch(err => {
    console.error("Falha ao copiar texto: ", err);
    // Opcional: Adicionar toast de erro
  });
};


const CalculatedDoseCard: React.FC<CalculatedDoseCardProps> = ({ medication, calculatedDoseText }) => {
  
  const textToCopy = `
Medicamento: ${medication.name} ${medication.form ? `(${medication.form})` : ''}
Posologia:
- Duração: ${medication.dosageInformation?.treatmentDuration || "Conforme orientação médica"}
- Intervalo: ${medication.dosageInformation?.doseInterval || "Conforme orientação médica"}
- Dose usual: ${medication.dosageInformation?.usualDose || "Conforme orientação médica"}
Cálculo Específico: ${calculatedDoseText}
  `.trim();

  return (
    <Card className="lg:col-span-2 bg-pink-50 border-pink-200 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 text-primary/70 hover:text-primary"
        onClick={() => copyToClipboard(textToCopy)}
        title="Copiar dose calculada"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2">
        <div className="flex items-center text-pink-600">
          <Pill className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg font-semibold">Dose Calculada</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">
          {medication.name} {medication.form ? `(${medication.form})` : ''}
        </h2>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p><span className="font-semibold">Posologia:</span></p>
          <p>Duração: <span className="italic">{medication.dosageInformation?.treatmentDuration || "Conforme orientação médica"}</span></p>
          <p>Intervalo: <span className="italic">{medication.dosageInformation?.doseInterval || "Conforme orientação médica"}</span></p>
          <p>Dose usual: <span className="italic">{medication.dosageInformation?.usualDose || "Conforme orientação médica"}</span></p>
        </div>
        <Alert variant="default" className="bg-white">
          <AlertTitle className="font-semibold">Cálculo Específico:</AlertTitle>
          <AlertDescription>{calculatedDoseText}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CalculatedDoseCard;
