class PolitraumatismoController {
  constructor() {
    // Parâmetros para avaliação
    this.parametros_vias_aereas = [
      "Respiração trabalhosa/ruidosa",
      "Taquipneia",
      "Bradipneia",
      "Respiração superficial",
      "Expansibilidade reduzida"
    ];
    
    this.parametros_hemodinamicos = [
      "Taquicardia",
      "Pele fria e úmida",
      "Bradicardia",
      "Pulso fino/fraco/filiforme",
      "Débito urinário reduzido ou ausente",
      "Enchimento capilar prolongado",
      "Ansiedade/irritabilidade/confusão/letargia"
    ];
    
    this.abcde_protocolo = {
      "A": {
        titulo: "Airways – vias aéreas, com proteção da coluna cervical",
        avaliacoes: [
          "Permeabilidade das vias aéreas",
          "Estabilidade do pescoço",
          "Necessidade de intubação traqueal",
          "Necessidade de outras medidas de desobstrução"
        ]
      },
      "B": {
        titulo: "Breathing – respiração e ventilação",
        avaliacoes: [
          "Qualidade e frequência dos movimentos respiratórios",
          "Efetividade da oxigenação e ventilação",
          "Ausência de cianose",
          "Expansibilidade simétrica",
          "Saturação de O2 > 90%"
        ]
      },
      "C": {
        titulo: "Circulation – circulação com controle da hemorragia",
        avaliacoes: [
          "Controle de hemorragias externas",
          "Suporte da função cardiovascular",
          "Perfusão sistêmica",
          "Restauração do volume sanguíneo"
        ]
      },
      "D": {
        titulo: "Disability – incapacidade, estado neurológico",
        avaliacoes: [
          "Avaliação rápida do estado neurológico",
          "Escala de Coma de Glasgow",
          "Avaliação pupilar"
        ]
      },
      "E": {
        titulo: "Exposure – exposição com controle de ambiente",
        avaliacoes: [
          "Avaliação completa",
          "Proteção contra hipotermia",
          "Exame físico completo",
          "Reavaliações periódicas"
        ]
      }
    };
    
    // Escala de coma de Glasgow pediátrica
    this.escala_glasgow = {
      abertura_olhos: [
        { escore: 4, criterio: "Espontaneamente", criterio_menor_1_ano: "Espontaneamente" },
        { escore: 3, criterio: "Ao comando", criterio_menor_1_ano: "A fala" },
        { escore: 2, criterio: "A dor", criterio_menor_1_ano: "A dor" },
        { escore: 1, criterio: "Nenhuma resposta", criterio_menor_1_ano: "Nenhuma resposta" }
      ],
      resposta_verbal: [
        { escore: 5, criterio: "Orientada", criterio_menor_1_ano: "Sorri, orientada" },
        { escore: 4, criterio: "Desorientada", criterio_menor_1_ano: "Choro consolável" },
        { escore: 3, criterio: "Palavra inapropriada", criterio_menor_1_ano: "Choro persistente, gemente" },
        { escore: 2, criterio: "Sons incompreensíveis", criterio_menor_1_ano: "Agitada e inquieta" },
        { escore: 1, criterio: "Nenhuma resposta", criterio_menor_1_ano: "Nenhuma resposta" }
      ],
      resposta_motora: [
        { escore: 6, criterio: "Obedece a comando", criterio_menor_1_ano: "Movimentos normais" },
        { escore: 5, criterio: "Localiza a dor", criterio_menor_1_ano: "Localiza a dor" },
        { escore: 4, criterio: "Flexão a dor", criterio_menor_1_ano: "Flexão a dor" },
        { escore: 3, criterio: "Flexão anormal a dor", criterio_menor_1_ano: "Flexão anormal a dor" },
        { escore: 2, criterio: "Extensão anormal a dor", criterio_menor_1_ano: "Extensão anormal a dor" },
        { escore: 1, criterio: "Nenhuma resposta", criterio_menor_1_ano: "Nenhuma resposta" }
      ]
    };
  }

  calcularGlasgow(idade_meses, abertura_olhos, resposta_verbal, resposta_motora) {
    /**
     * Calcula o score total da Escala de Glasgow e avalia o nível de consciência
     */
    try {
      const score_total = abertura_olhos + resposta_verbal + resposta_motora;
      
      // Determinação da gravidade
      let gravidade, alerta;
      
      if (score_total <= 8) {
        gravidade = "Grave";
        alerta = "Alto risco - Intubação recomendada (Glasgow ≤ 8)";
      } else if (score_total <= 12) {
        gravidade = "Moderado";
        alerta = "Risco moderado - Monitorização constante";
      } else {
        gravidade = "Leve";
        alerta = "Baixo risco - Observação regular";
      }
      
      return {
        score_total,
        gravidade,
        alerta
      };
    } catch (error) {
      console.error("Erro ao calcular escore de Glasgow:", error);
      throw new Error("Não foi possível calcular o escore de Glasgow");
    }
  }
  
  avaliarViasAereas(parametros_selecionados) {
    /**
     * Avalia o comprometimento das vias aéreas
     */
    try {
      let nivel_comprometimento = "Baixo";
      let intervencoes = ["Oferecer O2 suplementar"];
      
      if (parametros_selecionados.length >= 3) {
        nivel_comprometimento = "Alto";
        intervencoes = [
          "Oferecer O2 de alto fluxo",
          "Manutenção da coluna cervical",
          "Aspirar vias aéreas",
          "Avaliar necessidade de via aérea definitiva (intubação)"
        ];
      } else if (parametros_selecionados.length >= 1) {
        nivel_comprometimento = "Moderado";
        intervencoes = [
          "Oferecer O2 suplementar",
          "Manutenção da coluna cervical",
          "Aspirar vias aéreas se necessário",
          "Considerar cânula orofaríngea ou nasofaríngea"
        ];
      }
      
      return {
        nivel_comprometimento,
        intervencoes
      };
    } catch (error) {
      console.error("Erro ao avaliar vias aéreas:", error);
      throw new Error("Não foi possível avaliar o comprometimento das vias aéreas");
    }
  }
  
  avaliarHemodinamica(parametros_selecionados) {
    /**
     * Avalia o comprometimento hemodinâmico
     */
    try {
      let nivel_comprometimento = "Baixo";
      let intervencoes = ["Monitorização de sinais vitais"];
      
      if (parametros_selecionados.length >= 3) {
        nivel_comprometimento = "Alto";
        intervencoes = [
          "Reposição volêmica imediata (SF 0,9% 20ml/kg em bolus)",
          "Considerar segunda tentativa se resposta inadequada",
          "Considerar hemoderivados se resposta inadequada após 3 bolus",
          "Acesso vascular calibroso (considerar intraósseo)",
          "Identificação e controle de sangramentos",
          "Controle térmico"
        ];
      } else if (parametros_selecionados.length >= 1) {
        nivel_comprometimento = "Moderado";
        intervencoes = [
          "Reposição volêmica (SF 0,9% 20ml/kg)",
          "Controle de sangramento aparente",
          "Acesso venoso periférico",
          "Monitorização hemodinâmica contínua"
        ];
      }
      
      return {
        nivel_comprometimento,
        intervencoes
      };
    } catch (error) {
      console.error("Erro ao avaliar hemodinâmica:", error);
      throw new Error("Não foi possível avaliar o comprometimento hemodinâmico");
    }
  }
  
  recomendarABCDE(glasgow_score) {
    /**
     * Gera recomendações baseadas no protocolo ABCDE
     */
    try {
      const recomendacoes = [];
      
      // A - Vias aéreas
      recomendacoes.push({
        etapa: "A - Vias aéreas",
        acoes: [
          "Verificar permeabilidade das vias aéreas",
          "Aplicar colar cervical",
          "Remover corpos estranhos se visíveis",
          "Aspirar secreções se necessário"
        ]
      });
      
      // B - Respiração
      recomendacoes.push({
        etapa: "B - Respiração",
        acoes: [
          "Avaliar frequência e padrão respiratório",
          "Auscultar tórax bilateralmente",
          "Oferecer oxigênio suplementar para manter SatO2 > 94%",
          "Observar simetria na expansão torácica"
        ]
      });
      
      // C - Circulação
      recomendacoes.push({
        etapa: "C - Circulação",
        acoes: [
          "Comprimir hemorragias externas",
          "Estabelecer acesso vascular (preferencialmente 2 acessos)",
          "Iniciar reposição volêmica conforme necessidade",
          "Monitorizar frequência cardíaca e pressão arterial"
        ]
      });
      
      // D - Incapacidade (Estado neurológico)
      const d_acoes = [
        "Avaliar nível de consciência (Escala de Glasgow)",
        "Verificar tamanho e reatividade das pupilas",
        "Avaliar movimentação dos quatro membros"
      ];
      
      if (glasgow_score <= 8) {
        d_acoes.push("Considerar intubação para proteção de via aérea (Glasgow ≤ 8)");
      }
      
      recomendacoes.push({
        etapa: "D - Incapacidade (Estado neurológico)",
        acoes: d_acoes
      });
      
      // E - Exposição
      recomendacoes.push({
        etapa: "E - Exposição",
        acoes: [
          "Expor completamente o paciente para avaliação",
          "Prevenir hipotermia com cobertores aquecidos",
          "Realizar exame físico completo",
          "Considerar radiografias de tórax, pelve e outros conforme indicação"
        ]
      });
      
      return recomendacoes;
    } catch (error) {
      console.error("Erro ao gerar recomendações ABCDE:", error);
      throw new Error("Não foi possível gerar as recomendações ABCDE");
    }
  }
  
  avaliarNecessidadeUti(glasgow_score, comprometimento_va, comprometimento_hd) {
    /**
     * Avalia necessidade de internação em UTI
     */
    try {
      const criterios_uti = [];
      let necessidade_uti = false;
      
      if (glasgow_score <= 8) {
        criterios_uti.push("Glasgow ≤ 8");
        necessidade_uti = true;
      }
      
      if (comprometimento_va === "Alto") {
        criterios_uti.push("Comprometimento grave das vias aéreas");
        necessidade_uti = true;
      }
      
      if (comprometimento_hd === "Alto") {
        criterios_uti.push("Instabilidade hemodinâmica significativa");
        necessidade_uti = true;
      }
      
      return {
        necessidade_uti,
        criterios: criterios_uti
      };
    } catch (error) {
      console.error("Erro ao avaliar necessidade de UTI:", error);
      throw new Error("Não foi possível avaliar a necessidade de UTI");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getParametrosViasAereas() {
    return this.parametros_vias_aereas;
  }
  
  getParametrosHemodinamicos() {
    return this.parametros_hemodinamicos;
  }
  
  getABCDEProtocolo() {
    return this.abcde_protocolo;
  }
  
  getEscalaGlasgow() {
    return this.escala_glasgow;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      const idade_anos = parseInt(dados.idade_anos || 0);
      const idade_meses = parseInt(dados.idade_meses || 0);
      const idade_total_meses = (idade_anos * 12) + idade_meses;
      
      // Calcular Glasgow
      const abertura_olhos = parseInt(dados.abertura_olhos || 4);
      const resposta_verbal = parseInt(dados.resposta_verbal || 5);
      const resposta_motora = parseInt(dados.resposta_motora || 6);
      
      const resultado_glasgow = this.calcularGlasgow(
        idade_total_meses, abertura_olhos, resposta_verbal, resposta_motora
      );
      
      // Avaliar comprometimento das vias aéreas
      const parametros_va = [];
      for (const param of this.parametros_vias_aereas) {
        const key = param.toLowerCase().replace(" ", "_").replace("/", "_");
        if (dados[key]) {
          parametros_va.push(param);
        }
      }
      
      const avaliacao_va = this.avaliarViasAereas(parametros_va);
      
      // Avaliar comprometimento hemodinâmico
      const parametros_hd = [];
      for (const param of this.parametros_hemodinamicos) {
        const key = param.toLowerCase().replace(" ", "_").replace("/", "_").replace(",", "");
        if (dados[key]) {
          parametros_hd.push(param);
        }
      }
      
      const avaliacao_hd = this.avaliarHemodinamica(parametros_hd);
      
      // Recomendações ABCDE
      const recomendacoes_abcde = this.recomendarABCDE(resultado_glasgow.score_total);
      
      // Avaliação de necessidade de UTI
      const avaliacao_uti = this.avaliarNecessidadeUti(
        resultado_glasgow.score_total,
        avaliacao_va.nivel_comprometimento,
        avaliacao_hd.nivel_comprometimento
      );
      
      // Resultado final
      return {
        idade: {
          anos: idade_anos,
          meses: idade_meses,
          total_meses: idade_total_meses
        },
        glasgow: resultado_glasgow,
        vias_aereas: {
          parametros: parametros_va,
          avaliacao: avaliacao_va
        },
        hemodinamica: {
          parametros: parametros_hd,
          avaliacao: avaliacao_hd
        },
        recomendacoes_abcde: recomendacoes_abcde,
        avaliacao_uti: avaliacao_uti
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para politraumatismo:", error);
      throw new Error("Não foi possível calcular as recomendações para politraumatismo");
    }
  }
}

// Exporta uma instância do controlador
const controller = new PolitraumatismoController();
export default controller;
