import {
  AsmaSeverity,
  Beta2AgonistMedication,
  CorticosteroidMedication,
  AsmaCalculationInput,
  AsmaCalculationResult,
  ValidationResult,
  CalculationError
} from '@/types/protocol-calculators';

/**
 * Calculadora de Asma - Conversão da classe Python para TypeScript
 */
export class AsmaCalculator {
  
  // Classificação de gravidade da asma
  private readonly severityClassification: AsmaSeverity[] = [
    {
      level: "leve",
      characteristics: [
        "Frequência respiratória < 60 irpm em lactentes",
        "Retrações leves ou ausentes",
        "Saturação de O₂ > 95% em ar ambiente",
        "Fala frases completas",
        "Nível de consciência normal"
      ],
      treatment: [
        "Beta-2 inalatório (3 doses a cada 20 minutos)",
        "O₂ a 3L/min se SatO₂<92%"
      ]
    },
    {
      level: "moderada",
      characteristics: [
        "Frequência respiratória entre 60-70 irpm em lactentes",
        "Retrações moderadas",
        "Saturação de O₂ entre 90-95% em ar ambiente",
        "Fala frases incompletas",
        "Uso de musculatura acessória",
        "Sibilos moderados a intensos"
      ],
      treatment: [
        "Beta-2 inalatório (3 doses a cada 20 minutos)",
        "O₂ a 3L/min se SatO₂<92%",
        "Considerar observação no pronto-socorro por 4-6 horas"
      ]
    },
    {
      level: "grave",
      characteristics: [
        "Frequência respiratória > 70 irpm em lactentes",
        "Retrações graves (intercostais, subdiafragmáticas, supraesternais)",
        "Saturação de O₂ < 90% em ar ambiente",
        "Fala palavras apenas",
        "Agitação",
        "Cianose"
      ],
      treatment: [
        "Beta-2 inalatório (3 doses a cada 20 minutos)",
        "O₂ a 3L/min ou conforme necessidade",
        "Corticosteroide sistêmico",
        "Considerar internação hospitalar"
      ]
    },
    {
      level: "iminencia_parada",
      characteristics: [
        "Sonolência, confusão",
        "Silêncio à ausculta (tórax 'mudo')",
        "Cianose",
        "Bradipneia",
        "Saturação de O₂ < 88% apesar do O₂ suplementar"
      ],
      treatment: [
        "Internar em UTI",
        "Beta-2 contínuo",
        "Corticosteroide IV",
        "Considerar intubação orotraqueal"
      ]
    }
  ];

  // Medicações de resgate
  private readonly rescueMedications = {
    beta2Agonists: [
      {
        name: "Salbutamol",
        presentation: "Solução para nebulização (5 mg/ml)",
        dose: "0,15 mg/kg (mínimo 2,5 mg, máximo 5 mg) a cada 20 minutos até 3 doses, depois conforme necessidade"
      },
      {
        name: "Salbutamol spray",
        presentation: "Aerossol (100 mcg/jato)",
        dose: "2-10 jatos a cada 20 minutos até 3 doses, depois conforme necessidade"
      }
    ] as Beta2AgonistMedication[],
    
    corticosteroids: [
      {
        name: "Prednisolona/Prednisona",
        dose: "1-2 mg/kg/dia (máximo 60 mg/dia) por 3-5 dias",
        maxDose: "60 mg",
        route: "VO"
      },
      {
        name: "Metilprednisolona",
        dose: "1-2 mg/kg/dia (moderados a graves) a 10-30 mg/kg/dia (graves) divididos em 4 doses",
        maxDose: "125 mg",
        route: "IV"
      }
    ] as CorticosteroidMedication[]
  };

  // Critérios de internação
  private readonly hospitalizationCriteria = [
    "Saturação de O₂ < 90% em ar ambiente",
    "Frequência respiratória persistentemente elevada",
    "Retrações graves persistentes",
    "Impossibilidade de alimentação/hidratação",
    "Resposta inadequada ao tratamento inicial",
    "Fadiga respiratória",
    "Alteração do nível de consciência",
    "Condições sociais inadequadas para seguimento domiciliar"
  ];

  /**
   * Valida os dados de entrada
   */
  validateInput(input: AsmaCalculationInput): ValidationResult {
    const errors: CalculationError[] = [];

    if (!input.weight || input.weight <= 0) {
      errors.push({ field: 'weight', message: 'Peso deve ser maior que zero' });
    }

    if (!input.age || input.age < 0) {
      errors.push({ field: 'age', message: 'Idade deve ser maior ou igual a zero' });
    }

    if (!input.respiratoryRate || input.respiratoryRate <= 0) {
      errors.push({ field: 'respiratoryRate', message: 'Frequência respiratória deve ser maior que zero' });
    }

    if (!input.oxygenSaturation || input.oxygenSaturation < 50 || input.oxygenSaturation > 100) {
      errors.push({ field: 'oxygenSaturation', message: 'Saturação de oxigênio deve estar entre 50% e 100%' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcula a frequência respiratória normal por idade
   */
  private getNormalRespiratoryRate(ageMonths: number): { min: number; max: number } {
    if (ageMonths < 2) {
      return { min: 30, max: 60 };
    } else if (ageMonths < 12) {
      return { min: 24, max: 40 };
    } else if (ageMonths < 24) {
      return { min: 20, max: 30 };
    } else if (ageMonths < 60) {
      return { min: 20, max: 30 };
    } else {
      return { min: 16, max: 24 };
    }
  }

  /**
   * Avalia a gravidade da crise asmática
   */
  assessSeverity(input: AsmaCalculationInput): AsmaSeverity {
    const ageMonths = input.age * 12;
    const normalRR = this.getNormalRespiratoryRate(ageMonths);
    
    // Pontuação para gravidade
    let score = 0;
    
    // Saturação de oxigênio (peso maior)
    if (input.oxygenSaturation < 88) {
      score += 4; // Muito grave
    } else if (input.oxygenSaturation < 90) {
      score += 3; // Grave
    } else if (input.oxygenSaturation < 95) {
      score += 2; // Moderado
    } else {
      score += 1; // Leve
    }

    // Frequência respiratória
    const rrRatio = input.respiratoryRate / normalRR.max;
    if (rrRatio > 2.5) {
      score += 3;
    } else if (rrRatio > 2.0) {
      score += 2;
    } else if (rrRatio > 1.5) {
      score += 1;
    }

    // Retrações
    switch (input.retractions) {
      case "graves":
        score += 3;
        break;
      case "moderadas":
        score += 2;
        break;
      case "leves":
        score += 1;
        break;
    }

    // Fala
    switch (input.speech) {
      case "nao_fala":
        score += 4;
        break;
      case "palavras":
        score += 3;
        break;
      case "frases_incompletas":
        score += 2;
        break;
      case "frases_completas":
        score += 1;
        break;
    }

    // Consciência
    switch (input.consciousness) {
      case "confuso":
        score += 4;
        break;
      case "sonolento":
        score += 3;
        break;
      case "agitado":
        score += 2;
        break;
      case "normal":
        score += 1;
        break;
    }

    // Sibilância
    switch (input.wheezing) {
      case "silencio":
        score += 4; // Tórax silencioso = muito grave
        break;
      case "intenso":
        score += 3;
        break;
      case "moderado":
        score += 2;
        break;
      case "leve":
        score += 1;
        break;
    }

    // Determinar gravidade baseada no score
    if (score >= 18 || input.oxygenSaturation < 88 || input.wheezing === "silencio" || input.consciousness === "confuso") {
      return this.severityClassification[3]; // Iminência de parada
    } else if (score >= 14 || input.oxygenSaturation < 90) {
      return this.severityClassification[2]; // Grave
    } else if (score >= 10 || input.oxygenSaturation < 95) {
      return this.severityClassification[1]; // Moderada
    } else {
      return this.severityClassification[0]; // Leve
    }
  }

  /**
   * Calcula dose específica de salbutamol para nebulização
   */
  calculateSalbutamolDose(weightKg: number): { dose: number; volume: string } {
    const dosePerKg = 0.15; // mg/kg
    let dose = dosePerKg * weightKg;
    
    // Limites mínimo e máximo
    if (dose < 2.5) dose = 2.5;
    if (dose > 5.0) dose = 5.0;
    
    // Volume em mL (concentração 5 mg/mL)
    const volumeML = dose / 5;
    
    return {
      dose: Math.round(dose * 10) / 10,
      volume: `${Math.round(volumeML * 10) / 10} mL`
    };
  }

  /**
   * Determina necessidade de oxigenoterapia
   */
  private assessOxygenTherapy(saturation: number): { indicated: boolean; flow: string } {
    if (saturation < 92) {
      if (saturation < 88) {
        return { indicated: true, flow: "5-10 L/min ou conforme necessidade" };
      } else {
        return { indicated: true, flow: "3-5 L/min" };
      }
    }
    return { indicated: false, flow: "Não indicado" };
  }

  /**
   * Gera recomendações baseadas na gravidade
   */
  private generateRecommendations(severity: AsmaSeverity, input: AsmaCalculationInput): string[] {
    const recommendations: string[] = [];

    // Recomendações gerais
    recommendations.push("Posicionar paciente sentado ou semi-sentado");
    recommendations.push("Manter ambiente calmo e tranquilo");
    
    // Recomendações específicas por gravidade
    switch (severity.level) {
      case "iminencia_parada":
        recommendations.push("EMERGÊNCIA: Preparar para intubação orotraqueal");
        recommendations.push("Acesso venoso imediato");
        recommendations.push("Transferir para UTI urgentemente");
        recommendations.push("Beta-2 agonista em nebulização contínua");
        recommendations.push("Corticosteroide IV em dose alta");
        recommendations.push("Considerar sulfato de magnésio IV");
        break;
        
      case "grave":
        recommendations.push("Acesso venoso");
        recommendations.push("Observação contínua");
        recommendations.push("Corticosteroide sistêmico");
        recommendations.push("Considerar internação hospitalar");
        recommendations.push("Reavaliar a cada 20-30 minutos");
        break;
        
      case "moderada":
        recommendations.push("Observação por 4-6 horas");
        recommendations.push("Considerar corticosteroide oral");
        recommendations.push("Reavaliar após cada nebulização");
        break;
        
      case "leve":
        recommendations.push("Observação por 2-4 horas");
        recommendations.push("Alta se melhora sustentada");
        break;
    }

    // Recomendações de oxigenoterapia
    if (input.oxygenSaturation < 92) {
      recommendations.push("Oxigenoterapia conforme necessidade para manter SatO₂ > 92%");
    }

    // Recomendações de alta
    if (severity.level === "leve" || severity.level === "moderada") {
      recommendations.push("Orientar uso correto de broncodilatador");
      recommendations.push("Retorno se piora dos sintomas");
      recommendations.push("Seguimento com pneumologista pediátrico");
    }

    return recommendations;
  }

  /**
   * Calcula o tratamento completo para asma
   */
  calculate(input: AsmaCalculationInput): AsmaCalculationResult {
    // Validar entrada
    const validation = this.validateInput(input);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Calcular componentes
    const severity = this.assessSeverity(input);
    const oxygenTherapy = this.assessOxygenTherapy(input.oxygenSaturation);
    const recommendations = this.generateRecommendations(severity, input);

    // Atualizar doses específicas para o peso
    const salbutamolDose = this.calculateSalbutamolDose(input.weight);
    const updatedBeta2Agonists = this.rescueMedications.beta2Agonists.map(med => {
      if (med.name === "Salbutamol") {
        return {
          ...med,
          dose: `${salbutamolDose.dose} mg (${salbutamolDose.volume}) a cada 20 minutos até 3 doses`
        };
      }
      return med;
    });

    return {
      severity,
      beta2Agonists: updatedBeta2Agonists,
      corticosteroids: this.rescueMedications.corticosteroids,
      oxygenTherapy,
      hospitalizationCriteria: this.hospitalizationCriteria,
      recommendations
    };
  }

  /**
   * Obtém classificação de gravidade
   */
  getSeverityClassification(): AsmaSeverity[] {
    return this.severityClassification;
  }
}

// Instância singleton para uso global
export const asmaCalculator = new AsmaCalculator();
