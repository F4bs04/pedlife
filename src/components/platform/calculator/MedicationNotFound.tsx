
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Pill, ArrowLeft } from 'lucide-react';

const MedicationNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <Pill className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Medicamento não encontrado</h2>
      <p className="text-muted-foreground mb-4">
        O medicamento ou categoria que você está procurando não foi encontrado.
      </p>
      <Button asChild>
        <Link to="/platform/calculator">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Calculadora
        </Link>
      </Button>
    </div>
  );
};

export default MedicationNotFound;
