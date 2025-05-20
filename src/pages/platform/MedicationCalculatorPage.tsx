import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns'; // Importar date-fns
import { ptBR } from 'date-fns/locale'; // Importar locale pt-BR

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
import { ArrowLeft, AlertTriangle, Pill, Bot, Info, Syringe, Bookmark, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const formSchema = z.object({
  weight: z.coerce.number().positive({ message: "Peso deve ser um número positivo." }),
  age: z.coerce.number().int().positive({ message: "Idade deve ser um número inteiro positivo." }),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationData {
  weight: number;
  age: number;
  calculatedDoseText: string;
  calculationTime: string;
  calculationDate: string;
}

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

  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);

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

  const CategoryIcon = categoryDisplayInfo.icon || Pill; // This might not be used in results view
  const MedicationIcon = Pill; // Using Pill for results view as per image

  const onSubmit = (values: FormValues) => {
    console.log("Valores do formulário:", values);
    // Placeholder para lógica de cálculo de dose
    const doseResult = `Resultado para ${medication.name}: ${values.weight}kg, ${values.age} anos. (Lógica de cálculo real pendente)`;
    
    setCalculationData({
      weight: values.weight,
      age: values.age,
      calculatedDoseText: doseResult,
      calculationDate: format(new Date(), "dd/MM/yyyy"),
      calculationTime: format(new Date(), "HH:mm"),
    });
  };

  const handleReturnToForm = () => {
    setCalculationData(null);
    form.reset();
  };

  if (calculationData) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 bg-[#F1F0FB] min-h-full rounded-lg">
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
               <BreadcrumbLink asChild>
                <Link to={`/platform/calculator/${categorySlug}/${medicationSlug}`}>Calc: {medication.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Resultado</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Resultado do Cálculo</h1>
          <Button variant="outline" onClick={handleReturnToForm}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retornar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Dose Calculada Card */}
          <Card className="lg:col-span-2 bg-pink-50 border-pink-200 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-primary/70 hover:text-primary">
              <Copy className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2">
              <div className="flex items-center text-pink-600">
                <Pill className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg font-semibold">Dose Calculada</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                {medication.name} {medication.form ? `(${medication.form})` : ''}
              </h2>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p><span className="font-semibold">Posologia:</span></p>
                <p>Duração: <span className="italic">{medication.dosageInformation?.treatmentDuration || "Conforme orientação médica"}</span></p>
                <p>Intervalo: <span className="italic">{medication.dosageInformation?.doseInterval || "Conforme orientação médica"}</span></p>
                <p>Dose usual: <span className="italic">{medication.dosageInformation?.usualDose || "Conforme orientação médica"}</span></p>
              </div>
              <Alert variant="default" className="bg-white">
                <AlertTitle className="font-semibold">Cálculo Específico:</AlertTitle>
                <AlertDescription>{calculationData.calculatedDoseText}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Dados do Paciente Card */}
          <Card className="relative">
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-primary/70 hover:text-primary">
              <Copy className="h-4 w-4" />
            </Button>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Dados do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
              <p>Peso: <span className="font-medium">{calculationData.weight} kg</span></p>
              <p>Idade: <span className="font-medium">{calculationData.age} anos</span></p>
              <p>Data do cálculo: <span className="font-medium">{calculationData.calculationDate}</span></p>
              <p>Horário: <span className="font-medium">{calculationData.calculationTime}</span></p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Informações do Medicamento</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 relative">
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-primary/70 hover:text-primary">
              <Copy className="h-4 w-4" />
            </Button>
            <CardHeader>
              <CardTitle className="text-xl text-gray-700">{medication.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {medication.description || "Descrição não disponível."}
              </p>
              {medication.alerts && medication.alerts.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-red-600 mb-1">Alertas:</h4>
                  <ul className="list-disc list-inside text-sm text-red-500">
                    {medication.alerts.map((alert, index) => <li key={index}>{alert}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-primary/70 hover:text-primary">
              <Copy className="h-4 w-4" />
            </Button>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Observações</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
              {medication.dosageInformation?.administrationNotes ? (
                <p>{medication.dosageInformation.administrationNotes}</p>
              ) : (
                <>
                  <p>Tomar com ou sem alimentos, conforme orientação.</p>
                  <p>Completar todo o tratamento prescrito.</p>
                  <p>Manter em temperatura ambiente, salvo indicação contrária.</p>
                  {/* Exemplo de informação específica, se disponível */}
                  {/* <p>Validade após reconstituição: 14 dias</p> */}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 flex justify-end">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Bookmark className="mr-2 h-4 w-4" /> Favoritar Medicamento
            </Button>
        </div>
      </div>
    );
  }

  // Formulário de Cálculo (quando calculationData é null)
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

      {/* Informações Resumidas (como estava antes) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Informações resumidas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className={`border-l-4 ${categoryDisplayInfo.iconColorClass?.replace('text-', 'border-') || 'border-pink-500'}`}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <CategoryIcon className={`h-6 w-6 ${categoryDisplayInfo.iconColorClass || 'text-pink-500'}`} />
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

      {/* Calculadora de Dose e Informações do Medicamento (Formulário) */}
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
              {/* Removido o Alert de dose calculada daqui, pois agora temos uma view separada */}
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Bot className="mr-2 h-4 w-4" /> Auxílio do Lifebot
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Bot className="mr-2 h-5 w-5 text-primary" /> Lifebot Assistente
                      </DialogTitle>
                      <DialogDescription>
                        Informações sobre {medication.name} e possíveis interações alérgicas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <p className="text-sm font-semibold">Medicamento: {medication.name}</p>
                      {medication.description && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Descrição:</strong> {medication.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground pt-2">
                        Aqui o Lifebot forneceria informações detalhadas sobre alergias, interações medicamentosas comuns e outras considerações importantes para o medicamento {medication.name}.
                      </p>
                       {medication.alerts && medication.alerts.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-red-600">Alertas Importantes:</p>
                          <ul className="list-disc list-inside text-sm text-red-500 pl-4">
                            {medication.alerts.map((alert, index) => (
                              <li key={index}>{alert}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Fechar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MedicationCalculatorPage;
