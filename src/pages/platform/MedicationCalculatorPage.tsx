
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { mockMedicationsData, allCategories } from '@/data/mockMedications';
import { Medication, CategoryInfo } from '@/types/medication';

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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Pill, Bot, Info, Syringe } from 'lucide-react'; // Adicionado Bot, Info, Syringe

const formSchema = z.object({
  weight: z.coerce.number().positive({ message: "Peso deve ser um número positivo." }),
  age: z.coerce.number().int().positive({ message: "Idade deve ser um número inteiro positivo." }),
});

type FormValues = z.infer<typeof formSchema>;

const MedicationCalculatorPage: React.FC = () => {
  const { categorySlug, medicationSlug } = useParams<{ categorySlug: string; medicationSlug: string }>();
  const navigate = useNavigate();

  const categoryData = categorySlug ? mockMedicationsData[categorySlug] : undefined;
  const medication = categoryData?.medications.find(m => m.slug === medicationSlug);
  const categoryDisplayInfo = allCategories.find(c => c.slug === categorySlug);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      age: undefined,
    },
  });

  const [calculatedDose, setCalculatedDose] = useState<string | null>(null);

  if (!categoryData || !medication || !categoryDisplayInfo) {
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
  }

  const CategoryIcon = categoryDisplayInfo.icon || Pill;
  const MedicationIcon = categoryData.icon === Syringe ? Syringe : Pill; // Usar Syringe se for da categoria EV

  const onSubmit = (values: FormValues) => {
    // Placeholder para lógica de cálculo de dose
    console.log("Valores do formulário:", values);
    setCalculatedDose(`Dose calculada para ${values.weight}kg e ${values.age} anos: (Lógica de cálculo pendente)`);
    // Idealmente, aqui você chamaria uma função que usa os dados do medicamento
    // e os valores do formulário para calcular a dose.
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-slate-50 min-h-full rounded-lg">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/platform/calculator">Calculadora</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/platform/calculator/${categorySlug}`}>{categoryData.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Calc: {medication.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Informações Resumidas */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Informações resumidas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className={`border-l-4 ${categoryDisplayInfo.iconColorClass?.replace('text-', 'border-') || 'border-pink-500'}`}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <MedicationIcon className={`h-6 w-6 ${categoryDisplayInfo.iconColorClass || 'text-pink-500'}`} />
              <CardTitle className="text-xl">{medication.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{medication.description || "Descrição não disponível."}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <CardTitle className="text-xl">Alerta</CardTitle>
            </CardHeader>
            <CardContent>
              {medication.alerts && medication.alerts.length > 0 ? (
                medication.alerts.map((alert, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{alert}</p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum alerta específico para este medicamento.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-blue-500">
             <CardHeader className="flex flex-row items-center gap-3 pb-2">
               <Info className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-xl">Principais Apresentações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{medication.form || "Forma de apresentação não disponível."}</p>
              {medication.commonBrandNames && <p className="text-xs text-muted-foreground mt-1">Nomes comuns: {medication.commonBrandNames}</p>}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculadora de Dose e Informações do Medicamento */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Calculadora de Dose</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="weight">Peso (kg)</FormLabel>
                        <FormControl>
                          <Input id="weight" type="number" placeholder="Digite o peso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="age">Idade (anos)</FormLabel>
                        <FormControl>
                          <Input id="age" type="number" placeholder="Digite a idade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" className="w-full sm:w-auto bg-[#6B46C1] hover:bg-[#553C9A]">
                      Calcular Dose
                    </Button>
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                  </div>
                </form>
              </Form>
              {calculatedDose && (
                <Alert className="mt-6">
                  <AlertTitle>Dose Calculada</AlertTitle>
                  <AlertDescription>{calculatedDose}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Informações do Medicamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Label className="font-semibold">Nome:</Label>
                <p className="text-muted-foreground">{medication.name}</p>
              </div>
              {medication.dosageInformation?.concentration && (
                <div>
                  <Label className="font-semibold">Concentração:</Label>
                  <p className="text-muted-foreground">{medication.dosageInformation.concentration}</p>
                </div>
              )}
              {medication.dosageInformation?.usualDose && (
                <div>
                  <Label className="font-semibold">Dose usual:</Label>
                  <p className="text-muted-foreground">{medication.dosageInformation.usualDose}</p>
                </div>
              )}
               {medication.dosageInformation?.doseInterval && (
                <div>
                  <Label className="font-semibold">Intervalo:</Label>
                  <p className="text-muted-foreground">{medication.dosageInformation.doseInterval}</p>
                </div>
              )}
              {medication.dosageInformation?.treatmentDuration && (
                <div>
                  <Label className="font-semibold">Duração:</Label>
                  <p className="text-muted-foreground">{medication.dosageInformation.treatmentDuration}</p>
                </div>
              )}
              {medication.dosageInformation?.administrationNotes && (
                 <div>
                  <Label className="font-semibold">Notas de Administração:</Label>
                  <p className="text-muted-foreground">{medication.dosageInformation.administrationNotes}</p>
                </div>
              )}
              <div className="pt-4">
                <p className="text-xs text-center text-muted-foreground mb-2">Paciente alérgico?</p>
                <Button variant="outline" className="w-full">
                  <Bot className="mr-2 h-4 w-4" /> Auxílio do Lifebot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MedicationCalculatorPage;
