class CetoacidoseDiabeticaController {
  classificacao_gravidade: any[];
  solucoes_hidratacao: any;
  protocolo_insulina: any;
  
  constructor() {
    // Classificação da cetoacidose diabética
    this.classificacao_gravidade = [
      {
        gravidade: "Leve",
        criterios: {
          ph: "7,25-7,30",
          bicarbonato: "15-18 mEq/L",
          cetonas: "Positivas",
          nivel_consciencia: "Alerta"
        }
      },
      {
        gravidade: "Moderada",
        criterios: {
          ph: "7,00-7,24",
          bicarbonato: "10-14 mEq/L",
          cetonas: "Positivas",
          nivel_consciencia: "Alerta/sonolento"
        }
      },
      {
        gravidade: "Grave",
        criterios: {
          ph: "< 7,00",
          bicarbonato: "< 10 mEq/L",
          cetonas: "Positivas",
          nivel_consciencia: "Estupor/coma"
        }
      }
    ];
    
    this.solucoes_hidratacao = {
      sf_09: {
        composicao: "NaCl 0,9%",
        indicacao: "Expansão inicial se choque/desidratação grave",
        dose: "10-20 mL/kg em 1-2 horas"
      },
      sf_045: {
        composicao: "NaCl 0,45% + SG 5%",
        indicacao: "Manutenção após expansão inicial",
        eletrólitos: "Adicionar KCl conforme necessário"
      },
      bicarbonato: {
        composicao: "NaHCO3 8,4%",
        indicacao: "Apenas se pH < 6,9 ou instabilidade hemodinâmica",
        dose: "1-2 mEq/kg diluído em 4x o volume com água destilada"
      }
    };
    
    this.protocolo_insulina = {
      insulina_regular: {
        dose_inicial: "0,1 UI/kg/h",
        dose_minima: "0,05 UI/kg/h",
        dose_maxima: "0,15 UI/kg/h",
        via: "Endovenosa contínua",
        diluicao: "1 UI/mL em SF 0,9%"
      },
      objetivo_glicemico: {
        reducao_horaria: "50-75 mg/dL/h",
        meta_inicial: "200-250 mg/dL",
        meta_manutencao: "150-200 mg/dL"
      }
    };
  }

  classificarGravidade(ph: number, bicarbonato: number, nivelConsciencia: string): any {
    try {
      let gravidade = "Leve";
      let classificacao = this.classificacao_gravidade[0];
      
      if (ph < 7.00 || bicarbonato < 10) {
        gravidade = "Grave";
        classificacao = this.classificacao_gravidade[2];
      } else if (ph < 7.25 || bicarbonato < 15) {
        gravidade = "Moderada";
        classificacao = this.classificacao_gravidade[1];
      }
      
      // Ajustar pela consciência
      if (nivelConsciencia === "coma" || nivelConsciencia === "estupor") {
        gravidade = "Grave";
        classificacao = this.classificacao_gravidade[2];
      }
      
      return {
        gravidade: gravidade,
        classificacao: classificacao,
        ph_categorizado: ph < 6.9 ? "Crítico" : ph < 7.0 ? "Muito baixo" : ph < 7.25 ? "Baixo" : "Aceitável"
      };
    } catch (error: any) {
      throw new Error("Erro ao classificar gravidade da cetoacidose");
    }
  }

  calcularHidratacao(peso: number, desidratacao: number, gravidade: string): any {
    try {
      // Calcular necessidade basal
      let necessidadeBasal = 0;
      if (peso <= 10) {
        necessidadeBasal = peso * 100;
      } else if (peso <= 20) {
        necessidadeBasal = 1000 + ((peso - 10) * 50);
      } else {
        necessidadeBasal = 1500 + ((peso - 20) * 20);
      }
      
      // Calcular déficit (estimativa de desidratação)
      const deficitEstimado = peso * (desidratacao / 100) * 1000; // mL
      
      // Hidratação em 48 horas (exceto expansão inicial)
      const volumeTotal48h = necessidadeBasal + (deficitEstimado * 0.5); // 50% do déficit em 48h
      const volumeHorario = Math.round(volumeTotal48h / 48);
      
      // Expansão inicial se necessário
      let expansaoInicial = null;
      if (gravidade === "Grave" || desidratacao >= 10) {
        expansaoInicial = {
          solucao: "SF 0,9%",
          volume: peso * 10,
          tempo: "1 hora",
          observacao: "Reavaliar após expansão, máximo 20 mL/kg total"
        };
      }
      
      return {
        necessidade_basal: necessidadeBasal,
        deficit_estimado: deficitEstimado,
        volume_48h: volumeTotal48h,
        volume_horario: volumeHorario,
        expansao_inicial: expansaoInicial,
        solucao_manutencao: "SF 0,45% + SG 5% + KCl"
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular hidratação");
    }
  }

  calcularInsulinoterapia(peso: number, glicemiaInicial: number): any {
    try {
      const doseInicial = 0.1; // UI/kg/h
      const infusaoHoraria = peso * doseInicial;
      
      // Preparação da solução
      const soluçãoInsulina = {
        concentracao: "1 UI/mL",
        preparo: `${peso * 0.5} UI de insulina regular em ${peso * 0.5} mL de SF 0,9%`,
        velocidade_inicial: `${infusaoHoraria} mL/h`,
        dose_kg_h: `${doseInicial} UI/kg/h`
      };
      
      // Metas glicêmicas
      const metasGlicemia = {
        reducao_horaria: "50-75 mg/dL/h",
        meta_4h: Math.max(glicemiaInicial - (65 * 4), 250),
        meta_8h: Math.max(glicemiaInicial - (65 * 8), 200),
        glicemia_manutencao: "150-200 mg/dL"
      };
      
      // Ajustes da insulina
      const ajustesInsulina = [
        "Se glicemia não diminuir em 1h: aumentar para 0,15 UI/kg/h",
        "Se glicemia < 250 mg/dL: adicionar SG 10% e manter insulina",
        "Se glicemia < 150 mg/dL: reduzir insulina para 0,05 UI/kg/h",
        "Manter insulina até resolução da cetose"
      ];
      
      return {
        solucao: soluçãoInsulina,
        metas: metasGlicemia,
        ajustes: ajustesInsulina
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular insulinoterapia");
    }
  }

  avaliarNecessidadeBicarbonato(ph: number, peso: number): any {
    try {
      if (ph >= 6.9) {
        return {
          indicado: false,
          motivo: "pH ≥ 6,9 - bicarbonato não recomendado",
          observacao: "Correção com insulina e hidratação"
        };
      }
      
      // Cálculo da dose de bicarbonato
      const doseBicarbonato = peso * 1; // 1 mEq/kg como dose inicial
      const volumeDiluicao = doseBicarbonato * 4; // Diluir em 4x o volume
      
      return {
        indicado: true,
        motivo: "pH < 6,9 ou instabilidade hemodinâmica",
        dose: `${doseBicarbonato} mEq`,
        preparo: `${doseBicarbonato} mL de NaHCO3 8,4% em ${volumeDiluicao} mL de água destilada`,
        infusao: "Em 1-2 horas",
        observacao: "Reavaliar gasometria após infusão"
      };
    } catch (error: any) {
      throw new Error("Erro ao avaliar necessidade de bicarbonato");
    }
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade || 0);
      const glicemia = parseFloat(dados.glicemia || 0);
      const ph = parseFloat(dados.ph || 7.4);
      const bicarbonato = parseFloat(dados.bicarbonato || 24);
      const nivelConsciencia = dados.nivel_consciencia || "alerta";
      const desidratacao = parseFloat(dados.desidratacao || 5);
      
      if (peso <= 0 || glicemia <= 0) {
        throw new Error("Peso e glicemia devem ser informados e maiores que zero");
      }
      
      // Classificar gravidade
      const classificacao = this.classificarGravidade(ph, bicarbonato, nivelConsciencia);
      
      // Calcular hidratação
      const planoHidratacao = this.calcularHidratacao(peso, desidratacao, classificacao.gravidade);
      
      // Calcular insulinoterapia
      const planoInsulina = this.calcularInsulinoterapia(peso, glicemia);
      
      // Avaliar necessidade de bicarbonato
      const avaliacaoBicarbonato = this.avaliarNecessidadeBicarbonato(ph, peso);
      
      // Monitorização necessária
      const monitorizacao = [
        "Gasometria arterial a cada 2-4 horas",
        "Glicemia horária",
        "Eletrólitos (Na, K, Cl) a cada 2-4 horas",
        "Sinais vitais a cada 1 hora",
        "Diurese horária",
        "Peso diário",
        "Nível de consciência"
      ];
      
      // Critérios de resolução
      const criteriosResolucao = [
        "pH > 7,30",
        "Bicarbonato > 15 mEq/L",
        "Ânion gap < 12 mEq/L",
        "Cetonas urinárias negativas ou traços",
        "Paciente acordado e tolerando via oral"
      ];
      
      // Complicações a observar
      const complicacoes = [
        "Edema cerebral (mais comum em crianças)",
        "Hipocalemia",
        "Hipoglicemia",
        "Edema pulmonar",
        "Trombose"
      ];
      
      return {
        classificacao: classificacao,
        hidratacao: planoHidratacao,
        insulinoterapia: planoInsulina,
        bicarbonato: avaliacaoBicarbonato,
        monitorizacao: monitorizacao,
        criterios_resolucao: criteriosResolucao,
        complicacoes_observar: complicacoes,
        internacao_uti: classificacao.gravidade === "Grave" || ph < 7.0
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular tratamento da cetoacidose diabética: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getClassificacaoGravidade(): any[] {
    return this.classificacao_gravidade;
  }
  
  getProtocoloInsulina(): any {
    return this.protocolo_insulina;
  }
}

const controller = new CetoacidoseDiabeticaController();
export default controller;
