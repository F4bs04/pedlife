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
import { Copy, AlertTriangle, Heart, Zap, Activity, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { paradaCardiorrespiratoriaCalculator } from '@/utils/calculators/parada-cardiorrespiratoria';
import {
  ParadaCardiorrespiratoriaInput,
  ParadaCardiorrespiratoriaResult
} from '@/types/protocol-calculators';

interface ParadaCardiorrespiratoriaCalculatorProps {
  onResultsChange?: (results: ParadaCardiorrespiratoriaResult | null) => void;
}

export const ParadaCardiorrespiratoriaCalculator: React.FC<ParadaCardiorrespiratoriaCalculatorProps> = ({ onResultsChange }) => {
  const [peso, setPeso] = useState<string>('');
  const [idadeAnos, setIdadeAnos] = useState<string>('');
  const [ritmo, setRitmo] = useState<string>('');
  const [socorristas, setSocorristas] = useState<number>(2);
  const [viaAereaAvancada, setViaAereaAvancada] = useState<boolean>(false);
  const [results, setResults] = useState<ParadaCardiorrespiratoriaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const ritmoOptions = [
    { value: 'Assistolia', label: 'Assistolia', chocavel: false },
    { value: 'AESP', label: 'Atividade Elétrica Sem Pulso (AESP)', chocavel: false },
    { value: 'Fibrilacao_Ventricular', label: 'Fibrilação Ventricular (FV)', chocavel: true },
    { value: 'Taquicardia_Ventricular', label: 'Taquicardia Ventricular sem pulso (TV)', chocavel: true }
  ];

  const calculateProtocol = () => {
    if (!peso || !idadeAnos) {
      toast({
        title: "Erro",
        description: "Por favor, preencha peso e idade",
        variant: "destructive"
      });
      return;
    }

    const pesoNum = parseFloat(peso);
    const idadeNum = parseFloat(idadeAnos);

    if (pesoNum <= 0 || idadeNum < 0) {
      toast({
        title: "Erro",
        description: "Peso deve ser maior que zero e idade deve ser maior ou igual a zero",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const input: ParadaCardiorrespiratoriaInput = {
        peso: pesoNum,
        idadeAnos: idadeNum,
        ritmo: ritmo || undefined,
        socorristas,
        viaAereaAvancada
      };

      const calculatedResults = paradaCardiorrespiratoriaCalculator.calcular(input);
      setResults(calculatedResults);
      onResultsChange?.(calculatedResults);
      toast({
        title: "Sucesso",
        description: "Protocolo calculado com sucesso!"
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

  const getRitmoColor = (chocavel?: boolean) => {
    if (chocavel === undefined) return 'bg-gray-100 text-gray-800 border-gray-200';
    return chocavel 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const ritmoSelecionado = ritmoOptions.find(r => r.value === ritmo);

  return (
    <div className="space-y-6">
      {/* Formulário de Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ex: 15.5"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="idade">Idade (anos)</Label>
              <Input
                id="idade"
                type="number"
                value={idadeAnos}
                onChange={(e) => setIdadeAnos(e.target.value)}
                placeholder="Ex: 3"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações da RCP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Configurações da RCP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ritmo">Ritmo Cardíaco (se conhecido)</Label>
            <Select value={ritmo} onValueChange={setRitmo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ritmo" />
              </SelectTrigger>
              <SelectContent>
                {ritmoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      <Badge className={getRitmoColor(option.chocavel)}>
                        {option.chocavel ? 'Chocável' : 'Não chocável'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socorristas">Número de Socorristas</Label>
              <Select value={socorristas.toString()} onValueChange={(value) => setSocorristas(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 socorrista</SelectItem>
                  <SelectItem value="2">2 ou mais socorristas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="viaAereaAvancada"
                checked={viaAereaAvancada}
                onCheckedChange={(checked) => setViaAereaAvancada(checked as boolean)}
              />
              <Label htmlFor="viaAereaAvancada">Via aérea avançada estabelecida</Label>
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
          {isCalculating ? 'Calculando...' : 'Calcular Protocolo'}
        </Button>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Informações do Ritmo */}
          {results.ritmo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Informações do Ritmo</span>
                  <Badge className={getRitmoColor(results.ritmo.chocavel)}>
                    {results.ritmo.chocavel ? 'Chocável' : 'Não chocável'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{results.ritmo.nome}</h4>
                  <p className="text-sm text-gray-600">{results.ritmo.descricao}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium">Características:</h5>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {results.ritmo.caracteristicas.map((caracteristica, index) => (
                      <li key={index}>{caracteristica}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium">Tratamento:</h5>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {results.ritmo.tratamento.map((tratamento, index) => (
                      <li key={index}>{tratamento}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Doses de Medicações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Medicações</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(
                    `Medicações para ${results.peso}kg:\n` +
                    `Adrenalina: ${results.doses.adrenalina.doseMg}mg (${results.doses.adrenalina.doseML}mL)\n` +
                    `Amiodarona: ${results.doses.amiodarona.doseMg}mg\n` +
                    `Lidocaína: ${results.doses.lidocaina.doseMg}mg\n` +
                    `Sulfato de Magnésio: ${results.doses.sulfatoMagnesio.doseMinMg}-${results.doses.sulfatoMagnesio.doseMaxMg}mg\n` +
                    `Bicarbonato: ${results.doses.bicarbonato.doseMEq}mEq (${results.doses.bicarbonato.doseML}mL)`
                  )}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adrenalina */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-red-800">Adrenalina - PRIMEIRA LINHA</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>Dose:</strong> {results.doses.adrenalina.doseMg} mg ({results.doses.adrenalina.doseML} mL)</div>
                  <div><strong>Solução:</strong> {results.doses.adrenalina.solucao}</div>
                  <div><strong>Via:</strong> {results.doses.adrenalina.via}</div>
                  <div><strong>Frequência:</strong> {results.doses.adrenalina.frequencia}</div>
                </div>
                <p className="text-xs text-red-600 mt-2">{results.doses.adrenalina.observacao}</p>
              </div>

              <Separator />

              {/* Antiarrítmicos */}
              <div>
                <h4 className="font-medium mb-3">Antiarrítmicos (FV/TV sem pulso)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h5 className="font-medium text-orange-800">Amiodarona</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div><strong>Dose:</strong> {results.doses.amiodarona.doseMg} mg</div>
                      <div><strong>Via:</strong> {results.doses.amiodarona.via}</div>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">{results.doses.amiodarona.indicacao}</p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-800">Lidocaína (alternativa)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div><strong>Dose:</strong> {results.doses.lidocaina.doseMg} mg</div>
                      <div><strong>Via:</strong> {results.doses.lidocaina.via}</div>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">{results.doses.lidocaina.indicacao}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Medicações Especiais */}
              <div>
                <h4 className="font-medium mb-3">Medicações Especiais</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="font-medium text-purple-800">Sulfato de Magnésio</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div><strong>Dose:</strong> {results.doses.sulfatoMagnesio.doseMinMg}-{results.doses.sulfatoMagnesio.doseMaxMg} mg</div>
                      <div><strong>Via:</strong> {results.doses.sulfatoMagnesio.via}</div>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">{results.doses.sulfatoMagnesio.indicacao}</p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-800">Bicarbonato de Sódio</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div><strong>Dose:</strong> {results.doses.bicarbonato.doseMEq} mEq ({results.doses.bicarbonato.doseML} mL)</div>
                      <div><strong>Solução:</strong> {results.doses.bicarbonato.solucao}</div>
                      <div><strong>Via:</strong> {results.doses.bicarbonato.via}</div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{results.doses.bicarbonato.indicacao}</p>
                    <p className="text-xs text-red-600 mt-1">{results.doses.bicarbonato.observacao}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desfibrilação */}
          {ritmoSelecionado?.chocavel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Desfibrilação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-lg font-bold text-red-700">{results.desfibrilacao.primeiraDose}J</div>
                    <div className="text-sm text-red-600">Primeira dose</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="text-lg font-bold text-orange-700">{results.desfibrilacao.dosesSubsequentes}J</div>
                    <div className="text-sm text-orange-600">Doses subsequentes</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">{results.desfibrilacao.doseMaxima}J</div>
                    <div className="text-sm text-gray-600">Dose máxima</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compressão Torácica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Compressão Torácica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium">Profundidade</h5>
                  <p className="text-sm text-gray-600">{results.compressao.profundidade}</p>
                </div>
                <div>
                  <h5 className="font-medium">Frequência</h5>
                  <p className="text-sm text-gray-600">{results.compressao.frequencia}</p>
                </div>
              </div>
              <div>
                <h5 className="font-medium">Relação Compressão:Ventilação</h5>
                <p className="text-sm text-gray-600">{results.compressao.relacao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Acesso Vascular */}
          <Card>
            <CardHeader>
              <CardTitle>Acesso Vascular</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recomendação:</strong> {results.acesso}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Causas Reversíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Causas Reversíveis (5 Hs e 5 Ts)</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(results.causasReversiveis.join('\n'))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.causasReversiveis.map((causa, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{causa}</span>
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

export default ParadaCardiorrespiratoriaCalculator;
