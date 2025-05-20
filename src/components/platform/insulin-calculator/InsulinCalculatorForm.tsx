
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const insulinFormSchema = z.object({
  peso: z.coerce.number().positive({ message: "Peso deve ser um número positivo." }).min(0.1, "Peso deve ser maior que zero."),
  glicemia: z.coerce.number().positive({ message: "Glicemia deve ser um número positivo." }).min(1, "Glicemia deve ser maior que zero."),
  taxaInfusaoUIKgH: z.coerce.number().positive({ message: "Taxa de infusão deve ser positiva." }).min(0.001, "Taxa de infusão deve ser maior que zero."),
});

export type InsulinFormValues = z.infer<typeof insulinFormSchema>;

interface InsulinCalculatorFormProps {
  form: UseFormReturn<InsulinFormValues>;
  onSubmit: (values: InsulinFormValues) => void;
}

const InsulinCalculatorForm: React.FC<InsulinCalculatorFormProps> = ({ form, onSubmit }) => {
  const navigate = useNavigate();

  return (
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
      </CardContent>
    </Card>
  );
};

export default InsulinCalculatorForm;
