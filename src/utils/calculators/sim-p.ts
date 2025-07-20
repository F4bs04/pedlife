import { SimPInput, SimPResult, AvaliacaoOMSSimP, AvaliacaoCDCSimP, AvaliacaoGravidadeSimP } from '@/types/protocol-calculators';

/**
 * Calculadora para SIM-P (Síndrome Inflamatória Multissistêmica Pediátrica)
 * Implementa critérios diagnósticos da OMS e CDC
 */
class SimPCalculator {
  private static instance: SimPCalculator;
  
  public static getInstance(): SimPCalculator {
    if (!SimPCalculator.instance) {
      SimPCalculator.instance = new SimPCalculator();
    }
    return SimPCalculator.instance;
  }
  
  // Critérios diagnósticos da OMS
  private readonly criteriosOMS = {
    idade: "Crianças e adolescentes de 0 a 19 anos",
    febre: "Febre ≥ 3 dias",
    criteriosAdicionais: [
      "Erupção cutânea ou conjuntivite não purulenta bilateral ou sinais de inflamação mucocutânea (oral, mãos ou pés)",
      "Hipotensão ou choque",
      "Características de disfunção miocárdica, pericardite, valvulite ou anormalidades coronárias",
      "Evidência de coagulopatia (prolongamento de TP, TTPa, D-dímero elevado)",
      "Manifestações gastrointestinais agudas (diarreia, vômitos ou dor abdominal)"
    ],
    inflamacao: "Marcadores de inflamação elevados (VHS, PCR ou procalcitonina)",
    exclusao: "Nenhuma outra causa microbiana óbvia de inflamação",
    covid: "Evidência de COVID-19 (RT-PCR, teste antigênico ou sorologia positiva) ou contato provável com paciente com COVID-19"
  };
  
  // Critérios diagnósticos do CDC
  private readonly criteriosCDC = {
    idade: "Indivíduo < 21 anos",
    febre: "Febre > 38,0°C por ≥ 24h ou relato de febre subjetiva persistente por ≥ 24h",
    inflamacao: "Evidência de inflamação laboratorial",
    doencaGrave: "Evidência de doença clinicamente grave que requer hospitalização",
    multisistema: "Envolvimento multissistêmico (≥ 2 órgãos)",
    exclusao: "Ausência de diagnósticos alternativos plausíveis",
    covid: "Evidência de infecção recente ou atual por SARS-CoV-2 ou exposição à COVID-19 nas 4 semanas anteriores"
  };
  
  // Sistemas/órgãos envolvidos para critério multissistêmico
  private readonly sistemasOrgaos = [
    "Cardíaco",
    "Renal", 
    "Respiratório",
    "Hematológico",
    "Gastrointestinal",
    "Dermatológico",
    "Neurológico"
  ];
  
  // Marcadores laboratoriais de inflamação
  private readonly marcadoresInflamacao = [
    "PCR elevada",
    "VHS elevada",
    "Procalcitonina elevada",
    "Ferritina elevada",
    "D-dímero elevado",
    "IL-6 elevada",
    "Neutrofilia",
    "Linfopenia",
    "Hipoalbuminemia"
  ];
  
  // Critérios de gravidade
  private readonly criteriosGravidade = [
    "Hipotensão/choque refratário a volume",
    "Disfunção miocárdica (FE < 55%)",
    "Arritmias",
    "Aneurismas coronarianos",
    "Alteração neurológica significativa",
    "Insuficiência respiratória",
    "Insuficiência renal aguda",
    "Coagulopatia significativa"
  ];
  
  // Tratamentos
  private readonly tratamentos = {
    primeiraLinha: [
      "Imunoglobulina intravenosa (IVIG) 2g/kg em dose única",
      "Monitorização contínua dos sinais vitais",
      "Ecocardiograma na admissão e seriado",
      "Antiagregação plaquetária (AAS 3-5mg/kg/dia)"
    ],
    casosGraves: [
      "Corticosteroides (metilprednisolona 1-2mg/kg/dia)",
      "Considerar terapias biológicas (anakinra, tocilizumabe) em casos refratários",
      "Suporte hemodinâmico (considerar inotrópicos/vasopressores)",
      "Anticoagulação profilática ou terapêutica conforme avaliação"
    ]
  };
  
  // Seguimento
  private readonly seguimento = [
    "Ecocardiograma na alta e em 1-2 semanas, 4-6 semanas e 6-12 meses",
    "Avaliação cardíaca em 1-2 semanas após alta",
    "Monitoração de marcadores inflamatórios até resolução",
    "Seguimento com cardiologia por pelo menos 12 meses",
    "Seguimento com reumatologia ou imunologia por 6-12 meses"
  ];
  
  /**
   * Avalia se o paciente atende aos critérios da OMS para SIM-P
   */
  private avaliarCriteriosOMS(dados: SimPInput): AvaliacaoOMSSimP {
    const idadeOk = dados.idadeAnos >= 0 && dados.idadeAnos <= 19;
    const febre3Dias = dados.febre3Dias;
    
    const numCriteriosAdicionais = [
      dados.erupcaoConjuntivite,
      dados.hipotensaoChoque,
      dados.disfuncaoCardiaca,
      dados.coagulopatia,
      dados.manifestacoesGI
    ].filter(Boolean).length;
    
    const criteriosAdicionaisOk = numCriteriosAdicionais >= 2;
    const marcadoresInflamacao = dados.marcadoresInflamacao;
    const semCausaMicrobiana = dados.semCausaMicrobiana;
    const evidenciaCovid = dados.evidenciaCovid;
    
    const atendecriterios = idadeOk && febre3Dias && criteriosAdicionaisOk && 
                           marcadoresInflamacao && semCausaMicrobiana && evidenciaCovid;
    
    return {
      atendecriterios,
      idadeOk,
      febre3Dias,
      numCriteriosAdicionais,
      criteriosAdicionaisOk,
      marcadoresInflamacao,
      semCausaMicrobiana,
      evidenciaCovid
    };
  }
  
  /**
   * Avalia se o paciente atende aos critérios do CDC para SIM-P
   */
  private avaliarCriteriosCDC(dados: SimPInput): AvaliacaoCDCSimP {
    const idadeOk = dados.idadeAnos >= 0 && dados.idadeAnos < 21;
    const febre24h = dados.febre24h;
    const inflamacaoLab = dados.inflamacaoLab;
    const doencaGrave = dados.doencaGrave;
    
    const numSistemas = [
      dados.sistemaCardiaco,
      dados.sistemaRenal,
      dados.sistemaRespiratorio,
      dados.sistemaHematologico,
      dados.sistemaGastrointestinal,
      dados.sistemaDermatologico,
      dados.sistemaNeurologico
    ].filter(Boolean).length;
    
    const sistemasOk = numSistemas >= 2;
    const semDiagnosticoAlternativo = dados.semDiagnosticoAlternativo;
    const evidenciaCovid = dados.evidenciaCovid;
    
    const atendecriterios = idadeOk && febre24h && inflamacaoLab && doencaGrave && 
                           sistemasOk && semDiagnosticoAlternativo && evidenciaCovid;
    
    return {
      atendecriterios,
      idadeOk,
      febre24h,
      inflamacaoLab,
      doencaGrave,
      numSistemas,
      sistemasOk,
      semDiagnosticoAlternativo,
      evidenciaCovid
    };
  }
  
  /**
   * Avalia a gravidade do caso de SIM-P
   */
  private avaliarGravidade(dados: SimPInput): AvaliacaoGravidadeSimP {
    const numCriteriosGravidade = [
      dados.hipotensaoChoqueRefratario,
      dados.disfuncaoMiocardica,
      dados.arritmias,
      dados.aneurismasCoronarianos,
      dados.alteracaoNeurologica,
      dados.insuficienciaRespiratoria,
      dados.insuficienciaRenal,
      dados.coagulopatiaSignificativa
    ].filter(Boolean).length;
    
    let gravidade: 'Leve' | 'Moderado' | 'Grave' = 'Leve';
    
    if (numCriteriosGravidade >= 3) {
      gravidade = 'Grave';
    } else if (numCriteriosGravidade >= 1) {
      gravidade = 'Moderado';
    }
    
    return {
      gravidade,
      numCriteriosGravidade
    };
  }
  
  /**
   * Gera recomendações com base nos critérios e na gravidade
   */
  private gerarRecomendacoes(
    avaliacaoOMS: AvaliacaoOMSSimP, 
    avaliacaoCDC: AvaliacaoCDCSimP, 
    avaliacaoGravidade: AvaliacaoGravidadeSimP
  ): string[] {
    const recomendacoes: string[] = [];
    
    // Diagnóstico
    if (avaliacaoOMS.atendecriterios || avaliacaoCDC.atendecriterios) {
      recomendacoes.push("Diagnóstico compatível com SIM-P, recomendar internação hospitalar imediata");
      recomendacoes.push(...this.tratamentos.primeiraLinha);
      
      // Adicionar recomendações baseadas na gravidade
      if (avaliacaoGravidade.gravidade === 'Moderado' || avaliacaoGravidade.gravidade === 'Grave') {
        recomendacoes.push(...this.tratamentos.casosGraves);
      }
      
      // Seguimento
      recomendacoes.push("SEGUIMENTO RECOMENDADO:");
      recomendacoes.push(...this.seguimento);
    } else {
      const criteriosParciais_OMS = [
        avaliacaoOMS.febre3Dias,
        avaliacaoOMS.criteriosAdicionaisOk,
        avaliacaoOMS.marcadoresInflamacao,
        avaliacaoOMS.semCausaMicrobiana,
        avaliacaoOMS.evidenciaCovid
      ].filter(Boolean).length;
      
      const criteriosParciais_CDC = [
        avaliacaoCDC.febre24h,
        avaliacaoCDC.inflamacaoLab,
        avaliacaoCDC.doencaGrave,
        avaliacaoCDC.sistemasOk,
        avaliacaoCDC.semDiagnosticoAlternativo,
        avaliacaoCDC.evidenciaCovid
      ].filter(Boolean).length;
      
      if (criteriosParciais_OMS >= 3 || criteriosParciais_CDC >= 4) {
        recomendacoes.push("Critérios diagnósticos parcialmente atendidos para SIM-P");
        recomendacoes.push("Considerar internação hospitalar para observação e investigação adicional");
        recomendacoes.push("Realizar exames complementares: hemograma completo, PCR, VHS, ferritina, D-dímero, ecocardiograma");
        recomendacoes.push("Reavaliar critérios diagnósticos com resultados de exames");
      } else {
        recomendacoes.push("Critérios diagnósticos para SIM-P não atendidos");
        recomendacoes.push("Considerar diagnósticos alternativos");
        recomendacoes.push("Manter observação clínica e reavaliação periódica");
      }
    }
    
    return recomendacoes;
  }
  
  /**
   * Método principal que calcula a avaliação de SIM-P
   */
  public calcular(dados: SimPInput): SimPResult {
    try {
      // Validar dados de entrada
      if (dados.idadeAnos < 0 || dados.idadeAnos > 25) {
        throw new Error('Idade deve estar entre 0 e 25 anos');
      }
      
      // Avaliar critérios diagnósticos
      const avaliacaoOMS = this.avaliarCriteriosOMS(dados);
      const avaliacaoCDC = this.avaliarCriteriosCDC(dados);
      
      // Avaliar gravidade
      const avaliacaoGravidade = this.avaliarGravidade(dados);
      
      // Gerar recomendações
      const recomendacoes = this.gerarRecomendacoes(avaliacaoOMS, avaliacaoCDC, avaliacaoGravidade);
      
      return {
        avaliacaoOMS,
        avaliacaoCDC,
        avaliacaoGravidade,
        recomendacoes
      };
      
    } catch (error) {
      throw new Error(`Erro no cálculo de SIM-P: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}

// Exportar instância singleton
export const simPCalculator = SimPCalculator.getInstance();
