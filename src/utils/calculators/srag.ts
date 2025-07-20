import { SragInput, SragResult, CriterioPALICC, CriterioEspecial, IndicesOxigenacao, RecomendacaoTerapeutica, RecomendacoesSRAG } from '@/types/protocol-calculators';

/**
 * Calculadora para SRAG (Síndrome Respiratória Aguda Grave)
 * Implementa critérios PALICC para SDRA pediátrica
 */
class SragCalculator {
  private static instance: SragCalculator;
  
  public static getInstance(): SragCalculator {
    if (!SragCalculator.instance) {
      SragCalculator.instance = new SragCalculator();
    }
    return SragCalculator.instance;
  }
  
  // Definições da SDRA pediátrica segundo PALICC
  private readonly criteriosPALICC: CriterioPALICC[] = [
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
  private readonly criteriosEspeciais: CriterioEspecial[] = [
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
  private readonly classificacaoGravidade = [
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
  private readonly terapias = [
    {
      terapia: "VM protetora",
      recomendacoesPALICC: "VC baixo: 3-6ml/kg se complacência diminuída e 5-8 ml/kg se complacência preservada. Pressão de platô menor ou igual a 28 cmH2O. Hipoxemia permissiva: SDRA leve: 92-97%; SDRA grave: 88-92%; PEEP > 10 cmH2O. Hipercapnia permissiva: moderada/grave: pH 7,15-7,3"
    },
    {
      terapia: "Manutenção fluídica",
      recomendacoesPALICC: "Manutenção: fluidos administrados para manter o volume intravascular e minimizar sobrecarga hídrica."
    },
    {
      terapia: "Óxido nítrico inalatório",
      recomendacoesPALICC: "O uso rotineiro não é recomendado. Considerar em pacientes com diagnóstico de HP, grave disfunção de VD e como ponte para ECMO"
    },
    {
      terapia: "Posição prona",
      recomendacoesPALICC: "Considerar como opção em PSDRA grave. Não pode ser recomendada rotineiramente."
    },
    {
      terapia: "VOAF",
      recomendacoesPALICC: "Considerar em pacientes com PSDRA moderada a grave e pressão de platô > 28 cmH2O"
    },
    {
      terapia: "Manobras de recrutamento",
      recomendacoesPALICC: "Titulação cuidadosa da PEEP"
    },
    {
      terapia: "Bloqueadores neuromusculares",
      recomendacoesPALICC: "Considerar seu uso se sedação for inadequada para atingir VM efetiva. Objetivar menor dose."
    },
    {
      terapia: "Surfactante",
      recomendacoesPALICC: "Uso rotineiro não recomendado. Mais estudos devem ser realizados"
    },
    {
      terapia: "Corticóides",
      recomendacoesPALICC: "Uso não recomendado"
    },
    {
      terapia: "ECMO",
      recomendacoesPALICC: "Considerar ECMO em PSDRA grave quando estratégias ventilatórias protetores resultarem em trocas gasosas inadequadas"
    }
  ];
  
  /**
   * Calcula os índices de oxigenação (IO e ISO) e determina a gravidade da SDRA
   */
  private calcularIndices(dados: SragInput): IndicesOxigenacao {
    let io: number | undefined;
    let iso: number | undefined;
    let pfRatio: number | undefined;
    let sfRatio: number | undefined;
    
    const { pao2, spo2, fio2, pmva } = dados;
    
    // Calcular relações PaO2/FiO2 e SpO2/FiO2
    if (pao2 !== undefined && fio2 > 0) {
      pfRatio = pao2 / fio2;
    }
    
    if (spo2 !== undefined && fio2 > 0) {
      sfRatio = spo2 / fio2;
    }
    
    // Calcular IO e ISO se em ventilação mecânica invasiva (VMI)
    if (pmva !== undefined && fio2 > 0) {
      if (pao2 !== undefined) {
        io = (pmva * fio2 * 100) / pao2;
      }
      if (spo2 !== undefined) {
        iso = (pmva * fio2 * 100) / spo2;
      }
    }
    
    // Determinar gravidade da SDRA
    const gravidade = this.determinarGravidade(io, iso, pfRatio, sfRatio, dados.ventilacaoMecanica);
    
    return {
      io,
      iso,
      pfRatio,
      sfRatio,
      gravidade
    };
  }
  
  /**
   * Determina a gravidade da SDRA com base nos índices calculados
   */
  private determinarGravidade(
    io?: number, 
    iso?: number, 
    pfRatio?: number, 
    sfRatio?: number, 
    ventilacaoMecanica?: string
  ): string {
    if (ventilacaoMecanica === 'invasiva') {
      if (io !== undefined) {
        if (io >= 16) {
          return "Grave";
        } else if (8 <= io && io < 16) {
          return "Moderada";
        } else if (4 <= io && io < 8) {
          return "Leve";
        } else {
          return "Não classificável como SDRA";
        }
      } else if (iso !== undefined) {
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
      if (pfRatio !== undefined) {
        if (pfRatio <= 300) {
          return "Leve";
        } else {
          return "Não classificável como SDRA";
        }
      } else if (sfRatio !== undefined) {
        if (sfRatio <= 264) {
          return "Leve";
        } else {
          return "Não classificável como SDRA";
        }
      }
    }
    
    return "Dados insuficientes para classificação";
  }
  
  /**
   * Recomenda terapias com base na gravidade da SDRA e dados clínicos específicos
   */
  private recomendarTerapias(gravidade: string, dados: SragInput): RecomendacoesSRAG {
    const recomendacoesPositivas: RecomendacaoTerapeutica[] = [];
    
    // Terapias básicas para todos os níveis de gravidade
    recomendacoesPositivas.push({
      terapia: "VM protetora",
      recomendacao: this.terapias[0].recomendacoesPALICC,
      prioridade: "alta"
    });
    
    recomendacoesPositivas.push({
      terapia: "Manutenção fluídica conservadora",
      recomendacao: this.terapias[1].recomendacoesPALICC,
      prioridade: "alta"
    });
    
    // Terapias adicionais baseadas na gravidade
    if (gravidade === "Moderada" || gravidade === "Grave") {
      // PEEP otimizada e manobras de recrutamento
      recomendacoesPositivas.push({
        terapia: "Manobras de recrutamento",
        recomendacao: this.terapias[5].recomendacoesPALICC,
        prioridade: "média"
      });
      
      // Bloqueadores neuromusculares
      recomendacoesPositivas.push({
        terapia: "Bloqueadores neuromusculares",
        recomendacao: this.terapias[6].recomendacoesPALICC,
        prioridade: "média"
      });
      
      // Considerar VOAF se pressão de platô elevada
      if (dados.pressaoPlato && dados.pressaoPlato > 28) {
        recomendacoesPositivas.push({
          terapia: "VOAF (Ventilação Oscilatória de Alta Frequência)",
          recomendacao: this.terapias[4].recomendacoesPALICC,
          prioridade: "média"
        });
      }
    }
    
    if (gravidade === "Grave") {
      // Posição prona
      recomendacoesPositivas.push({
        terapia: "Posição prona",
        recomendacao: this.terapias[3].recomendacoesPALICC,
        prioridade: "alta"
      });
      
      // Considerar óxido nítrico se HP ou disfunção de VD
      if (dados.hipertensaoPulmonar || dados.disfuncaoVD) {
        recomendacoesPositivas.push({
          terapia: "Óxido nítrico inalatório",
          recomendacao: this.terapias[2].recomendacoesPALICC,
          prioridade: "alta"
        });
      }
      
      // Considerar ECMO em casos graves refratários
      if (dados.trocasGasosasInadequadas) {
        recomendacoesPositivas.push({
          terapia: "ECMO",
          recomendacao: this.terapias[9].recomendacoesPALICC,
          prioridade: "alta"
        });
      }
    }
    
    // Terapias NÃO recomendadas
    const recomendacoesNegativas: RecomendacaoTerapeutica[] = [
      {
        terapia: "Surfactante",
        recomendacao: this.terapias[7].recomendacoesPALICC,
        prioridade: "baixa"
      },
      {
        terapia: "Corticóides",
        recomendacao: this.terapias[8].recomendacoesPALICC,
        prioridade: "baixa"
      }
    ];
    
    return {
      recomendacoesPositivas,
      recomendacoesNegativas
    };
  }
  
  /**
   * Método principal que calcula a avaliação de SRAG
   */
  public calcular(dados: SragInput): SragResult {
    try {
      // Validar dados de entrada
      if (dados.fio2 <= 0 || dados.fio2 > 1) {
        throw new Error('FiO2 deve estar entre 0.21 e 1.0');
      }
      
      // Verificar critérios diagnósticos
      const criteriosAtendidos: CriterioPALICC[] = [];
      const criteriosNaoAtendidos: CriterioPALICC[] = [];
      
      if (dados.criterioTempo) {
        criteriosAtendidos.push(this.criteriosPALICC[0]);
      } else {
        criteriosNaoAtendidos.push(this.criteriosPALICC[0]);
      }
      
      if (dados.criterioOrigemEdema) {
        criteriosAtendidos.push(this.criteriosPALICC[1]);
      } else {
        criteriosNaoAtendidos.push(this.criteriosPALICC[1]);
      }
      
      if (dados.criterioImagemRadiologica) {
        criteriosAtendidos.push(this.criteriosPALICC[2]);
      } else {
        criteriosNaoAtendidos.push(this.criteriosPALICC[2]);
      }
      
      // Verificar critérios especiais aplicáveis
      const criteriosEspeciaisAplicaveis: CriterioEspecial[] = [];
      if (dados.criterioDoencaCardiacaCongenita) {
        criteriosEspeciaisAplicaveis.push(this.criteriosEspeciais[0]);
      }
      if (dados.criterioDoencaPulmonarCronica) {
        criteriosEspeciaisAplicaveis.push(this.criteriosEspeciais[1]);
      }
      
      // Determinar se há diagnóstico de SDRA
      const diagnosticoSDRA = criteriosAtendidos.length === this.criteriosPALICC.length;
      
      // Calcular índices e determinar gravidade
      const indices = this.calcularIndices(dados);
      
      // Gerar recomendações terapêuticas
      const recomendacoes = this.recomendarTerapias(indices.gravidade, dados);
      
      return {
        diagnosticoSDRA,
        criteriosAtendidos,
        criteriosNaoAtendidos,
        criteriosEspeciaisAplicaveis,
        indices,
        recomendacoes
      };
      
    } catch (error) {
      throw new Error(`Erro no cálculo de SRAG: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}

// Exportar instância singleton
export const sragCalculator = SragCalculator.getInstance();
