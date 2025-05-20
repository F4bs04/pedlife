
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DoseAdjustmentItem {
  doseRange: string;
  deltaML: string;
  twoDeltaML: string;
}

interface DoseAdjustmentTableProps {
  data: DoseAdjustmentItem[];
}

const DoseAdjustmentTable: React.FC<DoseAdjustmentTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="bg-sky-600">
        <CardTitle className="text-xl text-white">DOSE DE INSULINA (UI/KG/H) - Tabela 2 (Ajuste Δ)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-100">
              <TableHead className="font-semibold text-sky-800">DOSE DE INSULINA (UI/KG/H)</TableHead>
              <TableHead className="font-semibold text-sky-800">Δ (ML)</TableHead>
              <TableHead className="font-semibold text-sky-800">2 x Δ (ML)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <TableCell>{item.doseRange}</TableCell>
                <TableCell>{item.deltaML}</TableCell>
                <TableCell>{item.twoDeltaML}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DoseAdjustmentTable;
