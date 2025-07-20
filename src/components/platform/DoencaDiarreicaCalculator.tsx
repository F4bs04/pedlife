import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Droplets, Info, Users } from 'lucide-react';
import { doencaDiarreicaCalculator } from '@/utils/calculators/doenca-diarreica';
import type { DoencaDiarreicaInput, DoencaDiarreicaResult } from '@/types/protocol-calculators';

const DoencaDiarreicaCalculator: React.FC = () => {
  const [formData, setFormData] = useState<DoencaDiarreicaInput>({
    peso: 0,
    idadeMeses: 0,
    diasDuracao: 0,
    diarreiaSangue: false,
    vomitos: false,
    febreAlta: false,
    aleitamentoMaterno: false,
    sinaisDesidratacao: {
      alerta: false,
      inquieto: false,
      letargia: false,
      olhosNormais: false,
      olhosFundos: false,
      olhosMuitoFundos: false,
      mucosasUmidas: false,
      mucosasSecas: false,
      mucosasMuitoSecas: false,
      turgorNormal: false,
      turgorDiminuido: false,
      turgorMuitoDiminuido: false,
      sedeNormal: false,
      sedeAumentada: false,
      incapazBeber: false,
      lagrimasPresentes: false,
      lagrimasAusentes: false,
      respiracaoNormal: false,
      respiracaoRapida: false,
      respiracaoAcidotica: false,
      pulsoNormal: false,
      pulsoRapido: false,
      pulsoAusente: false,
      extremidadesAquecidas: false,
      extremidadesFrias: false,
      extremidadesCianoticas: false,
      paNormal: false,
      paBaixa: false,
      paIndetectavel: false,
      diureseNormal: false,
      diureseDiminuida: false,
      anuria: false
    }
  });

  const [resultado, setResultado] = useState<DoencaDiarreicaResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: keyof DoencaDiarreicaInput, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSinalChange = (sinal: keyof DoencaDiarreicaInput['sinaisDesidratacao'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sinaisDesidratacao: {
        ...prev.sinaisDesidratacao,
        [sinal]: checked
      }
    }));
  };

  const handleCalculate = () => {
    const resultado = doencaDiarreicaCalculator.calcular(formData);
    setResultado(resultado);
    setShowResult(true);
  };

  const handleReset = () => {
    setFormData({
      peso: 0,
      idadeMeses: 0,
      diasDuracao: 0,
      diarreiaSangue: false,
      vomitos: false,
      febreAlta: false,
      aleitamentoMaterno: false,
      sinaisDesidratacao: {
        alerta: false,
        inquieto: false,
        letargia: false,
        olhosNormais: false,
        olhosFundos: false,
        olhosMuitoFundos: false,
        mucosasUmidas: false,
        mucosasSecas: false,
        mucosasMuitoSecas: false,
        turgorNormal: false,
        turgorDiminuido: false,
        turgorMuitoDiminuido: false,
        sedeNormal: false,
        sedeAumentada: false,
        incapazBeber: false,
        lagrimasPresentes: false,
        lagrimasAusentes: false,
        respiracaoNormal: false,
        respiracaoRapida: false,
        respiracaoAcidotica: false,
        pulsoNormal: false,
        pulsoRapido: false,
        pulsoAusente: false,
        extremidadesAquecidas: false,
        extremidadesFrias: false,
        extremidadesCianoticas: false,
        paNormal: false,
        paBaixa: false,
        paIndetectavel: false,
        diureseNormal: false,
        diureseDiminuida: false,
        anuria: false
      }
    });
    setResultado(null);
    setShowResult(false);
  };

  const getGrauDesidratacaoBadge = (grau: string) => {
    switch (grau) {
      case 'sem_desidratacao':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sem Desidratação</Badge>;
      case 'moderada':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Desidratação Moderada</Badge>;
      case 'grave':
        return <Badge variant="destructive">Desidratação Grave</Badge>;
      default:
        return <Badge variant="outline">{grau}</Badge>;
    }
  };

  const getClassificacaoBadge = (classificacao: string) => {
    switch (classificacao) {
      case 'aguda':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Diarreia Aguda</Badge>;
      case 'persistente':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Diarreia Persistente</Badge>;
      case 'com sangue':
        return <Badge variant="destructive">Diarreia com Sangue</Badge>;
      default:
        return <Badge variant="outline">{classificacao}</Badge>;
    }
  };

  const sinaisDesidratacaoSections = [
    {
      title: "Estado Geral",
      sinais: [
        { key: 'alerta', label: 'Alerta' },
        { key: 'inquieto', label: 'Inquieto/Irritado' },
        { key: 'letargia', label: 'Letárgico/Inconsciente' }
      ]
    },
    {
      title: "Olhos",
      sinais: [
        { key: 'olhosNormais', label: 'Olhos normais' },
        { key: 'olhosFundos', label: 'Olhos fundos' },
        { key: 'olhosMuitoFundos', label: 'Olhos muito fundos' }
      ]
    },
    {
      title: "Mucosas",
      sinais: [
        { key: 'mucosasUmidas', label: 'Mucosas úmidas' },
        { key: 'mucosasSecas', label: 'Mucosas secas' },
        { key: 'mucosasMuitoSecas', label: 'Mucosas muito secas' }
      ]
    },
    {
      title: "Turgor Cutâneo",
      sinais: [
        { key: 'turgorNormal', label: 'Turgor normal' },
        { key: 'turgorDiminuido', label: 'Turgor diminuído' },
        { key: 'turgorMuitoDiminuido', label: 'Turgor muito diminuído' }
      ]
    },
    {
      title: "Sede e Ingestão",
      sinais: [
        { key: 'sedeNormal', label: 'Sede normal/ausente' },
        { key: 'sedeAumentada', label: 'Sede aumentada' },
        { key: 'incapazBeber', label: 'Incapaz de beber' }
      ]
    },
    {
      title: "Lágrimas",
      sinais: [
        { key: 'lagrimasPresentes', label: 'Lágrimas presentes' },
        { key: 'lagrimasAusentes', label: 'Lágrimas ausentes' }
      ]
    },
    {
      title: "Respiração",
      sinais: [
        { key: 'respiracaoNormal', label: 'Respiração normal' },
        { key: 'respiracaoRapida', label: 'Respiração rápida' },
        { key: 'respiracaoAcidotica', label: 'Respiração acidótica' }
      ]
    },
    {
      title: "Pulso",
      sinais: [
        { key: 'pulsoNormal', label: 'Pulso normal' },
        { key: 'pulsoRapido', label: 'Pulso rápido/fraco' },
        { key: 'pulsoAusente', label: 'Pulso fino/ausente' }
      ]
    },
    {
      title: "Extremidades",
      sinais: [
        { key: 'extremidadesAquecidas', label: 'Extremidades aquecidas' },
        { key: 'extremidadesFrias', label: 'Extremidades frias' },
        { key: 'extremidadesCianoticas', label: 'Extremidades cianóticas' }
      ]
    },
    {
      title: "Pressão Arterial",
      sinais: [
        { key: 'paNormal', label: 'PA normal' },
        { key: 'paBaixa', label: 'PA baixa' },
        { key: 'paIndetectavel', label: 'PA indetectável' }
      ]
    },
    {
      title: "Diurese",
      sinais: [
        { key: 'diureseNormal', label: 'Diurese normal' },
        { key: 'diureseDiminuida', label: 'Diurese diminuída' },
        { key: 'anuria', label: 'Oligúria/Anúria' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-600" />
            Calculadora - Doença Diarreica
          </CardTitle>
          <CardDescription>
            Avaliação clínica e plano de hidratação para doença diarreica em pediatria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0"
                value={formData.peso || ''}
                onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 15.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idade">Idade (meses)</Label>
              <Input
                id="idade"
                type="number"
                min="0"
                value={formData.idadeMeses || ''}
                onChange={(e) => handleInputChange('idadeMeses', parseInt(e.target.value) || 0)}
                placeholder="Ex: 18"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (dias)</Label>
              <Input
                id="duracao"
                type="number"
                min="0"
                value={formData.diasDuracao || ''}
                onChange={(e) => handleInputChange('diasDuracao', parseInt(e.target.value) || 0)}
                placeholder="Ex: 3"
              />
            </div>
          </div>

          {/* Características da Diarreia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Características da Diarreia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diarreia-sangue"
                  checked={formData.diarreiaSangue}
                  onCheckedChange={(checked) => handleInputChange('diarreiaSangue', checked)}
                />
                <Label htmlFor="diarreia-sangue">Diarreia com sangue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vomitos"
                  checked={formData.vomitos}
                  onCheckedChange={(checked) => handleInputChange('vomitos', checked)}
                />
                <Label htmlFor="vomitos">Vômitos persistentes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="febre-alta"
                  checked={formData.febreAlta}
                  onCheckedChange={(checked) => handleInputChange('febreAlta', checked)}
                />
                <Label htmlFor="febre-alta">Febre alta (≥38,5°C)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aleitamento"
                  checked={formData.aleitamentoMaterno}
                  onCheckedChange={(checked) => handleInputChange('aleitamentoMaterno', checked)}
                />
                <Label htmlFor="aleitamento">Aleitamento materno</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sinais de Desidratação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Sinais de Desidratação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sinaisDesidratacaoSections.map((section) => (
                <Card key={section.title} className="p-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-3">{section.title}</h4>
                  <div className="space-y-2">
                    {section.sinais.map((sinal) => (
                      <div key={sinal.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={sinal.key}
                          checked={formData.sinaisDesidratacao[sinal.key as keyof typeof formData.sinaisDesidratacao]}
                          onCheckedChange={(checked) => handleSinalChange(sinal.key as keyof typeof formData.sinaisDesidratacao, checked as boolean)}
                        />
                        <Label htmlFor={sinal.key} className="text-sm">{sinal.label}</Label>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              Calcular Tratamento
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
          </div>

          {/* Resultados */}
          {showResult && resultado && (
            <div className="space-y-4 pt-6">
              <Separator />
              <h3 className="text-xl font-semibold">Resultados da Avaliação</h3>
              
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Grau de Desidratação</Label>
                    {getGrauDesidratacaoBadge(resultado.grauDesidratacao)}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Classificação</Label>
                    {getClassificacaoBadge(resultado.diarreiaClassificacao)}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Critérios de Internação</Label>
                    <Badge variant={resultado.criteriosInternacao ? "destructive" : "outline"}>
                      {resultado.criteriosInternacao ? "Indicada" : "Não Indicada"}
                    </Badge>
                  </div>
                </Card>
              </div>

              {/* Perda de Líquidos */}
              {resultado.perdaLiquidosEstimada > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Perda de Líquidos Estimada:</strong> {resultado.perdaLiquidosEstimada.toFixed(0)} ml
                  </AlertDescription>
                </Alert>
              )}

              {/* Plano de Hidratação */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{resultado.planoHidratacao.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Instruções:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {resultado.planoHidratacao.instrucoes.map((instrucao, index) => (
                        <li key={index}>{instrucao}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {resultado.tro && (
                    <Alert>
                      <Droplets className="h-4 w-4" />
                      <AlertDescription>
                        <strong>TRO (Terapia de Reidratação Oral):</strong> {resultado.tro}
                      </AlertDescription>
                    </Alert>
                  )}

                  {resultado.planoHidratacao.sinaisAlerta && (
                    <div>
                      <h4 className="font-medium mb-2 text-red-700">Sinais de Alerta:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                        {resultado.planoHidratacao.sinaisAlerta.map((sinal, index) => (
                          <li key={index}>{sinal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recomendações para Diarreia com Sangue */}
              {resultado.recomendacoesDiarreiaSangue.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">Recomendações - Diarreia com Sangue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {resultado.recomendacoesDiarreiaSangue.map((recomendacao, index) => (
                        <li key={index}>{recomendacao}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recomendações para Diarreia Persistente */}
              {resultado.recomendacoesDiarreiaPersistente.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">Recomendações - Diarreia Persistente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {resultado.recomendacoesDiarreiaPersistente.map((recomendacao, index) => (
                        <li key={index}>{recomendacao}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recomendações Adicionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recomendações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.recomendacoesAdicionais.map((recomendacao, index) => (
                      <li key={index}>{recomendacao}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoencaDiarreicaCalculator;
