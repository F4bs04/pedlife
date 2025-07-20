import type { 
  CriseConvulsivaInput, 
  CriseConvulsivaResult, 
  AnticonvulsantMedication,
  EMEAssessment,
  LumbarPunctureAssessment,
  TreatmentConduct
} from '../../types/protocol-calculators';

/**
 * Calculadora para Crise Convulsiva em Pediatria
 * Baseada nas diretrizes médicas para manejo de crises convulsivas
 */
export class CriseConvulsivaCalculator {
  private medicacoesIniciais = [
    {
      nome: "Diazepam",
      dose: "0,3 a 0,5 mg/kg/dose IV ou retal",
      doseMaxima: "10 mg",
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

  private medicacoesSegundoNivel = [
    {
      nome: "Fenobarbital IV",
      dose: "20 mg/kg/dose",
      velocidade: "máx. 1 mg/kg/min"
    },
    {
      nome: "Fenitoína",
      doseAtaque: "20 mg/kg/dose IV",
      preparo: "diluído 1:20 SF 0,9%",
      velocidade: "máx. 1 mg/kg/min",
      observacao: "Concomitante aos benzodiazepínicos (uma vez que a ação dos primeiros é fugaz)",
      doseAdicional: "10 mg/kg após 60 minutos, se necessário",
      manutencao: "5 a 10 mg/kg/dia"
    }
  ];

  private criteriosPuncaoLombar = [
    "Crianças abaixo de 12 meses após a primeira crise convulsiva",
    "Crianças entre 12 e 18 meses com manifestações incertas",
    "Pacientes acima de 18 meses com sinais e sintomas sugestivos de infecção central"
  ];

  /**
   * Calcula a dose de diazepam baseado no peso
   */
  private calcularDoseDiazepam(peso: number): AnticonvulsantMedication {
    const doseMin = Math.round(0.3 * peso * 10) / 10;
    let doseMax = Math.round(0.5 * peso * 10) / 10;
    const doseMaximaTotal = 10;
    
    if (doseMax > doseMaximaTotal) {
      doseMax = doseMaximaTotal;
    }
    
    const doseMinFinal = doseMin > doseMaximaTotal ? doseMaximaTotal : doseMin;
    
    return {
      nome: "Diazepam",
      doseMin: doseMinFinal,
      doseMax: doseMax,
      doseFormulacao: `${doseMinFinal} a ${doseMax} mg IV ou retal (máx: ${doseMaximaTotal} mg)`,
      velocidade: "máx. 1 mg/kg/min",
      observacao: "Pode repetir após 10 min se crise persistir"
    };
  }

  /**
   * Calcula a dose de midazolam baseado no peso
   */
  private calcularDoseMidazolam(peso: number): AnticonvulsantMedication {
    const doseMin = Math.round(0.05 * peso * 100) / 100;
    const doseMax = Math.round(0.2 * peso * 100) / 100;
    
    return {
      nome: "Midazolam",
      doseMin: doseMin,
      doseMax: doseMax,
      doseFormulacao: `${doseMin} a ${doseMax} mg IV/IM/nasal/retal`,
      velocidade: "máx. 4 mg/min"
    };
  }

  /**
   * Calcula a dose de fenobarbital baseado no peso
   */
  private calcularDoseFenobarbital(peso: number): AnticonvulsantMedication {
    const dose = Math.round(20 * peso * 10) / 10;
    
    return {
      nome: "Fenobarbital",
      dose: dose,
      doseFormulacao: `${dose} mg IV`,
      velocidade: "máx. 1 mg/kg/min"
    };
  }

  /**
   * Calcula a dose de fenitoína baseado no peso
   */
  private calcularDoseFenitoina(peso: number): AnticonvulsantMedication {
    const doseAtaque = Math.round(20 * peso * 10) / 10;
    const doseAdicional = Math.round(10 * peso * 10) / 10;
    const doseManutencaoMin = Math.round(5 * peso * 10) / 10;
    const doseManutencaoMax = Math.round(10 * peso * 10) / 10;
    
    return {
      nome: "Fenitoína",
      dose: doseAtaque,
      doseAdicional: doseAdicional,
      doseManutencaoMin: doseManutencaoMin,
      doseManutencaoMax: doseManutencaoMax,
      doseFormulacao: `Ataque: ${doseAtaque} mg IV (diluído 1:20 SF 0,9%)`,
      velocidade: "máx. 1 mg/kg/min",
      observacao: `Dose adicional: ${doseAdicional} mg se necessário após 60 min. Manutenção: ${doseManutencaoMin}-${doseManutencaoMax} mg/dia`
    };
  }

  /**
   * Calcula a dose de midazolam em infusão contínua baseado no peso
   */
  private calcularDoseMidazolamInfusao(peso: number): AnticonvulsantMedication {
    const doseMin = Math.round(0.05 * peso * 100) / 100;
    const doseMax = Math.round(0.4 * peso * 100) / 100;
    
    return {
      nome: "Midazolam (infusão contínua)",
      doseMin: doseMin,
      doseMax: doseMax,
      doseFormulacao: `${doseMin} a ${doseMax} mg/hora`,
      velocidade: "Infusão contínua"
    };
  }

  /**
   * Avalia critérios para Estado de Mal Epiléptico
   */
  private avaliarEme(tempoCrise: number): EMEAssessment {
    const eme = tempoCrise >= 30;
    
    return {
      eme: eme,
      definicao: "Estado de Mal Epiléptico (EME) compreende uma crise prolongada ou crises recorrentes sem recuperação completa da consciência por 30 minutos ou mais."
    };
  }

  /**
   * Avalia se há critérios para hospitalização
   */
  private avaliarCriteriosHospitalizacao(
    primeiraCrise: boolean,
    idadeMeses: number,
    febre: boolean,
    retornoConsciencia: boolean,
    glasgow: number
  ): string[] {
    const criterios: string[] = [];
    
    if (primeiraCrise) {
      criterios.push("Primeira crise convulsiva");
    }
    
    if (idadeMeses < 12) {
      criterios.push("Idade menor que 12 meses");
    }
    
    if (febre) {
      criterios.push("Presença de febre (considerar investigação de meningite)");
    }
    
    if (!retornoConsciencia) {
      criterios.push("Sem retorno ao estado de consciência normal após a crise");
    }
    
    if (glasgow < 15) {
      criterios.push(`Glasgow menor que 15 (atual: ${glasgow})`);
    }
    
    return criterios;
  }

  /**
   * Avalia se há indicação de punção lombar
   */
  private avaliarNecessidadePuncaoLombar(
    idadeMeses: number,
    febre: boolean,
    suspeitaInfeccao: boolean
  ): LumbarPunctureAssessment {
    let indicacao = false;
    const criterios: string[] = [];
    
    if (idadeMeses < 12) {
      indicacao = true;
      criterios.push("Criança abaixo de 12 meses após a primeira crise convulsiva");
    } else if (idadeMeses >= 12 && idadeMeses <= 18) {
      indicacao = true;
      criterios.push("Criança entre 12 e 18 meses de vida");
    } else if (idadeMeses > 18 && (febre || suspeitaInfeccao)) {
      indicacao = true;
      criterios.push("Paciente acima de 18 meses com sinais e sintomas sugestivos de infecção central");
    }
    
    return {
      indicacao: indicacao,
      criterios: criterios
    };
  }

  /**
   * Define a conduta terapêutica
   */
  private definirCondutaTerapeutica(
    criseCessou: boolean,
    avaliacaoEme: EMEAssessment
  ): TreatmentConduct {
    if (criseCessou) {
      return {
        cessarMedicacao: true,
        recomendacao: "Não administrar medicação anticonvulsivante, pois a crise já cessou.",
        observacao: "Observação por 24h e acompanhamento ambulatorial."
      };
    } else {
      if (avaliacaoEme.eme) {
        return {
          cessarMedicacao: false,
          recomendacao: "Estado de Mal Epiléptico (EME) - Iniciar protocolo de tratamento intensivo.",
          esquema: [
            "1. Diazepam ou Midazolam na dose calculada",
            "2. Se crise persistir após 10 minutos, administrar Fenobarbital ou Fenitoína",
            "3. Se crise persistir, considerar Midazolam em infusão contínua",
            "4. Avaliar necessidade de intubação orotraqueal e internação em UTI"
          ]
        };
      } else {
        return {
          cessarMedicacao: false,
          recomendacao: "Iniciar tratamento com benzodiazepínico.",
          esquema: [
            "1. Diazepam ou Midazolam na dose calculada",
            "2. Se crise persistir após 10 minutos, pode repetir dose inicial",
            "3. Se persistência da crise, administrar Fenobarbital ou Fenitoína"
          ]
        };
      }
    }
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  public calcular(dados: CriseConvulsivaInput): CriseConvulsivaResult {
    // Calcular idade total em meses
    const idadeMeses = (dados.ageYears * 12) + dados.ageMonths;
    
    // Avaliar estado de mal epiléptico
    const avaliacaoEme = this.avaliarEme(dados.criseDuration);
    
    // Calcular doses das medicações
    const doses = {
      diazepam: this.calcularDoseDiazepam(dados.weight),
      midazolam: this.calcularDoseMidazolam(dados.weight),
      fenobarbital: this.calcularDoseFenobarbital(dados.weight),
      fenitoina: this.calcularDoseFenitoina(dados.weight),
      midazolamInfusao: this.calcularDoseMidazolamInfusao(dados.weight)
    };
    
    // Avaliar critérios de hospitalização
    const criteriosHospitalizacao = this.avaliarCriteriosHospitalizacao(
      dados.firstCrise,
      idadeMeses,
      dados.fever,
      dados.consciousnessReturn,
      dados.glasgow
    );
    
    // Avaliar necessidade de punção lombar
    const avaliacaoPl = this.avaliarNecessidadePuncaoLombar(
      idadeMeses,
      dados.fever,
      dados.suspectedInfection
    );
    
    // Definir conduta terapêutica
    const conduta = this.definirCondutaTerapeutica(dados.criseStoped, avaliacaoEme);
    
    return {
      idadeMeses: idadeMeses,
      peso: dados.weight,
      criseCessou: dados.criseStoped,
      tempoCrise: dados.criseDuration,
      avaliacaoEme: avaliacaoEme,
      doses: doses,
      criteriosHospitalizacao: criteriosHospitalizacao,
      necessidadeHospitalizacao: criteriosHospitalizacao.length > 0,
      avaliacaoPl: avaliacaoPl,
      conduta: conduta
    };
  }
}

// Instância singleton para uso global
export const criseConvulsivaCalculator = new CriseConvulsivaCalculator();
