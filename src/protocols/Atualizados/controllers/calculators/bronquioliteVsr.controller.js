class BronquioliteVsrController {
  constructor() {
    // Parâmetros para avaliação
    this.classificacao_gravidade = {
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

  avaliarGravidade(dados) {
    // Avalia a gravidade da bronquiolite com base nos critérios fornecidos
    // Inicializa contadores para critérios de cada categoria
    let criterios_leve = 0;
    let criterios_moderada = 0;
    let criterios_grave = 0;
    
    // Avalia critérios de frequência respiratória
    const fr = dados.frequencia_respiratoria || 0;
    if (fr < 60) {
      criterios_leve += 1;
    } else if (fr >= 60 && fr <= 70) {
      criterios_moderada += 1;
    } else if (fr > 70) {
      criterios_grave += 1;
    }
        
    // Avalia critérios de retração
    const retracao = dados.retracao || "ausente";
    if (retracao === "ausente" || retracao === "leve") {
      criterios_leve += 1;
    } else if (retracao === "moderada") {
      criterios_moderada += 1;
    } else if (retracao === "grave") {
      criterios_grave += 1;
    }
        
    // Avalia critérios de saturação
    const saturacao = dados.saturacao || 98;
    if (saturacao > 95) {
      criterios_leve += 1;
    } else if (saturacao >= 90 && saturacao <= 95) {
      criterios_moderada += 1;
    } else if (saturacao < 90) {
      criterios_grave += 1;
    }
        
    // Avalia critérios de alimentação
    const alimentacao = dados.alimentacao || "normal";
    if (alimentacao === "normal") {
      criterios_leve += 1;
    } else if (alimentacao === "reduzida") {
      criterios_moderada += 1;
    } else if (alimentacao === "minima") {
      criterios_grave += 1;
    }
        
    // Avalia critérios de estado geral
    const estado_geral = dados.estado_geral || "normal";
    if (estado_geral === "normal") {
      criterios_leve += 1;
    } else if (estado_geral === "irritado") {
      criterios_moderada += 1;
    } else if (estado_geral === "letargico" || estado_geral === "toxemiado") {
      criterios_grave += 1;
    }
        
    // Avalia presença de sinais de alerta graves
    if (dados.apneia || dados.cianose) {
      criterios_grave += 2;  // Aumenta a pontuação de critérios graves
    }
        
    // Determina a gravidade com base nos critérios
    let gravidade = "leve";
    if (criterios_grave >= 1) {
      gravidade = "grave";
    } else if (criterios_moderada >= 2) {
      gravidade = "moderada";
    }
        
    return {
      gravidade: gravidade,
      criterios_leve: criterios_leve,
      criterios_moderada: criterios_moderada,
      criterios_grave: criterios_grave,
      descricao: this.classificacao_gravidade[gravidade].criterios,
      manejo: this.classificacao_gravidade[gravidade].manejo
    };
  }

  avaliarInternacao(dados, gravidade) {
    // Avalia se há critérios para internação hospitalar
    const criterios_presentes = [];
    
    // Verificar critérios específicos para internação
    if ((dados.saturacao || 98) < 92) {
      criterios_presentes.push("Hipoxemia (saturação de O₂ < 92% em ar ambiente)");
    }
    
    if ((dados.retracao || "ausente") === "moderada" || (dados.retracao || "ausente") === "grave") {
      criterios_presentes.push("Desconforto respiratório moderado a grave");
    }
    
    if (dados.apneia) {
      criterios_presentes.push("Apneia");
    }
    
    if ((dados.alimentacao || "normal") === "minima") {
      criterios_presentes.push("Incapacidade de manter hidratação adequada");
    }
    
    // Verificar fatores de risco
    if ((dados.idade_meses || 0) < 3) {
      criterios_presentes.push("Idade < 3 meses");
    }
    
    if (dados.prematuro && (dados.idade_meses || 0) < 12) {
      criterios_presentes.push("Prematuro < 35 semanas nas primeiras 12 semanas de vida");
    }
    
    if (dados.comorbidades) {
      criterios_presentes.push("Presença de comorbidades");
    }
    
    if (dados.condicoes_sociais) {
      criterios_presentes.push("Condições sociais desfavoráveis");
    }
    
    if (dados.distancia_servico) {
      criterios_presentes.push("Distância do serviço de saúde");
    }
        
    // Gravidade como critério de internação
    if (gravidade === "grave") {
      if (!criterios_presentes.includes("Desconforto respiratório moderado a grave")) {
        criterios_presentes.push("Bronquiolite grave");
      }
    }
    
    return {
      indicacao_internacao: criterios_presentes.length > 0,
      criterios_presentes: criterios_presentes
    };
  }

  avaliarUti(dados, gravidade) {
    // Avalia se há critérios para internação em UTI
    const criterios_presentes = [];
    
    // Verificar critérios específicos para UTI
    if (dados.insuficiencia_respiratoria) {
      criterios_presentes.push("Insuficiência respiratória com necessidade de ventilação mecânica");
    }
    
    if (dados.apneia_recorrente) {
      criterios_presentes.push("Apneia recorrente");
    }
    
    if ((dados.retracao || "ausente") === "grave" && dados.piora_progressiva) {
      criterios_presentes.push("Desconforto respiratório grave e progressivo");
    }
    
    if ((dados.saturacao || 98) < 90 && dados.ja_em_oxigenio) {
      criterios_presentes.push("Saturação de O₂ < 90% apesar de oxigenoterapia");
    }
    
    if (dados.acidose_respiratoria) {
      criterios_presentes.push("Acidose respiratória (pH < 7,25)");
    }
    
    return {
      indicacao_uti: criterios_presentes.length > 0,
      criterios_presentes: criterios_presentes
    };
  }

  recomendarAlta(gravidade) {
    // Verifica critérios de alta hospitalar, se aplicável
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

  recomendarTratamento(gravidade, dados) {
    // Recomenda medidas de tratamento com base na gravidade
    const recomendacoes = [];
    
    // Medidas de suporte
    recomendacoes.push({
      categoria: "Medidas Gerais de Suporte",
      itens: []
    });
    
    // Oxigenoterapia
    if (gravidade === "grave" || (dados.saturacao || 98) < 92) {
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

  calcular(dados) {
    try {
      // Avaliação de gravidade
      const resultado_gravidade = this.avaliarGravidade(dados);
      const gravidade = resultado_gravidade.gravidade;
      
      // Avaliação para internação
      const resultado_internacao = this.avaliarInternacao(dados, gravidade);
      
      // Avaliação para UTI (se aplicável)
      const resultado_uti = this.avaliarUti(dados, gravidade);
      
      // Recomendações de alta
      const resultado_alta = this.recomendarAlta(gravidade);
      
      // Recomendações de tratamento
      const recomendacoes_tratamento = this.recomendarTratamento(gravidade, dados);
      
      // Resultado final
      const resultado = {
        gravidade: resultado_gravidade,
        internacao: resultado_internacao,
        uti: resultado_uti,
        alta: resultado_alta,
        tratamento: recomendacoes_tratamento
      };
      
      return resultado;
    } catch (error) {
      throw new Error(`Erro ao calcular bronquiolite VSR: ${error.message}`);
    }
  }

  // Métodos para acesso aos dados
  getClassificacaoGravidade() {
    return this.classificacao_gravidade;
  }

  getCriteriosInternacao() {
    return this.criterios_internacao;
  }

  getCriteriosUti() {
    return this.criterios_uti;
  }

  getCriteriosAlta() {
    return this.criterios_alta;
  }

  getTratamentosNaoRecomendados() {
    return this.tratamentos_nao_recomendados;
  }

  getOrientacoesDomiciliares() {
    return this.orientacoes_domiciliares;
  }

  getMedidasSuporte() {
    return this.medidas_suporte;
  }
}

// Exporta uma instância do controlador
const controller = new BronquioliteVsrController();
export default controller;
