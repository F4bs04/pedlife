
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';

interface CalculationDataForCard {
  weight: number;
  age: number;
  calculationDate: string;
  calculationTime: string;
}

interface PatientDataCardProps {
  calculationData: CalculationDataForCard;
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
        className="absolute top-2 right-2 text-primary/70 hover:text-primary"
        onClick={() => copyToClipboard(textToCopy)}
        title="Copiar dados do paciente"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Dados do Paciente</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 space-y-1">
        <p>Peso: <span className="font-medium">{calculationData.weight} kg</span></p>
        <p>Idade: <span className="font-medium">{calculationData.age} anos</span></p>
        <p>Data do cálculo: <span className="font-medium">{calculationData.calculationDate}</span></p>
        <p>Horário: <span className="font-medium">{calculationData.calculationTime}</span></p>
      </CardContent>
    </Card>
  );
};

export default PatientDataCard;
