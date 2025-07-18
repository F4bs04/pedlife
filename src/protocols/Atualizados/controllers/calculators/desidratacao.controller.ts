// Controller de Desidratação para TypeScript

export interface DesidratacaoInputs {
  peso: number;
  idade_meses: number;
  grau_desidratacao: string;
  vomitos: boolean;
  choque: boolean;
  capacidade_oral: boolean;
}

export interface DesidratacaoResults {
  classificacao: string;
  deficit_hidrico: number;
  necessidade_basal: number;
  plano_hidratacao: any;
  solucoes: string[];
  observacoes: string[];
}

class DesidratacaoController {
  classificacao_desidratacao: any;
  solucoes_hidratacao: any;
  
  constructor() {
    this.classificacao_desidratacao = {
      leve: {
        percentual: "3-5%",
        sinais: ["Sede aumentada", "Mucosas secas", "Turgor normal"],
        deficit: 50 // mL/kg
      },
      moderada: {
        percentual: "6-9%",
        sinais: ["Sede intensa", "Olhos fundos", "Turgor diminuído"],
        deficit: 100 // mL/kg
      },
      grave: {
        percentual: ">10%",
        sinais: ["Letargia", "Choque", "Anúria"],
        deficit: 150 // mL/kg
      }
    };
    
    this.solucoes_hidratacao = {
      sro: {
        nome: "Soro de Reidratação Oral",
        composicao: "Na+ 75 mEq/L, K+ 20 mEq/L, Glicose 75 mmol/L",
        indicacao: "Desidratação leve/moderada sem vômitos"
      },
      sf: {
        nome: "Soro Fisiológico 0.9%",
        composicao: "NaCl 154 mEq/L",
        indicacao: "Expansão volêmica, choque"
      },
      sg_sf: {
        nome: "SG 5% + SF 0.45%",
        composicao: "Glicose 5% + NaCl 77 mEq/L",
        indicacao: "Manutenção após correção"
      }
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const grau = dados.grau_desidratacao || "leve";
      const vomitos = dados.vomitos || false;
      const choque = dados.choque || false;
      const capacidadeOral = dados.capacidade_oral || true;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const classificacao = this.obterClassificacao(grau);
      const deficitHidrico = this.calcularDeficit(peso, grau);
      const necessidadeBasal = this.calcularNecessidadeBasal(peso);
      const planoHidratacao = this.definirPlanoHidratacao(peso, grau, vomitos, choque, capacidadeOral);
      const solucoes = this.definirSolucoes(grau, choque, capacidadeOral);
      
      return {
        classificacao: classificacao,
        deficit_hidrico: deficitHidrico,
        necessidade_basal: necessidadeBasal,
        plano_hidratacao: planoHidratacao,
        solucoes: solucoes,
        observacoes: this.gerarObservacoes(grau, choque, vomitos)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private obterClassificacao(grau: string): string {
    const info = this.classificacao_desidratacao[grau];
    if (!info) return "Classificação indefinida";
    
    return `Desidratação ${grau} (${info.percentual})`;
  }
  
  private calcularDeficit(peso: number, grau: string): number {
    const info = this.classificacao_desidratacao[grau];
    if (!info) return 0;
    
    return Math.round(peso * info.deficit);
  }
  
  private calcularNecessidadeBasal(peso: number): number {
    if (peso <= 10) {
      return peso * 100;
    } else if (peso <= 20) {
      return 1000 + ((peso - 10) * 50);
    } else {
      return 1500 + ((peso - 20) * 20);
    }
  }
  
  private definirPlanoHidratacao(peso: number, grau: string, vomitos: boolean, choque: boolean, capacidadeOral: boolean): any {
    const deficit = this.calcularDeficit(peso, grau);
    const basal = this.calcularNecessidadeBasal(peso);
    
    if (choque || grau === "grave") {
      return {
        fase: "Expansão + Manutenção",
        expansao: {
          solucao: "SF 0.9%",
          volume: Math.round(peso * 20),
          tempo: "20-30 min",
          observacao: "Repetir se necessário"
        },
        manutencao: {
          solucao: "SG 5% + SF 0.45% + KCl",
          volume: Math.round(deficit + basal),
          tempo: "24 horas",
          gotejamento: Math.round((deficit + basal) / 24)
        }
      };
    }
    
    if (grau === "moderada" && !vomitos && capacidadeOral) {
      return {
        fase: "Reidratação Oral",
        volume_sro: Math.round(peso * 75),
        tempo: "4-6 horas",
        administracao: "5-10 ml a cada 5-10 min",
        observacao: "Se vômitos, considerar via EV"
      };
    }
    
    if (grau === "moderada" && (vomitos || !capacidadeOral)) {
      return {
        fase: "Reidratação Venosa",
        solucao: "SG 5% + SF 0.45% + KCl",
        volume: Math.round(deficit + basal),
        tempo: "8-12 horas",
        gotejamento: Math.round((deficit + basal) / 10)
      };
    }
    
    // Desidratação leve
    return {
      fase: "Prevenção + SRO",
      volume_sro: Math.round(peso * 50),
      administracao: "Após cada evacuação líquida",
      observacao: "Manter alimentação normal"
    };
  }
  
  private definirSolucoes(grau: string, choque: boolean, capacidadeOral: boolean): string[] {
    const solucoes = [];
    
    if (choque || grau === "grave") {
      solucoes.push("SF 0.9% para expansão");
      solucoes.push("SG 5% + SF 0.45% + KCl 20 mEq/L para manutenção");
    } else if (grau === "moderada") {
      if (capacidadeOral) {
        solucoes.push("SRO (Soro de Reidratação Oral)");
      } else {
        solucoes.push("SG 5% + SF 0.45% + KCl 20 mEq/L EV");
      }
    } else {
      solucoes.push("SRO preventivo");
    }
    
    return solucoes;
  }
  
  private gerarObservacoes(grau: string, choque: boolean, vomitos: boolean): string[] {
    const obs = [
      "Monitorar diurese (meta: 1-2 ml/kg/h)",
      "Controlar balanço hídrico",
      "Verificar sinais vitais regularmente"
    ];
    
    if (choque) {
      obs.push("UTI pediátrica");
      obs.push("Monitorização cardíaca contínua");
      obs.push("Acesso venoso central se necessário");
    }
    
    if (grau === "grave") {
      obs.push("Correção lenta para evitar edema cerebral");
      obs.push("Avaliar eletrólitos a cada 6h");
    }
    
    if (vomitos) {
      obs.push("Considerar antieméticos");
      obs.push("Via EV preferencial");
    }
    
    obs.push("Adicionar K+ apenas após normalização da diurese");
    obs.push("Reavaliar hidratação a cada 2-4h");
    
    return obs;
  }
}

const controller = new DesidratacaoController();
export default controller;
