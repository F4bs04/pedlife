import {
  AnafilaxiaCriteria,
  AnafilaxiaSymptoms,
  AdrenalineDose,
  AntihistaminicMedication,
  CorticosteroidMedication,
  AnafilaxiaSeverity,
  AnafilaxiaCalculationInput,
  AnafilaxiaCalculationResult,
  ValidationResult,
  CalculationError
} from '@/types/protocol-calculators';

/**
 * Calculadora de Anafilaxia - Conversão da classe Python para TypeScript
 */
export class AnafilaxiaCalculator {
  
  // Critérios diagnósticos da anafilaxia
  private readonly diagnosticCriteria: AnafilaxiaCriteria[] = [
    {
      title: "Critério 1",
      description: "Início agudo (minutos a horas) com envolvimento de pele/mucosa E pelo menos um dos seguintes:",
      subcategories: [
        "Comprometimento respiratório (dispneia, sibilância, broncoespasmo, estridor, PFE reduzido, hipoxemia)",
        "Redução da PA ou sintomas associados de disfunção orgânica (hipotonia, síncope, incontinência)"
      ]
    },
    {
      title: "Critério 2", 
      description: "Dois ou mais dos seguintes que ocorrem rapidamente após exposição a um provável alérgeno:",
      subcategories: [
        "Envolvimento de pele/mucosa (urticária, prurido, rubor, edema)",
        "Comprometimento respiratório (dispneia, sibilância, broncoespasmo, estridor, PFE reduzido, hipoxemia)",
        "Redução da PA ou sintomas associados (hipotonia, síncope, incontinência)",
        "Sintomas gastrointestinais persistentes (cólicas abdominais, vômitos)"
      ]
    },
    {
      title: "Critério 3",
      description: "Redução da pressão arterial após exposição a alérgeno conhecido para o paciente:",
      subcategories: [
        "Lactentes e crianças: PA sistólica baixa (específica para idade) ou queda > 30% na PA sistólica",
        "Adultos: PA sistólica < 90 mmHg ou queda > 30% do seu valor basal"
      ]
    }
  ];

  // Medicações para tratamento
  private readonly medications = {
    antihistaminics: [
      {
        name: "Difenidramina",
        dose: "1 mg/kg/dose",
        maxDose: "50 mg",
        route: "IV/IM/VO"
      },
      {
        name: "Prometazina",
        dose: "0,5-1 mg/kg/dose", 
        maxDose: "25 mg",
        route: "IM",
        observation: "Em crianças maiores de 2 anos"
      }
    ] as AntihistaminicMedication[],
    
    corticosteroids: [
      {
        name: "Metilprednisolona",
        dose: "1-2 mg/kg/dose",
        maxDose: "125 mg",
        route: "IV"
      },
      {
        name: "Hidrocortisona", 
        dose: "10 mg/kg (ataque); 5 mg/kg (manutenção)",
        maxDose: "500 mg",
        route: "IV/IM"
      },
      {
        name: "Prednisona",
        dose: "1-2 mg/kg/dose",
        maxDose: "60 mg", 
        route: "VO"
      }
    ] as CorticosteroidMedication[]
  };

  // Critérios de gravidade
  private readonly severityCriteria = {
    leve: {
      description: "Envolvimento de pele e tecido subcutâneo apenas",
      signs: ["Urticária", "Angioedema", "Prurido", "Eritema"]
    },
    moderada: {
      description: "Envolvimento de pelo menos um sistema além da pele",
      signs: [
        "Sintomas respiratórios leves a moderados",
        "Sintomas gastrointestinais", 
        "Sintomas cardiovasculares leves (taquicardia)"
      ]
    },
    grave: {
      description: "Envolvimento de múltiplos sistemas com risco à vida",
      signs: [
        "Hipotensão/choque",
        "Hipoxemia grave",
        "Comprometimento respiratório grave",
        "Estado mental alterado"
      ]
    }
  };

  /**
   * Valida os dados de entrada
   */
  validateInput(input: AnafilaxiaCalculationInput): ValidationResult {
    const errors: CalculationError[] = [];

    if (!input.weight || input.weight <= 0) {
      errors.push({ field: 'weight', message: 'Peso deve ser maior que zero' });
    }

    if (!input.age || input.age < 0) {
      errors.push({ field: 'age', message: 'Idade deve ser maior ou igual a zero' });
    }

    if (!input.symptoms || Object.keys(input.symptoms).length === 0) {
      errors.push({ field: 'symptoms', message: 'Pelo menos um sintoma deve ser selecionado' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcula a pressão arterial sistólica mínima aceitável para a idade
   */
  calculateMinBloodPressure(ageYears: number): number {
    if (ageYears < 1) {
      return 70;
    } else if (ageYears >= 1 && ageYears <= 10) {
      return 70 + (2 * ageYears);
    } else {
      return 90;
    }
  }

  /**
   * Calcula a dose de adrenalina baseada no peso
   */
  calculateAdrenalineDose(weightKg: number): AdrenalineDose {
    let dose = 0.01 * weightKg; // 0,01 mg/kg
    const maxDose = 0.3;
    
    if (dose > maxDose) {
      dose = maxDose;
    }

    return {
      doseMg: Math.round(dose * 100) / 100,
      doseML: Math.round(dose * 100) / 100, // Para adrenalina 1:1000, 1 mg = 1 ml
      maxDose,
      administration: "IM no vasto lateral da coxa",
      canRepeat: true,
      repeatInterval: "5-15 minutos se necessário"
    };
  }

  /**
   * Avalia a gravidade da anafilaxia com base nos sintomas selecionados
   */
  assessSeverity(symptoms: AnafilaxiaSymptoms): AnafilaxiaSeverity {
    // Verificar se há sinais de gravidade
    const severeSymptoms = [
      symptoms.hipotensao,
      symptoms.estado_mental_alterado,
      symptoms.estridor,
      symptoms.dispneia,
      symptoms.sincope,
      symptoms.convulsoes
    ];

    const hasSevereSymptoms = severeSymptoms.some(symptom => symptom === true);

    // Verificar sistemas envolvidos
    const systemsInvolved: string[] = [];

    // Sistema cutâneo
    if (symptoms.urticaria || symptoms.angioedema || symptoms.prurido || symptoms.rubor || symptoms.rash_morbiliforme) {
      systemsInvolved.push('cutâneo');
    }

    // Sistema respiratório  
    if (symptoms.dispneia || symptoms.sibilancia || symptoms.estridor || symptoms.tosse_seca || 
        symptoms.prurido_garganta || symptoms.disfagia || symptoms.rouquidao) {
      systemsInvolved.push('respiratório');
    }

    // Sistema cardiovascular
    if (symptoms.hipotensao || symptoms.taquicardia || symptoms.bradicardia || 
        symptoms.dor_peito || symptoms.sincope) {
      systemsInvolved.push('cardiovascular');
    }

    // Sistema gastrointestinal
    if (symptoms.nausea || symptoms.vomitos || symptoms.dor_abdominal || symptoms.diarreia) {
      systemsInvolved.push('gastrointestinal');
    }

    // Sistema neurológico
    if (symptoms.estado_mental_alterado || symptoms.convulsoes || symptoms.vertigem) {
      systemsInvolved.push('neurológico');
    }

    // Determinar gravidade
    if (hasSevereSymptoms) {
      return {
        level: "grave",
        description: "Anafilaxia grave com risco à vida",
        systems: systemsInvolved,
        signs: this.severityCriteria.grave.signs
      };
    } else if (systemsInvolved.length > 1) {
      return {
        level: "moderada", 
        description: "Anafilaxia moderada com envolvimento multissistêmico",
        systems: systemsInvolved,
        signs: this.severityCriteria.moderada.signs
      };
    } else if (systemsInvolved.includes('cutâneo') && systemsInvolved.length === 1) {
      return {
        level: "leve",
        description: "Reação alérgica leve (envolvimento cutâneo apenas)", 
        systems: systemsInvolved,
        signs: this.severityCriteria.leve.signs
      };
    } else {
      // Caso não haja sintomas claros de anafilaxia
      return {
        level: "leve",
        description: "Sintomas pouco específicos - reavaliar diagnóstico",
        systems: systemsInvolved,
        signs: []
      };
    }
  }

  /**
   * Gera recomendações baseadas na gravidade e sintomas
   */
  private generateRecommendations(severity: AnafilaxiaSeverity, symptoms: AnafilaxiaSymptoms): string[] {
    const recommendations: string[] = [];

    // Recomendações gerais
    recommendations.push("Remover ou interromper exposição ao alérgeno");
    recommendations.push("Administrar adrenalina IM imediatamente");
    recommendations.push("Posicionar paciente em decúbito dorsal com pernas elevadas");
    recommendations.push("Oxigenoterapia se SatO2 < 92%");

    // Recomendações específicas por gravidade
    switch (severity.level) {
      case "grave":
        recommendations.push("Acesso venoso imediato e expansão volêmica");
        recommendations.push("Considerar intubação orotraqueal se comprometimento respiratório grave");
        recommendations.push("Transferir para UTI");
        recommendations.push("Repetir adrenalina a cada 5-15 minutos se necessário");
        break;
        
      case "moderada":
        recommendations.push("Acesso venoso e hidratação");
        recommendations.push("Observação por pelo menos 4-6 horas");
        recommendations.push("Corticosteroide sistêmico");
        break;
        
      case "leve":
        recommendations.push("Observação por pelo menos 2 horas");
        recommendations.push("Anti-histamínico oral");
        break;
    }

    // Recomendações específicas por sintomas
    if (symptoms.sibilancia || symptoms.dispneia) {
      recommendations.push("Beta-2 agonista inalatório se broncoespasmo");
    }

    if (symptoms.hipotensao) {
      recommendations.push("Expansão volêmica com SF 0,9% 20 ml/kg");
    }

    // Recomendações de alta
    recommendations.push("Prescrever auto-injetor de adrenalina");
    recommendations.push("Orientar identificação e evitação do alérgeno");
    recommendations.push("Encaminhar para alergista/imunologista");

    return recommendations;
  }

  /**
   * Calcula o tratamento completo para anafilaxia
   */
  calculate(input: AnafilaxiaCalculationInput): AnafilaxiaCalculationResult {
    // Validar entrada
    const validation = this.validateInput(input);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Calcular componentes
    const severity = this.assessSeverity(input.symptoms);
    const adrenaline = this.calculateAdrenalineDose(input.weight);
    const minBloodPressure = this.calculateMinBloodPressure(input.age);
    const recommendations = this.generateRecommendations(severity, input.symptoms);

    return {
      severity,
      adrenaline,
      antihistaminics: this.medications.antihistaminics,
      corticosteroids: this.medications.corticosteroids,
      minBloodPressure,
      recommendations
    };
  }

  /**
   * Obtém critérios diagnósticos
   */
  getDiagnosticCriteria(): AnafilaxiaCriteria[] {
    return this.diagnosticCriteria;
  }
}

// Instância singleton para uso global
export const anafilaxiaCalculator = new AnafilaxiaCalculator();
