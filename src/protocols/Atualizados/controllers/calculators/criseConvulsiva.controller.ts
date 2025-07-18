class CriseConvulsivaController {
  medicamentos_anticonvulsivantes: any;
  protocolo_status_epilepticus: any[];
  tipos_crise: string[];
  
  constructor() {
    this.tipos_crise = [
      "Crise febril simples",
      "Crise febril complexa", 
      "Status epilepticus",
      "Primeira crise afebril",
      "Epilepsia conhecida"
    ];
    
    this.medicamentos_anticonvulsivantes = {
      diazepam: {
        via_retal: {
          dose: "0,5 mg/kg",
          dose_maxima: "10 mg"
        },
        via_ev: {
          dose: "0,2-0,3 mg/kg",
          dose_maxima: "10 mg"
        }
      },
      midazolam: {
        via_intranasal: {
          dose: "0,2 mg/kg",
          dose_maxima: "10 mg"
        },
        via_ev: {
          dose: "0,1-0,2 mg/kg",
          dose_maxima: "5 mg"
        }
      },
      fenitoina: {
        dose_ataque: "20 mg/kg",
        dose_maxima: "1000 mg"
      }
    };
    
    this.protocolo_status_epilepticus = [
      {
        tempo: "0-5 min",
        medicamento: "Midazolam IN ou Diazepam retal",
        observacao: "Primeira linha"
      },
      {
        tempo: "5-10 min", 
        medicamento: "Diazepam EV ou Midazolam EV",
        observacao: "Acesso venoso"
      },
      {
        tempo: "10-20 min",
        medicamento: "Fenitoína EV",
        observacao: "Segunda linha"
      }
    ];
  }

  calcularDoseMedicamento(peso: number, medicamento: string, via: string): any {
    try {
      const med = this.medicamentos_anticonvulsivantes[medicamento];
      if (!med) {
        throw new Error("Medicamento não encontrado");
      }
      
      let dose = 0;
      if (medicamento === "diazepam") {
        if (via === "retal") {
          dose = Math.min(peso * 0.5, 10);
        } else if (via === "ev") {
          dose = Math.min(peso * 0.25, 10);
        }
      } else if (medicamento === "midazolam") {
        if (via === "intranasal") {
          dose = Math.min(peso * 0.2, 10);
        } else if (via === "ev") {
          dose = Math.min(peso * 0.15, 5);
        }
      } else if (medicamento === "fenitoina") {
        dose = Math.min(peso * 20, 1000);
      }
      
      return {
        dose_calculada: `${Math.round(dose * 10) / 10} mg`,
        medicamento: medicamento,
        via: via
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular dose");
    }
  }

  avaliarTipoCrise(dados: any): any {
    try {
      const idade = parseInt(dados.idade_meses || 24);
      const febre = dados.febre || false;
      const duracaoMinutos = parseInt(dados.duracao_minutos || 5);
      const primeiraVez = dados.primeira_vez || false;
      
      let tipoCrise = "";
      let gravidade = "Leve";
      
      if (febre && idade >= 6 && idade <= 60) {
        if (duracaoMinutos < 15 && primeiraVez) {
          tipoCrise = "Crise febril simples";
          gravidade = "Leve";
        } else {
          tipoCrise = "Crise febril complexa";
          gravidade = "Moderada";
        }
      } else if (duracaoMinutos >= 30) {
        tipoCrise = "Status epilepticus";
        gravidade = "Grave";
      } else if (primeiraVez && !febre) {
        tipoCrise = "Primeira crise afebril";
        gravidade = "Moderada";
      }
      
      return {
        tipo: tipoCrise,
        gravidade: gravidade
      };
    } catch (error: any) {
      throw new Error("Erro ao avaliar tipo de crise");
    }
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const duracaoMinutos = parseInt(dados.duracao_minutos || 5);
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado e maior que zero");
      }
      
      const avaliacaoCrise = this.avaliarTipoCrise(dados);
      
      const protocoloMedicamentos = [];
      
      if (duracaoMinutos > 5) {
        protocoloMedicamentos.push({
          medicamento: "Primeira linha",
          midazolam: this.calcularDoseMedicamento(peso, "midazolam", "intranasal"),
          diazepam: this.calcularDoseMedicamento(peso, "diazepam", "retal")
        });
      }
      
      if (duracaoMinutos > 10) {
        protocoloMedicamentos.push({
          medicamento: "Segunda linha",
          diazepam_ev: this.calcularDoseMedicamento(peso, "diazepam", "ev"),
          fenitoina: this.calcularDoseMedicamento(peso, "fenitoina", "ev")
        });
      }
      
      const internacaoNecessaria = avaliacaoCrise.gravidade === "Grave" || 
                                  avaliacaoCrise.gravidade === "Moderada";
      
      return {
        avaliacao_crise: avaliacaoCrise,
        protocolo_medicamentos: protocoloMedicamentos,
        internacao_necessaria: internacaoNecessaria,
        monitorização: [
          "Nível de consciência",
          "Sinais vitais",
          "Glicemia",
          "Saturação de O2"
        ]
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular tratamento da crise convulsiva: ${error.message}`);
    }
  }
}

const controller = new CriseConvulsivaController();
export default controller;
