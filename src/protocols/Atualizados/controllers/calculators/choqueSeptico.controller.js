class ChoqueSepticoController {
  constructor() {
    // Definição dos parâmetros vitais normais por faixa etária
    this.parametros_normais = {
      fc: {  // Frequência cardíaca (bpm)
        "0-1m": { min: 100, max: 160 },
        "1-12m": { min: 100, max: 160 },
        "1-2a": { min: 90, max: 150 },
        "2-5a": { min: 80, max: 140 },
        "5-12a": { min: 70, max: 120 },
        "12-18a": { min: 60, max: 100 }
      },
      fr: {  // Frequência respiratória (irpm)
        "0-1m": { min: 30, max: 60 },
        "1-12m": { min: 25, max: 40 },
        "1-2a": { min: 20, max: 30 },
        "2-5a": { min: 18, max: 25 },
        "5-12a": { min: 15, max: 20 },
        "12-18a": { min: 12, max: 18 }
      },
      pas: {  // Pressão arterial sistólica (mmHg)
        "0-1m": { min: 60, max: 80 },
        "1-12m": { min: 70, max: 100 },
        "1-2a": { min: 70 + 2 * 12, max: 100 + 2 * 12 },  // 70 + (2 × idade em anos)
        "2-5a": { min: 70 + 2 * 36, max: 100 + 2 * 36 },  // Média de 3 anos
        "5-12a": { min: 70 + 2 * 96, max: 100 + 2 * 96 },  // Média de 8 anos
        "12-18a": { min: 90, max: 120 }
      }
    };
    
    // Drogas vasoativas e suas doses
    this.drogas_vasoativas = [
      {
        nome: "Adrenalina",
        dose_inicial: "0.05-0.1 mcg/kg/min",
        dose_max: "1.0 mcg/kg/min",
        efeito: "Inotrópico e vasoconstritor (alfa e beta)",
        indicacao: "Choque frio com resistência vascular aumentada"
      },
      {
        nome: "Noradrenalina",
        dose_inicial: "0.05-0.1 mcg/kg/min",
        dose_max: "1.0 mcg/kg/min",
        efeito: "Vasoconstritora predominante (alfa)",
        indicacao: "Choque quente com resistência vascular diminuída"
      },
      {
        nome: "Dobutamina",
        dose_inicial: "5 mcg/kg/min",
        dose_max: "20 mcg/kg/min",
        efeito: "Inotrópico predominante (beta)",
        indicacao: "Choque frio com resistência vascular aumentada"
      },
      {
        nome: "Milrinona",
        dose_inicial: "0.25 mcg/kg/min",
        dose_max: "0.75 mcg/kg/min",
        efeito: "Inodilatador",
        indicacao: "Choque com disfunção miocárdica e resistência vascular aumentada"
      }
    ];
    
    // Esquemas de antibioticoterapia empírica
    this.antibioticoterapia_empirica = [
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
    
    // Causas reversíveis (5Hs e 5Ts)
    this.causas_reversiveis = [
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
  }
  
  obterFaixaEtaria(idadeMeses) {
    // Determina a faixa etária baseada na idade em meses
    if (idadeMeses < 1) {
      return "0-1m";
    } else if (idadeMeses < 12) {
      return "1-12m";
    } else if (idadeMeses < 24) {
      return "1-2a";
    } else if (idadeMeses < 60) {
      return "2-5a";
    } else if (idadeMeses < 144) {
      return "5-12a";
    } else {
      return "12-18a";
    }
  }
  
  calcularPasMinima(idadeMeses) {
    // Calcula a pressão arterial sistólica mínima aceitável baseada na idade
    if (idadeMeses < 1) {
      return 60;
    } else if (idadeMeses < 12) {
      return 70;
    } else if (idadeMeses < 120) {
      // Para 1-10 anos: 70 + (2 × idade em anos)
      return 70 + (2 * Math.floor(idadeMeses / 12));
    } else {
      return 90;
    }
  }
  
  avaliarParametrosVitais(idadeMeses, fc, fr, pas, perfusao, consciencia) {
    // Avalia os parâmetros vitais em relação à faixa etária
    const faixaEtaria = this.obterFaixaEtaria(idadeMeses);
    
    // Verificar valores normais para faixa etária
    const fcNormal = this.parametros_normais.fc[faixaEtaria];
    const frNormal = this.parametros_normais.fr[faixaEtaria];
    const pasMinima = this.calcularPasMinima(idadeMeses);
    
    // Avaliar taquicardia/bradicardia
    let fcStatus = "Normal";
    if (fc > fcNormal.max) {
      fcStatus = "Taquicardia";
    } else if (fc < fcNormal.min) {
      fcStatus = "Bradicardia";
    }
    
    // Avaliar taquipneia
    let frStatus = "Normal";
    if (fr > frNormal.max) {
      frStatus = "Taquipneia";
    } else if (fr < frNormal.min) {
      frStatus = "Bradipneia";
    }
    
    // Avaliar pressão arterial
    let pasStatus = "Normal";
    if (pas < pasMinima) {
      pasStatus = "Hipotensão";
    }
    
    // Detectar sinais de choque
    const sinaisChoque = [];
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
    let faseChoque = "Nenhuma";
    if (sinaisChoque.length >= 2 && !sinaisChoque.includes("Hipotensão")) {
      faseChoque = "Compensado";
    } else if (sinaisChoque.includes("Hipotensão")) {
      faseChoque = "Descompensado";
    }
    
    return {
      fc: {
        valor: fc,
        status: fcStatus,
        normal_min: fcNormal.min,
        normal_max: fcNormal.max
      },
      fr: {
        valor: fr,
        status: frStatus,
        normal_min: frNormal.min,
        normal_max: frNormal.max
      },
      pas: {
        valor: pas,
        status: pasStatus,
        normal_min: pasMinima
      },
      perfusao,
      consciencia,
      sinaisChoque,
      faseChoque
    };
  }
  
  calcularVolumeExpansao(peso, numExpansoes = 1) {
    // Calcula o volume para expansão volêmica (20ml/kg)
    return {
      volume_unitario: 20 * peso,
      volume_total: 20 * peso * numExpansoes
    };
  }
  
  recomendarAntibioticos(idadeMeses, contexto) {
    // Recomenda antibióticos empíricos baseados na idade e contexto clínico
    const recomendacoes = [];
    
    // Filtrar recomendações relevantes baseado no contexto
    for (const schema of this.antibioticoterapia_empirica) {
      if ((idadeMeses <= 1 && schema.situacao.startsWith("Recém-nascido")) || 
          (contexto && schema.situacao.toLowerCase().includes(contexto.toLowerCase()))) {
        recomendacoes.push(schema);
      }
    }
    
    // Se não encontrou recomendações específicas, incluir opção padrão
    if (recomendacoes.length === 0) {
      for (const schema of this.antibioticoterapia_empirica) {
        if (schema.situacao.startsWith("Previamente hígido")) {
          recomendacoes.push(schema);
        }
      }
    }
    
    return recomendacoes;
  }
  
  recomendarDrogasVasoativas(tipoChoque, peso) {
    // Recomenda drogas vasoativas com base no tipo de choque
    const recomendacoes = [];
    
    for (const droga of this.drogas_vasoativas) {
      if (tipoChoque === "quente" && droga.efeito.toLowerCase().includes("vasoconstri")) {
        // Priorizar vasoconstritores para choque quente (vasodilatado)
        recomendacoes.push({
          ...droga,
          prioridade: "alta"
        });
      } else if (tipoChoque === "frio" && droga.efeito.toLowerCase().includes("inotrópico")) {
        // Priorizar inotrópicos para choque frio (cardiogênico)
        recomendacoes.push({
          ...droga,
          prioridade: "alta"
        });
      } else {
        recomendacoes.push({
          ...droga,
          prioridade: "baixa"
        });
      }
    }
    
    // Calcular volumes para preparação das drogas
    for (const droga of recomendacoes) {
      if (droga.nome.toLowerCase().includes("adrenalina") || droga.nome.toLowerCase().includes("noradrenalina")) {
        // Diluição padrão: 6 × peso (kg) mg em 100 ml
        const concentracao = (6 * peso / 100).toFixed(2);
        droga.preparacao = `${(6 * peso).toFixed(1)} mg em 100 ml (concentração: ${concentracao} mg/ml)`;
        
        // Calcular dose inicial em ml/h
        const doseInicial = parseFloat(droga.dose_inicial.split("-")[0]);
        const mlh = ((doseInicial * peso * 60) / (6 * peso / 100)).toFixed(1);
        droga.dose_inicial_ml = `${mlh} ml/h`;
      } else if (droga.nome.toLowerCase().includes("dobutamina")) {
        // Diluição padrão: 6 × peso (kg) × 5 mg em 100 ml
        const concentracao = (6 * peso * 5 / 100).toFixed(1);
        droga.preparacao = `${(6 * peso * 5).toFixed(1)} mg em 100 ml (concentração: ${concentracao} mg/ml)`;
        
        // Calcular dose inicial em ml/h
        const mlh = ((5 * peso * 60) / (6 * peso * 5 / 100)).toFixed(1);
        droga.dose_inicial_ml = `${mlh} ml/h`;
      }
    }
    
    return recomendacoes;
  }
  
  calcular(dados) {
    // Método principal que recebe os dados e retorna os resultados
    try {
      // Extrair dados do formulário
      const idadeAnos = parseInt(dados.idade_anos || 0);
      const idadeMesesAdicional = parseInt(dados.idade_meses || 0);
      const idadeMeses = (idadeAnos * 12) + idadeMesesAdicional;
      
      const peso = parseFloat(dados.peso || 0);
      const fc = parseInt(dados.fc || 0);
      const fr = parseInt(dados.fr || 0);
      const pas = parseInt(dados.pas || 0);
      const perfusao = dados.perfusao || "normal";
      const consciencia = dados.consciencia || "normal";
      const temp = parseFloat(dados.temperatura || 37);
      
      // Contexto clínico para antibioticoterapia
      const contexto = dados.contexto || "";
      const tipoChoque = dados.tipo_choque || "quente";
      
      // Avaliar parâmetros vitais
      const avaliacaoVital = this.avaliarParametrosVitais(
        idadeMeses, fc, fr, pas, perfusao, consciencia
      );
      
      // Calcular volume para expansão
      const expansaoVolumica = this.calcularVolumeExpansao(peso, 3);  // Calculando para até 3 expansões
      
      // Recomendar antibióticos
      const antibioticos = this.recomendarAntibioticos(idadeMeses, contexto);
      
      // Recomendar drogas vasoativas
      const drogasVasoativas = this.recomendarDrogasVasoativas(tipoChoque, peso);
      
      // Avaliação de gravidade
      let gravidade = "Leve";
      if (avaliacaoVital.faseChoque === "Descompensado") {
        gravidade = "Grave";
      } else if (avaliacaoVital.faseChoque === "Compensado") {
        gravidade = "Moderado";
      }
      
      // Gerar recomendações baseadas na avaliação
      const recomendacoes = [];
      
      // Recomendações para via aérea e respiração
      recomendacoes.push({
        categoria: "Via aérea e Respiração",
        items: [
          "Garantir via aérea pérvia",
          `Oferecer oxigênio suplementar para manter SpO2 > 94%${consciencia === 'alterado' ? ' (considerar intubação se alteração de consciência)' : ''}`
        ]
      });
      
      // Recomendações para circulação
      const itemsCirculacao = [
        `Estabelecer acesso vascular (2 acessos periféricos calibrosos${idadeMeses < 72 ? ' ou acesso intraósseo' : ''})`,
        `Expansão volêmica com SF 0,9%: ${Math.round(expansaoVolumica.volume_unitario)} ml em bolus`
      ];
      
      if (avaliacaoVital.faseChoque !== "Nenhuma") {
        itemsCirculacao.push(`Repetir expansão se necessário (até ${Math.round(expansaoVolumica.volume_total)} ml nas primeiras 3 expansões)`);
        
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
      const itemsAntibiotico = [
        "Iniciar antibioticoterapia empírica na primeira hora"
      ];
      
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
      const itemsInternacao = ["Transferir para UTI pediátrica"];
      
      if (avaliacaoVital.faseChoque === "Descompensado") {
        itemsInternacao.push("Prioridade máxima para transferência");
      }
      
      recomendacoes.push({
        categoria: "Internação",
        items: itemsInternacao
      });
      
      // Retornar resultados completos
      return {
        avaliacao_vital: avaliacaoVital,
        expansao_volumica: expansaoVolumica,
        antibioticos: antibioticos,
        drogas_vasoativas: drogasVasoativas,
        gravidade: gravidade,
        recomendacoes: recomendacoes,
        causas_reversiveis: this.causas_reversiveis
      };
    } catch (error) {
      throw new Error(`Erro ao calcular choque séptico: ${error.message}`);
    }
  }
  
  // Métodos para acesso aos dados
  getParametrosNormais() {
    return this.parametros_normais;
  }
  
  getDrogasVasoativas() {
    return this.drogas_vasoativas;
  }
  
  getAntibioticoterapiaEmpirica() {
    return this.antibioticoterapia_empirica;
  }
  
  getCausasReversiveis() {
    return this.causas_reversiveis;
  }
}

// Exporta uma instância do controlador
const controller = new ChoqueSepticoController();
export default controller;
