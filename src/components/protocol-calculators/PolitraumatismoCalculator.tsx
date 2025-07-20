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
import { Copy, AlertTriangle, Activity, Heart, Brain, Eye, MessageCircle, Hand } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { politraumatismoCalculator } from '@/utils/calculators/politraumatismo';
import {
  PolitraumatismoInput,
  PolitraumatismoResult
} from '@/types/protocol-calculators';

interface PolitraumatismoCalculatorProps {
  onResultsChange?: (results: PolitraumatismoResult | null) => void;
}

export const PolitraumatismoCalculator: React.FC<PolitraumatismoCalculatorProps> = ({ onResultsChange }) => {
  const [idadeAnos, setIdadeAnos] = useState<string>('');
  const [idadeMeses, setIdadeMeses] = useState<string>('');
  const [aberturaOlhos, setAberturaOlhos] = useState<string>('4');
  const [respostaVerbal, setRespostaVerbal] = useState<string>('5');
  const [respostaMotora, setRespostaMotora] = useState<string>('6');
  
  // Parâmetros de vias aéreas
  const [respiracaoTrabalhosaRuidosa, setRespiracaoTrabalhosaRuidosa] = useState<boolean>(false);
  const [taquipneia, setTaquipneia] = useState<boolean>(false);
  const [bradipneia, setBradipneia] = useState<boolean>(false);
  const [respiracaoSuperficial, setRespiracaoSuperficial] = useState<boolean>(false);
  const [expansibilidadeReduzida, setExpansibilidadeReduzida] = useState<boolean>(false);
  
  // Parâmetros hemodinâmicos
  const [taquicardia, setTaquicardia] = useState<boolean>(false);
  const [peleFriaUmida, setPeleFriaUmida] = useState<boolean>(false);
  const [bradicardia, setBradicardia] = useState<boolean>(false);
  const [pulsoFinoFracoFiliforme, setPulsoFinoFracoFiliforme] = useState<boolean>(false);
  const [debitoUrinarioReduzidoAusente, setDebitoUrinarioReduzidoAusente] = useState<boolean>(false);
  const [enchimentoCapilarProlongado, setEnchimentoCapilarProlongado] = useState<boolean>(false);
  const [ansiedadeIrritabilidadeConfusaoLetargia, setAnsiedadeIrritabilidadeConfusaoLetargia] = useState<boolean>(false);
  
  const [results, setResults] = useState<PolitraumatismoResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const glasgowOptions = {
    aberturaOlhos: [
      { value: '4', label: 'Espontaneamente (4)' },
      { value: '3', label: 'Ao comando/A fala (3)' },
      { value: '2', label: 'A dor (2)' },
      { value: '1', label: 'Nenhuma resposta (1)' }
    ],
    respostaVerbal: [
      { value: '5', label: 'Orientada/Sorri (5)' },
      { value: '4', label: 'Desorientada/Choro consolável (4)' },
      { value: '3', label: 'Palavra inapropriada/Choro persistente (3)' },
      { value: '2', label: 'Sons incompreensíveis/Agitada (2)' },
      { value: '1', label: 'Nenhuma resposta (1)' }
    ],
    respostaMotora: [
      { value: '6', label: 'Obedece comando/Movimentos normais (6)' },
      { value: '5', label: 'Localiza a dor (5)' },
      { value: '4', label: 'Flexão a dor (4)' },
      { value: '3', label: 'Flexão anormal a dor (3)' },
      { value: '2', label: 'Extensão anormal a dor (2)' },
      { value: '1', label: 'Nenhuma resposta (1)' }
    ]
  };

  const calculateProtocol = () => {
    if (!idadeAnos || !idadeMeses) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a idade em anos e meses",
        variant: "destructive"
      });
      return;
    }

    const idadeAnosNum = parseInt(idadeAnos);
    const idadeMesesNum = parseInt(idadeMeses);

    if (idadeAnosNum < 0 || idadeMesesNum < 0 || idadeMesesNum >= 12) {
      toast({
        title: "Erro",
        description: "Verifique os valores de idade inseridos",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: PolitraumatismoInput = {
        idadeAnos: idadeAnosNum,
        idadeMeses: idadeMesesNum,
        aberturaOlhos: parseInt(aberturaOlhos),
        respostaVerbal: parseInt(respostaVerbal),
        respostaMotora: parseInt(respostaMotora),
        respiracaoTrabalhosaRuidosa,
        taquipneia,
        bradipneia,
        respiracaoSuperficial,
        expansibilidadeReduzida,
        taquicardia,
        peleFriaUmida,
        bradicardia,
        pulsoFinoFracoFiliforme,
        debitoUrinarioReduzidoAusente,
        enchimentoCapilarProlongado,
        ansiedadeIrritabilidadeConfusaoLetargia
      };

      const calculatedResults = politraumatismoCalculator.calcular(input);
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
      case 'Leve': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Grave': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComprometimentoColor = (nivel: string) => {
    switch (nivel) {
      case 'Baixo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dados Básicos do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dados Básicos do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idadeAnos">Idade (anos)</Label>
              <Input
                id="idadeAnos"
                type="number"
                value={idadeAnos}
                onChange={(e) => setIdadeAnos(e.target.value)}
                placeholder="Ex: 5"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="idadeMeses">Meses adicionais</Label>
              <Input
                id="idadeMeses"
                type="number"
                value={idadeMeses}
                onChange={(e) => setIdadeMeses(e.target.value)}
                placeholder="Ex: 6"
                min="0"
                max="11"
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escala de Glasgow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Escala de Coma de Glasgow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="aberturaOlhos" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Abertura dos Olhos
              </Label>
              <Select value={aberturaOlhos} onValueChange={setAberturaOlhos}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {glasgowOptions.aberturaOlhos.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="respostaVerbal" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Resposta Verbal
              </Label>
              <Select value={respostaVerbal} onValueChange={setRespostaVerbal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {glasgowOptions.respostaVerbal.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="respostaMotora" className="flex items-center gap-2">
                <Hand className="h-4 w-4" />
                Resposta Motora
              </Label>
              <Select value={respostaMotora} onValueChange={setRespostaMotora}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {glasgowOptions.respostaMotora.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
            <span className="text-sm font-medium">
              Score atual: {parseInt(aberturaOlhos) + parseInt(respostaVerbal) + parseInt(respostaMotora)}/15
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Avaliação das Vias Aéreas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Avaliação das Vias Aéreas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="respiracaoTrabalhosa" checked={respiracaoTrabalhosaRuidosa} onCheckedChange={(checked) => setRespiracaoTrabalhosaRuidosa(checked as boolean)} />
              <Label htmlFor="respiracaoTrabalhosa">Respiração trabalhosa/ruidosa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="taquipneia" checked={taquipneia} onCheckedChange={(checked) => setTaquipneia(checked as boolean)} />
              <Label htmlFor="taquipneia">Taquipneia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bradipneia" checked={bradipneia} onCheckedChange={(checked) => setBradipneia(checked as boolean)} />
              <Label htmlFor="bradipneia">Bradipneia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="respiracaoSuperficial" checked={respiracaoSuperficial} onCheckedChange={(checked) => setRespiracaoSuperficial(checked as boolean)} />
              <Label htmlFor="respiracaoSuperficial">Respiração superficial</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="expansibilidadeReduzida" checked={expansibilidadeReduzida} onCheckedChange={(checked) => setExpansibilidadeReduzida(checked as boolean)} />
              <Label htmlFor="expansibilidadeReduzida">Expansibilidade reduzida</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliação Hemodinâmica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Avaliação Hemodinâmica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="taquicardia" checked={taquicardia} onCheckedChange={(checked) => setTaquicardia(checked as boolean)} />
              <Label htmlFor="taquicardia">Taquicardia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="peleFriaUmida" checked={peleFriaUmida} onCheckedChange={(checked) => setPeleFriaUmida(checked as boolean)} />
              <Label htmlFor="peleFriaUmida">Pele fria e úmida</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bradicardia" checked={bradicardia} onCheckedChange={(checked) => setBradicardia(checked as boolean)} />
              <Label htmlFor="bradicardia">Bradicardia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pulsoFino" checked={pulsoFinoFracoFiliforme} onCheckedChange={(checked) => setPulsoFinoFracoFiliforme(checked as boolean)} />
              <Label htmlFor="pulsoFino">Pulso fino/fraco/filiforme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="debitoUrinario" checked={debitoUrinarioReduzidoAusente} onCheckedChange={(checked) => setDebitoUrinarioReduzidoAusente(checked as boolean)} />
              <Label htmlFor="debitoUrinario">Débito urinário reduzido ou ausente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="enchimentoCapilar" checked={enchimentoCapilarProlongado} onCheckedChange={(checked) => setEnchimentoCapilarProlongado(checked as boolean)} />
              <Label htmlFor="enchimentoCapilar">Enchimento capilar prolongado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ansiedade" checked={ansiedadeIrritabilidadeConfusaoLetargia} onCheckedChange={(checked) => setAnsiedadeIrritabilidadeConfusaoLetargia(checked as boolean)} />
              <Label htmlFor="ansiedade">Ansiedade/irritabilidade/confusão/letargia</Label>
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
          {isCalculating ? 'Calculando...' : 'Avaliar Politraumatismo'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Score de Glasgow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Escala de Coma de Glasgow</span>
                <Badge className={getSeverityColor(results.glasgow.gravidade)}>
                  {results.glasgow.gravidade.toUpperCase()} ({results.glasgow.scoreTotal}/15)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={results.glasgow.gravidade === 'Grave' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>{results.glasgow.alerta}</strong>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Avaliação das Vias Aéreas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Comprometimento das Vias Aéreas</span>
                <Badge className={getComprometimentoColor(results.viasAereas.nivelComprometimento)}>
                  {results.viasAereas.nivelComprometimento.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.viasAereas.parametros.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Parâmetros identificados:</h5>
                  <div className="space-y-1">
                    {results.viasAereas.parametros.map((param, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">•</Badge>
                        <span className="text-sm">{param}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h5 className="font-medium mb-2">Intervenções recomendadas:</h5>
                <div className="space-y-1">
                  {results.viasAereas.intervencoes.map((intervencao, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-0.5">{index + 1}</Badge>
                      <span className="text-sm">{intervencao}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliação Hemodinâmica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Comprometimento Hemodinâmico</span>
                <Badge className={getComprometimentoColor(results.hemodinamica.nivelComprometimento)}>
                  {results.hemodinamica.nivelComprometimento.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.hemodinamica.parametros.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Parâmetros identificados:</h5>
                  <div className="space-y-1">
                    {results.hemodinamica.parametros.map((param, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">•</Badge>
                        <span className="text-sm">{param}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h5 className="font-medium mb-2">Intervenções recomendadas:</h5>
                <div className="space-y-1">
                  {results.hemodinamica.intervencoes.map((intervencao, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-0.5">{index + 1}</Badge>
                      <span className="text-sm">{intervencao}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Necessidade de UTI */}
          {results.avaliacaoUTI.necessidadeUTI && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Necessidade de UTI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>UTI RECOMENDADA</strong> - Critérios presentes:
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {results.avaliacaoUTI.criterios.map((criterio, index) => (
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

          {/* Protocolo ABCDE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Protocolo ABCDE</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(
                    results.recomendacoesABCDE.map(rec => 
                      `${rec.etapa}:\n${rec.acoes.map(acao => `- ${acao}`).join('\n')}`
                    ).join('\n\n')
                  )}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.recomendacoesABCDE.map((recomendacao, index) => (
                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h5 className="font-medium mb-2">{recomendacao.etapa}</h5>
                  <div className="space-y-1">
                    {recomendacao.acoes.map((acao, acaoIndex) => (
                      <div key={acaoIndex} className="flex items-start gap-2">
                        <Badge variant="outline" className="text-xs mt-0.5">
                          {acaoIndex + 1}
                        </Badge>
                        <span className="text-sm">{acao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PolitraumatismoCalculator;
