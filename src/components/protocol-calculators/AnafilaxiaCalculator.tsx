import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, AlertTriangle, Activity, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { anafilaxiaCalculator } from '@/utils/protocol-calculators/anafilaxia';
import {
  AnafilaxiaSymptoms,
  AnafilaxiaCalculationInput,
  AnafilaxiaCalculationResult
} from '@/types/protocol-calculators';

interface AnafilaxiaCalculatorProps {
  onResultsChange?: (results: AnafilaxiaCalculationResult | null) => void;
}

export const AnafilaxiaCalculator: React.FC<AnafilaxiaCalculatorProps> = ({ onResultsChange }) => {
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [symptoms, setSymptoms] = useState<AnafilaxiaSymptoms>({});
  const [results, setResults] = useState<AnafilaxiaCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Grupos de sintomas para organização
  const symptomGroups = {
    cutaneous: {
      title: 'Sintomas Cutâneos',
      icon: <Activity className="h-4 w-4" />,
      symptoms: [
        { key: 'rubor', label: 'Rubor' },
        { key: 'prurido', label: 'Prurido' },
        { key: 'urticaria', label: 'Urticária' },
        { key: 'angioedema', label: 'Angioedema' },
        { key: 'rash_morbiliforme', label: 'Rash morbiliforme' }
      ]
    },
    respiratory: {
      title: 'Sintomas Respiratórios',
      icon: <Activity className="h-4 w-4" />,
      symptoms: [
        { key: 'prurido_garganta', label: 'Prurido/aperto na garganta' },
        { key: 'disfagia', label: 'Disfagia' },
        { key: 'rouquidao', label: 'Rouquidão' },
        { key: 'tosse_seca', label: 'Tosse seca' },
        { key: 'estridor', label: 'Estridor' },
        { key: 'dispneia', label: 'Dispneia' },
        { key: 'sibilancia', label: 'Sibilância' }
      ]
    },
    cardiovascular: {
      title: 'Sintomas Cardiovasculares',
      icon: <Heart className="h-4 w-4" />,
      symptoms: [
        { key: 'hipotensao', label: 'Hipotensão' },
        { key: 'taquicardia', label: 'Taquicardia' },
        { key: 'bradicardia', label: 'Bradicardia' },
        { key: 'dor_peito', label: 'Dor no peito' },
        { key: 'sincope', label: 'Síncope' }
      ]
    },
    gastrointestinal: {
      title: 'Sintomas Gastrointestinais',
      icon: <Activity className="h-4 w-4" />,
      symptoms: [
        { key: 'nausea', label: 'Náusea' },
        { key: 'dor_abdominal', label: 'Dor abdominal' },
        { key: 'vomitos', label: 'Vômitos' },
        { key: 'diarreia', label: 'Diarreia' }
      ]
    },
    neurological: {
      title: 'Sintomas Neurológicos',
      icon: <AlertTriangle className="h-4 w-4" />,
      symptoms: [
        { key: 'vertigem', label: 'Vertigem' },
        { key: 'estado_mental_alterado', label: 'Estado mental alterado' },
        { key: 'convulsoes', label: 'Convulsões' }
      ]
    }
  };

  const handleSymptomChange = (symptomKey: string, checked: boolean) => {
    setSymptoms(prev => ({
      ...prev,
      [symptomKey]: checked
    }));
  };

  const calculateTreatment = () => {
    if (!weight || !age) {
      toast({
        title: "Erro",
        description: "Por favor, preencha peso e idade",
        variant: "destructive"
      });
      return;
    }

    const weightNum = parseFloat(weight);
    const ageNum = parseFloat(age);

    if (weightNum <= 0 || ageNum < 0) {
      toast({
        title: "Erro", 
        description: "Peso deve ser maior que zero e idade deve ser maior ou igual a zero",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: AnafilaxiaCalculationInput = {
        weight: weightNum,
        age: ageNum,
        symptoms
      };

      const calculatedResults = anafilaxiaCalculator.calculate(input);
      setResults(calculatedResults);
      onResultsChange?.(calculatedResults);
      toast({
        title: "Sucesso",
        description: "Cálculo realizado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro no cálculo',
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Texto copiado para a área de transferência!"
    });
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'leve': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'grave': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 15.5"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="age">Idade (anos)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 3"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliação de Sintomas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Avaliação de Sintomas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(symptomGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                {group.icon}
                {group.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.symptoms.map((symptom) => (
                  <div key={symptom.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom.key}
                      checked={symptoms[symptom.key as keyof AnafilaxiaSymptoms] || false}
                      onCheckedChange={(checked) => 
                        handleSymptomChange(symptom.key, checked as boolean)
                      }
                    />
                    <Label htmlFor={symptom.key} className="text-sm">
                      {symptom.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Botão de Cálculo */}
      <div className="flex justify-center">
        <Button 
          onClick={calculateTreatment}
          disabled={isCalculating}
          className="px-8 py-2"
        >
          {isCalculating ? 'Calculando...' : 'Calcular Tratamento'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Gravidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Avaliação de Gravidade</span>
                <Badge className={getSeverityColor(results.severity.level)}>
                  {results.severity.level.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{results.severity.description}</p>
              <div>
                <strong>Sistemas envolvidos:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {results.severity.systems.map((system, index) => (
                    <Badge key={index} variant="outline">{system}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adrenalina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Dose de Adrenalina</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(
                    `Adrenalina: ${results.adrenaline.doseMg} mg (${results.adrenaline.doseML} mL)\n` +
                    `Administração: ${results.adrenaline.administration}\n` +
                    `Repetir: ${results.adrenaline.repeatInterval}`
                  )}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Dose:</strong> {results.adrenaline.doseMg} mg ({results.adrenaline.doseML} mL)
                </div>
                <div>
                  <strong>Dose máxima:</strong> {results.adrenaline.maxDose} mg
                </div>
                <div className="md:col-span-2">
                  <strong>Administração:</strong> {results.adrenaline.administration}
                </div>
                {results.adrenaline.canRepeat && (
                  <div className="md:col-span-2">
                    <strong>Repetir:</strong> {results.adrenaline.repeatInterval}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pressão Arterial Mínima */}
          <Card>
            <CardHeader>
              <CardTitle>Pressão Arterial de Referência</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  PA sistólica mínima para esta idade: <strong>{results.minBloodPressure} mmHg</strong>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Medicações Adjuvantes */}
          <Card>
            <CardHeader>
              <CardTitle>Medicações Adjuvantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Anti-histamínicos</h4>
                <div className="space-y-2">
                  {results.antihistaminics.map((med, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>{med.name}</strong>
                          <p className="text-sm text-gray-600">
                            Dose: {med.dose} | Máx: {med.maxDose} | Via: {med.route}
                          </p>
                          {med.observation && (
                            <p className="text-xs text-gray-500 italic">{med.observation}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${med.name}: ${med.dose}`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Corticosteroides</h4>
                <div className="space-y-2">
                  {results.corticosteroids.map((med, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>{med.name}</strong>
                          <p className="text-sm text-gray-600">
                            Dose: {med.dose} | Máx: {med.maxDose} | Via: {med.route}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${med.name}: ${med.dose}`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recomendações de Manejo</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(results.recommendations.join('\n'))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnafilaxiaCalculator;
