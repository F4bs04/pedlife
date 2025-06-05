
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockMedicationsData } from '@/data/mockMedications';
import MedicationListItem from '@/components/platform/MedicationListItem';
import MedicationGroupItem from '@/components/platform/MedicationGroupItem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pill, BookOpen, CalendarDays } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { slugify } from '@/lib/utils'; // Importar slugify

const MedicationCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [showGrouped, setShowGrouped] = React.useState<boolean>(true);
  
  const categoryData = categorySlug ? mockMedicationsData[categorySlug] : undefined;

  if (!categoryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Pill className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">Categoria não encontrada</h2>
        <p className="text-muted-foreground mb-4">A categoria de medicamento que você está procurando não foi encontrada.</p>
        <Button asChild>
          <Link to="/platform/calculator">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Calculadora
          </Link>
        </Button>
      </div>
    );
  }

  const CategoryIcon = categoryData.icon || Pill;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 bg-white dark:bg-gray-900 min-h-[calc(100vh-10rem)] rounded-lg">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/platform/calculator" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">Calculadora</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400 dark:text-gray-500" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-800 dark:text-gray-200">{categoryData.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={`p-8 rounded-lg mb-8 ${categoryData.bgColorClass} bg-opacity-30 dark:bg-opacity-20 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${categoryData.bgColorClass} shadow-md dark:opacity-80`}>
            <CategoryIcon className={`h-8 w-8 ${categoryData.iconColorClass}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{categoryData.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center"><Pill className="h-4 w-4 mr-1.5" /> {categoryData.medicationsCount} Medicações</span>
              <span className="flex items-center"><BookOpen className="h-4 w-4 mr-1.5" /> Guia médico</span>
              <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" /> {categoryData.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        {categoryData.medications.length > 0 ? (
          <>
            {/* Botão para alternar entre visualização agrupada e lista plana */}
            {categoryData.medicationGroups && categoryData.medicationGroups.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowGrouped(!showGrouped)}
                >
                  Visualizar como {showGrouped ? "Lista" : "Grupos"}
                </Button>
              </div>
            )}

            {/* Visualização agrupada */}
            {showGrouped && categoryData.medicationGroups && categoryData.medicationGroups.length > 0 && (
              <div className="space-y-4">
                {/* Grupos de medicamentos */}
                {categoryData.medicationGroups.map((group) => (
                  <MedicationGroupItem 
                    key={group.baseSlug} 
                    group={group} 
                    categorySlug={categorySlug || ''} 
                  />
                ))}
                
                {/* Medicamentos que não estão em nenhum grupo */}
                {categoryData.medications
                  .filter(med => {
                    // Verificar se o medicamento não está em nenhum grupo
                    return !categoryData.medicationGroups?.some(group => 
                      group.variants.some(variant => variant.slug === med.slug)
                    );
                  })
                  .map((med) => {
                    const medSlug = med.slug || slugify(med.name);
                    return (
                      <Link 
                        key={medSlug} 
                        to={`/platform/calculator/${categorySlug}/${medSlug}`} 
                        className="block mb-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                      >
                        <MedicationListItem medication={med} />
                      </Link>
                    );
                  })
                }
              </div>
            )}

            {/* Visualização em lista plana */}
            {!showGrouped && categoryData.medications.map((med) => {
              const medSlug = med.slug || slugify(med.name);
              return (
                <Link 
                  key={medSlug} 
                  to={`/platform/calculator/${categorySlug}/${medSlug}`} 
                  className="block mb-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <MedicationListItem medication={med} />
                </Link>
              );
            })}
          </>
        ) : (
          <Card className="dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-10 text-center">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum medicamento cadastrado para esta categoria ainda.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link to="/platform/calculator">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Categorias
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MedicationCategoryPage;
