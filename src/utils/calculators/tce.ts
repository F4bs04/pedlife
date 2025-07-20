import type { 
  TCEInput, 
  TCEResult, 
  GlasgowResult
} from '../../types/protocol-calculators';

/**
 * Calculadora para Trauma Cranioencefálico (TCE) em Pediatria
 * Baseada nas diretrizes médicas para avaliação de TCE e indicação de TC
 */
export class TCECalculator {
  private criteriosTcGerais = [
    "Escala de Coma de Glasgow < 14",
    "Alterações do estado mental",
    "Perda da consciência (independente da duração)",
    "Sinais de fratura de base de crânio (ou, em menores de 2 anos, qualquer fratura craniana)"
  ];

  private criteriosAdicionaisMaior2Anos = [
    "História de vômitos",
    "Vertigem",
    "Mecanismo de trauma grave",
    "Hematoma occipital (ou hematomas volumosos em outras localizações)",
    "Cefaleia intensa"
  ];

  private criteriosAdicionaisMenor2Anos = [
    "Hematoma occipital, parietal ou temporal",
    "Mecanismo de trauma grave",
    "Se a criança não estiver reagindo normalmente, segundo os pais"
  ];

  private escalaGlasgow = {
    aberturaOlhos: [
      { escore: 4, criterio: "Espontaneamente", criterioMenor1Ano: "Espontaneamente" },
      { escore: 3, criterio: "Ao comando", criterioMenor1Ano: "À fala" },
      { escore: 2, criterio: "À dor", criterioMenor1Ano: "À dor" },
      { escore: 1, criterio: "Nenhuma resposta", criterioMenor1Ano: "Nenhuma resposta" }
    ],
    respostaVerbal: [
      { escore: 5, criterio: "Orientada", criterioMenor1Ano: "Sorri, orientada" },
      { escore: 4, criterio: "Desorientada", criterioMenor1Ano: "Choro consolável" },
      { escore: 3, criterio: "Palavra inapropriada", criterioMenor1Ano: "Choro persistente, gemente" },
      { escore: 2, criterio: "Sons incompreensíveis", criterioMenor1Ano: "Agitada e inquieta" },
      { escore: 1, criterio: "Nenhuma resposta", criterioMenor1Ano: "Nenhuma resposta" }
    ],
    respostaMotora: [
      { escore: 6, criterio: "Obedece a comando", criterioMenor1Ano: "Movimentos normais" },
      { escore: 5, criterio: "Localiza a dor", criterioMenor1Ano: "Localiza a dor" },
      { escore: 4, criterio: "Flexão à dor", criterioMenor1Ano: "Flexão à dor" },
      { escore: 3, criterio: "Flexão anormal à dor", criterioMenor1Ano: "Flexão anormal à dor" },
      { escore: 2, criterio: "Extensão anormal à dor", criterioMenor1Ano: "Extensão anormal à dor" },
      { escore: 1, criterio: "Nenhuma resposta", criterioMenor1Ano: "Nenhuma resposta" }
    ]
  };

  private escoresNormais = [
    { faixaEtaria: "<6 meses", escore: 13 },
    { faixaEtaria: "6-12 meses", escore: 13 },
    { faixaEtaria: "1-2 anos", escore: 14 },
    { faixaEtaria: "2-5 anos", escore: 15 },
    { faixaEtaria: ">5 anos", escore: 15 }
  ];

  /**
   * Calcula o score total da Escala de Glasgow e avalia se está dentro do normal para a idade
   */
  private calcularGlasgow(
    idadeMeses: number,
    aberturaOlhos: number,
    respostaVerbal: number,
    respostaMotora: number
  ): GlasgowResult {
    const scoreTotal = aberturaOlhos + respostaVerbal + respostaMotora;
    
    // Determinar o score normal para a idade
    let escoreNormal = 15; // Valor padrão para maiores de 5 anos
    
    if (idadeMeses < 6) {
      escoreNormal = 13;
    } else if (idadeMeses < 12) {
      escoreNormal = 13;
    } else if (idadeMeses < 24) {
      escoreNormal = 14;
    } else if (idadeMeses < 60) {
      escoreNormal = 15;
    }
    
    const avaliacao: "Normal" | "Alterado" = scoreTotal >= escoreNormal ? "Normal" : "Alterado";
    
    let gravidade: "Leve" | "Moderado" | "Grave";
    if (scoreTotal >= 13) {
      gravidade = "Leve";
    } else if (scoreTotal >= 9) {
      gravidade = "Moderado";
    } else {
      gravidade = "Grave";
    }
    
    return {
      scoreTotal: scoreTotal,
      scoreNormal: escoreNormal,
      avaliacao: avaliacao,
      gravidade: gravidade
    };
  }

  /**
   * Avalia a indicação de TC (Tomografia Computadorizada) baseado nos critérios fornecidos
   */
  private avaliarIndicacaoTC(
    idadeMeses: number,
    criteriosGerais: boolean[],
    criteriosAdicionais: boolean[]
  ): string {
    if (criteriosGerais.some(criterio => criterio)) {
      return "TC crânio recomendada";
    } else if (criteriosAdicionais.some(criterio => criterio)) {
      return "TC ou Observação conforme experiência clínica, piora clínica, achados múltiplos";
    } else {
      return "TC crânio não recomendada";
    }
  }

  /**
   * Obtém critérios de glasgow para uma idade específica
   */
  public getGlasgowCriteria(idadeMeses: number) {
    const menor1Ano = idadeMeses < 12;
    
    return {
      aberturaOlhos: this.escalaGlasgow.aberturaOlhos.map(item => ({
        escore: item.escore,
        criterio: menor1Ano ? item.criterioMenor1Ano : item.criterio
      })),
      respostaVerbal: this.escalaGlasgow.respostaVerbal.map(item => ({
        escore: item.escore,
        criterio: menor1Ano ? item.criterioMenor1Ano : item.criterio
      })),
      respostaMotora: this.escalaGlasgow.respostaMotora.map(item => ({
        escore: item.escore,
        criterio: menor1Ano ? item.criterioMenor1Ano : item.criterio
      }))
    };
  }

  /**
   * Obtém critérios para TC baseados na idade
   */
  public getCriteriosTC(menor2Anos: boolean) {
    return {
      criteriosGerais: this.criteriosTcGerais,
      criteriosAdicionais: menor2Anos 
        ? this.criteriosAdicionaisMenor2Anos 
        : this.criteriosAdicionaisMaior2Anos
    };
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  public calcular(dados: TCEInput): TCEResult {
    const idadeMeses = dados.ageMonths;
    const menor2Anos = idadeMeses < 24;
    
    // Calcular Glasgow
    const resultadoGlasgow = this.calcularGlasgow(
      idadeMeses,
      dados.glasgowEyes,
      dados.glasgowVerbal,
      dados.glasgowMotor
    );
    
    // Avaliar critérios para TC
    const criteriosGerais = [
      dados.glasgowAltered,
      dados.mentalStateChange,
      dados.consciousnessLoss,
      dados.skullFractureSigns
    ];
    
    // Critérios adicionais variam conforme a idade
    const criteriosAdicionais = menor2Anos ? [
      dados.headHematoma,
      dados.severeTrauma,
      dados.abnormalBehavior
    ] : [
      dados.vomiting,
      dados.vertigo,
      dados.severeTrauma,
      dados.occipitalHematoma,
      dados.severeHeadache
    ];
    
    const recomendacaoTC = this.avaliarIndicacaoTC(idadeMeses, criteriosGerais, criteriosAdicionais);
    
    // Recomendações finais
    const recomendacoes: string[] = [];
    if (resultadoGlasgow.avaliacao === "Alterado" || resultadoGlasgow.scoreTotal < 15) {
      recomendacoes.push("Monitorar sinais vitais e estado neurológico a cada 30 minutos nas primeiras 2 horas");
      recomendacoes.push("Considerar avaliação por especialista");
    }
    
    if (recomendacaoTC === "TC crânio recomendada") {
      recomendacoes.push("Realizar tomografia computadorizada de crânio");
      recomendacoes.push("Manter observação hospitalar");
    } else if (recomendacaoTC.includes("TC ou Observação")) {
      recomendacoes.push("Observação intra-hospitalar por pelo menos 6 a 12 horas");
      recomendacoes.push("Monitorizar sinais vitais e estado neurológico");
    } else {
      if (resultadoGlasgow.avaliacao === "Normal") {
        recomendacoes.push("Considerar alta com orientações aos pais/responsáveis sobre sinais de alerta");
      }
    }
    
    // Critérios de internação
    let criteriosInternacao = false;
    const motivosInternacao: string[] = [];
    
    if (resultadoGlasgow.scoreTotal < 15 || recomendacaoTC === "TC crânio recomendada") {
      criteriosInternacao = true;
      motivosInternacao.push("Glasgow alterado ou indicação de TC");
    }
    
    if (dados.severeTrauma) {
      criteriosInternacao = true;
      motivosInternacao.push("Trauma grave");
    }
    
    if (dados.vomiting && dados.persistentVomiting) {
      criteriosInternacao = true;
      motivosInternacao.push("Vômitos persistentes");
    }
    
    // Orientações de alta (se aplicável)
    const orientacoesAlta: string[] = [];
    if (!criteriosInternacao) {
      if (menor2Anos) {
        orientacoesAlta.push(
          "Manter atividades habituais conforme recomendações para a idade",
          "Evitar situações com risco de trauma craniano",
          "Retornar imediatamente em caso de: sonolência excessiva, abaulamento da fontanela, vômitos persistentes, irritabilidade excessiva, alteração do comportamento, convulsões"
        );
      } else {
        orientacoesAlta.push(
          "Repouso nas primeiras 24 horas",
          "Medicamentos para dor conforme prescrição médica",
          "Retornar imediatamente em caso de: dor de cabeça persistente, vômitos, alteração do comportamento, sonolência excessiva, fraqueza ou formigamento, convulsões"
        );
      }
    }
    
    return {
      idadeMeses: idadeMeses,
      menor2Anos: menor2Anos,
      glasgow: resultadoGlasgow,
      recomendacaoTC: recomendacaoTC,
      recomendacoes: recomendacoes,
      criteriosInternacao: criteriosInternacao,
      motivosInternacao: motivosInternacao,
      orientacoesAlta: orientacoesAlta
    };
  }
}

// Instância singleton para uso global
export const tceCalculator = new TCECalculator();
