// Interfaces for Bronquiolite VSR controller
interface ClassificacaoGravidade {
  criterios: string[];
  manejo: string[];
}

interface MedidaSuporte {
  medida: string;
  indicacao: string;
  detalhes: string;
}

interface TratamentoNaoRecomendado {
  terapia: string;
  recomendacao: string;
  justificativa: string;
}

interface ResultadoGravidade {
  gravidade: string;
  criterios_leve: number;
  criterios_moderada: number;
  criterios_grave: number;
  descricao: string[];
  manejo: string[];
}

interface ResultadoInternacao {
  indicacao_internacao: boolean;
  criterios_presentes: string[];
}

interface ResultadoUTI {
  indicacao_uti: boolean;
  criterios_presentes: string[];
}

interface ResultadoAlta {
  pode_alta: boolean;
  criterios_alta: string[];
  orientacoes?: string[];
  observacao?: string;
}

interface RecomendacaoTratamento {
  categoria: string;
  itens: string[];
  detalhes?: TratamentoNaoRecomendado[];
}

interface ResultadoBronquiolite {
  gravidade: ResultadoGravidade;
  internacao: ResultadoInternacao;
  uti: ResultadoUTI;
  alta: ResultadoAlta;
  tratamento: RecomendacaoTratamento[];
}

class BronquioliteVsrController {
  private classificacao_gravidade: Record<string, ClassificacaoGravidade>;
  private criterios_internacao: string[];
  private criterios_uti: string[];
  private criterios_alta: string[];
  private tratamentos_nao_recomendados: TratamentoNaoRecomendado[];
  private orientacoes_domiciliares: string[];
  private medidas_suporte: MedidaSuporte[];

  constructor() {
    // Parâmetros para avaliação
    this.classificacao_gravidade = {
      "leve": {
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
      "moderada": {
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
      "grave": {
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
    
    this.criterios_internacao = [
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
    
    this.criterios_uti = [
      "Insuficiência respiratória com necessidade de ventilação mecânica",
      "Apneia recorrente",
      "Desconforto respiratório grave e progressivo",
      "Saturação de O₂ < 90% apesar de oxigenoterapia",
      "Acidose respiratória (pH < 7,25)"
    ];
    
    this.criterios_alta = [
      "Frequência respiratória adequada para a idade",
      "Ausência ou mínimo desconforto respiratório",
      "Saturação de O₂ ≥ 92-94% em ar ambiente por pelo menos 12-24 horas",
      "Boa aceitação alimentar",
      "Pais/cuidadores orientados sobre sinais de alerta",
      "Condições sociais favoráveis"
    ];
    
    this.tratamentos_nao_recomendados = [
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
    
    this.orientacoes_domiciliares = [
      "Explicar aos pais/cuidadores sobre a evolução natural da doença, incluindo persistência da tosse por 2-3 semanas",
      "Realizar medidas de desobstrução nasal com soro fisiológico regularmente",
      "Garantir hidratação adequada, oferecendo pequenos volumes com maior frequência",
      "Monitorar sinais de esforço respiratório, hidratação e alimentação",
      "Retornar imediatamente se ocorrer piora do quadro: aumento do desconforto respiratório, recusa alimentar, sonolência excessiva",
      "Evitar exposição ao fumo passivo e a pessoas com infecções respiratórias",
      "Manter aleitamento materno, se aplicável"
    ];
    
    this.medidas_suporte = [
      {
        medida: "Oxigenoterapia",
        indicacao: "Saturação de O₂ < 90-92% em ar ambiente ou desconforto respiratório significativo",
        detalhes: "Cateter nasal, máscara simples ou, em casos mais graves, CPAP. Manter saturação ≥ 92-94%"
      },
      {
        medida: "Hidratação",
        indicacao: "Todos os casos com aceitação oral reduzida",
        detalhes: "Via oral preferencial, em pequenos volumes e maior frequência. Via intravenosa quando houver desidratação ou recusa alimentar importante"
      },
      {
        medida: "Aspiração de vias aéreas",
        indicacao: "Quando houver obstrução por secreções",
        detalhes: "Instilação de soro fisiológico e aspiração suave, principalmente antes das alimentações"
      },
      {
        medida: "Posicionamento",
        indicacao: "Todos os pacientes",
        detalhes: "Elevação da cabeceira a 30°, evitar obstrução das vias aéreas"
      }
    ];
  }

  /**
   * Avalia a gravidade da bronquiolite com base nos critérios fornecidos
   */
  avaliarGravidade(dados: any): ResultadoGravidade {
    // Inicializa contadores para critérios de cada categoria
    let criteriosLeve = 0;
    let criteriosModerada = 0;
    let criteriosGrave = 0;
    
    // Avalia critérios de frequência respiratória
    const fr = parseInt(dados.frequencia_respiratoria || "0");
    if (fr < 60) {
      criteriosLeve += 1;
    } else if (60 <= fr && fr <= 70) {
      criteriosModerada += 1;
    } else if (fr > 70) {
      criteriosGrave += 1;
    }
        
    // Avalia critérios de retração
    const retracao = dados.retracao || "ausente";
    if (retracao === "ausente" || retracao === "leve") {
      criteriosLeve += 1;
    } else if (retracao === "moderada") {
      criteriosModerada += 1;
    } else if (retracao === "grave") {
      criteriosGrave += 1;
    }
        
    // Avalia critérios de saturação
    const saturacao = parseInt(dados.saturacao || "98");
    if (saturacao > 95) {
      criteriosLeve += 1;
    } else if (90 <= saturacao && saturacao <= 95) {
      criteriosModerada += 1;
    } else if (saturacao < 90) {
      criteriosGrave += 1;
    }
        
    // Avalia critérios de alimentação
    const alimentacao = dados.alimentacao || "normal";
    if (alimentacao === "normal") {
      criteriosLeve += 1;
    } else if (alimentacao === "reduzida") {
      criteriosModerada += 1;
    } else if (alimentacao === "minima") {
      criteriosGrave += 1;
    }
        
    // Avalia critérios de estado geral
    const estadoGeral = dados.estado_geral || "normal";
    if (estadoGeral === "normal") {
      criteriosLeve += 1;
    } else if (estadoGeral === "irritado") {
      criteriosModerada += 1;
    } else if (estadoGeral === "letargico" || estadoGeral === "toxemiado") {
      criteriosGrave += 1;
    }
        
    // Avalia presença de sinais de alerta graves
    if (dados.apneia === true || dados.cianose === true) {
      criteriosGrave += 2;  // Aumenta a pontuação de critérios graves
    }
        
    // Determina a gravidade com base nos critérios
    let gravidade = "leve";
    if (criteriosGrave >= 1) {
      gravidade = "grave";
    } else if (criteriosModerada >= 2) {
      gravidade = "moderada";
    }
        
    return {
      gravidade: gravidade,
      criterios_leve: criteriosLeve,
      criterios_moderada: criteriosModerada,
      criterios_grave: criteriosGrave,
      descricao: this.classificacao_gravidade[gravidade].criterios,
      manejo: this.classificacao_gravidade[gravidade].manejo
    };
  }

  /**
   * Avalia se há critérios para internação hospitalar
   */
  avaliarInternacao(dados: any, gravidade: string): ResultadoInternacao {
    const criteriosPresentes: string[] = [];
    
    // Verificar critérios específicos para internação
    if (parseInt(dados.saturacao || "98") < 92) {
      criteriosPresentes.push("Hipoxemia (saturação de O₂ < 92% em ar ambiente)");
    }
    
    if ((dados.retracao || "ausente") === "moderada" || (dados.retracao || "ausente") === "grave") {
      criteriosPresentes.push("Desconforto respiratório moderado a grave");
    }
    
    if (dados.apneia === true) {
      criteriosPresentes.push("Apneia");
    }
    
    if ((dados.alimentacao || "normal") === "minima") {
      criteriosPresentes.push("Incapacidade de manter hidratação adequada");
    }
    
    // Verificar fatores de risco
    if (parseInt(dados.idade_meses || "0") < 3) {
      criteriosPresentes.push("Idade < 3 meses");
    }
    
    if (dados.prematuro === true && parseInt(dados.idade_meses || "0") < 12) {
      criteriosPresentes.push("Prematuro < 35 semanas nas primeiras 12 semanas de vida");
    }
    
    if (dados.comorbidades === true) {
      criteriosPresentes.push("Presença de comorbidades");
    }
    
    if (dados.condicoes_sociais === true) {
      criteriosPresentes.push("Condições sociais desfavoráveis");
    }
    
    if (dados.distancia_servico === true) {
      criteriosPresentes.push("Distância do serviço de saúde");
    }
        
    // Gravidade como critério de internação
    if (gravidade === "grave") {
      if (!criteriosPresentes.includes("Desconforto respiratório moderado a grave")) {
        criteriosPresentes.push("Bronquiolite grave");
      }
    }
    
    return {
      indicacao_internacao: criteriosPresentes.length > 0,
      criterios_presentes: criteriosPresentes
    };
  }

  /**
   * Avalia se há critérios para internação em UTI
   */
  avaliarUti(dados: any, gravidade: string): ResultadoUTI {
    const criteriosPresentes: string[] = [];
    
    // Verificar critérios específicos para UTI
    if (dados.insuficiencia_respiratoria === true) {
      criteriosPresentes.push("Insuficiência respiratória com necessidade de ventilação mecânica");
    }
    
    if (dados.apneia_recorrente === true) {
      criteriosPresentes.push("Apneia recorrente");
    }
    
    if ((dados.retracao || "ausente") === "grave" && dados.piora_progressiva === true) {
      criteriosPresentes.push("Desconforto respiratório grave e progressivo");
    }
    
    if (parseInt(dados.saturacao || "98") < 90 && dados.ja_em_oxigenio === true) {
      criteriosPresentes.push("Saturação de O₂ < 90% apesar de oxigenoterapia");
    }
    
    if (dados.acidose_respiratoria === true) {
      criteriosPresentes.push("Acidose respiratória (pH < 7,25)");
    }
    
    return {
      indicacao_uti: criteriosPresentes.length > 0,
      criterios_presentes: criteriosPresentes
    };
  }

  /**
   * Verifica critérios de alta hospitalar, se aplicável
   */
  recomendarAlta(gravidade: string): ResultadoAlta {
    if (gravidade === "leve") {
      return {
        pode_alta: true,
        criterios_alta: this.criterios_alta,
        orientacoes: this.orientacoes_domiciliares
      };
    } else if (gravidade === "moderada") {
      return {
        pode_alta: false,
        criterios_alta: this.criterios_alta,
        observacao: "Considerar alta após período de observação (4-6 horas) se houver melhora do quadro"
      };
    } else {  // grave
      return {
        pode_alta: false,
        criterios_alta: this.criterios_alta,
        observacao: "Internação recomendada. Alta apenas após resolução dos critérios de gravidade."
      };
    }
  }

  /**
   * Recomenda medidas de tratamento com base na gravidade
   */
  recomendarTratamento(gravidade: string, dados: any): RecomendacaoTratamento[] {
    const recomendacoes: RecomendacaoTratamento[] = [];
    
    // Medidas de suporte
    recomendacoes.push({
      categoria: "Medidas Gerais de Suporte",
      itens: []
    });
    
    // Oxigenoterapia
    if (gravidade === "grave" || parseInt(dados.saturacao || "98") < 92) {
      recomendacoes[0].itens.push("Oxigenoterapia para manter saturação ≥ 92-94%");
    }
    
    // Hidratação
    if (gravidade === "leve") {
      recomendacoes[0].itens.push("Manter hidratação oral adequada");
    } else if (gravidade === "moderada") {
      if ((dados.alimentacao || "normal") === "reduzida") {
        recomendacoes[0].itens.push("Oferecer volumes menores, com maior frequência");
        recomendacoes[0].itens.push("Monitorar aceitação e considerar hidratação IV se necessário");
      } else {
        recomendacoes[0].itens.push("Manter hidratação oral adequada");
      }
    } else {  // grave
      if ((dados.alimentacao || "normal") === "minima") {
        recomendacoes[0].itens.push("Hidratação intravenosa ou por sonda nasogástrica");
      } else {
        recomendacoes[0].itens.push("Oferecer volumes menores, com maior frequência");
        recomendacoes[0].itens.push("Considerar hidratação IV se piora da aceitação");
      }
    }
    
    // Desobstrução nasal
    recomendacoes[0].itens.push("Desobstrução nasal com soro fisiológico");
    
    // Posicionamento
    recomendacoes[0].itens.push("Elevação da cabeceira a 30°");
    
    // Monitorização
    if (gravidade === "moderada" || gravidade === "grave") {
      recomendacoes[0].itens.push("Monitorização de sinais vitais e oximetria");
    }
    
    // Terapias medicamentosas
    recomendacoes.push({
      categoria: "Terapias Medicamentosas",
      itens: ["Não são recomendados de rotina: broncodilatadores, corticosteroides, adrenalina nebulizada ou antibióticos para bronquiolite viral"],
      detalhes: this.tratamentos_nao_recomendados
    });
    
    // Solução salina hipertônica pode ser considerada em casos específicos
    if (gravidade === "moderada" || gravidade === "grave") {
      recomendacoes[1].itens.push("Pode-se considerar nebulização com solução salina hipertônica 3% em pacientes internados (benefício modesto)");
    }
    
    return recomendacoes;
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: any): ResultadoBronquiolite {
    try {
      // Avaliação de gravidade
      const resultadoGravidade = this.avaliarGravidade(dados);
      const gravidade = resultadoGravidade.gravidade;
      
      // Avaliação para internação
      const resultadoInternacao = this.avaliarInternacao(dados, gravidade);
      
      // Avaliação para UTI (se aplicável)
      const resultadoUti = this.avaliarUti(dados, gravidade);
      
      // Recomendações de alta
      const resultadoAlta = this.recomendarAlta(gravidade);
      
      // Recomendações de tratamento
      const recomendacoesTratamento = this.recomendarTratamento(gravidade, dados);
      
      // Resultado final
      return {
        gravidade: resultadoGravidade,
        internacao: resultadoInternacao,
        uti: resultadoUti,
        alta: resultadoAlta,
        tratamento: recomendacoesTratamento
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular recomendações para bronquiolite VSR: ${error.message}`);
    }
  }

  // Métodos para compatibilidade com protocolLoader
  getClassificacaoGravidade(): Record<string, ClassificacaoGravidade> {
    return this.classificacao_gravidade;
  }

  getCriteriosInternacao(): string[] {
    return this.criterios_internacao;
  }

  getCriteriosUti(): string[] {
    return this.criterios_uti;
  }

  getCriteriosAlta(): string[] {
    return this.criterios_alta;
  }

  getTratamentosNaoRecomendados(): TratamentoNaoRecomendado[] {
    return this.tratamentos_nao_recomendados;
  }

  getOrientacoesDomiciliares(): string[] {
    return this.orientacoes_domiciliares;
  }

  getMedidasSuporte(): MedidaSuporte[] {
    return this.medidas_suporte;
  }
}

const controller = new BronquioliteVsrController();
export default controller;
