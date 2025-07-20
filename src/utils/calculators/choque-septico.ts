import { 
  ChoqueSepticoInput, 
  ChoqueSepticoResult,
  VitalSignsAssessment,
  VolumeExpansion,
  AntibioticScheme,
  VasoactiveDrug,
  CausaReversivel,
  ChoqueSepticoRecommendation
} from '../../types/protocol-calculators';

export class ChoqueSepticoCalculator {
  private parametrosNormais = {
    fc: {
      "0-1m": { min: 100, max: 160 },
      "1-12m": { min: 100, max: 160 },
      "1-2a": { min: 90, max: 150 },
      "2-5a": { min: 80, max: 140 },
      "5-12a": { min: 70, max: 120 },
      "12-18a": { min: 60, max: 100 }
    },
    fr: {
      "0-1m": { min: 30, max: 60 },
      "1-12m": { min: 25, max: 40 },
      "1-2a": { min: 20, max: 30 },
      "2-5a": { min: 18, max: 25 },
      "5-12a": { min: 15, max: 20 },
      "12-18a": { min: 12, max: 18 }
    }
  };

  private drogasVasoativas: Omit<VasoactiveDrug, 'prioridade' | 'preparacao' | 'doseInicialMl'>[] = [
    {
      nome: "Adrenalina",
      doseInicial: "0.05-0.1 mcg/kg/min",
      doseMax: "1.0 mcg/kg/min",
      efeito: "Inotrópico e vasoconstritor (alfa e beta)",
      indicacao: "Choque frio com resistência vascular aumentada"
    },
    {
      nome: "Noradrenalina",
      doseInicial: "0.05-0.1 mcg/kg/min",
      doseMax: "1.0 mcg/kg/min",
      efeito: "Vasoconstritora predominante (alfa)",
      indicacao: "Choque quente com resistência vascular diminuída"
    },
    {
      nome: "Dobutamina",
      doseInicial: "5 mcg/kg/min",
      doseMax: "20 mcg/kg/min",
      efeito: "Inotrópico predominante (beta)",
      indicacao: "Choque frio com resistência vascular aumentada"
    },
    {
      nome: "Milrinona",
      doseInicial: "0.25 mcg/kg/min",
      doseMax: "0.75 mcg/kg/min",
      efeito: "Inodilatador",
      indicacao: "Choque com disfunção miocárdica e resistência vascular aumentada"
    }
  ];

  private antibioticoterapiaEmpirica: AntibioticScheme[] = [
    {
      situacao: "Recém-nascido (0-28 dias)",
      esquema: "Ampicilina + Gentamicina ou Ampicilina + Cefotaxima",
      doses: [
        "Ampicilina: 200 mg/kg/dia de 6/6h",
        "Gentamicina: 7,5 mg/kg/dia 1x/dia",
        "Cefotaxima: 200 mg/kg/dia de 6/6h ou 8/8h"
      ]
    },
    {
      situacao: "Previamente hígido, adquirido na comunidade, foco desconhecido",
      esquema: "Ceftriaxona ou Cefotaxima",
      doses: [
        "Ceftriaxona: 100 mg/kg/dia de 12/12h",
        "Cefotaxima: 200 mg/kg/dia de 6/6h ou 8/8h"
      ]
    },
    {
      situacao: "Associado a cateter venoso central",
      esquema: "Oxacilina + Cefepime ou Vancomicina + Cefepime",
      doses: [
        "Oxacilina: 150-200 mg/kg/dia de 6/6h",
        "Vancomicina: 60 mg/kg/dia de 6/6h",
        "Cefepime: 150 mg/kg/dia de 8/8h"
      ]
    },
    {
      situacao: "Risco de bactérias multirresistentes (hospitalizado)",
      esquema: "Vancomicina + Cefepime/Piperacilina-tazobactam + (considerar Amicacina)",
      doses: [
        "Vancomicina: 60 mg/kg/dia de 6/6h",
        "Cefepime: 150 mg/kg/dia de 8/8h",
        "Piperacilina-tazobactam: 300 mg/kg/dia de 6/6h ou 8/8h (componente piperacilina)",
        "Amicacina: 15 mg/kg/dia 1x/dia"
      ]
    },
    {
      situacao: "Neutropenia febril",
      esquema: "Cefepime ou Piperacilina-tazobactam ± Vancomicina",
      doses: [
        "Cefepime: 150 mg/kg/dia de 8/8h",
        "Piperacilina-tazobactam: 300 mg/kg/dia de 6/6h ou 8/8h (componente piperacilina)",
        "Vancomicina: 60 mg/kg/dia de 6/6h"
      ]
    },
    {
      situacao: "Suspeita de foco abdominal",
      esquema: "Ampicilina/Sulbactam ou Piperacilina/Tazobactam ou Ceftriaxona + Metronidazol",
      doses: [
        "Ampicilina/Sulbactam: 200 mg/kg/dia de 6/6h (componente ampicilina)",
        "Piperacilina/Tazobactam: 300 mg/kg/dia de 6/6h ou 8/8h (componente piperacilina)",
        "Ceftriaxona: 100 mg/kg/dia de 12/12h",
        "Metronidazol: 30 mg/kg/dia de 8/8h"
      ]
    }
  ];

  private causasReversiveis: CausaReversivel[] = [
    { nome: "Hipoxemia", tipo: "H" },
    { nome: "Hipovolemia", tipo: "H" },
    { nome: "Hidrogênio (acidose)", tipo: "H" },
    { nome: "Hipo/hipercalemia", tipo: "H" },
    { nome: "Hipotermia", tipo: "H" },
    { nome: "Tensão no tórax (pneumotórax hipertensivo)", tipo: "T" },
    { nome: "Tamponamento cardíaco", tipo: "T" },
    { nome: "Toxinas (intoxicações)", tipo: "T" },
    { nome: "Tromboembolismo pulmonar", tipo: "T" },
    { nome: "Trauma", tipo: "T" }
  ];

  public obterFaixaEtaria(idadeMeses: number): keyof typeof this.parametrosNormais.fc {
    if (idadeMeses < 1) return "0-1m";
    if (idadeMeses < 12) return "1-12m";
    if (idadeMeses < 24) return "1-2a";
    if (idadeMeses < 60) return "2-5a";
    if (idadeMeses < 144) return "5-12a";
    return "12-18a";
  }

  public calcularPasMinima(idadeMeses: number): number {
    if (idadeMeses < 1) return 60;
    if (idadeMeses < 12) return 70;
    if (idadeMeses < 120) {
      // Para 1-10 anos: 70 + (2 × idade em anos)
      return 70 + (2 * Math.floor(idadeMeses / 12));
    }
    return 90;
  }

  public avaliarParametrosVitais(
    idadeMeses: number, 
    fc: number, 
    fr: number, 
    pas: number, 
    perfusao: string, 
    consciencia: string
  ): VitalSignsAssessment {
    const faixaEtaria = this.obterFaixaEtaria(idadeMeses);
    
    // Verificar valores normais para faixa etária
    const fcNormal = this.parametrosNormais.fc[faixaEtaria];
    const frNormal = this.parametrosNormais.fr[faixaEtaria];
    const pasMinima = this.calcularPasMinima(idadeMeses);
    
    // Avaliar taquicardia/bradicardia
    let fcStatus: "Normal" | "Taquicardia" | "Bradicardia" = "Normal";
    if (fc > fcNormal.max) {
      fcStatus = "Taquicardia";
    } else if (fc < fcNormal.min) {
      fcStatus = "Bradicardia";
    }
    
    // Avaliar taquipneia
    let frStatus: "Normal" | "Taquipneia" | "Bradipneia" = "Normal";
    if (fr > frNormal.max) {
      frStatus = "Taquipneia";
    } else if (fr < frNormal.min) {
      frStatus = "Bradipneia";
    }
    
    // Avaliar pressão arterial
    let pasStatus: "Normal" | "Hipotensão" = "Normal";
    if (pas < pasMinima) {
      pasStatus = "Hipotensão";
    }
    
    // Detectar sinais de choque
    const sinaisChoque: string[] = [];
    if (fcStatus === "Taquicardia") {
      sinaisChoque.push("Taquicardia");
    }
    if (pasStatus === "Hipotensão") {
      sinaisChoque.push("Hipotensão");
    }
    if (perfusao === "aumentado") {
      sinaisChoque.push("Tempo de enchimento capilar aumentado");
    }
    if (consciencia === "alterado") {
      sinaisChoque.push("Alteração do nível de consciência");
    }
    
    // Determinar fase do choque
    let faseChoque: "Nenhuma" | "Compensado" | "Descompensado" = "Nenhuma";
    if (sinaisChoque.length >= 2 && !sinaisChoque.includes("Hipotensão")) {
      faseChoque = "Compensado";
    } else if (sinaisChoque.includes("Hipotensão")) {
      faseChoque = "Descompensado";
    }

    return {
      fc: {
        value: fc,
        status: fcStatus,
        normalMin: fcNormal.min,
        normalMax: fcNormal.max
      },
      fr: {
        value: fr,
        status: frStatus,
        normalMin: frNormal.min,
        normalMax: frNormal.max
      },
      pas: {
        value: pas,
        status: pasStatus,
        normalMin: pasMinima
      },
      perfusao,
      consciencia,
      sinaisChoque,
      faseChoque
    };
  }

  public calcularVolumeExpansao(peso: number, numExpansoes: number = 3): VolumeExpansion {
    return {
      volumeUnitario: 20 * peso,
      volumeTotal: 20 * peso * numExpansoes
    };
  }

  public recomendarAntibioticos(idadeMeses: number, contexto: string): AntibioticScheme[] {
    const recomendacoes: AntibioticScheme[] = [];
    
    // Filtrar recomendações relevantes baseado no contexto
    for (const schema of this.antibioticoterapiaEmpirica) {
      if ((idadeMeses <= 1 && schema.situacao.includes("Recém-nascido")) ||
          (contexto !== "neonatal" && schema.situacao.toLowerCase().includes(contexto))) {
        recomendacoes.push(schema);
      }
    }
    
    // Se não encontrou recomendações específicas, incluir opção padrão
    if (recomendacoes.length === 0) {
      const padrão = this.antibioticoterapiaEmpirica.find(schema => 
        schema.situacao.includes("Previamente hígido")
      );
      if (padrão) {
        recomendacoes.push(padrão);
      }
    }
    
    return recomendacoes;
  }

  public recomendarDrogasVasoativas(tipoChoque: string, peso: number): VasoactiveDrug[] {
    const recomendacoes: VasoactiveDrug[] = [];
    
    for (const droga of this.drogasVasoativas) {
      let prioridade: "alta" | "baixa" = "baixa";
      
      if (tipoChoque === "quente" && droga.efeito.toLowerCase().includes("vasoconstri")) {
        // Priorizar vasoconstritores para choque quente (vasodilatado)
        prioridade = "alta";
      } else if (tipoChoque === "frio" && droga.efeito.toLowerCase().includes("inotrópico")) {
        // Priorizar inotrópicos para choque frio (cardiogênico)
        prioridade = "alta";
      }

      // Calcular preparações
      let preparacao = "";
      let doseInicialMl = "";

      if (droga.nome.toLowerCase().includes("adrenalina") || droga.nome.toLowerCase().includes("noradrenalina")) {
        // Diluição padrão: 6 × peso (kg) mg em 100 ml
        const concentracao = (6 * peso) / 100;
        preparacao = `${(6 * peso).toFixed(1)} mg em 100 ml (concentração: ${concentracao.toFixed(2)} mg/ml)`;
        const doseInicialNum = parseFloat(droga.doseInicial.split('-')[0]);
        doseInicialMl = `${((doseInicialNum * peso * 60) / (concentracao * 1000)).toFixed(1)} ml/h`;
      } else if (droga.nome.toLowerCase().includes("dobutamina")) {
        // Diluição padrão: 6 × peso (kg) × 5 mg em 100 ml
        const concentracao = (6 * peso * 5) / 100;
        preparacao = `${(6 * peso * 5).toFixed(1)} mg em 100 ml (concentração: ${concentracao.toFixed(1)} mg/ml)`;
        doseInicialMl = `${((5 * peso * 60) / concentracao).toFixed(1)} ml/h`;
      }

      recomendacoes.push({
        ...droga,
        prioridade,
        preparacao,
        doseInicialMl
      });
    }
    
    return recomendacoes;
  }

  public calcular(dados: ChoqueSepticoInput): ChoqueSepticoResult {
    const { 
      weight: peso, 
      ageYears: idadeAnos, 
      ageMonths: idadeMesesAdicional,
      temperature: temp,
      vitalSigns,
      context: contexto,
      shockType: tipoChoque
    } = dados;

    const idadeMeses = (idadeAnos * 12) + idadeMesesAdicional;
    
    // Avaliar parâmetros vitais
    const avaliacaoVital = this.avaliarParametrosVitais(
      idadeMeses, 
      vitalSigns.fc, 
      vitalSigns.fr, 
      vitalSigns.pas, 
      vitalSigns.perfusao, 
      vitalSigns.consciencia
    );
    
    // Calcular volume para expansão
    const expansaoVolumica = this.calcularVolumeExpansao(peso, 3);
    
    // Recomendar antibióticos
    const antibioticos = this.recomendarAntibioticos(idadeMeses, contexto);
    
    // Recomendar drogas vasoativas
    const drogasVasoativas = this.recomendarDrogasVasoativas(tipoChoque, peso);
    
    // Avaliação de gravidade
    let gravidade: "Leve" | "Moderado" | "Grave" = "Leve";
    if (avaliacaoVital.faseChoque === "Descompensado") {
      gravidade = "Grave";
    } else if (avaliacaoVital.faseChoque === "Compensado") {
      gravidade = "Moderado";
    }
    
    // Gerar recomendações baseadas na avaliação
    const recomendacoes: ChoqueSepticoRecommendation[] = [];
    
    // Recomendações para via aérea e respiração
    recomendacoes.push({
      categoria: "Via aérea e Respiração",
      items: [
        "Garantir via aérea pérvia",
        `Oferecer oxigênio suplementar para manter SpO2 > 94%${vitalSigns.consciencia === 'alterado' ? ' (considerar intubação se alteração de consciência)' : ''}`
      ]
    });
    
    // Recomendações para circulação
    const itemsCirculacao = [
      `Estabelecer acesso vascular (2 acessos periféricos calibrosos${idadeMeses < 72 ? ' ou acesso intraósseo' : ''})`,
      `Expansão volêmica com SF 0,9%: ${expansaoVolumica.volumeUnitario.toFixed(0)} ml em bolus`
    ];
    
    if (avaliacaoVital.faseChoque !== "Nenhuma") {
      itemsCirculacao.push(`Repetir expansão se necessário (até ${expansaoVolumica.volumeTotal.toFixed(0)} ml nas primeiras 3 expansões)`);
      
      if (avaliacaoVital.faseChoque === "Descompensado") {
        itemsCirculacao.push("Considerar início precoce de drogas vasoativas");
      }
    }
    
    recomendacoes.push({
      categoria: "Circulação",
      items: itemsCirculacao
    });
    
    // Recomendações para exames
    recomendacoes.push({
      categoria: "Exames laboratoriais",
      items: [
        "Coleta de hemoculturas (2 amostras)",
        "Hemograma completo",
        "PCR, procalcitonina (se disponível)",
        "Eletrólitos, função renal e hepática",
        "Gasometria arterial",
        "Lactato sérico",
        "Coagulograma"
      ]
    });
    
    // Recomendações para antibioticoterapia
    const itemsAntibiotico = ["Iniciar antibioticoterapia empírica na primeira hora"];
    if (antibioticos.length > 0) {
      for (const antibiotico of antibioticos) {
        itemsAntibiotico.push(`Esquema sugerido: ${antibiotico.esquema}`);
      }
    }
    
    recomendacoes.push({
      categoria: "Antibioticoterapia",
      items: itemsAntibiotico
    });
    
    // Recomendações para monitorização
    recomendacoes.push({
      categoria: "Monitorização",
      items: [
        "Monitorização cardíaca contínua",
        "Avaliação frequente de sinais vitais e perfusão",
        "Controle de diurese",
        "Reavaliação periódica do estado neurológico"
      ]
    });
    
    // Recomendações para internação
    let nivelAtencao = "Enfermaria com monitorização";
    if (gravidade === "Moderado") {
      nivelAtencao = "Considerar Unidade de Terapia Intensiva";
    } else if (gravidade === "Grave") {
      nivelAtencao = "Unidade de Terapia Intensiva";
    }
    
    recomendacoes.push({
      categoria: "Internação",
      items: [`Nível de atenção: ${nivelAtencao}`]
    });

    return {
      avaliacaoVital,
      expansaoVolumica,
      antibioticos,
      drogasVasoativas,
      causasReversiveis: this.causasReversiveis,
      gravidade,
      recomendacoes
    };
  }
}

// Singleton instance
export const choqueSepticoCalculator = new ChoqueSepticoCalculator();
