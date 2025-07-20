import type {
  PneumoniaInput,
  PneumoniaResult,
  FrequenciaRespiratoriaReferencia,
  PneumoniaAntibiotico,
  PneumoniaTratamento,
  PneumoniaAvaliacaoInternacao,
  PneumoniaAvaliacaoUTI
} from '../../types/protocol-calculators';

/**
 * Calculadora para Pneumonia em Pediatria
 * Baseada nas diretrizes de diagnóstico e tratamento da pneumonia pediátrica
 */
class PneumoniaCalculator {
  private etiologiaPorIdade = {
    "0-2_meses": [
      "Estreptococo do grupo B",
      "Enterobactérias",
      "Citomegalovírus",
      "Listeria monocytogenes",
      "Chlamydia trachomatis",
      "Ureaplasma urealyticum"
    ],
    "2_meses-5_anos": [
      "Vírus (VSR, Influenza, Parainfluenza, Adenovírus, Metapneumovírus)",
      "Streptococcus pneumoniae",
      "Haemophilus influenzae tipo B e não-tipável",
      "Staphylococcus aureus",
      "Mycoplasma pneumoniae"
    ],
    "acima_5_anos": [
      "Mycoplasma pneumoniae",
      "Chlamydophila pneumoniae",
      "Streptococcus pneumoniae",
      "Vírus (menos frequentes que em crianças menores)"
    ]
  };

  private criteriosLeve = [
    "Frequência respiratória < 60 irpm em lactentes",
    "Retrações leves ou ausentes",
    "Saturação de O₂ > 95% em ar ambiente",
    "Boa aceitação alimentar (> 75% da ingesta habitual)",
    "Ausência de toxemia"
  ];

  private criteriosModerada = [
    "Frequência respiratória entre 60-70 irpm em lactentes",
    "Retrações moderadas",
    "Saturação de O₂ entre 90-95% em ar ambiente",
    "Dificuldade alimentar (50-75% da ingesta habitual)",
    "Irritabilidade"
  ];

  private criteriosGrave = [
    "Frequência respiratória > 70 irpm em lactentes",
    "Retrações graves (intercostais, subdiafragmáticas, supraesternais)",
    "Batimento de asa de nariz, gemência",
    "Saturação de O₂ < 90% em ar ambiente",
    "Incapacidade de alimentação (< 50% da ingesta habitual)",
    "Letargia",
    "Cianose",
    "Apneia"
  ];

  private criteriosInternacao = [
    "Hipoxemia (saturação de O₂ < 90-92% em ar ambiente)",
    "Desconforto respiratório moderado a grave",
    "Idade < 2-3 meses",
    "Prematuros < 35 semanas nas primeiras 12 semanas de vida",
    "Comorbidades (cardiopatia, pneumopatia, imunodeficiência)",
    "Incapacidade de manter hidratação adequada",
    "Condições sociais desfavoráveis",
    "Distância do serviço de saúde"
  ];

  private criteriosUTI = [
    "Insuficiência respiratória com necessidade de ventilação mecânica",
    "Desconforto respiratório grave e progressivo",
    "Saturação de O₂ < 90% apesar de oxigenoterapia",
    "Acidose respiratória (pH < 7,25)"
  ];

  private frReferencia: FrequenciaRespiratoriaReferencia[] = [
    { idadeMeses: 24, idadeAnos: 2, normal: "< 40", elevada: "≥ 40", alerta: "≥ 60" },
    { idadeMeses: 60, idadeAnos: 5, normal: "< 30", elevada: "≥ 30", alerta: "≥ 40" },
    { idadeMeses: 144, idadeAnos: 12, normal: "< 25", elevada: "≥ 25", alerta: "≥ 35" },
    { idadeMeses: 216, idadeAnos: 18, normal: "< 20", elevada: "≥ 20", alerta: "≥ 30" }
  ];

  /**
   * Determina prováveis agentes etiológicos conforme faixa etária
   */
  private avaliarEtiologiaPorIdade(idadeMeses: number): string[] {
    if (idadeMeses < 2) {
      return this.etiologiaPorIdade["0-2_meses"];
    } else if (idadeMeses < 60) {
      return this.etiologiaPorIdade["2_meses-5_anos"];
    } else {
      return this.etiologiaPorIdade["acima_5_anos"];
    }
  }

  /**
   * Determina referência de frequência respiratória conforme idade
   */
  private avaliarFRReferencia(idadeMeses: number): FrequenciaRespiratoriaReferencia {
    for (const ref of this.frReferencia) {
      if (idadeMeses <= ref.idadeMeses) {
        return ref;
      }
    }
    return this.frReferencia[this.frReferencia.length - 1]; // Última faixa se acima das listadas
  }

  /**
   * Classifica a gravidade da pneumonia com base nos critérios clínicos
   */
  private classificarGravidade(dados: PneumoniaInput): 'leve' | 'moderada' | 'grave' {
    let pontosGrave = 0;
    let pontosModerada = 0;
    let pontosLeve = 0;

    // Avaliação da frequência respiratória
    const { idadeMeses, freqRespiratoria } = dados;
    const refFR = this.avaliarFRReferencia(idadeMeses);

    // Frequência respiratória
    if (idadeMeses < 12) { // Lactentes
      if (freqRespiratoria > 70) {
        pontosGrave += 1;
      } else if (freqRespiratoria >= 60) {
        pontosModerada += 1;
      } else {
        pontosLeve += 1;
      }
    } else {
      const alertaValue = parseInt(refFR.alerta.replace("≥ ", ""));
      const elevadaValue = parseInt(refFR.elevada.replace("≥ ", ""));
      
      if (freqRespiratoria >= alertaValue) {
        pontosGrave += 1;
      } else if (freqRespiratoria >= elevadaValue) {
        pontosModerada += 1;
      } else {
        pontosLeve += 1;
      }
    }

    // Saturação de oxigênio
    if (dados.saturacaoO2 < 90) {
      pontosGrave += 1;
    } else if (dados.saturacaoO2 <= 95) {
      pontosModerada += 1;
    } else {
      pontosLeve += 1;
    }

    // Retrações
    if (dados.retracoes === "graves") {
      pontosGrave += 1;
    } else if (dados.retracoes === "moderadas") {
      pontosModerada += 1;
    } else {
      pontosLeve += 1;
    }

    // Aceitação alimentar
    if (dados.alimentacao === "recusa") {
      pontosGrave += 1;
    } else if (dados.alimentacao === "reduzida") {
      pontosModerada += 1;
    } else {
      pontosLeve += 1;
    }

    // Estado geral
    if (dados.estadoGeral === "toxemiado") {
      pontosGrave += 1;
    } else if (dados.estadoGeral === "irritado") {
      pontosModerada += 1;
    } else {
      pontosLeve += 1;
    }

    // Sinais específicos de gravidade
    if (dados.cianose || dados.apneia || dados.letargia) {
      pontosGrave += 1;
    }

    // Determinar classificação final
    if (pontosGrave >= 2) {
      return "grave";
    } else if (pontosModerada >= 3 || pontosGrave === 1) {
      return "moderada";
    } else {
      return "leve";
    }
  }

  /**
   * Avalia se há necessidade de internação hospitalar
   */
  private avaliarNecessidadeInternacao(dados: PneumoniaInput, gravidade: string): PneumoniaAvaliacaoInternacao {
    const criteriosPresentes: string[] = [];

    // Avaliar hipoxemia
    if (dados.saturacaoO2 < 92) {
      criteriosPresentes.push("Hipoxemia (saturação de O₂ < 92% em ar ambiente)");
    }

    // Avaliar desconforto respiratório
    if (gravidade === "moderada" || gravidade === "grave") {
      criteriosPresentes.push("Desconforto respiratório moderado a grave");
    }

    // Avaliar idade
    if (dados.idadeMeses < 3) {
      criteriosPresentes.push("Idade < 3 meses");
    }

    // Avaliar prematuridade
    if (dados.prematuro) {
      criteriosPresentes.push("Prematuridade (< 35 semanas) nas primeiras 12 semanas de vida");
    }

    // Avaliar comorbidades
    if (dados.comorbidades) {
      criteriosPresentes.push("Presença de comorbidades significativas");
    }

    // Avaliar capacidade de manter hidratação
    if (dados.alimentacao === "recusa") {
      criteriosPresentes.push("Incapacidade de manter hidratação adequada");
    }

    // Avaliar condições sociais
    if (dados.condicoesSociaisDesfavoraveis) {
      criteriosPresentes.push("Condições sociais desfavoráveis");
    }

    // Avaliar distância do serviço de saúde
    if (dados.dificuldadeAcesso) {
      criteriosPresentes.push("Dificuldade de acesso a serviço de saúde");
    }

    // Adicionais
    if (dados.falhaTratamento) {
      criteriosPresentes.push("Falha do tratamento ambulatorial");
    }

    return {
      necessitaInternacao: criteriosPresentes.length > 0,
      criterios: criteriosPresentes
    };
  }

  /**
   * Avalia se há necessidade de cuidados intensivos
   */
  private avaliarNecessidadeUTI(dados: PneumoniaInput, gravidade: string): PneumoniaAvaliacaoUTI {
    if (gravidade !== "grave") {
      return { necessitaUTI: false, criterios: [] };
    }

    const criteriosPresentes: string[] = [];

    if (dados.insuficienciaRespiratoria) {
      criteriosPresentes.push("Insuficiência respiratória com necessidade de ventilação mecânica");
    }

    if (dados.desconfortoProgressivo) {
      criteriosPresentes.push("Desconforto respiratório grave e progressivo");
    }

    if (dados.saturacaoO2 < 90 && dados.oxigenoterapia) {
      criteriosPresentes.push("Saturação de O₂ < 90% apesar de oxigenoterapia");
    }

    if (dados.acidoseRespiratoria) {
      criteriosPresentes.push("Acidose respiratória (pH < 7,25)");
    }

    return {
      necessitaUTI: criteriosPresentes.length > 0,
      criterios: criteriosPresentes
    };
  }

  /**
   * Recomenda o tratamento adequado conforme gravidade e necessidade de internação
   */
  private recomendarTratamento(dados: PneumoniaInput, gravidade: string, avaliacaoInternacao: PneumoniaAvaliacaoInternacao): { tratamentoAmbulatorial: PneumoniaTratamento; tratamentoHospitalar: PneumoniaTratamento } {
    const { idadeMeses } = dados;

    // Tratamento ambulatorial
    const tratamentoAmbulatorial: PneumoniaTratamento = {
      indicacao: !avaliacaoInternacao.necessitaInternacao,
      antibioticos: []
    };

    // Tratamento hospitalar
    const tratamentoHospitalar: PneumoniaTratamento = {
      indicacao: avaliacaoInternacao.necessitaInternacao,
      antibioticos: []
    };

    // Recomendar antibióticos para tratamento ambulatorial
    if (idadeMeses >= 2 && idadeMeses < 60) { // 2 meses a 5 anos
      tratamentoAmbulatorial.antibioticos.push({
        medicamento: "Amoxicilina",
        dose: "50-90 mg/kg/dia, dividido a cada 8 horas",
        duracao: "7-10 dias",
        primeiraLinha: true
      });

      // Alternativas para alergia à penicilina
      tratamentoAmbulatorial.antibioticos.push({
        medicamento: "Cefalosporinas de 1ª ou 2ª geração (alergia não anafilática)",
        dose: "Conforme medicamento",
        duracao: "7-10 dias",
        primeiraLinha: false
      });

      tratamentoAmbulatorial.antibioticos.push({
        medicamento: "Macrolídeos (alergia anafilática)",
        dose: "Azitromicina 10 mg/kg no primeiro dia, seguido de 5 mg/kg/dia por 4 dias",
        duracao: "5 dias",
        primeiraLinha: false
      });

    } else if (idadeMeses >= 60) { // Maior de 5 anos
      // Considerar agentes atípicos
      if (dados.suspeitaAtipicos) {
        tratamentoAmbulatorial.antibioticos.push({
          medicamento: "Azitromicina",
          dose: "10 mg/kg no primeiro dia, seguido de 5 mg/kg/dia por 4 dias",
          duracao: "5 dias",
          primeiraLinha: true
        });
      } else {
        tratamentoAmbulatorial.antibioticos.push({
          medicamento: "Amoxicilina",
          dose: "50 mg/kg/dia, dividido a cada 8 horas",
          duracao: "7-10 dias",
          primeiraLinha: true
        });

        // Alternativas
        tratamentoAmbulatorial.antibioticos.push({
          medicamento: "Macrolídeos (se suspeita de agentes atípicos)",
          dose: "Azitromicina 10 mg/kg no primeiro dia, seguido de 5 mg/kg/dia por 4 dias",
          duracao: "5 dias",
          primeiraLinha: false
        });
      }
    }

    // Recomendar antibióticos para tratamento hospitalar
    if (idadeMeses < 2) { // 0-2 meses
      tratamentoHospitalar.antibioticos.push({
        medicamento: "Ampicilina + Gentamicina",
        dose: "Ampicilina 200 mg/kg/dia 6/6h, Gentamicina 7,5 mg/kg/dia 1x/dia",
        via: "Intravenosa",
        duracao: "10-14 dias",
        primeiraLinha: true
      });

      tratamentoHospitalar.antibioticos.push({
        medicamento: "Ampicilina + Cefotaxima",
        dose: "Ampicilina 200 mg/kg/dia 6/6h, Cefotaxima 150 mg/kg/dia 8/8h",
        via: "Intravenosa",
        duracao: "10-14 dias",
        primeiraLinha: true
      });

    } else if (idadeMeses >= 2 && idadeMeses < 60) { // 2 meses a 5 anos
      if (gravidade === "grave") {
        tratamentoHospitalar.antibioticos.push({
          medicamento: "Oxacilina + Ceftriaxona",
          dose: "Oxacilina 150-200 mg/kg/dia 6/6h, Ceftriaxona 50-100 mg/kg/dia 12/12h",
          via: "Intravenosa",
          duracao: "10-14 dias",
          primeiraLinha: true
        });
      } else {
        tratamentoHospitalar.antibioticos.push({
          medicamento: "Ampicilina ou Penicilina Cristalina",
          dose: "Ampicilina 200 mg/kg/dia 6/6h, Penicilina 200.000 UI/kg/dia 4/4h ou 6/6h",
          via: "Intravenosa",
          duracao: "7-10 dias",
          primeiraLinha: true
        });
      }

    } else if (idadeMeses >= 60) { // Maior de 5 anos
      if (dados.suspeitaAtipicos) {
        tratamentoHospitalar.antibioticos.push({
          medicamento: "Ampicilina/Penicilina + Macrolídeo",
          dose: "Ampicilina 200 mg/kg/dia 6/6h + Azitromicina 10 mg/kg no dia 1, seguido de 5 mg/kg/dia",
          via: "Intravenosa + Oral/IV",
          duracao: "7-10 dias",
          primeiraLinha: true
        });
      } else {
        tratamentoHospitalar.antibioticos.push({
          medicamento: "Ampicilina ou Penicilina Cristalina",
          dose: "Ampicilina 200 mg/kg/dia 6/6h, Penicilina 200.000 UI/kg/dia 4/4h ou 6/6h",
          via: "Intravenosa",
          duracao: "7-10 dias",
          primeiraLinha: true
        });
      }
    }

    // Para complicações
    if (dados.pneumoniaComplicada) {
      tratamentoHospitalar.antibioticos.push({
        medicamento: "Oxacilina + Ceftriaxona (pneumonia necrotizante/abscesso)",
        dose: "Oxacilina 150-200 mg/kg/dia 6/6h, Ceftriaxona 50-100 mg/kg/dia 12/12h",
        via: "Intravenosa",
        duracao: "14-21 dias",
        primeiraLinha: true
      });
    }

    if (dados.suspeitaAspiracao) {
      tratamentoHospitalar.antibioticos.push({
        medicamento: "Ampicilina/Sulbactam ou Clindamicina + Ceftriaxona",
        dose: "Ampicilina/Sulbactam 200 mg/kg/dia 6/6h, Clindamicina 40 mg/kg/dia 6/6h",
        via: "Intravenosa",
        duracao: "10-14 dias",
        primeiraLinha: true
      });
    }

    return {
      tratamentoAmbulatorial,
      tratamentoHospitalar
    };
  }

  /**
   * Método principal que processa os dados e retorna a avaliação
   */
  calcular(dados: PneumoniaInput): PneumoniaResult {
    // Classificar gravidade da pneumonia
    const gravidade = this.classificarGravidade(dados);

    // Avaliar necessidade de internação hospitalar
    const necessidadeInternacao = this.avaliarNecessidadeInternacao(dados, gravidade);

    // Avaliar necessidade de UTI
    const necessidadeUTI = this.avaliarNecessidadeUTI(dados, gravidade);

    // Recomendar tratamento
    const { tratamentoAmbulatorial, tratamentoHospitalar } = this.recomendarTratamento(dados, gravidade, necessidadeInternacao);

    // Determinar etiologia provável por idade
    const etiologiaProvavel = this.avaliarEtiologiaPorIdade(dados.idadeMeses);

    // Obter referência de frequência respiratória
    const frequenciaRespiratoriaReferencia = this.avaliarFRReferencia(dados.idadeMeses);

    // Recomendar exames complementares
    const examesRecomendados = ["Radiografia de tórax"];

    if (gravidade === "grave" || necessidadeInternacao.necessitaInternacao) {
      examesRecomendados.push(
        "Hemograma completo",
        "Proteína C reativa",
        "Gasometria arterial",
        "Hemocultura"
      );
    }

    if (dados.derramepleural) {
      examesRecomendados.push("Análise do líquido pleural");
    }

    return {
      idadeMeses: dados.idadeMeses,
      gravidade,
      etiologiaProvavel,
      frequenciaRespiratoriaReferencia,
      necessidadeInternacao,
      necessidadeUTI,
      tratamentoAmbulatorial,
      tratamentoHospitalar,
      examesRecomendados
    };
  }
}

// Instância singleton para uso global
export const pneumoniaCalculator = new PneumoniaCalculator();
