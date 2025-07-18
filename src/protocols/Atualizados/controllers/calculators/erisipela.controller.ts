// Conversão do controller de Erisipela para TypeScript

export interface ErisipelaInputs {
  peso: number;
  idade_meses: number;
  local: string;
  gravidade: string;
}

export interface ErisipelaResults {
  internacao_necessaria: boolean;
  tratamento: string[];
  duracao: string;
  observacoes: string[];
}

class ErisipelaController {
  antibioticos: any;
  criterios_gravidade: string[];
  
  constructor() {
    this.antibioticos = {
      ambulatorial: {
        primeira_linha: "Penicilina V 50.000 UI/kg/dia",
        alternativa: "Eritromicina 50 mg/kg/dia"
      },
      internacao: {
        primeira_linha: "Penicilina G 100.000 UI/kg/dia",
        alternativa: "Ceftriaxone 100 mg/kg/dia"
      }
    };
    
    this.criterios_gravidade = [
      "Idade < 1 ano",
      "Febre alta",
      "Comprometimento sistêmico",
      "Face ou genitália",
      "Falha ambulatorial"
    ];
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const local = dados.local || "";
      const gravidade = dados.gravidade || "leve";
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const necessitaInternacao = this.avaliarInternacao(idade, local, gravidade);
      const tratamento = this.calcularTratamento(peso, necessitaInternacao);
      
      return {
        internacao_necessaria: necessitaInternacao,
        tratamento: tratamento,
        duracao: "7-10 dias",
        observacoes: this.gerarObservacoes(local, gravidade)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private avaliarInternacao(idade: number, local: string, gravidade: string): boolean {
    return idade < 12 || 
           local.includes("face") || 
           local.includes("genitália") || 
           gravidade === "grave";
  }
  
  private calcularTratamento(peso: number, internacao: boolean): string[] {
    if (internacao) {
      const dosePenicilinaG = Math.round(peso * 100000 / 4);
      return [`Penicilina G ${dosePenicilinaG} UI EV 6/6h`];
    } else {
      const dosePenicilineV = Math.round(peso * 50000 / 3);
      return [`Penicilina V ${dosePenicilineV} UI VO 8/8h`];
    }
  }
  
  private gerarObservacoes(local: string, gravidade: string): string[] {
    const obs = ["Compressas frias locais", "Elevação do membro"];
    
    if (local.includes("face")) {
      obs.push("Atenção para complicações neurológicas");
    }
    
    if (gravidade === "grave") {
      obs.push("Monitorização rigorosa");
    }
    
    return obs;
  }
}

const controller = new ErisipelaController();
export default controller;
