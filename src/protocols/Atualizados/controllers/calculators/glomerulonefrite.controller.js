class GlomerulonefriteController {
  constructor() {
    // Critérios diagnósticos
    this.sintomas_comuns = [
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
    
    // Exames complementares recomendados
    this.exames_recomendados = [
      "Urina rotina e cultura de urina",
      "Hemograma completo",
      "Ureia e creatinina",
      "Eletrólitos séricos",
      "Complemento sérico (C3, CH50)",
      "ASLO (Antiestreptolisina O)",
      "Proteína C reativa",
      "Ultrassom de rins e vias urinárias"
    ];
    
    // Critérios de internação
    this.criterios_internacao = [
      "Hipertensão arterial de difícil controle",
      "Insuficiência cardíaca congestiva",
      "Encefalopatia hipertensiva",
      "Insuficiência renal aguda",
      "Uremia importante",
      "Sobrecarga volêmica importante"
    ];
    
    // Opções de antibioticoterapia
    this.antibioticos = [
      {
        nome: "Penicilina Benzatina",
        dose: {
          crianca_menor_27kg: "600.000 UI IM dose única",
          crianca_maior_27kg: "1.200.000 UI IM dose única"
        }
      },
      {
        nome: "Penicilina V (Fenoximetilpenicilina)",
        dose: {
          crianca: "250 mg VO a cada 8 horas por 10 dias",
          adulto: "500 mg VO a cada 8 horas por 10 dias"
        }
      },
      {
        nome: "Amoxicilina",
        dose: "50 mg/kg/dia VO (máximo 1,5g/dia) dividido a cada 8 horas por 10 dias"
      },
      {
        nome: "Eritromicina (alérgicos à penicilina)",
        dose: "50 mg/kg/dia VO dividido a cada 6 horas por 10 dias"
      }
    ];
    
    // Opções de anti-hipertensivos
    this.anti_hipertensivos = [
      {
        tipo: "Diuréticos",
        opcoes: [
          {
            nome: "Furosemida",
            dose: "1 a 3 mg/kg/dia VO ou IV a cada 6-12 horas"
          },
          {
            nome: "Hidroclorotiazida",
            dose: "1 a 2 mg/kg/dia VO a cada 12 horas"
          }
        ]
      },
      {
        tipo: "Vasodilatadores",
        opcoes: [
          {
            nome: "Hidralazina",
            dose: "1 a 8 mg/kg/dia VO a cada 6-8 horas"
          }
        ]
      },
      {
        tipo: "Inibidores da ECA",
        opcoes: [
          {
            nome: "Captopril",
            dose: "0,3 a 0,5 mg/kg/dose VO a cada 6-8 horas (a partir de 3 anos)",
            observacao: "Usar com cautela na insuficiência renal"
          }
        ]
      },
      {
        tipo: "Bloqueadores de canal de cálcio",
        opcoes: [
          {
            nome: "Nifedipina",
            dose: "0,25 a 0,5 mg/kg/dose VO a cada 6-8 horas (máximo 10 mg/dose)"
          }
        ]
      },
      {
        tipo: "Beta-bloqueadores",
        opcoes: [
          {
            nome: "Propranolol",
            dose: "0,5 a 8 mg/kg/dia VO a cada 6-8 horas"
          }
        ]
      },
      {
        tipo: "Agonistas alfa centrais",
        opcoes: [
          {
            nome: "Metildopa",
            dose: "10 a 40 mg/kg/dia VO a cada 6-8 horas"
          }
        ]
      }
    ];
    
    // Medidas gerais de tratamento
    this.medidas_gerais = [
      {
        tipo: "Dieta",
        recomendacoes: [
          "Restrição de sódio",
          "Manter ingestão proteica normal exceto se ureia elevada",
          "Restrição hídrica apenas em caso de edema acentuado ou insuficiência renal"
        ]
      },
      {
        tipo: "Repouso",
        recomendacoes: [
          "Recomendado até o desaparecimento dos sintomas agudos e controle da hipertensão arterial"
        ]
      },
      {
        tipo: "Monitorização",
        recomendacoes: [
          "Controle diário da diurese até normalização da função renal",
          "Aferição diária do peso para avaliar retenção hídrica",
          "Aferições regulares da pressão arterial"
        ]
      }
    ];
  }

  calcularDoseAntibiotico(antibiotico, peso) {
    /**
     * Calcula a dose de antibiótico com base no peso do paciente
     */
    try {
      const resultado = {};
      
      if (antibiotico === "Penicilina Benzatina") {
        if (peso < 27) {
          resultado.dose = "600.000 UI";
          resultado.via = "IM";
          resultado.frequencia = "Dose única";
        } else {
          resultado.dose = "1.200.000 UI";
          resultado.via = "IM";
          resultado.frequencia = "Dose única";
        }
      } else if (antibiotico === "Amoxicilina") {
        let dose_diaria = 50 * peso;  // 50 mg/kg/dia
        if (dose_diaria > 1500) {
          dose_diaria = 1500;  // máximo 1,5g/dia
        }
        
        const dose_por_tomada = Math.round(dose_diaria / 3);  // 3 vezes ao dia
        resultado.dose = `${dose_por_tomada} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 8 horas por 10 dias";
        resultado.dose_diaria = `${dose_diaria} mg/dia`;
      } else if (antibiotico === "Eritromicina") {
        const dose_diaria = 50 * peso;  // 50 mg/kg/dia
        const dose_por_tomada = Math.round(dose_diaria / 4);  // 4 vezes ao dia
        resultado.dose = `${dose_por_tomada} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 6 horas por 10 dias";
        resultado.dose_diaria = `${dose_diaria} mg/dia`;
      } else {  // Penicilina V
        if (peso < 27) {
          resultado.dose = "250 mg";
          resultado.via = "VO";
          resultado.frequencia = "a cada 8 horas por 10 dias";
        } else {
          resultado.dose = "500 mg";
          resultado.via = "VO";
          resultado.frequencia = "a cada 8 horas por 10 dias";
        }
      }
      
      return resultado;
    } catch (error) {
      console.error("Erro ao calcular dose de antibiótico:", error);
      throw new Error("Não foi possível calcular a dose do antibiótico");
    }
  }
  
  calcularDoseAntiHipertensivo(medicamento, peso) {
    /**
     * Calcula a dose de anti-hipertensivo com base no peso do paciente
     */
    try {
      const resultado = {};
      
      if (medicamento === "Furosemida") {
        const dose_min = Math.round(1 * peso);  // 1 mg/kg/dia
        const dose_max = Math.round(3 * peso);  // 3 mg/kg/dia
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO ou IV";
        resultado.frequencia = "a cada 6-12 horas";
      } else if (medicamento === "Hidroclorotiazida") {
        const dose_min = Math.round(1 * peso);  // 1 mg/kg/dia
        const dose_max = Math.round(2 * peso);  // 2 mg/kg/dia
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 12 horas";
      } else if (medicamento === "Hidralazina") {
        const dose_min = Math.round(1 * peso);  // 1 mg/kg/dia
        const dose_max = Math.round(8 * peso);  // 8 mg/kg/dia
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 6-8 horas";
      } else if (medicamento === "Captopril") {
        if (peso * 3 < 10) {  // Idade mínima recomendada de 3 anos
          return { erro: "Captopril não é recomendado para crianças menores de 3 anos" };
        }
        
        const dose_min = Number((0.3 * peso).toFixed(1));  // 0,3 mg/kg/dose
        const dose_max = Number((0.5 * peso).toFixed(1));  // 0,5 mg/kg/dose
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 6-8 horas";
        resultado.observacao = "Usar com cautela na insuficiência renal";
      } else if (medicamento === "Nifedipina") {
        let dose_min = Number((0.25 * peso).toFixed(1));  // 0,25 mg/kg/dose
        let dose_max = Number((0.5 * peso).toFixed(1));  // 0,5 mg/kg/dose
        
        if (dose_max > 10) {
          dose_max = 10;  // máximo 10 mg/dose
        }
        
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 6-8 horas";
        resultado.observacao = "Máximo de 10 mg por dose";
      } else if (medicamento === "Propranolol") {
        const dose_min = Math.round(0.5 * peso);  // 0,5 mg/kg/dia
        const dose_max = Math.round(8 * peso);  // 8 mg/kg/dia
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 6-8 horas";
      } else if (medicamento === "Metildopa") {
        const dose_min = Math.round(10 * peso);  // 10 mg/kg/dia
        const dose_max = Math.round(40 * peso);  // 40 mg/kg/dia
        resultado.dose_min = `${dose_min} mg`;
        resultado.dose_max = `${dose_max} mg`;
        resultado.via = "VO";
        resultado.frequencia = "a cada 6-8 horas";
      }
      
      return resultado;
    } catch (error) {
      console.error("Erro ao calcular dose de anti-hipertensivo:", error);
      throw new Error("Não foi possível calcular a dose do anti-hipertensivo");
    }
  }
  
  avaliarInternacao(sintomas) {
    /**
     * Avalia se há critérios para internação
     */
    try {
      const criterios_presentes = [];
      
      if (sintomas.hipertensao_grave) {
        criterios_presentes.push("Hipertensão arterial de difícil controle");
      }
      
      if (sintomas.insuficiencia_cardiaca) {
        criterios_presentes.push("Insuficiência cardíaca congestiva");
      }
      
      if (sintomas.encefalopatia_hipertensiva) {
        criterios_presentes.push("Encefalopatia hipertensiva");
      }
      
      if (sintomas.insuficiencia_renal) {
        criterios_presentes.push("Insuficiência renal aguda");
      }
      
      if (sintomas.uremia_importante) {
        criterios_presentes.push("Uremia importante");
      }
      
      if (sintomas.sobrecarga_volemica) {
        criterios_presentes.push("Sobrecarga volêmica importante");
      }
      
      return criterios_presentes;
    } catch (error) {
      console.error("Erro ao avaliar critérios de internação:", error);
      throw new Error("Não foi possível avaliar os critérios de internação");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getSintomasComuns() {
    return this.sintomas_comuns;
  }
  
  getExamesRecomendados() {
    return this.exames_recomendados;
  }
  
  getCriteriosInternacao() {
    return this.criterios_internacao;
  }
  
  getAntibioticos() {
    return this.antibioticos;
  }
  
  getAntiHipertensivos() {
    return this.anti_hipertensivos;
  }
  
  getMedidasGerais() {
    return this.medidas_gerais;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade_anos = parseInt(dados.idade || 0);
      const idade_meses = idade_anos * 12 + parseInt(dados.idade_meses || 0);
      
      // Verificar sintomas presentes
      const sintomas_presentes = [];
      for (const sintoma of this.sintomas_comuns) {
        const chave = sintoma.toLowerCase().replace(" ", "_").replace("/", "_");
        if (dados[chave]) {
          sintomas_presentes.push(sintoma);
        }
      }
      
      // Verificar exames alterados
      const exames_alterados = dados.exames_alterados || [];
      
      // Avaliar presença de hematúria e/ou proteinúria (essenciais para diagnóstico)
      const diagnostico_provavel = dados.hematuria_macroscopica || dados.hematuria_microscopica;
      
      // Avaliar critérios de internação
      const criterios_internacao = this.avaliarInternacao(dados);
      const necessita_internacao = criterios_internacao.length > 0;
      
      // Calcular doses de antibióticos
      const antibiotico_escolhido = dados.antibiotico || "Penicilina Benzatina";
      const dose_antibiotico = this.calcularDoseAntibiotico(antibiotico_escolhido, peso);
      
      // Verificar necessidade de anti-hipertensivos
      const necessita_anti_hipertensivo = dados.hipertensao || dados.hipertensao_grave;
      
      // Calcular doses de anti-hipertensivos se necessário
      let doses_anti_hipertensivos = {};
      if (necessita_anti_hipertensivo) {
        const anti_hipertensivo_escolhido = dados.anti_hipertensivo || "";
        if (anti_hipertensivo_escolhido) {
          doses_anti_hipertensivos = this.calcularDoseAntiHipertensivo(anti_hipertensivo_escolhido, peso);
        }
      }
      
      // Recomendações de seguimento
      const recomendacoes_seguimento = [
        "Avaliação ambulatorial com 1, 3, 6 e 12 meses ou conforme necessidade",
        "Realizar exames de urina rotina, ureia, creatinina e complemento em cada consulta",
        "Se complemento persistir baixo após 8 semanas, considerar outras patologias"
      ];
      
      // Critérios de alta hospitalar (se internado)
      const criterios_alta = [
        "Ausência de febre por pelo menos 24 horas",
        "Controle da hipertensão arterial",
        "Melhora do edema",
        "Normalização ou estabilização da função renal"
      ];
      
      // Construir resultado final
      return {
        idade_anos,
        idade_meses,
        peso,
        sintomas_presentes,
        exames_alterados,
        diagnostico_provavel,
        necessita_internacao,
        criterios_internacao,
        antibiotico_escolhido,
        dose_antibiotico,
        necessita_anti_hipertensivo,
        doses_anti_hipertensivos,
        recomendacoes_seguimento,
        criterios_alta: necessita_internacao ? criterios_alta : []
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para glomerulonefrite:", error);
      throw new Error("Não foi possível calcular as recomendações para glomerulonefrite");
    }
  }
}

// Exporta uma instância do controlador
const controller = new GlomerulonefriteController();
export default controller;
