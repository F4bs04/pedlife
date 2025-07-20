import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { bronquioliteVSRCalculator } from '../../utils/calculators/bronquiolite-vsr';
import type { BronquioliteVSRInput, BronquioliteVSRResult } from '../../types/protocol-calculators';

export function BronquioliteVSRCalculator() {
  const [dados, setDados] = useState<BronquioliteVSRInput>({
    idadeMeses: 0,
    frequenciaRespiratoria: 0,
    retracao: 'ausente',
    saturacao: 100,
    alimentacao: 'normal',
    estadoGeral: 'normal',
    apneia: false,
    cianose: false,
    prematuro: false,
    comorbidades: false,
    condicoesSociais: false,
    distanciaServico: false,
    insuficienciaRespiratoria: false,
    apneiaRecorrente: false,
    pioraProgressiva: false,
    jaEmOxigenio: false,
    acidoseRespiratoria: false
  });

  const [resultado, setResultado] = useState<BronquioliteVSRResult | null>(null);

  const handleInputChange = (field: keyof BronquioliteVSRInput, value: any) => {
    setDados(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcular = () => {
    const novoResultado = bronquioliteVSRCalculator.calcular(dados);
    setResultado(novoResultado);
  };

  const limpar = () => {
    setDados({
      idadeMeses: 0,
      frequenciaRespiratoria: 0,
      retracao: 'ausente',
      saturacao: 100,
      alimentacao: 'normal',
      estadoGeral: 'normal',
      apneia: false,
      cianose: false,
      prematuro: false,
      comorbidades: false,
      condicoesSociais: false,
      distanciaServico: false,
      insuficienciaRespiratoria: false,
      apneiaRecorrente: false,
      pioraProgressiva: false,
      jaEmOxigenio: false,
      acidoseRespiratoria: false
    });
    setResultado(null);
  };

  const getGravidadeBadgeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'leve': return 'bg-green-100 text-green-800';
      case 'moderada': return 'bg-yellow-100 text-yellow-800';
      case 'grave': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Calculadora de Bronquiolite VSR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Idade (meses)</label>
              <Input
                type="number"
                value={dados.idadeMeses}
                onChange={(e) => handleInputChange('idadeMeses', parseInt(e.target.value) || 0)}
                min="0"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Frequência Respiratória (irpm)</label>
              <Input
                type="number"
                value={dados.frequenciaRespiratoria}
                onChange={(e) => handleInputChange('frequenciaRespiratoria', parseInt(e.target.value) || 0)}
                min="0"
                max="120"
              />
            </div>
          </div>

          {/* Sinais Vitais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Retrações</label>
              <Select 
                value={dados.retracao} 
                onValueChange={(value: 'ausente' | 'leve' | 'moderada' | 'grave') => 
                  handleInputChange('retracao', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ausente">Ausente</SelectItem>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="grave">Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Saturação de O₂ (%)</label>
              <Input
                type="number"
                value={dados.saturacao}
                onChange={(e) => handleInputChange('saturacao', parseFloat(e.target.value) || 100)}
                min="70"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          {/* Avaliação Clínica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Alimentação</label>
              <Select 
                value={dados.alimentacao} 
                onValueChange={(value: 'normal' | 'reduzida' | 'minima') => 
                  handleInputChange('alimentacao', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (75% ou mais)</SelectItem>
                  <SelectItem value="reduzida">Reduzida (50-75%)</SelectItem>
                  <SelectItem value="minima">Mínima (menos de 50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado Geral</label>
              <Select 
                value={dados.estadoGeral} 
                onValueChange={(value: 'normal' | 'irritado' | 'letargico' | 'toxemiado') => 
                  handleInputChange('estadoGeral', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="irritado">Irritado</SelectItem>
                  <SelectItem value="letargico">Letárgico</SelectItem>
                  <SelectItem value="toxemiado">Toxemiado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sinais de Alarme */}
          <div>
            <label className="block text-sm font-medium mb-2">Sinais de Alarme</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.apneia}
                  onChange={(e) => handleInputChange('apneia', e.target.checked)}
                  className="rounded"
                />
                <span>Apneia</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.cianose}
                  onChange={(e) => handleInputChange('cianose', e.target.checked)}
                  className="rounded"
                />
                <span>Cianose</span>
              </label>
            </div>
          </div>

          {/* Fatores de Risco */}
          <div>
            <label className="block text-sm font-medium mb-2">Fatores de Risco</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.prematuro}
                  onChange={(e) => handleInputChange('prematuro', e.target.checked)}
                  className="rounded"
                />
                <span>Prematuro</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.comorbidades}
                  onChange={(e) => handleInputChange('comorbidades', e.target.checked)}
                  className="rounded"
                />
                <span>Comorbidades</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.condicoesSociais}
                  onChange={(e) => handleInputChange('condicoesSociais', e.target.checked)}
                  className="rounded"
                />
                <span>Condições sociais desfavoráveis</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.distanciaServico}
                  onChange={(e) => handleInputChange('distanciaServico', e.target.checked)}
                  className="rounded"
                />
                <span>Distância do serviço</span>
              </label>
            </div>
          </div>

          {/* Critérios para UTI */}
          <div>
            <label className="block text-sm font-medium mb-2">Critérios para UTI (se aplicável)</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.insuficienciaRespiratoria}
                  onChange={(e) => handleInputChange('insuficienciaRespiratoria', e.target.checked)}
                  className="rounded"
                />
                <span>Insuficiência respiratória</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.apneiaRecorrente}
                  onChange={(e) => handleInputChange('apneiaRecorrente', e.target.checked)}
                  className="rounded"
                />
                <span>Apneia recorrente</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.pioraProgressiva}
                  onChange={(e) => handleInputChange('pioraProgressiva', e.target.checked)}
                  className="rounded"
                />
                <span>Piora progressiva</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.jaEmOxigenio}
                  onChange={(e) => handleInputChange('jaEmOxigenio', e.target.checked)}
                  className="rounded"
                />
                <span>Já em oxigenioterapia</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.acidoseRespiratoria}
                  onChange={(e) => handleInputChange('acidoseRespiratoria', e.target.checked)}
                  className="rounded"
                />
                <span>Acidose respiratória</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Button onClick={calcular} className="flex-1">
              Calcular
            </Button>
            <Button onClick={limpar} variant="outline">
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Gravidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Classificação de Gravidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Gravidade:</span>
                  <Badge className={getGravidadeBadgeColor(resultado.gravidade.gravidade)}>
                    {resultado.gravidade.gravidade.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Critérios identificados:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.gravidade.descricao.map((criterio, index) => (
                      <li key={index}>{criterio}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Manejo recomendado:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.gravidade.manejo.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resultado.internacao.indicacaoInternacao ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                Indicação de Internação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={resultado.internacao.indicacaoInternacao ? 'border-red-200' : 'border-green-200'}>
                <AlertDescription>
                  <strong>
                    {resultado.internacao.indicacaoInternacao 
                      ? 'INDICADA INTERNAÇÃO HOSPITALAR' 
                      : 'Não há indicação de internação no momento'
                    }
                  </strong>
                </AlertDescription>
              </Alert>
              
              {resultado.internacao.criteriosPresentes.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Critérios presentes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.internacao.criteriosPresentes.map((criterio, index) => (
                      <li key={index}>{criterio}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* UTI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resultado.uti.indicacaoUTI ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                Indicação de UTI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={resultado.uti.indicacaoUTI ? 'border-red-200' : 'border-green-200'}>
                <AlertDescription>
                  <strong>
                    {resultado.uti.indicacaoUTI 
                      ? 'INDICADA INTERNAÇÃO EM UTI' 
                      : 'Não há indicação de UTI no momento'
                    }
                  </strong>
                </AlertDescription>
              </Alert>
              
              {resultado.uti.criteriosPresentes.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Critérios presentes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.uti.criteriosPresentes.map((criterio, index) => (
                      <li key={index}>{criterio}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Critérios de Alta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={resultado.alta.podeAlta ? 'border-green-200' : 'border-yellow-200'}>
                <AlertDescription>
                  <strong>
                    {resultado.alta.podeAlta 
                      ? 'Paciente pode receber alta com orientações' 
                      : 'Alta não recomendada no momento'
                    }
                  </strong>
                </AlertDescription>
              </Alert>
              
              {resultado.alta.observacao && (
                <div className="mt-4">
                  <p className="text-sm font-medium">{resultado.alta.observacao}</p>
                </div>
              )}

              {resultado.alta.orientacoes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Orientações domiciliares:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.alta.orientacoes.map((orientacao, index) => (
                      <li key={index}>{orientacao}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tratamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Recomendações de Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resultado.tratamento.map((categoria, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2">{categoria.categoria}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm mb-2">
                    {categoria.itens.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                  
                  {categoria.detalhes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2">Detalhes importantes:</h5>
                      <div className="space-y-2">
                        {categoria.detalhes.map((detalhe, detalheIndex) => (
                          <div key={detalheIndex} className="text-sm">
                            <strong>{detalhe.terapia}:</strong> {detalhe.recomendacao}
                            <br />
                            <em>Justificativa: {detalhe.justificativa}</em>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
