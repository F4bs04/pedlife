import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, Clock, Users, Heart, Phone } from "lucide-react";
import { violenciaSexualCalculator } from '@/utils/calculators/violencia-sexual';
import type { ViolenciaSexualInput, ViolenciaSexualResult } from '@/types/protocol-calculators';

const ViolenciaSexualCalculatorComponent: React.FC = () => {
  const [input, setInput] = useState<ViolenciaSexualInput>({
    idade: 0,
    peso: 0,
    altura: 0,
    tempoDesdeOcorrido: 0,
    riscoHIV: false,
    menarca: false
  });

  const [result, setResult] = useState<ViolenciaSexualResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validateInput = (): boolean => {
    const newErrors: string[] = [];

    if (input.idade <= 0) {
      newErrors.push("Idade deve ser maior que 0");
    }
    if (input.peso <= 0) {
      newErrors.push("Peso deve ser maior que 0");
    }
    if (input.tempo_desde_ocorrido < 0) {
      newErrors.push("Tempo desde o ocorrido deve ser maior ou igual a 0");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (validateInput()) {
      const calculationResult = violenciaSexualCalculator.calcular(input);
      setResult(calculationResult);
    }
  };

  const handleSinalFisicoChange = (index: number, checked: boolean) => {
    setInput(prev => ({
      ...prev,
      sinais_fisicos: checked 
        ? [...prev.sinais_fisicos, index]
        : prev.sinais_fisicos.filter(i => i !== index)
    }));
  };

  const handleSinalComportamentalChange = (index: number, checked: boolean) => {
    setInput(prev => ({
      ...prev,
      sinais_comportamentais: checked 
        ? [...prev.sinais_comportamentais, index]
        : prev.sinais_comportamentais.filter(i => i !== index)
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Alto": return "destructive";
      case "Médio": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Avaliação de Violência Sexual
          </CardTitle>
          <CardDescription>
            Protocolo para avaliação e manejo de casos de violência sexual em pediatria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="idade">Idade (anos)</Label>
              <Input
                id="idade"
                type="number"
                placeholder="Ex: 8"
                value={input.idade || ""}
                onChange={(e) => setInput({...input, idade: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                placeholder="Ex: 25.5"
                value={input.peso || ""}
                onChange={(e) => setInput({...input, peso: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="tempo">Tempo desde o ocorrido (horas)</Label>
              <Input
                id="tempo"
                type="number"
                placeholder="Ex: 24"
                value={input.tempo_desde_ocorrido || ""}
                onChange={(e) => setInput({...input, tempo_desde_ocorrido: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>Fatores de risco</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="risco_hiv"
                    checked={input.risco_hiv}
                    onCheckedChange={(checked) => setInput({...input, risco_hiv: checked as boolean})}
                  />
                  <Label htmlFor="risco_hiv" className="text-sm">Risco para HIV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="menarca"
                    checked={input.menarca}
                    onCheckedChange={(checked) => setInput({...input, menarca: checked as boolean})}
                  />
                  <Label htmlFor="menarca" className="text-sm">Pós-menarca</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sinais Físicos */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Sinais Físicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {calculator.getSinaisFisicos().map((sinal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`sinal_fisico_${index}`}
                    checked={input.sinais_fisicos.includes(index)}
                    onCheckedChange={(checked) => handleSinalFisicoChange(index, checked as boolean)}
                  />
                  <Label htmlFor={`sinal_fisico_${index}`} className="text-sm">
                    {sinal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sinais Comportamentais */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sinais Comportamentais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {calculator.getSinaisComportamentais().map((sinal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`sinal_comportamental_${index}`}
                    checked={input.sinais_comportamentais.includes(index)}
                    onCheckedChange={(checked) => handleSinalComportamentalChange(index, checked as boolean)}
                  />
                  <Label htmlFor={`sinal_comportamental_${index}`} className="text-sm">
                    {sinal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Erros */}
          {errors.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleCalculate} className="w-full">
            Avaliar Caso
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Classificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Classificação do Caso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Caso:</span>
                  <Badge variant={result.caso_agudo ? "destructive" : "secondary"}>
                    {result.caso_agudo ? "Agudo (< 72h)" : "Não agudo (≥ 72h)"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Gravidade:</span>
                  <Badge variant={getSeverityColor(result.nivel_gravidade)}>
                    {result.nivel_gravidade}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Faixa etária:</span>
                  <Badge variant="outline">
                    {result.eh_adolescente ? "Adolescente (≥ 12 anos)" : "Criança (< 12 anos)"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sinais Identificados */}
          {(result.sinais_fisicos_presentes.length > 0 || result.sinais_comportamentais_presentes.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Sinais Identificados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.sinais_fisicos_presentes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sinais Físicos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sinais_fisicos_presentes.map((sinal, index) => (
                        <Badge key={index} variant="outline">
                          {sinal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.sinais_comportamentais_presentes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sinais Comportamentais:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sinais_comportamentais_presentes.map((sinal, index) => (
                        <Badge key={index} variant="outline">
                          {sinal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notificações Obrigatórias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Notificações Obrigatórias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recomendacoes_notificacao.map((recomendacao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    {recomendacao}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Profilaxias */}
          {result.recomendacoes_medicamentos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Profilaxias Recomendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.indicacao_profilaxia_ist && (
                    <Alert>
                      <AlertDescription>
                        <strong>Profilaxia para ISTs indicada</strong> (caso agudo)
                      </AlertDescription>
                    </Alert>
                  )}
                  {result.indicacao_profilaxia_hiv && (
                    <Alert>
                      <AlertDescription>
                        <strong>Profilaxia para HIV indicada</strong> (caso agudo com fator de risco)
                      </AlertDescription>
                    </Alert>
                  )}
                  {result.indicacao_contracepcao && (
                    <Alert>
                      <AlertDescription>
                        <strong>Contracepção de emergência indicada</strong> (adolescente pós-menarca)
                      </AlertDescription>
                    </Alert>
                  )}
                  <ul className="space-y-2">
                    {result.recomendacoes_medicamentos.map((medicamento, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        {medicamento}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recomendações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendações de Manejo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    {recomendacao}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Encaminhamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Encaminhamentos Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.encaminhamentos.map((encaminhamento, index) => (
                  <Badge key={index} variant="secondary">
                    {encaminhamento}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViolenciaSexualCalculatorComponent;
