import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Activity, AlertTriangle, Heart, FileText, Wind, Droplets, Stethoscope, Brain } from 'lucide-react';
import AnafilaxiaCalculator from '@/components/protocol-calculators/AnafilaxiaCalculator';
import AsmaCalculator from '@/components/protocol-calculators/AsmaCalculator';
import { DesidratacaoCalculator } from '../../components/platform/calculators/DesidratacaoCalculator';
import { CetoacidoseDiabeticaCalculator } from '../../components/platform/calculators/CetoacidoseDiabeticaCalculator';
import { ChoqueSepticoCalculator } from '../../components/platform/calculators/ChoqueSepticoCalculator';
import { CriseConvulsivaCalculator } from '../../components/platform/calculators/CriseConvulsivaCalculator';
import { TCECalculator } from '../../components/platform/calculators/TCECalculator';
import { CeluliteCalculator } from '../../components/platform/calculators/CeluliteCalculator';
import ErisipelaCalculator from '../../components/platform/calculators/ErisipelaCalculator';
import { BronquioliteVSRCalculator } from '../../components/platform/BronquioliteVSRCalculator';
import { CriseAlgicaAnemiaFalciformeCalculator } from '../../components/platform/CriseAlgicaAnemiaFalciformeCalculator';
import DoencaDiarreicaCalculator from '../../components/platform/DoencaDiarreicaCalculator';
import GlomerulonefriteCalculator from '../../components/platform/GlomerulonefriteCalculator';
import ParadaCardiorrespiratoriaCalculator from '../../components/protocol-calculators/ParadaCardiorrespiratoriaCalculator';
import PneumoniaCalculator from '../../components/protocol-calculators/PneumoniaCalculator';
import PolitraumatismoCalculator from '../../components/protocol-calculators/PolitraumatismoCalculator';
import SimPCalculator from '../../components/protocol-calculators/SimPCalculator';
import SragCalculator from '../../components/protocol-calculators/SragCalculator';
import ViolenciaSexualCalculator from '@/components/platform/ViolenciaSexualCalculator';
import { anafilaxiaCalculator } from '@/utils/protocol-calculators/anafilaxia';
import { asmaCalculator } from '@/utils/protocol-calculators/asma';
import { AnafilaxiaCalculationResult, AsmaCalculationResult, DesidratacaoResult, CetoacidoseCalculationResult, ChoqueSepticoResult, CriseConvulsivaResult, TCEResult, CeluliteResult, ErisipelaResult, BronquioliteVSRResult, CriseAlgicaAnemiaFalciformeResult, DoencaDiarreicaResult, GlomerulonefriteResult, ParadaCardiorrespiratoriaResult, PneumoniaResult, PolitraumatismoResult, SimPResult, SragResult, ViolenciaSexualResult } from '@/types/protocol-calculators';

const ProtocolCalculatorPage: React.FC = () => {
  const { protocolId } = useParams<{ protocolId: string }>();
  const navigate = useNavigate();
  const [anafilaxiaResults, setAnafilaxiaResults] = React.useState<AnafilaxiaCalculationResult | null>(null);
  const [asmaResults, setAsmaResults] = React.useState<AsmaCalculationResult | null>(null);
  const [desidratacaoResults, setDesidratacaoResults] = React.useState<DesidratacaoResult | null>(null);
  const [cetoacidoseResults, setCetoacidoseResults] = React.useState<CetoacidoseCalculationResult | null>(null);
  const [choqueSepticoResults, setChoqueSepticoResults] = React.useState<ChoqueSepticoResult | null>(null);
  const [criseConvulsivaResults, setCriseConvulsivaResults] = React.useState<CriseConvulsivaResult | null>(null);
  const [tceResults, setTceResults] = React.useState<TCEResult | null>(null);
  const [celuliteResults, setCeluliteResults] = React.useState<CeluliteResult | null>(null);
  const [erisipelaResults, setErisipelaResults] = React.useState<ErisipelaResult | null>(null);
  const [bronquioliteVSRResults, setBronquioliteVSRResults] = React.useState<BronquioliteVSRResult | null>(null);
  const [criseAlgicaResults, setCriseAlgicaResults] = React.useState<CriseAlgicaAnemiaFalciformeResult | null>(null);
  const [doencaDiarreicaResults, setDoencaDiarreicaResults] = React.useState<DoencaDiarreicaResult | null>(null);
  const [glomerulonefriteResults, setGlomerulonefriteResults] = React.useState<GlomerulonefriteResult | null>(null);
  const [paradaCardiorrespiratoriaResults, setParadaCardiorrespiratoriaResults] = React.useState<ParadaCardiorrespiratoriaResult | null>(null);
  const [pneumoniaResults, setPneumoniaResults] = React.useState<PneumoniaResult | null>(null);
  const [politraumatismoResults, setPolitraumatismoResults] = React.useState<PolitraumatismoResult | null>(null);
  const [simPResults, setSimPResults] = React.useState<SimPResult | null>(null);
  const [sragResults, setSragResults] = React.useState<SragResult | null>(null);
  const [violenciaSexualResults, setViolenciaSexualResults] = React.useState<ViolenciaSexualResult | null>(null);

  // Mapear protocolos disponíveis
  const protocolConfig = {
    anafilaxia: {
      title: 'Calculadora de Anafilaxia',
      description: 'Avaliação e cálculo de doses para tratamento da anafilaxia em pediatria',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    asma: {
      title: 'Calculadora de Asma',
      description: 'Avaliação de gravidade e tratamento da crise asmática em pediatria',
      icon: <Wind className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    desidratacao: {
      title: 'Calculadora de Desidratação',
      description: 'Avaliação do grau de desidratação e plano de hidratação em pediatria',
      icon: <Droplets className="h-6 w-6" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    cetoacidose_diabetica: {
      title: 'Calculadora de Cetoacidose Diabética',
      description: 'Cálculo de hidratação, insulinoterapia e eletrólitos para CAD em pediatria',
      icon: <Stethoscope className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    choque_septico: {
      title: 'Calculadora de Choque Séptico',
      description: 'Avaliação de sinais vitais, expansão volêmica e drogas vasoativas em pediatria',
      icon: <Activity className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    crise_convulsiva: {
      title: 'Calculadora de Crise Convulsiva',
      description: 'Cálculo de medicações anticonvulsivantes e manejo de crises em pediatria',
      icon: <Brain className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    tce: {
      title: 'Calculadora de Trauma Cranioencefálico',
      description: 'Avaliação do Glasgow, critérios para TC e indicações de internação',
      icon: <Brain className="h-6 w-6" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    celulite: {
      title: 'Calculadora de Celulite',
      description: 'Avaliação da gravidade e tratamento da celulite em pediatria',
      icon: <Activity className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    erisipela: {
      title: 'Calculadora de Erisipela',
      description: 'Avaliação de critérios de internação e tratamento da erisipela em pediatria',
      icon: <Activity className="h-6 w-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    bronquiolite_vsr: {
      title: 'Calculadora de Bronquiolite VSR',
      description: 'Avaliação de gravidade, critérios de internação e tratamento da bronquiolite VSR',
      icon: <Wind className="h-6 w-6" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    crise_algica_anemia_falciforme: {
      title: 'Calculadora de Crise Álgica - Anemia Falciforme',
      description: 'Avaliação da dor, medicações e manejo de complicações na anemia falciforme',
      icon: <Heart className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    doenca_diarreica: {
      title: 'Calculadora de Doença Diarreica',
      description: 'Avaliação de desidratação e planos de hidratação para doença diarreica em pediatria',
      icon: <Droplets className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    glomerulonefrite: {
      title: 'Calculadora de Glomerulonefrite',
      description: 'Avaliação diagnóstica e tratamento da glomerulonefrite aguda em pediatria',
      icon: <Stethoscope className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    parada_cardiorrespiratoria: {
      title: 'Calculadora de Parada Cardiorrespiratória',
      description: 'Protocolo de RCP, medicações e manejo da parada cardiorrespiratória em pediatria',
      icon: <Heart className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    pneumonia: {
      title: 'Calculadora de Pneumonia',
      description: 'Avaliação de gravidade, critérios de internação e tratamento da pneumonia em pediatria',
      icon: <Wind className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    politraumatismo: {
      title: 'Calculadora de Politraumatismo',
      description: 'Avaliação ABCDE, Escala de Glasgow e manejo do politraumatismo em pediatria',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    sim_p: {
      title: 'Calculadora de SIM-P',
      description: 'Critérios diagnósticos OMS e CDC para Síndrome Inflamatória Multissistêmica Pediátrica',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    srag: {
      title: 'Calculadora de SRAG',
      description: 'Avaliação PALICC para Síndrome Respiratória Aguda Grave e SDRA pediátrica',
      icon: <Wind className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  };

  const currentProtocol = protocolConfig[protocolId as keyof typeof protocolConfig];

  if (!currentProtocol) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Protocolo não encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              O protocolo "{protocolId}" não foi encontrado.
            </p>
            <Button onClick={() => navigate('/platform/protocols')}>
              Voltar aos Protocolos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnafilaxiaResultsChange = (newResults: AnafilaxiaCalculationResult | null) => {
    setAnafilaxiaResults(newResults);
  };

  const handleAsmaResultsChange = (newResults: AsmaCalculationResult | null) => {
    setAsmaResults(newResults);
  };

  const handleDesidratacaoResultsChange = (newResults: DesidratacaoResult | null) => {
    setDesidratacaoResults(newResults);
  };

  const handleCetoacidoseResultsChange = (newResults: CetoacidoseCalculationResult | null) => {
    setCetoacidoseResults(newResults);
  };

  const handleChoqueSepticoResultsChange = (newResults: ChoqueSepticoResult | null) => {
    setChoqueSepticoResults(newResults);
  };

  const handleCriseConvulsivaResultsChange = (newResults: CriseConvulsivaResult | null) => {
    setCriseConvulsivaResults(newResults);
  };

  const handleTceResultsChange = (newResults: TCEResult | null) => {
    setTceResults(newResults);
  };

  const handleCeluliteResultsChange = (newResults: CeluliteResult | null) => {
    setCeluliteResults(newResults);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/platform/protocols')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {currentProtocol.icon}
              {currentProtocol.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentProtocol.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Calculadora Ativa
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/platform/protocols/${protocolId}`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Protocolo
          </Button>
        </div>
      </div>

      {/* Critérios Diagnósticos */}
      {protocolId === 'anafilaxia' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Critérios Diagnósticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anafilaxiaCalculator.getDiagnosticCriteria().map((criteria, index) => (
                <div key={index} className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-gray-900">{criteria.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{criteria.description}</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {criteria.subcategories.map((sub, subIndex) => (
                      <li key={subIndex} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classificação de Gravidade para Asma */}
      {protocolId === 'asma' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Classificação de Gravidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asmaCalculator.getSeverityClassification().map((severity, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-gray-900 capitalize">{severity.level}</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Características:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {severity.characteristics.map((char, charIndex) => (
                          <li key={charIndex} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Tratamento:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {severity.treatment.map((treatment, treatIndex) => (
                          <li key={treatIndex} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graus de Desidratação */}
      {protocolId === 'desidratacao' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Graus de Desidratação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-900">Grau I - Leve (3-5%)</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Alerta, olhos normais, mucosas úmidas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Turgor normal, lágrimas presentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Sinais vitais e diurese normais</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-semibold text-gray-900">Grau II - Moderada (5-10%)</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Inquieto/irritado, olhos fundos, mucosas secas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Turgor diminuído, lágrimas ausentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Taquicardia, extremidades frias</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-900">Grau III - Grave (&gt;10%)</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Letárgico/inconsciente, olhos muito fundos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Mucosas muito secas, turgor muito diminuído</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pulso fino/ausente, oligúria/anúria</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios Diagnósticos e Classificação - Cetoacidose Diabética */}
      {protocolId === 'cetoacidose_diabetica' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Critérios Diagnósticos e Classificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-900">Critérios Diagnósticos de CAD</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Glicemia &gt; 200 mg/dL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>pH &lt; 7.3 OU Bicarbonato &lt; 15 mEq/L</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Presença de cetose/cetonúria</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">CAD Leve</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>pH: 7.2 - 7.3</li>
                    <li>HCO₃⁻: 10-15 mEq/L</li>
                    <li>Estado: Alerta</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-semibold text-gray-900">CAD Moderada</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>pH: 7.1 - 7.2</li>
                    <li>HCO₃⁻: 5-10 mEq/L</li>
                    <li>Estado: Sonolento</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-gray-900">CAD Grave</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>pH: &lt; 7.1</li>
                    <li>HCO₃⁻: &lt; 5 mEq/L</li>
                    <li>Estado: Estupor/Coma</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios Diagnósticos e Classificação - Choque Séptico */}
      {protocolId === 'choque_septico' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Critérios Diagnósticos e Classificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-900">Definição de Choque Séptico</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Sepse + disfunção cardiovascular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Hipotensão refratária à expansão volêmica (60 ml/kg em 1h)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Necessidade de drogas vasoativas</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Choque Quente (Vasodilatado)</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• Taquicardia</li>
                    <li>• Extremidades quentes</li>
                    <li>• Pulsos amplos/saltitantes</li>
                    <li>• Perfusão capilar &lt; 2s</li>
                    <li>• Pressão arterial baixa</li>
                    <li>• Débito cardíaco alto</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Choque Frio (Cardiogênico)</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• Taquicardia ou bradicardia</li>
                    <li>• Extremidades frias</li>
                    <li>• Pulsos fracos/filiformes</li>
                    <li>• Perfusão capilar &gt; 2s</li>
                    <li>• Pressão arterial baixa</li>
                    <li>• Débito cardíaco baixo</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-900">Causas Reversíveis - 5Hs e 5Ts</h4>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-sm font-medium">5 Hs:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Hipovolemia</li>
                      <li>• Hipóxia</li>
                      <li>• Hidrogênio (acidose)</li>
                      <li>• Hipo/Hipercalemia</li>
                      <li>• Hipotermia</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-sm font-medium">5 Ts:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Tension pneumothorax</li>
                      <li>• Tamponamento cardíaco</li>
                      <li>• Toxinas/Drogas</li>
                      <li>• Trombose (pulmonar/coronária)</li>
                      <li>• Trauma</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios Diagnósticos e Classificação - Crise Convulsiva */}
      {protocolId === 'crise_convulsiva' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Critérios Diagnósticos e Manejo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-900">Estado de Mal Epiléptico (EME)</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Crise convulsiva prolongada ≥ 30 minutos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Crises recorrentes sem recuperação completa da consciência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Requer tratamento intensivo imediato</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Medicações de Primeira Linha</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• <strong>Diazepam:</strong> 0,3-0,5 mg/kg IV/retal (máx: 10mg)</li>
                    <li>• <strong>Midazolam:</strong> 0,05-0,2 mg/kg IV/IM/nasal</li>
                    <li>• Pode repetir após 10 minutos</li>
                    <li>• Velocidade máxima conforme protocolo</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Medicações de Segunda Linha</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• <strong>Fenobarbital:</strong> 20 mg/kg IV</li>
                    <li>• <strong>Fenitoína:</strong> 20 mg/kg IV (diluído 1:20)</li>
                    <li>• Velocidade máxima: 1 mg/kg/min</li>
                    <li>• Monitorização cardíaca obrigatória</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-900">Critérios de Hospitalização</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Primeira crise convulsiva</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Idade menor que 12 meses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Presença de febre (suspeita de meningite)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Sem retorno ao estado de consciência normal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Glasgow &lt; 15 após a crise</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-gray-900">Indicações de Punção Lombar</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Crianças &lt; 12 meses após primeira crise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Crianças 12-18 meses com manifestações incertas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>&gt; 18 meses com sinais de infecção central</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios Diagnósticos e Classificação - TCE */}
      {protocolId === 'tce' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Critérios Diagnósticos e Avaliação - TCE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-900">Escala de Glasgow</h4>
                <div className="grid md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <span className="text-sm font-medium">Leve:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Glasgow 13-15</li>
                      <li>• Perda de consciência &lt; 30 min</li>
                      <li>• Amnésia pós-traumática &lt; 24h</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Moderado:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Glasgow 9-12</li>
                      <li>• Perda de consciência 30min-24h</li>
                      <li>• Amnésia pós-traumática 1-7 dias</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Grave:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Glasgow &lt; 9</li>
                      <li>• Perda de consciência &gt; 24h</li>
                      <li>• Amnésia pós-traumática &gt; 7 dias</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-900">Critérios Gerais para TC</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Glasgow alterado (redução de 2 ou mais pontos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Alteração do estado mental/comportamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Perda de consciência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Sinais de fratura de crânio</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Critérios Menores &lt; 2 anos</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• Hematoma em couro cabeludo</li>
                    <li>• Trauma craniano grave</li>
                    <li>• Comportamento anormal</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Critérios Menores ≥ 2 anos</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• Vômitos</li>
                    <li>• Vertigem/tontura</li>
                    <li>• Trauma craniano grave</li>
                    <li>• Hematoma occipital</li>
                    <li>• Cefaleia grave</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-900">Critérios de Internação</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Glasgow &lt; 15 persistente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>TC anormal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Vômitos persistentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Idade &lt; 2 anos com critérios menores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Impossibilidade de observação domiciliar</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios Diagnósticos e Tratamento - Celulite */}
      {protocolId === 'celulite' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Critérios de Avaliação e Tratamento - Celulite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-gray-900">Fatores de Gravidade</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Idade &lt; 3 meses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Febre alta (≥ 38.5°C)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Toxemia/comprometimento sistêmico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Imunossupressão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Áreas especiais (face, pescoço, área genital, mãos, pés)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Extensão importante da lesão</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Tratamento Ambulatorial</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• <strong>1ª escolha:</strong> Cefalexina 50-100 mg/kg/dia</li>
                    <li>• <strong>2ª escolha:</strong> Claritromicina 15 mg/kg/dia</li>
                    <li>• <strong>3ª escolha:</strong> Amoxicilina + clavulanato</li>
                    <li>• Duração: 7 a 14 dias</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Tratamento Hospitalar</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• <strong>Oxacilina:</strong> 200 mg/kg/dia</li>
                    <li>• <strong>Ceftriaxona:</strong> 100 mg/kg/dia</li>
                    <li>• <strong>Clindamicina:</strong> 20-40 mg/kg/dia (sepse)</li>
                    <li>• Monitorização contínua</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-900">Critérios de Internação</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Dois ou mais fatores de gravidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Toxemia/comprometimento sistêmico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Idade menor que 1 mês</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Imunossupressão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Falha no tratamento ambulatorial</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-900">Medidas de Suporte</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Elevação de extremidades afetadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Higiene adequada da área afetada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Compressas mornas locais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Avaliação para drenagem se necessário</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios Diagnósticos e Tratamento - Erisipela */}
      {protocolId === 'erisipela' && (
        <Card className={currentProtocol.bgColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Critérios de Avaliação e Tratamento - Erisipela
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-pink-400 pl-4">
                <h4 className="font-semibold text-gray-900">Características Clínicas</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Área endurada com bordas elevadas e bem definidas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Localização preferencial em membros inferiores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Eritema, edema, calor e dor local</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Tratamento Ambulatorial</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• <strong>1ª escolha:</strong> Cefalexina 100 mg/kg/dia</li>
                    <li>• <strong>2ª escolha:</strong> Amoxicilina 50-100 mg/kg/dia</li>
                    <li>• <strong>3ª escolha:</strong> Amoxicilina + clavulanato</li>
                    <li>• Duração: 7 dias, VO, dividido em 3 doses</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Tratamento Hospitalar</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li>• <strong>Penicilina cristalina:</strong> 200.000 U/kg/dia</li>
                    <li>• <strong>Oxacilina:</strong> 200 mg/kg/dia</li>
                    <li>• <strong>Cefalotina:</strong> 100 mg/kg/dia</li>
                    <li>• <strong>Ceftriaxona:</strong> 100 mg/kg/dia</li>
                    <li>• <strong>Clindamicina:</strong> 20-40 mg/kg/dia (se sepse)</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-900">Critérios de Internação</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Lesões extensas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Sintomas sistêmicos (febre, mal-estar)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Comorbidades significativas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Sinais de sepse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Complicações (celulite extensa, abscessos)</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-900">Fatores de Porta de Entrada</h4>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Trauma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Dermatite fúngica interdigital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Picadas de inseto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Fissuras no calcanhar</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculadora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Calculadora Clínica
          </CardTitle>
        </CardHeader>
        <CardContent>
          {protocolId === 'anafilaxia' && (
            <AnafilaxiaCalculator onResultsChange={handleAnafilaxiaResultsChange} />
          )}
          
          {protocolId === 'asma' && (
            <AsmaCalculator onResultsChange={handleAsmaResultsChange} />
          )}
          
          {protocolId === 'desidratacao' && (
            <DesidratacaoCalculator />
          )}
          
          {protocolId === 'cetoacidose_diabetica' && (
            <CetoacidoseDiabeticaCalculator />
          )}
          
          {protocolId === 'choque_septico' && (
            <ChoqueSepticoCalculator />
          )}
          
          {protocolId === 'crise_convulsiva' && (
            <CriseConvulsivaCalculator />
          )}
          
          {protocolId === 'tce' && (
            <TCECalculator />
          )}
          
          {protocolId === 'celulite' && (
            <CeluliteCalculator />
          )}
          
          {protocolId === 'erisipela' && (
            <ErisipelaCalculator />
          )}
          
          {protocolId === 'bronquiolite_vsr' && (
            <BronquioliteVSRCalculator />
          )}
          
          {protocolId === 'crise_algica_anemia_falciforme' && (
            <CriseAlgicaAnemiaFalciformeCalculator />
          )}
          
          {protocolId === 'doenca_diarreica' && (
            <DoencaDiarreicaCalculator />
          )}
          
          {protocolId === 'glomerulonefrite' && (
            <GlomerulonefriteCalculator />
          )}
          
          {protocolId === 'parada_cardiorrespiratoria' && (
            <ParadaCardiorrespiratoriaCalculator 
              onResultsChange={setParadaCardiorrespiratoriaResults}
            />
          )}
          
          {protocolId === 'pneumonia' && (
            <PneumoniaCalculator 
              onResultsChange={setPneumoniaResults}
            />
          )}
          
          {protocolId === 'politraumatismo' && (
            <PolitraumatismoCalculator 
              onResultsChange={setPolitraumatismoResults}
            />
          )}
          
          {protocolId === 'sim_p' && (
            <SimPCalculator 
              onResultsChange={setSimPResults}
            />
          )}
          
          {protocolId === 'srag' && (
            <SragCalculator 
              onResultsChange={setSragResults}
            />
          )}
          
          {protocolId === 'violencia_sexual' && (
            <ViolenciaSexualCalculator />
          )}
          
          {protocolId !== 'anafilaxia' && protocolId !== 'asma' && protocolId !== 'desidratacao' && protocolId !== 'cetoacidose_diabetica' && protocolId !== 'choque_septico' && protocolId !== 'crise_convulsiva' && protocolId !== 'tce' && protocolId !== 'celulite' && protocolId !== 'erisipela' && protocolId !== 'bronquiolite_vsr' && protocolId !== 'crise_algica_anemia_falciforme' && protocolId !== 'doenca_diarreica' && protocolId !== 'glomerulonefrite' && protocolId !== 'parada_cardiorrespiratoria' && protocolId !== 'pneumonia' && protocolId !== 'politraumatismo' && protocolId !== 'sim_p' && protocolId !== 'srag' && protocolId !== 'violencia_sexual' && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Calculadora em Desenvolvimento
              </h3>
              <p className="text-gray-500">
                A calculadora para este protocolo está sendo desenvolvida.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo dos Resultados - Anafilaxia */}
      {anafilaxiaResults && protocolId === 'anafilaxia' && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-600" />
              Resumo do Cálculo - Anafilaxia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Gravidade</h4>
                <Badge 
                  className={
                    anafilaxiaResults.severity.level === 'grave' ? 'bg-red-100 text-red-800' :
                    anafilaxiaResults.severity.level === 'moderada' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }
                >
                  {anafilaxiaResults.severity.level.toUpperCase()}
                </Badge>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Dose de Adrenalina</h4>
                <p className="text-lg font-mono">{anafilaxiaResults.adrenaline.doseMg} mg</p>
                <p className="text-sm text-gray-600">({anafilaxiaResults.adrenaline.doseML} mL)</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">PA Mínima</h4>
                <p className="text-lg font-mono">{anafilaxiaResults.minBloodPressure} mmHg</p>
                <p className="text-sm text-gray-600">Sistólica</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo dos Resultados - Asma */}
      {asmaResults && protocolId === 'asma' && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-600" />
              Resumo da Avaliação - Asma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Gravidade</h4>
                <Badge 
                  className={
                    asmaResults.severity.level === 'iminencia_parada' ? 'bg-purple-100 text-purple-800' :
                    asmaResults.severity.level === 'grave' ? 'bg-red-100 text-red-800' :
                    asmaResults.severity.level === 'moderada' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }
                >
                  {asmaResults.severity.level === 'iminencia_parada' ? 'IMINÊNCIA PARADA' : asmaResults.severity.level.toUpperCase()}
                </Badge>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Oxigenoterapia</h4>
                <p className={`text-lg font-mono ${asmaResults.oxygenTherapy.indicated ? 'text-red-600' : 'text-green-600'}`}>
                  {asmaResults.oxygenTherapy.indicated ? 'INDICADA' : 'NÃO INDICADA'}
                </p>
                {asmaResults.oxygenTherapy.indicated && (
                  <p className="text-sm text-gray-600">{asmaResults.oxygenTherapy.flow}</p>
                )}
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Broncodilatador</h4>
                <p className="text-lg font-mono">Salbutamol</p>
                <p className="text-sm text-gray-600">Conforme peso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo dos Resultados - TCE */}
      {tceResults && protocolId === 'tce' && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Resumo da Avaliação - TCE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Glasgow</h4>
                <div className="text-2xl font-mono text-blue-600">{tceResults.glasgow.scoreTotal}</div>
                <Badge 
                  className={
                    tceResults.glasgow.gravidade === 'Grave' ? 'bg-red-100 text-red-800' :
                    tceResults.glasgow.gravidade === 'Moderado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }
                >
                  {tceResults.glasgow.gravidade}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Normal: {tceResults.glasgow.scoreNormal}</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Tomografia</h4>
                <p className={`text-sm font-medium ${
                  tceResults.recomendacaoTC.includes('recomendada') ? 'text-red-600' :
                  tceResults.recomendacaoTC.includes('Observação') ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {tceResults.recomendacaoTC.includes('recomendada') ? 'RECOMENDADA' :
                   tceResults.recomendacaoTC.includes('Observação') ? 'OBSERVAÇÃO' :
                   'NÃO INDICADA'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {tceResults.menor2Anos ? '< 2 anos' : '≥ 2 anos'}
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Internação</h4>
                <Badge className={tceResults.criteriosInternacao ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {tceResults.criteriosInternacao ? 'INDICADA' : 'AVALIAR'}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.floor(tceResults.idadeMeses / 12)}a {tceResults.idadeMeses % 12}m
                </p>
              </div>
            </div>
            
            {tceResults.motivosInternacao.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h5 className="text-sm font-semibold text-red-800 mb-2">Critérios de Internação Presentes:</h5>
                <div className="flex flex-wrap gap-2">
                  {tceResults.motivosInternacao.map((motivo, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {motivo}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo dos Resultados - Celulite */}
      {celuliteResults && protocolId === 'celulite' && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Resumo da Avaliação - Celulite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Gravidade</h4>
                <div className="text-2xl font-mono text-blue-600">{celuliteResults.gravidadeScore}</div>
                <p className="text-xs text-gray-500 mt-1">Score de Gravidade</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Conduta</h4>
                <Badge className={celuliteResults.necessitaInternacao ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {celuliteResults.necessitaInternacao ? 'INTERNAÇÃO' : 'AMBULATORIAL'}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {celuliteResults.tratamentoRecomendado[0]?.medicamento}
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Fatores</h4>
                <div className="text-lg font-mono text-orange-600">{celuliteResults.fatoresGravidadeSelecionados.length}</div>
                <p className="text-xs text-gray-500 mt-1">Fatores de Gravidade</p>
              </div>
            </div>
            
            {celuliteResults.motivosInternacao.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h5 className="text-sm font-semibold text-red-800 mb-2">Motivos para Internação:</h5>
                <div className="flex flex-wrap gap-2">
                  {celuliteResults.motivosInternacao.map((motivo, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {motivo}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {celuliteResults.tratamentoRecomendado.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h5 className="text-sm font-semibold text-blue-800 mb-2">Medicamento Recomendado:</h5>
                <div className="text-sm text-blue-700">
                  <strong>{celuliteResults.tratamentoRecomendado[0].medicamento}</strong>: {celuliteResults.tratamentoRecomendado[0].dosePorKg}
                  <br />
                  <span className="text-xs">Dose calculada: {celuliteResults.tratamentoRecomendado[0].doseDiaria.toFixed(1)} mg/dia</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo dos Resultados - Erisipela */}
      {erisipelaResults && protocolId === 'erisipela' && (
        <Card className="border-l-4 border-pink-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-pink-600" />
              Resumo da Avaliação - Erisipela
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Conduta</h4>
                <Badge className={erisipelaResults.necessitaInternacao ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {erisipelaResults.necessitaInternacao ? 'INTERNAÇÃO' : 'AMBULATORIAL'}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Decisão Terapêutica</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Medicamento</h4>
                <div className="text-sm font-mono text-pink-600">{erisipelaResults.medicamentoRecomendado}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {erisipelaResults.dosesMedicamentoPrincipal.doseDia ? 
                    `${erisipelaResults.dosesMedicamentoPrincipal.doseDia} ${erisipelaResults.dosesMedicamentoPrincipal.unidade}/dia` :
                    `${erisipelaResults.dosesMedicamentoPrincipal.doseDiaMin}-${erisipelaResults.dosesMedicamentoPrincipal.doseDiaMax} ${erisipelaResults.dosesMedicamentoPrincipal.unidade}/dia`
                  }
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-700">Complicações</h4>
                <div className="text-lg font-mono text-orange-600">{erisipelaResults.complicacoes.length}</div>
                <p className="text-xs text-gray-500 mt-1">Fatores de Risco</p>
              </div>
            </div>
            
            {erisipelaResults.complicacoes.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h5 className="text-sm font-semibold text-red-800 mb-2">Complicações Identificadas:</h5>
                <div className="flex flex-wrap gap-2">
                  {erisipelaResults.complicacoes.map((complicacao, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {complicacao}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {erisipelaResults.medicamentoSecundario && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                <h5 className="text-sm font-semibold text-orange-800 mb-2">Medicamento Adicional:</h5>
                <div className="text-sm text-orange-700">
                  <strong>{erisipelaResults.medicamentoSecundario}</strong>
                  {erisipelaResults.dosesMedicamentoSecundario && (
                    <>
                      {erisipelaResults.dosesMedicamentoSecundario.doseDia ? 
                        `: ${erisipelaResults.dosesMedicamentoSecundario.doseDia} ${erisipelaResults.dosesMedicamentoSecundario.unidade}/dia` :
                        `: ${erisipelaResults.dosesMedicamentoSecundario.doseDiaMin}-${erisipelaResults.dosesMedicamentoSecundario.doseDiaMax} ${erisipelaResults.dosesMedicamentoSecundario.unidade}/dia`
                      }
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded">
              <h5 className="text-sm font-semibold text-pink-800 mb-2">Recomendações de Manejo:</h5>
              <ul className="text-xs text-pink-700 space-y-1">
                {erisipelaResults.recomendacoes.slice(0, 3).map((recomendacao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>{recomendacao}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProtocolCalculatorPage;
