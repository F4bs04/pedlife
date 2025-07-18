// Conversão do controller de SIMP para TypeScript

export interface SimPInputs {
  peso: number;
  idade_meses: number;
  febre_duracao: number;
  sintomas_cardiovasculares: boolean;
  sintomas_gastrointestinais: boolean;
  sintomas_neurologicos: boolean;
  exantema: boolean;
  conjuntivite: boolean;
}

export interface SimPResults {
  probabilidade_simp: string;
  gravidade: string;
  tratamento: string[];
  exames_necessarios: string[];
  internacao_necessaria: boolean;
  observacoes: string[];
}

class SimPController {
  criterios_diagnosticos: any;
  medicamentos: any;
  
  constructor() {
    this.criterios_diagnosticos = {
      febre: "≥38°C por ≥24h",
      laboratorio: ["PCR elevada", "VHS elevada", "Ferritina elevada"],
      sistemas: {
        cardiovascular: ["Choque", "Disfunção miocárdica", "Derrame pericárdico"],
        gastrointestinal: ["Diarreia", "Vômitos", "Dor abdominal"],
        neurologico: ["Alteração consciência", "Convulsões", "Irritabilidade"],
        mucocutaneo: ["Exantema", "Conjuntivite", "Alterações mucosas"]
      }
    };
    
    this.medicamentos = {
      imunoglobulina: "2 g/kg/dose EV",
      corticoide: "Metilprednisolona 2 mg/kg/dia",
      aspirina: "3-5 mg/kg/dia",
      anticoagulacao: "Enoxaparina 1 mg/kg 12/12h"
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const febreDuracao = parseInt(dados.febre_duracao || 0);
      const cardiovascular = dados.sintomas_cardiovasculares || false;
      const gastrointestinal = dados.sintomas_gastrointestinais || false;
      const neurologico = dados.sintomas_neurologicos || false;
      const exantema = dados.exantema || false;
      const conjuntivite = dados.conjuntivite || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const probabilidade = this.calcularProbabilidade(febreDuracao, cardiovascular, gastrointestinal, neurologico, exantema, conjuntivite);
      const gravidade = this.classificarGravidade(cardiovascular, neurologico);
      const tratamento = this.definirTratamento(peso, probabilidade, gravidade);
      const exames = this.definirExames(probabilidade);
      const internacao = this.avaliarInternacao(probabilidade, gravidade);
      
      return {
        probabilidade_simp: probabilidade,
        gravidade: gravidade,
        tratamento: tratamento,
        exames_necessarios: exames,
        internacao_necessaria: internacao,
        observacoes: this.gerarObservacoes(probabilidade, gravidade)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private calcularProbabilidade(febre: number, cardio: boolean, gi: boolean, neuro: boolean, exantema: boolean, conjuntivite: boolean): string {
    let pontos = 0;
    
    if (febre >= 1) pontos += 2; // Febre obrigatória
    if (cardio) pontos += 2;
    if (gi) pontos += 1;
    if (neuro) pontos += 1;
    if (exantema) pontos += 1;
    if (conjuntivite) pontos += 1;
    
    if (pontos >= 6) return "alta";
    if (pontos >= 4) return "moderada";
    if (pontos >= 2) return "baixa";
    return "improvável";
  }
  
  private classificarGravidade(cardiovascular: boolean, neurologico: boolean): string {
    if (cardiovascular && neurologico) return "crítica";
    if (cardiovascular || neurologico) return "grave";
    return "moderada";
  }
  
  private definirTratamento(peso: number, probabilidade: string, gravidade: string): string[] {
    const tratamento = [];
    
    if (probabilidade === "alta" || probabilidade === "moderada") {
      const doseIGEV = Math.round(peso * 2);
      tratamento.push(`Imunoglobulina EV ${doseIGEV} g dose única`);
      
      const doseMetilpred = Math.round(peso * 2);
      tratamento.push(`Metilprednisolona ${doseMetilpred} mg/dia EV`);
    }
    
    if (gravidade === "grave" || gravidade === "crítica") {
      const doseAspirina = Math.round(peso * 4);
      tratamento.push(`AAS ${doseAspirina} mg/dia VO`);
      
      if (peso > 10) {
        const doseEnoxaparina = Math.round(peso * 1);
        tratamento.push(`Enoxaparina ${doseEnoxaparina} mg 12/12h SC`);
      }
    }
    
    if (gravidade === "crítica") {
      tratamento.push("Suporte intensivo");
      tratamento.push("Considerar plasmaférese");
    }
    
    return tratamento;
  }
  
  private definirExames(probabilidade: string): string[] {
    const exames = [
      "Hemograma completo",
      "PCR, VHS",
      "Ferritina, D-dímero"
    ];
    
    if (probabilidade === "alta" || probabilidade === "moderada") {
      exames.push("Ecocardiograma");
      exames.push("Troponina, BNP");
      exames.push("Função hepática");
      exames.push("Função renal");
      exames.push("RT-PCR COVID-19");
      exames.push("Sorologia COVID-19");
    }
    
    return exames;
  }
  
  private avaliarInternacao(probabilidade: string, gravidade: string): boolean {
    return probabilidade === "alta" || 
           probabilidade === "moderada" || 
           gravidade === "grave" || 
           gravidade === "crítica";
  }
  
  private gerarObservacoes(probabilidade: string, gravidade: string): string[] {
    const obs = [
      "Monitorização cardíaca contínua",
      "Controle rigoroso balanço hídrico",
      "Avaliação cardiológica"
    ];
    
    if (probabilidade === "alta") {
      obs.push("Notificação compulsória");
      obs.push("Isolamento de contato");
    }
    
    if (gravidade === "crítica") {
      obs.push("UTI pediátrica");
      obs.push("Suporte inotrópico se necessário");
    }
    
    obs.push("Reavaliação a cada 6h");
    obs.push("Seguimento cardiológico pós-alta");
    
    return obs;
  }
}

const controller = new SimPController();
export default controller;
