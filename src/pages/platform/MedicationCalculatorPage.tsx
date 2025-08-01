import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns';
// import { ptBR } from 'date-fns/locale'; // ptBR not used in format, can be removed if not used elsewhere
import { slugify } from '@/lib/utils';

import { mockMedicationsData, allCategories } from '@/data/mockMedications';

// Função para gerar explicação detalhada do cálculo de dosagem
function generateDetailedCalculation(medication: Medication, weight: number, age: number): string {
  try {
    const params = medication.calculationParams;
    if (!params || !params.logica_js) {
      return "Lógica de cálculo não disponível para este medicamento.";
    }
    
    // Remove as aspas que envolvem a string de lógica JavaScript
    const logicaJs = params.logica_js.replace(/^"|"$/g, '');
    
    // Extrair informações do medicamento
    const name = medication.name;
    const form = medication.form;
    const concentration = medication.dosageInformation?.concentration || '';
    
    // Iniciar explicação
    let explanation = `Cálculo detalhado para ${name}:\n\n`;
    
    // Adicionar informações do paciente
    explanation += `Dados do paciente:\n`;
    explanation += `- Peso: ${weight} kg\n`;
    explanation += `- Idade: ${age} anos\n\n`;
    
    // Analisar a lógica para identificar padrões comuns
    if (logicaJs.includes('peso*')) {
      // Extrair o fator de multiplicação do peso
      const mgPerKgMatch = logicaJs.match(/peso\s*\*\s*([0-9.]+)/);
      if (mgPerKgMatch && mgPerKgMatch[1]) {
        const mgPerKg = parseFloat(mgPerKgMatch[1]);
        const totalDoseMg = weight * mgPerKg;
        explanation += `1. Cálculo da dose total:\n`;
        explanation += `   ${weight} kg × ${mgPerKg} mg/kg = ${totalDoseMg.toFixed(2)} mg\n\n`;
        
        // Verificar se há divisão por doses por dia
        if (logicaJs.includes('/2') || logicaJs.includes('/3') || logicaJs.includes('/4')) {
          let dosesPerDay = 1;
          if (logicaJs.includes('/2')) dosesPerDay = 2;
          if (logicaJs.includes('/3')) dosesPerDay = 3;
          if (logicaJs.includes('/4')) dosesPerDay = 4;
          
          const dosePerTakeMg = totalDoseMg / dosesPerDay;
          explanation += `2. Cálculo da dose por tomada:\n`;
          explanation += `   ${totalDoseMg.toFixed(2)} mg ÷ ${dosesPerDay} doses = ${dosePerTakeMg.toFixed(2)} mg por dose\n\n`;
          
          // Verificar se há conversão para volume baseado na concentração
          const concentrationMatch = logicaJs.match(/(\d+)\s*\/\s*(\d+)/);
          if (concentrationMatch && concentrationMatch[1] && concentrationMatch[2]) {
            const concentrationMg = parseFloat(concentrationMatch[1]);
            const concentrationMl = parseFloat(concentrationMatch[2]);
            const volumePerTakeMl = (dosePerTakeMg / concentrationMg) * concentrationMl;
            explanation += `3. Conversão para volume:\n`;
            explanation += `   Concentração: ${concentrationMg} mg/${concentrationMl} ml\n`;
            explanation += `   ${dosePerTakeMg.toFixed(2)} mg ÷ (${concentrationMg} mg/${concentrationMl} ml) = ${volumePerTakeMl.toFixed(2)} ml\n\n`;
            
            // Verificar se há arredondamento
            if (logicaJs.includes('Math.round')) {
              const roundedVolume = Math.round(volumePerTakeMl * 10) / 10;
              explanation += `4. Volume arredondado: ${roundedVolume.toFixed(1)} ml\n\n`;
            }
          }
        }
      }
    }
    
    // Se não conseguiu gerar uma explicação detalhada, retornar uma mensagem genérica
    if (explanation === `Cálculo detalhado para ${name}:\n\nDados do paciente:\n- Peso: ${weight} kg\n- Idade: ${age} anos\n\n`) {
      explanation += `A lógica de cálculo específica para este medicamento é complexa.\n\n`;
      explanation += `Fórmula utilizada: ${logicaJs.replace(/\"/g, '')}\n\n`;
      explanation += `O resultado foi calculado automaticamente com base nos parâmetros fornecidos.`;
    }
    
    return explanation;
  } catch (error) {
    console.error('Erro ao gerar explicação detalhada:', error);
    return 'Não foi possível gerar uma explicação detalhada para este cálculo.';
  }
}
import { MedicationCategoryData, DosageCalculationParams, Medication } from '@/types/medication';
import { evaluateJsLogic } from '@/data/mockMedications';

// Interface para dados de dosagem analisados
interface ParsedDose {
  amount: string;
  route?: string;
  period?: string;
  frequency?: string;
}

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
  detailedCalculation?: string;
  parsedDose?: ParsedDose;
}

// Função para analisar o texto de dosagem e extrair informações estruturadas
const parseDoseText = (doseText: string, medication: Medication): ParsedDose => {
  // Inicializar objeto de retorno
  const parsedDose: ParsedDose = {
    amount: ""
  };
  
  // Extrair a quantidade da dose
  const doseMatch = doseText.match(/Dose:\s*([\d,.]+\s*(?:ml|mL|mg|g|mcg|UI|unidades|ampola|ampolas|comprimido|comprimidos|cápsula|cápsulas|gota|gotas|aplicação|aplicações|dose|doses|adesivo|adesivos|inalação|inalações|spray|sprays|supositório|supositórios)(?:\/[\w]+)?)/i);
  if (doseMatch && doseMatch[1]) {
    parsedDose.amount = doseMatch[1].trim();
  } else {
    // Se não encontrar um padrão específico, tentar extrair após "Dose: "
    const simpleDoseMatch = doseText.match(/Dose:\s*([^.\n]+)/i);
    if (simpleDoseMatch && simpleDoseMatch[1]) {
      parsedDose.amount = simpleDoseMatch[1].trim();
    } else {
      // Fallback: usar o texto completo como quantidade
      parsedDose.amount = doseText;
    }
  }
  
  // Extrair via de administração
  parsedDose.route = medication.application || "";
  
  // Extrair período de tratamento
  if (medication.dosageInformation?.treatmentDuration) {
    parsedDose.period = medication.dosageInformation.treatmentDuration;
  } else {
    const periodMatch = doseText.match(/(?:por|durante|tratamento\s+(?:por|de))\s+([\d]+\s*(?:dia|dias|semana|semanas|mês|meses))/i);
    if (periodMatch && periodMatch[1]) {
      parsedDose.period = periodMatch[1].trim();
    }
  }
  
  // Extrair frequência
  if (medication.dosageInformation?.doseInterval) {
    parsedDose.frequency = medication.dosageInformation.doseInterval;
  } else {
    const frequencyMatch = doseText.match(/(?:a\s+cada|de|em)\s+([\d]+\s*(?:em|a\s+cada)?\s*(?:hora|horas|h|dia|dias|vez|vezes)(?:\s+ao\s+dia)?)/i);
    if (frequencyMatch && frequencyMatch[1]) {
      parsedDose.frequency = frequencyMatch[1].trim();
    }
  }
  
  return parsedDose;
};

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
    if (!medication) return;

    // Get the current date and time
    const now = new Date();
    const formattedTime = format(now, 'HH:mm');
    const formattedDate = format(now, 'dd/MM/yyyy');

    // Calculate the dose based on the medication type and parameters
    let doseResultText = '';
    let detailedCalculation = '';
    const params = medication.calculationParams;
    
    // Gerar explicação detalhada do cálculo
    detailedCalculation = generateDetailedCalculation(medication, values.weight, values.age);

    // Existing Amoxicilina 250mg/5mL logic
    if (medication.slug === slugify('Amoxicilina') && params?.type === 'amoxicilina_suspension_250_5') {
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
    else if (medication.slug === slugify('Amoxicilina Tri-hidratada') && params?.type === 'amoxicilina_suspension_400_5') {
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
    // Azitromicina Di-hidratada 200mg/5mL logic
    else if (medication.slug === slugify('Azitromicina Di-hidratada') && params?.type === 'azitromicina_suspensao_200_5') {
      const weight = values.weight;

      if (
        params.mgPerKg !== undefined &&
        params.maxDailyDoseMg !== undefined &&
        params.dosesPerDay !== undefined && // Though dosesPerDay is 1, it's good practice to have it for consistency
        params.concentrationNumeratorMg !== undefined &&
        params.concentrationDenominatorMl !== undefined
      ) {
        let totalDailyDoseMg = weight * params.mgPerKg;
        totalDailyDoseMg = Math.min(totalDailyDoseMg, params.maxDailyDoseMg);
        
        // For Azitromicina, dosePerTakeMg is the same as totalDailyDoseMg because it's once a day
        // const dosePerTakeMg = totalDailyDoseMg / params.dosesPerDay; 
        
        const concentrationRatio = params.concentrationNumeratorMg / params.concentrationDenominatorMl;
        const volumePerTakeMlUncapped = totalDailyDoseMg / concentrationRatio; // Using totalDailyDoseMg directly

        // Arredondar para no máximo 2 casas decimais
        const roundedVolumePerTakeMl = parseFloat(volumePerTakeMlUncapped.toFixed(2));

        doseResultText = `Tomar ${roundedVolumePerTakeMl} mL por via oral uma vez ao dia por 3 a 5 dias.`;
      } else {
        doseResultText = `Erro: Parâmetros de cálculo para ${medication.name} estão incompletos. Verifique os dados do medicamento.`;
        console.error(`Parâmetros de cálculo incompletos para ${medication.name}:`, params);
      }
    }
    // Dipirona 500 mg / mL (gotas) logic
    else if (medication.slug === slugify('Dipirona') && params?.type === 'dipirona_gotas_500_ml') {
      const weight = values.weight;

      if (
        params.mgPerKg !== undefined &&
        params.maxDosePerTakeMg !== undefined &&
        params.mgInStandardVolume !== undefined &&
        params.dropsInStandardVolume !== undefined
      ) {
        let dosePerTakeMg = weight * params.mgPerKg;
        dosePerTakeMg = Math.min(dosePerTakeMg, params.maxDosePerTakeMg);

        // Calculate drops: dose_total_mg / (mgPerDropNumerator / mgPerDropDenominator)
        // (mgPerDropNumerator / mgPerDropDenominator) is mg per gota.
        // Example: 500mg / 25 gotas = 20 mg/gota
        const mgPerDrop = params.mgInStandardVolume / params.dropsInStandardVolume;
        const calculatedDrops = dosePerTakeMg / mgPerDrop;
        
        const roundedDrops = Math.round(calculatedDrops);

        doseResultText = `Tomar ${roundedDrops} gotas por via oral de 6/6 horas.`;
      } else {
        doseResultText = `Erro: Parâmetros de cálculo para ${medication.name} estão incompletos. Verifique os dados do medicamento.`;
        console.error(`Parâmetros de cálculo incompletos para ${medication.name}:`, params);
      }
    }
    // Paracetamol 200 mg / mL (gotas) logic
    else if (medication.slug === slugify('Paracetamol') && params?.type === 'paracetamol_gotas_200_ml') {
      const weight = values.weight;

      if (
        params.mgPerKg !== undefined &&
        params.maxDosePerTakeMg !== undefined &&
        params.mgInStandardVolume !== undefined &&
        params.dropsInStandardVolume !== undefined
      ) {
        let dosePerTakeMg = weight * params.mgPerKg;
        dosePerTakeMg = Math.min(dosePerTakeMg, params.maxDosePerTakeMg);

        // Calculate drops:
        // mgPerDrop = mgInStandardVolume / dropsInStandardVolume
        // Example: 200mg / 10 gotas = 20 mg/gota
        const mgPerDrop = params.mgInStandardVolume / params.dropsInStandardVolume;
        const calculatedDrops = dosePerTakeMg / mgPerDrop;
        
        // Arredondar para duas casas decimais
        const roundedDrops = parseFloat(calculatedDrops.toFixed(2));

        doseResultText = `Tomar ${roundedDrops} gotas por via oral de 4/4 horas. (Não exceder 5 administrações por dia)`;
      } else {
        doseResultText = `Erro: Parâmetros de cálculo para ${medication.name} estão incompletos. Verifique os dados do medicamento.`;
        console.error(`Parâmetros de cálculo incompletos para ${medication.name}:`, params);
      }
    }
    // Use the medication's calculation logic if available
    else if (medication.calculationParams?.logica_js) {
      try {
        // Usar a função evaluateJsLogic para calcular a dose com segurança
        const peso = values.weight;
        const idade = values.age;
        
        // Calcular a dose usando a função evaluateJsLogic importada
        let calculatedDose;
        try {
          calculatedDose = evaluateJsLogic(medication.calculationParams.logica_js, peso);
        } catch (evalError) {
          console.error('Erro ao avaliar lógica de cálculo:', evalError);
          calculatedDose = 'Erro no cálculo';
        }
        
        // Exibir o resultado com a dose e frequência
        const formText = medication.form && medication.form.trim() !== '' ? `(${medication.form})` : '';
        
        // Adicionar frequência se disponível
        let frequencia = '';
        if (medication.dosageInformation?.doseInterval) {
          frequencia = ` a cada ${medication.dosageInformation.doseInterval}`;
        }
        
        // Verificar se calculatedDose já contém a unidade (mL, mg, etc)
        // Se não contiver, adicionar a unidade apropriada baseada na forma do medicamento
        let doseComUnidade = calculatedDose;
        if (!doseComUnidade.includes('mL') && !doseComUnidade.includes('mg') && 
            !doseComUnidade.includes('g') && !doseComUnidade.includes('mcg')) {
          if (medication.form?.toLowerCase().includes('xarope') || 
              medication.form?.toLowerCase().includes('suspen') || 
              medication.form?.toLowerCase().includes('solu')) {
            doseComUnidade += ' mL';
          } else if (medication.form?.toLowerCase().includes('comprimido')) {
            doseComUnidade += ' comprimido(s)';
          }
        }
        
        doseResultText = `Dar a dose de ${doseComUnidade}${frequencia}`;
        
        // Adicionar observação ou restrição se houver
        if (medication.alerts && medication.alerts.length > 0) {
          doseResultText += ` (${medication.alerts[0]})`;
        } else if (medication.dosageInformation?.administrationNotes) {
          doseResultText += ` (${medication.dosageInformation.administrationNotes})`;
        }
      } catch (error) {
        console.error('Error evaluating medication calculation logic:', error);
        // Tentar exibir alguma informação útil mesmo em caso de erro
        const formText = medication.form && medication.form.trim() !== '' ? `(${medication.form})` : '';
        
        let frequencia = '';
        if (medication.dosageInformation?.doseInterval) {
          frequencia = ` a cada ${medication.dosageInformation.doseInterval}`;
        }
        
        if (medication.dosageInformation?.usualDose) {
          doseResultText = `${medication.dosageInformation.usualDose}`;
        } else {
          doseResultText = `Consulte um profissional de saúde para orientações específicas${frequencia}.`;
        }
      }
    }
    // Fallback if no calculation logic is available
    else {
      const formText = medication.form && medication.form.trim() !== '' ? `(${medication.form})` : '';
      
      // Tentar exibir alguma informação útil mesmo sem lógica de cálculo
      let frequencia = '';
      if (medication.dosageInformation?.doseInterval) {
        frequencia = ` a cada ${medication.dosageInformation.doseInterval}`;
      }
      
      if (medication.dosageInformation?.usualDose) {
        doseResultText = `${medication.dosageInformation.usualDose}`;
      } else {
        doseResultText = `Consulte um profissional de saúde para orientações específicas${frequencia}.`;
      }
    }
    
    // Analisar o texto de dosagem para extrair informações estruturadas
    const parsedDose = parseDoseText(doseResultText, medication);
    
    setCalculationData({
      weight: values.weight,
      age: values.age,
      calculatedDoseText: doseResultText,
      calculationDate: format(new Date(), "dd/MM/yyyy"),
      calculationTime: format(new Date(), "HH:mm"),
      detailedCalculation: detailedCalculation,
      parsedDose: parsedDose, // Adicionar os dados de dosagem analisados
    });
  };

  const handleReturnToForm = () => {
    setCalculationData(null);
    form.reset({
      weight: 10,
      age: 5,
    });
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
