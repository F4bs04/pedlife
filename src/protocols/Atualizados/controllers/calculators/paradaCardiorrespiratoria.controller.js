class ParadaCardiorrespiratoriaController {
  constructor() {
    // Definição dos medicamentos e doses
    this.medicacoes = {
      adrenalina: {
        dose: "0,01 mg/kg (0,1 ml/kg da solução 1:10.000)",
        frequencia: "A cada 3-5 minutos",
        via: "IV/IO",
        observacao: "Primeira medicação em assistolia e AESP"
      },
      amiodarona: {
        dose: "5 mg/kg em bolus",
        indicacao: "FV/TV sem pulso refratária a desfibrilação",
        via: "IV/IO"
      },
      lidocaina: {
        dose: "1 mg/kg",
        indicacao: "Alternativa à amiodarona",
        via: "IV/IO"
      },
      sulfato_magnesio: {
        dose: "25-50 mg/kg (máximo 2g)",
        indicacao: "Torsades de pointes ou hipomagnesemia",
        via: "IV/IO"
      },
      bicarbonato_sodio: {
        dose: "1 mEq/kg",
        indicacao: "Acidose metabólica grave documentada, hipercalemia, overdose de antidepressivos tricíclicos",
        via: "IV/IO",
        observacao: "Não recomendado rotineiramente"
      }
    };
    
    // Causas reversíveis (5 Hs e 5 Ts)
    this.causas_reversiveis = [
      "Hipoxemia",
      "Hipovolemia",
      "Hidrogênio (acidose)",
      "Hipo/hipercalemia",
      "Hipotermia",
      "Tensão no tórax (pneumotórax hipertensivo)",
      "Tamponamento cardíaco",
      "Toxinas (intoxicações)",
      "Tromboembolismo pulmonar",
      "Trauma"
    ];
    
    // Relações compressão-ventilação
    this.relacoes_compressao_ventilacao = {
      "1_socorrista": "30:2 (30 compressões para 2 ventilações)",
      "2_socorristas": "15:2 (15 compressões para 2 ventilações)",
      "via_aerea_avancada": "Compressão contínua (100-120/min) e ventilação a cada 6 segundos (10/min)"
    };
    
    // Energias para desfibrilação
    this.energias_desfibrilacao = {
      primeira: "2 J/kg",
      subsequentes: "4 J/kg (máximo 10 J/kg ou dose adulta)"
    };
    
    // Ritmos de PCR
    this.ritmos = [
      {
        nome: "Assistolia",
        chocavel: false,
        descricao: "Ausência de atividade elétrica cardíaca",
        caracteristicas: ["Linha reta no monitor", "Ausência de pulso"],
        tratamento: ["RCP de alta qualidade", "Adrenalina imediata", "Buscar causas reversíveis"]
      },
      {
        nome: "Atividade Elétrica Sem Pulso (AESP)",
        chocavel: false,
        descricao: "Atividade elétrica organizada sem pulso central palpável",
        caracteristicas: ["Ritmo organizado no monitor", "Ausência de pulso"],
        tratamento: ["RCP de alta qualidade", "Adrenalina imediata", "Buscar causas reversíveis"]
      },
      {
        nome: "Fibrilação Ventricular (FV)",
        chocavel: true,
        descricao: "Contrações descoordenadas do ventrículo, sem sístole efetiva",
        caracteristicas: ["Ritmo caótico e irregular no monitor", "Ausência de pulso"],
        tratamento: ["Desfibrilação imediata", "RCP de alta qualidade", "Adrenalina", "Antiarrítmicos após 3ª desfibrilação"]
      },
      {
        nome: "Taquicardia Ventricular sem pulso (TV)",
        chocavel: true,
        descricao: "Ritmo rápido e organizado de origem ventricular sem pulso palpável",
        caracteristicas: ["Ritmo rápido e regular no monitor", "Ausência de pulso"],
        tratamento: ["Desfibrilação imediata", "RCP de alta qualidade", "Adrenalina", "Antiarrítmicos após 3ª desfibrilação"]
      }
    ];
  }

  calcularDoseAdrenalina(peso) {
    /**
     * Calcula a dose de adrenalina baseada no peso
     */
    try {
      const dose_mg = Number((0.01 * peso).toFixed(3));
      const dose_ml = Number((0.1 * peso).toFixed(2));
      const dose_maxima_ml = 10;  // Equivalente a 1mg
      
      let resultado = {
        dose_mg,
        dose_ml,
        solucao: "1:10.000"
      };
      
      if (dose_ml > dose_maxima_ml) {
        resultado.dose_ml = dose_maxima_ml;
        resultado.dose_mg = 1;
      }
      
      return resultado;
    } catch (error) {
      console.error("Erro ao calcular dose de adrenalina:", error);
      throw new Error("Não foi possível calcular a dose de adrenalina");
    }
  }
  
  calcularDoseAmiodarona(peso) {
    /**
     * Calcula a dose de amiodarona baseada no peso
     */
    try {
      let dose_mg = Number((5 * peso).toFixed(1));
      const dose_maxima = 300;  // 300mg é a dose máxima para adultos
      
      if (dose_mg > dose_maxima) {
        dose_mg = dose_maxima;
      }
      
      return {
        dose_mg
      };
    } catch (error) {
      console.error("Erro ao calcular dose de amiodarona:", error);
      throw new Error("Não foi possível calcular a dose de amiodarona");
    }
  }
  
  calcularDoseLidocaina(peso) {
    /**
     * Calcula a dose de lidocaína baseada no peso
     */
    try {
      let dose_mg = Number((1 * peso).toFixed(1));
      const dose_maxima = 100;  // 100mg é geralmente a dose máxima
      
      if (dose_mg > dose_maxima) {
        dose_mg = dose_maxima;
      }
      
      return {
        dose_mg
      };
    } catch (error) {
      console.error("Erro ao calcular dose de lidocaína:", error);
      throw new Error("Não foi possível calcular a dose de lidocaína");
    }
  }
  
  calcularDoseSulfatoMagnesio(peso) {
    /**
     * Calcula a dose de sulfato de magnésio baseada no peso
     */
    try {
      let dose_min_mg = Number((25 * peso).toFixed(1));
      let dose_max_mg = Number((50 * peso).toFixed(1));
      const dose_maxima = 2000;  // 2g é a dose máxima
      
      if (dose_max_mg > dose_maxima) {
        dose_max_mg = dose_maxima;
      }
      
      return {
        dose_min_mg,
        dose_max_mg
      };
    } catch (error) {
      console.error("Erro ao calcular dose de sulfato de magnésio:", error);
      throw new Error("Não foi possível calcular a dose de sulfato de magnésio");
    }
  }
  
  calcularDoseBicarbonato(peso) {
    /**
     * Calcula a dose de bicarbonato de sódio baseada no peso
     */
    try {
      let dose_meq = Number((1 * peso).toFixed(1));
      let dose_ml = dose_meq * 1;  // 1 mEq/mL na solução a 8,4%
      const dose_maxima_meq = 50;  // Dose máxima aproximada para adultos
      
      if (dose_meq > dose_maxima_meq) {
        dose_meq = dose_maxima_meq;
        dose_ml = dose_maxima_meq;
      }
      
      return {
        dose_meq,
        dose_ml,
        solucao: "8,4%"
      };
    } catch (error) {
      console.error("Erro ao calcular dose de bicarbonato:", error);
      throw new Error("Não foi possível calcular a dose de bicarbonato");
    }
  }
  
  calcularEnergiaDesfibrilacao(peso) {
    /**
     * Calcula as energias para desfibrilação baseadas no peso
     */
    try {
      const primeira_dose = Math.round(2 * peso);
      const doses_subsequentes = Math.round(4 * peso);
      const dose_maxima = Math.min(Math.round(10 * peso), 360);  // Máximo de 10 J/kg ou dose adulta
      
      return {
        primeira_dose,
        doses_subsequentes,
        dose_maxima
      };
    } catch (error) {
      console.error("Erro ao calcular energia de desfibrilação:", error);
      throw new Error("Não foi possível calcular a energia de desfibrilação");
    }
  }
  
  calcularProfundidadeCompressao(idade_anos) {
    /**
     * Calcula a profundidade adequada da compressão torácica
     */
    try {
      if (idade_anos <= 1) {  // Lactente
        return "1/3 do diâmetro AP do tórax (aproximadamente 4 cm)";
      } else if (idade_anos < 8) {  // Criança
        return "1/3 do diâmetro AP do tórax (aproximadamente 5 cm)";
      } else {  // Adolescente ou adulto
        return "5-6 cm";
      }
    } catch (error) {
      console.error("Erro ao calcular profundidade de compressão:", error);
      throw new Error("Não foi possível calcular a profundidade de compressão");
    }
  }
  
  determinarViaAcesso(idade_anos, peso) {
    /**
     * Determina a via de acesso preferencial
     */
    try {
      if (idade_anos <= 6) {
        return "Acesso intraósseo como primeira opção se acesso venoso difícil";
      } else {
        return "Acesso venoso periférico, com acesso intraósseo como alternativa";
      }
    } catch (error) {
      console.error("Erro ao determinar via de acesso:", error);
      throw new Error("Não foi possível determinar a via de acesso");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getMedicacoes() {
    return this.medicacoes;
  }
  
  getCausasReversiveis() {
    return this.causas_reversiveis;
  }
  
  getRelacoesCompressaoVentilacao() {
    return this.relacoes_compressao_ventilacao;
  }
  
  getEnergiasDesfibrilacao() {
    return this.energias_desfibrilacao;
  }
  
  getRitmos() {
    return this.ritmos;
  }
  
  calcular(dados) {
    /**
     * Método principal que processa os dados e retorna os resultados
     */
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade_anos = parseInt(dados.idade_anos || 0);
      const ritmo = dados.ritmo || "";
      
      // Validar dados
      if (peso <= 0) {
        return { erro: "O peso deve ser maior que zero." };
      }
      
      // Calcular doses de medicações
      const resultados = {
        peso,
        idade_anos,
        doses: {
          adrenalina: this.calcularDoseAdrenalina(peso),
          amiodarona: this.calcularDoseAmiodarona(peso),
          lidocaina: this.calcularDoseLidocaina(peso),
          sulfato_magnesio: this.calcularDoseSulfatoMagnesio(peso),
          bicarbonato: this.calcularDoseBicarbonato(peso)
        },
        desfibrilacao: this.calcularEnergiaDesfibrilacao(peso),
        compressao: {
          profundidade: this.calcularProfundidadeCompressao(idade_anos),
          frequencia: "100-120/minuto",
          relacao: this.relacoes_compressao_ventilacao
        },
        acesso: this.determinarViaAcesso(idade_anos, peso),
        causas_reversiveis: this.causas_reversiveis
      };
      
      // Adicionar dados específicos do ritmo, se fornecido
      if (ritmo) {
        const ritmo_dados = this.ritmos.find(r => r.nome === ritmo);
        if (ritmo_dados) {
          resultados.ritmo = ritmo_dados;
        }
      }
      
      return resultados;
    } catch (error) {
      console.error("Erro ao calcular recomendações para parada cardiorrespiratória:", error);
      throw new Error("Não foi possível calcular as recomendações para parada cardiorrespiratória");
    }
  }
}

// Exporta uma instância do controlador
const controller = new ParadaCardiorrespiratoriaController();
export default controller;
