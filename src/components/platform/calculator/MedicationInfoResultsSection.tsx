
import React from 'react';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';

interface MedicationInfoResultsSectionProps {
  medication: Medication;
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

const MedicationInfoResultsSection: React.FC<MedicationInfoResultsSectionProps> = ({ medication }) => {
  const medicationInfoToCopy = `
Informações do Medicamento: ${medication.name}
Descrição: ${medication.description || "Descrição não disponível."}
${medication.alerts && medication.alerts.length > 0 ? `Alertas: ${medication.alerts.join(', ')}` : ''}
  `.trim();

  const observationsToCopy = `
Observações (${medication.name}):
${medication.dosageInformation?.administrationNotes || 
`Tomar com ou sem alimentos, conforme orientação.
Completar todo o tratamento prescrito.
Manter em temperatura ambiente, salvo indicação contrária.`}
  `.trim();

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Informações do Medicamento</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 relative">
           <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-primary/70 hover:text-primary"
            onClick={() => copyToClipboard(medicationInfoToCopy)}
            title="Copiar informações do medicamento"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="text-xl text-gray-700">{medication.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {medication.description || "Descrição não disponível."}
            </p>
            {medication.alerts && medication.alerts.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-1">Alertas:</h4>
                <ul className="list-disc list-inside text-sm text-red-500">
                  {medication.alerts.map((alert, index) => <li key={index}>{alert}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-primary/70 hover:text-primary"
            onClick={() => copyToClipboard(observationsToCopy)}
            title="Copiar observações"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Observações</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-1">
            {medication.dosageInformation?.administrationNotes ? (
              <p>{medication.dosageInformation.administrationNotes}</p>
            ) : (
              <>
                <p>Tomar com ou sem alimentos, conforme orientação.</p>
                <p>Completar todo o tratamento prescrito.</p>
                <p>Manter em temperatura ambiente, salvo indicação contrária.</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MedicationInfoResultsSection;
