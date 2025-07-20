import type {
  PolitraumatismoInput,
  PolitraumatismoResult,
  GlasgowScore,
  AvaliacaoViasAereas,
  AvaliacaoHemodinamica,
  RecomendacaoABCDE,
  AvaliacaoUTI
} from '../../types/protocol-calculators';

/**
 * Calculadora para Politraumatismo em Pediatria
 * Baseada no protocolo ABCDE e avaliação de trauma pediátrico
 */
class PolitraumatismoCalculator {
  private parametrosViasAereas = [
    "Respiração trabalhosa/ruidosa",
    "Taquipneia",
    "Bradipneia",
    "Respiração superficial",
    "Expansibilidade reduzida"
  ];

  private parametrosHemodinamicos = [
    "Taquicardia",
    "Pele fria e úmida",
    "Bradicardia",
    "Pulso fino/fraco/filiforme",
    "Débito urinário reduzido ou ausente",
    "Enchimento capilar prolongado",
    "Ansiedade/irritabilidade/confusão/letargia"
  ];

  private abcdeProtocolo = {
    "A": {
      titulo: "Airways – vias aéreas, com proteção da coluna cervical",
      avaliacoes: [
        "Permeabilidade das vias aéreas",
        "Estabilidade do pescoço",
        "Necessidade de intubação traqueal",
        "Necessidade de outras medidas de desobstrução"
      ]
    },
    "B": {
      titulo: "Breathing – respiração e ventilação",
      avaliacoes: [
        "Qualidade e frequência dos movimentos respiratórios",
        "Efetividade da oxigenação e ventilação",
        "Ausência de cianose",
        "Expansibilidade simétrica",
        "Saturação de O2 > 90%"
      ]
    },
    "C": {
      titulo: "Circulation – circulação com controle da hemorragia",
      avaliacoes: [
        "Controle de hemorragias externas",
        "Suporte da função cardiovascular",
        "Perfusão sistêmica",
        "Restauração do volume sanguíneo"
      ]
    },
    "D": {
      titulo: "Disability – incapacidade, estado neurológico",
      avaliacoes: [
        "Avaliação rápida do estado neurológico",
        "Escala de Coma de Glasgow",
        "Avaliação pupilar"
      ]
    },
    "E": {
      titulo: "Exposure – exposição com controle de ambiente",
      avaliacoes: [
        "Avaliação completa",
        "Proteção contra hipotermia",
        "Exame físico completo",
        "Reavaliações periódicas"
      ]
    }
  };

  private escalaGlasgow = {
    aberturaOlhos: [
      { escore: 4, criterio: "Espontaneamente", criterioMenor1Ano: "Espontaneamente" },
      { escore: 3, criterio: "Ao comando", criterioMenor1Ano: "A fala" },
      { escore: 2, criterio: "A dor", criterioMenor1Ano: "A dor" },
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
      { escore: 4, criterio: "Flexão a dor", criterioMenor1Ano: "Flexão a dor" },
      { escore: 3, criterio: "Flexão anormal a dor", criterioMenor1Ano: "Flexão anormal a dor" },
      { escore: 2, criterio: "Extensão anormal a dor", criterioMenor1Ano: "Extensão anormal a dor" },
      { escore: 1, criterio: "Nenhuma resposta", criterioMenor1Ano: "Nenhuma resposta" }
    ]
  };

  /**
   * Calcula o score total da Escala de Glasgow e avalia o nível de consciência
   */
  private calcularGlasgow(idadeMeses: number, aberturaOlhos: number, respostaVerbal: number, respostaMotora: number): GlasgowScore {
    const scoreTotal = aberturaOlhos + respostaVerbal + respostaMotora;

    let gravidade: 'Leve' | 'Moderado' | 'Grave';
    let alerta: string;

    if (scoreTotal <= 8) {
      gravidade = "Grave";
      alerta = "Alto risco - Intubação recomendada (Glasgow ≤ 8)";
    } else if (scoreTotal <= 12) {
      gravidade = "Moderado";
      alerta = "Risco moderado - Monitorização constante";
    } else {
      gravidade = "Leve";
      alerta = "Baixo risco - Observação regular";
    }

    return {
      scoreTotal,
      gravidade,
      alerta
    };
  }

  /**
   * Avalia o comprometimento das vias aéreas
   */
  private avaliarViasAereas(dados: PolitraumatismoInput): AvaliacaoViasAereas {
    const parametrosSelecionados: string[] = [];

    if (dados.respiracaoTrabalhosaRuidosa) parametrosSelecionados.push("Respiração trabalhosa/ruidosa");
    if (dados.taquipneia) parametrosSelecionados.push("Taquipneia");
    if (dados.bradipneia) parametrosSelecionados.push("Bradipneia");
    if (dados.respiracaoSuperficial) parametrosSelecionados.push("Respiração superficial");
    if (dados.expansibilidadeReduzida) parametrosSelecionados.push("Expansibilidade reduzida");

    let nivelComprometimento: 'Baixo' | 'Moderado' | 'Alto' = "Baixo";
    let intervencoes = ["Oferecer O2 suplementar"];

    if (parametrosSelecionados.length >= 3) {
      nivelComprometimento = "Alto";
      intervencoes = [
        "Oferecer O2 de alto fluxo",
        "Manutenção da coluna cervical",
        "Aspirar vias aéreas",
        "Avaliar necessidade de via aérea definitiva (intubação)"
      ];
    } else if (parametrosSelecionados.length >= 1) {
      nivelComprometimento = "Moderado";
      intervencoes = [
        "Oferecer O2 suplementar",
        "Manutenção da coluna cervical",
        "Aspirar vias aéreas se necessário",
        "Considerar cânula orofaríngea ou nasofaríngea"
      ];
    }

    return {
      parametros: parametrosSelecionados,
      nivelComprometimento,
      intervencoes
    };
  }

  /**
   * Avalia o comprometimento hemodinâmico
   */
  private avaliarHemodinamica(dados: PolitraumatismoInput): AvaliacaoHemodinamica {
    const parametrosSelecionados: string[] = [];

    if (dados.taquicardia) parametrosSelecionados.push("Taquicardia");
    if (dados.peleFriaUmida) parametrosSelecionados.push("Pele fria e úmida");
    if (dados.bradicardia) parametrosSelecionados.push("Bradicardia");
    if (dados.pulsoFinoFracoFiliforme) parametrosSelecionados.push("Pulso fino/fraco/filiforme");
    if (dados.debitoUrinarioReduzidoAusente) parametrosSelecionados.push("Débito urinário reduzido ou ausente");
    if (dados.enchimentoCapilarProlongado) parametrosSelecionados.push("Enchimento capilar prolongado");
    if (dados.ansiedadeIrritabilidadeConfusaoLetargia) parametrosSelecionados.push("Ansiedade/irritabilidade/confusão/letargia");

    let nivelComprometimento: 'Baixo' | 'Moderado' | 'Alto' = "Baixo";
    let intervencoes = ["Monitorização de sinais vitais"];

    if (parametrosSelecionados.length >= 3) {
      nivelComprometimento = "Alto";
      intervencoes = [
        "Reposição volêmica imediata (SF 0,9% 20ml/kg em bolus)",
        "Considerar segunda tentativa se resposta inadequada",
        "Considerar hemoderivados se resposta inadequada após 3 bolus",
        "Acesso vascular calibroso (considerar intraósseo)",
        "Identificação e controle de sangramentos",
        "Controle térmico"
      ];
    } else if (parametrosSelecionados.length >= 1) {
      nivelComprometimento = "Moderado";
      intervencoes = [
        "Reposição volêmica (SF 0,9% 20ml/kg)",
        "Controle de sangramento aparente",
        "Acesso venoso periférico",
        "Monitorização hemodinâmica contínua"
      ];
    }

    return {
      parametros: parametrosSelecionados,
      nivelComprometimento,
      intervencoes
    };
  }

  /**
   * Gera recomendações baseadas no protocolo ABCDE
   */
  private recomendarABCDE(glasgowScore: number): RecomendacaoABCDE[] {
    const recomendacoes: RecomendacaoABCDE[] = [];

    // A - Vias aéreas
    recomendacoes.push({
      etapa: "A - Vias aéreas",
      acoes: [
        "Verificar permeabilidade das vias aéreas",
        "Aplicar colar cervical",
        "Remover corpos estranhos se visíveis",
        "Aspirar secreções se necessário"
      ]
    });

    // B - Respiração
    recomendacoes.push({
      etapa: "B - Respiração",
      acoes: [
        "Avaliar frequência e padrão respiratório",
        "Auscultar tórax bilateralmente",
        "Oferecer oxigênio suplementar para manter SatO2 > 94%",
        "Observar simetria na expansão torácica"
      ]
    });

    // C - Circulação
    recomendacoes.push({
      etapa: "C - Circulação",
      acoes: [
        "Comprimir hemorragias externas",
        "Estabelecer acesso vascular (preferencialmente 2 acessos)",
        "Iniciar reposição volêmica conforme necessidade",
        "Monitorizar frequência cardíaca e pressão arterial"
      ]
    });

    // D - Incapacidade (Estado neurológico)
    const acaoesD = [
      "Avaliar nível de consciência (Escala de Glasgow)",
      "Verificar tamanho e reatividade das pupilas",
      "Avaliar movimentação dos quatro membros"
    ];

    if (glasgowScore <= 8) {
      acaoesD.push("Considerar intubação para proteção de via aérea (Glasgow ≤ 8)");
    }

    recomendacoes.push({
      etapa: "D - Incapacidade (Estado neurológico)",
      acoes: acaoesD
    });

    // E - Exposição
    recomendacoes.push({
      etapa: "E - Exposição",
      acoes: [
        "Expor completamente o paciente para avaliação",
        "Prevenir hipotermia com cobertores aquecidos",
        "Realizar exame físico completo",
        "Considerar radiografias de tórax, pelve e outros conforme indicação"
      ]
    });

    return recomendacoes;
  }

  /**
   * Avalia necessidade de internação em UTI
   */
  private avaliarNecessidadeUTI(glasgowScore: number, comprometimentoVA: string, comprometimentoHD: string): AvaliacaoUTI {
    const criteriosUTI: string[] = [];
    let necessidadeUTI = false;

    if (glasgowScore <= 8) {
      criteriosUTI.push("Glasgow ≤ 8");
      necessidadeUTI = true;
    }

    if (comprometimentoVA === "Alto") {
      criteriosUTI.push("Comprometimento grave das vias aéreas");
      necessidadeUTI = true;
    }

    if (comprometimentoHD === "Alto") {
      criteriosUTI.push("Instabilidade hemodinâmica significativa");
      necessidadeUTI = true;
    }

    return {
      necessidadeUTI,
      criterios: criteriosUTI
    };
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: PolitraumatismoInput): PolitraumatismoResult {
    const idadeTotalMeses = (dados.idadeAnos * 12) + dados.idadeMeses;

    // Calcular Glasgow
    const glasgow = this.calcularGlasgow(
      idadeTotalMeses,
      dados.aberturaOlhos,
      dados.respostaVerbal,
      dados.respostaMotora
    );

    // Avaliar comprometimento das vias aéreas
    const viasAereas = this.avaliarViasAereas(dados);

    // Avaliar comprometimento hemodinâmico
    const hemodinamica = this.avaliarHemodinamica(dados);

    // Recomendações ABCDE
    const recomendacoesABCDE = this.recomendarABCDE(glasgow.scoreTotal);

    // Avaliação de necessidade de UTI
    const avaliacaoUTI = this.avaliarNecessidadeUTI(
      glasgow.scoreTotal,
      viasAereas.nivelComprometimento,
      hemodinamica.nivelComprometimento
    );

    return {
      idade: {
        anos: dados.idadeAnos,
        meses: dados.idadeMeses,
        totalMeses: idadeTotalMeses
      },
      glasgow,
      viasAereas,
      hemodinamica,
      recomendacoesABCDE,
      avaliacaoUTI
    };
  }
}

// Instância singleton para uso global
export const politraumatismoCalculator = new PolitraumatismoCalculator();
