import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medication, CategoryInfo } from '@/types/medication';
import { AlertTriangle, Info, Pill } from 'lucide-react';

interface MedicationInfoSummarySectionProps {
  medication: Medication;
  categoryDisplayInfo: Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'>;
}

const MedicationInfoSummarySection: React.FC<MedicationInfoSummarySectionProps> = ({ medication, categoryDisplayInfo }) => {
  const CategoryIcon = categoryDisplayInfo.icon || Pill;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Informações resumidas</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className={`border-l-4 ${categoryDisplayInfo.iconColorClass?.replace('text-', 'border-') || 'border-pink-500'} dark:bg-card/50`}>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CategoryIcon className={`h-6 w-6 ${categoryDisplayInfo.iconColorClass || 'text-pink-500'}`} />
            <CardTitle className="text-xl dark:text-card-foreground">{medication.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {medication.description && medication.description.trim() !== "" ? (
              <p className="text-sm text-muted-foreground">{medication.description}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500 dark:border-red-600 dark:bg-card/50">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
            <CardTitle className="text-xl dark:text-card-foreground">Alerta</CardTitle>
          </CardHeader>
          <CardContent>
            {medication.alerts && medication.alerts.length > 0 ? (
              medication.alerts.map((alert, index) => (
                <p key={index} className="text-sm text-muted-foreground">{alert}</p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum alerta específico para este medicamento.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-blue-500 dark:border-blue-600 dark:bg-card/50">
           <CardHeader className="flex flex-row items-center gap-3 pb-2">
             <Info className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <CardTitle className="text-xl dark:text-card-foreground">Principais Apresentações</CardTitle>
          </CardHeader>
          <CardContent>
            {medication.form && medication.form.trim() !== "" ? (
              <p className="text-sm text-muted-foreground">{medication.form}</p>
            ) : null}
            {medication.commonBrandNames && <p className="text-xs text-muted-foreground mt-1">Nomes comuns: {medication.commonBrandNames}</p>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MedicationInfoSummarySection;
