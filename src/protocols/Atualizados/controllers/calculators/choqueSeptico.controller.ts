class ChoqueSepticoController {
  criterios_choque: any[];
  valores_pressao_normal: any[];
  vasopressores: any;
  antibioticos: any[];
  
  constructor() {
    // Critérios de choque séptico
    this.criterios_choque = [
      "Hipotensão para a idade",
      "Perfusão inadequada (enchimento capilar > 3s)",
      "Taquicardia para a idade",
      "Sinais de hipoperfusão (extremidades frias, cianose)",
      "Oligúria (< 1 mL/kg/h)",
      "Alteração do nível de consciência",
      "Lactato sérico elevado (> 2 mmol/L)"
    ];
    
    // Valores de pressão arterial normal por idade
    this.valores_pressao_normal = [
      {faixa_etaria: "0-1 mês", pressao_minima: 60, pressao_normal: "60-76"},
      {faixa_etaria: "1-12 meses", pressao_minima: 70, pressao_normal: "70-84"},
      {faixa_etaria: "1-2 anos", pressao_minima: 74, pressao_normal: "74-88"},
      {faixa_etaria: "2-5 anos", pressao_minima: 80, pressao_normal: "80-94"},
      {faixa_etaria: "5-12 anos", pressao_minima: 90, pressao_normal: "90-110"},
      {faixa_etaria: "> 12 anos", pressao_minima: 100, pressao_normal: "100-120"}
    ];
    
    this.vasopressores = {
      noradrenalina: {
        dose_inicial: "0,05-0,1 mcg/kg/min",
        dose_maxima: "2 mcg/kg/min",
        indicacao: "Primeira escolha no choque quente",
        preparo: "4 mg em 250 mL (16 mcg/mL)"
      },
      adrenalina: {
        dose_inicial: "0,05-0,1 mcg/kg/min",
        dose_maxima: "2 mcg/kg/min", 
        indicacao: "Choque frio ou falha de noradrenalina",
        preparo: "4 mg em 250 mL (16 mcg/mL)"
      },
      dopamina: {
        dose_inicial: "5-10 mcg/kg/min",
        dose_maxima: "20 mcg/kg/min",
        indicacao: "Segunda linha ou bradicardia",
        preparo: "200 mg em 250 mL (800 mcg/mL)"
      },
      dobutamina: {
        dose_inicial: "5 mcg/kg/min",
        dose_maxima: "20 mcg/kg/min",
        indicacao: "Disfunção miocárdica",
        preparo: "250 mg em 250 mL (1000 mcg/mL)"
      }
    };
    
    this.antibioticos = [
      {
        indicacao: "Sepse comunitária",
        primeira_linha: "Ceftriaxona 100 mg/kg/dia",
        alternativa: "Ampicilina + Gentamicina"
      },
      {
        indicacao: "Sepse hospitalar",
        primeira_linha: "Vancomicina + Cefepime",
        alternativa: "Meropenem"
      },
      {
        indicacao: "Neutropenia febril",
        primeira_linha: "Cefepime ou Meropenem",
        alternativa: "Piperacilina-tazobactam"
      }
    ];
  }

  calcularPressaoMinima(idadeMeses: number): any {
    try {
      let pressaoMinima = 60;
      let faixaEtaria = "";
      
      if (idadeMeses < 1) {
        pressaoMinima = 60;
        faixaEtaria = "0-1 mês";
      } else if (idadeMeses < 12) {
        pressaoMinima = 70;
        faixaEtaria = "1-12 meses";
      } else if (idadeMeses < 24) {
        pressaoMinima = 74;
        faixaEtaria = "1-2 anos";
      } else if (idadeMeses < 60) {
        pressaoMinima = 80;
        faixaEtaria = "2-5 anos";
      } else if (idadeMeses < 144) {
        pressaoMinima = 90;
        faixaEtaria = "5-12 anos";
      } else {
        pressaoMinima = 100;
        faixaEtaria = "> 12 anos";
      }
      
      return {
        pressao_minima: pressaoMinima,
        faixa_etaria: faixaEtaria,
        formula_alternativa: `70 + (2 × idade em anos)` // Para > 1 ano
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular pressão mínima");
    }
  }

  calcularReposicaoVolumetrica(peso: number, faseChoque: string): any {
    try {
      // Primeira hora: até 60 mL/kg
      const primeiraHora = {
        volume_inicial: peso * 20,
        tempo_infusao: "15-20 minutos",
        reavaliacoes: "A cada bolus",
        volume_maximo_1h: peso * 60
      };
      
      // Estratégia baseada na fase
      let estrategia = {};
      if (faseChoque === "precoce") {
        estrategia = {
          objetivo: "Restaurar volemia",
          volume_total: "40-60 mL/kg na primeira hora",
          solucao: "Cristaloide (SF 0,9% ou Ringer Lactato)",
          monitorizacao: "Enchimento capilar, pressão arterial, diurese"
        };
      } else if (faseChoque === "refratario") {
        estrategia = {
          objetivo: "Suporte com vasopressores",
          volume_adicional: "10-20 mL/kg se hipovolemia",
          vasopressor_indicado: true,
          monitorizacao: "Invasiva (PAM, PVC se disponível)"
        };
      }
      
      return {
        primeira_hora: primeiraHora,
        estrategia: estrategia,
        sinais_sobrecarga: [
          "Hepatomegalia",
          "Estertores pulmonares", 
          "Galope ventricular",
          "Aumento da PVC > 15 mmHg"
        ]
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular reposição volumétrica");
    }
  }

  calcularVasopressor(peso: number, vasopressor: string): any {
    try {
      const medicamento = this.vasopressores[vasopressor];
      if (!medicamento) {
        throw new Error("Vasopressor não encontrado");
      }
      
      // Calcular velocidades de infusão
      const doseInicialArray = medicamento.dose_inicial.split('-');
      const doseMinima = parseFloat(doseInicialArray[0]);
      const doseMaximaInicial = parseFloat(doseInicialArray[1]) || doseMinima;
      
      let velocidadeInicial = 0;
      let velocidadeMaxima = 0;
      
      if (vasopressor === "dopamina" || vasopressor === "dobutamina") {
        // Doses em mcg/kg/min
        velocidadeInicial = (peso * doseMinima * 60) / (vasopressor === "dopamina" ? 800 : 1000);
        velocidadeMaxima = (peso * parseFloat(medicamento.dose_maxima.split(' ')[0]) * 60) / (vasopressor === "dopamina" ? 800 : 1000);
      } else {
        // Noradrenalina e adrenalina
        velocidadeInicial = (peso * doseMinima * 60) / 16;
        velocidadeMaxima = (peso * parseFloat(medicamento.dose_maxima.split(' ')[0]) * 60) / 16;
      }
      
      return {
        medicamento: vasopressor,
        preparo: medicamento.preparo,
        dose_inicial: medicamento.dose_inicial,
        dose_maxima: medicamento.dose_maxima,
        velocidade_inicial: `${Math.round(velocidadeInicial * 10) / 10} mL/h`,
        velocidade_maxima: `${Math.round(velocidadeMaxima * 10) / 10} mL/h`,
        indicacao: medicamento.indicacao,
        observacao: "Titular conforme resposta clínica"
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular vasopressor");
    }
  }

  avaliarTipoChoque(dados: any): string {
    try {
      const extremidadesFrias = dados.extremidades_frias || false;
      const enchimentoCapilar = parseInt(dados.enchimento_capilar || 2);
      const pulsos = dados.pulsos || "normais";
      
      if (extremidadesFrias && enchimentoCapilar > 3) {
        return "frio"; // Choque frio - vasoconstrição
      } else if (!extremidadesFrias && pulsos === "amplos") {
        return "quente"; // Choque quente - vasodilatação
      } else {
        return "misto"; // Características mistas
      }
    } catch (error: any) {
      return "indeterminado";
    }
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idadeMeses = parseInt(dados.idade_meses || 12);
      const pressaoSistolica = parseFloat(dados.pressao_sistolica || 100);
      const tipoChoque = this.avaliarTipoChoque(dados);
      const faseChoque = dados.fase_choque || "precoce";
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado e maior que zero");
      }
      
      // Calcular pressão mínima para idade
      const pressaoReferencia = this.calcularPressaoMinima(idadeMeses);
      const hipotensao = pressaoSistolica < pressaoReferencia.pressao_minima;
      
      // Plano de reposição volumétrica
      const reposicaoVolumetrica = this.calcularReposicaoVolumetrica(peso, faseChoque);
      
      // Vasopressor recomendado baseado no tipo de choque
      let vasopressorRecomendado = "noradrenalina";
      if (tipoChoque === "frio") {
        vasopressorRecomendado = "adrenalina";
      }
      
      const planoVasopressor = this.calcularVasopressor(peso, vasopressorRecomendado);
      
      // Antibioticoterapia
      const antibiotico = this.antibioticos[0]; // Sepse comunitária como padrão
      
      // Metas de tratamento
      const metasTratamento = [
        `Pressão arterial > ${pressaoReferencia.pressao_minima} mmHg`,
        "Enchimento capilar < 3 segundos",
        "Diurese > 1 mL/kg/h",
        "Normalização do lactato",
        "Melhora do nível de consciência"
      ];
      
      // Monitorização
      const monitorizacao = [
        "Sinais vitais a cada 15 minutos",
        "Diurese horária",
        "Gasometria e lactato seriados",
        "Glicemia",
        "Eletrólitos",
        "Nível de consciência"
      ];
      
      return {
        avaliacao: {
          tipo_choque: tipoChoque,
          hipotensao: hipotensao,
          pressao_referencia: pressaoReferencia
        },
        reposicao_volumetrica: reposicaoVolumetrica,
        vasopressor: planoVasopressor,
        antibioticoterapia: antibiotico,
        metas_tratamento: metasTratamento,
        monitorizacao: monitorizacao,
        uti_pediatrica: true,
        tempo_antibiotico: "Dentro de 1 hora do diagnóstico"
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular tratamento do choque séptico: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getCriteriosChoque(): any[] {
    return this.criterios_choque;
  }
  
  getVasopressores(): any {
    return this.vasopressores;
  }
}

const controller = new ChoqueSepticoController();
export default controller;
