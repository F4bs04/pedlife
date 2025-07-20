import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check, Brain, Eye, MessageSquare, Hand, Stethoscope } from 'lucide-react';
import { tceCalculator } from '../../../utils/calculators/tce';
import type { TCEInput, TCEResult } from '../../../types/protocol-calculators';

export const TCECalculator: React.FC = () => {
  const [formData, setFormData] = useState<TCEInput>({
    ageMonths: 0,
    glasgowEyes: 4,
    glasgowVerbal: 5,
    glasgowMotor: 6,
    // Critérios gerais
    glasgowAltered: false,
    mentalStateChange: false,
    consciousnessLoss: false,
    skullFractureSigns: false,
    // Critérios > 2 anos
    vomiting: false,
    vertigo: false,
    severeTrauma: false,
    occipitalHematoma: false,
    severeHeadache: false,
    // Critérios < 2 anos
    headHematoma: false,
    abnormalBehavior: false,
    // Outros
    persistentVomiting: false
  });

  const [result, setResult] = useState<TCEResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.ageMonths < 0) {
      newErrors.push('Idade deve ser maior ou igual a zero');
    }

    if (formData.glasgowEyes < 1 || formData.glasgowEyes > 4) {
      newErrors.push('Abertura dos olhos deve estar entre 1 e 4');
    }

    if (formData.glasgowVerbal < 1 || formData.glasgowVerbal > 5) {
      newErrors.push('Resposta verbal deve estar entre 1 e 5');
    }

    if (formData.glasgowMotor < 1 || formData.glasgowMotor > 6) {
      newErrors.push('Resposta motora deve estar entre 1 e 6');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const calculationResult = tceCalculator.calcular(formData);
      setResult(calculationResult);
      setErrors([]);
    } catch (error) {
      setErrors(['Erro no cálculo. Verifique os dados informados.']);
    }
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `
CALCULADORA DE TRAUMA CRANIOENCEFÁLICO (TCE)
==========================================
Idade: ${Math.floor(result.idadeMeses / 12)} anos e ${result.idadeMeses % 12} meses
Faixa etária: ${result.menor2Anos ? 'Menor que 2 anos' : 'Maior ou igual a 2 anos'}

ESCALA DE GLASGOW:
Score Total: ${result.glasgow.scoreTotal}
Score Normal para idade: ${result.glasgow.scoreNormal}
Avaliação: ${result.glasgow.avaliacao}
Gravidade: ${result.glasgow.gravidade}

RECOMENDAÇÃO DE TC:
${result.recomendacaoTC}

CRITÉRIOS DE INTERNAÇÃO:
${result.criteriosInternacao ? 'INTERNAÇÃO INDICADA' : 'AVALIAR NECESSIDADE'}
${result.motivosInternacao.map(motivo => `• ${motivo}`).join('\n')}

RECOMENDAÇÕES:
${result.recomendacoes.map(rec => `• ${rec}`).join('\n')}

${result.orientacoesAlta.length > 0 ? `
ORIENTAÇÕES DE ALTA:
${result.orientacoesAlta.map(orient => `• ${orient}`).join('\n')}
` : ''}
    `;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const getSeverityColor = (gravidade: string) => {
    switch (gravidade) {
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

  const getSeverityIcon = (gravidade: string) => {
    switch (gravidade) {
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

  const glasgowCriteria = tceCalculator.getGlasgowCriteria(formData.ageMonths);
  const criteriosTC = tceCalculator.getCriteriosTC(formData.ageMonths < 24);
  const menor2Anos = formData.ageMonths < 24;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Calculadora de Trauma Cranioencefálico (TCE)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados do Paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Idade (meses)</label>
              <Input
                type="number"
                min="0"
                value={formData.ageMonths || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ageMonths: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 36 (3 anos)"
              />
              <p className="text-xs text-gray-500">
                {formData.ageMonths > 0 && (
                  `${Math.floor(formData.ageMonths / 12)} anos e ${formData.ageMonths % 12} meses`
                )}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Faixa Etária</label>
              <div className="p-3 bg-gray-50 rounded border">
                <Badge variant={menor2Anos ? "secondary" : "default"}>
                  {menor2Anos ? "< 2 anos" : "≥ 2 anos"}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">
                  {menor2Anos ? "Critérios específicos para menores de 2 anos" : "Critérios para maiores de 2 anos"}
                </p>
              </div>
            </div>
          </div>

          {/* Escala de Glasgow */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              Escala de Glasgow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Abertura dos Olhos */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Abertura dos Olhos
                </label>
                <Select 
                  value={formData.glasgowEyes.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, glasgowEyes: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {glasgowCriteria.aberturaOlhos.map((item) => (
                      <SelectItem key={item.escore} value={item.escore.toString()}>
                        {item.escore} - {item.criterio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resposta Verbal */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Resposta Verbal
                </label>
                <Select 
                  value={formData.glasgowVerbal.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, glasgowVerbal: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {glasgowCriteria.respostaVerbal.map((item) => (
                      <SelectItem key={item.escore} value={item.escore.toString()}>
                        {item.escore} - {item.criterio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resposta Motora */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Hand className="h-4 w-4" />
                  Resposta Motora
                </label>
                <Select 
                  value={formData.glasgowMotor.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, glasgowMotor: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {glasgowCriteria.respostaMotora.map((item) => (
                      <SelectItem key={item.escore} value={item.escore.toString()}>
                        {item.escore} - {item.criterio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Score Total */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {formData.glasgowEyes + formData.glasgowVerbal + formData.glasgowMotor}
                </div>
                <div className="text-sm text-blue-600">Score Total de Glasgow</div>
              </div>
            </div>
          </div>

          {/* Critérios Gerais para TC */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Critérios Gerais para TC</h3>
            <div className="space-y-3">
              {criteriosTC.criteriosGerais.map((criterio, index) => {
                const criterioKey = [
                  'glasgowAltered',
                  'mentalStateChange', 
                  'consciousnessLoss',
                  'skullFractureSigns'
                ][index] as keyof TCEInput;

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={criterioKey}
                      checked={formData[criterioKey] as boolean}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        [criterioKey]: e.target.checked 
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={criterioKey} className="text-sm text-gray-700">
                      {criterio}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critérios Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Critérios Adicionais {menor2Anos ? "(< 2 anos)" : "(≥ 2 anos)"}
            </h3>
            <div className="space-y-3">
              {criteriosTC.criteriosAdicionais.map((criterio, index) => {
                let criterioKey: keyof TCEInput;
                
                if (menor2Anos) {
                  criterioKey = ['headHematoma', 'severeTrauma', 'abnormalBehavior'][index] as keyof TCEInput;
                } else {
                  criterioKey = ['vomiting', 'vertigo', 'severeTrauma', 'occipitalHematoma', 'severeHeadache'][index] as keyof TCEInput;
                }

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={criterioKey}
                      checked={formData[criterioKey] as boolean}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        [criterioKey]: e.target.checked 
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={criterioKey} className="text-sm text-gray-700">
                      {criterio}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critérios Adicionais */}
          {formData.vomiting && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Características dos Vômitos</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="persistentVomiting"
                  checked={formData.persistentVomiting}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    persistentVomiting: e.target.checked 
                  }))}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="persistentVomiting" className="text-sm text-gray-700">
                  Vômitos persistentes
                </label>
              </div>
            </div>
          )}

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
            Avaliar Trauma Cranioencefálico
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
            {/* Resultado da Escala de Glasgow */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Escala de Glasgow
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{result.glasgow.scoreTotal}</div>
                    <div className="text-sm text-gray-600">Score Total</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Normal para idade: {result.glasgow.scoreNormal}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center">
                    <Badge className={`${getSeverityColor(result.glasgow.gravidade)} flex items-center gap-2 justify-center`}>
                      {getSeverityIcon(result.glasgow.gravidade)}
                      {result.glasgow.gravidade}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-2">Gravidade do TCE</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Avaliação: {result.glasgow.avaliacao}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recomendação de TC */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recomendação de Tomografia</h3>
              <Card className={`p-4 ${
                result.recomendacaoTC.includes('recomendada') ? 'border-red-200 bg-red-50' :
                result.recomendacaoTC.includes('Observação') ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    result.recomendacaoTC.includes('recomendada') ? 'text-red-800' :
                    result.recomendacaoTC.includes('Observação') ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    {result.recomendacaoTC}
                  </div>
                </div>
              </Card>
            </div>

            {/* Critérios de Internação */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Critérios de Internação</h3>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={result.criteriosInternacao ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {result.criteriosInternacao ? 'INTERNAÇÃO INDICADA' : 'AVALIAR NECESSIDADE'}
                </Badge>
              </div>
              
              {result.motivosInternacao.length > 0 ? (
                <Card className="p-4 border-red-200 bg-red-50">
                  <h4 className="font-medium text-red-900 mb-2">Motivos para internação:</h4>
                  <ul className="space-y-1">
                    {result.motivosInternacao.map((motivo, index) => (
                      <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {motivo}
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : (
                <Card className="p-4 border-green-200 bg-green-50">
                  <p className="text-sm text-green-800">Nenhum critério de internação obrigatória identificado.</p>
                </Card>
              )}
            </div>

            {/* Recomendações */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recomendações Médicas</h3>
              <Card className="p-4">
                <ul className="space-y-2">
                  {result.recomendacoes.map((recomendacao, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {recomendacao}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Orientações de Alta */}
            {result.orientacoesAlta.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Orientações de Alta</h3>
                <Card className="p-4 border-blue-200 bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-2">Orientações para pais/responsáveis:</h4>
                  <ul className="space-y-2">
                    {result.orientacoesAlta.map((orientacao, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {orientacao}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
