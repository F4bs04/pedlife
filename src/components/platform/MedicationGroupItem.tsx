import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MedicationGroup } from '@/types/medication';
import MedicationListItem from './MedicationListItem';
import { ChevronDown, ChevronUp, Package, PlusCircle, MinusCircle, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  // Agrupar variantes por forma de administração para melhor organização
  const variantsByForm = isExpanded ? group.variants.reduce((acc, med) => {
    const form = med.form || 'Outros';
    if (!acc[form]) acc[form] = [];
    acc[form].push(med);
    return acc;
  }, {} as Record<string, typeof group.variants>) : {};

  // Ordenar formas de administração comuns primeiro
  const formOrder = ['Oral', 'Xarope', 'Gotas', 'Injetável', 'Suspensão', 'Outros'];
  const sortedForms = isExpanded ? 
    Object.keys(variantsByForm).sort((a, b) => {
      const indexA = formOrder.indexOf(a) === -1 ? 999 : formOrder.indexOf(a);
      const indexB = formOrder.indexOf(b) === -1 ? 999 : formOrder.indexOf(b);
      return indexA - indexB;
    }) : [];

  return (
    <div className="mb-4 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {group.baseName}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                {group.variants.length} {group.variants.length === 1 ? 'variante' : 'variantes'}
              </Badge>
              
              {/* Mostrar badges para as formas mais comuns */}
              {!isExpanded && group.variants.slice(0, 3).map(med => med.form).filter((form, i, arr) => form && arr.indexOf(form) === i).map(form => (
                <Badge key={form} variant="secondary" className="text-xs">
                  {form}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={(e) => { e.stopPropagation(); toggleExpand(); }}>
          {isExpanded ? <MinusCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-20 opacity-90'} overflow-hidden`}>
        {isExpanded ? (
          <div className="divide-y">
            {sortedForms.map(form => (
              <div key={form} className="py-1">
                <div className="px-4 py-1 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium">
                  {form}
                </div>
                <div>
                  {variantsByForm[form].map((medication) => (
                    <Link 
                      key={medication.slug} 
                      to={`/platform/calculator/${categorySlug}/${medication.slug}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <MedicationListItem medication={medication} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Link 
              key={group.variants[0].slug} 
              to={`/platform/calculator/${categorySlug}/${group.variants[0].slug}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <MedicationListItem medication={group.variants[0]} />
            </Link>
            
            {group.variants.length > 1 && (
              <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer" onClick={toggleExpand}>
                <span className="flex items-center justify-center gap-1">
                  <PlusCircle className="h-3 w-3" />
                  Ver mais {group.variants.length - 1} {group.variants.length - 1 === 1 ? 'variante' : 'variantes'}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationGroupItem;
