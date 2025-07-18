// Conversão do controller de Crise Algica Anemia Falciforme para TypeScript
// Ajuste de tipos básicos para integração com o restante do app

export interface CriseAlgicaInputs {
  peso: number;
  idade_meses: number;
  intensidade_dor: number;
  localizacao: string;
  febre: boolean;
  saturacao: number;
}

export interface CriseAlgicaResults {
  gravidade: string;
  analgesicos: string[];
  hidratacao: string;
  internacao_necessaria: boolean;
  observacoes: string[];
}

class CriseAlgicaAnemiaFalciformeController {
  analgesicos: any;
  criterios_internacao: string[];
  
  constructor() {
    this.analgesicos = {
      leve: {
        paracetamol: "15 mg/kg/dose VO 6/6h",
        ibuprofeno: "10 mg/kg/dose VO 8/8h"
      },
      moderada: {
        dipirona: "15 mg/kg/dose EV 6/6h",
        tramadol: "1-2 mg/kg/dose EV 6/6h"
      },
      grave: {
        morfina: "0.1-0.2 mg/kg/dose EV 4/4h",
        ketamina: "0.5-1 mg/kg/dose EV"
      }
    };
    
    this.criterios_internacao = [
      "Dor intensa (≥7/10)",
      "Febre associada",
      "Saturação < 95%",
      "Sinais de sequestro esplênico",
      "Síndrome torácica aguda"
    ];
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const intensidadeDor = parseInt(dados.intensidade_dor || 0);
      const febre = dados.febre || false;
      const saturacao = parseFloat(dados.saturacao || 100);
      const localizacao = dados.localizacao || "";
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const gravidade = this.classificarGravidade(intensidadeDor, febre, saturacao, localizacao);
      const analgesicos = this.calcularAnalgesicos(peso, gravidade);
      const hidratacao = this.calcularHidratacao(peso);
      const internacao = this.avaliarInternacao(gravidade, febre, saturacao);
      
      return {
        gravidade: gravidade,
        analgesicos: analgesicos,
        hidratacao: hidratacao,
        internacao_necessaria: internacao,
        observacoes: this.gerarObservacoes(gravidade, localizacao, febre)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private classificarGravidade(intensidade: number, febre: boolean, saturacao: number, localizacao: string): string {
    if (intensidade >= 8 || saturacao < 95 || localizacao.includes("tórax")) {
      return "grave";
    }
    
    if (intensidade >= 5 || febre || intensidade >= 4) {
      return "moderada";
    }
    
    return "leve";
  }
  
  private calcularAnalgesicos(peso: number, gravidade: string): string[] {
    const medicamentos = [];
    
    if (gravidade === "leve") {
      const doseParacetamol = Math.round(peso * 15);
      medicamentos.push(`Paracetamol ${doseParacetamol} mg VO 6/6h`);
      
      const doseIbuprofeno = Math.round(peso * 10);
      medicamentos.push(`Ibuprofeno ${doseIbuprofeno} mg VO 8/8h`);
    }
    
    if (gravidade === "moderada") {
      const doseDipirona = Math.round(peso * 15);
      medicamentos.push(`Dipirona ${doseDipirona} mg EV 6/6h`);
      
      const doseTramadol = Math.round(peso * 1.5);
      medicamentos.push(`Tramadol ${doseTramadol} mg EV 6/6h`);
    }
    
    if (gravidade === "grave") {
      const doseMorfina = (peso * 0.15).toFixed(2);
      medicamentos.push(`Morfina ${doseMorfina} mg EV 4/4h`);
      
      const doseKetamina = (peso * 0.75).toFixed(2);
      medicamentos.push(`Cetamina ${doseKetamina} mg EV se necessário`);
    }
    
    return medicamentos;
  }
  
  private calcularHidratacao(peso: number): string {
    const volumeTotal = Math.round(peso * 1.5 * 24); // 1.5x manutenção
    const volumeHora = Math.round(volumeTotal / 24);
    
    return `SF 0.9% ${volumeHora} ml/h EV (${volumeTotal} ml/24h)`;
  }
  
  private avaliarInternacao(gravidade: string, febre: boolean, saturacao: number): boolean {
    return gravidade === "grave" || 
           (gravidade === "moderada" && febre) || 
           saturacao < 95;
  }
  
  private gerarObservacoes(gravidade: string, localizacao: string, febre: boolean): string[] {
    const obs = [
      "Hidratação vigorosa",
      "Analgesia regular",
      "Evitar frio e desidratação"
    ];
    
    if (gravidade === "grave") {
      obs.push("UTI pediátrica");
      obs.push("Monitorização contínua");
    }
    
    if (localizacao.includes("tórax")) {
      obs.push("Investigar síndrome torácica aguda");
      obs.push("Gasometria arterial");
    }
    
    if (febre) {
      obs.push("Investigar foco infeccioso");
      obs.push("Hemocultura e antibioticoterapia");
    }
    
    obs.push("Contato com hematologia");
    
    return obs;
  }
}

const controller = new CriseAlgicaAnemiaFalciformeController();
export default controller;
