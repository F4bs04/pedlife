import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { erisipelaCalculator } from '../../../utils/calculators/erisipela';
import type { ErisipelaInput, ErisipelaResult, ErisipelaCalculatedDose } from '../../../types/protocol-calculators';

const ErisipelaCalculator: React.FC = () => {
  const [input, setInput] = useState<ErisipelaInput>({
    peso: 0,
    lesoesExtensas: false,
    sintomasSystemicos: false,
    comorbidades: false,
    sinaisSepse: false,
    celuliteExtensa: false,
    abscessos: false,
    imunossupressao: false
  });
  
  const [resultado, setResultado] = useState<ErisipelaResult | null>(null);
  const [erros, setErros] = useState<string[]>([]);

  const validarInput = (): boolean => {
    const novosErros: string[] = [];
    
    if (!input.peso || input.peso <= 0) {
      novosErros.push('Peso deve ser maior que 0');
    }
    
    setErros(novosErros);
    return novosErros.length === 0;
  };

  const calcular = () => {
    if (!validarInput()) return;
    
    try {
      const resultado = erisipelaCalculator.calcular(input);
      setResultado(resultado);
    } catch (error) {
      setErros(['Erro no cálculo. Verifique os dados inseridos.']);
    }
  };

  const formatarDose = (dose: ErisipelaCalculatedDose): string => {
    if (dose.doseDiaMin && dose.doseDiaMax) {
      return `${dose.doseDiaMin} - ${dose.doseDiaMax} ${dose.unidade}/dia (${dose.doseUnitariaMin} - ${dose.doseUnitariaMax} ${dose.unidade} por dose)`;
    } else if (dose.doseDia) {
      return `${dose.doseDia} ${dose.unidade}/dia (${dose.doseUnitaria} ${dose.unidade} por dose)`;
    }
    return '';
  };

  const fatoresPortaEntrada = erisipelaCalculator.getFatoresPortaEntrada();
  const caracteristicasClinicas = erisipelaCalculator.getCaracteristicasClinicas();

  return (
    <div className="space-y-6">
      {/* Informações Clínicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">
            Informações sobre Erisipela
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Fatores de Porta de Entrada:</h4>
            <div className="flex flex-wrap gap-2">
              {fatoresPortaEntrada.map((fator, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {fator}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Características Clínicas:</h4>
            <div className="flex flex-wrap gap-2">
              {caracteristicasClinicas.map((caracteristica, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {caracteristica}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Input */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Peso (kg) *
            </label>
            <Input
              type="number"
              placeholder="Ex: 15"
              value={input.peso || ''}
              onChange={(e) => setInput(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Critérios de Internação:</h4>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.lesoesExtensas}
                  onChange={(e) => setInput(prev => ({ ...prev, lesoesExtensas: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Lesões extensas</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.sintomasSystemicos}
                  onChange={(e) => setInput(prev => ({ ...prev, sintomasSystemicos: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Sintomas sistêmicos (febre, mal-estar)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.comorbidades}
                  onChange={(e) => setInput(prev => ({ ...prev, comorbidades: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Comorbidades significativas</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.sinaisSepse}
                  onChange={(e) => setInput(prev => ({ ...prev, sinaisSepse: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Sinais de sepse</span>
              </label>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Complicações:</h4>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.celuliteExtensa}
                  onChange={(e) => setInput(prev => ({ ...prev, celuliteExtensa: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Celulite extensa</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.abscessos}
                  onChange={(e) => setInput(prev => ({ ...prev, abscessos: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Abscessos</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={input.imunossupressao}
                  onChange={(e) => setInput(prev => ({ ...prev, imunossupressao: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Imunossupressão</span>
              </label>
            </div>
          </div>

          {erros.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <ul className="list-disc list-inside">
                  {erros.map((erro, index) => (
                    <li key={index}>{erro}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={calcular} className="w-full">
            Calcular Tratamento
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Resultado do Cálculo
              <Badge 
                variant={resultado.necessitaInternacao ? "destructive" : "secondary"}
                className="text-sm"
              >
                {resultado.necessitaInternacao ? 'Internação' : 'Ambulatorial'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tratamento Principal */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Medicamento Recomendado:</h4>
              <p className="text-blue-700 font-medium text-lg">{resultado.medicamentoRecomendado}</p>
              <p className="text-blue-600 text-sm mt-1">
                {formatarDose(resultado.dosesMedicamentoPrincipal)}
              </p>
            </div>

            {/* Medicamento Secundário */}
            {resultado.medicamentoSecundario && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Medicamento Adicional:</h4>
                <p className="text-orange-700 font-medium">{resultado.medicamentoSecundario}</p>
                {resultado.dosesMedicamentoSecundario && (
                  <p className="text-orange-600 text-sm mt-1">
                    {formatarDose(resultado.dosesMedicamentoSecundario)}
                  </p>
                )}
                <p className="text-orange-600 text-xs mt-1 italic">
                  Usar em conjunto com o medicamento principal
                </p>
              </div>
            )}

            {/* Complicações */}
            {resultado.complicacoes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-700">Complicações Identificadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {resultado.complicacoes.map((complicacao, index) => (
                    <Badge key={index} variant="destructive" className="text-sm">
                      {complicacao}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendações */}
            <div>
              <h4 className="font-semibold mb-2">Recomendações de Manejo:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {resultado.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="text-gray-700">{recomendacao}</li>
                ))}
              </ul>
            </div>

            {/* Outras Opções de Tratamento */}
            {resultado.outrasOpcoes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Outras Opções de Tratamento:</h4>
                <div className="space-y-3">
                  {resultado.outrasOpcoes.map((opcao, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium text-gray-800">{opcao.medicamento}</h5>
                      <p className="text-sm text-gray-600">
                        {opcao.dosagem} - {opcao.frequencia}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatarDose(opcao.doses)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErisipelaCalculator;
