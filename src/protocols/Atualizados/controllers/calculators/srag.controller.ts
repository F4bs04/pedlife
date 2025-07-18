// Conversão do controller de SRAG para TypeScript

export interface SragInputs {
  peso: number;
  idade_meses: number;
  saturacao: number;
  frequencia_respiratoria: number;
  retracao: boolean;
  febre: boolean;
  tosse: boolean;
  dispneia: boolean;
}

export interface SragResults {
  gravidade: string;
  internacao_necessaria: boolean;
  oxigenoterapia: any;
  tratamento: string[];
  isolamento: string;
  observacoes: string[];
}

class SragController {
  criterios_srag: any;
  parametros_respiratorios: any;
  
  constructor() {
    this.criterios_srag = {
      sindrome_gripal: ["Febre", "Tosse", "Dor de garganta"],
      dispneia: "Dificuldade respiratória",
      saturacao: "SpO2 < 95%",
      taquipneia: "FR aumentada para idade"
    };
    
    this.parametros_respiratorios = {
      "0-2": { fr_normal: 60, fr_taquipneia: 70 },
      "2-12": { fr_normal: 50, fr_taquipneia: 60 },
      "12-24": { fr_normal: 40, fr_taquipneia: 50 },
      "24-60": { fr_normal: 30, fr_taquipneia: 40 }
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const saturacao = parseFloat(dados.saturacao || 100);
      const frequenciaResp = parseInt(dados.frequencia_respiratoria || 0);
      const retracao = dados.retracao || false;
      const febre = dados.febre || false;
      const tosse = dados.tosse || false;
      const dispneia = dados.dispneia || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const gravidade = this.classificarGravidade(idade, saturacao, frequenciaResp, retracao, dispneia);
      const internacao = this.avaliarInternacao(gravidade, saturacao, idade);
      const oxigenoterapia = this.calcularOxigenoterapia(peso, saturacao, gravidade);
      const tratamento = this.definirTratamento(peso, gravidade, febre);
      const isolamento = this.definirIsolamento();
      
      return {
        gravidade: gravidade,
        internacao_necessaria: internacao,
        oxigenoterapia: oxigenoterapia,
        tratamento: tratamento,
        isolamento: isolamento,
        observacoes: this.gerarObservacoes(gravidade, saturacao)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private classificarGravidade(idade: number, saturacao: number, fr: number, retracao: boolean, dispneia: boolean): string {
    let pontos = 0;
    
    if (saturacao < 90) pontos += 3;
    else if (saturacao < 95) pontos += 2;
    else if (saturacao < 97) pontos += 1;
    
    const frLimite = this.obterFrLimite(idade);
    if (fr > frLimite.taquipneia) pontos += 2;
    else if (fr > frLimite.fr_normal) pontos += 1;
    
    if (retracao) pontos += 2;
    if (dispneia) pontos += 1;
    
    if (pontos >= 6) return "crítica";
    if (pontos >= 4) return "grave";
    if (pontos >= 2) return "moderada";
    return "leve";
  }
  
  private obterFrLimite(idade: number): any {
    if (idade <= 2) return this.parametros_respiratorios["0-2"];
    if (idade <= 12) return this.parametros_respiratorios["2-12"];
    if (idade <= 24) return this.parametros_respiratorios["12-24"];
    return this.parametros_respiratorios["24-60"];
  }
  
  private avaliarInternacao(gravidade: string, saturacao: number, idade: number): boolean {
    return gravidade === "grave" || 
           gravidade === "crítica" || 
           saturacao < 95 || 
           idade < 3;
  }
  
  private calcularOxigenoterapia(peso: number, saturacao: number, gravidade: string): any {
    if (saturacao >= 95) {
      return { necessaria: false };
    }
    
    let fluxo: number | string = 0;
    let dispositivo = "";
    
    if (saturacao >= 90) {
      fluxo = Math.round(peso * 0.5);
      dispositivo = "Cateter nasal";
    } else if (saturacao >= 85) {
      fluxo = Math.round(peso * 1);
      dispositivo = "Máscara simples";
    } else {
      fluxo = Math.round(peso * 2);
      dispositivo = "Máscara com reservatório";
    }
    
    if (gravidade === "crítica") {
      dispositivo = "VNI ou IOT + VM";
      fluxo = "Conforme protocolo ventilatório";
    }
    
    return {
      necessaria: true,
      dispositivo: dispositivo,
      fluxo: fluxo,
      meta_saturacao: "≥95%"
    };
  }
  
  private definirTratamento(peso: number, gravidade: string, febre: boolean): string[] {
    const tratamento = [
      "Isolamento respiratório",
      "Coleta de swab nasofaríngeo"
    ];
    
    if (febre) {
      const doseParacetamol = Math.round(peso * 15);
      tratamento.push(`Paracetamol ${doseParacetamol} mg VO 6/6h`);
    }
    
    if (gravidade === "grave" || gravidade === "crítica") {
      tratamento.push("Corticoide: Dexametasona 0.15 mg/kg/dia");
      tratamento.push("Monitorização contínua");
    }
    
    if (gravidade === "crítica") {
      tratamento.push("Suporte ventilatório");
      tratamento.push("Acesso venoso central");
      tratamento.push("Considerar ECMO");
    }
    
    return tratamento;
  }
  
  private definirIsolamento(): string {
    return "Precauções de gotículas + contato até exclusão COVID-19";
  }
  
  private gerarObservacoes(gravidade: string, saturacao: number): string[] {
    const obs = [
      "Notificação compulsória",
      "Monitorizar saturação contínua",
      "Posicionamento prono se indicado"
    ];
    
    if (gravidade === "crítica") {
      obs.push("UTI pediátrica");
      obs.push("Equipe multidisciplinar");
    }
    
    if (saturacao < 90) {
      obs.push("Oxigenoterapia urgente");
      obs.push("Gasometria arterial");
    }
    
    obs.push("Investigar outros patógenos respiratórios");
    obs.push("Seguimento ambulatorial pós-alta");
    
    return obs;
  }
}

const controller = new SragController();
export default controller;
