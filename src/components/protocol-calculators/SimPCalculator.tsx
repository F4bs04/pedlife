import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Copy, AlertTriangle, Activity, Heart, Stethoscope, Users, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { simPCalculator } from '@/utils/calculators/sim-p';
import {
  SimPInput,
  SimPResult
} from '@/types/protocol-calculators';

interface SimPCalculatorProps {
  onResultsChange?: (results: SimPResult | null) => void;
}

export const SimPCalculator: React.FC<SimPCalculatorProps> = ({ onResultsChange }) => {
  const [idadeAnos, setIdadeAnos] = useState<string>('');
  
  // Critérios OMS
  const [febre3Dias, setFebre3Dias] = useState<boolean>(false);
  const [erupcaoConjuntivite, setErupcaoConjuntivite] = useState<boolean>(false);
  const [hipotensaoChoque, setHipotensaoChoque] = useState<boolean>(false);
  const [disfuncaoCardiaca, setDisfuncaoCardiaca] = useState<boolean>(false);
  const [coagulopatia, setCoagulopatia] = useState<boolean>(false);
  const [manifestacoesGI, setManifestacoesGI] = useState<boolean>(false);
  const [marcadoresInflamacao, setMarcadoresInflamacao] = useState<boolean>(false);
  const [semCausaMicrobiana, setSemCausaMicrobiana] = useState<boolean>(false);
  const [evidenciaCovid, setEvidenciaCovid] = useState<boolean>(false);
  
  // Critérios CDC
  const [febre24h, setFebre24h] = useState<boolean>(false);
  const [inflamacaoLab, setInflamacaoLab] = useState<boolean>(false);
  const [doencaGrave, setDoencaGrave] = useState<boolean>(false);
  const [sistemaCardiaco, setSistemaCardiaco] = useState<boolean>(false);
  const [sistemaRenal, setSistemaRenal] = useState<boolean>(false);
  const [sistemaRespiratorio, setSistemaRespiratorio] = useState<boolean>(false);
  const [sistemaHematologico, setSistemaHematologico] = useState<boolean>(false);
  const [sistemaGastrointestinal, setSistemaGastrointestinal] = useState<boolean>(false);
  const [sistemaDermatologico, setSistemaDermatologico] = useState<boolean>(false);
  const [sistemaNeurologico, setSistemaNeurologico] = useState<boolean>(false);
  const [semDiagnosticoAlternativo, setSemDiagnosticoAlternativo] = useState<boolean>(false);
  
  // Critérios de gravidade
  const [hipotensaoChoqueRefratario, setHipotensaoChoqueRefratario] = useState<boolean>(false);
  const [disfuncaoMiocardica, setDisfuncaoMiocardica] = useState<boolean>(false);
  const [arritmias, setArritmias] = useState<boolean>(false);
  const [aneurismasCoronarianos, setAneurismasCoronarianos] = useState<boolean>(false);
  const [alteracaoNeurologica, setAlteracaoNeurologica] = useState<boolean>(false);
  const [insuficienciaRespiratoria, setInsuficienciaRespiratoria] = useState<boolean>(false);
  const [insuficienciaRenal, setInsuficienciaRenal] = useState<boolean>(false);
  const [coagulopatiaSignificativa, setCoagulopatiaSignificativa] = useState<boolean>(false);
  
  const [results, setResults] = useState<SimPResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateProtocol = () => {
    if (!idadeAnos) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a idade do paciente",
        variant: "destructive"
      });
      return;
    }

    const idadeAnosNum = parseInt(idadeAnos);

    if (idadeAnosNum < 0 || idadeAnosNum > 25) {
      toast({
        title: "Erro",
        description: "Idade deve estar entre 0 e 25 anos",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: SimPInput = {
        idadeAnos: idadeAnosNum,
        febre3Dias,
        erupcaoConjuntivite,
        hipotensaoChoque,
        disfuncaoCardiaca,
        coagulopatia,
        manifestacoesGI,
        marcadoresInflamacao,
        semCausaMicrobiana,
        evidenciaCovid,
        febre24h,
        inflamacaoLab,
        doencaGrave,
        sistemaCardiaco,
        sistemaRenal,
        sistemaRespiratorio,
        sistemaHematologico,
        sistemaGastrointestinal,
        sistemaDermatologico,
        sistemaNeurologico,
        semDiagnosticoAlternativo,
        hipotensaoChoqueRefratario,
        disfuncaoMiocardica,
        arritmias,
        aneurismasCoronarianos,
        alteracaoNeurologica,
        insuficienciaRespiratoria,
        insuficienciaRenal,
        coagulopatiaSignificativa
      };

      const calculatedResults = simPCalculator.calcular(input);
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
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Grave': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (atendeCriterios: boolean) => {
    return atendeCriterios 
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Dados Básicos do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dados Básicos do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="idadeAnos">Idade (anos)</Label>
            <Input
              id="idadeAnos"
              type="number"
              value={idadeAnos}
              onChange={(e) => setIdadeAnos(e.target.value)}
              placeholder="Ex: 8"
              min="0"
              max="25"
              step="1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Critérios Diagnósticos da OMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Critérios Diagnósticos da OMS
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Para SIM-P: idade 0-19 anos, febre ≥3 dias, ≥2 critérios adicionais, marcadores de inflamação, ausência de causa microbiana, evidência de COVID-19
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="febre3Dias" checked={febre3Dias} onCheckedChange={(checked) => setFebre3Dias(checked as boolean)} />
              <Label htmlFor="febre3Dias">Febre ≥ 3 dias</Label>
            </div>
            
            <div className="ml-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Critérios adicionais (necessários ≥2):</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="erupcaoConjuntivite" checked={erupcaoConjuntivite} onCheckedChange={(checked) => setErupcaoConjuntivite(checked as boolean)} />
                  <Label htmlFor="erupcaoConjuntivite" className="text-sm">Erupção cutânea ou conjuntivite bilateral ou sinais mucocutâneos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hipotensaoChoque" checked={hipotensaoChoque} onCheckedChange={(checked) => setHipotensaoChoque(checked as boolean)} />
                  <Label htmlFor="hipotensaoChoque" className="text-sm">Hipotensão ou choque</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disfuncaoCardiaca" checked={disfuncaoCardiaca} onCheckedChange={(checked) => setDisfuncaoCardiaca(checked as boolean)} />
                  <Label htmlFor="disfuncaoCardiaca" className="text-sm">Disfunção miocárdica, pericardite, valvulite ou anormalidades coronárias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="coagulopatia" checked={coagulopatia} onCheckedChange={(checked) => setCoagulopatia(checked as boolean)} />
                  <Label htmlFor="coagulopatia" className="text-sm">Coagulopatia (TP↑, TTPa↑, D-dímero↑)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manifestacoesGI" checked={manifestacoesGI} onCheckedChange={(checked) => setManifestacoesGI(checked as boolean)} />
                  <Label htmlFor="manifestacoesGI" className="text-sm">Manifestações GI agudas (diarreia, vômitos, dor abdominal)</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="marcadoresInflamacao" checked={marcadoresInflamacao} onCheckedChange={(checked) => setMarcadoresInflamacao(checked as boolean)} />
              <Label htmlFor="marcadoresInflamacao">Marcadores de inflamação elevados (VHS, PCR, procalcitonina)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="semCausaMicrobiana" checked={semCausaMicrobiana} onCheckedChange={(checked) => setSemCausaMicrobiana(checked as boolean)} />
              <Label htmlFor="semCausaMicrobiana">Nenhuma causa microbiana óbvia de inflamação</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="evidenciaCovidOMS" checked={evidenciaCovid} onCheckedChange={(checked) => setEvidenciaCovid(checked as boolean)} />
              <Label htmlFor="evidenciaCovidOMS">Evidência de COVID-19 (RT-PCR, antígeno, sorologia +) ou contato provável</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critérios Diagnósticos do CDC */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Critérios Diagnósticos do CDC
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Para SIM-P: idade &lt;21 anos, febre ≥24h, inflamação laboratorial, doença grave, envolvimento multissistêmico (≥2), ausência de diagnósticos alternativos, evidência COVID-19
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="febre24h" checked={febre24h} onCheckedChange={(checked) => setFebre24h(checked as boolean)} />
              <Label htmlFor="febre24h">Febre &gt;38°C por ≥24h ou febre subjetiva persistente ≥24h</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="inflamacaoLab" checked={inflamacaoLab} onCheckedChange={(checked) => setInflamacaoLab(checked as boolean)} />
              <Label htmlFor="inflamacaoLab">Evidência laboratorial de inflamação</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="doencaGrave" checked={doencaGrave} onCheckedChange={(checked) => setDoencaGrave(checked as boolean)} />
              <Label htmlFor="doencaGrave">Doença clinicamente grave que requer hospitalização</Label>
            </div>
            
            <div className="ml-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Envolvimento multissistêmico (necessários ≥2 sistemas):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaCardiaco" checked={sistemaCardiaco} onCheckedChange={(checked) => setSistemaCardiaco(checked as boolean)} />
                  <Label htmlFor="sistemaCardiaco" className="text-sm">Cardíaco</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaRenal" checked={sistemaRenal} onCheckedChange={(checked) => setSistemaRenal(checked as boolean)} />
                  <Label htmlFor="sistemaRenal" className="text-sm">Renal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaRespiratorio" checked={sistemaRespiratorio} onCheckedChange={(checked) => setSistemaRespiratorio(checked as boolean)} />
                  <Label htmlFor="sistemaRespiratorio" className="text-sm">Respiratório</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaHematologico" checked={sistemaHematologico} onCheckedChange={(checked) => setSistemaHematologico(checked as boolean)} />
                  <Label htmlFor="sistemaHematologico" className="text-sm">Hematológico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaGastrointestinal" checked={sistemaGastrointestinal} onCheckedChange={(checked) => setSistemaGastrointestinal(checked as boolean)} />
                  <Label htmlFor="sistemaGastrointestinal" className="text-sm">Gastrointestinal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaDermatologico" checked={sistemaDermatologico} onCheckedChange={(checked) => setSistemaDermatologico(checked as boolean)} />
                  <Label htmlFor="sistemaDermatologico" className="text-sm">Dermatológico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sistemaNeurologico" checked={sistemaNeurologico} onCheckedChange={(checked) => setSistemaNeurologico(checked as boolean)} />
                  <Label htmlFor="sistemaNeurologico" className="text-sm">Neurológico</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="semDiagnosticoAlternativo" checked={semDiagnosticoAlternativo} onCheckedChange={(checked) => setSemDiagnosticoAlternativo(checked as boolean)} />
              <Label htmlFor="semDiagnosticoAlternativo">Ausência de diagnósticos alternativos plausíveis</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critérios de Gravidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critérios de Gravidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="hipotensaoChoqueRefratario" checked={hipotensaoChoqueRefratario} onCheckedChange={(checked) => setHipotensaoChoqueRefratario(checked as boolean)} />
              <Label htmlFor="hipotensaoChoqueRefratario" className="text-sm">Hipotensão/choque refratário a volume</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="disfuncaoMiocardica" checked={disfuncaoMiocardica} onCheckedChange={(checked) => setDisfuncaoMiocardica(checked as boolean)} />
              <Label htmlFor="disfuncaoMiocardica" className="text-sm">Disfunção miocárdica (FE &lt; 55%)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="arritmias" checked={arritmias} onCheckedChange={(checked) => setArritmias(checked as boolean)} />
              <Label htmlFor="arritmias" className="text-sm">Arritmias</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="aneurismasCoronarianos" checked={aneurismasCoronarianos} onCheckedChange={(checked) => setAneurismasCoronarianos(checked as boolean)} />
              <Label htmlFor="aneurismasCoronarianos" className="text-sm">Aneurismas coronarianos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alteracaoNeurologica" checked={alteracaoNeurologica} onCheckedChange={(checked) => setAlteracaoNeurologica(checked as boolean)} />
              <Label htmlFor="alteracaoNeurologica" className="text-sm">Alteração neurológica significativa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="insuficienciaRespiratoria" checked={insuficienciaRespiratoria} onCheckedChange={(checked) => setInsuficienciaRespiratoria(checked as boolean)} />
              <Label htmlFor="insuficienciaRespiratoria" className="text-sm">Insuficiência respiratória</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="insuficienciaRenal" checked={insuficienciaRenal} onCheckedChange={(checked) => setInsuficienciaRenal(checked as boolean)} />
              <Label htmlFor="insuficienciaRenal" className="text-sm">Insuficiência renal aguda</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="coagulopatiaSignificativa" checked={coagulopatiaSignificativa} onCheckedChange={(checked) => setCoagulopatiaSignificativa(checked as boolean)} />
              <Label htmlFor="coagulopatiaSignificativa" className="text-sm">Coagulopatia significativa</Label>
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
          {isCalculating ? 'Calculando...' : 'Avaliar SIM-P'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Avaliação OMS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Critérios OMS</span>
                <Badge className={getStatusColor(results.avaliacaoOMS.atendecriterios)}>
                  {results.avaliacaoOMS.atendecriterios ? 'ATENDE CRITÉRIOS' : 'NÃO ATENDE'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoOMS.idadeOk ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoOMS.idadeOk ? "✓" : "✗"}
                  </Badge>
                  <span>Idade 0-19 anos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoOMS.febre3Dias ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoOMS.febre3Dias ? "✓" : "✗"}
                  </Badge>
                  <span>Febre ≥3 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoOMS.criteriosAdicionaisOk ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoOMS.criteriosAdicionaisOk ? "✓" : "✗"}
                  </Badge>
                  <span>Critérios adicionais ({results.avaliacaoOMS.numCriteriosAdicionais}/5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoOMS.marcadoresInflamacao ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoOMS.marcadoresInflamacao ? "✓" : "✗"}
                  </Badge>
                  <span>Marcadores inflamação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoOMS.semCausaMicrobiana ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoOMS.semCausaMicrobiana ? "✓" : "✗"}
                  </Badge>
                  <span>Sem causa microbiana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoOMS.evidenciaCovid ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoOMS.evidenciaCovid ? "✓" : "✗"}
                  </Badge>
                  <span>Evidência COVID-19</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliação CDC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Critérios CDC</span>
                <Badge className={getStatusColor(results.avaliacaoCDC.atendecriterios)}>
                  {results.avaliacaoCDC.atendecriterios ? 'ATENDE CRITÉRIOS' : 'NÃO ATENDE'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoCDC.idadeOk ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoCDC.idadeOk ? "✓" : "✗"}
                  </Badge>
                  <span>Idade &lt;21 anos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoCDC.febre24h ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoCDC.febre24h ? "✓" : "✗"}
                  </Badge>
                  <span>Febre ≥24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoCDC.inflamacaoLab ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoCDC.inflamacaoLab ? "✓" : "✗"}
                  </Badge>
                  <span>Inflamação laboratorial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoCDC.doencaGrave ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoCDC.doencaGrave ? "✓" : "✗"}
                  </Badge>
                  <span>Doença grave</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoCDC.sistemasOk ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoCDC.sistemasOk ? "✓" : "✗"}
                  </Badge>
                  <span>Multissistêmico ({results.avaliacaoCDC.numSistemas}/7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={results.avaliacaoCDC.semDiagnosticoAlternativo ? "default" : "secondary"} className="text-xs">
                    {results.avaliacaoCDC.semDiagnosticoAlternativo ? "✓" : "✗"}
                  </Badge>
                  <span>Sem diagnóstico alternativo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliação de Gravidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Avaliação de Gravidade</span>
                <Badge className={getSeverityColor(results.avaliacaoGravidade.gravidade)}>
                  {results.avaliacaoGravidade.gravidade.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Critérios de gravidade presentes: {results.avaliacaoGravidade.numCriteriosGravidade}/8
              </p>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recomendações de Manejo</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(results.recomendacoes.join('\n'))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.recomendacoes.map((recomendacao, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs mt-0.5 flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{recomendacao}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimPCalculator;
