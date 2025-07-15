class AsmaController {
  constructor() {
    // Parâmetros para classificação de gravidade da asma
    this.classificacao_gravidade = [
      {
        gravidade: "Leve",
        caracteristicas: [
          "Frequência respiratória < 60 irpm em lactentes",
          "Retrações leves ou ausentes",
          "Saturação de O₂ > 95% em ar ambiente",
          "Fala frases completas",
          "Nível de consciência normal"
        ],
        tratamento: [
          "Beta-2 inalatório (3 doses a cada 20 minutos)",
          "O₂ a 3L/min se SatO₂<92%"
        ]
      },
      {
        gravidade: "Moderada",
        caracteristicas: [
          "Frequência respiratória entre 60-70 irpm em lactentes",
          "Retrações moderadas",
          "Saturação de O₂ entre 90-95% em ar ambiente",
          "Fala frases incompletas",
          "Uso de musculatura acessória",
          "Sibilos moderados a intensos"
        ],
        tratamento: [
          "Beta-2 inalatório (3 doses a cada 20 minutos)",
          "O₂ a 3L/min se SatO₂<92%",
          "Considerar observação no pronto-socorro por 4-6 horas"
        ]
      },
      {
        gravidade: "Grave",
        caracteristicas: [
          "Frequência respiratória > 70 irpm em lactentes",
          "Retrações graves (intercostais, subdiafragmáticas, supraesternais)",
          "Saturação de O₂ < 90% em ar ambiente",
          "Fala palavras apenas",
          "Agitação",
          "Cianose"
        ],
        tratamento: [
          "Beta-2 inalatório (3 doses a cada 20 minutos)",
          "O₂ a 3L/min ou conforme necessidade",
          "Corticosteroide sistêmico",
          "Considerar internação hospitalar"
        ]
      },
      {
        gravidade: "Iminência de Parada Respiratória",
        caracteristicas: [
          "Sonolência, confusão",
          "Silêncio à ausculta (tórax 'mudo')",
          "Cianose",
          "Bradipneia",
          "Saturação de O₂ < 88% apesar do O₂ suplementar"
        ],
        tratamento: [
          "Internar em UTI",
          "Beta-2 contínuo",
          "Corticosteroide IV",
          "Considerar intubação orotraqueal"
        ]
      }
    ];

    // Medicações de resgate
    this.medicacoes_resgate = {
      beta2_agonistas: [
        {
          nome: "Salbutamol",
          apresentacao: "Solução para nebulização (5 mg/ml)",
          dose: "0,15 mg/kg (mínimo 2,5 mg, máximo 5 mg) a cada 20 minutos até 3 doses, depois conforme necessidade"
        },
        {
          nome: "Salbutamol spray",
          apresentacao: "Aerossol (100 mcg/jato)",
          dose: "2-10 jatos a cada 20 minutos até 3 doses, depois conforme necessidade"
        }
      ],
      corticosteroides: [
        {
          nome: "Prednisolona/Prednisona",
          apresentacao: "Oral",
          dose: "1-2 mg/kg/dia (máximo 60 mg/dia) por 3-5 dias"
        },
        {
          nome: "Metilprednisolona",
          apresentacao: "Intravenosa",
          dose: "1-2 mg/kg/dia (moderados a graves) a 10-30 mg/kg/dia (graves) divididos em 4 doses"
        }
      ]
    };
    
    // Critérios de internação
    this.criterios_internacao = [
      "Saturação de O₂ < 90% em ar ambiente",
      "Alteração do nível de consciência",
      "Cianose",
      "Silêncio à ausculta após tratamento inicial",
      "Uso importante de musculatura acessória",
      "Não resposta ao tratamento inicial no pronto-socorro após 3 horas",
      "Comorbidades (cardiopatia, pneumopatia, prematuridade)"
    ];
    
    // Critérios de alta
    this.criterios_alta = [
      "Frequência respiratória normal para a idade",
      "Ausência ou mínimo desconforto respiratório",
      "Saturação de O₂ ≥ 92% em ar ambiente",
      "Boa aceitação alimentar",
      "Boa resposta ao tratamento inalatório"
    ];
  }

  avaliarGravidade(dados) {
    // Avalia a gravidade da crise asmática com base nos dados fornecidos
    // Pontuação inicial de gravidade
    let pontuacao = 0;
    
    // Análise dos sinais vitais
    if (dados.frequencia_respiratoria) {
      const fr = parseInt(dados.frequencia_respiratoria);
      const idadeMeses = parseInt(dados.idade_meses || 0);
      
      // Valores de referência para FR por idade
      if (idadeMeses < 12) {  // Lactentes
        if (fr > 70) {
          pontuacao += 3;
        } else if (fr >= 60) {
          pontuacao += 2;
        } else if (fr >= 50) {
          pontuacao += 1;
        }
      } else if (idadeMeses < 60) {  // 1-5 anos
        if (fr > 60) {
          pontuacao += 3;
        } else if (fr >= 40) {
          pontuacao += 2;
        } else if (fr >= 30) {
          pontuacao += 1;
        }
      } else {  // > 5 anos
        if (fr > 30) {
          pontuacao += 3;
        } else if (fr >= 25) {
          pontuacao += 2;
        } else if (fr >= 20) {
          pontuacao += 1;
        }
      }
    }
    
    // Saturação de oxigênio
    if (dados.saturacao_o2) {
      const sato2 = parseInt(dados.saturacao_o2);
      if (sato2 < 88) {
        pontuacao += 3;
      } else if (sato2 < 90) {
        pontuacao += 2;
      } else if (sato2 < 95) {
        pontuacao += 1;
      }
    }
    
    // Retrações/tiragem
    if (dados.retracao === "grave") {
      pontuacao += 3;
    } else if (dados.retracao === "moderada") {
      pontuacao += 2;
    } else if (dados.retracao === "leve") {
      pontuacao += 1;
    }
    
    // Sibilância
    if (dados.sibilancia === "ausente_torax_mudo") {
      pontuacao += 3;
    } else if (dados.sibilancia === "intensos") {
      pontuacao += 2;
    } else if (dados.sibilancia === "moderados") {
      pontuacao += 1;
    }
    
    // Nível de consciência
    if (dados.nivel_consciencia === "sonolento") {
      pontuacao += 3;
    } else if (dados.nivel_consciencia === "agitado") {
      pontuacao += 2;
    }
    
    // Fala
    if (dados.fala === "palavras") {
      pontuacao += 3;
    } else if (dados.fala === "frases_incompletas") {
      pontuacao += 2;
    }
    
    // Determinação da gravidade com base na pontuação
    let gravidade;
    if (pontuacao >= 10) {
      gravidade = "Iminência de Parada Respiratória";
    } else if (pontuacao >= 7) {
      gravidade = "Grave";
    } else if (pontuacao >= 4) {
      gravidade = "Moderada";
    } else {
      gravidade = "Leve";
    }
        
    return {
      pontuacao: pontuacao,
      gravidade: gravidade
    };
  }

  recomendarTratamento(gravidade, idadeMeses, peso) {
    // Recomenda o tratamento com base na gravidade da crise
    // Tratamento de acordo com a gravidade
    const tratamento = this.classificacao_gravidade.find(item => item.gravidade === gravidade);
    
    // Ajuste da dose de salbutamol com base no peso
    let doseSalbutamolNeb = 0.15 * peso;
    if (doseSalbutamolNeb < 2.5) {
      doseSalbutamolNeb = 2.5;
    }
    if (doseSalbutamolNeb > 5) {
      doseSalbutamolNeb = 5;
    }
        
    // Ajuste da dose de corticosteroide com base no peso
    let dosePrednisona = 1 * peso;
    if (dosePrednisona > 60) {
      dosePrednisona = 60;
    }
        
    // Número de jatos de salbutamol com base na idade
    let jatosSalbutamol;
    if (idadeMeses < 48) {  // < 4 anos
      jatosSalbutamol = "2-4 jatos";
    } else {
      jatosSalbutamol = "4-10 jatos";
    }
        
    const medicacoes = {
      salbutamol_neb: `${doseSalbutamolNeb.toFixed(1)} mg`,
      salbutamol_spray: jatosSalbutamol,
      prednisona: `${dosePrednisona.toFixed(1)} mg/dia`
    };
    
    let recomendacoes = [];
    
    // Recomendações específicas por gravidade
    if (gravidade === "Leve") {
      recomendacoes = [
        `Beta-2 inalatório (salbutamol ${medicacoes.salbutamol_neb} ou ${medicacoes.salbutamol_spray} com espaçador) a cada 20 minutos por 3 doses`,
        "Oxigênio suplementar se saturação < 92%",
        "Considerar alta após boa resposta ao tratamento",
        "Prescrever beta-2 inalatório para uso em domicílio por 5-7 dias"
      ];
    } else if (gravidade === "Moderada") {
      recomendacoes = [
        `Beta-2 inalatório (salbutamol ${medicacoes.salbutamol_neb} ou ${medicacoes.salbutamol_spray} com espaçador) a cada 20 minutos por 3 doses`,
        "Oxigênio suplementar para manter saturação ≥ 92%",
        `Corticosteroide oral (prednisona/prednisolona ${medicacoes.prednisona})`,
        "Observação no pronto-socorro por 4-6 horas",
        "Se boa resposta: considerar alta com beta-2 inalatório e prednisona por 3-5 dias",
        "Se resposta parcial ou não resposta: considerar internação"
      ];
    } else if (gravidade === "Grave") {
      recomendacoes = [
        `Beta-2 inalatório (salbutamol ${medicacoes.salbutamol_neb} ou ${medicacoes.salbutamol_spray} com espaçador) a cada 20 minutos por 3 doses`,
        "Oxigênio suplementar para manter saturação ≥ 94%",
        `Corticosteroide sistêmico (prednisona oral ${medicacoes.prednisona} ou metilprednisolona IV 1-2 mg/kg)`,
        "Considerar adrenalina nebulizada se broncoespasmo refratário",
        "Internação hospitalar",
        "Considerar beta-2 agonista contínuo se necessário"
      ];
    } else {  // Iminência de Parada Respiratória
      recomendacoes = [
        "Internar em UTI",
        "Oxigênio de alto fluxo ou ventilação não invasiva",
        "Beta-2 agonista contínuo",
        "Corticosteroide IV (metilprednisolona 1-2 mg/kg a cada 6 horas)",
        "Avaliar necessidade de intubação orotraqueal",
        "Considerar sulfato de magnésio IV"
      ];
    }
    
    const necessidadeInternacao = gravidade === "Grave" || gravidade === "Iminência de Parada Respiratória";
    
    return {
      tratamento: tratamento,
      medicacoes: medicacoes,
      recomendacoes: recomendacoes,
      necessidade_internacao: necessidadeInternacao
    };
  }

  calcular(dados) {
    try {
      // Extrair dados
      const idadeAnos = parseInt(dados.idade_anos || 0);
      const idadeMesesAdicional = parseInt(dados.idade_meses || 0);
      const idadeMeses = (idadeAnos * 12) + idadeMesesAdicional;
      const peso = parseFloat(dados.peso || 0);
      
      // Avaliar gravidade
      const avaliacaoGravidade = this.avaliarGravidade(dados);
      const gravidade = avaliacaoGravidade.gravidade;
      
      // Recomendar tratamento
      const recomendacao = this.recomendarTratamento(gravidade, idadeMeses, peso);
      
      // Verificar critérios específicos de internação
      const criteriosInternacaoPresentes = [];
      if (dados.saturacao_o2 && parseInt(dados.saturacao_o2) < 90) {
        criteriosInternacaoPresentes.push("Saturação de O₂ < 90% em ar ambiente");
      }
      
      if (dados.nivel_consciencia === "sonolento") {
        criteriosInternacaoPresentes.push("Alteração do nível de consciência");
      }
      
      if (dados.cianose) {
        criteriosInternacaoPresentes.push("Cianose");
      }
      
      if (dados.sibilancia === "ausente_torax_mudo") {
        criteriosInternacaoPresentes.push("Silêncio à ausculta após tratamento inicial");
      }
      
      if (dados.comorbidades) {
        criteriosInternacaoPresentes.push("Presença de comorbidades");
      }
      
      // Orientações para alta (quando aplicável)
      let orientacoesAlta = [];
      if ((gravidade === "Leve" || gravidade === "Moderada") && criteriosInternacaoPresentes.length === 0) {
        orientacoesAlta = [
          "Continuar beta-2 inalatório a cada 4-6 horas conforme necessidade",
          "Completar curso de corticosteroide oral se prescrito",
          "Retornar imediatamente se piora dos sintomas, dificuldade respiratória ou incapacidade de ingerir líquidos",
          "Agendar consulta de seguimento em 24-48 horas",
          "Revisar técnica de uso de dispositivos inalatórios"
        ];
      }
      
      // Construir resultado final
      return {
        idade_meses: idadeMeses,
        peso: peso,
        avaliacao_gravidade: avaliacaoGravidade,
        tratamento: recomendacao.tratamento,
        medicacoes: recomendacao.medicacoes,
        recomendacoes: recomendacao.recomendacoes,
        necessidade_internacao: recomendacao.necessidade_internacao || criteriosInternacaoPresentes.length > 0,
        criterios_internacao_presentes: criteriosInternacaoPresentes,
        orientacoes_alta: (!recomendacao.necessidade_internacao && criteriosInternacaoPresentes.length === 0) ? orientacoesAlta : []
      };
    } catch (error) {
      throw new Error(`Erro ao calcular asma: ${error.message}`);
    }
  }

  // Métodos para acesso aos dados
  getClassificacaoGravidade() {
    return this.classificacao_gravidade;
  }

  getMedicacoesResgate() {
    return this.medicacoes_resgate;
  }

  getCriteriosInternacao() {
    return this.criterios_internacao;
  }

  getCriteriosAlta() {
    return this.criterios_alta;
  }
}

// Exporta uma instância do controlador
const controller = new AsmaController();
export default controller;
