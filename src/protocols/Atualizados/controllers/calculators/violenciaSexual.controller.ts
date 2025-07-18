// Conversão do controller de Violência Sexual para TypeScript

export interface ViolenciaSexualInputs {
  peso: number;
  idade_meses: number;
  sexo: string;
  tempo_horas: number;
  contato_penetrativo: boolean;
  lesoes_genitais: boolean;
  menarca: boolean;
}

export interface ViolenciaSexualResults {
  profilaxia_ist: string[];
  profilaxia_hiv: string[];
  contraceptivo_emergencia: any;
  coletas_necessarias: string[];
  notificacao: string;
  observacoes: string[];
}

class ViolenciaSexualController {
  profilaxias: any;
  contraceptivo: any;
  
  constructor() {
    this.profilaxias = {
      ist: {
        clamydia: "Azitromicina 20 mg/kg dose única",
        gonorreia: "Ceftriaxone 125 mg IM dose única",
        trichomonas: "Metronidazol 15 mg/kg/dia 7 dias",
        sifilis: "Penicilina G benzatina 50.000 UI/kg IM"
      },
      hiv: {
        zidovudina: "240 mg/m²/dose 12/12h",
        lamivudina: "4 mg/kg/dose 12/12h",
        lopinavir: "300 mg/m²/dose 12/12h"
      }
    };
    
    this.contraceptivo = {
      levonorgestrel: "1.5 mg VO dose única",
      idade_minima: 10 // anos
    };
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_meses || 12);
      const sexo = dados.sexo || "";
      const tempoHoras = parseInt(dados.tempo_horas || 0);
      const penetrativo = dados.contato_penetrativo || false;
      const lesoesGenitais = dados.lesoes_genitais || false;
      const menarca = dados.menarca || false;
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado");
      }
      
      const profilaxiaIst = this.calcularProfilaxiaIST(peso, penetrativo, tempoHoras);
      const profilaxiaHiv = this.calcularProfilaxiaHIV(peso, penetrativo, tempoHoras);
      const contraceptivo = this.avaliarContraceptivo(idade, sexo, menarca, tempoHoras);
      const coletas = this.definirColetas(tempoHoras, penetrativo);
      
      return {
        profilaxia_ist: profilaxiaIst,
        profilaxia_hiv: profilaxiaHiv,
        contraceptivo_emergencia: contraceptivo,
        coletas_necessarias: coletas,
        notificacao: "Notificação compulsória obrigatória",
        observacoes: this.gerarObservacoes(idade, tempoHoras, lesoesGenitais)
      };
    } catch (error: any) {
      throw new Error(`Erro no cálculo: ${error.message}`);
    }
  }
  
  private calcularProfilaxiaIST(peso: number, penetrativo: boolean, tempo: number): string[] {
    if (!penetrativo || tempo > 72) {
      return ["Profilaxia IST não indicada por tempo ou tipo de contato"];
    }
    
    const profilaxia = [];
    
    // Clamídia e gonorreia
    const doseAzitromicina = Math.min(1000, peso * 20);
    profilaxia.push(`Azitromicina ${doseAzitromicina} mg VO dose única`);
    
    if (peso >= 45) {
      profilaxia.push("Ceftriaxone 250 mg IM dose única");
    } else {
      profilaxia.push("Ceftriaxone 125 mg IM dose única");
    }
    
    // Tricomoníase
    const doseMetronidazol = Math.round(peso * 15);
    profilaxia.push(`Metronidazol ${doseMetronidazol} mg VO 12/12h por 7 dias`);
    
    return profilaxia;
  }
  
  private calcularProfilaxiaHIV(peso: number, penetrativo: boolean, tempo: number): string[] {
    if (!penetrativo || tempo > 72) {
      return ["Profilaxia HIV não indicada por tempo ou risco"];
    }
    
    const superficieCorporal = Math.sqrt((peso * 100) / 3600); // m²
    
    const profilaxia = [
      `Zidovudina ${Math.round(240 * superficieCorporal)} mg VO 12/12h`,
      `Lamivudina ${Math.round(peso * 4)} mg VO 12/12h`,
      `Lopinavir/ritonavir ${Math.round(300 * superficieCorporal)} mg VO 12/12h`
    ];
    
    profilaxia.push("Duração: 28 dias");
    
    return profilaxia;
  }
  
  private avaliarContraceptivo(idade: number, sexo: string, menarca: boolean, tempo: number): any {
    const idadeAnos = idade / 12;
    
    if (sexo !== "feminino" || idadeAnos < 10 || !menarca || tempo > 120) {
      return {
        indicado: false,
        motivo: sexo !== "feminino" ? "Sexo masculino" : 
                idadeAnos < 10 ? "Idade < 10 anos" :
                !menarca ? "Pré-menarca" : "Tempo > 120h"
      };
    }
    
    return {
      indicado: true,
      medicamento: "Levonorgestrel 1.5 mg VO dose única",
      orientacoes: "Administrar o mais precocemente possível"
    };
  }
  
  private definirColetas(tempo: number, penetrativo: boolean): string[] {
    const coletas = [
      "Hemograma, bioquímica",
      "Sorologias: HIV, Hepatite B/C, Sífilis"
    ];
    
    if (penetrativo && tempo <= 72) {
      coletas.push("Swab vaginal/anal para DNA");
      coletas.push("Swab oral se contato oral");
      coletas.push("Cultura para gonorreia/clamídia");
    }
    
    coletas.push("Beta-HCG (se menarca)");
    
    return coletas;
  }
  
  private gerarObservacoes(idade: number, tempo: number, lesoes: boolean): string[] {
    const obs = [
      "Notificação ao Conselho Tutelar",
      "Boletim de Ocorrência",
      "Suporte psicológico/psiquiátrico",
      "Acompanhamento ambulatorial"
    ];
    
    if (idade < 12) {
      obs.push("Prioridade absoluta - criança");
    }
    
    if (tempo <= 72) {
      obs.push("Janela terapêutica para profilaxias");
    } else {
      obs.push("Fora da janela para profilaxias");
    }
    
    if (lesoes) {
      obs.push("Documentação fotográfica das lesões");
      obs.push("Avaliação ginecológica especializada");
    }
    
    obs.push("Seguimento em 2, 6 e 12 semanas");
    obs.push("Reavaliação sorológica em 3 e 6 meses");
    
    return obs;
  }
}

const controller = new ViolenciaSexualController();
export default controller;
