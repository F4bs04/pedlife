// Conversão do controller de Glomerulonefrite para TypeScript

export interface GlomerulonefriteInputs {
  peso: number;
  idade_meses: number;
  tipo: string;
  pressao_sistolica: number;
  pressao_diastolica: number;
  edema: boolean;
  hematuria: boolean;
}

export interface GlomerulonefriteResults {
  gravidade: string;
  necessita_dialise: boolean;
  tratamento: string[];
  restricoes: string[];
  observacoes: string[];
}

class GlomerulonefriteController {
  medicamentos: any;
  criterios_dialise: string[];
  
  constructor() {
    this.medicamentos = {
      diuretico: "Furosemida 1-2 mg/kg/dose",
      anti_hipertensivo: "Nifedipina 0.25-0.5 mg/kg/dose",
      corticoide: "Prednisolona 2 mg/kg/dia"
    };
    
    this.criterios_dialise = [
      "Oligúria persistente",
      "Edema pulmonar",
      "Hipertensão refratária",
      "Uremia grave"
    ];
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const pressaoSist = parseFloat(dados.pressao_sistolica || 0);
      const pressaoDiast = parseFloat(dados.pressao_diastolica || 0);
      const edema = dados.edema || false;
      const hematuria = dados.hematuria || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const gravidade = this.classificarGravidade(pressaoSist, pressaoDiast, edema, hematuria);
      const necessitaDialise = this.avaliarDialise(pressaoSist, edema);
      const tratamento = this.calcularTratamento(peso, gravidade, necessitaDialise);
      const restricoes = this.definirRestricoes(gravidade);
      
      return {
        gravidade: gravidade,
        necessita_dialise: necessitaDialise,
        tratamento: tratamento,
        restricoes: restricoes,
        observacoes: this.gerarObservacoes(gravidade, necessitaDialise)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private classificarGravidade(pressaoSist: number, pressaoDiast: number, edema: boolean, hematuria: boolean): string {
    let pontos = 0;
    
    if (pressaoSist > 140 || pressaoDiast > 90) pontos += 2;
    else if (pressaoSist > 120 || pressaoDiast > 80) pontos += 1;
    
    if (edema) pontos += 1;
    if (hematuria) pontos += 1;
    
    if (pontos >= 3) return "grave";
    if (pontos >= 2) return "moderada";
    return "leve";
  }
  
  private avaliarDialise(pressaoSist: number, edema: boolean): boolean {
    return pressaoSist > 180 || edema;
  }
  
  private calcularTratamento(peso: number, gravidade: string, dialise: boolean): string[] {
    const tratamento = [];
    
    if (gravidade !== "leve") {
      const doseFurosemida = Math.round(peso * 1);
      tratamento.push(`Furosemida ${doseFurosemida} mg EV 12/12h`);
    }
    
    if (gravidade === "grave") {
      const dosePrednisolona = Math.round(peso * 2);
      tratamento.push(`Prednisolona ${dosePrednisolona} mg VO 1x/dia`);
    }
    
    if (dialise) {
      tratamento.push("Hemodiálise urgente");
    }
    
    return tratamento;
  }
  
  private definirRestricoes(gravidade: string): string[] {
    const restricoes = ["Restrição hídrica"];
    
    if (gravidade !== "leve") {
      restricoes.push("Restrição de sódio");
      restricoes.push("Restrição proteica");
    }
    
    return restricoes;
  }
  
  private gerarObservacoes(gravidade: string, dialise: boolean): string[] {
    const obs = ["Monitorar diurese", "Controle pressórico"];
    
    if (gravidade === "grave") {
      obs.push("UTI pediátrica");
    }
    
    if (dialise) {
      obs.push("Preparo para diálise urgente");
    }
    
    return obs;
  }
}

const controller = new GlomerulonefriteController();
export default controller;
