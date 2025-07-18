// Conversão do controller de Politraumatismo para TypeScript

export interface PolitraumatismoInputs {
  peso: number;
  idade_meses: number;
  mecanismo: string;
  glasgow: number;
  pressao_sistolica: number;
  frequencia_respiratoria: number;
}

export interface PolitraumatismoResults {
  rts_score: number;
  gravidade: string;
  prioridade: string;
  tratamento_inicial: string[];
  exames_necessarios: string[];
  observacoes: string[];
}

class PolitraumatismoController {
  escala_glasgow: any;
  parametros_vitais: any;
  
  constructor() {
    this.escala_glasgow = {
      15: 4,
      13: 3,
      9: 2,
      6: 1,
      3: 0
    };
    
    this.parametros_vitais = {
      pressao: {
        89: 4,
        76: 3,
        50: 2,
        1: 1,
        0: 0
      },
      respiracao: {
        29: 4,
        10: 3,
        6: 2,
        1: 1,
        0: 0
      }
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const glasgow = parseInt(dados.glasgow || 15);
      const pressaoSist = parseFloat(dados.pressao_sistolica || 0);
      const freqResp = parseInt(dados.frequencia_respiratoria || 0);
      const mecanismo = dados.mecanismo || "";
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const rtsScore = this.calcularRTS(glasgow, pressaoSist, freqResp);
      const gravidade = this.classificarGravidade(rtsScore, mecanismo);
      const prioridade = this.definirPrioridade(gravidade, glasgow);
      const tratamento = this.definirTratamentoInicial(peso, gravidade);
      const exames = this.definirExames(gravidade, mecanismo);
      
      return {
        rts_score: rtsScore,
        gravidade: gravidade,
        prioridade: prioridade,
        tratamento_inicial: tratamento,
        exames_necessarios: exames,
        observacoes: this.gerarObservacoes(gravidade, mecanismo)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private calcularRTS(glasgow: number, pressao: number, respiracao: number): number {
    const pontoGlasgow = this.obterPontuacao(glasgow, 'glasgow');
    const pontoPressao = this.obterPontuacao(pressao, 'pressao');
    const pontoRespiracao = this.obterPontuacao(respiracao, 'respiracao');
    
    return (pontoGlasgow * 0.9368) + (pontoPressao * 0.7326) + (pontoRespiracao * 0.2908);
  }
  
  private obterPontuacao(valor: number, tipo: string): number {
    if (tipo === 'glasgow') {
      if (valor >= 15) return 4;
      if (valor >= 13) return 3;
      if (valor >= 9) return 2;
      if (valor >= 6) return 1;
      return 0;
    }
    
    if (tipo === 'pressao') {
      if (valor > 89) return 4;
      if (valor >= 76) return 3;
      if (valor >= 50) return 2;
      if (valor >= 1) return 1;
      return 0;
    }
    
    if (tipo === 'respiracao') {
      if (valor >= 10 && valor <= 29) return 4;
      if (valor > 29) return 3;
      if (valor >= 6) return 2;
      if (valor >= 1) return 1;
      return 0;
    }
    
    return 0;
  }
  
  private classificarGravidade(rts: number, mecanismo: string): string {
    if (rts < 6.5) return "crítico";
    if (rts < 7.5 || mecanismo.includes("alta energia")) return "grave";
    if (rts < 8.5) return "moderado";
    return "leve";
  }
  
  private definirPrioridade(gravidade: string, glasgow: number): string {
    if (gravidade === "crítico" || glasgow < 9) return "vermelha";
    if (gravidade === "grave") return "amarela";
    if (gravidade === "moderado") return "verde";
    return "azul";
  }
  
  private definirTratamentoInicial(peso: number, gravidade: string): string[] {
    const tratamento = [
      "Via aérea com controle cervical",
      "Acesso venoso calibroso",
      "Oxigenoterapia"
    ];
    
    if (gravidade === "crítico" || gravidade === "grave") {
      const volumeSoro = Math.round(peso * 20);
      tratamento.push(`SF 0.9% ${volumeSoro} ml EV bolus`);
      tratamento.push("Controle de hemorragias");
    }
    
    if (gravidade === "crítico") {
      tratamento.push("Preparar para cirurgia urgente");
      tratamento.push("Hemoderivados se necessário");
    }
    
    return tratamento;
  }
  
  private definirExames(gravidade: string, mecanismo: string): string[] {
    const exames = ["Raio-X tórax", "Raio-X pelve"];
    
    if (gravidade === "grave" || gravidade === "crítico") {
      exames.push("TC crânio");
      exames.push("TC abdome");
      exames.push("FAST abdominal");
    }
    
    if (mecanismo.includes("queda") || mecanismo.includes("coluna")) {
      exames.push("TC coluna cervical");
    }
    
    return exames;
  }
  
  private gerarObservacoes(gravidade: string, mecanismo: string): string[] {
    const obs = [
      "Imobilização completa",
      "Monitorização contínua",
      "Reavaliar a cada 15 min"
    ];
    
    if (gravidade === "crítico") {
      obs.push("UTI pediátrica urgente");
      obs.push("Acionamento da equipe cirúrgica");
    }
    
    if (mecanismo.includes("alta energia")) {
      obs.push("Investigar lesões ocultas");
    }
    
    return obs;
  }
}

const controller = new PolitraumatismoController();
export default controller;
