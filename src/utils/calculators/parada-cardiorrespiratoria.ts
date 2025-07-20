import type {
  ParadaCardiorrespiratoriaInput,
  ParadaCardiorrespiratoriaResult,
  ParadaCardiorrespiratoriaRitmo,
  ParadaCardiorrespiratoriaDoses
} from '../../types/protocol-calculators';

/**
 * Calculadora para Parada Cardiorrespiratória em Pediatria
 * Baseada nas diretrizes de RCP pediátrica
 */
class ParadaCardiorrespiratoriaCalculator {
  private causasReversiveis = [
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

  private ritmos: ParadaCardiorrespiratoriaRitmo[] = [
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

  /**
   * Calcula a dose de adrenalina baseada no peso
   */
  private calcularDoseAdrenalina(peso: number): ParadaCardiorrespiratoriaDoses['adrenalina'] {
    const doseMg = Math.round(0.01 * peso * 1000) / 1000; // 0,01 mg/kg
    let doseML = Math.round(0.1 * peso * 100) / 100; // 0,1 ml/kg da solução 1:10.000
    const doseMaximaML = 10; // Equivalente a 1mg

    let doseMgFinal = doseMg;
    if (doseML > doseMaximaML) {
      doseML = doseMaximaML;
      doseMgFinal = 1;
    }

    return {
      doseMg: doseMgFinal,
      doseML: doseML,
      solucao: "1:10.000",
      frequencia: "A cada 3-5 minutos",
      via: "IV/IO",
      observacao: "Primeira medicação em assistolia e AESP"
    };
  }

  /**
   * Calcula a dose de amiodarona baseada no peso
   */
  private calcularDoseAmiodarona(peso: number): ParadaCardiorrespiratoriaDoses['amiodarona'] {
    let doseMg = Math.round(5 * peso * 10) / 10; // 5 mg/kg
    const doseMaxima = 300; // 300mg é a dose máxima para adultos

    if (doseMg > doseMaxima) {
      doseMg = doseMaxima;
    }

    return {
      doseMg: doseMg,
      indicacao: "FV/TV sem pulso refratária a desfibrilação",
      via: "IV/IO"
    };
  }

  /**
   * Calcula a dose de lidocaína baseada no peso
   */
  private calcularDoseLidocaina(peso: number): ParadaCardiorrespiratoriaDoses['lidocaina'] {
    let doseMg = Math.round(1 * peso * 10) / 10; // 1 mg/kg
    const doseMaxima = 100; // 100mg é geralmente a dose máxima

    if (doseMg > doseMaxima) {
      doseMg = doseMaxima;
    }

    return {
      doseMg: doseMg,
      indicacao: "Alternativa à amiodarona",
      via: "IV/IO"
    };
  }

  /**
   * Calcula a dose de sulfato de magnésio baseada no peso
   */
  private calcularDoseSulfatoMagnesio(peso: number): ParadaCardiorrespiratoriaDoses['sulfatoMagnesio'] {
    const doseMinMg = Math.round(25 * peso * 10) / 10; // 25 mg/kg
    let doseMaxMg = Math.round(50 * peso * 10) / 10; // 50 mg/kg
    const doseMaxima = 2000; // 2g é a dose máxima

    if (doseMaxMg > doseMaxima) {
      doseMaxMg = doseMaxima;
    }

    return {
      doseMinMg: doseMinMg,
      doseMaxMg: doseMaxMg,
      indicacao: "Torsades de pointes ou hipomagnesemia",
      via: "IV/IO"
    };
  }

  /**
   * Calcula a dose de bicarbonato de sódio baseada no peso
   */
  private calcularDoseBicarbonato(peso: number): ParadaCardiorrespiratoriaDoses['bicarbonato'] {
    let doseMEq = Math.round(1 * peso * 10) / 10; // 1 mEq/kg
    let doseML = doseMEq; // 1 mEq/mL na solução a 8,4%
    const doseMaximaMEq = 50; // Dose máxima aproximada para adultos

    if (doseMEq > doseMaximaMEq) {
      doseMEq = doseMaximaMEq;
      doseML = doseMaximaMEq;
    }

    return {
      doseMEq: doseMEq,
      doseML: doseML,
      solucao: "8,4%",
      indicacao: "Acidose metabólica grave documentada, hipercalemia, overdose de antidepressivos tricíclicos",
      via: "IV/IO",
      observacao: "Não recomendado rotineiramente"
    };
  }

  /**
   * Calcula as energias para desfibrilação baseadas no peso
   */
  private calcularEnergiaDesfibrilacao(peso: number) {
    const primeiraDose = Math.round(2 * peso); // 2 J/kg
    const dosesSubsequentes = Math.round(4 * peso); // 4 J/kg
    const doseMaxima = Math.min(Math.round(10 * peso), 360); // Máximo de 10 J/kg ou dose adulta

    return {
      primeiraDose,
      dosesSubsequentes,
      doseMaxima
    };
  }

  /**
   * Calcula a profundidade adequada da compressão torácica
   */
  private calcularProfundidadeCompressao(idadeAnos: number): string {
    if (idadeAnos <= 1) { // Lactente
      return "1/3 do diâmetro AP do tórax (aproximadamente 4 cm)";
    } else if (idadeAnos < 8) { // Criança
      return "1/3 do diâmetro AP do tórax (aproximadamente 5 cm)";
    } else { // Adolescente ou adulto
      return "5-6 cm";
    }
  }

  /**
   * Determina a via de acesso preferencial
   */
  private determinarViaAcesso(idadeAnos: number): string {
    if (idadeAnos <= 6) {
      return "Acesso intraósseo como primeira opção se acesso venoso difícil";
    } else {
      return "Acesso venoso periférico, com acesso intraósseo como alternativa";
    }
  }

  /**
   * Determina a relação compressão-ventilação baseada no número de socorristas
   */
  private determinarRelacaoCompressaoVentilacao(socorristas: number, viaAereaAvancada: boolean): string {
    if (viaAereaAvancada) {
      return "Compressão contínua (100-120/min) e ventilação a cada 6 segundos (10/min)";
    } else if (socorristas === 1) {
      return "30:2 (30 compressões para 2 ventilações)";
    } else {
      return "15:2 (15 compressões para 2 ventilações)";
    }
  }

  /**
   * Busca dados do ritmo específico
   */
  private buscarDadosRitmo(ritmo?: string): ParadaCardiorrespiratoriaRitmo | undefined {
    if (!ritmo) return undefined;
    
    const ritmoMap: Record<string, string> = {
      'Assistolia': 'Assistolia',
      'AESP': 'Atividade Elétrica Sem Pulso (AESP)',
      'Fibrilacao_Ventricular': 'Fibrilação Ventricular (FV)',
      'Taquicardia_Ventricular': 'Taquicardia Ventricular sem pulso (TV)'
    };

    const nomeRitmo = ritmoMap[ritmo];
    return this.ritmos.find(r => r.nome === nomeRitmo);
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: ParadaCardiorrespiratoriaInput): ParadaCardiorrespiratoriaResult {
    const { peso, idadeAnos, ritmo, socorristas, viaAereaAvancada } = dados;

    // Calcular doses de medicações
    const doses: ParadaCardiorrespiratoriaDoses = {
      adrenalina: this.calcularDoseAdrenalina(peso),
      amiodarona: this.calcularDoseAmiodarona(peso),
      lidocaina: this.calcularDoseLidocaina(peso),
      sulfatoMagnesio: this.calcularDoseSulfatoMagnesio(peso),
      bicarbonato: this.calcularDoseBicarbonato(peso)
    };

    // Calcular energia de desfibrilação
    const desfibrilacao = this.calcularEnergiaDesfibrilacao(peso);

    // Determinar parâmetros de compressão
    const profundidade = this.calcularProfundidadeCompressao(idadeAnos);
    const relacao = this.determinarRelacaoCompressaoVentilacao(socorristas, viaAereaAvancada);

    // Determinar via de acesso
    const acesso = this.determinarViaAcesso(idadeAnos);

    // Buscar dados do ritmo se fornecido
    const dadosRitmo = this.buscarDadosRitmo(ritmo);

    return {
      peso,
      idadeAnos,
      doses,
      desfibrilacao,
      compressao: {
        profundidade,
        frequencia: "100-120/minuto",
        relacao
      },
      acesso,
      causasReversiveis: this.causasReversiveis,
      ritmo: dadosRitmo
    };
  }
}

// Instância singleton para uso global
export const paradaCardiorrespiratoriaCalculator = new ParadaCardiorrespiratoriaCalculator();
