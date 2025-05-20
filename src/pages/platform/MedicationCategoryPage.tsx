
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockMedicationsData } from '@/data/mockMedications';
import MedicationListItem from '@/components/platform/MedicationListItem';
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
  
  const categoryData = categorySlug ? mockMedicationsData[categorySlug] : undefined;

  if (!categoryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Pill className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Categoria não encontrada</h2>
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/platform/calculator">Calculadora</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoryData.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={`p-8 rounded-lg mb-8 ${categoryData.bgColorClass} bg-opacity-30`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${categoryData.bgColorClass} shadow-md`}>
            <CategoryIcon className={`h-8 w-8 ${categoryData.iconColorClass}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{categoryData.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center"><Pill className="h-4 w-4 mr-1.5" /> {categoryData.medicationsCount} Medicações</span>
              <span className="flex items-center"><BookOpen className="h-4 w-4 mr-1.5" /> Guia médico</span>
              <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" /> {categoryData.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        {categoryData.medications.length > 0 ? (
          categoryData.medications.map((med) => {
            // Certifique-se que categorySlug está definido antes de usá-lo no Link
            const medSlug = med.slug || slugify(med.name); // Usa slug existente ou gera um novo
            return (
              <Link 
                key={medSlug} 
                to={`/platform/calculator/${categorySlug}/${medSlug}`} 
                className="block mb-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <MedicationListItem medication={med} />
              </Link>
            );
          })
        ) : (
          <Card>
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
