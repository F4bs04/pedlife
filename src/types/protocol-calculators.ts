/**
 * Types e interfaces para calculadoras de protocolos clínicos
 */

// ==================== ANAFILAXIA ====================
export interface AnafilaxiaCriteria {
  title: string;
  description: string;
  subcategories: string[];
}

export interface AnafilaxiaSymptoms {
  // Cutâneas
  rubor?: boolean;
  prurido?: boolean;
  urticaria?: boolean;
  angioedema?: boolean;
  rash_morbiliforme?: boolean;
  
  // Respiratórias
  prurido_garganta?: boolean;
  disfagia?: boolean;
  rouquidao?: boolean;
  tosse_seca?: boolean;
  estridor?: boolean;
  dispneia?: boolean;
  sibilancia?: boolean;
  
  // Cardiovasculares
  hipotensao?: boolean;
  taquicardia?: boolean;
  bradicardia?: boolean;
  dor_peito?: boolean;
  sincope?: boolean;
  
  // Gastrointestinais
  nausea?: boolean;
  dor_abdominal?: boolean;
  vomitos?: boolean;
  diarreia?: boolean;
  
  // Neurológicas
  vertigem?: boolean;
  estado_mental_alterado?: boolean;
  convulsoes?: boolean;
}

export interface AdrenalineDose {
  doseMg: number;
  doseML: number;
  maxDose: number;
  administration: string;
  canRepeat: boolean;
  repeatInterval: string;
}

export interface AntihistaminicMedication {
  name: string;
  dose: string;
  maxDose: string;
  route: string;
  observation?: string;
}

export interface CorticosteroidMedication {
  name: string;
  dose: string;
  maxDose: string;
  route: string;
}

export interface AnafilaxiaSeverity {
  level: "leve" | "moderada" | "grave";
  description: string;
  systems: string[];
  signs: string[];
}

export interface AnafilaxiaCalculationInput {
  weight: number;
  age: number;
  symptoms: AnafilaxiaSymptoms;
}

export interface AnafilaxiaCalculationResult {
  severity: AnafilaxiaSeverity;
  adrenaline: AdrenalineDose;
  antihistaminics: AntihistaminicMedication[];
  corticosteroids: CorticosteroidMedication[];
  minBloodPressure: number;
  recommendations: string[];
}

// ==================== ASMA ====================
export interface AsmaSeverity {
  level: "leve" | "moderada" | "grave" | "iminencia_parada";
  characteristics: string[];
  treatment: string[];
}

export interface Beta2AgonistMedication {
  name: string;
  presentation: string;
  dose: string;
}

export interface AsmaCalculationInput {
  weight: number;
  age: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  retractions: "ausentes" | "leves" | "moderadas" | "graves";
  speech: "frases_completas" | "frases_incompletas" | "palavras" | "nao_fala";
  consciousness: "normal" | "agitado" | "sonolento" | "confuso";
  wheezing: "ausente" | "leve" | "moderado" | "intenso" | "silencio";
}

export interface AsmaCalculationResult {
  severity: AsmaSeverity;
  beta2Agonists: Beta2AgonistMedication[];
  corticosteroids: CorticosteroidMedication[];
  oxygenTherapy: {
    indicated: boolean;
    flow: string;
  };
  hospitalizationCriteria: string[];
  recommendations: string[];
}

// ==================== DESIDRATAÇÃO ====================
export interface DesidratacaoGrade {
  grade: "grau_i" | "grau_ii" | "grau_iii";
  weightLoss: string;
  criteria: string[];
}

export interface HydrationPlan {
  title: string;
  indications: string;
  instructions: string[];
}

export interface DesidratacaoCharacteristics {
  // Estado de consciência
  alerta: boolean;
  irritado: boolean;
  letargico: boolean;
  
  // Olhos
  olhosNormais: boolean;
  olhosFundos: boolean;
  olhosMuitoFundos: boolean;
  
  // Mucosas
  mucosasUmidas: boolean;
  mucosasSecas: boolean;
  mucosasMuitoSecas: boolean;
  
  // Turgor
  turgorNormal: boolean;
  turgorDiminuido: boolean;
  turgorMuitoDiminuido: boolean;
  
  // Lágrimas
  lagrimasPresentes: boolean;
  lagrimasAusentes: boolean;
  
  // Respiração
  respiracaoNormal: boolean;
  respiracaoRapida: boolean;
  respiracaoAcidotica: boolean;
  
  // Pulso
  pulsoNormal: boolean;
  pulsoRapido: boolean;
  pulsoFinoAusente: boolean;
  
  // Extremidades
  extremidadesNormais: boolean;
  extremidadesFrias: boolean;
  extremidadesCianoticas: boolean;
  
  // Pressão arterial
  paNormal: boolean;
  paNormalBaixa: boolean;
  paIndetectavel: boolean;
  
  // Diurese
  diureseNormal: boolean;
  diureseNormalBaixa: boolean;
  diureseOliguriaAnuria: boolean;
}

export interface DesidratacaoInput {
  pesoKg: number;
  idadeMeses: number;
  caracteristicas: DesidratacaoCharacteristics;
  diarreia: boolean;
}

export interface DesidratacaoResult {
  pesoKg: number;
  idadeMeses: number;
  grauDesidratacao: "grau_i" | "grau_ii" | "grau_iii";
  nomeGrau: string;
  percentualDesidratacao: string;
  criterios: string[];
  planoRecomendado: "plano_a" | "plano_b" | "plano_c";
  nomePlano: string;
  instrucoesPlano: string[];
  volumeSoro: number;
  ausenciaDiurese: boolean;
  protocoloDiurese: string[];
  manutencaoHidricaDiaria: number;
  deficitEstimado: number;
  recomendacoes: string[];
  diarreia: boolean;
}

export interface DesidratacaoCalculationInput {
  weight: number;
  age: number;
  clinicalSigns: {
    consciousness: "alerta" | "inquieto" | "letargico";
    eyes: "normais" | "fundos" | "muito_fundos";
    mucosas: "umidas" | "secas" | "muito_secas";
    turgor: "normal" | "diminuido" | "muito_diminuido";
    tears: "presentes" | "ausentes";
    pulse: "normal" | "rapido_fraco" | "fino_ausente";
    extremities: "normais" | "frias" | "cianoticas";
    bloodPressure: "normal" | "baixa" | "indetectavel";
    urine: "normal" | "diminuida" | "oliguria_anuria";
  };
}

export interface DesidratacaoCalculationResult {
  grade: DesidratacaoGrade;
  plan: HydrationPlan;
  volumes: {
    deficit: number;
    maintenance: number;
    total: number;
  };
  recommendations: string[];
}

// ==================== CETOACIDOSE DIABÉTICA ====================
export interface CetoacidoseCalculationInput {
  weight: number;
  age: number;
  glucose: number;
  bicarbonate: number;
  ph: number;
  potassium: number;
  deficitEstimate: number; // 5-10%
}

export interface CetoacidoseHydrationResult {
  initialExpansion: number;
  residualRepair: number;
  maintenance24h: number;
  totalVolume24h: number;
  volumePerPhase: number;
  hourlyFlow: number;
}

export interface CetoacidoseInsulinResult {
  ivMinDose: number;
  ivMaxDose: number;
  ivMinVolume: number;
  ivMaxVolume: number;
  scLowDose: number;
  scHighDose: number;
  schemeByGlycemia: Record<string, number>;
  nphDose: number;
}

export interface CetoacidoseCalculationResult {
  severity: "leve" | "moderada" | "grave";
  hydration: CetoacidoseHydrationResult;
  insulin: CetoacidoseInsulinResult;
  electrolytes: {
    potassiumMin: number;
    potassiumMax: number;
    recommendation: string;
  };
  bicarbonate?: {
    indicated: boolean;
    dose?: number;
  };
  recommendations: string[];
}

// ==================== CHOQUE SÉPTICO ====================
export interface ChoqueSepticoVitalSigns {
  fc: number; // Frequência cardíaca (bpm)
  fr: number; // Frequência respiratória (irpm)
  pas: number; // Pressão arterial sistólica (mmHg)
  perfusao: "normal" | "aumentado"; // Tempo de enchimento capilar
  consciencia: "normal" | "alterado"; // Nível de consciência
}

export interface ChoqueSepticoInput {
  weight: number;
  ageYears: number;
  ageMonths: number; // Meses adicionais
  temperature: number;
  vitalSigns: ChoqueSepticoVitalSigns;
  context: "comunidade" | "hospitalar" | "cateter" | "neutropenia" | "abdominal" | "neonatal";
  shockType: "quente" | "frio"; // Tipo de choque (vasodilatado vs cardiogênico)
}

export interface VitalSignsAssessment {
  fc: {
    value: number;
    status: "Normal" | "Taquicardia" | "Bradicardia";
    normalMin: number;
    normalMax: number;
  };
  fr: {
    value: number;
    status: "Normal" | "Taquipneia" | "Bradipneia";
    normalMin: number;
    normalMax: number;
  };
  pas: {
    value: number;
    status: "Normal" | "Hipotensão";
    normalMin: number;
  };
  perfusao: string;
  consciencia: string;
  sinaisChoque: string[];
  faseChoque: "Nenhuma" | "Compensado" | "Descompensado";
}

export interface VolumeExpansion {
  volumeUnitario: number; // Volume por expansão (20ml/kg)
  volumeTotal: number; // Volume total para 3 expansões
}

export interface AntibioticScheme {
  situacao: string;
  esquema: string;
  doses: string[];
}

export interface VasoactiveDrug {
  nome: string;
  doseInicial: string;
  doseMax: string;
  efeito: string;
  indicacao: string;
  prioridade: "alta" | "baixa";
  preparacao?: string;
  doseInicialMl?: string;
}

export interface CausaReversivel {
  nome: string;
  tipo: "H" | "T";
}

export interface ChoqueSepticoRecommendation {
  categoria: string;
  items: string[];
}

export interface ChoqueSepticoResult {
  avaliacaoVital: VitalSignsAssessment;
  expansaoVolumica: VolumeExpansion;
  antibioticos: AntibioticScheme[];
  drogasVasoativas: VasoactiveDrug[];
  causasReversiveis: CausaReversivel[];
  gravidade: "Leve" | "Moderado" | "Grave";
  recomendacoes: ChoqueSepticoRecommendation[];
}

// ==================== CRISE CONVULSIVA ====================
export interface CriseConvulsivaInput {
  weight: number;
  ageYears: number;
  ageMonths: number;
  criseStoped: boolean; // Se a crise cessou
  criseDuration: number; // Duração da crise em minutos
  firstCrise: boolean; // Se é a primeira crise
  fever: boolean; // Presença de febre
  consciousnessReturn: boolean; // Retorno da consciência
  glasgow: number; // Escala de Glasgow
  suspectedInfection: boolean; // Suspeita de infecção
}

export interface AnticonvulsantMedication {
  nome: string;
  doseMin?: number;
  doseMax?: number;
  dose?: number;
  doseFormulacao: string;
  velocidade: string;
  observacao?: string;
  doseAdicional?: number;
  doseManutencaoMin?: number;
  doseManutencaoMax?: number;
}

export interface EMEAssessment {
  eme: boolean;
  definicao: string;
}

export interface LumbarPunctureAssessment {
  indicacao: boolean;
  criterios: string[];
}

export interface TreatmentConduct {
  cessarMedicacao: boolean;
  recomendacao: string;
  esquema?: string[];
  observacao?: string;
}

export interface CriseConvulsivaResult {
  idadeMeses: number;
  peso: number;
  criseCessou: boolean;
  tempoCrise: number;
  avaliacaoEme: EMEAssessment;
  doses: {
    diazepam: AnticonvulsantMedication;
    midazolam: AnticonvulsantMedication;
    fenobarbital: AnticonvulsantMedication;
    fenitoina: AnticonvulsantMedication;
    midazolamInfusao: AnticonvulsantMedication;
  };
  criteriosHospitalizacao: string[];
  necessidadeHospitalizacao: boolean;
  avaliacaoPl: LumbarPunctureAssessment;
  conduta: TreatmentConduct;
}

// ==================== TCE (TRAUMA CRANIOENCEFÁLICO) ====================
export interface TCEInput {
  ageMonths: number;
  glasgowEyes: number; // 1-4
  glasgowVerbal: number; // 1-5  
  glasgowMotor: number; // 1-6
  // Critérios gerais para TC
  glasgowAltered: boolean;
  mentalStateChange: boolean;
  consciousnessLoss: boolean;
  skullFractureSigns: boolean;
  // Critérios adicionais > 2 anos
  vomiting: boolean;
  vertigo: boolean;
  severeTrauma: boolean;
  occipitalHematoma: boolean;
  severeHeadache: boolean;
  // Critérios adicionais < 2 anos
  headHematoma: boolean;
  abnormalBehavior: boolean;
  // Outros
  persistentVomiting: boolean;
}

export interface GlasgowResult {
  scoreTotal: number;
  scoreNormal: number;
  avaliacao: "Normal" | "Alterado";
  gravidade: "Leve" | "Moderado" | "Grave";
}

export interface TCEResult {
  idadeMeses: number;
  menor2Anos: boolean;
  glasgow: GlasgowResult;
  recomendacaoTC: string;
  recomendacoes: string[];
  criteriosInternacao: boolean;
  motivosInternacao: string[];
  orientacoesAlta: string[];
}

// Celulite Types
export interface CeluliteInput {
  peso: number;
  idadeMeses: number;
  temperatura: number;
  sintomas: string[];
  fatoresGravidade: string[];
  areaEspecial: boolean;
  extensaoImportante: boolean;
  linfangite: boolean;
  alergiaToxico: boolean;
}

export interface CeluliteTratamento {
  tipo: "ambulatorial" | "hospitalar";
  medicamento: string;
  doseDiaria: number;
  dosePorKg: string;
  frequencia: string;
  escolha?: string;
  observacao?: string;
}

export interface CeluliteResult {
  gravidadeScore: number;
  necessitaInternacao: boolean;
  motivosInternacao: string[];
  fatoresGravidadeSelecionados: string[];
  sintomasSelecionados: string[];
  tratamentoRecomendado: CeluliteTratamento[];
  recomendacoesGerais: string[];
  medidasSuporte: string[];
}

// Erisipela Types
export interface ErisipelaInput {
  peso: number;
  lesoesExtensas: boolean;
  sintomasSystemicos: boolean;
  comorbidades: boolean;
  sinaisSepse: boolean;
  celuliteExtensa: boolean;
  abscessos: boolean;
  imunossupressao: boolean;
}

export interface ErisipelaCalculatedDose {
  doseDia?: number;
  doseUnitaria?: number;
  doseDiaMin?: number;
  doseDiaMax?: number;
  doseUnitariaMin?: number;
  doseUnitariaMax?: number;
  unidade: string;
}

export interface ErisipenaoTratamento {
  medicamento: string;
  dosagem: string;
  frequencia: string;
  doses: ErisipelaCalculatedDose;
}

export interface ErisipelaResult {
  necessitaInternacao: boolean;
  medicamentoRecomendado: string;
  dosesMedicamentoPrincipal: ErisipelaCalculatedDose;
  medicamentoSecundario?: string;
  dosesMedicamentoSecundario?: ErisipelaCalculatedDose;
  complicacoes: string[];
  recomendacoes: string[];
  outrasOpcoes: ErisipenaoTratamento[];
}

export interface PatientData {
  weight: number;
  age: number;
  calculationDate: string;
  calculationTime: string;
}

export interface CalculationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: CalculationError[];
}

// Enum para tipos de calculadora
export enum ProtocolCalculatorType {
  ANAFILAXIA = "anafilaxia",
  ASMA = "asma", 
  DESIDRATACAO = "desidratacao",
  CETOACIDOSE_DIABETICA = "cetoacidose_diabetica",
  CHOQUE_SEPTICO = "choque_septico",
  CRISE_CONVULSIVA = "crise_convulsiva",
  TCE = "tce",
  CELULITE = "celulite",
  ERISIPELA = "erisipela",
  BRONQUIOLITE_VSR = "bronquiolite_vsr"
}

// Interfaces para Bronquiolite VSR
export interface BronquioliteVSRInput {
  frequenciaRespiratoria: number;
  retracao: 'ausente' | 'leve' | 'moderada' | 'grave';
  saturacao: number;
  alimentacao: 'normal' | 'reduzida' | 'minima';
  estadoGeral: 'normal' | 'irritado' | 'letargico' | 'toxemiado';
  apneia: boolean;
  cianose: boolean;
  idadeMeses: number;
  prematuro: boolean;
  comorbidades: boolean;
  condicoesSociais: boolean;
  distanciaServico: boolean;
  insuficienciaRespiratoria: boolean;
  apneiaRecorrente: boolean;
  pioraProgressiva: boolean;
  jaEmOxigenio: boolean;
  acidoseRespiratoria: boolean;
}

export interface BronquioliteVSRGravidade {
  gravidade: 'leve' | 'moderada' | 'grave';
  criteriosLeve: number;
  criteriosModerada: number;
  criteriosGrave: number;
  descricao: string[];
  manejo: string[];
}

export interface BronquioliteVSRInternacao {
  indicacaoInternacao: boolean;
  criteriosPresentes: string[];
}

export interface BronquioliteVSRUTI {
  indicacaoUTI: boolean;
  criteriosPresentes: string[];
}

export interface BronquioliteVSRAlta {
  podeAlta: boolean;
  criteriosAlta: string[];
  orientacoes?: string[];
  observacao?: string;
}

export interface BronquioliteVSRTratamento {
  categoria: string;
  itens: string[];
  detalhes?: {
    terapia: string;
    recomendacao: string;
    justificativa: string;
  }[];
}

export interface BronquioliteVSRResult {
  gravidade: BronquioliteVSRGravidade;
  internacao: BronquioliteVSRInternacao;
  uti: BronquioliteVSRUTI;
  alta: BronquioliteVSRAlta;
  tratamento: BronquioliteVSRTratamento[];
}

// Interface para Crise Álgica Anemia Falciforme
export interface CriseAlgicaAnemiaFalciformeInput {
  peso: number;
  idadeAnos: number;
  intensidadeDor: number; // Escala 0-10
  sinaisToxicidade: boolean;
  hidratacao: 'normal' | 'desidratado_leve' | 'desidratado_moderado' | 'desidratado_grave';
  ingestaOral: 'normal' | 'prejudicada' | 'impossivel';
  febre: 'ausente' | 'baixa' | 'moderada' | 'alta';
  sintomas: {
    sintomasRespiratorios: boolean;
    dorToracica: boolean;
    sintomasAbdominais: boolean;
    priapismo: boolean;
    seqestroEsplenico: boolean;
  };
  vomitosPersistentes: boolean;
}

export interface CriseAlgicaAnemiaFalciformeMedicamento {
  medicamento: string;
  dose: string;
  doseMaxima?: string;
  observacao?: string;
  doseCalculada?: string;
  frequencia?: string;
}

export interface CriseAlgicaAnemiaFalciformeHidratacao {
  volumeManutencao: number;
  volumeManutencaoHora: number;
  volumeExpansao?: number;
}

export interface CriseAlgicaAnemiaFalciformeComplicacao {
  nome: string;
  manejo: string[];
}

export interface CriseAlgicaAnemiaFalciformeInternacao {
  necessitaInternacao: boolean;
  justificativas: string[];
}

export interface CriseAlgicaAnemiaFalciformeAvaliacao {
  gravidadeDor: 'leve' | 'moderada' | 'intensa';
  complicacoes: string[];
}

export interface CriseAlgicaAnemiaFalciformeRecomendacoes {
  hidratacao: CriseAlgicaAnemiaFalciformeHidratacao;
  medicamentos: CriseAlgicaAnemiaFalciformeMedicamento[];
  exames: string[];
  complicacoes: CriseAlgicaAnemiaFalciformeComplicacao[];
}

export interface CriseAlgicaAnemiaFalciformeResult {
  dadosPaciente: {
    peso: number;
    idadeAnos: number;
    intensidadeDor: number;
  };
  avaliacao: CriseAlgicaAnemiaFalciformeAvaliacao;
  recomendacoes: CriseAlgicaAnemiaFalciformeRecomendacoes;
  internacao: CriseAlgicaAnemiaFalciformeInternacao;
  criteriosAlta: string[];
}

// Interface para Doença Diarreica
export interface DoencaDiarreicaInput {
  peso: number;
  idadeMeses: number;
  diasDuracao: number;
  sinaisDesidratacao: {
    // Estado geral
    alerta: boolean;
    inquieto: boolean;
    letargia: boolean;
    // Olhos
    olhosNormais: boolean;
    olhosFundos: boolean;
    olhosMuitoFundos: boolean;
    // Mucosas
    mucosasUmidas: boolean;
    mucosasSecas: boolean;
    mucosasMuitoSecas: boolean;
    // Turgor cutâneo
    turgorNormal: boolean;
    turgorDiminuido: boolean;
    turgorMuitoDiminuido: boolean;
    // Sede e ingestão
    sedeNormal: boolean;
    sedeAumentada: boolean;
    incapazBeber: boolean;
    // Lágrimas
    lagrimasPresentes: boolean;
    lagrimasAusentes: boolean;
    // Respiração
    respiracaoNormal: boolean;
    respiracaoRapida: boolean;
    respiracaoAcidotica: boolean;
    // Pulso
    pulsoNormal: boolean;
    pulsoRapido: boolean;
    pulsoAusente: boolean;
    // Extremidades
    extremidadesAquecidas: boolean;
    extremidadesFrias: boolean;
    extremidadesCianoticas: boolean;
    // Pressão arterial
    paNormal: boolean;
    paBaixa: boolean;
    paIndetectavel: boolean;
    // Diurese
    diureseNormal: boolean;
    diureseDiminuida: boolean;
    anuria: boolean;
  };
  diarreiaSangue: boolean;
  febreAlta: boolean;
  vomitos: boolean;
  aleitamentoMaterno: boolean;
}

export interface DoencaDiarreicaPlanoHidratacao {
  titulo: string;
  instrucoes: string[];
  sinaisAlerta?: string[];
}

export interface DoencaDiarreicaResult {
  grauDesidratacao: 'sem_desidratacao' | 'moderada' | 'grave';
  perdaLiquidosEstimada: number;
  planoHidratacao: DoencaDiarreicaPlanoHidratacao;
  tro: string;
  criteriosInternacao: boolean;
  diarreiaClassificacao: 'aguda' | 'persistente' | 'com sangue';
  recomendacoesDiarreiaSangue: string[];
  recomendacoesDiarreiaPersistente: string[];
  recomendacoesAdicionais: string[];
}

// Glomerulonefrite
export interface GlomerulonefriteInput {
  peso: number;
  idadeAnos: number;
  idadeMeses: number;
  sintomas: {
    oliguria: boolean;
    edemaFacial: boolean;
    edemaGeneralizado: boolean;
    dorLombar: boolean;
    hipertensao: boolean;
    hipertensaoGrave: boolean;
    hematuriaMacroscopica: boolean;
    hematuriaMicroscopica: boolean;
    proteinuria: boolean;
    nauseasVomitos: boolean;
    palidez: boolean;
    nicturia: boolean;
  };
  complicacoes: {
    insuficienciaCardiaca: boolean;
    encefalopatiaHipertensiva: boolean;
    insuficienciaRenal: boolean;
    uremiaImportante: boolean;
    sobrecargaVolemica: boolean;
  };
  examesAlterados: string[];
  antibioticoEscolhido?: string;
  antiHipertensivoEscolhido?: string;
}

export interface GlomerulonefriteAntibiotico {
  nome: string;
  dose: string;
  via: string;
  frequencia: string;
  doseTotal?: string;
  observacao?: string;
}

export interface GlomerulonefriteAntiHipertensivo {
  nome: string;
  doseMin: string;
  doseMax: string;
  via: string;
  frequencia: string;
  observacao?: string;
}

export interface GlomerulonefriteResult {
  idadeAnos: number;
  idadeMeses: number;
  peso: number;
  sintomasPresentes: string[];
  examesAlterados: string[];
  diagnosticoProvavel: boolean;
  necessitaInternacao: boolean;
  criteriosInternacao: string[];
  antibiotico: GlomerulonefriteAntibiotico;
  necessitaAntiHipertensivo: boolean;
  antiHipertensivo?: GlomerulonefriteAntiHipertensivo;
  examesRecomendados: string[];
  medidasGerais: string[];
  recomendacoesSeguimento: string[];
  criteriosAlta: string[];
}

// Parada Cardiorrespiratória
export interface ParadaCardiorrespiratoriaInput {
  peso: number;
  idadeAnos: number;
  ritmo?: 'Assistolia' | 'AESP' | 'Fibrilacao_Ventricular' | 'Taquicardia_Ventricular';
  socorristas: 1 | 2;
  viaAereaAvancada: boolean;
}

export interface ParadaCardiorrespiratoriaRitmo {
  nome: string;
  chocavel: boolean;
  descricao: string;
  caracteristicas: string[];
  tratamento: string[];
}

export interface ParadaCardiorrespiratoriaDoses {
  adrenalina: {
    doseMg: number;
    doseML: number;
    solucao: string;
    frequencia: string;
    via: string;
    observacao: string;
  };
  amiodarona: {
    doseMg: number;
    indicacao: string;
    via: string;
  };
  lidocaina: {
    doseMg: number;
    indicacao: string;
    via: string;
  };
  sulfatoMagnesio: {
    doseMinMg: number;
    doseMaxMg: number;
    indicacao: string;
    via: string;
  };
  bicarbonato: {
    doseMEq: number;
    doseML: number;
    solucao: string;
    indicacao: string;
    via: string;
    observacao: string;
  };
}

export interface ParadaCardiorrespiratoriaResult {
  peso: number;
  idadeAnos: number;
  doses: ParadaCardiorrespiratoriaDoses;
  desfibrilacao: {
    primeiraDose: number;
    dosesSubsequentes: number;
    doseMaxima: number;
  };
  compressao: {
    profundidade: string;
    frequencia: string;
    relacao: string;
  };
  acesso: string;
  causasReversiveis: string[];
  ritmo?: ParadaCardiorrespiratoriaRitmo;
}

// ==================== PNEUMONIA ====================
export interface PneumoniaInput {
  idadeMeses: number;
  freqRespiratoria: number;
  saturacaoO2: number;
  retracoes: 'ausentes' | 'leves' | 'moderadas' | 'graves';
  alimentacao: 'normal' | 'reduzida' | 'recusa';
  estadoGeral: 'bom' | 'irritado' | 'toxemiado';
  cianose: boolean;
  apneia: boolean;
  letargia: boolean;
  prematuro: boolean;
  comorbidades: boolean;
  condicoesSociaisDesfavoraveis: boolean;
  dificuldadeAcesso: boolean;
  falhaTratamento: boolean;
  insuficienciaRespiratoria: boolean;
  desconfortoProgressivo: boolean;
  oxigenoterapia: boolean;
  acidoseRespiratoria: boolean;
  derramepleural: boolean;
  pneumoniaComplicada: boolean;
  suspeitaAspiracao: boolean;
  suspeitaAtipicos: boolean;
}

export interface FrequenciaRespiratoriaReferencia {
  idadeMeses: number;
  idadeAnos: number;
  normal: string;
  elevada: string;
  alerta: string;
}

export interface PneumoniaAntibiotico {
  medicamento: string;
  dose: string;
  duracao: string;
  via?: string;
  primeiraLinha: boolean;
}

export interface PneumoniaTratamento {
  indicacao: boolean;
  antibioticos: PneumoniaAntibiotico[];
}

export interface PneumoniaAvaliacaoInternacao {
  necessitaInternacao: boolean;
  criterios: string[];
}

export interface PneumoniaAvaliacaoUTI {
  necessitaUTI: boolean;
  criterios: string[];
}

export interface PneumoniaResult {
  idadeMeses: number;
  gravidade: 'leve' | 'moderada' | 'grave';
  etiologiaProvavel: string[];
  frequenciaRespiratoriaReferencia: FrequenciaRespiratoriaReferencia;
  necessidadeInternacao: PneumoniaAvaliacaoInternacao;
  necessidadeUTI: PneumoniaAvaliacaoUTI;
  tratamentoAmbulatorial: PneumoniaTratamento;
  tratamentoHospitalar: PneumoniaTratamento;
  examesRecomendados: string[];
}

// ==================== POLITRAUMATISMO ====================
export interface PolitraumatismoInput {
  idadeAnos: number;
  idadeMeses: number;
  aberturaOlhos: number;
  respostaVerbal: number;
  respostaMotora: number;
  
  // Parâmetros de vias aéreas
  respiracaoTrabalhosaRuidosa: boolean;
  taquipneia: boolean;
  bradipneia: boolean;
  respiracaoSuperficial: boolean;
  expansibilidadeReduzida: boolean;
  
  // Parâmetros hemodinâmicos
  taquicardia: boolean;
  peleFriaUmida: boolean;
  bradicardia: boolean;
  pulsoFinoFracoFiliforme: boolean;
  debitoUrinarioReduzidoAusente: boolean;
  enchimentoCapilarProlongado: boolean;
  ansiedadeIrritabilidadeConfusaoLetargia: boolean;
}

export interface GlasgowScore {
  scoreTotal: number;
  gravidade: 'Leve' | 'Moderado' | 'Grave';
  alerta: string;
}

export interface AvaliacaoComprometimento {
  nivelComprometimento: 'Baixo' | 'Moderado' | 'Alto';
  intervencoes: string[];
}

export interface AvaliacaoViasAereas extends AvaliacaoComprometimento {
  parametros: string[];
}

export interface AvaliacaoHemodinamica extends AvaliacaoComprometimento {
  parametros: string[];
}

export interface RecomendacaoABCDE {
  etapa: string;
  acoes: string[];
}

export interface AvaliacaoUTI {
  necessidadeUTI: boolean;
  criterios: string[];
}

export interface PolitraumatismoResult {
  idade: {
    anos: number;
    meses: number;
    totalMeses: number;
  };
  glasgow: GlasgowScore;
  viasAereas: AvaliacaoViasAereas;
  hemodinamica: AvaliacaoHemodinamica;
  recomendacoesABCDE: RecomendacaoABCDE[];
  avaliacaoUTI: AvaliacaoUTI;
}

// ==================== SIM-P ====================
export interface SimPInput {
  idadeAnos: number;
  
  // Critérios OMS
  febre3Dias: boolean;
  erupcaoConjuntivite: boolean;
  hipotensaoChoque: boolean;
  disfuncaoCardiaca: boolean;
  coagulopatia: boolean;
  manifestacoesGI: boolean;
  marcadoresInflamacao: boolean;
  semCausaMicrobiana: boolean;
  evidenciaCovid: boolean;
  
  // Critérios CDC
  febre24h: boolean;
  inflamacaoLab: boolean;
  doencaGrave: boolean;
  sistemaCardiaco: boolean;
  sistemaRenal: boolean;
  sistemaRespiratorio: boolean;
  sistemaHematologico: boolean;
  sistemaGastrointestinal: boolean;
  sistemaDermatologico: boolean;
  sistemaNeurologico: boolean;
  semDiagnosticoAlternativo: boolean;
  
  // Critérios de gravidade
  hipotensaoChoqueRefratario: boolean;
  disfuncaoMiocardica: boolean;
  arritmias: boolean;
  aneurismasCoronarianos: boolean;
  alteracaoNeurologica: boolean;
  insuficienciaRespiratoria: boolean;
  insuficienciaRenal: boolean;
  coagulopatiaSignificativa: boolean;
}

export interface AvaliacaoOMSSimP {
  atendecriterios: boolean;
  idadeOk: boolean;
  febre3Dias: boolean;
  numCriteriosAdicionais: number;
  criteriosAdicionaisOk: boolean;
  marcadoresInflamacao: boolean;
  semCausaMicrobiana: boolean;
  evidenciaCovid: boolean;
}

export interface AvaliacaoCDCSimP {
  atendecriterios: boolean;
  idadeOk: boolean;
  febre24h: boolean;
  inflamacaoLab: boolean;
  doencaGrave: boolean;
  numSistemas: number;
  sistemasOk: boolean;
  semDiagnosticoAlternativo: boolean;
  evidenciaCovid: boolean;
}

export interface AvaliacaoGravidadeSimP {
  gravidade: 'Leve' | 'Moderado' | 'Grave';
  numCriteriosGravidade: number;
}

export interface SimPResult {
  avaliacaoOMS: AvaliacaoOMSSimP;
  avaliacaoCDC: AvaliacaoCDCSimP;
  avaliacaoGravidade: AvaliacaoGravidadeSimP;
  recomendacoes: string[];
}

// ==================== SRAG ====================
export interface SragInput {
  // Critérios PALICC básicos
  criterioTempo: boolean;
  criterioOrigemEdema: boolean;
  criterioImagemRadiologica: boolean;
  
  // Critérios especiais
  criterioDoencaCardiacaCongenita: boolean;
  criterioDoencaPulmonarCronica: boolean;
  
  // Dados para cálculo de índices
  pao2?: number;
  spo2?: number;
  fio2: number;
  pmva?: number; // Pressão média de vias aéreas
  ventilacaoMecanica: 'invasiva' | 'nao_invasiva' | 'sem_suporte';
  
  // Dados clínicos para recomendações
  pressaoPlato?: number;
  hipertensaoPulmonar: boolean;
  disfuncaoVD: boolean;
  trocasGasosasInadequadas: boolean;
}

export interface CriterioPALICC {
  criterio: string;
  definicao: string;
}

export interface CriterioEspecial {
  criterio: string;
  definicao: string;
}

export interface IndicesOxigenacao {
  io?: number; // Índice de Oxigenação
  iso?: number; // Índice Saturação de Oxigênio
  pfRatio?: number; // PaO2/FiO2
  sfRatio?: number; // SpO2/FiO2
  gravidade: string;
}

export interface RecomendacaoTerapeutica {
  terapia: string;
  recomendacao: string;
  prioridade: 'alta' | 'média' | 'baixa';
}

export interface RecomendacoesSRAG {
  recomendacoesPositivas: RecomendacaoTerapeutica[];
  recomendacoesNegativas: RecomendacaoTerapeutica[];
}

export interface SragResult {
  diagnosticoSDRA: boolean;
  criteriosAtendidos: CriterioPALICC[];
  criteriosNaoAtendidos: CriterioPALICC[];
  criteriosEspeciaisAplicaveis: CriterioEspecial[];
  indices: IndicesOxigenacao;
  recomendacoes: RecomendacoesSRAG;
}

// ==================== VIOLÊNCIA SEXUAL ====================
export interface ViolenciaSexualInput {
  idade: number;
  peso: number;
  altura: number;
  tempoDesdeOcorrido: number; // horas
  riscoHIV: boolean;
  menarca: boolean;
  sinais_fisicos?: number[];
  sinais_comportamentais?: number[];
}

export interface ViolenciaSexualProfilaxiaIST {
  infeccao: string;
  medicamento: string;
  dose: string;
  via: string;
}

export interface ViolenciaSexualProfilaxiaHIV {
  categoria: 'crianca' | 'adolescente';
  criterio: string;
  medicamentos: Array<{ nome: string; dose: string }>;
  alternativa?: Array<{ nome: string; dose: string }>;
  duracao: string;
  observacao: string;
}

export interface ViolenciaSexualContracepcao {
  medicamento: string;
  dose: string;
  prazoMaximo: string;
}

export interface ViolenciaSexualResult {
  idade: number;
  peso: number;
  casoAgudo: boolean;
  caso_agudo?: boolean; // alias para compatibilidade
  tempoDesdeOcorrido: number;
  sinaisFisicos: string[];
  sinaisComportamentais: string[];
  sinais_fisicos_presentes?: string[];
  sinais_comportamentais_presentes?: string[];
  nivel_gravidade?: string;
  eh_adolescente?: boolean;
  recomendacoes_notificacao?: string[];
  recomendacoes_medicamentos?: string[];
  recomendacoes?: string[];
  encaminhamentos?: string[];
  indicacao_profilaxia_ist?: boolean;
  indicacao_profilaxia_hiv?: boolean;
  indicacao_contracepcao?: boolean;
  indicacoes: {
    profilaxiaIST: boolean;
    profilaxiaHIV: boolean;
    contracepcaoEmergencia: boolean;
  };
  profilaxias: {
    ists: ViolenciaSexualProfilaxiaIST[];
    hiv?: ViolenciaSexualProfilaxiaHIV;
    contracepcao: ViolenciaSexualContracepcao[];
  };
  imunizacoes: Array<{ vacina: string; indicacao: string }>;
  condutas: string[];
  observacoes: string[];
}
