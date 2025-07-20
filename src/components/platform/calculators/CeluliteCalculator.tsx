import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check, Activity, Thermometer, Stethoscope, Heart } from 'lucide-react';
import { celuliteCalculator } from '../../../utils/calculators/celulite';
import type { CeluliteInput, CeluliteResult } from '../../../types/protocol-calculators';

export const CeluliteCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CeluliteInput>({
    peso: 0,
    idadeMeses: 0,
    temperatura: 36.5,
    sintomas: [],
    fatoresGravidade: [],
    areaEspecial: false,
    extensaoImportante: false,
    linfangite: false,
    alergiaToxico: false
  });

  const [result, setResult] = useState<CeluliteResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.peso <= 0) {
      newErrors.push('Peso deve ser maior que zero');
    }

    if (formData.idadeMeses < 0) {
      newErrors.push('Idade deve ser maior ou igual a zero');
    }

    if (formData.temperatura < 35 || formData.temperatura > 42) {
      newErrors.push('Temperatura deve estar entre 35°C e 42°C');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const calculationResult = celuliteCalculator.calcular(formData);
      setResult(calculationResult);
      setErrors([]);
    } catch (error) {
      setErrors(['Erro no cálculo. Verifique os dados informados.']);
    }
  };

  const handleSintomaChange = (sintoma: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sintomas: checked 
        ? [...prev.sintomas, sintoma]
        : prev.sintomas.filter(s => s !== sintoma)
    }));
  };

  const handleFatorGravidadeChange = (fator: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      fatoresGravidade: checked 
        ? [...prev.fatoresGravidade, fator]
        : prev.fatoresGravidade.filter(f => f !== fator)
    }));
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `
CALCULADORA DE CELULITE
=======================
Peso: ${formData.peso} kg
Idade: ${Math.floor(formData.idadeMeses / 12)} anos e ${formData.idadeMeses % 12} meses
Temperatura: ${formData.temperatura}°C

AVALIAÇÃO DE GRAVIDADE:
Score de Gravidade: ${result.gravidadeScore}
Necessita Internação: ${result.necessitaInternacao ? 'SIM' : 'NÃO'}

FATORES DE GRAVIDADE:
${result.fatoresGravidadeSelecionados.map(fator => `• ${fator}`).join('\n')}

SINTOMAS PRESENTES:
${result.sintomasSelecionados.map(sintoma => `• ${sintoma}`).join('\n')}

TRATAMENTO RECOMENDADO:
${result.tratamentoRecomendado.map(trat => 
  `• ${trat.medicamento}: ${trat.dosePorKg} (${trat.frequencia})
    Dose calculada: ${trat.doseDiaria.toFixed(1)} mg/dia`
).join('\n')}

${result.motivosInternacao.length > 0 ? `
MOTIVOS PARA INTERNAÇÃO:
${result.motivosInternacao.map(motivo => `• ${motivo}`).join('\n')}
` : ''}

RECOMENDAÇÕES GERAIS:
${result.recomendacoesGerais.map(rec => `• ${rec}`).join('\n')}

MEDIDAS DE SUPORTE:
${result.medidasSuporte.map(medida => `• ${medida}`).join('\n')}
    `;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const getSeverityColor = (necessitaInternacao: boolean) => {
    return necessitaInternacao 
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getSeverityIcon = (necessitaInternacao: boolean) => {
    return necessitaInternacao 
      ? <AlertCircle className="h-4 w-4" />
      : <CheckCircle className="h-4 w-4" />;
  };

  const sintomasDisponiveis = celuliteCalculator.getSintomas();
  const fatoresGravidadeDisponiveis = celuliteCalculator.getFatoresGravidade();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-orange-600" />
            Calculadora de Celulite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados do Paciente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso (kg)</label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.peso || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                placeholder="Ex: 15.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Idade (meses)</label>
              <Input
                type="number"
                min="0"
                value={formData.idadeMeses || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, idadeMeses: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 36 (3 anos)"
              />
              <p className="text-xs text-gray-500">
                {formData.idadeMeses > 0 && (
                  `${Math.floor(formData.idadeMeses / 12)} anos e ${formData.idadeMeses % 12} meses`
                )}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperatura (°C)
              </label>
              <Input
                type="number"
                min="35"
                max="42"
                step="0.1"
                value={formData.temperatura || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, temperatura: parseFloat(e.target.value) || 36.5 }))}
                placeholder="Ex: 38.5"
              />
            </div>
          </div>

          {/* Sintomas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Sintomas Presentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sintomasDisponiveis.map((sintoma, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`sintoma-${index}`}
                    checked={formData.sintomas.includes(sintoma)}
                    onChange={(e) => handleSintomaChange(sintoma, e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor={`sintoma-${index}`} className="text-sm text-gray-700">
                    {sintoma}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Fatores de Gravidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Fatores de Gravidade
            </h3>
            <div className="space-y-3">
              {fatoresGravidadeDisponiveis.map((fator, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`fator-${index}`}
                    checked={formData.fatoresGravidade.includes(fator)}
                    onChange={(e) => handleFatorGravidadeChange(fator, e.target.checked)}
                    className="h-4 w-4 text-red-600 rounded"
                  />
                  <label htmlFor={`fator-${index}`} className="text-sm text-gray-700">
                    {fator}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Características Específicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Características Específicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="areaEspecial"
                    checked={formData.areaEspecial}
                    onChange={(e) => setFormData(prev => ({ ...prev, areaEspecial: e.target.checked }))}
                    className="h-4 w-4 text-orange-600 rounded"
                  />
                  <label htmlFor="areaEspecial" className="text-sm text-gray-700">
                    Área especial (face, pescoço, área genital, mãos, pés)
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="extensaoImportante"
                    checked={formData.extensaoImportante}
                    onChange={(e) => setFormData(prev => ({ ...prev, extensaoImportante: e.target.checked }))}
                    className="h-4 w-4 text-orange-600 rounded"
                  />
                  <label htmlFor="extensaoImportante" className="text-sm text-gray-700">
                    Extensão importante da lesão
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="linfangite"
                    checked={formData.linfangite}
                    onChange={(e) => setFormData(prev => ({ ...prev, linfangite: e.target.checked }))}
                    className="h-4 w-4 text-orange-600 rounded"
                  />
                  <label htmlFor="linfangite" className="text-sm text-gray-700">
                    Presença de linfangite
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="alergiaToxico"
                    checked={formData.alergiaToxico}
                    onChange={(e) => setFormData(prev => ({ ...prev, alergiaToxico: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="alergiaToxico" className="text-sm text-gray-700">
                    Alergia a penicilinas/cefalosporinas
                  </label>
                </div>
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
            Avaliar Celulite e Recomendar Tratamento
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
            {/* Avaliação de Gravidade */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Avaliação de Gravidade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{result.gravidadeScore}</div>
                    <div className="text-sm text-gray-600">Score de Gravidade</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center">
                    <Badge className={`${getSeverityColor(result.necessitaInternacao)} flex items-center gap-2 justify-center`}>
                      {getSeverityIcon(result.necessitaInternacao)}
                      {result.necessitaInternacao ? 'INTERNAÇÃO INDICADA' : 'TRATAMENTO AMBULATORIAL'}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-2">Recomendação</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Fatores de Gravidade Identificados */}
            {result.fatoresGravidadeSelecionados.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Fatores de Gravidade Identificados</h3>
                <Card className="p-4 border-orange-200 bg-orange-50">
                  <div className="flex flex-wrap gap-2">
                    {result.fatoresGravidadeSelecionados.map((fator, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {fator}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Motivos de Internação */}
            {result.motivosInternacao.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Motivos para Internação</h3>
                <Card className="p-4 border-red-200 bg-red-50">
                  <ul className="space-y-2">
                    {result.motivosInternacao.map((motivo, index) => (
                      <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {motivo}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {/* Tratamento Recomendado */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Tratamento Recomendado</h3>
              <div className="space-y-3">
                {result.tratamentoRecomendado.map((tratamento, index) => (
                  <Card key={index} className="p-4 border-blue-200 bg-blue-50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-blue-900">{tratamento.medicamento}</h4>
                        <Badge variant="outline" className={tratamento.tipo === 'hospitalar' ? 'border-red-300' : 'border-green-300'}>
                          {tratamento.tipo === 'hospitalar' ? 'Hospitalar' : 'Ambulatorial'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Dosagem:</span> {tratamento.dosePorKg}
                        </div>
                        <div>
                          <span className="font-medium">Frequência:</span> {tratamento.frequencia}
                        </div>
                        <div>
                          <span className="font-medium">Dose calculada:</span> {tratamento.doseDiaria.toFixed(1)} mg/dia
                        </div>
                        {tratamento.escolha && (
                          <div>
                            <span className="font-medium">Indicação:</span> {tratamento.escolha}
                          </div>
                        )}
                      </div>
                      {tratamento.observacao && (
                        <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                          <strong>Observação:</strong> {tratamento.observacao}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recomendações Gerais */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recomendações Gerais</h3>
              <Card className="p-4">
                <ul className="space-y-2">
                  {result.recomendacoesGerais.map((recomendacao, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {recomendacao}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Medidas de Suporte */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Medidas de Suporte</h3>
              <Card className="p-4 border-green-200 bg-green-50">
                <ul className="space-y-2">
                  {result.medidasSuporte.map((medida, index) => (
                    <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      {medida}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
