class SragController {
  constructor() {
    // Definições da SDRA pediátrica segundo PALICC
    this.criterios_palicc = [
      {
        criterio: "Tempo",
        definicao: "Dentro de 7 dias de lesão clínica conhecida"
      },
      {
        criterio: "Origem do edema",
        definicao: "Insuficiência respiratória que não seja totalmente explicada por insuficiência cardíaca ou sobrecarga de fluidos"
      },
      {
        criterio: "Imagem radiológica",
        definicao: "Raio-x com novo(s) infiltrado(s) condizentes com doença parenquimatosa pulmonar aguda"
      }
    ];
    
    // Critérios especiais
    this.criterios_especiais = [
      {
        criterio: "Doença cardíaca congênita",
        definicao: "Segundo os critérios acima para idade, tempo, origem do edema e imagem do tórax com deterioração aguda da oxigenação não explicada por doença cardíaca subjacente"
      },
      {
        criterio: "Doença pulmonar crônica",
        definicao: "Com origem do edema e imagem do tórax compatíveis com novo infiltrado e deterioração"
      }
    ];
    
    // Classificação da SDRA pediátrica conforme oxigenação
    this.classificacao_gravidade = [
      {
        gravidade: "Leve",
        criterios: [
          "VMI: 4 ≤ IO < 8 ou 5 ≤ ISO < 7.5",
          "VNI: PaO₂/FiO₂ ≤ 300 ou SpO₂/FiO₂ ≤ 264"
        ]
      },
      {
        gravidade: "Moderada",
        criterios: [
          "VMI: 8 ≤ IO < 16 ou 7.5 ≤ ISO < 12.3"
        ]
      },
      {
        gravidade: "Grave",
        criterios: [
          "VMI: IO ≥ 16 ou ISO ≥ 12.3"
        ]
      }
    ];
    
    // Terapias para SDRA pediátrica
    this.terapias = [
      {
        terapia: "VM protetora",
        recomendacoes_palicc: "VC baixo: 3-6ml/kg se complacência diminuída e 5-8 ml/kg se complacência preservada. Pressão de platô menor ou igual a 28 cmH2O. Hipoxemia permissiva: SDRA leve: 92-97%; SDRA grave: 88-92%; PEEP > 10 cmH2O. Hipercapnia permissiva: moderada/grave: pH 7,15-7,3"
      },
      {
        terapia: "Manutenção fluídica",
        recomendacoes_palicc: "Manutenção: fluidos administrados para manter o volume intravascular e minimizar sobrecarga hídrica."
      },
      {
        terapia: "Óxido nítrico inalatório",
        recomendacoes_palicc: "O uso rotineiro não é recomendado. Considerar em pacientes com diagnóstico de HP, grave disfunção de VD e como ponte para ECMO"
      },
      {
        terapia: "Posição prona",
        recomendacoes_palicc: "Considerar como opção em PSDRA grave. Não pode ser recomendada rotineiramente."
      },
      {
        terapia: "VOAF",
        recomendacoes_palicc: "Considerar em pacientes com PSDRA moderada a grave e pressão de platô > 28 cmH2O"
      },
      {
        terapia: "Manobras de recrutamento",
        recomendacoes_palicc: "Titulação cuidadosa da PEEP"
      },
      {
        terapia: "Bloqueadores neuromusculares",
        recomendacoes_palicc: "Considerar seu uso se sedação for inadequada para atingir VM efetiva. Objetivar menor dose."
      },
      {
        terapia: "Surfactante",
        recomendacoes_palicc: "Uso rotineiro não recomendado. Mais estudos devem ser realizados"
      },
      {
        terapia: "Corticóides",
        recomendacoes_palicc: "Uso não recomendado"
      },
      {
        terapia: "ECMO",
        recomendacoes_palicc: "Considerar ECMO em PSDRA grave quando estratégias ventilatórias protetores resultarem em trocas gasosas inadequadas"
      }
    ];
  }

  calcularIndices(dados) {
    /**
     * Calcula os índices de oxigenação (IO e ISO) e determina a gravidade da SDRA
     */
    try {
      // Cálculo do Índice de Oxigenação (IO) e Índice Saturação de Oxigênio (ISO)
      let io = null;
      let iso = null;
      
      // Extrair dados 
      const pao2 = dados.pao2;
      const spo2 = dados.spo2;
      const fio2 = dados.fio2 || 0.21;  // Default FiO2 = 21% (ar ambiente)
      const pmva = dados.pmva;          // Pressão média de vias aéreas
      
      // Calcular relações PaO2/FiO2 e SpO2/FiO2
      let pf_ratio = null;
      let sf_ratio = null;
      
      if (pao2 !== undefined && pao2 !== null && fio2 > 0) {
        pf_ratio = pao2 / fio2;
      }
          
      if (spo2 !== undefined && spo2 !== null && fio2 > 0) {
        sf_ratio = spo2 / fio2;
      }
      
      // Calcular IO e ISO se em ventilação mecânica invasiva (VMI)
      if (pmva !== undefined && pmva !== null && fio2 > 0) {
        if (pao2 !== undefined && pao2 !== null) {
          io = (pmva * fio2 * 100) / pao2;
        }
        if (spo2 !== undefined && spo2 !== null) {
          iso = (pmva * fio2 * 100) / spo2;
        }
      }
      
      // Determinar gravidade da SDRA
      const gravidade = this.determinarGravidade(io, iso, pf_ratio, sf_ratio, dados.ventilacao_mecanica);
      
      return {
        io,
        iso,
        pf_ratio,
        sf_ratio,
        gravidade
      };
    } catch (error) {
      console.error("Erro ao calcular índices:", error);
      throw new Error("Não foi possível calcular os índices de oxigenação");
    }
  }
  
  determinarGravidade(io, iso, pf_ratio, sf_ratio, ventilacao_mecanica) {
    /**
     * Determina a gravidade da SDRA com base nos índices calculados
     */
    try {
      if (ventilacao_mecanica === 'invasiva') {
        if (io !== null && io !== undefined) {
          if (io >= 16) {
            return "Grave";
          } else if (8 <= io && io < 16) {
            return "Moderada";
          } else if (4 <= io && io < 8) {
            return "Leve";
          } else {
            return "Não classificável como SDRA";
          }
        } else if (iso !== null && iso !== undefined) {
          if (iso >= 12.3) {
            return "Grave";
          } else if (7.5 <= iso && iso < 12.3) {
            return "Moderada";
          } else if (5 <= iso && iso < 7.5) {
            return "Leve";
          } else {
            return "Não classificável como SDRA";
          }
        }
      } else {
        // Ventilação não invasiva ou sem suporte ventilatório
        if (pf_ratio !== null && pf_ratio !== undefined) {
          if (pf_ratio <= 300) {
            return "Leve";
          } else {
            return "Não classificável como SDRA";
          }
        } else if (sf_ratio !== null && sf_ratio !== undefined) {
          if (sf_ratio <= 264) {
            return "Leve";
          } else {
            return "Não classificável como SDRA";
          }
        }
      }
      
      return "Dados insuficientes para classificação";
    } catch (error) {
      console.error("Erro ao determinar gravidade:", error);
      throw new Error("Não foi possível determinar a gravidade da SDRA");
    }
  }
  
  recomendarTerapias(gravidade, dados_clinicos) {
    /**
     * Recomenda terapias com base na gravidade da SDRA e dados clínicos específicos
     */
    try {
      const recomendacoes = [];
      
      // Terapias básicas para todos os níveis de gravidade
      recomendacoes.push({
        terapia: "VM protetora",
        recomendacao: this.terapias[0].recomendacoes_palicc,
        prioridade: "alta"
      });
      
      recomendacoes.push({
        terapia: "Manutenção fluídica conservadora",
        recomendacao: this.terapias[1].recomendacoes_palicc,
        prioridade: "alta"
      });
      
      // Terapias adicionais baseadas na gravidade
      if (gravidade === "Moderada" || gravidade === "Grave") {
        // PEEP otimizada e manobras de recrutamento
        recomendacoes.push({
          terapia: "Manobras de recrutamento",
          recomendacao: this.terapias[5].recomendacoes_palicc,
          prioridade: "média"
        });
        
        // Bloqueadores neuromusculares
        recomendacoes.push({
          terapia: "Bloqueadores neuromusculares",
          recomendacao: this.terapias[6].recomendacoes_palicc,
          prioridade: "média"
        });
        
        // Considerar VOAF se pressão de platô elevada
        if ((dados_clinicos.pressao_plato || 0) > 28) {
          recomendacoes.push({
            terapia: "VOAF (Ventilação Oscilatória de Alta Frequência)",
            recomendacao: this.terapias[4].recomendacoes_palicc,
            prioridade: "média"
          });
        }
      }
      
      if (gravidade === "Grave") {
        // Posição prona
        recomendacoes.push({
          terapia: "Posição prona",
          recomendacao: this.terapias[3].recomendacoes_palicc,
          prioridade: "alta"
        });
        
        // Considerar óxido nítrico se HP ou disfunção de VD
        if (dados_clinicos.hipertensao_pulmonar || dados_clinicos.disfuncao_vd) {
          recomendacoes.push({
            terapia: "Óxido nítrico inalatório",
            recomendacao: this.terapias[2].recomendacoes_palicc,
            prioridade: "alta"
          });
        }
        
        // Considerar ECMO em casos graves refratários
        if (dados_clinicos.trocas_gasosas_inadequadas) {
          recomendacoes.push({
            terapia: "ECMO",
            recomendacao: this.terapias[9].recomendacoes_palicc,
            prioridade: "alta"
          });
        }
      }
      
      // Terapias NÃO recomendadas
      const recomendacoes_negativas = [
        {
          terapia: "Surfactante",
          recomendacao: this.terapias[7].recomendacoes_palicc,
          prioridade: "baixa"
        },
        {
          terapia: "Corticóides",
          recomendacao: this.terapias[8].recomendacoes_palicc,
          prioridade: "baixa"
        }
      ];
      
      return {
        recomendacoes_positivas: recomendacoes,
        recomendacoes_negativas: recomendacoes_negativas
      };
    } catch (error) {
      console.error("Erro ao recomendar terapias:", error);
      throw new Error("Não foi possível gerar recomendações terapêuticas para SDRA");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getCriteriosPalicc() {
    return this.criterios_palicc;
  }
  
  getCriteriosEspeciais() {
    return this.criterios_especiais;
  }
  
  getClassificacaoGravidade() {
    return this.classificacao_gravidade;
  }
  
  getTerapias() {
    return this.terapias;
  }
  
  calcular(dados) {
    /**
     * Método principal para processar dados e gerar recomendações completas
     */
    try {
      // Verificar critérios diagnósticos
      const criterios_atendidos = [];
      const criterios_nao_atendidos = [];
      
      for (const criterio of this.criterios_palicc) {
        const chave = criterio.criterio.toLowerCase().replace(" ", "_");
        if (dados[`criterio_${chave}`]) {
          criterios_atendidos.push(criterio);
        } else {
          criterios_nao_atendidos.push(criterio);
        }
      }
      
      // Verificar critérios especiais aplicáveis
      const criterios_especiais_aplicaveis = [];
      for (const criterio of this.criterios_especiais) {
        const chave = criterio.criterio.toLowerCase().replace(" ", "_").replace("ç", "c");
        if (dados[`criterio_${chave}`]) {
          criterios_especiais_aplicaveis.push(criterio);
        }
      }
      
      // Determinar se há diagnóstico de SDRA
      const diagnostico_sdra = criterios_atendidos.length === this.criterios_palicc.length;
      
      // Calcular índices e determinar gravidade
      const indices = this.calcularIndices(dados);
      
      // Gerar recomendações terapêuticas
      const recomendacoes = this.recomendarTerapias(indices.gravidade, dados);
      
      // Montar resposta completa
      return {
        diagnostico_sdra,
        criterios_atendidos,
        criterios_nao_atendidos,
        criterios_especiais_aplicaveis,
        indices,
        recomendacoes
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para SDRA:", error);
      throw new Error("Não foi possível calcular as recomendações para SDRA");
    }
  }
}

// Exporta uma instância do controlador
const controller = new SragController();
export default controller;
