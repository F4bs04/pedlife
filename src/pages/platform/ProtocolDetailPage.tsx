import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Printer, Check, AlertCircle, Info, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// @ts-ignore
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

// Tipagem estendida para o ReactMarkdown
type MarkdownProps = {
  children: string;
  className?: string;
  components?: Components;
  remarkPlugins?: any[];
};

declare module 'react-markdown' {
  interface ReactMarkdownProps extends MarkdownProps {}
}
// Importar estilos CSS para o markdown
import '@/styles/markdown.css';
import { loadProtocolContent, getProtocolTitle } from '@/utils/protocolLoader';
import { validateInputs, prepareInputs, calculateWithErrorHandling } from '@/utils/calculatorUtils';

// Componente para renderizar uma seção do protocolo
const ProtocolSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <div className="pl-4 border-l-2 border-primary">
      {children}
    </div>
  </div>
);

// Componente para renderizar uma lista de critérios
const CriteriosList = ({ criterios }: { criterios: string[] }) => (
  <ul className="list-disc pl-5 space-y-1">
    {criterios.map((criterio, index) => (
      <li key={index} className="text-gray-700">{criterio}</li>
    ))}
  </ul>
);

// Componente para renderizar um alerta ou informação importante
const InfoAlert = ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' }) => (
  <div className={`p-4 rounded-md my-4 flex items-start gap-3 ${type === 'info' ? 'bg-blue-50' : 'bg-amber-50'}`}>
    {type === 'info' ? 
      <Info className="h-5 w-5 text-blue-500 mt-0.5" /> : 
      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
    }
    <div className="text-sm">{children}</div>
  </div>
);

const ProtocolDetailPage: React.FC = () => {
  const { protocolId } = useParams<{ protocolId: string }>();
  const navigate = useNavigate();
  const [protocolData, setProtocolData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Protocolo');
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, any>>({});
  const [calculatorResults, setCalculatorResults] = useState<any>(null);

  useEffect(() => {
    const fetchProtocol = async () => {
      if (!protocolId) {
        setError('Protocolo não encontrado');
        setLoading(false);
        return;
      }

      try {
        // Usar a função de utilitário para carregar os dados do protocolo
        const data = await loadProtocolContent(protocolId);
        setProtocolData(data);
        
        // Definir o título do protocolo
        setTitle(getProtocolTitle(protocolId));
      } catch (err) {
        setError('Erro ao carregar o protocolo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocol();
  }, [protocolId]);

  // Função para calcular a idade total em meses
  const calcularIdadeMeses = (anos, mesesAdicionais) => {
    const anosNum = parseInt(anos) || 0;
    const mesesNum = parseInt(mesesAdicionais) || 0;
    return (anosNum * 12) + mesesNum;
  };

  // Função para lidar com o cálculo do protocolo
  const handleCalculate = () => {
    if (!protocolData?.controller) {
      toast.error('Controlador não encontrado para este protocolo');
      return;
    }
    
    try {
      // Processamento específico para cada protocolo
      if (protocolId === 'tce') {
        const idadeMeses = calcularIdadeMeses(
          calculatorInputs.idade_anos, 
          calculatorInputs.idade_meses_adicionais
        );
        
        const dadosCalculados = {
          ...calculatorInputs,
          idade_meses: idadeMeses
        };
        
        const result = protocolData.controller.calcular(dadosCalculados);
        setCalculatorResults(result);
        toast.success('Cálculo realizado com sucesso!');
      } 
      // Processamento específico para o protocolo de Asma
      else if (protocolId === 'asma') {
        const idadeMeses = calcularIdadeMeses(
          calculatorInputs.idade_anos, 
          calculatorInputs.idade_meses
        );
        
        const dadosCalculados = {
          ...calculatorInputs,
          idade_meses: idadeMeses
        };
        
        const result = protocolData.controller.calcular(dadosCalculados);
        setCalculatorResults(result);
        toast.success('Cálculo realizado com sucesso!');
      } 
      // Para outros protocolos, usar o cálculo padrão
      else {
        const result = protocolData.controller.calcular(calculatorInputs);
        setCalculatorResults(result);
        toast.success('Cálculo realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao calcular:', error);
      toast.error(`Erro ao calcular: ${error.message || 'Verifique os dados inseridos.'}`);
      setCalculatorResults(null);
    }
  };

  const handleCopyContent = () => {
    // Criar um texto formatado com as informações do protocolo
    const controller = protocolData?.controller;
    let textContent = `${title}\n\n`;
    
    // Adicionar informações específicas do protocolo
    if (controller) {
      // Adicionar critérios se disponíveis
      if (controller.getCriteriosTcGerais) {
        textContent += '\nCritérios Gerais:\n';
        controller.getCriteriosTcGerais().forEach((criterio: string, index: number) => {
          textContent += `${index + 1}. ${criterio}\n`;
        });
      }
      
      // Adicionar outras informações específicas do protocolo
      // Isso varia de acordo com o tipo de protocolo
    }
    
    navigator.clipboard.writeText(textContent);
    toast.success('Conteúdo copiado para a área de transferência');
    
    // Feedback visual com ícone de check
    setIsCopying(true);
    setTimeout(() => {
      setIsCopying(false);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6 md:p-8 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goBack}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyContent}
              className="flex items-center gap-1"
            >
              {isCopying ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {isCopying ? 'Copiado' : 'Copiar'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="flex items-center gap-1 print:hidden"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
        {!loading && !error && (
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
        )}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 font-medium text-lg">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/platform/protocols')}
            >
              Voltar para Protocolos
            </Button>
          </div>
        ) : (
          <div>
            <div className="prose prose-slate max-w-none">
              {protocolData && (
                <div className="space-y-8">
                  {/* Calculadora de Protocolos */}
                  {protocolData.controller && (
                    <div className="p-6 bg-gray-50 rounded-lg mb-8">
                      <div className="mb-4 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Calculadora de {title}</h3>
                      </div>
                      
                      {/* Formulários específicos para cada protocolo */}
                      {protocolId === 'tce' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="idade_anos">Idade (anos)</Label>
                            <Input 
                              id="idade_anos" 
                              type="number" 
                              placeholder="Ex: 5"
                              value={calculatorInputs.idade_anos || ''}
                              onChange={(e) => setCalculatorInputs(prev => ({ ...prev, idade_anos: e.target.value }))} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="idade_meses_adicionais">Meses adicionais</Label>
                            <Input 
                              id="idade_meses_adicionais" 
                              type="number" 
                              placeholder="Ex: 6"
                              value={calculatorInputs.idade_meses_adicionais || ''}
                              onChange={(e) => setCalculatorInputs(prev => ({ ...prev, idade_meses_adicionais: e.target.value }))} 
                            />
                          </div>
                          
                          <div className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox 
                                id="mecanismo_alto_impacto" 
                                checked={calculatorInputs.mecanismo_alto_impacto || false}
                                onCheckedChange={(checked) => setCalculatorInputs(prev => ({ ...prev, mecanismo_alto_impacto: checked }))} 
                              />
                              <Label htmlFor="mecanismo_alto_impacto" className="text-sm font-normal">Mecanismo de alto impacto</Label>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox 
                                id="alteracao_comportamento" 
                                checked={calculatorInputs.alteracao_comportamento || false}
                                onCheckedChange={(checked) => setCalculatorInputs(prev => ({ ...prev, alteracao_comportamento: checked }))} 
                              />
                              <Label htmlFor="alteracao_comportamento" className="text-sm font-normal">Alteração de comportamento</Label>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox 
                                id="perda_consciencia" 
                                checked={calculatorInputs.perda_consciencia || false}
                                onCheckedChange={(checked) => setCalculatorInputs(prev => ({ ...prev, perda_consciencia: checked }))} 
                              />
                              <Label htmlFor="perda_consciencia" className="text-sm font-normal">Perda de consciência</Label>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox 
                                id="vomitos" 
                                checked={calculatorInputs.vomitos || false}
                                onCheckedChange={(checked) => setCalculatorInputs(prev => ({ ...prev, vomitos: checked }))} 
                              />
                              <Label htmlFor="vomitos" className="text-sm font-normal">Vômitos</Label>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox 
                                id="cefaleia" 
                                checked={calculatorInputs.cefaleia || false}
                                onCheckedChange={(checked) => setCalculatorInputs(prev => ({ ...prev, cefaleia: checked }))} 
                              />
                              <Label htmlFor="cefaleia" className="text-sm font-normal">Cefaleia</Label>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox 
                                id="convulsao" 
                                checked={calculatorInputs.convulsao || false}
                                onCheckedChange={(checked) => setCalculatorInputs(prev => ({ ...prev, convulsao: checked }))} 
                              />
                              <Label htmlFor="convulsao" className="text-sm font-normal">Convulsão</Label>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setCalculatorInputs({})}
                        >
                          Limpar
                        </Button>
                        <Button 
                          onClick={handleCalculate}
                        >
                          Calcular
                        </Button>
                      </div>
                      
                      {/* Resultados do cálculo */}
                      {calculatorResults && (
                        <div className="mt-6 border rounded-md p-4 bg-white">
                          <h4 className="font-medium text-lg mb-4">Resultados</h4>
                          
                          {/* Resultados específicos para cada protocolo */}
                          {protocolId === 'tce' && (
                            <div className="space-y-4">
                              <div className="p-3 bg-white rounded border">
                                <h5 className="font-medium mb-2">Classificação de Risco</h5>
                                <p className={`font-medium ${calculatorResults.risco === 'Alto' ? 'text-red-600' : calculatorResults.risco === 'Médio' ? 'text-amber-600' : 'text-green-600'}`}>
                                  {calculatorResults.risco}
                                </p>
                              </div>
                              
                              {calculatorResults.recomendacoes && calculatorResults.recomendacoes.length > 0 && (
                                <div className="p-3 bg-white rounded border">
                                  <h5 className="font-medium mb-2">Recomendações</h5>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    {calculatorResults.recomendacoes.map((rec, index) => (
                                      <li key={index}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Conteúdo Markdown do protocolo */}
                  <div className="prose prose-slate max-w-none mb-8 markdown-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({node, ...props}) => (
                          <a target="_blank" rel="noopener noreferrer" {...props} />
                        ),
                        table: ({node, ...props}) => (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                          </div>
                        ),
                      }}
                    >
                      {String(protocolData.content)}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProtocolDetailPage;
