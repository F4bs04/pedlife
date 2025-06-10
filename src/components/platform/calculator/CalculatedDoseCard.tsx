import React from 'react';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Copy, Calendar, Repeat, Route } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CalculatedDoseCardProps {
  medication: Medication;
  calculatedDoseText: string;
  detailedCalculation?: string;
  parsedDose?: {
    amount: string;
    route?: string;
    period?: string;
    frequency?: string;
  };
}

// Função para copiar texto para a área de transferência
const copyToClipboard = (text: string, successMessage: string = "Texto copiado para a área de transferência!") => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(successMessage);
  }).catch(err => {
    console.error("Falha ao copiar texto: ", err);
    toast.error("Falha ao copiar texto.");
  });
};

const CalculatedDoseCard: React.FC<CalculatedDoseCardProps> = ({ 
  medication, 
  calculatedDoseText, 
  detailedCalculation, 
  parsedDose 
}) => {
  
  // Extrair informações do parsedDose ou usar valores padrão
  const doseAmount = parsedDose?.amount || calculatedDoseText;
  const doseRoute = parsedDose?.route || medication.application || "";
  const dosePeriod = parsedDose?.period || medication.dosageInformation?.treatmentDuration || "";
  const doseFrequency = parsedDose?.frequency || medication.dosageInformation?.doseInterval || "";

  // Texto para copiar com todas as informações relevantes
  const textToCopyAll = `
Medicamento: ${medication.name} ${medication.form ? `(${medication.form})` : ''}
Dosagem: ${doseAmount}
${doseRoute ? `Via de administração: ${doseRoute}\n` : ''}${dosePeriod ? `Período: ${dosePeriod}\n` : ''}${doseFrequency ? `Frequência: ${doseFrequency}\n` : ''}
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
          {medication.name} {medication.form && medication.form.trim() !== "" ? `(${medication.form})` : ''}
        </h2>
        
        {/* Card com informações simplificadas e objetivas */}
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative">
          {/* Dose em destaque com botão de copiar */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800/30 relative">
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300 text-center pr-8">
              {doseAmount}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => copyToClipboard(doseAmount, "Dose copiada!")}
              title="Copiar dose"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Informações adicionais em cards separados */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {/* Via de administração */}
            {doseRoute && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/70 rounded border border-gray-200 dark:border-gray-700">
                <Route className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Via</p>
                  <p className="font-medium">{doseRoute}</p>
                </div>
              </div>
            )}
            
            {/* Período */}
            {dosePeriod && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/70 rounded border border-gray-200 dark:border-gray-700">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Período</p>
                  <p className="font-medium">{dosePeriod}</p>
                </div>
              </div>
            )}
            
            {/* Frequência */}
            {doseFrequency && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/70 rounded border border-gray-200 dark:border-gray-700">
                <Repeat className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Frequência</p>
                  <p className="font-medium">{doseFrequency}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Detalhes do cálculo em acordeão */}
          {detailedCalculation && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="detailed-calculation" className="border-none">
                  <div className="flex justify-between items-center">
                    <AccordionTrigger className="font-semibold text-gray-600 dark:text-gray-400 text-sm p-0 hover:no-underline">
                      Detalhes do cálculo
                    </AccordionTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-primary/70 hover:text-primary z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(detailedCalculation, "Detalhes do cálculo copiados!");
                      }}
                      title="Copiar detalhes do cálculo"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <AccordionContent>
                    <pre className="text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/70 p-3 rounded-md mt-2 text-gray-700 dark:text-gray-200 overflow-auto max-h-60">
                      {detailedCalculation}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatedDoseCard;
