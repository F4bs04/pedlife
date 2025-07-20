import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Copy, AlertTriangle, Activity, Heart, Stethoscope, Wind, Airplay } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { sragCalculator } from '@/utils/calculators/srag';
import {
  SragInput,
  SragResult
} from '@/types/protocol-calculators';

interface SragCalculatorProps {
  onResultsChange?: (results: SragResult | null) => void;
}

export const SragCalculator: React.FC<SragCalculatorProps> = ({ onResultsChange }) => {
  // Critérios PALICC básicos
  const [criterioTempo, setCriterioTempo] = useState<boolean>(false);
  const [criterioOrigemEdema, setCriterioOrigemEdema] = useState<boolean>(false);
  const [criterioImagemRadiologica, setCriterioImagemRadiologica] = useState<boolean>(false);
  
  // Critérios especiais
  const [criterioDoencaCardiacaCongenita, setCriterioDoencaCardiacaCongenita] = useState<boolean>(false);
  const [criterioDoencaPulmonarCronica, setCriterioDoencaPulmonarCronica] = useState<boolean>(false);
  
  // Dados para cálculo de índices
  const [pao2, setPao2] = useState<string>('');
  const [spo2, setSpo2] = useState<string>('');
  const [fio2, setFio2] = useState<string>('0.21');
  const [pmva, setPmva] = useState<string>('');
  const [ventilacaoMecanica, setVentilacaoMecanica] = useState<'invasiva' | 'nao_invasiva' | 'sem_suporte'>('sem_suporte');
  
  // Dados clínicos para recomendações
  const [pressaoPlato, setPressaoPlato] = useState<string>('');
  const [hipertensaoPulmonar, setHipertensaoPulmonar] = useState<boolean>(false);
  const [disfuncaoVD, setDisfuncaoVD] = useState<boolean>(false);
  const [trocasGasosasInadequadas, setTrocasGasosasInadequadas] = useState<boolean>(false);
  
  const [results, setResults] = useState<SragResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateProtocol = () => {
    if (!fio2) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a FiO2",
        variant: "destructive"
      });
      return;
    }

    const fio2Num = parseFloat(fio2);

    if (fio2Num <= 0 || fio2Num > 1) {
      toast({
        title: "Erro",
        description: "FiO2 deve estar entre 0.21 e 1.0",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: SragInput = {
        criterioTempo,
        criterioOrigemEdema,
        criterioImagemRadiologica,
        criterioDoencaCardiacaCongenita,
        criterioDoencaPulmonarCronica,
        pao2: pao2 ? parseFloat(pao2) : undefined,
        spo2: spo2 ? parseFloat(spo2) : undefined,
        fio2: fio2Num,
        pmva: pmva ? parseFloat(pmva) : undefined,
        ventilacaoMecanica,
        pressaoPlato: pressaoPlato ? parseFloat(pressaoPlato) : undefined,
        hipertensaoPulmonar,
        disfuncaoVD,
        trocasGasosasInadequadas
      };

      const calculatedResults = sragCalculator.calcular(input);
      setResults(calculatedResults);
      onResultsChange?.(calculatedResults);
      toast({
        title: "Sucesso",
        description: "Avaliação realizada com sucesso!"
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

  const getSeverityColor = (gravidade: string) => {
    switch (gravidade) {
      case 'Leve': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Grave': return 'bg-red-100 text-red-800 border-red-200';
      case 'Não classificável como SDRA': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Dados insuficientes para classificação': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDiagnosisColor = (diagnostico: boolean) => {
    return diagnostico 
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Critérios Diagnósticos PALICC */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Airplay className="h-5 w-5" />
            Critérios Diagnósticos PALICC para SDRA Pediátrica
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Todos os 3 critérios devem estar presentes para diagnóstico de SDRA
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox id="criterioTempo" checked={criterioTempo} onCheckedChange={(checked) => setCriterioTempo(checked as boolean)} />
              <div>
                <Label htmlFor="criterioTempo" className="font-medium">Tempo</Label>
                <p className="text-sm text-muted-foreground">Dentro de 7 dias de lesão clínica conhecida</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox id="criterioOrigemEdema" checked={criterioOrigemEdema} onCheckedChange={(checked) => setCriterioOrigemEdema(checked as boolean)} />
              <div>
                <Label htmlFor="criterioOrigemEdema" className="font-medium">Origem do edema</Label>
                <p className="text-sm text-muted-foreground">Insuficiência respiratória que não seja totalmente explicada por insuficiência cardíaca ou sobrecarga de fluidos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox id="criterioImagemRadiologica" checked={criterioImagemRadiologica} onCheckedChange={(checked) => setCriterioImagemRadiologica(checked as boolean)} />
              <div>
                <Label htmlFor="criterioImagemRadiologica" className="font-medium">Imagem radiológica</Label>
                <p className="text-sm text-muted-foreground">Raio-x com novo(s) infiltrado(s) condizentes com doença parenquimatosa pulmonar aguda</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critérios Especiais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Critérios Especiais
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aplicáveis em condições específicas
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox id="criterioDoencaCardiacaCongenita" checked={criterioDoencaCardiacaCongenita} onCheckedChange={(checked) => setCriterioDoencaCardiacaCongenita(checked as boolean)} />
              <div>
                <Label htmlFor="criterioDoencaCardiacaCongenita" className="font-medium">Doença cardíaca congênita</Label>
                <p className="text-sm text-muted-foreground">Deterioração aguda da oxigenação não explicada por doença cardíaca subjacente</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox id="criterioDoencaPulmonarCronica" checked={criterioDoencaPulmonarCronica} onCheckedChange={(checked) => setCriterioDoencaPulmonarCronica(checked as boolean)} />
              <div>
                <Label htmlFor="criterioDoencaPulmonarCronica" className="font-medium">Doença pulmonar crônica</Label>
                <p className="text-sm text-muted-foreground">Novo infiltrado e deterioração compatíveis com SDRA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados para Cálculo de Índices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dados para Cálculo de Índices de Oxigenação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pao2">PaO₂ (mmHg)</Label>
              <Input
                id="pao2"
                type="number"
                value={pao2}
                onChange={(e) => setPao2(e.target.value)}
                placeholder="Ex: 80"
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <Label htmlFor="spo2">SpO₂ (%)</Label>
              <Input
                id="spo2"
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                placeholder="Ex: 95"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div>
              <Label htmlFor="fio2">FiO₂ (decimal)</Label>
              <Input
                id="fio2"
                type="number"
                value={fio2}
                onChange={(e) => setFio2(e.target.value)}
                placeholder="Ex: 0.5"
                min="0.21"
                max="1.0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">0.21 = ar ambiente, 1.0 = 100% O₂</p>
            </div>
            
            <div>
              <Label htmlFor="pmva">PMVA (cmH₂O)</Label>
              <Input
                id="pmva"
                type="number"
                value={pmva}
                onChange={(e) => setPmva(e.target.value)}
                placeholder="Ex: 12"
                min="0"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">Pressão Média de Vias Aéreas (apenas VMI)</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="ventilacaoMecanica">Tipo de suporte ventilatório</Label>
            <Select value={ventilacaoMecanica} onValueChange={(value) => setVentilacaoMecanica(value as 'invasiva' | 'nao_invasiva' | 'sem_suporte')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sem_suporte">Sem suporte / Cateter nasal</SelectItem>
                <SelectItem value="nao_invasiva">Ventilação não invasiva (VNI)</SelectItem>
                <SelectItem value="invasiva">Ventilação mecânica invasiva (VMI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dados Clínicos Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Dados Clínicos Adicionais
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Para orientação terapêutica específica
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pressaoPlato">Pressão de platô (cmH₂O)</Label>
            <Input
              id="pressaoPlato"
              type="number"
              value={pressaoPlato}
              onChange={(e) => setPressaoPlato(e.target.value)}
              placeholder="Ex: 30"
              min="0"
              step="0.1"
            />
            <p className="text-xs text-muted-foreground mt-1">Considerar VOAF se &gt; 28 cmH₂O</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="hipertensaoPulmonar" checked={hipertensaoPulmonar} onCheckedChange={(checked) => setHipertensaoPulmonar(checked as boolean)} />
              <Label htmlFor="hipertensaoPulmonar">Hipertensão pulmonar</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="disfuncaoVD" checked={disfuncaoVD} onCheckedChange={(checked) => setDisfuncaoVD(checked as boolean)} />
              <Label htmlFor="disfuncaoVD">Disfunção de ventrículo direito</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="trocasGasosasInadequadas" checked={trocasGasosasInadequadas} onCheckedChange={(checked) => setTrocasGasosasInadequadas(checked as boolean)} />
              <Label htmlFor="trocasGasosasInadequadas">Trocas gasosas inadequadas (considerar ECMO)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Cálculo */}
      <div className="flex justify-center">
        <Button 
          onClick={calculateProtocol}
          disabled={isCalculating}
          className="px-8 py-2"
        >
          {isCalculating ? 'Calculando...' : 'Avaliar SRAG/SDRA'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Diagnóstico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Diagnóstico de SDRA</span>
                <Badge className={getDiagnosisColor(results.diagnosticoSDRA)}>
                  {results.diagnosticoSDRA ? 'SDRA CONFIRMADA' : 'SDRA NÃO CONFIRMADA'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h5 className="font-medium mb-2 text-green-700">Critérios atendidos ({results.criteriosAtendidos.length}/3):</h5>
                {results.criteriosAtendidos.map((criterio, index) => (
                  <div key={index} className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium text-sm">{criterio.criterio}</p>
                    <p className="text-xs text-muted-foreground">{criterio.definicao}</p>
                  </div>
                ))}
              </div>
              
              {results.criteriosNaoAtendidos.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 text-red-700">Critérios não atendidos:</h5>
                  {results.criteriosNaoAtendidos.map((criterio, index) => (
                    <div key={index} className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="font-medium text-sm">{criterio.criterio}</p>
                      <p className="text-xs text-muted-foreground">{criterio.definicao}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {results.criteriosEspeciaisAplicaveis.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">Critérios especiais aplicáveis:</h5>
                  {results.criteriosEspeciaisAplicaveis.map((criterio, index) => (
                    <div key={index} className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="font-medium text-sm">{criterio.criterio}</p>
                      <p className="text-xs text-muted-foreground">{criterio.definicao}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Índices de Oxigenação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Índices de Oxigenação</span>
                <Badge className={getSeverityColor(results.indices.gravidade)}>
                  {results.indices.gravidade.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.indices.io !== undefined && (
                  <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                    <h5 className="font-medium text-sm">IO</h5>
                    <p className="text-lg font-mono">{results.indices.io.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Índice Oxigenação</p>
                  </div>
                )}
                
                {results.indices.iso !== undefined && (
                  <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                    <h5 className="font-medium text-sm">ISO</h5>
                    <p className="text-lg font-mono">{results.indices.iso.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Índice Sat. O₂</p>
                  </div>
                )}
                
                {results.indices.pfRatio !== undefined && (
                  <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                    <h5 className="font-medium text-sm">PaO₂/FiO₂</h5>
                    <p className="text-lg font-mono">{results.indices.pfRatio.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Relação P/F</p>
                  </div>
                )}
                
                {results.indices.sfRatio !== undefined && (
                  <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                    <h5 className="font-medium text-sm">SpO₂/FiO₂</h5>
                    <p className="text-lg font-mono">{results.indices.sfRatio.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Relação S/F</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recomendações Terapêuticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recomendações Terapêuticas</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(
                    results.recomendacoes.recomendacoesPositivas.map(rec => 
                      `${rec.terapia}: ${rec.recomendacao}`
                    ).join('\n\n')
                  )}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="font-medium mb-3 text-green-700">Terapias Recomendadas:</h5>
                <div className="space-y-3">
                  {results.recomendacoes.recomendacoesPositivas.map((recomendacao, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-medium text-sm">{recomendacao.terapia}</h6>
                        <Badge className={getPriorityColor(recomendacao.prioridade)} variant="outline">
                          {recomendacao.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{recomendacao.recomendacao}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h5 className="font-medium mb-3 text-red-700">Terapias NÃO Recomendadas:</h5>
                <div className="space-y-3">
                  {results.recomendacoes.recomendacoesNegativas.map((recomendacao, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-medium text-sm">{recomendacao.terapia}</h6>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          não recomendado
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{recomendacao.recomendacao}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SragCalculator;
