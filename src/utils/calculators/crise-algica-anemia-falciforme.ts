import type {
  CriseAlgicaAnemiaFalciformeInput,
  CriseAlgicaAnemiaFalciformeResult,
  CriseAlgicaAnemiaFalciformeMedicamento,
  CriseAlgicaAnemiaFalciformeHidratacao,
  CriseAlgicaAnemiaFalciformeComplicacao,
  CriseAlgicaAnemiaFalciformeInternacao,
  CriseAlgicaAnemiaFalciformeAvaliacao,
  CriseAlgicaAnemiaFalciformeRecomendacoes
} from '../../types/protocol-calculators';

/**
 * Calculadora para Crise Álgica de Anemia Falciforme em Pediatria
 * Baseada nas diretrizes para manejo da dor e complicações na anemia falciforme
 */
class CriseAlgicaAnemiaFalciformeCalculator {
  private tratamentoDorLeveModerada: CriseAlgicaAnemiaFalciformeMedicamento[] = [
    {
      medicamento: "Dipirona",
      dose: "10-15 mg/kg/dose VO ou IV a cada 6 horas",
      doseMaxima: "1g por dose"
    },
    {
      medicamento: "Paracetamol",
      dose: "10-15 mg/kg/dose VO a cada 6 horas",
      doseMaxima: "750 mg por dose"
    },
    {
      medicamento: "Ibuprofeno",
      dose: "5-10 mg/kg/dose VO a cada 8 horas",
      doseMaxima: "600 mg por dose",
      observacao: "Evitar em caso de comprometimento renal"
    },
    {
      medicamento: "Codeína",
      dose: "0,5-1 mg/kg/dose VO a cada 4-6 horas",
      doseMaxima: "60 mg por dose",
      observacao: "Associado a analgésicos simples"
    }
  ];

  private tratamentoDorModeradaIntensa: CriseAlgicaAnemiaFalciformeMedicamento[] = [
    {
      medicamento: "Tramadol",
      dose: "1-2 mg/kg/dose IV a cada 6-8 horas",
      doseMaxima: "100 mg por dose"
    },
    {
      medicamento: "Morfina",
      dose: "0,1-0,2 mg/kg/dose IV a cada 4-6 horas",
      observacao: "Pode ser administrada por PCA (analgesia controlada pelo paciente) em unidades que disponham desse recurso"
    },
    {
      medicamento: "Cetamina",
      dose: "0,1-0,2 mg/kg/dose IV",
      observacao: "Em casos refratários, sob supervisão de intensivista ou anestesista"
    }
  ];

  private criteriosAlta = [
    "Dor controlada com analgésicos orais",
    "Ausência de complicações agudas",
    "Tolerância à dieta via oral",
    "Paciente e família orientados quanto ao seguimento"
  ];

  private complicacoes = [
    {
      nome: "Síndrome Torácica Aguda",
      sinais: [
        "Dor torácica",
        "Hipoxemia",
        "Novo infiltrado pulmonar",
        "Febre"
      ],
      manejo: [
        "Antibioticoterapia de amplo espectro",
        "Oxigenioterapia",
        "Considerar transfusão simples ou exsanguíneo-transfusão"
      ]
    },
    {
      nome: "Sequestro Esplênico",
      sinais: [
        "Esplenomegalia aguda e dolorosa",
        "Anemia aguda",
        "Reticulocitose",
        "Choque hipovolêmico"
      ],
      manejo: [
        "Reposição volêmica",
        "Transfusão de concentrado de hemácias",
        "Monitoramento em UTI"
      ]
    },
    {
      nome: "Priapismo",
      sinais: [
        "Ereção dolorosa e prolongada",
        "Duração > 4 horas é considerada emergência"
      ],
      manejo: [
        "Hidratação",
        "Analgesia",
        "Micção frequente",
        "Intervenção urológica se duração > 4 horas"
      ]
    }
  ];

  /**
   * Calcula necessidades hídricas
   */
  private calcularHidratacao(peso: number, idadeAnos: number, tipoHidratacao: 'manutencao' | 'expansao'): number {
    let volumeHidratacao = 0;

    if (tipoHidratacao === 'manutencao') {
      // Cálculo pela fórmula de Holliday-Segar
      if (peso <= 10) {
        volumeHidratacao = peso * 100;
      } else if (peso <= 20) {
        volumeHidratacao = 1000 + (peso - 10) * 50;
      } else {
        volumeHidratacao = 1500 + (peso - 20) * 20;
      }

      // Ajuste para 1,5x manutenção em crise álgica
      volumeHidratacao = volumeHidratacao * 1.5;
    } else if (tipoHidratacao === 'expansao') {
      // Volume para expansão (10-20 ml/kg)
      volumeHidratacao = peso * 15; // 15 ml/kg como média
    }

    return volumeHidratacao;
  }

  /**
   * Calcula dose dos medicamentos com base no peso
   */
  private calcularDoseMedicacao(peso: number, medicamento: string, intensidadeDor: number): CriseAlgicaAnemiaFalciformeMedicamento {
    // Selecionar lista de medicamentos com base na intensidade da dor
    const listaMedicamentos = intensidadeDor < 7 ? this.tratamentoDorLeveModerada : this.tratamentoDorModeradaIntensa;

    // Buscar medicamento específico
    const medEncontrado = listaMedicamentos.find(med => 
      med.medicamento.toLowerCase() === medicamento.toLowerCase()
    );

    if (!medEncontrado) {
      throw new Error(`Medicamento ${medicamento} não encontrado`);
    }

    // Extrair valores da dose
    const doseInfo = medEncontrado.dose;
    const doseMatch = doseInfo.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?/);
    
    if (doseMatch) {
      const doseMin = parseFloat(doseMatch[1]) * peso;
      const doseMax = doseMatch[2] ? parseFloat(doseMatch[2]) * peso : doseMin;
      
      const resultado: CriseAlgicaAnemiaFalciformeMedicamento = {
        ...medEncontrado,
        doseCalculada: doseMatch[2] ? `${doseMin.toFixed(1)} - ${doseMax.toFixed(1)} mg` : `${doseMin.toFixed(1)} mg`
      };

      // Extrair frequência
      const frequenciaMatch = doseInfo.match(/a cada (\d+(?:-\d+)? horas?)/);
      if (frequenciaMatch) {
        resultado.frequencia = frequenciaMatch[1];
      }

      return resultado;
    }

    return medEncontrado;
  }

  /**
   * Avalia a gravidade da crise de dor
   */
  private avaliarGravidadeDor(
    intensidadeDor: number,
    sinaisToxicidade: boolean,
    hidratacao: string,
    ingestaOral: string,
    febre: string,
    temComplicacoes: boolean
  ): 'leve' | 'moderada' | 'intensa' {
    if (intensidadeDor >= 7 || sinaisToxicidade || temComplicacoes) {
      return 'intensa';
    } else if (intensidadeDor >= 4 || ingestaOral === 'prejudicada' || 
               hidratacao.includes('desidratado') || febre === 'moderada' || febre === 'alta') {
      return 'moderada';
    } else {
      return 'leve';
    }
  }

  /**
   * Recomenda medicamentos com base na gravidade da dor
   */
  private recomendarMedicamentos(peso: number, gravidadeDor: 'leve' | 'moderada' | 'intensa'): CriseAlgicaAnemiaFalciformeMedicamento[] {
    const listaMedicamentos = gravidadeDor === 'intensa' ? this.tratamentoDorModeradaIntensa : this.tratamentoDorLeveModerada;
    
    return listaMedicamentos.map(med => {
      try {
        return this.calcularDoseMedicacao(peso, med.medicamento, gravidadeDor === 'intensa' ? 8 : 5);
      } catch {
        return med;
      }
    });
  }

  /**
   * Avalia necessidade de internação
   */
  private avaliarNecessidadeInternacao(
    gravidadeDor: string,
    complicacoes: string[],
    vomitosPersistentes: boolean,
    febreAlta: boolean
  ): CriseAlgicaAnemiaFalciformeInternacao {
    let necessitaInternacao = false;
    const justificativas: string[] = [];

    if (gravidadeDor === 'intensa') {
      necessitaInternacao = true;
      justificativas.push("Dor intensa (7-10/10)");
    }

    if (complicacoes.length > 0) {
      necessitaInternacao = true;
      justificativas.push(`Presença de complicações: ${complicacoes.join(', ')}`);
    }

    if (vomitosPersistentes) {
      necessitaInternacao = true;
      justificativas.push("Vômitos persistentes");
    }

    if (febreAlta) {
      necessitaInternacao = true;
      justificativas.push("Febre alta");
    }

    return {
      necessitaInternacao,
      justificativas
    };
  }

  /**
   * Recomenda exames baseados na gravidade e complicações
   */
  private recomendarExames(gravidadeDor: string, complicacoes: string[]): string[] {
    const examesRecomendados = [
      "Hemograma completo",
      "Reticulócitos",
      "Função renal (ureia e creatinina)",
      "Eletrólitos (sódio, potássio)"
    ];

    if (gravidadeDor === 'intensa' || complicacoes.length > 0) {
      examesRecomendados.push(
        "Proteína C reativa",
        "Hemoculturas (se febre)",
        "Bilirrubinas (total e frações)",
        "DHL",
        "Transaminases hepáticas"
      );

      if (complicacoes.includes('sintomas respiratórios') || complicacoes.includes('dor torácica')) {
        examesRecomendados.push("Radiografia de tórax");
      }

      if (complicacoes.includes('sintomas abdominais')) {
        examesRecomendados.push("Ultrassonografia abdominal");
      }
    }

    return examesRecomendados;
  }

  /**
   * Identifica complicações selecionadas
   */
  private identificarComplicacoes(dados: CriseAlgicaAnemiaFalciformeInput): string[] {
    const complicacoesSelecionadas: string[] = [];

    if (dados.sintomas.sintomasRespiratorios) {
      complicacoesSelecionadas.push('sintomas respiratórios');
    }
    if (dados.sintomas.dorToracica) {
      complicacoesSelecionadas.push('dor torácica');
    }
    if (dados.sintomas.sintomasAbdominais) {
      complicacoesSelecionadas.push('sintomas abdominais');
    }
    if (dados.sintomas.priapismo) {
      complicacoesSelecionadas.push('priapismo');
    }
    if (dados.sintomas.seqestroEsplenico) {
      complicacoesSelecionadas.push('sequestro esplênico');
    }

    return complicacoesSelecionadas;
  }

  /**
   * Gera recomendações específicas para complicações
   */
  private gerarRecomendacoesComplicacoes(complicacoesSelecionadas: string[]): CriseAlgicaAnemiaFalciformeComplicacao[] {
    const recomendacoesComplicacoes: CriseAlgicaAnemiaFalciformeComplicacao[] = [];

    for (const complicacao of this.complicacoes) {
      const nomeComplicacao = complicacao.nome.toLowerCase();
      
      const temComplicacao = complicacoesSelecionadas.some(comp => {
        if (comp === 'priapismo' && nomeComplicacao.includes('priapismo')) return true;
        if (comp === 'sequestro esplênico' && nomeComplicacao.includes('sequestro')) return true;
        if ((comp === 'sintomas respiratórios' || comp === 'dor torácica') && nomeComplicacao.includes('torácica')) return true;
        return false;
      });

      if (temComplicacao) {
        recomendacoesComplicacoes.push({
          nome: complicacao.nome,
          manejo: complicacao.manejo
        });
      }
    }

    return recomendacoesComplicacoes;
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: CriseAlgicaAnemiaFalciformeInput): CriseAlgicaAnemiaFalciformeResult {
    // Identificar complicações
    const complicacoesSelecionadas = this.identificarComplicacoes(dados);

    // Avaliar gravidade da dor
    const gravidadeDor = this.avaliarGravidadeDor(
      dados.intensidadeDor,
      dados.sinaisToxicidade,
      dados.hidratacao,
      dados.ingestaOral,
      dados.febre,
      complicacoesSelecionadas.length > 0
    );

    // Calcular hidratação
    const volumeManutencao = this.calcularHidratacao(dados.peso, dados.idadeAnos, 'manutencao');
    const volumeExpansao = gravidadeDor === 'intensa' ? 
      this.calcularHidratacao(dados.peso, dados.idadeAnos, 'expansao') : undefined;

    // Recomendar medicamentos
    const medicamentosRecomendados = this.recomendarMedicamentos(dados.peso, gravidadeDor);

    // Avaliar necessidade de internação
    const avaliacaoInternacao = this.avaliarNecessidadeInternacao(
      gravidadeDor,
      complicacoesSelecionadas,
      dados.vomitosPersistentes,
      dados.febre === 'alta'
    );

    // Recomendar exames
    const examesRecomendados = this.recomendarExames(gravidadeDor, complicacoesSelecionadas);

    // Recomendações específicas para complicações
    const recomendacoesComplicacoes = this.gerarRecomendacoesComplicacoes(complicacoesSelecionadas);

    // Montar resultado
    const resultado: CriseAlgicaAnemiaFalciformeResult = {
      dadosPaciente: {
        peso: dados.peso,
        idadeAnos: dados.idadeAnos,
        intensidadeDor: dados.intensidadeDor
      },
      avaliacao: {
        gravidadeDor,
        complicacoes: complicacoesSelecionadas
      },
      recomendacoes: {
        hidratacao: {
          volumeManutencao: Math.round(volumeManutencao),
          volumeManutencaoHora: Math.round(volumeManutencao / 24),
          volumeExpansao: volumeExpansao ? Math.round(volumeExpansao) : undefined
        },
        medicamentos: medicamentosRecomendados,
        exames: examesRecomendados,
        complicacoes: recomendacoesComplicacoes
      },
      internacao: avaliacaoInternacao,
      criteriosAlta: !avaliacaoInternacao.necessitaInternacao ? this.criteriosAlta : []
    };

    return resultado;
  }
}

// Instância singleton para uso global
export const criseAlgicaAnemiaFalciformeCalculator = new CriseAlgicaAnemiaFalciformeCalculator();
