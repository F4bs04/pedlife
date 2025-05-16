
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Medication } from '@/types/medication';
import { ChevronRight } from 'lucide-react';

interface MedicationListItemProps {
  medication: Medication;
}

const MedicationListItem: React.FC<MedicationListItemProps> = ({ medication }) => {
  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">{medication.name}</h3>
          {medication.form && <p className="text-sm text-muted-foreground">{medication.form}</p>}
        </div>
        <div className="flex items-center">
          <span className="text-xs bg-primary/10 text-primary font-medium py-1 px-2 rounded-full mr-3">
            {medication.application}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationListItem;
