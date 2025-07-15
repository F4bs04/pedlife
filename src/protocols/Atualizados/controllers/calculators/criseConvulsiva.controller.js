class CriseConvulsivaController {
  constructor() {
    // Medicações principais
    this.medicacoes_iniciais = [
      {
        nome: "Diazepam",
        dose: "0,3 a 0,5 mg/kg/dose IV ou retal",
        dose_maxima: "10 mg",
        velocidade: "máxima de 1 mg/kg/min",
        observacao: "Pode repetir após 10 min. Dose de escolha para o tratamento inicial."
      },
      {
        nome: "Midazolam",
        dose: "0,05 a 0,2 mg/kg/dose",
        velocidade: "máxima de 4 mg/min",
        vias: ["intravenosa", "intramuscular", "nasal", "retal"]
      }
    ];

    this.medicacoes_segundo_nivel = [
      {
        nome: "Fenobarbital IV",
        dose: "20 mg/kg/dose",
        velocidade: "máx. 1 mg/kg/min"
      },
      {
        nome: "Fenitoína",
        dose_ataque: "20 mg/kg/dose IV",
        preparo: "diluído 1:20 SF 0,9%",
        velocidade: "máx. 1 mg/kg/min",
        observacao: "Concomitante aos benzodiazepínicos (uma vez que a ação dos primeiros é fugaz)",
        dose_adicional: "10 mg/kg após 60 minutos, se necessário",
        manutencao: "5 a 10 mg/kg/dia"
      }
    ];

    this.medicacoes_eme = [
      {
        nome: "Midazolam infusão contínua",
        dose: "0,05 mg a 0,4 mg/kg/hora"
      },
      {
        nome: "Tiopental",
        dose: "10,0 a 120,0 μg/kg/min"
      },
      {
        nome: "Propofol",
        dose: "3 a 5 mg/kg/hora"
      }
    ];
    
    // Critérios para diagnóstico e manejo
    this.criterios_puncao_lombar = [
      "Crianças abaixo de 12 meses após a primeira crise convulsiva",
      "Crianças entre 12 e 18 meses com manifestações incertas",
      "Pacientes acima de 18 meses com sinais e sintomas sugestivos de infecção central"
    ];
  }

  calcularDoseDiazepam(peso) {
    /**
     * Calcula a dose de diazepam baseado no peso
     */
    try {
      const dose_min = Number((0.3 * peso).toFixed(1));
      const dose_max = Number((0.5 * peso).toFixed(1));
      const dose_maxima_total = 10;
      
      let dose_min_final = dose_min;
      let dose_max_final = dose_max;
      
      if (dose_max > dose_maxima_total) {
        dose_max_final = dose_maxima_total;
      }
      
      if (dose_min > dose_maxima_total) {
        dose_min_final = dose_maxima_total;
      }
          
      return {
        nome: "Diazepam",
        dose_min: dose_min_final,
        dose_max: dose_max_final,
        dose_maxima_total: dose_maxima_total,
        dose_formulacao: `${dose_min_final} a ${dose_max_final} mg IV ou retal`,
        velocidade: "máx. 1 mg/kg/min"
      };
    } catch (error) {
      console.error("Erro ao calcular dose de diazepam:", error);
      throw new Error("Não foi possível calcular a dose de diazepam");
    }
  }
  
  calcularDoseMidazolam(peso) {
    /**
     * Calcula a dose de midazolam baseado no peso
     */
    try {
      const dose_min = Number((0.05 * peso).toFixed(2));
      const dose_max = Number((0.2 * peso).toFixed(2));
      
      return {
        nome: "Midazolam",
        dose_min: dose_min,
        dose_max: dose_max,
        dose_formulacao: `${dose_min} a ${dose_max} mg IV/IM/nasal/retal`,
        velocidade: "máx. 4 mg/min"
      };
    } catch (error) {
      console.error("Erro ao calcular dose de midazolam:", error);
      throw new Error("Não foi possível calcular a dose de midazolam");
    }
  }
  
  calcularDoseFenobarbital(peso) {
    /**
     * Calcula a dose de fenobarbital baseado no peso
     */
    try {
      const dose = Number((20 * peso).toFixed(1));
      
      return {
        nome: "Fenobarbital",
        dose: dose,
        dose_formulacao: `${dose} mg IV`,
        velocidade: "máx. 1 mg/kg/min"
      };
    } catch (error) {
      console.error("Erro ao calcular dose de fenobarbital:", error);
      throw new Error("Não foi possível calcular a dose de fenobarbital");
    }
  }
  
  calcularDoseFenitoina(peso) {
    /**
     * Calcula a dose de fenitoína baseado no peso
     */
    try {
      const dose_ataque = Number((20 * peso).toFixed(1));
      const dose_adicional = Number((10 * peso).toFixed(1));
      const dose_manutencao_min = Number((5 * peso).toFixed(1));
      const dose_manutencao_max = Number((10 * peso).toFixed(1));
      
      return {
        nome: "Fenitoína",
        dose_ataque: dose_ataque,
        dose_adicional: dose_adicional,
        dose_manutencao_min: dose_manutencao_min,
        dose_manutencao_max: dose_manutencao_max,
        dose_formulacao_ataque: `${dose_ataque} mg IV (diluído 1:20 SF 0,9%)`,
        dose_formulacao_adicional: `${dose_adicional} mg IV (se necessário após 60 min)`,
        dose_formulacao_manutencao: `${dose_manutencao_min} a ${dose_manutencao_max} mg/dia`,
        velocidade: "máx. 1 mg/kg/min"
      };
    } catch (error) {
      console.error("Erro ao calcular dose de fenitoína:", error);
      throw new Error("Não foi possível calcular a dose de fenitoína");
    }
  }
  
  calcularDoseMidazolamInfusao(peso) {
    /**
     * Calcula a dose de midazolam em infusão contínua baseado no peso
     */
    try {
      const dose_min = Number((0.05 * peso).toFixed(2));
      const dose_max = Number((0.4 * peso).toFixed(2));
      
      return {
        nome: "Midazolam (infusão contínua)",
        dose_min: dose_min,
        dose_max: dose_max,
        dose_formulacao: `${dose_min} a ${dose_max} mg/hora`
      };
    } catch (error) {
      console.error("Erro ao calcular dose de midazolam em infusão:", error);
      throw new Error("Não foi possível calcular a dose de midazolam em infusão");
    }
  }
  
  avaliarEme(tempo_crise) {
    /**
     * Avalia critérios para Estado de Mal Epiléptico
     */
    try {
      const eme = tempo_crise >= 30;
          
      return {
        eme: eme,
        definicao: "Estado de Mal Epiléptico (EME) compreende uma crise prolongada ou crises recorrentes sem recuperação completa da consciência por 30 minutos ou mais."
      };
    } catch (error) {
      console.error("Erro ao avaliar EME:", error);
      throw new Error("Não foi possível avaliar o Estado de Mal Epiléptico");
    }
  }
  
  avaliarCriteriosHospitalizacao(primeira_crise, idade_meses, febre, retorno_consciencia, glasgow) {
    /**
     * Avalia se há critérios para hospitalização
     */
    try {
      const criterios = [];
      
      if (primeira_crise) {
        criterios.push("Primeira crise convulsiva");
      }
          
      if (idade_meses < 12) {
        criterios.push("Idade menor que 12 meses");
      }
          
      if (febre) {
        criterios.push("Presença de febre (considerar investigação de meningite)");
      }
          
      if (!retorno_consciencia) {
        criterios.push("Sem retorno ao estado de consciência normal após a crise");
      }
          
      if (glasgow < 15) {
        criterios.push(`Glasgow menor que 15 (atual: ${glasgow})`);
      }
          
      return criterios;
    } catch (error) {
      console.error("Erro ao avaliar critérios de hospitalização:", error);
      throw new Error("Não foi possível avaliar os critérios de hospitalização");
    }
  }
  
  avaliarNecessidadePuncaoLombar(idade_meses, febre, suspeita_infeccao) {
    /**
     * Avalia se há indicação de punção lombar
     */
    try {
      let indicacao = false;
      const criterios = [];
      
      if (idade_meses < 12) {
        indicacao = true;
        criterios.push("Criança abaixo de 12 meses após a primeira crise convulsiva");
      } else if (idade_meses >= 12 && idade_meses <= 18) {
        indicacao = true;
        criterios.push("Criança entre 12 e 18 meses de vida");
      } else if (idade_meses > 18 && (febre || suspeita_infeccao)) {
        indicacao = true;
        criterios.push("Paciente acima de 18 meses com sinais e sintomas sugestivos de infecção central");
      }
          
      return {
        indicacao: indicacao,
        criterios: criterios
      };
    } catch (error) {
      console.error("Erro ao avaliar necessidade de punção lombar:", error);
      throw new Error("Não foi possível avaliar a necessidade de punção lombar");
    }
  }

  // Retorna todas as medicações iniciais
  getMedicacoesIniciais() {
    return this.medicacoes_iniciais;
  }

  // Retorna as medicações de segundo nível
  getMedicacoesSegundoNivel() {
    return this.medicacoes_segundo_nivel;
  }

  // Retorna as medicações para estado de mal epiléptico
  getMedicacoesEME() {
    return this.medicacoes_eme;
  }
  
  // Retorna os critérios para punção lombar
  getCriteriosPuncaoLombar() {
    return this.criterios_puncao_lombar;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      // Extrair dados
      const idade_anos = parseInt(dados.idade_anos || 0);
      const idade_meses_adicional = parseInt(dados.idade_meses || 0);
      const idade_meses = (idade_anos * 12) + idade_meses_adicional;
      const peso = parseFloat(dados.peso || 0);
      
      // Informações sobre a crise
      const crise_cessou = dados.crise_cessou || true;
      const tempo_crise = parseInt(dados.tempo_crise || 0);
      const primeira_crise = dados.primeira_crise || false;
      const febre = dados.febre || false;
      const retorno_consciencia = dados.retorno_consciencia || true;
      const glasgow = parseInt(dados.glasgow || 15);
      const suspeita_infeccao = dados.suspeita_infeccao || false;
      
      // Avaliar estado de mal epiléptico
      const avaliacao_eme = this.avaliarEme(tempo_crise);
      
      // Calcular doses das medicações
      const doses = {
        diazepam: this.calcularDoseDiazepam(peso),
        midazolam: this.calcularDoseMidazolam(peso),
        fenobarbital: this.calcularDoseFenobarbital(peso),
        fenitoina: this.calcularDoseFenitoina(peso),
        midazolam_infusao: this.calcularDoseMidazolamInfusao(peso)
      };
      
      // Avaliar critérios de hospitalização
      const criterios_hospitalizacao = this.avaliarCriteriosHospitalizacao(
        primeira_crise, idade_meses, febre, retorno_consciencia, glasgow
      );
      
      // Avaliar necessidade de punção lombar
      const avaliacao_pl = this.avaliarNecessidadePuncaoLombar(
        idade_meses, febre, suspeita_infeccao
      );
      
      // Definir conduta terapêutica
      const conduta = {};
      
      if (crise_cessou) {
        conduta.cessar_medicacao = true;
        conduta.recomendacao = "Não administrar medicação anticonvulsivante, pois a crise já cessou.";
        conduta.observacao = "Observação por 24h e acompanhamento ambulatorial.";
      } else {
        conduta.cessar_medicacao = false;
        
        if (avaliacao_eme.eme) {
          conduta.recomendacao = "Estado de Mal Epiléptico (EME) - Iniciar protocolo de tratamento intensivo.";
          conduta.esquema = [
            "1. Diazepam ou Midazolam na dose calculada",
            "2. Se crise persistir após 10 minutos, administrar Fenobarbital ou Fenitoína",
            "3. Se crise persistir, considerar Midazolam em infusão contínua",
            "4. Avaliar necessidade de intubação orotraqueal e internação em UTI"
          ];
        } else {
          conduta.recomendacao = "Iniciar tratamento com benzodiazepínico.";
          conduta.esquema = [
            "1. Diazepam ou Midazolam na dose calculada",
            "2. Se crise persistir após 10 minutos, pode repetir dose inicial",
            "3. Se persistência da crise, administrar Fenobarbital ou Fenitoína"
          ];
        }
      }
      
      // Resultado final
      return {
        idade_meses: idade_meses,
        peso: peso,
        crise_cessou: crise_cessou,
        tempo_crise: tempo_crise,
        avaliacao_eme: avaliacao_eme,
        doses: doses,
        criterios_hospitalizacao: criterios_hospitalizacao,
        necessidade_hospitalizacao: criterios_hospitalizacao.length > 0,
        avaliacao_pl: avaliacao_pl,
        conduta: conduta
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para crise convulsiva:", error);
      throw new Error("Não foi possível calcular as recomendações para crise convulsiva");
    }
  }
}

// Exporta uma instância do controlador
const controller = new CriseConvulsivaController();
export default controller;
