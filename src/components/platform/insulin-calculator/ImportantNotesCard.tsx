
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImportantNotesCard: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-sky-100">
        <CardTitle className="text-lg text-sky-700">Notas Importantes</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-sm text-gray-700 space-y-1">
        <p>* INICIAR CONTROLE DA GLICEMIA A CADA 1 HORA</p>
        <p>* MANTER GLICEMIA CAPILAR ≤ 180 MG/DL</p>
      </CardContent>
    </Card>
  );
};

export default ImportantNotesCard;
