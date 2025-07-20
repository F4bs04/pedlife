import type { 
  CeluliteInput, 
  CeluliteResult, 
  CeluliteTratamento
} from '../../types/protocol-calculators';

/**
 * Calculadora para Celulite em Pediatria
 * Baseada nas diretrizes médicas para tratamento de celulite e critérios de internação
 */
class CeluliteCalculator {
  private tratamentosAmbulatoriais = [
    {
      escolha: "1ª escolha",
      medicamento: "Cefalexina",
      dosagem: "50 a 100 mg/kg/dia",
      frequencia: "a cada 6 horas",
      doseMaxima: "4 g/dia"
    },
    {
      escolha: "2ª escolha (alérgicos às penicilinas e cefalosporinas)",
      medicamento: "Claritromicina",
      dosagem: "15 mg/kg/dia",
      frequencia: "a cada 12 horas",
      doseMaxima: "1 g/dia"
    },
    {
      escolha: "3ª escolha",
      medicamento: "Amoxicilina com clavulanato",
      dosagem: "50 mg/kg/dia",
      frequencia: "a cada 8 a 12 horas, conforme apresentação",
      doseMaxima: "1,5 g/dia (componente amoxicilina)"
    }
  ];

  private tratamentosHospitalares = [
    {
      medicamento: "Oxacilina",
      dosagem: "200 mg/kg/dia",
      frequencia: "a cada 6 horas",
      doseMaxima: "12 g/dia"
    },
    {
      medicamento: "Ceftriaxona",
      dosagem: "100 mg/kg/dia",
      frequencia: "a cada 12 horas",
      doseMaxima: "4 g/dia"
    },
    {
      medicamento: "Amoxicilina com clavulanato",
      dosagem: "50 a 100 mg/kg/dia",
      frequencia: "a cada 8 horas",
      doseMaxima: "1,5 g/dia (componente amoxicilina)"
    },
    {
      medicamento: "Clindamicina",
      dosagem: "20 a 40 mg/kg/dia",
      frequencia: "divididos em 3 a 4 doses",
      doseMaxima: "2,7 g/dia",
      indicacao: "em crianças com sinais de sepse"
    }
  ];

  /**
   * Retorna os fatores de gravidade disponíveis
   */
  getFatoresGravidade(): string[] {
    return [
      "Idade < 3 meses",
      "Febre alta (≥ 38.5°C)",
      "Toxemia/comprometimento sistêmico",
      "Imunossupressão",
      "Áreas especiais (face, pescoço, área genital, mãos, pés)",
      "Extensão importante da lesão",
      "Presença de linfangite",
      "Falha no tratamento ambulatorial prévio",
      "Comorbidades significativas",
      "Limitação ao acompanhamento ambulatorial"
    ];
  }

  /**
   * Retorna os sintomas disponíveis para avaliação
   */
  getSintomas(): string[] {
    return [
      "Febre",
      "Toxemia",
      "Mal estar",
      "Manifestações locais (calor, edema, hiperemia, dor)",
      "Linfadenopatia satélite",
      "Vesículas/bolhas/pústulas sobre a pele acometida"
    ];
  }

  /**
   * Calcula a dose de medicamento baseada no peso
   */
  private calcularDose(medicamento: string, peso: number, dosagemRecomendada: string): number {
    // Extrai valores numéricos da dosagem
    const doseParts = dosagemRecomendada.split(' ')[0];
    let doseMedia: number;

    if (doseParts.includes('a')) {
      const [minDose, maxDose] = doseParts.split('a').map(d => parseFloat(d.trim()));
      doseMedia = (minDose + maxDose) / 2;
    } else {
      doseMedia = parseFloat(doseParts);
    }

    // Calcula a dose diária baseada no peso
    return doseMedia * peso;
  }

  /**
   * Calcula a gravidade da celulite e recomenda tratamento
   */
  calcular(dados: CeluliteInput): CeluliteResult {
    const {
      peso,
      idadeMeses,
      temperatura,
      sintomas,
      fatoresGravidade: fatoresGravidadeInput,
      areaEspecial,
      extensaoImportante,
      linfangite,
      alergiaToxico
    } = dados;

    // Copia os fatores de gravidade para modificação
    const fatoresGravidade = [...fatoresGravidadeInput];

    // Adicionar idade como fator de gravidade automaticamente se menor que 3 meses
    if (idadeMeses < 3 && !fatoresGravidade.includes("Idade < 3 meses")) {
      fatoresGravidade.push("Idade < 3 meses");
    }

    // Adicionar temperatura como fator de gravidade se ≥ 38.5°C
    if (temperatura >= 38.5 && !fatoresGravidade.includes("Febre alta (≥ 38.5°C)")) {
      fatoresGravidade.push("Febre alta (≥ 38.5°C)");
    }

    // Adicionar área especial se marcada
    if (areaEspecial && !fatoresGravidade.includes("Áreas especiais (face, pescoço, área genital, mãos, pés)")) {
      fatoresGravidade.push("Áreas especiais (face, pescoço, área genital, mãos, pés)");
    }

    // Adicionar extensão se marcada
    if (extensaoImportante && !fatoresGravidade.includes("Extensão importante da lesão")) {
      fatoresGravidade.push("Extensão importante da lesão");
    }

    // Adicionar linfangite se marcada
    if (linfangite && !fatoresGravidade.includes("Presença de linfangite")) {
      fatoresGravidade.push("Presença de linfangite");
    }

    // Calcular score de gravidade
    // Cada fator de gravidade adiciona 1 ponto
    let gravidadeScore = fatoresGravidade.length;
    // Cada sintoma adiciona 0.5 ponto
    gravidadeScore += sintomas.length * 0.5;

    // Determinar se precisa de internação
    let necessitaInternacao = false;
    const motivosInternacao: string[] = [];

    // Critérios de decisão para internação
    if (fatoresGravidade.length >= 2) {
      necessitaInternacao = true;
      motivosInternacao.push("Presença de múltiplos fatores de gravidade");
    }

    if (fatoresGravidade.includes("Toxemia/comprometimento sistêmico")) {
      necessitaInternacao = true;
      motivosInternacao.push("Presença de toxemia/comprometimento sistêmico");
    }

    if (idadeMeses < 1) {
      necessitaInternacao = true;
      motivosInternacao.push("Idade menor que 1 mês");
    }

    if (fatoresGravidade.includes("Imunossupressão")) {
      necessitaInternacao = true;
      motivosInternacao.push("Presença de imunossupressão");
    }

    // Determinar recomendação de tratamento
    const tratamentoRecomendado: CeluliteTratamento[] = [];

    if (necessitaInternacao) {
      // Para tratamento hospitalar
      const tratamentoPrimario = this.tratamentosHospitalares[0]; // Oxacilina como padrão

      // Se há sinais de sepse, adicionar Clindamicina
      if (fatoresGravidade.includes("Toxemia/comprometimento sistêmico")) {
        const tratamentoSecundario = this.tratamentosHospitalares[3]; // Clindamicina
        const doseSecundaria = this.calcularDose(
          tratamentoSecundario.medicamento,
          peso,
          tratamentoSecundario.dosagem
        );

        tratamentoRecomendado.push({
          tipo: "hospitalar",
          medicamento: tratamentoSecundario.medicamento,
          doseDiaria: doseSecundaria,
          dosePorKg: tratamentoSecundario.dosagem,
          frequencia: tratamentoSecundario.frequencia,
          observacao: "Indicada nos casos de toxemia/sepse"
        });
      }

      // Calcular dose do tratamento primário
      const dosePrimaria = this.calcularDose(
        tratamentoPrimario.medicamento,
        peso,
        tratamentoPrimario.dosagem
      );

      tratamentoRecomendado.push({
        tipo: "hospitalar",
        medicamento: tratamentoPrimario.medicamento,
        doseDiaria: dosePrimaria,
        dosePorKg: tratamentoPrimario.dosagem,
        frequencia: tratamentoPrimario.frequencia
      });

    } else {
      // Para tratamento ambulatorial
      let tratamentoPrimario = this.tratamentosAmbulatoriais[0]; // Cefalexina como padrão

      // Verificar se há alergia a penicilinas e cefalosporinas
      if (alergiaToxico) {
        tratamentoPrimario = this.tratamentosAmbulatoriais[1]; // Claritromicina
      }

      const dosePrimaria = this.calcularDose(
        tratamentoPrimario.medicamento,
        peso,
        tratamentoPrimario.dosagem
      );

      tratamentoRecomendado.push({
        tipo: "ambulatorial",
        medicamento: tratamentoPrimario.medicamento,
        doseDiaria: dosePrimaria,
        dosePorKg: tratamentoPrimario.dosagem,
        frequencia: tratamentoPrimario.frequencia,
        escolha: tratamentoPrimario.escolha
      });
    }

    // Construir recomendações gerais
    const recomendacoesGerais = [
      "Duração do tratamento: 7 a 14 dias, dependendo da gravidade da infecção",
      "Avaliação clínica para acompanhamento da evolução"
    ];

    if (necessitaInternacao) {
      recomendacoesGerais.push("Monitorização dos sinais vitais e estado geral");
      recomendacoesGerais.push("Avaliar coleta de hemoculturas antes do início da antibioticoterapia");
      recomendacoesGerais.push("Alta hospitalar após 24 a 48 horas afebril, com melhora do estado geral e dos parâmetros laboratoriais");
    } else {
      recomendacoesGerais.push("Retorno em 48-72 horas para reavaliação");
      recomendacoesGerais.push("Retornar antes se piora dos sintomas ou febre persistente");
    }

    // Medidas de suporte
    const medidasSuporte = [
      "Elevação de extremidades afetadas",
      "Higiene adequada da área afetada",
      "Compressas mornas locais (se não houver contraindicação)"
    ];

    if (extensaoImportante) {
      medidasSuporte.push("Avaliação para possível drenagem de abscessos, se estiverem presentes");
    }

    return {
      gravidadeScore,
      necessitaInternacao,
      motivosInternacao,
      fatoresGravidadeSelecionados: fatoresGravidade,
      sintomasSelecionados: sintomas,
      tratamentoRecomendado,
      recomendacoesGerais,
      medidasSuporte
    };
  }
}

// Instância singleton para uso global
export const celuliteCalculator = new CeluliteCalculator();
