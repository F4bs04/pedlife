import type {
  GlomerulonefriteInput,
  GlomerulonefriteResult,
  GlomerulonefriteAntibiotico,
  GlomerulonefriteAntiHipertensivo
} from '../../types/protocol-calculators';

/**
 * Calculadora para Glomerulonefrite em Pediatria
 * Baseada nas diretrizes de diagnóstico e tratamento da glomerulonefrite aguda
 */
class GlomerulonefriteCalculator {
  private sintomasComuns = [
    "Oligúria", 
    "Edema facial/periorbitário", 
    "Edema generalizado", 
    "Dor lombar", 
    "Hipertensão arterial", 
    "Hematúria macroscópica", 
    "Hematúria microscópica", 
    "Proteinúria", 
    "Náuseas/vômitos", 
    "Palidez cutânea", 
    "Nictúria"
  ];

  private examesRecomendados = [
    "Urina rotina e cultura de urina",
    "Hemograma completo",
    "Ureia e creatinina",
    "Eletrólitos séricos",
    "Complemento sérico (C3, CH50)",
    "ASLO (Antiestreptolisina O)",
    "Proteína C reativa",
    "Ultrassom de rins e vias urinárias"
  ];

  private criteriosInternacao = [
    "Hipertensão arterial de difícil controle",
    "Insuficiência cardíaca congestiva",
    "Encefalopatia hipertensiva",
    "Insuficiência renal aguda",
    "Uremia importante",
    "Sobrecarga volêmica importante"
  ];

  private medidasGerais = [
    "Restrição de sódio na dieta",
    "Manter ingestão proteica normal exceto se ureia elevada",
    "Restrição hídrica apenas em caso de edema acentuado ou insuficiência renal",
    "Repouso até desaparecimento dos sintomas agudos e controle da hipertensão arterial",
    "Controle diário da diurese até normalização da função renal",
    "Aferição diária do peso para avaliar retenção hídrica",
    "Aferições regulares da pressão arterial"
  ];

  /**
   * Calcula a dose de antibiótico com base no peso do paciente
   */
  private calcularDoseAntibiotico(antibiotico: string, peso: number): GlomerulonefriteAntibiotico {
    switch (antibiotico) {
      case "Penicilina Benzatina": {
        if (peso < 27) {
          return {
            nome: "Penicilina Benzatina",
            dose: "600.000 UI",
            via: "IM",
            frequencia: "Dose única"
          };
        } else {
          return {
            nome: "Penicilina Benzatina",
            dose: "1.200.000 UI",
            via: "IM",
            frequencia: "Dose única"
          };
        }
      }

      case "Amoxicilina": {
        let doseDiaria = 50 * peso; // 50 mg/kg/dia
        if (doseDiaria > 1500) {
          doseDiaria = 1500; // máximo 1,5g/dia
        }
        const dosePorTomada = Math.round(doseDiaria / 3); // 3 vezes ao dia
        return {
          nome: "Amoxicilina",
          dose: `${dosePorTomada} mg`,
          via: "VO",
          frequencia: "a cada 8 horas por 10 dias",
          doseTotal: `${doseDiaria} mg/dia`
        };
      }

      case "Eritromicina": {
        const doseDiariaEritro = 50 * peso; // 50 mg/kg/dia
        const dosePorTomadaEritro = Math.round(doseDiariaEritro / 4); // 4 vezes ao dia
        return {
          nome: "Eritromicina",
          dose: `${dosePorTomadaEritro} mg`,
          via: "VO",
          frequencia: "a cada 6 horas por 10 dias",
          doseTotal: `${doseDiariaEritro} mg/dia`,
          observacao: "Para pacientes alérgicos à penicilina"
        };
      }

      case "Penicilina V":
      default: {
        if (peso < 27) {
          return {
            nome: "Penicilina V (Fenoximetilpenicilina)",
            dose: "250 mg",
            via: "VO",
            frequencia: "a cada 8 horas por 10 dias"
          };
        } else {
          return {
            nome: "Penicilina V (Fenoximetilpenicilina)",
            dose: "500 mg",
            via: "VO",
            frequencia: "a cada 8 horas por 10 dias"
          };
        }
      }
    }
  }

  /**
   * Calcula a dose de anti-hipertensivo com base no peso do paciente
   */
  private calcularDoseAntiHipertensivo(medicamento: string, peso: number): GlomerulonefriteAntiHipertensivo | null {
    switch (medicamento) {
      case "Furosemida": {
        const doseMinFuro = Math.round(1 * peso); // 1 mg/kg/dia
        const doseMaxFuro = Math.round(3 * peso); // 3 mg/kg/dia
        return {
          nome: "Furosemida",
          doseMin: `${doseMinFuro} mg`,
          doseMax: `${doseMaxFuro} mg`,
          via: "VO ou IV",
          frequencia: "a cada 6-12 horas"
        };
      }

      case "Hidroclorotiazida": {
        const doseMinHidroclo = Math.round(1 * peso); // 1 mg/kg/dia
        const doseMaxHidroclo = Math.round(2 * peso); // 2 mg/kg/dia
        return {
          nome: "Hidroclorotiazida",
          doseMin: `${doseMinHidroclo} mg`,
          doseMax: `${doseMaxHidroclo} mg`,
          via: "VO",
          frequencia: "a cada 12 horas"
        };
      }

      case "Hidralazina": {
        const doseMinHidra = Math.round(1 * peso); // 1 mg/kg/dia
        const doseMaxHidra = Math.round(8 * peso); // 8 mg/kg/dia
        return {
          nome: "Hidralazina",
          doseMin: `${doseMinHidra} mg`,
          doseMax: `${doseMaxHidra} mg`,
          via: "VO",
          frequencia: "a cada 6-8 horas"
        };
      }

      case "Captopril": {
        // Não recomendado para crianças menores de 3 anos
        if (peso * 3 < 10) {
          return null;
        }
        const doseMinCaptopril = Math.round(0.3 * peso * 10) / 10; // 0,3 mg/kg/dose
        const doseMaxCaptopril = Math.round(0.5 * peso * 10) / 10; // 0,5 mg/kg/dose
        return {
          nome: "Captopril",
          doseMin: `${doseMinCaptopril} mg`,
          doseMax: `${doseMaxCaptopril} mg`,
          via: "VO",
          frequencia: "a cada 6-8 horas",
          observacao: "Usar com cautela na insuficiência renal. Não recomendado < 3 anos"
        };
      }

      case "Nifedipina": {
        const doseMinNife = Math.round(0.25 * peso * 10) / 10; // 0,25 mg/kg/dose
        let doseMaxNife = Math.round(0.5 * peso * 10) / 10; // 0,5 mg/kg/dose
        if (doseMaxNife > 10) {
          doseMaxNife = 10; // máximo 10 mg/dose
        }
        return {
          nome: "Nifedipina",
          doseMin: `${doseMinNife} mg`,
          doseMax: `${doseMaxNife} mg`,
          via: "VO",
          frequencia: "a cada 6-8 horas",
          observacao: "Máximo de 10 mg por dose"
        };
      }

      case "Propranolol": {
        const doseMinPropra = Math.round(0.5 * peso); // 0,5 mg/kg/dia
        const doseMaxPropra = Math.round(8 * peso); // 8 mg/kg/dia
        return {
          nome: "Propranolol",
          doseMin: `${doseMinPropra} mg`,
          doseMax: `${doseMaxPropra} mg`,
          via: "VO",
          frequencia: "a cada 6-8 horas"
        };
      }

      case "Metildopa": {
        const doseMinMetil = Math.round(10 * peso); // 10 mg/kg/dia
        const doseMaxMetil = Math.round(40 * peso); // 40 mg/kg/dia
        return {
          nome: "Metildopa",
          doseMin: `${doseMinMetil} mg`,
          doseMax: `${doseMaxMetil} mg`,
          via: "VO",
          frequencia: "a cada 6-8 horas"
        };
      }

      default:
        return null;
    }
  }

  /**
   * Avalia se há critérios para internação
   */
  private avaliarInternacao(dados: GlomerulonefriteInput): string[] {
    const criteriosPresentes: string[] = [];

    if (dados.sintomas.hipertensaoGrave) {
      criteriosPresentes.push("Hipertensão arterial de difícil controle");
    }

    if (dados.complicacoes.insuficienciaCardiaca) {
      criteriosPresentes.push("Insuficiência cardíaca congestiva");
    }

    if (dados.complicacoes.encefalopatiaHipertensiva) {
      criteriosPresentes.push("Encefalopatia hipertensiva");
    }

    if (dados.complicacoes.insuficienciaRenal) {
      criteriosPresentes.push("Insuficiência renal aguda");
    }

    if (dados.complicacoes.uremiaImportante) {
      criteriosPresentes.push("Uremia importante");
    }

    if (dados.complicacoes.sobrecargaVolemica) {
      criteriosPresentes.push("Sobrecarga volêmica importante");
    }

    return criteriosPresentes;
  }

  /**
   * Identifica sintomas presentes
   */
  private identificarSintomasPresentes(dados: GlomerulonefriteInput): string[] {
    const sintomas: string[] = [];

    if (dados.sintomas.oliguria) sintomas.push("Oligúria");
    if (dados.sintomas.edemaFacial) sintomas.push("Edema facial/periorbitário");
    if (dados.sintomas.edemaGeneralizado) sintomas.push("Edema generalizado");
    if (dados.sintomas.dorLombar) sintomas.push("Dor lombar");
    if (dados.sintomas.hipertensao || dados.sintomas.hipertensaoGrave) sintomas.push("Hipertensão arterial");
    if (dados.sintomas.hematuriaMacroscopica) sintomas.push("Hematúria macroscópica");
    if (dados.sintomas.hematuriaMicroscopica) sintomas.push("Hematúria microscópica");
    if (dados.sintomas.proteinuria) sintomas.push("Proteinúria");
    if (dados.sintomas.nauseasVomitos) sintomas.push("Náuseas/vômitos");
    if (dados.sintomas.palidez) sintomas.push("Palidez cutânea");
    if (dados.sintomas.nicturia) sintomas.push("Nictúria");

    return sintomas;
  }

  /**
   * Gera critérios de alta hospitalar
   */
  private gerarCriteriosAlta(): string[] {
    return [
      "Ausência de febre por pelo menos 24 horas",
      "Controle da hipertensão arterial",
      "Melhora do edema",
      "Normalização ou estabilização da função renal"
    ];
  }

  /**
   * Gera recomendações de seguimento
   */
  private gerarRecomendacoesSeguimento(): string[] {
    return [
      "Avaliação ambulatorial com 1, 3, 6 e 12 meses ou conforme necessidade",
      "Realizar exames de urina rotina, ureia, creatinina e complemento em cada consulta",
      "Se complemento persistir baixo após 8 semanas, considerar outras patologias",
      "Orientar sobre sinais de alerta e quando retornar ao serviço médico"
    ];
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: GlomerulonefriteInput): GlomerulonefriteResult {
    // Identificar sintomas presentes
    const sintomasPresentes = this.identificarSintomasPresentes(dados);

    // Avaliar diagnóstico provável (presença de hematúria e/ou proteinúria)
    const diagnosticoProvavel = dados.sintomas.hematuriaMacroscopica || 
                                dados.sintomas.hematuriaMicroscopica || 
                                dados.sintomas.proteinuria;

    // Avaliar critérios de internação
    const criteriosInternacao = this.avaliarInternacao(dados);
    const necessitaInternacao = criteriosInternacao.length > 0;

    // Calcular dose de antibiótico
    const antibioticoEscolhido = dados.antibioticoEscolhido || "Penicilina Benzatina";
    const antibiotico = this.calcularDoseAntibiotico(antibioticoEscolhido, dados.peso);

    // Verificar necessidade de anti-hipertensivos
    const necessitaAntiHipertensivo = dados.sintomas.hipertensao || dados.sintomas.hipertensaoGrave;

    // Calcular dose de anti-hipertensivo se necessário
    let antiHipertensivo: GlomerulonefriteAntiHipertensivo | undefined;
    if (necessitaAntiHipertensivo && dados.antiHipertensivoEscolhido && dados.antiHipertensivoEscolhido !== "none") {
      const resultado = this.calcularDoseAntiHipertensivo(dados.antiHipertensivoEscolhido, dados.peso);
      if (resultado) {
        antiHipertensivo = resultado;
      }
    }

    // Gerar recomendações
    const recomendacoesSeguimento = this.gerarRecomendacoesSeguimento();
    const criteriosAlta = necessitaInternacao ? this.gerarCriteriosAlta() : [];

    return {
      idadeAnos: dados.idadeAnos,
      idadeMeses: dados.idadeMeses,
      peso: dados.peso,
      sintomasPresentes,
      examesAlterados: dados.examesAlterados,
      diagnosticoProvavel,
      necessitaInternacao,
      criteriosInternacao,
      antibiotico,
      necessitaAntiHipertensivo,
      antiHipertensivo,
      examesRecomendados: this.examesRecomendados,
      medidasGerais: this.medidasGerais,
      recomendacoesSeguimento,
      criteriosAlta
    };
  }
}

// Instância singleton para uso global
export const glomerulonefriteCalculator = new GlomerulonefriteCalculator();
