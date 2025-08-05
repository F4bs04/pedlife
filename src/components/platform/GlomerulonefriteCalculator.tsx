import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Activity, Heart, Stethoscope, Info, Copy } from 'lucide-react';
import { glomerulonefriteCalculator } from '@/utils/calculators/glomerulonefrite';
import { toast } from '@/components/ui/use-toast';
import type { 
  GlomerulonefriteInput, 
  GlomerulonefriteResult 
} from '@/types/protocol-calculators';

const GlomerulonefriteCalculator: React.FC = () => {
  const [formData, setFormData] = useState<GlomerulonefriteInput>({
    peso: 0,
    idadeAnos: 0,
    idadeMeses: 0,
    sintomas: {
      oliguria: false,
      edemaFacial: false,
      edemaGeneralizado: false,
      dorLombar: false,
      hipertensao: false,
      hipertensaoGrave: false,
      hematuriaMacroscopica: false,
      hematuriaMicroscopica: false,
      proteinuria: false,
      nauseasVomitos: false,
      palidez: false,
      nicturia: false
    },
    complicacoes: {
      insuficienciaCardiaca: false,
      encefalopatiaHipertensiva: false,
      insuficienciaRenal: false,
      uremiaImportante: false,
      sobrecargaVolemica: false
    },
    examesAlterados: [],
    antibioticoEscolhido: "Penicilina Benzatina",
      antiHipertensivoEscolhido: "none"
  });

  const [resultado, setResultado] = useState<GlomerulonefriteResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: keyof GlomerulonefriteInput, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSintomaChange = (sintoma: keyof GlomerulonefriteInput['sintomas'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sintomas: {
        ...prev.sintomas,
        [sintoma]: checked
      }
    }));
  };

  const handleComplicacaoChange = (complicacao: keyof GlomerulonefriteInput['complicacoes'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      complicacoes: {
        ...prev.complicacoes,
        [complicacao]: checked
      }
    }));
  };

  const handleExameChange = (exame: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      examesAlterados: checked 
        ? [...prev.examesAlterados, exame]
        : prev.examesAlterados.filter(e => e !== exame)
    }));
  };

  const handleCalculate = () => {
    if (formData.peso <= 0 || formData.idadeAnos < 0) {
      toast({
        title: "Erro",
        description: "Por favor, verifique os dados inseridos",
        variant: "destructive"
      });
      return;
    }

    const resultado = glomerulonefriteCalculator.calcular(formData);
    setResultado(resultado);
    setShowResult(true);

    toast({
      title: "Sucesso",
      description: "Avaliação realizada com sucesso!"
    });
  };

  const handleReset = () => {
    setFormData({
      peso: 0,
      idadeAnos: 0,
      idadeMeses: 0,
      sintomas: {
        oliguria: false,
        edemaFacial: false,
        edemaGeneralizado: false,
        dorLombar: false,
        hipertensao: false,
        hipertensaoGrave: false,
        hematuriaMacroscopica: false,
        hematuriaMicroscopica: false,
        proteinuria: false,
        nauseasVomitos: false,
        palidez: false,
        nicturia: false
      },
      complicacoes: {
        insuficienciaCardiaca: false,
        encefalopatiaHipertensiva: false,
        insuficienciaRenal: false,
        uremiaImportante: false,
        sobrecargaVolemica: false
      },
      examesAlterados: [],
      antibioticoEscolhido: "Penicilina Benzatina",
      antiHipertensivoEscolhido: "none"
    });
    setResultado(null);
    setShowResult(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Informação copiada para a área de transferência!"
    });
  };

  const sintomasOptions = [
    { key: 'oliguria', label: 'Oligúria' },
    { key: 'edemaFacial', label: 'Edema facial/periorbitário' },
    { key: 'edemaGeneralizado', label: 'Edema generalizado' },
    { key: 'dorLombar', label: 'Dor lombar' },
    { key: 'hipertensao', label: 'Hipertensão arterial' },
    { key: 'hipertensaoGrave', label: 'Hipertensão grave/de difícil controle' },
    { key: 'hematuriaMacroscopica', label: 'Hematúria macroscópica' },
    { key: 'hematuriaMicroscopica', label: 'Hematúria microscópica' },
    { key: 'proteinuria', label: 'Proteinúria' },
    { key: 'nauseasVomitos', label: 'Náuseas/vômitos' },
    { key: 'palidez', label: 'Palidez cutânea' },
    { key: 'nicturia', label: 'Nictúria' }
  ];

  const complicacoesOptions = [
    { key: 'insuficienciaCardiaca', label: 'Insuficiência cardíaca congestiva' },
    { key: 'encefalopatiaHipertensiva', label: 'Encefalopatia hipertensiva' },
    { key: 'insuficienciaRenal', label: 'Insuficiência renal aguda' },
    { key: 'uremiaImportante', label: 'Uremia importante' },
    { key: 'sobrecargaVolemica', label: 'Sobrecarga volêmica importante' }
  ];

  const examesOptions = [
    'Urina rotina alterada',
    'Cultura de urina positiva',
    'Hemograma alterado',
    'Ureia elevada',
    'Creatinina elevada',
    'Eletrólitos alterados',
    'Complemento sérico baixo (C3, CH50)',
    'ASLO elevado',
    'Proteína C reativa elevada',
    'Ultrassom renal alterado'
  ];

  const antibioticosOptions = [
    'Penicilina Benzatina',
    'Penicilina V',
    'Amoxicilina',
    'Eritromicina'
  ];

  const antiHipertensivosOptions = [
    'Furosemida',
    'Hidroclorotiazida',
    'Hidralazina',
    'Captopril',
    'Nifedipina',
    'Propranolol',
    'Metildopa'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-purple-600" />
            Calculadora - Glomerulonefrite
          </CardTitle>
          <CardDescription>
            Avaliação diagnóstica e tratamento da glomerulonefrite aguda em pediatria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="idadeAnos">Idade (anos)</Label>
              <Input
                id="idadeAnos"
                type="number"
                min="0"
                value={formData.idadeAnos || ''}
                onChange={(e) => handleInputChange('idadeAnos', parseInt(e.target.value) || 0)}
                placeholder="Ex: 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idadeMeses">Meses adicionais</Label>
              <Input
                id="idadeMeses"
                type="number"
                min="0"
                max="11"
                value={formData.idadeMeses || ''}
                onChange={(e) => handleInputChange('idadeMeses', parseInt(e.target.value) || 0)}
                placeholder="Ex: 6"
              />
            </div>
          </div>

          <Separator />

          {/* Sintomas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Sintomas Presentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sintomasOptions.map((sintoma) => (
                <div key={sintoma.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={sintoma.key}
                    checked={formData.sintomas[sintoma.key as keyof typeof formData.sintomas]}
                    onCheckedChange={(checked) => handleSintomaChange(sintoma.key as keyof typeof formData.sintomas, checked as boolean)}
                  />
                  <Label htmlFor={sintoma.key} className="text-sm">{sintoma.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Complicações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Complicações
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {complicacoesOptions.map((complicacao) => (
                <div key={complicacao.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={complicacao.key}
                    checked={formData.complicacoes[complicacao.key as keyof typeof formData.complicacoes]}
                    onCheckedChange={(checked) => handleComplicacaoChange(complicacao.key as keyof typeof formData.complicacoes, checked as boolean)}
                  />
                  <Label htmlFor={complicacao.key} className="text-sm">{complicacao.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Exames Alterados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exames Alterados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examesOptions.map((exame) => (
                <div key={exame} className="flex items-center space-x-2">
                  <Checkbox
                    id={exame}
                    checked={formData.examesAlterados.includes(exame)}
                    onCheckedChange={(checked) => handleExameChange(exame, checked as boolean)}
                  />
                  <Label htmlFor={exame} className="text-sm">{exame}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Medicações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="antibiotico">Antibiótico de Escolha</Label>
              <Select
                value={formData.antibioticoEscolhido}
                onValueChange={(value) => handleInputChange('antibioticoEscolhido', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o antibiótico" />
                </SelectTrigger>
                <SelectContent>
                  {antibioticosOptions.map((antibiotico) => (
                    <SelectItem key={antibiotico} value={antibiotico}>
                      {antibiotico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anti-hipertensivo">Anti-hipertensivo (se necessário)</Label>
              <Select
                value={formData.antiHipertensivoEscolhido}
                onValueChange={(value) => handleInputChange('antiHipertensivoEscolhido', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o anti-hipertensivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {antiHipertensivosOptions.map((medicamento) => (
                    <SelectItem key={medicamento} value={medicamento}>
                      {medicamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              Avaliar Paciente
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
          </div>

          {/* Resultados */}
          {showResult && resultado && (
            <div className="space-y-4 pt-6">
              <Separator />
              <h3 className="text-xl font-semibold">Resultado da Avaliação</h3>
              
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Diagnóstico Provável</Label>
                    <Badge variant={resultado.diagnosticoProvavel ? "default" : "secondary"}>
                      {resultado.diagnosticoProvavel ? "Glomerulonefrite" : "Pouco Provável"}
                    </Badge>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Necessita Internação</Label>
                    <Badge variant={resultado.necessitaInternacao ? "destructive" : "outline"}>
                      {resultado.necessitaInternacao ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Anti-hipertensivo</Label>
                    <Badge variant={resultado.necessitaAntiHipertensivo ? "default" : "outline"}>
                      {resultado.necessitaAntiHipertensivo ? "Necessário" : "Não Necessário"}
                    </Badge>
                  </div>
                </Card>
              </div>

              {/* Sintomas Presentes */}
              {resultado.sintomasPresentes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sintomas Identificados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resultado.sintomasPresentes.map((sintoma, index) => (
                        <Badge key={index} variant="outline">{sintoma}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Critérios de Internação */}
              {resultado.criteriosInternacao.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <strong>Critérios de Internação Presentes:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {resultado.criteriosInternacao.map((criterio, index) => (
                        <li key={index} className="text-sm">{criterio}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Antibiótico */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Antibioticoterapia
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(
                        `${resultado.antibiotico.nome}: ${resultado.antibiotico.dose} ${resultado.antibiotico.via} ${resultado.antibiotico.frequencia}`
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div><strong>Medicamento:</strong> {resultado.antibiotico.nome}</div>
                    <div><strong>Dose:</strong> {resultado.antibiotico.dose}</div>
                    <div><strong>Via:</strong> {resultado.antibiotico.via}</div>
                    <div><strong>Frequência:</strong> {resultado.antibiotico.frequencia}</div>
                    {resultado.antibiotico.doseTotal && (
                      <div><strong>Dose Total Diária:</strong> {resultado.antibiotico.doseTotal}</div>
                    )}
                    {resultado.antibiotico.observacao && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>{resultado.antibiotico.observacao}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Anti-hipertensivo */}
              {resultado.antiHipertensivo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Anti-hipertensivo
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(
                          `${resultado.antiHipertensivo!.nome}: ${resultado.antiHipertensivo!.doseMin}-${resultado.antiHipertensivo!.doseMax} ${resultado.antiHipertensivo!.via} ${resultado.antiHipertensivo!.frequencia}`
                        )}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Medicamento:</strong> {resultado.antiHipertensivo.nome}</div>
                      <div><strong>Dose:</strong> {resultado.antiHipertensivo.doseMin} - {resultado.antiHipertensivo.doseMax}</div>
                      <div><strong>Via:</strong> {resultado.antiHipertensivo.via}</div>
                      <div><strong>Frequência:</strong> {resultado.antiHipertensivo.frequencia}</div>
                      {resultado.antiHipertensivo.observacao && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>{resultado.antiHipertensivo.observacao}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Exames Recomendados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exames Recomendados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.examesRecomendados.map((exame, index) => (
                      <li key={index}>{exame}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Medidas Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medidas Gerais de Tratamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.medidasGerais.map((medida, index) => (
                      <li key={index}>{medida}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Seguimento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recomendações de Seguimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {resultado.recomendacoesSeguimento.map((recomendacao, index) => (
                      <li key={index}>{recomendacao}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Critérios de Alta */}
              {resultado.criteriosAlta.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Critérios de Alta Hospitalar</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default GlomerulonefriteCalculator;
