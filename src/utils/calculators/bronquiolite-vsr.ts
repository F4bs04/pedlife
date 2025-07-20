import type {
  BronquioliteVSRInput,
  BronquioliteVSRResult,
  BronquioliteVSRGravidade,
  BronquioliteVSRInternacao,
  BronquioliteVSRUTI,
  BronquioliteVSRAlta,
  BronquioliteVSRTratamento
} from '../../types/protocol-calculators';

/**
 * Calculadora para Bronquiolite VSR em Pediatria
 * Baseada nas diretrizes médicas para diagnóstico, classificação de gravidade e manejo da bronquiolite VSR
 */
class BronquioliteVSRCalculator {
  private classificacaoGravidade = {
    leve: {
      criterios: [
        "Frequência respiratória < 60 irpm em lactentes",
        "Retrações leves ou ausentes",
        "Saturação de O₂ > 95% em ar ambiente",
        "Boa aceitação alimentar (> 75% da ingesta habitual)",
        "Ausência de toxemia"
      ],
      manejo: [
        "Tratamento domiciliar",
        "Hidratação oral",
        "Desobstrução nasal",
        "Orientações aos pais sobre sinais de alerta",
        "Reavaliação em 24-48 horas ou antes se piora"
      ]
    },
    moderada: {
      criterios: [
        "Frequência respiratória entre 60-70 irpm em lactentes",
        "Retrações moderadas",
        "Saturação de O₂ entre 90-95% em ar ambiente",
        "Dificuldade alimentar (50-75% da ingesta habitual)",
        "Irritabilidade"
      ],
      manejo: [
        "Considerar observação em pronto-socorro por 4-6 horas",
        "Oxigenioterapia se saturação < 92%",
        "Hidratação oral ou intravenosa conforme aceitação",
        "Avaliar necessidade de internação",
        "Se melhora: alta com orientações e retorno em 24 horas",
        "Se persistência ou piora: internar"
      ]
    },
    grave: {
      criterios: [
        "Frequência respiratória > 70 irpm em lactentes",
        "Retrações graves (intercostais, subdiafragmáticas, supraesternais)",
        "Batimento de asa de nariz, gemência",
        "Saturação de O₂ < 90% em ar ambiente",
        "Incapacidade de alimentação (< 50% da ingesta habitual)",
        "Letargia",
        "Cianose",
        "Apneia"
      ],
      manejo: [
        "Internação hospitalar",
        "Oxigenioterapia",
        "Monitorização contínua",
        "Hidratação intravenosa ou por sonda nasogástrica",
        "Considerar UTI se insuficiência respiratória, apneia recorrente ou deterioração clínica"
      ]
    }
  };

  private criteriosInternacao = [
    "Hipoxemia (saturação de O₂ < 90-92% em ar ambiente)",
    "Desconforto respiratório moderado a grave",
    "Apneia",
    "Incapacidade de manter hidratação adequada",
    "Idade < 2-3 meses",
    "Prematuros < 35 semanas nas primeiras 12 semanas de vida",
    "Comorbidades (cardiopatia, pneumopatia, imunodeficiência)",
    "Condições sociais desfavoráveis",
    "Distância do serviço de saúde"
  ];

  private criteriosUTI = [
    "Insuficiência respiratória com necessidade de ventilação mecânica",
    "Apneia recorrente",
    "Desconforto respiratório grave e progressivo",
    "Saturação de O₂ < 90% apesar de oxigenoterapia",
    "Acidose respiratória (pH < 7,25)"
  ];

  private criteriosAlta = [
    "Frequência respiratória adequada para a idade",
    "Ausência ou mínimo desconforto respiratório",
    "Saturação de O₂ ≥ 92-94% em ar ambiente por pelo menos 12-24 horas",
    "Boa aceitação alimentar",
    "Pais/cuidadores orientados sobre sinais de alerta",
    "Condições sociais favoráveis"
  ];

  private tratamentosNaoRecomendados = [
    {
      terapia: "Broncodilatadores",
      recomendacao: "Não recomendados de rotina",
      justificativa: "Estudos mostram pouco ou nenhum benefício na evolução da doença"
    },
    {
      terapia: "Corticosteroides",
      recomendacao: "Não recomendados para tratamento de bronquiolite",
      justificativa: "Estudos não demonstram eficácia na redução do tempo de internação, gravidade ou duração dos sintomas"
    },
    {
      terapia: "Adrenalina nebulizada",
      recomendacao: "Não recomendada de rotina",
      justificativa: "Pode trazer benefício transitório em ambiente hospitalar, mas sem impacto na evolução da doença"
    },
    {
      terapia: "Antibióticos",
      recomendacao: "Não recomendados na ausência de infecção bacteriana comprovada ou fortemente suspeita",
      justificativa: "Ineficazes contra infecções virais e podem contribuir para resistência bacteriana"
    }
  ];

  private orientacoesDomiciliares = [
    "Explicar aos pais/cuidadores sobre a evolução natural da doença, incluindo persistência da tosse por 2-3 semanas",
    "Realizar medidas de desobstrução nasal com soro fisiológico regularmente",
    "Garantir hidratação adequada, oferecendo pequenos volumes com maior frequência",
    "Monitorar sinais de esforço respiratório, hidratação e alimentação",
    "Retornar imediatamente se ocorrer piora do quadro: aumento do desconforto respiratório, recusa alimentar, sonolência excessiva",
    "Evitar exposição ao fumo passivo e a pessoas com infecções respiratórias",
    "Manter aleitamento materno, se aplicável"
  ];

  /**
   * Avalia a gravidade da bronquiolite com base nos critérios fornecidos
   */
  private avaliarGravidade(dados: BronquioliteVSRInput): BronquioliteVSRGravidade {
    // Inicializa contadores para critérios de cada categoria
    let criteriosLeve = 0;
    let criteriosModerada = 0;
    let criteriosGrave = 0;

    // Avalia critérios de frequência respiratória
    const fr = dados.frequenciaRespiratoria;
    if (fr < 60) {
      criteriosLeve += 1;
    } else if (fr >= 60 && fr <= 70) {
      criteriosModerada += 1;
    } else if (fr > 70) {
      criteriosGrave += 1;
    }

    // Avalia critérios de retração
    const retracao = dados.retracao;
    if (retracao === "ausente" || retracao === "leve") {
      criteriosLeve += 1;
    } else if (retracao === "moderada") {
      criteriosModerada += 1;
    } else if (retracao === "grave") {
      criteriosGrave += 1;
    }

    // Avalia critérios de saturação
    const saturacao = dados.saturacao;
    if (saturacao > 95) {
      criteriosLeve += 1;
    } else if (saturacao >= 90 && saturacao <= 95) {
      criteriosModerada += 1;
    } else if (saturacao < 90) {
      criteriosGrave += 1;
    }

    // Avalia critérios de alimentação
    const alimentacao = dados.alimentacao;
    if (alimentacao === "normal") {
      criteriosLeve += 1;
    } else if (alimentacao === "reduzida") {
      criteriosModerada += 1;
    } else if (alimentacao === "minima") {
      criteriosGrave += 1;
    }

    // Avalia critérios de estado geral
    const estadoGeral = dados.estadoGeral;
    if (estadoGeral === "normal") {
      criteriosLeve += 1;
    } else if (estadoGeral === "irritado") {
      criteriosModerada += 1;
    } else if (estadoGeral === "letargico" || estadoGeral === "toxemiado") {
      criteriosGrave += 1;
    }

    // Avalia presença de sinais de alerta graves
    if (dados.apneia || dados.cianose) {
      criteriosGrave += 2; // Aumenta a pontuação de critérios graves
    }

    // Determina a gravidade com base nos critérios
    let gravidade: 'leve' | 'moderada' | 'grave' = "leve";
    if (criteriosGrave >= 1) {
      gravidade = "grave";
    } else if (criteriosModerada >= 2) {
      gravidade = "moderada";
    }

    return {
      gravidade,
      criteriosLeve,
      criteriosModerada,
      criteriosGrave,
      descricao: this.classificacaoGravidade[gravidade].criterios,
      manejo: this.classificacaoGravidade[gravidade].manejo
    };
  }

  /**
   * Avalia se há critérios para internação hospitalar
   */
  private avaliarInternacao(dados: BronquioliteVSRInput, gravidade: string): BronquioliteVSRInternacao {
    const criteriosPresentes: string[] = [];

    // Verificar critérios específicos para internação
    if (dados.saturacao < 92) {
      criteriosPresentes.push("Hipoxemia (saturação de O₂ < 92% em ar ambiente)");
    }

    if (dados.retracao === "moderada" || dados.retracao === "grave") {
      criteriosPresentes.push("Desconforto respiratório moderado a grave");
    }

    if (dados.apneia) {
      criteriosPresentes.push("Apneia");
    }

    if (dados.alimentacao === "minima") {
      criteriosPresentes.push("Incapacidade de manter hidratação adequada");
    }

    // Verificar fatores de risco
    if (dados.idadeMeses < 3) {
      criteriosPresentes.push("Idade < 3 meses");
    }

    if (dados.prematuro && dados.idadeMeses < 12) {
      criteriosPresentes.push("Prematuro < 35 semanas nas primeiras 12 semanas de vida");
    }

    if (dados.comorbidades) {
      criteriosPresentes.push("Presença de comorbidades");
    }

    if (dados.condicoesSociais) {
      criteriosPresentes.push("Condições sociais desfavoráveis");
    }

    if (dados.distanciaServico) {
      criteriosPresentes.push("Distância do serviço de saúde");
    }

    // Gravidade como critério de internação
    if (gravidade === "grave") {
      if (!criteriosPresentes.includes("Desconforto respiratório moderado a grave")) {
        criteriosPresentes.push("Bronquiolite grave");
      }
    }

    return {
      indicacaoInternacao: criteriosPresentes.length > 0,
      criteriosPresentes
    };
  }

  /**
   * Avalia se há critérios para internação em UTI
   */
  private avaliarUTI(dados: BronquioliteVSRInput): BronquioliteVSRUTI {
    const criteriosPresentes: string[] = [];

    // Verificar critérios específicos para UTI
    if (dados.insuficienciaRespiratoria) {
      criteriosPresentes.push("Insuficiência respiratória com necessidade de ventilação mecânica");
    }

    if (dados.apneiaRecorrente) {
      criteriosPresentes.push("Apneia recorrente");
    }

    if (dados.retracao === "grave" && dados.pioraProgressiva) {
      criteriosPresentes.push("Desconforto respiratório grave e progressivo");
    }

    if (dados.saturacao < 90 && dados.jaEmOxigenio) {
      criteriosPresentes.push("Saturação de O₂ < 90% apesar de oxigenoterapia");
    }

    if (dados.acidoseRespiratoria) {
      criteriosPresentes.push("Acidose respiratória (pH < 7,25)");
    }

    return {
      indicacaoUTI: criteriosPresentes.length > 0,
      criteriosPresentes
    };
  }

  /**
   * Verifica critérios de alta hospitalar, se aplicável
   */
  private recomendarAlta(gravidade: string): BronquioliteVSRAlta {
    if (gravidade === "leve") {
      return {
        podeAlta: true,
        criteriosAlta: this.criteriosAlta,
        orientacoes: this.orientacoesDomiciliares
      };
    } else if (gravidade === "moderada") {
      return {
        podeAlta: false,
        criteriosAlta: this.criteriosAlta,
        observacao: "Considerar alta após período de observação (4-6 horas) se houver melhora do quadro"
      };
    } else { // grave
      return {
        podeAlta: false,
        criteriosAlta: this.criteriosAlta,
        observacao: "Internação recomendada. Alta apenas após resolução dos critérios de gravidade."
      };
    }
  }

  /**
   * Recomenda medidas de tratamento com base na gravidade
   */
  private recomendarTratamento(gravidade: string, dados: BronquioliteVSRInput): BronquioliteVSRTratamento[] {
    const recomendacoes: BronquioliteVSRTratamento[] = [];

    // Medidas de suporte
    const medidasSuporte: BronquioliteVSRTratamento = {
      categoria: "Medidas Gerais de Suporte",
      itens: []
    };

    // Oxigenoterapia
    if (gravidade === "grave" || dados.saturacao < 92) {
      medidasSuporte.itens.push("Oxigenoterapia para manter saturação ≥ 92-94%");
    }

    // Hidratação
    if (gravidade === "leve") {
      medidasSuporte.itens.push("Manter hidratação oral adequada");
    } else if (gravidade === "moderada") {
      if (dados.alimentacao === "reduzida") {
        medidasSuporte.itens.push("Oferecer volumes menores, com maior frequência");
        medidasSuporte.itens.push("Monitorar aceitação e considerar hidratação IV se necessário");
      } else {
        medidasSuporte.itens.push("Manter hidratação oral adequada");
      }
    } else { // grave
      if (dados.alimentacao === "minima") {
        medidasSuporte.itens.push("Hidratação intravenosa ou por sonda nasogástrica");
      } else {
        medidasSuporte.itens.push("Oferecer volumes menores, com maior frequência");
        medidasSuporte.itens.push("Considerar hidratação IV se piora da aceitação");
      }
    }

    // Desobstrução nasal
    medidasSuporte.itens.push("Desobstrução nasal com soro fisiológico");

    // Posicionamento
    medidasSuporte.itens.push("Elevação da cabeceira a 30°");

    // Monitorização
    if (gravidade === "moderada" || gravidade === "grave") {
      medidasSuporte.itens.push("Monitorização de sinais vitais e oximetria");
    }

    recomendacoes.push(medidasSuporte);

    // Terapias medicamentosas
    const terapiasMedicamentosas: BronquioliteVSRTratamento = {
      categoria: "Terapias Medicamentosas",
      itens: ["Não são recomendados de rotina: broncodilatadores, corticosteroides, adrenalina nebulizada ou antibióticos para bronquiolite viral"],
      detalhes: this.tratamentosNaoRecomendados
    };

    // Solução salina hipertônica pode ser considerada em casos específicos
    if (gravidade === "moderada" || gravidade === "grave") {
      terapiasMedicamentosas.itens.push("Pode-se considerar nebulização com solução salina hipertônica 3% em pacientes internados (benefício modesto)");
    }

    recomendacoes.push(terapiasMedicamentosas);

    return recomendacoes;
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: BronquioliteVSRInput): BronquioliteVSRResult {
    // Avaliação de gravidade
    const resultadoGravidade = this.avaliarGravidade(dados);
    const gravidade = resultadoGravidade.gravidade;

    // Avaliação para internação
    const resultadoInternacao = this.avaliarInternacao(dados, gravidade);

    // Avaliação para UTI (se aplicável)
    const resultadoUTI = this.avaliarUTI(dados);

    // Recomendações de alta
    const resultadoAlta = this.recomendarAlta(gravidade);

    // Recomendações de tratamento
    const recomendacoesTratamento = this.recomendarTratamento(gravidade, dados);

    // Resultado final
    return {
      gravidade: resultadoGravidade,
      internacao: resultadoInternacao,
      uti: resultadoUTI,
      alta: resultadoAlta,
      tratamento: recomendacoesTratamento
    };
  }
}

// Instância singleton para uso global
export const bronquioliteVSRCalculator = new BronquioliteVSRCalculator();
