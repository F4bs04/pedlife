// Conversão do controller de Parada Cardiorrespiratória para TypeScript

export interface ParadaCardiorrespiratoriaInputs {
  peso: number;
  idade_meses: number;
  ritmo: string;
  tempo_parada: number;
  via_aerea_obtida: boolean;
}

export interface ParadaCardiorrespiratoriaResults {
  protocolo_rcp: string;
  medicamentos: string[];
  desfibrilacao: any;
  prognostico: string;
  observacoes: string[];
}

class ParadaCardiorrespiratoriaController {
  medicamentos_rcp: any;
  energia_desfibrilacao: any;
  
  constructor() {
    this.medicamentos_rcp = {
      adrenalina: {
        dose: "0.01 mg/kg",
        via: "EV/IO",
        intervalo: "3-5 min"
      },
      amiodarona: {
        dose: "5 mg/kg",
        via: "EV",
        indicacao: "FV/TV refratária"
      },
      atropina: {
        dose: "0.02 mg/kg",
        via: "EV",
        min: "0.1 mg",
        max: "0.5 mg"
      }
    };
    
    this.energia_desfibrilacao = {
      inicial: "2 J/kg",
      subsequente: "4 J/kg"
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const ritmo = dados.ritmo || "";
      const tempoParada = parseInt(dados.tempo_parada || 0);
      const viaAerea = dados.via_aerea_obtida || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const protocoloRcp = this.definirProtocolo(idade, viaAerea);
      const medicamentos = this.calcularMedicamentos(peso, ritmo);
      const desfibrilacao = this.calcularEnergia(peso, ritmo);
      const prognostico = this.avaliarPrognostico(tempoParada, idade);
      
      return {
        protocolo_rcp: protocoloRcp,
        medicamentos: medicamentos,
        desfibrilacao: desfibrilacao,
        prognostico: prognostico,
        observacoes: this.gerarObservacoes(ritmo, tempoParada)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private definirProtocolo(idade: number, viaAerea: boolean): string {
    if (idade < 12) {
      return viaAerea ? "RCP lactente com VA" : "RCP lactente sem VA";
    } else {
      return viaAerea ? "RCP criança com VA" : "RCP criança sem VA";
    }
  }
  
  private calcularMedicamentos(peso: number, ritmo: string): string[] {
    const medicamentos = [];
    
    // Adrenalina sempre indicada
    const doseAdrenalina = (peso * 0.01).toFixed(2);
    medicamentos.push(`Adrenalina ${doseAdrenalina} mg EV/IO a cada 3-5 min`);
    
    // Amiodarona para FV/TV
    if (ritmo === "FV" || ritmo === "TV") {
      const doseAmiodarona = Math.round(peso * 5);
      medicamentos.push(`Amiodarona ${doseAmiodarona} mg EV em FV/TV refratária`);
    }
    
    // Atropina para bradicardia
    if (ritmo === "bradicardia") {
      const doseAtropina = Math.max(0.1, Math.min(0.5, peso * 0.02));
      medicamentos.push(`Atropina ${doseAtropina.toFixed(2)} mg EV`);
    }
    
    return medicamentos;
  }
  
  private calcularEnergia(peso: number, ritmo: string): any {
    if (ritmo !== "FV" && ritmo !== "TV") {
      return { indicada: false };
    }
    
    return {
      indicada: true,
      inicial: Math.round(peso * 2),
      subsequente: Math.round(peso * 4),
      unidade: "Joules"
    };
  }
  
  private avaliarPrognostico(tempoParada: number, idade: number): string {
    if (tempoParada > 30) return "Reservado";
    if (tempoParada > 15) return "Limitado";
    if (idade < 1 && tempoParada > 10) return "Limitado";
    return "Favorável se RCE";
  }
  
  private gerarObservacoes(ritmo: string, tempoParada: number): string[] {
    const obs = [
      "Compressões contínuas 100-120/min",
      "Ventilações 10-12/min após via aérea",
      "Minimizar interrupções"
    ];
    
    if (ritmo === "assistolia" && tempoParada > 20) {
      obs.push("Considerar suspensão das manobras");
    }
    
    if (ritmo === "FV" || ritmo === "TV") {
      obs.push("Desfibrilação prioritária");
    }
    
    return obs;
  }
}

const controller = new ParadaCardiorrespiratoriaController();
export default controller;
