import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MedicationGroup } from '@/types/medication';
import MedicationListItem from './MedicationListItem';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MedicationGroupItemProps {
  group: MedicationGroup;
  categorySlug: string;
}

const MedicationGroupItem: React.FC<MedicationGroupItemProps> = ({ group, categorySlug }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Mostrar apenas a primeira variante quando não expandido
  const displayVariants = isExpanded ? group.variants : [group.variants[0]];

  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            {group.baseName} <span className="text-sm text-gray-500">({group.variants.length} variantes)</span>
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpand}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={`transition-all ${isExpanded ? 'max-h-[1000px]' : 'max-h-20'} overflow-hidden`}>
        {displayVariants.map((medication) => (
          <Link 
            key={medication.slug} 
            to={`/platform/calculator/${categorySlug}/${medication.slug}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <MedicationListItem medication={medication} />
          </Link>
        ))}
        
        {!isExpanded && group.variants.length > 1 && (
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-800/30">
            + {group.variants.length - 1} mais variantes
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationGroupItem;
