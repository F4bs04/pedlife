
import React from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MedicationCalculatorInputForm from './MedicationCalculatorInputForm';
import MedicationDetailsSideCard from './MedicationDetailsSideCard';

interface DoseCalculatorSectionProps<T extends FieldValues> {
  medication: Medication;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  navigate: NavigateFunction;
}

const DoseCalculatorSection = <T extends FieldValues>({ medication, form, onSubmit, navigate }: DoseCalculatorSectionProps<T>) => {
  return (
    <section className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Calculadora de Dose</CardTitle>
          </CardHeader>
          <CardContent>
            <MedicationCalculatorInputForm form={form} onSubmit={onSubmit} navigate={navigate} />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <MedicationDetailsSideCard medication={medication} />
      </div>
    </section>
  );
};

export default DoseCalculatorSection;
