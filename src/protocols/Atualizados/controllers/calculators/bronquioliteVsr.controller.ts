class BronquioliteVsrController {
  escala_wang: any[];
  criterios_internacao: string[];
  criterios_alta: string[];
  
  constructor() {
    // Escala de Wang para bronquiolite
    this.escala_wang = [
      {
        parametro: "Sibilos",
        pontuacao: [
          {pontos: 0, criterio: "Nenhum"},
          {pontos: 1, criterio: "Final da expiração, audível apenas com estetoscópio"},
          {pontos: 2, criterio: "Durante toda expiração, audível com estetoscópio"},
          {pontos: 3, criterio: "Durante inspiração e expiração, audível sem estetoscópio"}
        ]
      },
      {
        parametro: "Tiragem",
        pontuacao: [
          {pontos: 0, criterio: "Nenhuma"},
          {pontos: 1, criterio: "Tiragem intercostal inferior"},
          {pontos: 2, criterio: "Tiragem intercostal inferior e superior"},
          {pontos: 3, criterio: "Tiragem intercostal inferior e superior + batimento de asa de nariz"}
        ]
      },
      {
        parametro: "Saturação O2",
        pontuacao: [
          {pontos: 0, criterio: "> 95%"},
          {pontos: 1, criterio: "94-95%"},
          {pontos: 2, criterio: "90-93%"},
          {pontos: 3, criterio: "< 90%"}
        ]
      }
    ];
    
    this.criterios_internacao = [
      "Saturação de O2 < 92% persistente",
      "Frequência respiratória > 70 irpm",
      "Apneia",
      "Dificuldade para alimentação (recusa alimentar ou vômitos)",
      "Desidratação",
      "Idade < 3 meses",
      "Prematuridade < 34 semanas",
      "Doença pulmonar crônica",
      "Cardiopatia congênita",
      "Imunodeficiência"
    ];
    
    this.criterios_alta = [
      "Saturação de O2 > 92% em ar ambiente por pelo menos 4 horas",
      "Frequência respiratória adequada para idade",
      "Ausência de apneia por 24 horas",
      "Capacidade de alimentação adequada",
      "Ausência de sinais de desidratação",
      "Melhora do padrão respiratório"
    ];
  }

  calcularEscalaWang(sibilos: number, tiragem: number, saturacao: number): any {
    try {
      const pontuacaoSibilos = Math.min(Math.max(sibilos, 0), 3);
      const pontuacaoTiragem = Math.min(Math.max(tiragem, 0), 3);
      const pontuacaoSaturacao = Math.min(Math.max(saturacao, 0), 3);
      
      const scoreTotal = pontuacaoSibilos + pontuacaoTiragem + pontuacaoSaturacao;
      
      let classificacao = "";
      let gravidade = "";
      
      if (scoreTotal <= 2) {
        classificacao = "Leve";
        gravidade = "Baixo risco";
      } else if (scoreTotal <= 6) {
        classificacao = "Moderada";
        gravidade = "Risco intermediário";
      } else {
        classificacao = "Grave";
        gravidade = "Alto risco";
      }
      
      return {
        score_total: scoreTotal,
        classificacao: classificacao,
        gravidade: gravidade,
        detalhes: {
          sibilos: {pontos: pontuacaoSibilos, criterio: this.escala_wang[0].pontuacao[pontuacaoSibilos].criterio},
          tiragem: {pontos: pontuacaoTiragem, criterio: this.escala_wang[1].pontuacao[pontuacaoTiragem].criterio},
          saturacao: {pontos: pontuacaoSaturacao, criterio: this.escala_wang[2].pontuacao[pontuacaoSaturacao].criterio}
        }
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular escala de Wang");
    }
  }

  calcularFreqRespNormal(idadeMeses: number): any {
    try {
      let freqMin = 0;
      let freqMax = 0;
      
      if (idadeMeses < 2) {
        freqMin = 30;
        freqMax = 60;
      } else if (idadeMeses < 12) {
        freqMin = 24;
        freqMax = 50;
      } else if (idadeMeses < 24) {
        freqMin = 20;
        freqMax = 40;
      } else if (idadeMeses < 60) {
        freqMin = 20;
        freqMax = 35;
      } else {
        freqMin = 15;
        freqMax = 30;
      }
      
      return {
        minima: freqMin,
        maxima: freqMax,
        faixa_etaria: idadeMeses < 2 ? "< 2 meses" : 
                     idadeMeses < 12 ? "2-12 meses" :
                     idadeMeses < 24 ? "12-24 meses" :
                     idadeMeses < 60 ? "2-5 anos" : "> 5 anos"
      };
    } catch (error: any) {
      throw new Error("Erro ao calcular frequência respiratória normal");
    }
  }

  avaliarIndicacaoOxigenio(saturacao: number, score_wang: number): any {
    try {
      const indicacoes = [];
      let necessario = false;
      
      if (saturacao < 92) {
        indicacoes.push("Saturação de O2 < 92%");
        necessario = true;
      }
      
      if (score_wang >= 7) {
        indicacoes.push("Escore de Wang ≥ 7 (bronquiolite grave)");
        necessario = true;
      }
      
      if (saturacao >= 92 && saturacao <= 94 && score_wang >= 4) {
        indicacoes.push("Saturação limítrofe com sintomas moderados");
        necessario = true;
      }
      
      return {
        necessario: necessario,
        indicacoes: indicacoes,
        fluxo_recomendado: necessario ? "0,5-2 L/min" : "Não necessário",
        observacao: necessario ? "Manter saturação > 92%" : "Monitorar saturação"
      };
    } catch (error: any) {
      throw new Error("Erro ao avaliar indicação de oxigênio");
    }
  }

  avaliarCriteriosInternacao(dados: any): any {
    try {
      const criteriosPresentes = [];
      let internacaoNecessaria = false;
      
      // Avaliar cada critério
      if (dados.saturacao_o2 && dados.saturacao_o2 < 92) {
        criteriosPresentes.push("Saturação de O2 < 92%");
        internacaoNecessaria = true;
      }
      
      if (dados.freq_respiratoria && dados.freq_respiratoria > 70) {
        criteriosPresentes.push("Frequência respiratória > 70 irpm");
        internacaoNecessaria = true;
      }
      
      if (dados.apneia) {
        criteriosPresentes.push("Presença de apneia");
        internacaoNecessaria = true;
      }
      
      if (dados.dificuldade_alimentacao) {
        criteriosPresentes.push("Dificuldade para alimentação");
        internacaoNecessaria = true;
      }
      
      if (dados.idade_meses && dados.idade_meses < 3) {
        criteriosPresentes.push("Idade < 3 meses");
        internacaoNecessaria = true;
      }
      
      if (dados.prematuro && dados.idade_gestacional && dados.idade_gestacional < 34) {
        criteriosPresentes.push("Prematuridade < 34 semanas");
        internacaoNecessaria = true;
      }
      
      if (dados.doenca_pulmonar_cronica) {
        criteriosPresentes.push("Doença pulmonar crônica");
        internacaoNecessaria = true;
      }
      
      if (dados.cardiopatia) {
        criteriosPresentes.push("Cardiopatia congênita");
        internacaoNecessaria = true;
      }
      
      if (dados.imunodeficiencia) {
        criteriosPresentes.push("Imunodeficiência");
        internacaoNecessaria = true;
      }
      
      return {
        internacao_necessaria: internacaoNecessaria,
        criterios_presentes: criteriosPresentes,
        total_criterios: criteriosPresentes.length
      };
    } catch (error: any) {
      throw new Error("Erro ao avaliar critérios de internação");
    }
  }

  calcular(dados: any): any {
    try {
      const idadeMeses = parseInt(dados.idade_meses || 0);
      const peso = parseFloat(dados.peso || 0);
      
      // Calcular Escala de Wang
      const sibilos = parseInt(dados.sibilos || 0);
      const tiragem = parseInt(dados.tiragem || 0);
      const saturacaoScore = parseInt(dados.saturacao_score || 0);
      
      const resultadoWang = this.calcularEscalaWang(sibilos, tiragem, saturacaoScore);
      
      // Frequência respiratória normal para idade
      const freqRespNormal = this.calcularFreqRespNormal(idadeMeses);
      
      // Avaliação da necessidade de oxigênio
      const saturacaoO2 = parseFloat(dados.saturacao_o2 || 95);
      const avaliacaoOxigenio = this.avaliarIndicacaoOxigenio(saturacaoO2, resultadoWang.score_total);
      
      // Critérios de internação
      const avaliacaoInternacao = this.avaliarCriteriosInternacao(dados);
      
      // Tratamento baseado na gravidade
      const tratamento = [];
      
      if (resultadoWang.classificacao === "Leve") {
        tratamento.push("Aspiração de vias aéreas superiores se necessário");
        tratamento.push("Hidratação adequada");
        tratamento.push("Monitorização da saturação de O2");
        tratamento.push("Observação por algumas horas");
      } else if (resultadoWang.classificacao === "Moderada") {
        tratamento.push("Aspiração cuidadosa de vias aéreas");
        tratamento.push("Oxigenoterapia se saturação < 92%");
        tratamento.push("Hidratação venosa se necessário");
        tratamento.push("Broncodilatador (test trial)");
        tratamento.push("Monitorização contínua");
      } else {
        tratamento.push("Oxigenoterapia obrigatória");
        tratamento.push("Aspiração cuidadosa e frequente");
        tratamento.push("Suporte ventilatório se necessário");
        tratamento.push("Hidratação venosa");
        tratamento.push("Monitorização em UTI");
        tratamento.push("Considerar surfactante ou CPAP");
      }
      
      // Orientações para alta (se aplicável)
      const orientacoesAlta = [];
      if (!avaliacaoInternacao.internacao_necessaria) {
        orientacoesAlta.push("Manter hidratação adequada");
        orientacoesAlta.push("Lavagem nasal com soro fisiológico");
        orientacoesAlta.push("Posição elevada para dormir");
        orientacoesAlta.push("Evitar contato com fumaça");
        orientacoesAlta.push("Retornar se piora dos sintomas");
        orientacoesAlta.push("Observar sinais de dificuldade respiratória");
      }
      
      return {
        avaliacao: {
          escala_wang: resultadoWang,
          freq_resp_normal: freqRespNormal,
          oxigenio: avaliacaoOxigenio,
          internacao: avaliacaoInternacao
        },
        tratamento: tratamento,
        orientacoes_alta: orientacoesAlta,
        criterios_observacao: this.criterios_alta,
        risco: resultadoWang.gravidade
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular tratamento da bronquiolite: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getEscalaWang(): any[] {
    return this.escala_wang;
  }
  
  getCriteriosInternacao(): string[] {
    return this.criterios_internacao;
  }
  
  getCriteriosAlta(): string[] {
    return this.criterios_alta;
  }
}

const controller = new BronquioliteVsrController();
export default controller;
