
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Activity, Syringe, Thermometer, ShieldCheck, Stethoscope } from 'lucide-react'; // Removido Lung, Stethoscope já estava aqui

interface CategoryCardProps {
  title: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon: Icon, iconColorClass, bgColorClass }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
    <CardHeader className="flex flex-col items-center justify-center text-center p-6">
      <div className={`p-4 rounded-full mb-4 ${bgColorClass}`}>
        <Icon className={`h-8 w-8 ${iconColorClass}`} />
      </div>
      <CardTitle className="text-md font-semibold text-gray-700">{title}</CardTitle>
    </CardHeader>
  </Card>
);

const CalculatorPage: React.FC = () => {
  const categories: CategoryCardProps[] = [
    { title: 'Antibióticos VO', icon: Pill, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
    { title: 'Analgésicos e Antitérmicos', icon: Activity, iconColorClass: 'text-teal-500', bgColorClass: 'bg-teal-100' },
    { title: 'Corticosteroides EV', icon: Syringe, iconColorClass: 'text-pink-500', bgColorClass: 'bg-pink-100' },
    { title: 'Corticoide Oral', icon: Thermometer, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-100' },
    { title: 'Antivirais', icon: ShieldCheck, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-100' },
    { title: 'Broncodilatadores', icon: Stethoscope, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-100' }, // Ícone Lung substituído por Stethoscope
  ];

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 min-h-[calc(100vh-10rem)] rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Cálculo de Doses Pediátricas</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl text-center">
        Escolha a categoria do medicamento para calcular a dose adequada com precisão e segurança para seus pacientes pediátricos.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </div>
  );
};

export default CalculatorPage;
