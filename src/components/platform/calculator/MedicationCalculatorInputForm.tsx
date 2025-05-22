
import React from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from 'lucide-react';

interface MedicationCalculatorInputFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  navigate: NavigateFunction;
}

const MedicationCalculatorInputForm = <T extends FieldValues>({ form, onSubmit, navigate }: MedicationCalculatorInputFormProps<T>) => {
  return (
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
  );
};

export default MedicationCalculatorInputForm;
