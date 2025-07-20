import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check } from 'lucide-react';
import { desidratacaoCalculator } from '../../../utils/calculators/desidratacao';
import type { DesidratacaoInput, DesidratacaoResult } from '../../../types/protocol-calculators';

export const DesidratacaoCalculator: React.FC = () => {
  const [formData, setFormData] = useState<DesidratacaoInput>({
    pesoKg: 0,
    idadeMeses: 0,
    diarreia: false,
    caracteristicas: {
      // Estado de consciência
      alerta: false,
      irritado: false,
      letargico: false,
      
      // Olhos
      olhosNormais: false,
      olhosFundos: false,
      olhosMuitoFundos: false,
      
      // Mucosas
      mucosasUmidas: false,
      mucosasSecas: false,
      mucosasMuitoSecas: false,
      
      // Turgor
      turgorNormal: false,
      turgorDiminuido: false,
      turgorMuitoDiminuido: false,
      
      // Lágrimas
      lagrimasPresentes: false,
      lagrimasAusentes: false,
      
      // Respiração
      respiracaoNormal: false,
      respiracaoRapida: false,
      respiracaoAcidotica: false,
      
      // Pulso
      pulsoNormal: false,
      pulsoRapido: false,
      pulsoFinoAusente: false,
      
      // Extremidades
      extremidadesNormais: false,
      extremidadesFrias: false,
      extremidadesCianoticas: false,
      
      // Pressão arterial
      paNormal: false,
      paNormalBaixa: false,
      paIndetectavel: false,
      
      // Diurese
      diureseNormal: false,
      diureseNormalBaixa: false,
      diureseOliguriaAnuria: false,
    }
  });

  const [result, setResult] = useState<DesidratacaoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.pesoKg <= 0) {
      newErrors.push('Peso deve ser maior que zero');
    }

    if (formData.idadeMeses < 0) {
      newErrors.push('Idade deve ser maior ou igual a zero');
    }

    // Verificar se pelo menos um sinal clínico foi selecionado
    const hasAnySign = Object.values(formData.caracteristicas).some(value => value);
    if (!hasAnySign) {
      newErrors.push('Selecione pelo menos um sinal clínico');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const calculationResult = desidratacaoCalculator.calcular(formData);
      setResult(calculationResult);
      setErrors([]);
    } catch (error) {
      setErrors(['Erro no cálculo. Verifique os dados informados.']);
    }
  };

  const handleCheckboxChange = (category: keyof DesidratacaoInput['caracteristicas'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: {
        ...prev.caracteristicas,
        [category]: checked
      }
    }));
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `
AVALIAÇÃO DE DESIDRATAÇÃO
========================
Peso: ${result.pesoKg} kg
Idade: ${result.idadeMeses} meses
Diarreia: ${result.diarreia ? 'Sim' : 'Não'}

RESULTADO:
${result.nomeGrau}
Perda de peso estimada: ${result.percentualDesidratacao}

PLANO RECOMENDADO:
${result.nomePlano}

VOLUMES CALCULADOS:
- Volume de soro: ${result.volumeSoro} ml
- Déficit estimado: ${result.deficitEstimado} ml
- Manutenção hídrica: ${result.manutencaoHidricaDiaria} ml/dia

RECOMENDAÇÕES:
${result.recomendacoes.map(rec => `• ${rec}`).join('\n')}

${result.ausenciaDiurese ? `
PROTOCOLO PARA AUSÊNCIA DE DIURESE:
${result.protocoloDiurese.map(p => `• ${p}`).join('\n')}
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

  const getSeverityColor = (grau: string) => {
    switch (grau) {
      case 'grau_i':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'grau_ii':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'grau_iii':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (grau: string) => {
    switch (grau) {
      case 'grau_i':
        return <CheckCircle className="h-4 w-4" />;
      case 'grau_ii':
        return <AlertTriangle className="h-4 w-4" />;
      case 'grau_iii':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Organizar os sinais clínicos em grupos
  const clinicalSignGroups = [
    {
      title: "Estado de Consciência",
      signs: [
        { key: 'alerta', label: 'Alerta' },
        { key: 'irritado', label: 'Inquieto/Irritado' },
        { key: 'letargico', label: 'Letárgico/Inconsciência' }
      ]
    },
    {
      title: "Olhos",
      signs: [
        { key: 'olhosNormais', label: 'Olhos normais' },
        { key: 'olhosFundos', label: 'Olhos fundos' },
        { key: 'olhosMuitoFundos', label: 'Olhos muito fundos' }
      ]
    },
    {
      title: "Mucosas",
      signs: [
        { key: 'mucosasUmidas', label: 'Mucosas úmidas' },
        { key: 'mucosasSecas', label: 'Mucosas secas' },
        { key: 'mucosasMuitoSecas', label: 'Mucosas muito secas' }
      ]
    },
    {
      title: "Turgor de Pele",
      signs: [
        { key: 'turgorNormal', label: 'Turgor normal' },
        { key: 'turgorDiminuido', label: 'Turgor diminuído' },
        { key: 'turgorMuitoDiminuido', label: 'Turgor muito diminuído' }
      ]
    },
    {
      title: "Lágrimas",
      signs: [
        { key: 'lagrimasPresentes', label: 'Lágrimas presentes' },
        { key: 'lagrimasAusentes', label: 'Lágrimas ausentes' }
      ]
    },
    {
      title: "Respiração",
      signs: [
        { key: 'respiracaoNormal', label: 'Respiração normal' },
        { key: 'respiracaoRapida', label: 'Respiração rápida' },
        { key: 'respiracaoAcidotica', label: 'Respiração acidótica' }
      ]
    },
    {
      title: "Pulso",
      signs: [
        { key: 'pulsoNormal', label: 'Pulso normal' },
        { key: 'pulsoRapido', label: 'Pulso rápido, fraco' },
        { key: 'pulsoFinoAusente', label: 'Pulso fino/ausente' }
      ]
    },
    {
      title: "Extremidades",
      signs: [
        { key: 'extremidadesNormais', label: 'Extremidades normais' },
        { key: 'extremidadesFrias', label: 'Extremidades frias' },
        { key: 'extremidadesCianoticas', label: 'Extremidades cianóticas' }
      ]
    },
    {
      title: "Pressão Arterial",
      signs: [
        { key: 'paNormal', label: 'PA normal' },
        { key: 'paNormalBaixa', label: 'PA normal/baixa' },
        { key: 'paIndetectavel', label: 'PA indetectável' }
      ]
    },
    {
      title: "Diurese",
      signs: [
        { key: 'diureseNormal', label: 'Diurese normal' },
        { key: 'diureseNormalBaixa', label: 'Diurese normal/baixa' },
        { key: 'diureseOliguriaAnuria', label: 'Oligúria/Anúria' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💧 Calculadora de Desidratação
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
                value={formData.pesoKg || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pesoKg: parseFloat(e.target.value) || 0 }))}
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
                placeholder="Ex: 24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Presença de Diarreia</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="diarreia"
                  checked={formData.diarreia}
                  onChange={(e) => setFormData(prev => ({ ...prev, diarreia: e.target.checked }))}
                  className="rounded border border-gray-300"
                />
                <label htmlFor="diarreia" className="text-sm">Sim</label>
              </div>
            </div>
          </div>

          {/* Sinais Clínicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sinais Clínicos de Desidratação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clinicalSignGroups.map((group) => (
                <Card key={group.title} className="p-4">
                  <h4 className="font-medium mb-3">{group.title}</h4>
                  <div className="space-y-2">
                    {group.signs.map((sign) => (
                      <div key={sign.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={sign.key}
                          checked={formData.caracteristicas[sign.key as keyof typeof formData.caracteristicas]}
                          onChange={(e) => handleCheckboxChange(sign.key as keyof typeof formData.caracteristicas, e.target.checked)}
                          className="rounded border border-gray-300"
                        />
                        <label htmlFor={sign.key} className="text-sm">{sign.label}</label>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
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
            Calcular Grau de Desidratação
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
            {/* Grau de Desidratação */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Diagnóstico</h3>
              <div className="flex items-center gap-3">
                <Badge className={`${getSeverityColor(result.grauDesidratacao)} flex items-center gap-2 px-3 py-2`}>
                  {getSeverityIcon(result.grauDesidratacao)}
                  {result.nomeGrau}
                </Badge>
                <span className="text-sm text-gray-600">
                  Perda de peso estimada: {result.percentualDesidratacao}
                </span>
              </div>
            </div>

            {/* Plano de Hidratação */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Plano de Hidratação</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">{result.nomePlano}</h4>
                <ul className="space-y-1">
                  {result.instrucoesPlano.map((instrucao, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {instrucao}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Volumes Calculados */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Volumes Calculados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.volumeSoro} ml</div>
                    <div className="text-sm text-gray-600">Volume de Soro</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{result.deficitEstimado} ml</div>
                    <div className="text-sm text-gray-600">Déficit Estimado</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{result.manutencaoHidricaDiaria} ml</div>
                    <div className="text-sm text-gray-600">Manutenção/dia</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recomendações */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recomendações Específicas</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-1">
                  {result.recomendacoes.map((recomendacao, index) => (
                    <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      {recomendacao}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Protocolo para Ausência de Diurese */}
            {result.ausenciaDiurese && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600">⚠️ Protocolo para Ausência de Diurese</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="space-y-1">
                    {result.protocoloDiurese.map((protocolo, index) => (
                      <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {protocolo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Critérios do Grau */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Critérios Diagnósticos</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="space-y-1">
                  {result.criterios.map((criterio, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      {criterio}
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
