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
import { Copy, AlertTriangle, Stethoscope, Activity, Heart, Thermometer, Pill } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { pneumoniaCalculator } from '@/utils/calculators/pneumonia';
import {
  PneumoniaInput,
  PneumoniaResult
} from '@/types/protocol-calculators';

interface PneumoniaCalculatorProps {
  onResultsChange?: (results: PneumoniaResult | null) => void;
}

export const PneumoniaCalculator: React.FC<PneumoniaCalculatorProps> = ({ onResultsChange }) => {
  const [idadeMeses, setIdadeMeses] = useState<string>('');
  const [freqRespiratoria, setFreqRespiratoria] = useState<string>('');
  const [saturacaoO2, setSaturacaoO2] = useState<string>('');
  const [retracoes, setRetracoes] = useState<'ausentes' | 'leves' | 'moderadas' | 'graves'>('ausentes');
  const [alimentacao, setAlimentacao] = useState<'normal' | 'reduzida' | 'recusa'>('normal');
  const [estadoGeral, setEstadoGeral] = useState<'bom' | 'irritado' | 'toxemiado'>('bom');
  const [cianose, setCianose] = useState<boolean>(false);
  const [apneia, setApneia] = useState<boolean>(false);
  const [letargia, setLetargia] = useState<boolean>(false);
  const [prematuro, setPrematuro] = useState<boolean>(false);
  const [comorbidades, setComorbidades] = useState<boolean>(false);
  const [condicoesSociaisDesfavoraveis, setCondicoesSociaisDesfavoraveis] = useState<boolean>(false);
  const [dificuldadeAcesso, setDificuldadeAcesso] = useState<boolean>(false);
  const [falhaTratamento, setFalhaTratamento] = useState<boolean>(false);
  const [insuficienciaRespiratoria, setInsuficienciaRespiratoria] = useState<boolean>(false);
  const [desconfortoProgressivo, setDesconfortoProgressivo] = useState<boolean>(false);
  const [oxigenoterapia, setOxigenoterapia] = useState<boolean>(false);
  const [acidoseRespiratoria, setAcidoseRespiratoria] = useState<boolean>(false);
  const [derramepleural, setDerramepleural] = useState<boolean>(false);
  const [pneumoniaComplicada, setPneumoniaComplicada] = useState<boolean>(false);
  const [suspeitaAspiracao, setSuspeitaAspiracao] = useState<boolean>(false);
  const [suspeitaAtipicos, setSuspeitaAtipicos] = useState<boolean>(false);
  const [results, setResults] = useState<PneumoniaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateProtocol = () => {
    if (!idadeMeses || !freqRespiratoria || !saturacaoO2) {
      toast({
        title: "Erro",
        description: "Por favor, preencha idade, frequência respiratória e saturação de O₂",
        variant: "destructive"
      });
      return;
    }

    const idadeMesesNum = parseFloat(idadeMeses);
    const freqRespiratoriaNum = parseFloat(freqRespiratoria);
    const saturacaoO2Num = parseFloat(saturacaoO2);

    if (idadeMesesNum < 0 || freqRespiratoriaNum <= 0 || saturacaoO2Num <= 0 || saturacaoO2Num > 100) {
      toast({
        title: "Erro",
        description: "Verifique os valores inseridos",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: PneumoniaInput = {
        idadeMeses: idadeMesesNum,
        freqRespiratoria: freqRespiratoriaNum,
        saturacaoO2: saturacaoO2Num,
        retracoes,
        alimentacao,
        estadoGeral,
        cianose,
        apneia,
        letargia,
        prematuro,
        comorbidades,
        condicoesSociaisDesfavoraveis,
        dificuldadeAcesso,
        falhaTratamento,
        insuficienciaRespiratoria,
        desconfortoProgressivo,
        oxigenoterapia,
        acidoseRespiratoria,
        derramepleural,
        pneumoniaComplicada,
        suspeitaAspiracao,
        suspeitaAtipicos
      };

      const calculatedResults = pneumoniaCalculator.calcular(input);
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

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'leve': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'grave': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dados Básicos do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Dados Básicos do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="idadeMeses">Idade (meses)</Label>
              <Input
                id="idadeMeses"
                type="number"
                value={idadeMeses}
                onChange={(e) => setIdadeMeses(e.target.value)}
                placeholder="Ex: 24"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="freqRespiratoria">Frequência Respiratória (irpm)</Label>
              <Input
                id="freqRespiratoria"
                type="number"
                value={freqRespiratoria}
                onChange={(e) => setFreqRespiratoria(e.target.value)}
                placeholder="Ex: 45"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="saturacaoO2">Saturação de O₂ (%)</Label>
              <Input
                id="saturacaoO2"
                type="number"
                value={saturacaoO2}
                onChange={(e) => setSaturacaoO2(e.target.value)}
                placeholder="Ex: 94"
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliação Clínica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Avaliação Clínica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="retracoes">Retrações</Label>
              <Select value={retracoes} onValueChange={(value) => setRetracoes(value as 'ausentes' | 'leves' | 'moderadas' | 'graves')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ausentes">Ausentes</SelectItem>
                  <SelectItem value="leves">Leves</SelectItem>
                  <SelectItem value="moderadas">Moderadas</SelectItem>
                  <SelectItem value="graves">Graves</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="alimentacao">Alimentação</Label>
              <Select value={alimentacao} onValueChange={(value) => setAlimentacao(value as 'normal' | 'reduzida' | 'recusa')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (&gt; 75%)</SelectItem>
                  <SelectItem value="reduzida">Reduzida (50-75%)</SelectItem>
                  <SelectItem value="recusa">Recusa (&lt; 50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estadoGeral">Estado Geral</Label>
              <Select value={estadoGeral} onValueChange={(value) => setEstadoGeral(value as 'bom' | 'irritado' | 'toxemiado')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bom">Bom</SelectItem>
                  <SelectItem value="irritado">Irritado</SelectItem>
                  <SelectItem value="toxemiado">Toxemiado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Sinais de Gravidade</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="cianose" checked={cianose} onCheckedChange={(checked) => setCianose(checked as boolean)} />
                <Label htmlFor="cianose">Cianose</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="apneia" checked={apneia} onCheckedChange={(checked) => setApneia(checked as boolean)} />
                <Label htmlFor="apneia">Apneia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="letargia" checked={letargia} onCheckedChange={(checked) => setLetargia(checked as boolean)} />
                <Label htmlFor="letargia">Letargia</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fatores de Risco e Comorbidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Fatores de Risco e Comorbidades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="prematuro" checked={prematuro} onCheckedChange={(checked) => setPrematuro(checked as boolean)} />
              <Label htmlFor="prematuro">Prematuro (&lt; 35 semanas)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="comorbidades" checked={comorbidades} onCheckedChange={(checked) => setComorbidades(checked as boolean)} />
              <Label htmlFor="comorbidades">Comorbidades significativas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="condicoesSociais" checked={condicoesSociaisDesfavoraveis} onCheckedChange={(checked) => setCondicoesSociaisDesfavoraveis(checked as boolean)} />
              <Label htmlFor="condicoesSociais">Condições sociais desfavoráveis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dificuldadeAcesso" checked={dificuldadeAcesso} onCheckedChange={(checked) => setDificuldadeAcesso(checked as boolean)} />
              <Label htmlFor="dificuldadeAcesso">Dificuldade de acesso à saúde</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="falhaTratamento" checked={falhaTratamento} onCheckedChange={(checked) => setFalhaTratamento(checked as boolean)} />
              <Label htmlFor="falhaTratamento">Falha do tratamento ambulatorial</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliação Específica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Avaliação Específica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="insuficienciaRespiratoria" checked={insuficienciaRespiratoria} onCheckedChange={(checked) => setInsuficienciaRespiratoria(checked as boolean)} />
              <Label htmlFor="insuficienciaRespiratoria">Insuficiência respiratória</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="desconfortoProgressivo" checked={desconfortoProgressivo} onCheckedChange={(checked) => setDesconfortoProgressivo(checked as boolean)} />
              <Label htmlFor="desconfortoProgressivo">Desconforto progressivo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="oxigenoterapia" checked={oxigenoterapia} onCheckedChange={(checked) => setOxigenoterapia(checked as boolean)} />
              <Label htmlFor="oxigenoterapia">Em oxigenoterapia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="acidoseRespiratoria" checked={acidoseRespiratoria} onCheckedChange={(checked) => setAcidoseRespiratoria(checked as boolean)} />
              <Label htmlFor="acidoseRespiratoria">Acidose respiratória</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="derramepleural" checked={derramepleural} onCheckedChange={(checked) => setDerramepleural(checked as boolean)} />
              <Label htmlFor="derramepleural">Derrame pleural</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pneumoniaComplicada" checked={pneumoniaComplicada} onCheckedChange={(checked) => setPneumoniaComplicada(checked as boolean)} />
              <Label htmlFor="pneumoniaComplicada">Pneumonia complicada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="suspeitaAspiracao" checked={suspeitaAspiracao} onCheckedChange={(checked) => setSuspeitaAspiracao(checked as boolean)} />
              <Label htmlFor="suspeitaAspiracao">Suspeita de aspiração</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="suspeitaAtipicos" checked={suspeitaAtipicos} onCheckedChange={(checked) => setSuspeitaAtipicos(checked as boolean)} />
              <Label htmlFor="suspeitaAtipicos">Suspeita de agentes atípicos</Label>
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
          {isCalculating ? 'Calculando...' : 'Avaliar Pneumonia'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Classificação de Gravidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Classificação de Gravidade</span>
                <Badge className={getSeverityColor(results.gravidade)}>
                  {results.gravidade.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium">Idade do paciente</h5>
                  <p className="text-sm text-gray-600">{results.idadeMeses} meses ({Math.round(results.idadeMeses/12 * 10)/10} anos)</p>
                </div>
                <div>
                  <h5 className="font-medium">Referência FR para idade</h5>
                  <p className="text-sm text-gray-600">
                    Normal: {results.frequenciaRespiratoriaReferencia.normal} | 
                    Elevada: {results.frequenciaRespiratoriaReferencia.elevada} | 
                    Alerta: {results.frequenciaRespiratoriaReferencia.alerta}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etiologia Provável */}
          <Card>
            <CardHeader>
              <CardTitle>Etiologia Provável por Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.etiologiaProvavel.map((agente, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{agente}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Necessidade de Internação */}
          {results.necessidadeInternacao.necessitaInternacao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Necessidade de Internação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>INTERNAÇÃO RECOMENDADA</strong> - Critérios presentes:
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {results.necessidadeInternacao.criterios.map((criterio, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{criterio}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Necessidade de UTI */}
          {results.necessidadeUTI.necessitaUTI && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Necessidade de UTI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>UTI RECOMENDADA</strong> - Critérios presentes:
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {results.necessidadeUTI.criterios.map((criterio, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{criterio}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tratamento Ambulatorial */}
          {results.tratamentoAmbulatorial.indicacao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-green-600" />
                  Tratamento Ambulatorial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.tratamentoAmbulatorial.antibioticos.map((antibiotico, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${antibiotico.primeiraLinha ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium flex items-center gap-2">
                            {antibiotico.medicamento}
                            {antibiotico.primeiraLinha && (
                              <Badge className="bg-green-100 text-green-800">1ª linha</Badge>
                            )}
                          </h5>
                          <p className="text-sm text-gray-600">Dose: {antibiotico.dose}</p>
                          <p className="text-sm text-gray-600">Duração: {antibiotico.duracao}</p>
                          {antibiotico.via && (
                            <p className="text-sm text-gray-600">Via: {antibiotico.via}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${antibiotico.medicamento}: ${antibiotico.dose} por ${antibiotico.duracao}`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tratamento Hospitalar */}
          {results.tratamentoHospitalar.indicacao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                  Tratamento Hospitalar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.tratamentoHospitalar.antibioticos.map((antibiotico, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${antibiotico.primeiraLinha ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium flex items-center gap-2">
                            {antibiotico.medicamento}
                            {antibiotico.primeiraLinha && (
                              <Badge className="bg-orange-100 text-orange-800">1ª linha</Badge>
                            )}
                          </h5>
                          <p className="text-sm text-gray-600">Dose: {antibiotico.dose}</p>
                          <p className="text-sm text-gray-600">Duração: {antibiotico.duracao}</p>
                          {antibiotico.via && (
                            <p className="text-sm text-gray-600">Via: {antibiotico.via}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${antibiotico.medicamento}: ${antibiotico.dose} por ${antibiotico.duracao}`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exames Recomendados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Exames Recomendados</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(results.examesRecomendados.join('\n'))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.examesRecomendados.map((exame, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{exame}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PneumoniaCalculator;
