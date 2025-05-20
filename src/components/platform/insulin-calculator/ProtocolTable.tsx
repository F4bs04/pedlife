
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

interface ProtocolDataItem {
  condition: string;
  conduct: string;
}

interface ProtocolTableProps {
  data: ProtocolDataItem[];
}

const ProtocolTable: React.FC<ProtocolTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="bg-sky-600">
        <CardTitle className="text-xl text-white">PROTOCOLO DE CONTROLE DE GLICEMIA</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-100">
              <TableHead className="font-semibold text-sky-800">GLICEMIA</TableHead>
              <TableHead className="font-semibold text-sky-800">CONDUTA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.conduct}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProtocolTable;
