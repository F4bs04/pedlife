
import React from 'react';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Bot } from 'lucide-react';

interface MedicationDetailsSideCardProps {
  medication: Medication;
}

const MedicationDetailsSideCard: React.FC<MedicationDetailsSideCardProps> = ({ medication }) => {
  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <CardTitle className="text-xl">Informações do Medicamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <Label className="font-semibold">Nome:</Label>
          <p className="text-muted-foreground">{medication.name}</p>
        </div>
        {medication.dosageInformation?.concentration && (
          <div>
            <Label className="font-semibold">Concentração:</Label>
            <p className="text-muted-foreground">{medication.dosageInformation.concentration}</p>
          </div>
        )}
        {medication.dosageInformation?.usualDose && (
          <div>
            <Label className="font-semibold">Dose usual:</Label>
            <p className="text-muted-foreground">{medication.dosageInformation.usualDose}</p>
          </div>
        )}
         {medication.dosageInformation?.doseInterval && (
          <div>
            <Label className="font-semibold">Intervalo:</Label>
            <p className="text-muted-foreground">{medication.dosageInformation.doseInterval}</p>
          </div>
        )}
        {medication.dosageInformation?.treatmentDuration && (
          <div>
            <Label className="font-semibold">Duração:</Label>
            <p className="text-muted-foreground">{medication.dosageInformation.treatmentDuration}</p>
          </div>
        )}
        {medication.dosageInformation?.administrationNotes && (
           <div>
            <Label className="font-semibold">Notas de Administração:</Label>
            <p className="text-muted-foreground">{medication.dosageInformation.administrationNotes}</p>
          </div>
        )}
        <div className="pt-4">
          <p className="text-xs text-center text-muted-foreground mb-2">Paciente alérgico?</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Bot className="mr-2 h-4 w-4" /> Auxílio do Lifebot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-primary" /> Lifebot Assistente
                </DialogTitle>
                <DialogDescription>
                  Informações sobre {medication.name} e possíveis interações alérgicas.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-2">
                <p className="text-sm font-semibold">Medicamento: {medication.name}</p>
                {medication.description && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Descrição:</strong> {medication.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground pt-2">
                  Aqui o Lifebot forneceria informações detalhadas sobre alergias, interações medicamentosas comuns e outras considerações importantes para o medicamento {medication.name}.
                </p>
                 {medication.alerts && medication.alerts.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-red-600">Alertas Importantes:</p>
                    <ul className="list-disc list-inside text-sm text-red-500 pl-4">
                      {medication.alerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationDetailsSideCard;
