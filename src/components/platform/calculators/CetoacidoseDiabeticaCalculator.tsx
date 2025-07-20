import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check, Activity, Droplets, Syringe } from 'lucide-react';
import { cetoacidoseDiabeticaCalculator } from '../../../utils/calculators/cetoacidose-diabetica';
import type { CetoacidoseCalculationInput, CetoacidoseCalculationResult } from '../../../types/protocol-calculators';

export const CetoacidoseDiabeticaCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CetoacidoseCalculationInput>({
    weight: 0,
    age: 0,
    glucose: 0,
    bicarbonate: 0,
    ph: 0,
    potassium: 0,
    deficitEstimate: 7 // Default 7%
  });

  const [result, setResult] = useState<CetoacidoseCalculationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.weight <= 0) {
      newErrors.push('Peso deve ser maior que zero');
    }

    if (formData.age < 0) {
      newErrors.push('Idade deve ser maior ou igual a zero');
    }

    if (formData.glucose <= 0) {
      newErrors.push('Glicemia deve ser informada');
    }

    if (formData.ph <= 0 || formData.ph > 14) {
      newErrors.push('pH deve estar entre 0 e 14');
    }

    if (formData.bicarbonate < 0) {
      newErrors.push('Bicarbonato deve ser maior ou igual a zero');
    }

    if (formData.potassium < 0) {
      newErrors.push('Potássio deve ser maior ou igual a zero');
    }

    if (formData.deficitEstimate < 5 || formData.deficitEstimate > 15) {
      newErrors.push('Déficit estimado deve estar entre 5% e 15%');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const calculationResult = cetoacidoseDiabeticaCalculator.calcular(formData);
      setResult(calculationResult);
      setErrors([]);
    } catch (error) {
      setErrors(['Erro no cálculo. Verifique os dados informados.']);
    }
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `
CALCULADORA DE CETOACIDOSE DIABÉTICA
===================================
Peso: ${formData.weight} kg
Idade: ${formData.age} anos
Glicemia: ${formData.glucose} mg/dL
pH: ${formData.ph}
Bicarbonato: ${formData.bicarbonate} mEq/L
Potássio: ${formData.potassium} mEq/L
Déficit estimado: ${formData.deficitEstimate}%

RESULTADO:
Gravidade: ${result.severity.toUpperCase()}

HIDRATAÇÃO:
- Expansão inicial: ${result.hydration.initialExpansion} mL
- Reparação residual: ${result.hydration.residualRepair} mL
- Manutenção 24h: ${result.hydration.maintenance24h} mL
- Volume total 24h: ${result.hydration.totalVolume24h} mL
- Fluxo horário: ${result.hydration.hourlyFlow} mL/h

INSULINOTERAPIA:
- Dose IV: ${result.insulin.ivMinDose} - ${result.insulin.ivMaxDose} U/h
- Volume IV: ${result.insulin.ivMinVolume} - ${result.insulin.ivMaxVolume} mL/h
- Dose subcutânea: ${result.insulin.scLowDose} - ${result.insulin.scHighDose} U

ELETRÓLITOS:
- Potássio: ${result.electrolytes.potassiumMin} - ${result.electrolytes.potassiumMax} mEq/kg/h
- ${result.electrolytes.recommendation}

${result.bicarbonate?.indicated ? `
BICARBONATO:
- Dose: ${result.bicarbonate.dose} mEq em 2h
- Reavaliar com nova gasometria
` : ''}

RECOMENDAÇÕES:
${result.recommendations.map(rec => `• ${rec}`).join('\n')}
    `;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'leve':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'grave':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'leve':
        return <CheckCircle className="h-4 w-4" />;
      case 'moderada':
        return <AlertTriangle className="h-4 w-4" />;
      case 'grave':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🩺 Calculadora de Cetoacidose Diabética
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados do Paciente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso (kg)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                placeholder="Ex: 30.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Idade (anos)</label>
              <Input
                type="number"
                min="0"
                value={formData.age || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Déficit Estimado (%)</label>
              <Input
                type="number"
                step="0.5"
                min="5"
                max="15"
                value={formData.deficitEstimate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, deficitEstimate: parseFloat(e.target.value) || 7 }))}
                placeholder="Ex: 7"
              />
            </div>
          </div>

          {/* Exames Laboratoriais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exames Laboratoriais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Glicemia (mg/dL)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.glucose || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, glucose: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 450"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">pH Arterial</label>
                <Input
                  type="number"
                  step="0.01"
                  min="6.8"
                  max="7.8"
                  value={formData.ph || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ph: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 7.15"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bicarbonato (mEq/L)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.bicarbonate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bicarbonate: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 8.5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Potássio (mEq/L)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.potassium || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, potassium: parseFloat(e.target.value) || 0 }))}
                  placeholder="Ex: 3.8"
                />
              </div>
            </div>
          </div>

          {/* Critérios Diagnósticos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Critérios Diagnósticos de CAD</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Glicemia &gt; 200 mg/dL</li>
              <li>• pH &lt; 7.3 OU Bicarbonato &lt; 15 mEq/L</li>
              <li>• Presença de cetose/cetonúria</li>
            </ul>
          </div>

          {/* Erros */}
          {errors.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Botão Calcular */}
          <Button onClick={handleCalculate} className="w-full" size="lg">
            Calcular Tratamento da CAD
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                📊 Resultados do Cálculo
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyResults}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gravidade */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Classificação de Gravidade</h3>
              <div className="flex items-center gap-3">
                <Badge className={`${getSeverityColor(result.severity)} flex items-center gap-2 px-3 py-2`}>
                  {getSeverityIcon(result.severity)}
                  CAD {result.severity.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Hidratação */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                Hidratação Venosa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.hydration.initialExpansion} ml</div>
                    <div className="text-sm text-gray-600">Expansão Inicial</div>
                    <div className="text-xs text-gray-500">SF 0,9% em 1h</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{result.hydration.residualRepair} ml</div>
                    <div className="text-sm text-gray-600">Reparação Residual</div>
                    <div className="text-xs text-gray-500">6 fases de 2h</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{result.hydration.hourlyFlow} ml/h</div>
                    <div className="text-sm text-gray-600">Fluxo Horário</div>
                    <div className="text-xs text-gray-500">Após expansão</div>
                  </div>
                </Card>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Volumes Totais</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Manutenção 24h: {result.hydration.maintenance24h} ml</li>
                  <li>• Volume total 24h: {result.hydration.totalVolume24h} ml</li>
                  <li>• Volume por fase: {result.hydration.volumePerPhase} ml</li>
                </ul>
              </div>
            </div>

            {/* Insulinoterapia */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Syringe className="h-5 w-5 text-green-600" />
                Insulinoterapia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Fase Intravenosa</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dose:</span>
                      <span className="font-mono">{result.insulin.ivMinDose} - {result.insulin.ivMaxDose} U/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Volume:</span>
                      <span className="font-mono">{result.insulin.ivMinVolume} - {result.insulin.ivMaxVolume} mL/h</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Transição Subcutânea</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dose pré-refeição:</span>
                      <span className="font-mono">{result.insulin.scLowDose} - {result.insulin.scHighDose} U</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">NPH manhã:</span>
                      <span className="font-mono">{result.insulin.nphDose} U</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Esquema por Glicemia */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Esquema por Glicemia (Subcutânea)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(result.insulin.schemeByGlycemia).map(([range, dose]) => (
                    <div key={range} className="flex justify-between">
                      <span className="text-green-700">{range}:</span>
                      <span className="font-mono text-green-800">{dose} U</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Eletrólitos */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Eletrolitoterapia
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Reposição de Potássio</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-orange-700">Dose recomendada:</span>
                    <span className="font-mono text-orange-800">
                      {result.electrolytes.potassiumMin} - {result.electrolytes.potassiumMax} mEq/kg/h
                    </span>
                  </div>
                  <p className="text-sm text-orange-800">{result.electrolytes.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Bicarbonato */}
            {result.bicarbonate?.indicated && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600">⚠️ Reposição de Bicarbonato</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-red-700">Dose calculada:</span>
                      <span className="font-mono text-red-800">{result.bicarbonate.dose} mEq</span>
                    </div>
                    <p className="text-sm text-red-800">
                      Administrar em 2 horas, diluído em SF. Reavaliar com nova gasometria.
                    </p>
                    <div className="text-xs text-red-600 mt-2">
                      * Uso reservado para casos graves (pH &lt; 7.0 ou bicarbonato &lt; 5 mEq/L)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recomendações */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recomendações Gerais</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="space-y-1">
                  {result.recommendations.map((recomendacao, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      {recomendacao}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
