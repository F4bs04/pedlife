
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { Medication } from '@/types/medication';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MedicationCalculatorInputForm from './MedicationCalculatorInputForm';
import MedicationDetailsSideCard from './MedicationDetailsSideCard';

type FormValues = {
  weight: number;
  age: number;
};

interface DoseCalculatorSectionProps {
  medication: Medication;
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  navigate: NavigateFunction;
}

const DoseCalculatorSection = ({ medication, form, onSubmit, navigate }: DoseCalculatorSectionProps) => {
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
