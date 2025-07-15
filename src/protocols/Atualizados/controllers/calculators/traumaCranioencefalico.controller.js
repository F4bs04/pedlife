class TraumaCranioencefalicoController {
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

  calcularGlasgow(idade_meses, abertura_olhos, resposta_verbal, resposta_motora) {
    /**
     * Calcula o score total da Escala de Glasgow e avalia se está dentro do normal para a idade
     */
    try {
      const score_total = abertura_olhos + resposta_verbal + resposta_motora;
      
      // Determinar o score normal para a idade
      let escore_normal = 15;  // Valor padrão para maiores de 5 anos
      
      if (idade_meses < 6) {
        escore_normal = 13;
      } else if (idade_meses < 12) {
        escore_normal = 13;
      } else if (idade_meses < 24) {
        escore_normal = 14;
      } else if (idade_meses < 60) {
        escore_normal = 15;
      }
          
      const avaliacao = score_total >= escore_normal ? "Normal" : "Alterado";
      let gravidade = "Leve";
      
      if (score_total < 9) {
        gravidade = "Grave";
      } else if (score_total < 13) {
        gravidade = "Moderado";
      }
      
      return {
        score_total,
        escore_normal,
        avaliacao,
        gravidade
      };
    } catch (error) {
      console.error("Erro ao calcular Glasgow:", error);
      throw new Error("Não foi possível calcular o escore de Glasgow");
    }
  }
  
  avaliarIndicacaoTc(idade_meses, criterios_gerais, criterios_adicionais) {
    /**
     * Avalia a indicação de TC (Tomografia Computadorizada) baseado nos critérios fornecidos
     */
    try {
      let recomendacao = "";
      if (criterios_gerais.some(criterio => criterio === true)) {
        recomendacao = "TC crânio recomendada";
      } else if (criterios_adicionais.some(criterio => criterio === true)) {
        recomendacao = "TC ou Observação conforme experiência clínica, piora clínica, achados múltiplos";
      } else {
        recomendacao = "TC crânio não recomendada";
      }
          
      return recomendacao;
    } catch (error) {
      console.error("Erro ao avaliar indicação de TC:", error);
      throw new Error("Não foi possível avaliar a indicação de tomografia computadorizada");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getCriteriosTcGerais() {
    return this.criterios_tc_gerais;
  }
  
  getCriteriosAdicionaisMaior2Anos() {
    return this.criterios_adicionais_maior_2_anos;
  }
  
  getCriteriosAdicionaisMenor2Anos() {
    return this.criterios_adicionais_menor_2_anos;
  }
  
  getEscalaGlasgow() {
    return this.escala_glasgow;
  }
  
  getEscoresNormais() {
    return this.escores_normais;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      const idade_meses = parseInt(dados.idade_meses || 0);
      const menor_2_anos = idade_meses < 24;
      
      // Calcular Glasgow
      const abertura_olhos = parseInt(dados.abertura_olhos || 4);
      const resposta_verbal = parseInt(dados.resposta_verbal || 5);
      const resposta_motora = parseInt(dados.resposta_motora || 6);
      
      const resultado_glasgow = this.calcularGlasgow(
        idade_meses, abertura_olhos, resposta_verbal, resposta_motora
      );
      
      // Avaliar critérios para TC
      const criterios_gerais = [
        dados.glasgow_alterado || false,
        dados.alteracao_mental || false,
        dados.perda_consciencia || false,
        dados.sinais_fratura || false
      ];
      
      // Critérios adicionais variam conforme a idade
      let criterios_adicionais = [];
      if (menor_2_anos) {
        criterios_adicionais = [
          dados.hematoma_cabeca || false,
          dados.trauma_grave || false,
          dados.comportamento_anormal || false
        ];
      } else {
        criterios_adicionais = [
          dados.vomitos || false,
          dados.vertigem || false,
          dados.trauma_grave || false,
          dados.hematoma_occipital || false,
          dados.cefaleia_intensa || false
        ];
      }
      
      const recomendacao_tc = this.avaliarIndicacaoTc(idade_meses, criterios_gerais, criterios_adicionais);
      
      // Recomendações finais
      const recomendacoes = [];
      if (resultado_glasgow.avaliacao === "Alterado" || resultado_glasgow.score_total < 15) {
        recomendacoes.push("Monitorar sinais vitais e estado neurológico a cada 30 minutos nas primeiras 2 horas");
        recomendacoes.push("Considerar avaliação por especialista");
      }
      
      if (recomendacao_tc === "TC crânio recomendada") {
        recomendacoes.push("Realizar tomografia computadorizada de crânio");
        recomendacoes.push("Manter observação hospitalar");
      } else if (recomendacao_tc === "TC ou Observação conforme experiência clínica, piora clínica, achados múltiplos") {
        recomendacoes.push("Observação intra-hospitalar por pelo menos 6 a 12 horas");
        recomendacoes.push("Monitorizar sinais vitais e estado neurológico");
      } else {
        if (resultado_glasgow.avaliacao === "Normal") {
          recomendacoes.push("Considerar alta com orientações aos pais/responsáveis sobre sinais de alerta");
        }
      }
      
      // Criterios de internação
      let criterios_internacao = false;
      const motivos_internacao = [];
      
      if (resultado_glasgow.score_total < 15 || recomendacao_tc === "TC crânio recomendada") {
        criterios_internacao = true;
        motivos_internacao.push("Glasgow alterado ou indicação de TC");
      }
      
      if (dados.trauma_grave) {
        criterios_internacao = true;
        motivos_internacao.push("Trauma grave");
      }
      
      if (dados.vomitos && dados.vomitos_persistentes) {
        criterios_internacao = true;
        motivos_internacao.push("Vômitos persistentes");
      }
      
      // Orientações de alta (se aplicável)
      let orientacoes_alta = [];
      if (menor_2_anos) {
        orientacoes_alta = [
          "Manter atividades habituais conforme recomendações para a idade",
          "Evitar situações com risco de trauma craniano",
          "Retornar imediatamente em caso de: sonolência excessiva, abaulamento da fontanela, vômitos persistentes, irritabilidade excessiva, alteração do comportamento, convulsões"
        ];
      } else {
        orientacoes_alta = [
          "Repouso nas primeiras 24 horas",
          "Medicamentos para dor conforme prescrição médica",
          "Retornar imediatamente em caso de: dor de cabeça persistente, vômitos, alteração do comportamento, sonolência excessiva, fraqueza ou formigamento, convulsões"
        ];
      }
      
      // Resultado final
      return {
        idade_meses,
        menor_2_anos,
        glasgow: resultado_glasgow,
        recomendacao_tc,
        recomendacoes,
        criterios_internacao,
        motivos_internacao,
        orientacoes_alta: criterios_internacao ? [] : orientacoes_alta
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para TCE:", error);
      throw new Error("Não foi possível calcular as recomendações para Trauma Cranioencefálico");
    }
  }
}

// Exporta uma instância do controlador
const controller = new TraumaCranioencefalicoController();
export default controller;
