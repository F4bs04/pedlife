import type {
  DoencaDiarreicaInput,
  DoencaDiarreicaResult,
  DoencaDiarreicaPlanoHidratacao
} from '../../types/protocol-calculators';

/**
 * Calculadora para Doença Diarreica em Pediatria
 * Baseada nas diretrizes da OMS para manejo da diarreia e desidratação
 */
class DoencaDiarreicaCalculator {
  private sinaisSemDesidratacao = [
    "Alerta",
    "Olhos normais",
    "Mucosas úmidas",
    "Sem alteração de turgor cutâneo",
    "Sede normal/ausente",
    "Lágrimas presentes",
    "Respiração normal",
    "Pulso normal",
    "Extremidades aquecidas",
    "Pressão arterial normal",
    "Diurese normal"
  ];

  private sinaisDesidratacaoLeveModerada = [
    "Inquieto/irritado",
    "Olhos fundos",
    "Mucosas secas",
    "Turgor cutâneo diminuído",
    "Sede aumentada",
    "Lágrimas ausentes",
    "Respiração rápida",
    "Pulso rápido, fraco",
    "Extremidades frias",
    "Pressão arterial normal/baixa",
    "Diurese normal/baixa"
  ];

  private sinaisDesidratacaoGrave = [
    "Letárgico/inconsciente",
    "Olhos muito fundos",
    "Mucosas muito secas",
    "Turgor cutâneo muito diminuído",
    "Sede ausente (incapaz de beber)",
    "Lágrimas ausentes",
    "Respiração acidótica",
    "Pulso fino/ausente",
    "Extremidades cianóticas",
    "Pressão arterial indetectável",
    "Diurese oligúria/anúria"
  ];

  // Planos de tratamento
  private planoA: DoencaDiarreicaPlanoHidratacao = {
    titulo: "Plano A (para prevenir a desidratação no domicílio)",
    instrucoes: [
      "Oferecer ou ingerir mais líquido que o habitual para prevenir a desidratação",
      "O paciente deve tomar líquidos caseiros (água de arroz, soro caseiro, chás, sucos e sopas) ou solução de reidratação oral (SRO) após cada evacuação diarreica",
      "Não utilizar refrigerante e não adoçar o chá",
      "Continuar o aleitamento materno",
      "Manter a alimentação habitual para as crianças e os adultos",
      "Administrar zinco uma vez ao dia durante 10 a 14 dias (até 6 meses: 10 mg/dia; maiores de 6 meses: 20 mg/dia)"
    ],
    sinaisAlerta: [
      "Piora na diarreia",
      "Vômitos repetidos",
      "Muita sede",
      "Recusa de alimento",
      "Sangue nas fezes",
      "Diminuição da diurese"
    ]
  };

  private planoB: DoencaDiarreicaPlanoHidratacao = {
    titulo: "Plano B (para tratar a desidratação por via oral na unidade de saúde)",
    instrucoes: [
      "Administrar solução de reidratação oral (SRO)",
      "A quantidade de solução ingerida dependerá da sede do paciente",
      "A SRO deverá ser administrada continuamente, até que desapareçam os sinais de desidratação",
      "Como orientação inicial, o paciente deverá receber de 50 a 100 ml/kg para ser administrado no período de 4-6 horas",
      "Reavaliar o paciente periodicamente",
      "Se desaparecerem os sinais de desidratação, utilizar o Plano A",
      "Se continuar desidratado, indicar a sonda nasogástrica (gastroclise)",
      "Se o paciente evoluir para desidratação grave, seguir o Plano C"
    ]
  };

  private planoC: DoencaDiarreicaPlanoHidratacao = {
    titulo: "Plano C (para tratar desidratação grave na unidade hospitalar)",
    instrucoes: [
      "Etapa rápida: Soro fisiológico 0,9% 20 ml/kg em 20-30 minutos (repita até 3 vezes se necessário)",
      "Etapa de manutenção e reposição após estabilização",
      "Avaliar o paciente continuamente. Se não houver melhora da desidratação, aumentar a velocidade de infusão",
      "Quando o paciente puder beber, iniciar a reidratação por via oral com SRO, mantendo a endovenosa",
      "Interromper a reidratação por via endovenosa somente quando o paciente puder ingerir SRO em quantidade suficiente",
      "Observar o paciente por, pelo menos, seis horas após a reidratação"
    ]
  };

  /**
   * Calcula a perda de líquidos com base no peso e grau de desidratação
   */
  private calcularPerdaLiquidos(peso: number, grauDesidratacao: string): number {
    let percentualPerda = 0;

    if (grauDesidratacao === "leve") {
      percentualPerda = 0.05; // 5% do peso corporal
    } else if (grauDesidratacao === "moderada") {
      percentualPerda = 0.075; // 7.5% do peso corporal
    } else if (grauDesidratacao === "grave") {
      percentualPerda = 0.1; // 10% do peso corporal
    }

    const perdaMl = peso * 1000 * percentualPerda;
    return perdaMl;
  }

  /**
   * Calcula o volume de TRO (Terapia de Reidratação Oral) necessário
   */
  private calcularTRO(peso: number, grauDesidratacao: string): string {
    if (grauDesidratacao === "sem_desidratacao") {
      return "Oferecer 10ml/kg após cada evacuação líquida.";
    }

    const volumeMinimo = 50 * peso; // 50ml/kg
    const volumeMaximo = 100 * peso; // 100ml/kg

    return `${volumeMinimo.toFixed(0)}-${volumeMaximo.toFixed(0)} ml em 4-6 horas`;
  }

  /**
   * Avalia recomendações para diarreia com sangue
   */
  private avaliarDiarreiaSangue(diarreiaSangue: boolean, diasDuracao: number, febreAlta: boolean): string[] {
    const recomendacoes: string[] = [];

    if (diarreiaSangue) {
      recomendacoes.push("Considerar coleta de coprocultura");

      if (febreAlta || diasDuracao > 3) {
        recomendacoes.push("Considerar antibioticoterapia empírica para Shigella, Salmonella ou Campylobacter");
        recomendacoes.push("Opções de antibióticos: Azitromicina, Ciprofloxacino ou Ceftriaxona (conforme protocolo local)");
      }

      recomendacoes.push("Manter observação clínica para sinais de toxemia");
    }

    return recomendacoes;
  }

  /**
   * Avalia recomendações para diarreia persistente (>14 dias)
   */
  private avaliarDiarreiaPersistente(diasDuracao: number): string[] {
    const recomendacoes: string[] = [];

    if (diasDuracao >= 14) {
      recomendacoes.push("Solicitar EPF seriado (3 amostras)");
      recomendacoes.push("Considerar coprocultura");
      recomendacoes.push("Avaliar presença de leucócitos fecais");
      recomendacoes.push("Considerar investigação para intolerâncias alimentares");
      recomendacoes.push("Avaliar necessidade de consulta com especialista (gastroenterologista pediátrico)");
    }

    return recomendacoes;
  }

  /**
   * Gera recomendações adicionais com base na idade e histórico de aleitamento
   */
  private gerarRecomendacoesAdicionais(idadeMeses: number, aleitamentoMaterno: boolean): string[] {
    const recomendacoes: string[] = [];

    // Recomendações para zinco
    if (idadeMeses < 6) {
      recomendacoes.push("Administrar zinco 10 mg/dia por 10-14 dias");
    } else {
      recomendacoes.push("Administrar zinco 20 mg/dia por 10-14 dias");
    }

    // Recomendações para alimentação
    if (aleitamentoMaterno) {
      recomendacoes.push("Manter aleitamento materno durante todo o episódio diarreico");
    }

    recomendacoes.push("Não interromper a alimentação durante o episódio de diarreia");
    recomendacoes.push("Preferir alimentos de fácil digestão e evitar alimentos gordurosos, açúcares simples e refrigerantes");

    // Recomendações probióticos
    recomendacoes.push("Considerar uso de probióticos (Saccharomyces boulardii, Lactobacillus GG) como adjuvantes");

    return recomendacoes;
  }

  /**
   * Determina o grau de desidratação baseado nos sinais clínicos
   */
  private determinarGrauDesidratacao(sinais: DoencaDiarreicaInput['sinaisDesidratacao']): 'sem_desidratacao' | 'moderada' | 'grave' {
    // Sinais de desidratação grave
    const sinaisGraves = [
      sinais.letargia,
      sinais.olhosMuitoFundos,
      sinais.mucosasMuitoSecas,
      sinais.turgorMuitoDiminuido,
      sinais.incapazBeber,
      sinais.respiracaoAcidotica,
      sinais.pulsoAusente,
      sinais.extremidadesCianoticas,
      sinais.paIndetectavel,
      sinais.anuria
    ];

    // Sinais de desidratação moderada
    const sinaisModerados = [
      sinais.olhosFundos,
      sinais.mucosasSecas,
      sinais.turgorDiminuido,
      sinais.sedeAumentada,
      sinais.lagrimasAusentes,
      sinais.respiracaoRapida,
      sinais.pulsoRapido,
      sinais.extremidadesFrias,
      sinais.paBaixa,
      sinais.diureseDiminuida
    ];

    // Contar sinais de desidratação
    const contagemSinaisGraves = sinaisGraves.filter(sinal => sinal).length;
    const contagemSinaisModerados = sinaisModerados.filter(sinal => sinal).length;

    // Determinar grau de desidratação baseado nos sinais
    if (contagemSinaisGraves >= 1) {
      return 'grave';
    } else if (contagemSinaisModerados >= 2) {
      return 'moderada';
    } else {
      return 'sem_desidratacao';
    }
  }

  /**
   * Avalia critérios de internação
   */
  private avaliarCriteriosInternacao(
    grauDesidratacao: string,
    vomitos: boolean,
    diasDuracao: number,
    idadeMeses: number
  ): boolean {
    return grauDesidratacao === 'grave' || 
           (vomitos && diasDuracao > 3) || 
           (idadeMeses < 3 && diasDuracao > 3);
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: DoencaDiarreicaInput): DoencaDiarreicaResult {
    // Determinar grau de desidratação
    const grauDesidratacao = this.determinarGrauDesidratacao(dados.sinaisDesidratacao);

    // Selecionar plano de hidratação
    let planoHidratacao: DoencaDiarreicaPlanoHidratacao;
    if (grauDesidratacao === 'grave') {
      planoHidratacao = this.planoC;
    } else if (grauDesidratacao === 'moderada') {
      planoHidratacao = this.planoB;
    } else {
      planoHidratacao = this.planoA;
    }

    // Calcular perda de líquidos estimada
    let perdaLiquidos = 0;
    if (grauDesidratacao === 'moderada') {
      perdaLiquidos = this.calcularPerdaLiquidos(dados.peso, 'moderada');
    } else if (grauDesidratacao === 'grave') {
      perdaLiquidos = this.calcularPerdaLiquidos(dados.peso, 'grave');
    }

    // Calcular TRO para graus apropriados
    const tro = grauDesidratacao !== 'grave' ? this.calcularTRO(dados.peso, grauDesidratacao) : "";

    // Avaliar diarreia com sangue
    const recomendacoesDiarreiaSangue = this.avaliarDiarreiaSangue(
      dados.diarreiaSangue,
      dados.diasDuracao,
      dados.febreAlta
    );

    // Avaliar diarreia persistente
    const recomendacoesDiarreiaPersistente = this.avaliarDiarreiaPersistente(dados.diasDuracao);

    // Gerar recomendações adicionais
    const recomendacoesAdicionais = this.gerarRecomendacoesAdicionais(dados.idadeMeses, dados.aleitamentoMaterno);

    // Avaliar critérios de internação
    const criteriosInternacao = this.avaliarCriteriosInternacao(
      grauDesidratacao,
      dados.vomitos,
      dados.diasDuracao,
      dados.idadeMeses
    );

    // Determinar classificação da diarreia
    let diarreiaClassificacao: 'aguda' | 'persistente' | 'com sangue' = 'aguda';
    if (dados.diarreiaSangue) {
      diarreiaClassificacao = 'com sangue';
    } else if (dados.diasDuracao >= 14) {
      diarreiaClassificacao = 'persistente';
    }

    // Compilar resultado
    return {
      grauDesidratacao,
      perdaLiquidosEstimada: perdaLiquidos,
      planoHidratacao,
      tro,
      criteriosInternacao,
      diarreiaClassificacao,
      recomendacoesDiarreiaSangue,
      recomendacoesDiarreiaPersistente,
      recomendacoesAdicionais
    };
  }
}

// Instância singleton para uso global
export const doencaDiarreicaCalculator = new DoencaDiarreicaCalculator();
