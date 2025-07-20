class TraumaCranioencefalicoController {
  criterios_tc_gerais: string[];
  criterios_adicionais_maior_2_anos: string[];
  criterios_adicionais_menor_2_anos: string[];
  escala_glasgow: any;
  escores_normais: any[];

  constructor() {
    // Parâmetros para avaliação
    this.criterios_tc_gerais = [
      "Escala de Coma de Glasgow < 14",
      "Alterações do estado mental",
      "Perda da consciência (independente da duração)",
      "Sinais de fratura de base de crânio (ou, em menores de 2 anos, qualquer fratura craniana)"
    ];
    
    this.criterios_adicionais_maior_2_anos = [
      "História de vômitos",
      "Vertigem",
      "Mecanismo de trauma grave",
      "Hematoma occipital (ou hematomas volumosos em outras localizações)",
      "Cefaleia intensa"
    ];
    
    this.criterios_adicionais_menor_2_anos = [
      "Hematoma occipital, parietal ou temporal",
      "Mecanismo de trauma grave",
      "Se a criança não estiver reagindo normalmente, segundo os pais"
    ];
    
    this.escala_glasgow = {
      abertura_olhos: [
        {escore: 4, criterio: "Espontaneamente", criterio_menor_1_ano: "Espontaneamente"},
        {escore: 3, criterio: "Ao comando", criterio_menor_1_ano: "A fala"},
        {escore: 2, criterio: "A dor", criterio_menor_1_ano: "A dor"},
        {escore: 1, criterio: "Nenhuma resposta", criterio_menor_1_ano: "Nenhuma resposta"}
      ],
      resposta_verbal: [
        {escore: 5, criterio: "Orientada", criterio_menor_1_ano: "Sorri, orientada"},
        {escore: 4, criterio: "Desorientada", criterio_menor_1_ano: "Choro consolável"},
        {escore: 3, criterio: "Palavra inapropriada", criterio_menor_1_ano: "Choro persistente, gemente"},
        {escore: 2, criterio: "Sons incompreensíveis", criterio_menor_1_ano: "Agitada e inquieta"},
        {escore: 1, criterio: "Nenhuma resposta", criterio_menor_1_ano: "Nenhuma resposta"}
      ],
      resposta_motora: [
        {escore: 6, criterio: "Obedece a comando", criterio_menor_1_ano: "Movimentos normais"},
        {escore: 5, criterio: "Localiza a dor", criterio_menor_1_ano: "Localiza a dor"},
        {escore: 4, criterio: "Flexão a dor", criterio_menor_1_ano: "Flexão a dor"},
        {escore: 3, criterio: "Flexão anormal a dor", criterio_menor_1_ano: "Flexão anormal a dor"},
        {escore: 2, criterio: "Extensão anormal a dor", criterio_menor_1_ano: "Extensão anormal a dor"},
        {escore: 1, criterio: "Nenhuma resposta", criterio_menor_1_ano: "Nenhuma resposta"}
      ]
    };
    
    this.escores_normais = [
      {faixa_etaria: "<6 meses", escore: 13},
      {faixa_etaria: "6-12 meses", escore: 13},
      {faixa_etaria: "1-2 anos", escore: 14},
      {faixa_etaria: "2-5 anos", escore: 15},
      {faixa_etaria: ">5 anos", escore: 15}
    ];
  }

  calcularGlasgow(idadeMeses: number, aberturaOlhos: number, respostaVerbal: number, respostaMotora: number): any {
    try {
      const scoreTotal = aberturaOlhos + respostaVerbal + respostaMotora;
      
      // Determinar o score normal para a idade
      let escoreNormal = 15;
      
      if (idadeMeses < 6) {
        escoreNormal = 13;
      } else if (idadeMeses < 12) {
        escoreNormal = 13;
      } else if (idadeMeses < 24) {
        escoreNormal = 14;
      } else if (idadeMeses < 60) {
        escoreNormal = 15;
      }
          
      const avaliacao = scoreTotal >= escoreNormal ? "Normal" : "Alterado";
      let gravidade = "Leve";
      
      if (scoreTotal < 9) {
        gravidade = "Grave";
      } else if (scoreTotal < 13) {
        gravidade = "Moderado";
      }
      
      return {
        score_total: scoreTotal,
        escore_normal: escoreNormal,
        avaliacao: avaliacao,
        gravidade: gravidade
      };
    } catch (error: any) {
      throw new Error("Não foi possível calcular o escore de Glasgow");
    }
  }
  
  avaliarIndicacaoTc(idadeMeses: number, criteriosGerais: boolean[], criteriosAdicionais: boolean[]): string {
    try {
      if (criteriosGerais.some(criterio => criterio === true)) {
        return "TC crânio recomendada";
      } else if (criteriosAdicionais.some(criterio => criterio === true)) {
        return "TC ou Observação conforme experiência clínica, piora clínica, achados múltiplos";
      } else {
        return "TC crânio não recomendada";
      }
    } catch (error: any) {
      throw new Error("Não foi possível avaliar a indicação de tomografia computadorizada");
    }
  }

  calcular(dados: any): any {
    try {
      const idadeMeses = parseInt(dados.idade_meses || 0);
      const menor2Anos = idadeMeses < 24;
      
      // Calcular Glasgow
      const aberturaOlhos = parseInt(dados.abertura_olhos || 4);
      const respostaVerbal = parseInt(dados.resposta_verbal || 5);
      const respostaMotora = parseInt(dados.resposta_motora || 6);
      
      const resultadoGlasgow = this.calcularGlasgow(
        idadeMeses, aberturaOlhos, respostaVerbal, respostaMotora
      );
      
      // Avaliar critérios para TC
      const criteriosGerais = [
        dados.glasgow_alterado || false,
        dados.alteracao_mental || false,
        dados.perda_consciencia || false,
        dados.sinais_fratura || false
      ];
      
      // Critérios adicionais variam conforme a idade
      let criteriosAdicionais = [];
      if (menor2Anos) {
        criteriosAdicionais = [
          dados.hematoma_cabeca || false,
          dados.trauma_grave || false,
          dados.comportamento_anormal || false
        ];
      } else {
        criteriosAdicionais = [
          dados.vomitos || false,
          dados.vertigem || false,
          dados.trauma_grave || false,
          dados.hematoma_occipital || false,
          dados.cefaleia_intensa || false
        ];
      }
      
      const recomendacaoTc = this.avaliarIndicacaoTc(idadeMeses, criteriosGerais, criteriosAdicionais);
      
      // Recomendações finais
      const recomendacoes = [];
      if (resultadoGlasgow.avaliacao === "Alterado" || resultadoGlasgow.score_total < 15) {
        recomendacoes.push("Monitorar sinais vitais e estado neurológico a cada 30 minutos nas primeiras 2 horas");
        recomendacoes.push("Considerar avaliação por especialista");
      }
      
      if (recomendacaoTc === "TC crânio recomendada") {
        recomendacoes.push("Realizar tomografia computadorizada de crânio");
        recomendacoes.push("Manter observação hospitalar");
      } else if (recomendacaoTc === "TC ou Observação conforme experiência clínica, piora clínica, achados múltiplos") {
        recomendacoes.push("Observação intra-hospitalar por pelo menos 6 a 12 horas");
        recomendacoes.push("Monitorizar sinais vitais e estado neurológico");
      } else {
        if (resultadoGlasgow.avaliacao === "Normal") {
          recomendacoes.push("Considerar alta com orientações aos pais/responsáveis sobre sinais de alerta");
        }
      }
      
      // Criterios de internação
      let criteriosInternacao = false;
      const motivosInternacao = [];
      
      if (resultadoGlasgow.score_total < 15 || recomendacaoTc === "TC crânio recomendada") {
        criteriosInternacao = true;
        motivosInternacao.push("Glasgow alterado ou indicação de TC");
      }
      
      if (dados.trauma_grave) {
        criteriosInternacao = true;
        motivosInternacao.push("Trauma grave");
      }
      
      if (dados.vomitos && dados.vomitos_persistentes) {
        criteriosInternacao = true;
        motivosInternacao.push("Vômitos persistentes");
      }
      
      // Orientações de alta (se aplicável)
      let orientacoesAlta = [];
      if (menor2Anos) {
        orientacoesAlta = [
          "Manter atividades habituais conforme recomendações para a idade",
          "Evitar situações com risco de trauma craniano",
          "Retornar imediatamente em caso de: sonolência excessiva, abaulamento da fontanela, vômitos persistentes, irritabilidade excessiva, alteração do comportamento, convulsões"
        ];
      } else {
        orientacoesAlta = [
          "Repouso nas primeiras 24 horas",
          "Medicamentos para dor conforme prescrição médica",
          "Retornar imediatamente em caso de: dor de cabeça persistente, vômitos, alteração do comportamento, sonolência excessiva, fraqueza ou formigamento, convulsões"
        ];
      }
      
      // Resultado final
      return {
        idade: {
          meses: idadeMeses,
          menor_2_anos: menor2Anos
        },
        glasgow: resultadoGlasgow,
        recomendacao_tc: recomendacaoTc,
        recomendacoes: recomendacoes,
        criterios_internacao: criteriosInternacao,
        motivos_internacao: motivosInternacao,
        orientacoes_alta: criteriosInternacao ? [] : orientacoesAlta,
        risco: resultadoGlasgow.gravidade === "Grave" ? "Alto" : 
               resultadoGlasgow.gravidade === "Moderado" ? "Médio" : "Baixo"
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular recomendações para TCE: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getCriteriosTcGerais(): string[] {
    return this.criterios_tc_gerais;
  }
  
  getCriteriosAdicionaisMaior2Anos(): string[] {
    return this.criterios_adicionais_maior_2_anos;
  }
  
  getCriteriosAdicionaisMenor2Anos(): string[] {
    return this.criterios_adicionais_menor_2_anos;
  }
  
  getEscalaGlasgow(): any {
    return this.escala_glasgow;
  }
  
  getEscoresNormais(): any[] {
    return this.escores_normais;
  }
}

const controller = new TraumaCranioencefalicoController();
export default controller;
