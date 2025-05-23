
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
// Ícones permitidos: Pill, Syringe, Stethoscope, Calendar, User, Bell, Calculator
// Outros ícones como Activity, Thermometer, ShieldCheck foram substituídos por Pill ou outros permitidos.
import { Pill, Syringe, Stethoscope } from 'lucide-react';
import { CategoryInfo } from '@/types/medication';
import { allCategories } from '@/data/mockMedications';

interface CategoryCardProps extends Omit<CategoryInfo, 'medicationsCount' | 'lastUpdated'> {
  // slug é necessário para o Link
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, slug, icon: Icon, iconColorClass, bgColorClass }) => (
  <Link to={`/platform/calculator/${slug}`} className="block">
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-col items-center justify-center text-center p-6 h-full">
        <div className={`p-4 rounded-full mb-4 ${bgColorClass} dark:opacity-80`}>
          <Icon className={`h-8 w-8 ${iconColorClass}`} />
        </div>
        <CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
    </Card>
  </Link>
);

const CalculatorPage: React.FC = () => {
  // Usar as categorias de mockMedications.ts
  const categories: CategoryCardProps[] = allCategories.map(cat => ({
    title: cat.title,
    slug: cat.slug,
    icon: cat.icon,
    iconColorClass: cat.iconColorClass,
    bgColorClass: cat.bgColorClass,
  }));

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:bg-gray-900 min-h-[calc(100vh-10rem)] rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">Cálculo de Doses Pediátricas</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl text-center">
        Escolha a categoria do medicamento para calcular a dose adequada com precisão e segurança para seus pacientes pediátricos.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {categories.map((category) => (
          <CategoryCard key={category.slug} {...category} />
        ))}
      </div>
    </div>
  );
};

export default CalculatorPage;
