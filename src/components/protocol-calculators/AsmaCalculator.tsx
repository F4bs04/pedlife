import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, AlertTriangle, Activity, Heart, Wind, Thermometer } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { asmaCalculator } from '@/utils/protocol-calculators/asma';
import {
  AsmaCalculationInput,
  AsmaCalculationResult
} from '@/types/protocol-calculators';

interface AsmaCalculatorProps {
  onResultsChange?: (results: AsmaCalculationResult | null) => void;
}

export const AsmaCalculator: React.FC<AsmaCalculatorProps> = ({ onResultsChange }) => {
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [respiratoryRate, setRespiratoryRate] = useState<string>('');
  const [oxygenSaturation, setOxygenSaturation] = useState<string>('');
  const [retractions, setRetractions] = useState<string>('');
  const [speech, setSpeech] = useState<string>('');
  const [consciousness, setConsciousness] = useState<string>('');
  const [wheezing, setWheezing] = useState<string>('');
  const [results, setResults] = useState<AsmaCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateTreatment = () => {
    if (!weight || !age || !respiratoryRate || !oxygenSaturation) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const weightNum = parseFloat(weight);
    const ageNum = parseFloat(age);
    const rrNum = parseFloat(respiratoryRate);
    const satNum = parseFloat(oxygenSaturation);

    if (weightNum <= 0 || ageNum < 0 || rrNum <= 0 || satNum < 50 || satNum > 100) {
      toast({
        title: "Erro", 
        description: "Verifique os valores inseridos (peso > 0, idade ≥ 0, FR > 0, SatO₂ entre 50-100%)",
        variant: "destructive"
      });
      return;
    }

    if (!retractions || !speech || !consciousness || !wheezing) {
      toast({
        title: "Erro",
        description: "Por favor, selecione todas as opções de avaliação clínica",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: AsmaCalculationInput = {
        weight: weightNum,
        age: ageNum,
        respiratoryRate: rrNum,
        oxygenSaturation: satNum,
        retractions: retractions as AsmaCalculationInput['retractions'],
        speech: speech as AsmaCalculationInput['speech'],
        consciousness: consciousness as AsmaCalculationInput['consciousness'],
        wheezing: wheezing as AsmaCalculationInput['wheezing']
      };

      const calculatedResults = asmaCalculator.calculate(input);
      setResults(calculatedResults);
      onResultsChange?.(calculatedResults);
      toast({
        title: "Sucesso",
        description: "Avaliação da crise asmática realizada com sucesso!"
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
      case 'iminencia_parada': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = (level: string) => {
    switch (level) {
      case 'leve': return 'LEVE';
      case 'moderada': return 'MODERADA';
      case 'grave': return 'GRAVE';
      case 'iminencia_parada': return 'IMINÊNCIA DE PARADA';
      default: return level.toUpperCase();
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
              <Label htmlFor="weight">Peso (kg) *</Label>
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
              <Label htmlFor="age">Idade (anos) *</Label>
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

      {/* Sinais Vitais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Sinais Vitais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="respiratoryRate">Frequência Respiratória (irpm) *</Label>
              <Input
                id="respiratoryRate"
                type="number"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value)}
                placeholder="Ex: 45"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="oxygenSaturation">Saturação de O₂ (%) *</Label>
              <Input
                id="oxygenSaturation"
                type="number"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(e.target.value)}
                placeholder="Ex: 94"
                min="50"
                max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliação Clínica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5" />
            Avaliação Clínica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="retractions">Retrações *</Label>
              <Select value={retractions} onValueChange={setRetractions}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ausentes">Ausentes</SelectItem>
                  <SelectItem value="leves">Leves</SelectItem>
                  <SelectItem value="moderadas">Moderadas</SelectItem>
                  <SelectItem value="graves">Graves</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="speech">Capacidade de Falar *</Label>
              <Select value={speech} onValueChange={setSpeech}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frases_completas">Frases completas</SelectItem>
                  <SelectItem value="frases_incompletas">Frases incompletas</SelectItem>
                  <SelectItem value="palavras">Apenas palavras</SelectItem>
                  <SelectItem value="nao_fala">Não consegue falar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consciousness">Nível de Consciência *</Label>
              <Select value={consciousness} onValueChange={setConsciousness}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="agitado">Agitado</SelectItem>
                  <SelectItem value="sonolento">Sonolento</SelectItem>
                  <SelectItem value="confuso">Confuso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wheezing">Sibilância à Ausculta *</Label>
              <Select value={wheezing} onValueChange={setWheezing}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ausente">Ausente</SelectItem>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderado">Moderada</SelectItem>
                  <SelectItem value="intenso">Intensa</SelectItem>
                  <SelectItem value="silencio">Silêncio (tórax mudo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Cálculo */}
      <div className="flex justify-center">
        <Button 
          onClick={calculateTreatment}
          disabled={isCalculating}
          className="px-8 py-2"
        >
          {isCalculating ? 'Avaliando...' : 'Avaliar Crise Asmática'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Gravidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Classificação de Gravidade</span>
                <Badge className={getSeverityColor(results.severity.level)}>
                  {getSeverityLabel(results.severity.level)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Características Identificadas:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    {results.severity.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Tratamento Indicado:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    {results.severity.treatment.map((treatment, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beta-2 Agonistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Broncodilatadores (Beta-2 Agonistas)</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(
                    results.beta2Agonists.map(med => 
                      `${med.name}: ${med.dose}`
                    ).join('\n')
                  )}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.beta2Agonists.map((med, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-blue-800">{med.name}</strong>
                        <p className="text-sm text-gray-600">{med.presentation}</p>
                        <p className="text-sm font-medium mt-1">{med.dose}</p>
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
            </CardContent>
          </Card>

          {/* Oxigenoterapia */}
          {results.oxygenTherapy.indicated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-600" />
                  Oxigenoterapia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Indicada:</strong> {results.oxygenTherapy.flow}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Corticosteroides */}
          <Card>
            <CardHeader>
              <CardTitle>Corticosteroides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.corticosteroids.map((med, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-yellow-800">{med.name}</strong>
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
            </CardContent>
          </Card>

          {/* Critérios de Internação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Critérios de Internação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.hospitalizationCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{criteria}</span>
                  </div>
                ))}
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

export default AsmaCalculator;
