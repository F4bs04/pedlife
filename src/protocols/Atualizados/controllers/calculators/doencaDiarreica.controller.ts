// Conversão do controller de Doença Diarreica para TypeScript

export interface DoencaDiarreicaInputs {
  peso: number;
  idade_meses: number;
  duracao_dias: number;
  consistencia: string;
  frequencia_24h: number;
  sangue: boolean;
  febre: boolean;
  vomito: boolean;
  desidratacao: string;
}

export interface DoencaDiarreicaResults {
  classificacao: string;
  gravidade_desidratacao: string;
  plano_reidratacao: any;
  medicamentos: string[];
  alimentacao: string;
  sinais_alarme: string[];
  observacoes: string[];
}

class DoencaDiarreicaController {
  planos_reidratacao: any;
  medicamentos: any;
  
  constructor() {
    this.planos_reidratacao = {
      A: "Sem desidratação - SRO preventivo",
      B: "Desidratação leve/moderada - SRO 75ml/kg em 4h",
      C: "Desidratação grave - Soro EV"
    };
    
    this.medicamentos = {
      zinco: {
        "2-6": "10 mg/dia por 14 dias",
        ">6": "20 mg/dia por 14 dias"
      },
      probiotico: "Saccharomyces boulardii",
      antibiotico: "Apenas em casos específicos"
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const duracao = parseInt(dados.duracao_dias || 0);
      const frequencia = parseInt(dados.frequencia_24h || 0);
      const sangue = dados.sangue || false;
      const febre = dados.febre || false;
      const vomito = dados.vomito || false;
      const desidratacao = dados.desidratacao || "sem";
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const classificacao = this.classificarDiarreia(duracao, sangue, febre);
      const gravidadeDesidratacao = this.avaliarDesidratacao(desidratacao, peso);
      const planoReidratacao = this.definirPlanoReidratacao(peso, gravidadeDesidratacao);
      const medicamentos = this.definirMedicamentos(idade, classificacao, sangue);
      const alimentacao = this.orientarAlimentacao(idade, vomito);
      const sinaisAlarme = this.definirSinaisAlarme();
      
      return {
        classificacao: classificacao,
        gravidade_desidratacao: gravidadeDesidratacao,
        plano_reidratacao: planoReidratacao,
        medicamentos: medicamentos,
        alimentacao: alimentacao,
        sinais_alarme: sinaisAlarme,
        observacoes: this.gerarObservacoes(classificacao, gravidadeDesidratacao)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private classificarDiarreia(duracao: number, sangue: boolean, febre: boolean): string {
    if (sangue) return "disenteria";
    if (duracao >= 14) return "persistente";
    if (febre) return "aguda febril";
    return "aguda não febril";
  }
  
  private avaliarDesidratacao(tipo: string, peso: number): string {
    switch (tipo) {
      case "sem": return "sem desidratação";
      case "leve": return "desidratação leve (3-5%)";
      case "moderada": return "desidratação moderada (6-9%)";
      case "grave": return "desidratação grave (>10%)";
      default: return "sem desidratação";
    }
  }
  
  private definirPlanoReidratacao(peso: number, gravidade: string): any {
    if (gravidade.includes("sem")) {
      return {
        plano: "A",
        volume: Math.round(peso * 10),
        via: "VO após cada evacuação",
        observacao: "SRO preventivo"
      };
    }
    
    if (gravidade.includes("leve") || gravidade.includes("moderada")) {
      const volume = Math.round(peso * 75);
      return {
        plano: "B",
        volume: volume,
        via: "VO em 4 horas",
        observacao: `${Math.round(volume/4)} ml a cada 15 min`
      };
    }
    
    // Desidratação grave
    const volumeExpansao = Math.round(peso * 100);
    const volumeManutencao = Math.round(peso * 100);
    
    return {
      plano: "C",
      expansao: `SF 0.9% ${volumeExpansao} ml EV em 1h`,
      manutencao: `SG 5% + NaCl 0.3% ${volumeManutencao} ml EV em 5h`,
      observacao: "Reidratação venosa urgente"
    };
  }
  
  private definirMedicamentos(idade: number, classificacao: string, sangue: boolean): string[] {
    const medicamentos = [];
    
    // Zinco sempre indicado
    if (idade <= 6) {
      medicamentos.push("Zinco 10 mg VO 1x/dia por 14 dias");
    } else {
      medicamentos.push("Zinco 20 mg VO 1x/dia por 14 dias");
    }
    
    // Probiótico
    medicamentos.push("Saccharomyces boulardii 5-10 bilhões UFC/dia");
    
    // Antibiótico apenas em casos específicos
    if (sangue || classificacao === "disenteria") {
      if (idade >= 2) {
        medicamentos.push("Considerar: Azitromicina 10 mg/kg/dia por 3 dias");
      } else {
        medicamentos.push("Azitromicina 10 mg/kg/dia por 5 dias");
      }
    }
    
    return medicamentos;
  }
  
  private orientarAlimentacao(idade: number, vomito: boolean): string {
    if (vomito) {
      return "Dieta zero por 2-4h, depois reintroduzir gradualmente";
    }
    
    if (idade < 6) {
      return "Manter aleitamento materno + introdução alimentar habitual";
    }
    
    return "Dieta normal para idade, evitar açúcares e gorduras";
  }
  
  private definirSinaisAlarme(): string[] {
    return [
      "Sede intensa",
      "Olhos fundos",
      "Sinal da prega positivo",
      "Fontanela deprimida (lactentes)",
      "Oligúria",
      "Letargia/irritabilidade",
      "Vômitos persistentes",
      "Febre alta",
      "Sangue nas fezes aumentando"
    ];
  }
  
  private gerarObservacoes(classificacao: string, desidratacao: string): string[] {
    const obs = [
      "Retorno se piora ou não melhora em 48h",
      "Continuar SRO durante todo episódio",
      "Higiene rigorosa das mãos"
    ];
    
    if (classificacao === "disenteria") {
      obs.push("Investigar causa bacteriana");
      obs.push("Coprocultura se disponível");
    }
    
    if (desidratacao.includes("grave")) {
      obs.push("Internação hospitalar");
      obs.push("Monitorização rigorosa");
    }
    
    if (classificacao === "persistente") {
      obs.push("Investigar causas secundárias");
      obs.push("Avaliação nutricional");
    }
    
    return obs;
  }
}

const controller = new DoencaDiarreicaController();
export default controller;
