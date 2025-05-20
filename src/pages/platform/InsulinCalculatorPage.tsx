
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const insulinFormSchema = z.object({
  peso: z.coerce.number().positive({ message: "Peso deve ser um número positivo." }).min(0.1, "Peso deve ser maior que zero."),
  glicemia: z.coerce.number().positive({ message: "Glicemia deve ser um número positivo." }).min(1, "Glicemia deve ser maior que zero."),
  taxaInfusaoUIKgH: z.coerce.number().positive({ message: "Taxa de infusão deve ser positiva." }).min(0.001, "Taxa de infusão deve ser maior que zero."),
});

type InsulinFormValues = z.infer<typeof insulinFormSchema>;

interface CalculatedValues {
  doseInsulinaUIH: string;
  administracaoBICMlH: string;
  solucaoInsulina: string;
}

const protocolData = [
  { condition: "GLICEMIA ≥ 180 MG/DL", conduct: "CONDUTA (VIDE TABELA 2)" },
  { condition: "GLICEMIA ↑", conduct: "↑ “2 X Δ”" },
  { condition: "GLICEMIA INALTERADA OU GLICEMIA ↓ DE 1 - 40 MG/DL/H", conduct: "↑ “1 X Δ”" },
  { condition: "GLICEMIA ↓ DE 41 - 80 MG/DL/H", conduct: "NÃO ALTERA" },
  { condition: "GLICEMIA ↓ DE 81 - 120 MG/DL/H", conduct: "↓ “1 X Δ”" },
  { condition: "GLICEMIA ↓ + DE 120 MG/DL/H", conduct: "PARA A INFUSÃO POR 30 MIN. E REINICIE ↓ “2 X Δ”" },
];

const doseAdjustmentData = [
  { doseRange: "< 0,04 UI/KG/H", deltaML: "4,2 ML", twoDeltaML: "8,4 ML" },
  { doseRange: "0,04 - 0,08 UI/KG/H", deltaML: "8,4 ML", twoDeltaML: "16,8 ML" },
  { doseRange: "0,09 - 0,13 UI/KG/H", deltaML: "12,6 ML", twoDeltaML: "25,2 ML" },
  { doseRange: "0,14 - 0,2 UI/KG/H", deltaML: "16,8 ML", twoDeltaML: "33,6 ML" },
  { doseRange: "0,21 - 0,27 UI/KG/H", deltaML: "25,2 ML", twoDeltaML: "50,4 ML" },
  { doseRange: "0,28 - 0,35 UI/KG/H", deltaML: "33,6 ML", twoDeltaML: "67,2 ML" },
  { doseRange: "> 0,35 UI/KG/H", deltaML: "42 ML", twoDeltaML: "84 ML" },
];

const InsulinCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues | null>(null);

  const form = useForm<InsulinFormValues>({
    resolver: zodResolver(insulinFormSchema),
    defaultValues: {
      peso: undefined, // Será string vazia no input, convertido para number por coerce
      glicemia: undefined,
      taxaInfusaoUIKgH: 0.036, // Valor de exemplo da imagem
    },
  });

  const onSubmit = (values: InsulinFormValues) => {
    const doseUIH = values.taxaInfusaoUIKgH * values.peso;
    const adminBICMlH = doseUIH * 10; // Baseado em 25 UI em 250 ML (0.1 UI/ML)

    setCalculatedValues({
      doseInsulinaUIH: doseUIH.toFixed(2),
      administracaoBICMlH: adminBICMlH.toFixed(1),
      solucaoInsulina: "INSULINA REGULAR 25 UI + SF 0,9% 250 ML",
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 bg-slate-50 min-h-full rounded-lg">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/platform/calculator">Calculadora</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cálculo de Insulina</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[#6B46C1]">
            Cálculos Automáticos Baseados no Peso (KG) e Valor Glicêmico (MG/DL) para Infusão de Insulina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 items-end">
                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="peso" className="text-base">PESO (KG)</FormLabel>
                      <FormControl>
                        <Input id="peso" type="number" placeholder="Ex: 42" {...field} className="text-base py-2 bg-orange-50 border-orange-300" step="0.1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="glicemia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="glicemia" className="text-base">VALOR DA GLICEMIA (MG/DL)</FormLabel>
                      <FormControl>
                        <Input id="glicemia" type="number" placeholder="Ex: 360" {...field} className="text-base py-2 bg-orange-50 border-orange-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxaInfusaoUIKgH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="taxaInfusaoUIKgH" className="text-base">TAXA DE INFUSÃO (UI/KG/H)</FormLabel>
                      <FormControl>
                        <Input id="taxaInfusaoUIKgH" type="number" placeholder="Ex: 0.036" {...field} className="text-base py-2 bg-orange-50 border-orange-300" step="0.001"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" className="w-full sm:w-auto bg-[#6B46C1] hover:bg-[#553C9A] text-base py-3 px-6">
                      Calcular
                    </Button>
                    <Button type="button" variant="outline" className="w-full sm:w-auto text-base py-3 px-6" onClick={() => navigate(-1)}>
                      <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
                    </Button>
                 </div>
              </div>
            </form>
          </Form>

          {calculatedValues && (
            <div className="mt-8 space-y-3">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Resultados Calculados:</h3>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 p-4 border rounded-md bg-slate-100">
                <Label className="font-medium text-gray-600">DOSE DE INSULINA (UI/H):</Label>
                <p className="text-gray-800 font-semibold">{calculatedValues.doseInsulinaUIH} UI/H</p>
                
                <Label className="font-medium text-gray-600">TAXA DE INFUSÃO (UI/KG/H):</Label>
                <p className="text-gray-800 font-semibold">{form.getValues("taxaInfusaoUIKgH")} UI/KG/H</p>
                
                <Label className="font-medium text-gray-600">SOLUÇÃO DE INSULINA:</Label>
                <p className="text-gray-800 font-semibold">{calculatedValues.solucaoInsulina}</p>
                
                <Label className="font-medium text-gray-600">ADMINISTRAÇÃO EM BIC (ML/H):</Label>
                <p className="text-gray-800 font-semibold">{calculatedValues.administracaoBICMlH} ML/H</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="bg-sky-100">
          <CardTitle className="text-lg text-sky-700">Notas Importantes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-gray-700 space-y-1">
          <p>* INICIAR CONTROLE DA GLICEMIA A CADA 1 HORA</p>
          <p>* MANTER GLICEMIA CAPILAR ≤ 180 MG/DL</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-1 gap-8">
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
                {protocolData.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell>{item.conduct}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
                {doseAdjustmentData.map((item, index) => (
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
      </div>
    </div>
  );
};

export default InsulinCalculatorPage;

