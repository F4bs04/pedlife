// Conversão do controller de Pneumonia para TypeScript

export interface PneumoniaInputs {
  idade?: number;
  peso?: number;
  gravidade?: string;
}

export interface PneumoniaResults {
  tratamento?: string[];
  observacoes?: string;
  [key: string]: any;
}

class PneumoniaController {
  criterios_gravidade: any[];
  antibioticos: any;
  escalas_avaliacao: any;
  
  constructor() {
    this.criterios_gravidade = [
      {
        gravidade: "Leve (ambulatorial)",
        criterios: [
          "Ausência de sinais de alarme",
          "Saturação O2 > 92%",
          "Frequência respiratória normal para idade",
          "Ausência de tiragem",
          "Boa aceitação oral"
        ]
      },
      {
        gravidade: "Moderada (internação)",
        criterios: [
          "Saturação O2 < 92%",
          "Frequência respiratória aumentada",
          "Tiragem subcostal ou intercostal",
          "Gemência",
          "Recusa alimentar"
        ]
      },
      {
        gravidade: "Grave (UTI)",
        criterios: [
          "Insuficiência respiratória",
          "Sinais de sepse",
          "Alteração de consciência",
          "Choque",
          "Falência orgânica"
        ]
      }
    ];
    
    this.antibioticos = {
      ambulatorial: {
        primeira_linha: {
          medicamento: "Amoxicilina",
          dose: "80-90 mg/kg/dia",
          intervalo: "8/8h",
          duracao: "7-10 dias"
        },
        alergia_penicilina: {
          medicamento: "Azitromicina",
          dose: "10 mg/kg/dia",
          intervalo: "24/24h",
          duracao: "5 dias"
        }
      },
      internacao: {
        primeira_linha: {
          medicamento: "Ampicilina",
          dose: "200 mg/kg/dia",
          intervalo: "6/6h",
          via: "EV"
        },
        segunda_linha: {
          medicamento: "Ceftriaxona",
          dose: "100 mg/kg/dia",
          intervalo: "24/24h",
          via: "EV"
        }
      },
      uti: {
        primeira_linha: {
          medicamento: "Cefepime + Vancomicina",
          dose: "150 mg/kg/dia + 60 mg/kg/dia",
          observacao: "Cobertura ampla"
        },
        alternativa: {
          medicamento: "Meropenem",
          dose: "120 mg/kg/dia",
          intervalo: "8/8h"
        }
      }
    };
    
    this.escalas_avaliacao = {
      freq_respiratoria_normal: [
        {faixa_etaria: "0-2 meses", normal: "30-60 irpm"},
        {faixa_etaria: "2-12 meses", normal: "24-50 irpm"},
        {faixa_etaria: "1-2 anos", normal: "20-40 irpm"},
        {faixa_etaria: "2-5 anos", normal: "20-35 irpm"},
        {faixa_etaria: "> 5 anos", normal: "15-30 irpm"}
      ]
    };
  }

  avaliarFrequenciaRespiratoria(idadeMeses: number, freqResp: number): any {
    try {
      let faixaNormal = "";
      let limiteInferior = 0;
      let limiteSuperior = 0;
      
      if (idadeMeses < 2) {
        faixaNormal = "30-60 irpm";
        limiteInferior = 30;
        limiteSuperior = 60;
      } else if (idadeMeses < 12) {
        faixaNormal = "24-50 irpm";
        limiteInferior = 24;
        limiteSuperior = 50;
      } else if (idadeMeses < 24) {
        faixaNormal = "20-40 irpm";
        limiteInferior = 20;
        limiteSuperior = 40;
      } else if (idadeMeses < 60) {
        faixaNormal = "20-35 irpm";
        limiteInferior = 20;
        limiteSuperior = 35;
      } else {
        faixaNormal = "15-30 irpm";
        limiteInferior = 15;
        limiteSuperior = 30;
      }
      
      const aumentada = freqResp > limiteSuperior;
      const taquipneia = freqResp > (limiteSuperior + 10);
      
      return {
        faixa_normal: faixaNormal,
        freq_atual: freqResp,
        aumentada: aumentada,
        taquipneia: taquipneia,
        avaliacao: taquipneia ? "Taquipneia importante" : 
                  aumentada ? "Frequência aumentada" : "Normal"
      };
    } catch (error: any) {
      throw new Error("Erro ao avaliar frequência respiratória");
    }
  }

  classificarGravidade(dados: any): any {
    try {
      const saturacao = parseFloat(dados.saturacao_o2 || 95);
      const freqResp = parseInt(dados.freq_respiratoria || 30);
      const idadeMeses = parseInt(dados.idade_meses || 12);
      const tiragem = dados.tiragem || false;
      const gemencia = dados.gemencia || false;
      const alteracaoConsciencia = dados.alteracao_consciencia || false;
      const choque = dados.choque || false;
      const recusaAlimentar = dados.recusa_alimentar || false;
      
      const avalFreqResp = this.avaliarFrequenciaRespiratoria(idadeMeses, freqResp);
      
      let pontuacaoGravidade = 0;
      let criteriosPresentes = [];
      
      // Critérios de gravidade
      if (saturacao < 90) {
        pontuacaoGravidade += 3;
        criteriosPresentes.push("Saturação O2 < 90%");
      } else if (saturacao < 92) {
        pontuacaoGravidade += 2;
        criteriosPresentes.push("Saturação O2 < 92%");
      }
      
      if (avalFreqResp.taquipneia) {
        pontuacaoGravidade += 2;
        criteriosPresentes.push("Taquipneia importante");
      } else if (avalFreqResp.aumentada) {
        pontuacaoGravidade += 1;
        criteriosPresentes.push("Frequência respiratória aumentada");
      }
      
      if (tiragem) {
        pontuacaoGravidade += 2;
        criteriosPresentes.push("Tiragem");
      }
      
      if (gemencia) {
        pontuacaoGravidade += 1;
        criteriosPresentes.push("Gemência");
      }
      
      if (alteracaoConsciencia) {
        pontuacaoGravidade += 3;
        criteriosPresentes.push("Alteração de consciência");
      }
      
      if (choque) {
        pontuacaoGravidade += 3;
        criteriosPresentes.push("Sinais de choque");
      }
      
      if (recusaAlimentar) {
        pontuacaoGravidade += 1;
        criteriosPresentes.push("Recusa alimentar");
      }
      
      // Classificação final
      let gravidade = "";
      let local_tratamento = "";
      
      if (pontuacaoGravidade >= 6 || alteracaoConsciencia || choque) {
        gravidade = "Grave";
        local_tratamento = "UTI Pediátrica";
      } else if (pontuacaoGravidade >= 3 || saturacao < 92) {
        gravidade = "Moderada";
        local_tratamento = "Internação";
      } else {
        gravidade = "Leve";
        local_tratamento = "Ambulatorial";
      }
      
      return {
        gravidade: gravidade,
        pontuacao: pontuacaoGravidade,
        criterios_presentes: criteriosPresentes,
        local_tratamento: local_tratamento,
        freq_respiratoria: avalFreqResp
      };
    } catch (error: any) {
      throw new Error("Erro ao classificar gravidade da pneumonia");
    }
  }

  calcularAntibioticoTerapia(peso: number, gravidade: string, alergiaPenicilina: boolean = false): any {
    try {
      let esquema = {};
      
      if (gravidade === "Leve") {
        if (alergiaPenicilina) {
          const dose = peso * 10;
          esquema = {
            medicamento: "Azitromicina",
            dose_total: `${dose} mg`,
            dose_ml: `${dose / 40} mL (susp 40mg/mL)`,
            intervalo: "24/24h",
            duracao: "5 dias",
            via: "Oral"
          };
        } else {
          const dose = peso * 85;
          const doseDividida = Math.round(dose / 3);
          esquema = {
            medicamento: "Amoxicilina",
            dose_total: `${dose} mg/dia`,
            dose_por_vez: `${doseDividida} mg`,
            dose_ml: `${doseDividida / 50} mL (susp 50mg/mL)`,
            intervalo: "8/8h",
            duracao: "7-10 dias",
            via: "Oral"
          };
        }
      } else if (gravidade === "Moderada") {
        const doseAmpicilina = peso * 200;
        const doseDividida = Math.round(doseAmpicilina / 4);
        esquema = {
          medicamento: "Ampicilina",
          dose_total: `${doseAmpicilina} mg/dia`,
          dose_por_vez: `${doseDividida} mg`,
          intervalo: "6/6h",
          duracao: "7-10 dias",
          via: "Endovenosa",
          alternativa: {
            medicamento: "Ceftriaxona",
            dose: `${peso * 100} mg/dia`,
            intervalo: "24/24h"
          }
        };
      } else if (gravidade === "Grave") {
        esquema = {
          primeira_linha: {
            medicamento: "Cefepime + Vancomicina",
            cefepime: `${peso * 150} mg/dia (6/6h)`,
            vancomicina: `${peso * 60} mg/dia (6/6h)`,
            duracao: "10-14 dias"
          },
          alternativa: {
            medicamento: "Meropenem",
            dose: `${peso * 120} mg/dia`,
            intervalo: "8/8h"
          }
        };
      }
      
      return esquema;
    } catch (error: any) {
      throw new Error("Erro ao calcular antibioticoterapia");
    }
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idadeMeses = parseInt(dados.idade_meses || 12);
      const alergiaPenicilina = dados.alergia_penicilina || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado e maior que zero");
      }
      
      // Classificar gravidade
      const classificacao = this.classificarGravidade(dados);
      
      // Calcular antibioticoterapia
      const antibioticoTerapia = this.calcularAntibioticoTerapia(peso, classificacao.gravidade, alergiaPenicilina);
      
      // Suporte respiratório
      const suporteRespiratorio = [];
      if (classificacao.gravidade === "Moderada") {
        suporteRespiratorio.push("Oxigenoterapia se SatO2 < 92%");
        suporteRespiratorio.push("Fisioterapia respiratória");
        suporteRespiratorio.push("Hidratação adequada");
      } else if (classificacao.gravidade === "Grave") {
        suporteRespiratorio.push("Oxigenoterapia ou ventilação mecânica");
        suporteRespiratorio.push("Monitorização intensiva");
        suporteRespiratorio.push("Suporte hemodinâmico se necessário");
      }
      
      // Critérios de alta
      const criteriosAlta = [
        "Ausência de febre por 24-48h",
        "Saturação O2 > 92% em ar ambiente",
        "Melhora do padrão respiratório",
        "Aceitação alimentar adequada",
        "Possibilidade de completar tratamento em casa"
      ];
      
      // Seguimento
      const seguimento = [];
      if (classificacao.gravidade === "Leve") {
        seguimento.push("Retorno em 48-72h se não melhorar");
        seguimento.push("Reavaliação médica em 7 dias");
      } else {
        seguimento.push("Seguimento ambulatorial em 7-15 dias");
        seguimento.push("RX de tórax de controle conforme evolução");
      }
      
      return {
        classificacao: classificacao,
        antibioticoterapia: antibioticoTerapia,
        suporte_respiratorio: suporteRespiratorio,
        criterios_alta: criteriosAlta,
        seguimento: seguimento,
        internacao_necessaria: classificacao.gravidade !== "Leve"
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular tratamento da pneumonia: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getCriteriosGravidade(): any[] {
    return this.criterios_gravidade;
  }
  
  getAntibioticos(): any {
    return this.antibioticos;
  }
}

const controller = new PneumoniaController();
export default controller;
