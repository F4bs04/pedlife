import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle, XCircle, Heart, Activity } from 'lucide-react';
import { criseAlgicaAnemiaFalciformeCalculator } from '../../utils/calculators/crise-algica-anemia-falciforme';
import type { CriseAlgicaAnemiaFalciformeInput, CriseAlgicaAnemiaFalciformeResult } from '../../types/protocol-calculators';

export function CriseAlgicaAnemiaFalciformeCalculator() {
  const [dados, setDados] = useState<CriseAlgicaAnemiaFalciformeInput>({
    peso: 0,
    idadeAnos: 0,
    intensidadeDor: 0,
    sinaisToxicidade: false,
    hidratacao: 'normal',
    ingestaOral: 'normal',
    febre: 'ausente',
    sintomas: {
      sintomasRespiratorios: false,
      dorToracica: false,
      sintomasAbdominais: false,
      priapismo: false,
      seqestroEsplenico: false
    },
    vomitosPersistentes: false
  });

  const [resultado, setResultado] = useState<CriseAlgicaAnemiaFalciformeResult | null>(null);

  const handleInputChange = (field: keyof CriseAlgicaAnemiaFalciformeInput, value: any) => {
    setDados(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSintomaChange = (sintoma: keyof CriseAlgicaAnemiaFalciformeInput['sintomas'], value: boolean) => {
    setDados(prev => ({
      ...prev,
      sintomas: {
        ...prev.sintomas,
        [sintoma]: value
      }
    }));
  };

  const calcular = () => {
    const novoResultado = criseAlgicaAnemiaFalciformeCalculator.calcular(dados);
    setResultado(novoResultado);
  };

  const limpar = () => {
    setDados({
      peso: 0,
      idadeAnos: 0,
      intensidadeDor: 0,
      sinaisToxicidade: false,
      hidratacao: 'normal',
      ingestaOral: 'normal',
      febre: 'ausente',
      sintomas: {
        sintomasRespiratorios: false,
        dorToracica: false,
        sintomasAbdominais: false,
        priapismo: false,
        seqestroEsplenico: false
      },
      vomitosPersistentes: false
    });
    setResultado(null);
  };

  const getGravidadeBadgeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'leve': return 'bg-green-100 text-green-800';
      case 'moderada': return 'bg-yellow-100 text-yellow-800';
      case 'intensa': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDorIntensityColor = (intensidade: number) => {
    if (intensidade <= 3) return 'text-green-600';
    if (intensidade <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Calculadora de Crise Álgica - Anemia Falciforme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Peso (kg)</label>
              <Input
                type="number"
                value={dados.peso}
                onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Idade (anos)</label>
              <Input
                type="number"
                value={dados.idadeAnos}
                onChange={(e) => handleInputChange('idadeAnos', parseInt(e.target.value) || 0)}
                min="0"
                max="18"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Intensidade da Dor (0-10)
                <span className={`ml-2 font-bold ${getDorIntensityColor(dados.intensidadeDor)}`}>
                  {dados.intensidadeDor}/10
                </span>
              </label>
              <Input
                type="range"
                min="0"
                max="10"
                value={dados.intensidadeDor}
                onChange={(e) => handleInputChange('intensidadeDor', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Avaliação Clínica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Estado de Hidratação</label>
              <Select 
                value={dados.hidratacao} 
                onValueChange={(value: CriseAlgicaAnemiaFalciformeInput['hidratacao']) => 
                  handleInputChange('hidratacao', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="desidratado_leve">Desidratação Leve</SelectItem>
                  <SelectItem value="desidratado_moderado">Desidratação Moderada</SelectItem>
                  <SelectItem value="desidratado_grave">Desidratação Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ingesta Oral</label>
              <Select 
                value={dados.ingestaOral} 
                onValueChange={(value: CriseAlgicaAnemiaFalciformeInput['ingestaOral']) => 
                  handleInputChange('ingestaOral', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="prejudicada">Prejudicada</SelectItem>
                  <SelectItem value="impossivel">Impossível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Febre</label>
              <Select 
                value={dados.febre} 
                onValueChange={(value: CriseAlgicaAnemiaFalciformeInput['febre']) => 
                  handleInputChange('febre', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ausente">Ausente</SelectItem>
                  <SelectItem value="baixa">Baixa (37.1-37.9°C)</SelectItem>
                  <SelectItem value="moderada">Moderada (38-38.9°C)</SelectItem>
                  <SelectItem value="alta">Alta (≥39°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.sinaisToxicidade}
                  onChange={(e) => handleInputChange('sinaisToxicidade', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Sinais de Toxicidade</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.vomitosPersistentes}
                  onChange={(e) => handleInputChange('vomitosPersistentes', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Vômitos Persistentes</span>
              </label>
            </div>
          </div>

          {/* Sintomas e Complicações */}
          <div>
            <label className="block text-sm font-medium mb-2">Sintomas e Complicações</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.sintomas.sintomasRespiratorios}
                  onChange={(e) => handleSintomaChange('sintomasRespiratorios', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Sintomas Respiratórios</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.sintomas.dorToracica}
                  onChange={(e) => handleSintomaChange('dorToracica', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Dor Torácica</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.sintomas.sintomasAbdominais}
                  onChange={(e) => handleSintomaChange('sintomasAbdominais', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Sintomas Abdominais</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.sintomas.priapismo}
                  onChange={(e) => handleSintomaChange('priapismo', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Priapismo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dados.sintomas.seqestroEsplenico}
                  onChange={(e) => handleSintomaChange('seqestroEsplenico', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Sequestro Esplênico</span>
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
          {/* Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Avaliação da Crise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Gravidade da Dor:</span>
                  <Badge className={getGravidadeBadgeColor(resultado.avaliacao.gravidadeDor)}>
                    {resultado.avaliacao.gravidadeDor.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    (Intensidade: {resultado.dadosPaciente.intensidadeDor}/10)
                  </span>
                </div>
                
                {resultado.avaliacao.complicacoes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Complicações Identificadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {resultado.avaliacao.complicacoes.map((comp, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hidratação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Plano de Hidratação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Manutenção (1,5x)</h4>
                  <p className="text-lg font-bold text-blue-900">
                    {resultado.recomendacoes.hidratacao.volumeManutencao} mL/24h
                  </p>
                  <p className="text-sm text-blue-700">
                    {resultado.recomendacoes.hidratacao.volumeManutencaoHora} mL/h
                  </p>
                </div>
                {resultado.recomendacoes.hidratacao.volumeExpansao && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Expansão</h4>
                    <p className="text-lg font-bold text-red-900">
                      {resultado.recomendacoes.hidratacao.volumeExpansao} mL
                    </p>
                    <p className="text-sm text-red-700">15 mL/kg</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medicamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medicamentos Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultado.recomendacoes.medicamentos.map((med, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{med.medicamento}</h4>
                        <p className="text-sm text-gray-600">{med.dose}</p>
                        {med.doseCalculada && (
                          <p className="text-sm font-medium text-blue-600">
                            Dose calculada: {med.doseCalculada}
                          </p>
                        )}
                        {med.doseMaxima && (
                          <p className="text-sm text-gray-500">Dose máxima: {med.doseMaxima}</p>
                        )}
                        {med.frequencia && (
                          <p className="text-sm text-gray-500">Frequência: a cada {med.frequencia}</p>
                        )}
                        {med.observacao && (
                          <p className="text-xs text-orange-600 mt-1 italic">{med.observacao}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Internação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {resultado.internacao.necessitaInternacao ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                Indicação de Internação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={resultado.internacao.necessitaInternacao ? 'border-red-200' : 'border-green-200'}>
                <AlertDescription>
                  <strong>
                    {resultado.internacao.necessitaInternacao 
                      ? 'INDICADA INTERNAÇÃO HOSPITALAR' 
                      : 'Não há indicação de internação no momento'
                    }
                  </strong>
                </AlertDescription>
              </Alert>
              
              {resultado.internacao.justificativas.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Justificativas:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.internacao.justificativas.map((justificativa, index) => (
                      <li key={index}>{justificativa}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exames */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Exames Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resultado.recomendacoes.exames.map((exame, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{exame}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Complicações */}
          {resultado.recomendacoes.complicacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Manejo de Complicações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultado.recomendacoes.complicacoes.map((complicacao, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">{complicacao.nome}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {complicacao.manejo.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Critérios de Alta */}
          {resultado.criteriosAlta.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Critérios de Alta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {resultado.criteriosAlta.map((criterio, index) => (
                    <li key={index}>{criterio}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
