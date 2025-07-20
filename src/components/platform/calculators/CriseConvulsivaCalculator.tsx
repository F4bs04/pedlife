import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check, Brain, Clock, Zap, Stethoscope, Syringe } from 'lucide-react';
import { criseConvulsivaCalculator } from '../../../utils/calculators/crise-convulsiva';
import type { CriseConvulsivaInput, CriseConvulsivaResult } from '../../../types/protocol-calculators';

export const CriseConvulsivaCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CriseConvulsivaInput>({
    weight: 0,
    ageYears: 0,
    ageMonths: 0,
    criseStoped: true,
    criseDuration: 0,
    firstCrise: false,
    fever: false,
    consciousnessReturn: true,
    glasgow: 15,
    suspectedInfection: false
  });

  const [result, setResult] = useState<CriseConvulsivaResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.weight <= 0) {
      newErrors.push('Peso deve ser maior que zero');
    }

    if (formData.ageYears < 0) {
      newErrors.push('Idade deve ser maior ou igual a zero');
    }

    if (formData.criseDuration < 0) {
      newErrors.push('Duração da crise deve ser maior ou igual a zero');
    }

    if (formData.glasgow < 3 || formData.glasgow > 15) {
      newErrors.push('Escala de Glasgow deve estar entre 3 e 15');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const calculationResult = criseConvulsivaCalculator.calcular(formData);
      setResult(calculationResult);
      setErrors([]);
    } catch (error) {
      setErrors(['Erro no cálculo. Verifique os dados informados.']);
    }
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `
CALCULADORA DE CRISE CONVULSIVA
===============================
Peso: ${formData.weight} kg
Idade: ${formData.ageYears} anos e ${formData.ageMonths} meses
Duração da crise: ${formData.criseDuration} minutos
Crise cessou: ${formData.criseStoped ? 'Sim' : 'Não'}
Glasgow: ${formData.glasgow}

AVALIAÇÃO:
${result.avaliacaoEme.eme ? 'ESTADO DE MAL EPILÉPTICO (EME)' : 'Crise convulsiva'}
${result.avaliacaoEme.definicao}

MEDICAÇÕES:
1. Diazepam: ${result.doses.diazepam.doseFormulacao}
2. Midazolam: ${result.doses.midazolam.doseFormulacao}
3. Fenobarbital: ${result.doses.fenobarbital.doseFormulacao}
4. Fenitoína: ${result.doses.fenitoina.doseFormulacao}
${result.avaliacaoEme.eme ? `5. Midazolam infusão: ${result.doses.midazolamInfusao.doseFormulacao}` : ''}

CONDUTA:
${result.conduta.recomendacao}
${result.conduta.esquema ? result.conduta.esquema.join('\n') : ''}
${result.conduta.observacao || ''}

HOSPITALIZAÇÃO:
${result.necessidadeHospitalizacao ? 'INDICADA' : 'AVALIAR'}
${result.criteriosHospitalizacao.map(c => `• ${c}`).join('\n')}

PUNÇÃO LOMBAR:
${result.avaliacaoPl.indicacao ? 'INDICADA' : 'NÃO INDICADA'}
${result.avaliacaoPl.criterios.map(c => `• ${c}`).join('\n')}
    `;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const getSeverityColor = (eme: boolean) => {
    return eme ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200';
  };

  const getSeverityIcon = (eme: boolean) => {
    return eme ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Calculadora de Crise Convulsiva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados do Paciente */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso (kg)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                placeholder="Ex: 25.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Idade (anos)</label>
              <Input
                type="number"
                min="0"
                value={formData.ageYears || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ageYears: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 8"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meses adicionais</label>
              <Input
                type="number"
                min="0"
                max="11"
                value={formData.ageMonths || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ageMonths: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 6"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Escala de Glasgow</label>
              <Input
                type="number"
                min="3"
                max="15"
                value={formData.glasgow || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, glasgow: parseInt(e.target.value) || 15 }))}
                placeholder="Ex: 15"
              />
            </div>
          </div>

          {/* Características da Crise */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Características da Crise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">A crise cessou?</label>
                <Select 
                  value={formData.criseStoped.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, criseStoped: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim, a crise cessou</SelectItem>
                    <SelectItem value="false">Não, crise em andamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duração da crise (minutos)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.criseDuration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, criseDuration: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 15"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">É a primeira crise?</label>
                <Select 
                  value={formData.firstCrise.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, firstCrise: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim, primeira crise</SelectItem>
                    <SelectItem value="false">Não, crise recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sinais Clínicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              Sinais Clínicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Presença de febre</label>
                <Select 
                  value={formData.fever.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, fever: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Sem febre</SelectItem>
                    <SelectItem value="true">Com febre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Retorno da consciência</label>
                <Select 
                  value={formData.consciousnessReturn.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, consciousnessReturn: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim, retornou à normalidade</SelectItem>
                    <SelectItem value="false">Não, consciência alterada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Suspeita de infecção</label>
                <Select 
                  value={formData.suspectedInfection.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, suspectedInfection: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Sem suspeita</SelectItem>
                    <SelectItem value="true">Com suspeita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            Avaliar Crise Convulsiva
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                📊 Resultados da Avaliação
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
            {/* Avaliação Geral */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Diagnóstico
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`${getSeverityColor(result.avaliacaoEme.eme)} flex items-center gap-2 px-3 py-2`}>
                  {getSeverityIcon(result.avaliacaoEme.eme)}
                  {result.avaliacaoEme.eme ? 'ESTADO DE MAL EPILÉPTICO' : 'CRISE CONVULSIVA'}
                </Badge>
                <Badge variant="outline" className="px-3 py-2">
                  Duração: {result.tempoCrise} min
                </Badge>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">{result.avaliacaoEme.definicao}</p>
              </div>
            </div>

            {/* Medicações */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Syringe className="h-5 w-5 text-green-600" />
                Medicações Calculadas
              </h3>
              <div className="space-y-3">
                {/* Medicações de Primeira Linha */}
                <h4 className="font-medium text-gray-900">Primeira Linha (Benzodiazepínicos)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border-green-200 bg-green-50">
                    <h5 className="font-medium text-green-900">{result.doses.diazepam.nome}</h5>
                    <p className="text-sm text-green-800 mt-1">{result.doses.diazepam.doseFormulacao}</p>
                    <p className="text-xs text-green-700 mt-1">Velocidade: {result.doses.diazepam.velocidade}</p>
                    {result.doses.diazepam.observacao && (
                      <p className="text-xs text-green-600 mt-1">{result.doses.diazepam.observacao}</p>
                    )}
                  </Card>

                  <Card className="p-4 border-green-200 bg-green-50">
                    <h5 className="font-medium text-green-900">{result.doses.midazolam.nome}</h5>
                    <p className="text-sm text-green-800 mt-1">{result.doses.midazolam.doseFormulacao}</p>
                    <p className="text-xs text-green-700 mt-1">Velocidade: {result.doses.midazolam.velocidade}</p>
                  </Card>
                </div>

                {/* Medicações de Segunda Linha */}
                <h4 className="font-medium text-gray-900 mt-4">Segunda Linha (Anticonvulsivantes)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border-yellow-200 bg-yellow-50">
                    <h5 className="font-medium text-yellow-900">{result.doses.fenobarbital.nome}</h5>
                    <p className="text-sm text-yellow-800 mt-1">{result.doses.fenobarbital.doseFormulacao}</p>
                    <p className="text-xs text-yellow-700 mt-1">Velocidade: {result.doses.fenobarbital.velocidade}</p>
                  </Card>

                  <Card className="p-4 border-yellow-200 bg-yellow-50">
                    <h5 className="font-medium text-yellow-900">{result.doses.fenitoina.nome}</h5>
                    <p className="text-sm text-yellow-800 mt-1">{result.doses.fenitoina.doseFormulacao}</p>
                    <p className="text-xs text-yellow-700 mt-1">Velocidade: {result.doses.fenitoina.velocidade}</p>
                    {result.doses.fenitoina.observacao && (
                      <p className="text-xs text-yellow-600 mt-1">{result.doses.fenitoina.observacao}</p>
                    )}
                  </Card>
                </div>

                {/* Medicação para EME */}
                {result.avaliacaoEme.eme && (
                  <>
                    <h4 className="font-medium text-gray-900 mt-4">Estado de Mal Epiléptico</h4>
                    <Card className="p-4 border-red-200 bg-red-50">
                      <h5 className="font-medium text-red-900">{result.doses.midazolamInfusao.nome}</h5>
                      <p className="text-sm text-red-800 mt-1">{result.doses.midazolamInfusao.doseFormulacao}</p>
                      <p className="text-xs text-red-700 mt-1">Velocidade: {result.doses.midazolamInfusao.velocidade}</p>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Conduta Terapêutica */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Conduta Terapêutica
              </h3>
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recomendação</h4>
                <p className="text-sm text-gray-800 mb-3">{result.conduta.recomendacao}</p>
                
                {result.conduta.esquema && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-900">Esquema terapêutico:</span>
                    {result.conduta.esquema.map((item, index) => (
                      <div key={index} className="text-sm text-gray-700">• {item}</div>
                    ))}
                  </div>
                )}
                
                {result.conduta.observacao && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">{result.conduta.observacao}</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Hospitalização */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Critérios de Hospitalização</h3>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={result.necessidadeHospitalizacao ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {result.necessidadeHospitalizacao ? 'HOSPITALIZAÇÃO INDICADA' : 'AVALIAR NECESSIDADE'}
                </Badge>
              </div>
              
              {result.criteriosHospitalizacao.length > 0 ? (
                <Card className="p-4 border-red-200 bg-red-50">
                  <h4 className="font-medium text-red-900 mb-2">Critérios presentes:</h4>
                  <ul className="space-y-1">
                    {result.criteriosHospitalizacao.map((criterio, index) => (
                      <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {criterio}
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : (
                <Card className="p-4 border-green-200 bg-green-50">
                  <p className="text-sm text-green-800">Nenhum critério de hospitalização identificado.</p>
                </Card>
              )}
            </div>

            {/* Punção Lombar */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Punção Lombar</h3>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={result.avaliacaoPl.indicacao ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                  {result.avaliacaoPl.indicacao ? 'PUNÇÃO LOMBAR INDICADA' : 'PUNÇÃO LOMBAR NÃO INDICADA'}
                </Badge>
              </div>
              
              {result.avaliacaoPl.criterios.length > 0 && (
                <Card className="p-4 border-orange-200 bg-orange-50">
                  <h4 className="font-medium text-orange-900 mb-2">Critérios:</h4>
                  <ul className="space-y-1">
                    {result.avaliacaoPl.criterios.map((criterio, index) => (
                      <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        {criterio}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
