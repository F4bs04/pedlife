
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface CalculationDataForCard {
  weight: number;
  age: number;
  calculationDate: string;
  calculationTime: string;
}

interface PatientDataCardProps {
  calculationData: CalculationDataForCard;
}

// Adicionando a função de cópia com toast
const copyToClipboard = (text: string, successMessage: string = "Texto copiado para a área de transferência!") => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(successMessage);
  }).catch(err => {
    console.error("Falha ao copiar texto: ", err);
    toast.error("Falha ao copiar texto.");
  });
};

const PatientDataCard: React.FC<PatientDataCardProps> = ({ calculationData }) => {
  const textToCopy = `
Dados do Paciente:
- Peso: ${calculationData.weight} kg
- Idade: ${calculationData.age} anos
- Data do cálculo: ${calculationData.calculationDate}
- Horário: ${calculationData.calculationTime}
  `.trim();
  
  return (
    <Card className="relative">
       <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 text-primary/70 hover:text-primary dark:text-primary-foreground/70 dark:hover:text-primary-foreground"
        onClick={() => copyToClipboard(textToCopy, "Dados do paciente copiados!")}
        title="Copiar dados do paciente"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-100">Dados do Paciente</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <p>Peso: <span className="font-medium">{calculationData.weight} kg</span></p>
        <p>Idade: <span className="font-medium">{calculationData.age} anos</span></p>
        <p>Data do cálculo: <span className="font-medium">{calculationData.calculationDate}</span></p>
        <p>Horário: <span className="font-medium">{calculationData.calculationTime}</span></p>
      </CardContent>
    </Card>
  );
};

export default PatientDataCard;
