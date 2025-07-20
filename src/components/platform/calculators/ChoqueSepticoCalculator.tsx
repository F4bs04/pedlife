import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check, Activity, Heart, Zap, Syringe, Thermometer } from 'lucide-react';
import { choqueSepticoCalculator } from '../../../utils/calculators/choque-septico';
import type { ChoqueSepticoInput, ChoqueSepticoResult } from '../../../types/protocol-calculators';

export const ChoqueSepticoCalculator: React.FC = () => {
  const [formData, setFormData] = useState<ChoqueSepticoInput>({
    weight: 0,
    ageYears: 0,
    ageMonths: 0,
    temperature: 37.0,
    vitalSigns: {
      fc: 0,
      fr: 0,
      pas: 0,
      perfusao: "normal",
      consciencia: "normal"
    },
    context: "comunidade",
    shockType: "quente"
  });

  const [result, setResult] = useState<ChoqueSepticoResult | null>(null);
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

    if (formData.vitalSigns.fc <= 0) {
      newErrors.push('Frequência cardíaca deve ser informada');
    }

    if (formData.vitalSigns.fr <= 0) {
      newErrors.push('Frequência respiratória deve ser informada');
    }

    if (formData.vitalSigns.pas <= 0) {
      newErrors.push('Pressão arterial sistólica deve ser informada');
    }

    if (formData.temperature < 35 || formData.temperature > 42) {
      newErrors.push('Temperatura deve estar entre 35°C e 42°C');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const calculationResult = choqueSepticoCalculator.calcular(formData);
      setResult(calculationResult);
      setErrors([]);
    } catch (error) {
      setErrors(['Erro no cálculo. Verifique os dados informados.']);
    }
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `
CALCULADORA DE CHOQUE SÉPTICO
============================
Peso: ${formData.weight} kg
Idade: ${formData.ageYears} anos e ${formData.ageMonths} meses
Temperatura: ${formData.temperature}°C

SINAIS VITAIS:
- FC: ${formData.vitalSigns.fc} bpm (${result.avaliacaoVital.fc.status})
- FR: ${formData.vitalSigns.fr} irpm (${result.avaliacaoVital.fr.status})  
- PAS: ${formData.vitalSigns.pas} mmHg (${result.avaliacaoVital.pas.status})
- Perfusão: ${formData.vitalSigns.perfusao}
- Consciência: ${formData.vitalSigns.consciencia}

AVALIAÇÃO:
Fase do choque: ${result.avaliacaoVital.faseChoque}
Gravidade: ${result.gravidade}
Sinais de choque: ${result.avaliacaoVital.sinaisChoque.join(', ') || 'Nenhum'}

EXPANSÃO VOLÊMICA:
- Volume por expansão: ${result.expansaoVolumica.volumeUnitario} ml
- Volume total (3 expansões): ${result.expansaoVolumica.volumeTotal} ml

RECOMENDAÇÕES:
${result.recomendacoes.map(rec => 
  `${rec.categoria}:\n${rec.items.map(item => `• ${item}`).join('\n')}`
).join('\n\n')}

CAUSAS REVERSÍVEIS (5Hs e 5Ts):
${result.causasReversiveis.map(causa => `• ${causa.nome}`).join('\n')}
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
      case 'Leve':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Grave':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Leve':
        return <CheckCircle className="h-4 w-4" />;
      case 'Moderado':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Grave':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getVitalSignColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'text-green-600';
      case 'Taquicardia':
      case 'Taquipneia':
      case 'Hipotensão':
        return 'text-red-600';
      case 'Bradicardia':
      case 'Bradipneia':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚨 Calculadora de Choque Séptico
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
              <label className="text-sm font-medium">Temperatura (°C)</label>
              <Input
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={formData.temperature || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 37 }))}
                placeholder="Ex: 39.5"
              />
            </div>
          </div>

          {/* Sinais Vitais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Sinais Vitais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequência Cardíaca (bpm)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.vitalSigns.fc || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vitalSigns: { ...prev.vitalSigns, fc: parseInt(e.target.value) || 0 }
                  }))}
                  placeholder="Ex: 130"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Frequência Respiratória (irpm)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.vitalSigns.fr || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vitalSigns: { ...prev.vitalSigns, fr: parseInt(e.target.value) || 0 }
                  }))}
                  placeholder="Ex: 30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">PAS (mmHg)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.vitalSigns.pas || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vitalSigns: { ...prev.vitalSigns, pas: parseInt(e.target.value) || 0 }
                  }))}
                  placeholder="Ex: 85"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Perfusão Capilar</label>
                <Select 
                  value={formData.vitalSigns.perfusao} 
                  onValueChange={(value: "normal" | "aumentado") => 
                    setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, perfusao: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a perfusão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (&lt; 2s)</SelectItem>
                    <SelectItem value="aumentado">Aumentado (&gt; 2s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nível de Consciência</label>
                <Select 
                  value={formData.vitalSigns.consciencia} 
                  onValueChange={(value: "normal" | "alterado") => 
                    setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, consciencia: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal/Alerta</SelectItem>
                    <SelectItem value="alterado">Alterado/Sonolento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contexto Clínico */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contexto Clínico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contexto de Aquisição</label>
                <Select 
                  value={formData.context} 
                  onValueChange={(value: typeof formData.context) => 
                    setFormData(prev => ({ ...prev, context: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o contexto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comunidade">Adquirido na comunidade</SelectItem>
                    <SelectItem value="hospitalar">Hospitalar/Multirresistente</SelectItem>
                    <SelectItem value="cateter">Associado a cateter</SelectItem>
                    <SelectItem value="neutropenia">Neutropenia febril</SelectItem>
                    <SelectItem value="abdominal">Foco abdominal</SelectItem>
                    <SelectItem value="neonatal">Neonatal (&lt; 28 dias)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Choque</label>
                <Select 
                  value={formData.shockType} 
                  onValueChange={(value: "quente" | "frio") => 
                    setFormData(prev => ({ ...prev, shockType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quente">Choque Quente (Vasodilatado)</SelectItem>
                    <SelectItem value="frio">Choque Frio (Cardiogênico)</SelectItem>
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
            Avaliar Choque Séptico
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
            {/* Avaliação dos Sinais Vitais */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Avaliação dos Sinais Vitais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getVitalSignColor(result.avaliacaoVital.fc.status)}`}>
                      {result.avaliacaoVital.fc.value} bpm
                    </div>
                    <div className="text-sm text-gray-600">Frequência Cardíaca</div>
                    <Badge className={`mt-1 ${getVitalSignColor(result.avaliacaoVital.fc.status)} bg-transparent border`}>
                      {result.avaliacaoVital.fc.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      Normal: {result.avaliacaoVital.fc.normalMin}-{result.avaliacaoVital.fc.normalMax} bpm
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getVitalSignColor(result.avaliacaoVital.fr.status)}`}>
                      {result.avaliacaoVital.fr.value} irpm
                    </div>
                    <div className="text-sm text-gray-600">Frequência Respiratória</div>
                    <Badge className={`mt-1 ${getVitalSignColor(result.avaliacaoVital.fr.status)} bg-transparent border`}>
                      {result.avaliacaoVital.fr.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      Normal: {result.avaliacaoVital.fr.normalMin}-{result.avaliacaoVital.fr.normalMax} irpm
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getVitalSignColor(result.avaliacaoVital.pas.status)}`}>
                      {result.avaliacaoVital.pas.value} mmHg
                    </div>
                    <div className="text-sm text-gray-600">PAS</div>
                    <Badge className={`mt-1 ${getVitalSignColor(result.avaliacaoVital.pas.status)} bg-transparent border`}>
                      {result.avaliacaoVital.pas.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      Mínima: {result.avaliacaoVital.pas.normalMin} mmHg
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Classificação de Gravidade */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Diagnóstico</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`${getSeverityColor(result.gravidade)} flex items-center gap-2 px-3 py-2`}>
                  {getSeverityIcon(result.gravidade)}
                  {result.gravidade}
                </Badge>
                <Badge variant="outline" className="px-3 py-2">
                  Fase: {result.avaliacaoVital.faseChoque}
                </Badge>
              </div>
              
              {result.avaliacaoVital.sinaisChoque.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Sinais de Choque Detectados:</h4>
                  <ul className="space-y-1">
                    {result.avaliacaoVital.sinaisChoque.map((sinal, index) => (
                      <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {sinal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Expansão Volêmica */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                Expansão Volêmica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.expansaoVolumica.volumeUnitario} ml</div>
                    <div className="text-sm text-gray-600">Volume por Expansão</div>
                    <div className="text-xs text-gray-500">SF 0,9% em bolus</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{result.expansaoVolumica.volumeTotal} ml</div>
                    <div className="text-sm text-gray-600">Volume Total</div>
                    <div className="text-xs text-gray-500">3 expansões máximas</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Drogas Vasoativas */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Syringe className="h-5 w-5 text-purple-600" />
                Drogas Vasoativas
              </h3>
              <div className="space-y-3">
                {result.drogasVasoativas
                  .sort((a, b) => (a.prioridade === 'alta' ? -1 : 1))
                  .map((droga, index) => (
                  <Card key={index} className={`p-4 ${droga.prioridade === 'alta' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{droga.nome}</h4>
                          <Badge variant={droga.prioridade === 'alta' ? 'default' : 'secondary'}>
                            {droga.prioridade === 'alta' ? 'Prioridade Alta' : 'Segunda Linha'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{droga.efeito}</p>
                        <p className="text-xs text-gray-500 mt-1">{droga.indicacao}</p>
                        
                        <div className="mt-2 space-y-1">
                          <div className="text-xs">
                            <span className="font-medium">Dose inicial:</span> {droga.doseInicial}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Dose máxima:</span> {droga.doseMax}
                          </div>
                          {droga.preparacao && (
                            <div className="text-xs">
                              <span className="font-medium">Preparação:</span> {droga.preparacao}
                            </div>
                          )}
                          {droga.doseInicialMl && (
                            <div className="text-xs">
                              <span className="font-medium">Início:</span> {droga.doseInicialMl}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Antibioticoterapia */}
            {result.antibioticos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Antibioticoterapia Empírica
                </h3>
                <div className="space-y-3">
                  {result.antibioticos.map((antibiotico, index) => (
                    <Card key={index} className="p-4 border-orange-200 bg-orange-50">
                      <h4 className="font-medium text-orange-900 mb-2">{antibiotico.situacao}</h4>
                      <p className="text-sm text-orange-800 mb-2">
                        <span className="font-medium">Esquema:</span> {antibiotico.esquema}
                      </p>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-orange-900">Doses:</span>
                        {antibiotico.doses.map((dose, doseIndex) => (
                          <div key={doseIndex} className="text-xs text-orange-800">• {dose}</div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Causas Reversíveis */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Causas Reversíveis (5Hs e 5Ts)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">5 Hs</h4>
                  <ul className="space-y-1">
                    {result.causasReversiveis
                      .filter(causa => causa.tipo === 'H')
                      .map((causa, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {causa.nome}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">5 Ts</h4>
                  <ul className="space-y-1">
                    {result.causasReversiveis
                      .filter(causa => causa.tipo === 'T')
                      .map((causa, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {causa.nome}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            {/* Recomendações */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Plano de Tratamento</h3>
              <div className="space-y-4">
                {result.recomendacoes.map((recomendacao, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{recomendacao.categoria}</h4>
                    <ul className="space-y-1">
                      {recomendacao.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
