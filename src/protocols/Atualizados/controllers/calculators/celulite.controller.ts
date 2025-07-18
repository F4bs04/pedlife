// Conversão do controller de Celulite para TypeScript

export interface CeluliteInputs {
  idade?: number;
  peso?: number;
  local?: string;
}

export interface CeluliteResults {
  tratamento?: string[];
  observacoes?: string;
  [key: string]: any;
}

class CeluliteController {
  antibioticos: any;
  criterios_internacao: string[];
  
  constructor() {
    this.antibioticos = {
      ambulatorial: {
        primeira_linha: "Cefalexina 100 mg/kg/dia",
        alternativa: "Clindamicina 30 mg/kg/dia"
      },
      internacao: {
        primeira_linha: "Cefazolina 100 mg/kg/dia",
        mrsa_suspeito: "Vancomicina 60 mg/kg/dia"
      }
    };
    
    this.criterios_internacao = [
      "Idade < 6 meses",
      "Febre alta persistente",
      "Sinais sistêmicos",
      "Celulite periorbitária",
      "Falha ambulatorial"
    ];
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const local = dados.local || "";
      const febre = dados.febre || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const internacao = idade < 6 || local.includes("órbita") || febre;
      
      let tratamento = [];
      if (internacao) {
        const doseCefazolina = Math.round(peso * 100 / 3);
        tratamento.push(`Cefazolina ${doseCefazolina} mg EV 8/8h`);
      } else {
        const doseCefalexina = Math.round(peso * 100 / 4);
        tratamento.push(`Cefalexina ${doseCefalexina} mg VO 6/6h`);
      }
      
      return {
        internacao_necessaria: internacao,
        tratamento: tratamento,
        duracao: "7-10 dias"
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
}

const controller = new CeluliteController();
export default controller;
