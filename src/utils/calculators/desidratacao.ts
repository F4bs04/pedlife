import { 
  DesidratacaoInput, 
  DesidratacaoResult 
} from '../../types/protocol-calculators';

export class DesidratacaoCalculator {
  private criteriosDesidratacao = {
    grau_i: {
      perdaPeso: "3 a 5%",
      criterios: [
        "Alerta",
        "Olhos normais",
        "Mucosas úmidas",
        "Sem alteração de turgor",
        "Lágrimas presentes",
        "Respiração normal",
        "Pulso normal",
        "Extremidades normais",
        "Pressão arterial normal",
        "Diurese normal"
      ]
    },
    grau_ii: {
      perdaPeso: "5 a 10%",
      criterios: [
        "Inquieto/irritado",
        "Olhos fundos",
        "Mucosas secas",
        "Turgor diminuído",
        "Lágrimas ausentes",
        "Respiração rápida",
        "Pulso rápido, fraco",
        "Extremidades frias",
        "Pressão arterial normal/baixa",
        "Diurese normal/baixa"
      ]
    },
    grau_iii: {
      perdaPeso: "> 10%",
      criterios: [
        "Letárgico/inconsciência",
        "Olhos muito fundos",
        "Mucosas muito secas",
        "Turgor muito diminuído",
        "Lágrimas ausentes",
        "Respiração acidótica",
        "Pulso fino/ausente",
        "Extremidades cianóticas",
        "Pressão arterial indetectável",
        "Diurese oligúria/anúria"
      ]
    }
  };

  private planosHidratacao = {
    plano_a: {
      titulo: "Plano A (para prevenir a desidratação no domicílio)",
      indicacoes: "Sem sinais de desidratação",
      instrucoes: [
        "Oferecer ou ingerir mais líquido que o habitual para prevenir a desidratação",
        "Manter a alimentação habitual para prevenir a desnutrição",
        "Retornar imediatamente se sinais de perigo (piora na diarreia, vômitos repetidos, muita sede, recusa alimentar, sangue nas fezes)",
        "Reconhecer os sinais de desidratação",
        "Preparar e administrar a solução de reidratação oral",
        "Administrar zinco uma vez ao dia durante 10 a 14 dias (10 mg/dia até 6 meses; 20 mg/dia > 6 meses)"
      ]
    },
    plano_b: {
      titulo: "Plano B (para tratar a desidratação por via oral na unidade de saúde)",
      indicacoes: "Desidratação leve a moderada",
      instrucoes: [
        "Administrar SRO continuamente, até desaparecerem os sinais de desidratação (50-100 ml/kg em 4-6 horas)",
        "Reavaliar o paciente seguindo as etapas de avaliação do estado de hidratação",
        "Se desaparecerem os sinais de desidratação, utilize o Plano A",
        "Se continuar desidratado, indicar a sonda nasogástrica (gastroclise)",
        "Se o paciente evoluir para desidratação grave, seguir o Plano C",
        "Orientar a reconhecer os sinais de desidratação, preparar e administrar SRO, medidas de higiene"
      ]
    },
    plano_c: {
      titulo: "Plano C (para tratar desidratação grave na unidade hospitalar)",
      indicacoes: "Desidratação grave",
      instrucoes: [
        "Fase rápida: SF 0,9% 20 ml/kg em 20-30 min, repetir se necessário até 3 vezes",
        "Fase de manutenção após reidratação: hidratação venosa conforme necessidade basal",
        "Avaliar o paciente continuamente. Se não houver melhora da desidratação, aumentar a velocidade de infusão",
        "Iniciar reidratação por via oral com SRO quando o paciente puder beber",
        "Interromper a via endovenosa quando o paciente puder ingerir SRO em quantidade suficiente",
        "Observar o paciente por pelo menos 6 horas após reidratação"
      ]
    }
  };

  private avaliacaoAusenciaDiurese = [
    "Pesquisar bexigoma: esvaziar se estiver presente",
    "Se bexigoma ausente, correr 10 ml/kg de SF 0,9% em 1h",
    "Reavaliar bexigoma: se ausente, administrar furosemida 1 mg/kg, até 2 vezes",
    "Se diurese ausente, pensar em insuficiência aguda pré-renal e iniciar procedimento"
  ];

  public calcularGrauDesidratacao(caracteristicas: DesidratacaoInput['caracteristicas']): 'grau_i' | 'grau_ii' | 'grau_iii' {
    const pontos = { grau_i: 0, grau_ii: 0, grau_iii: 0 };

    // Estado de consciência
    if (caracteristicas.alerta) pontos.grau_i += 1;
    if (caracteristicas.irritado) pontos.grau_ii += 1;
    if (caracteristicas.letargico) pontos.grau_iii += 1;

    // Olhos
    if (caracteristicas.olhosNormais) pontos.grau_i += 1;
    if (caracteristicas.olhosFundos) pontos.grau_ii += 1;
    if (caracteristicas.olhosMuitoFundos) pontos.grau_iii += 1;

    // Mucosas
    if (caracteristicas.mucosasUmidas) pontos.grau_i += 1;
    if (caracteristicas.mucosasSecas) pontos.grau_ii += 1;
    if (caracteristicas.mucosasMuitoSecas) pontos.grau_iii += 1;

    // Turgor
    if (caracteristicas.turgorNormal) pontos.grau_i += 1;
    if (caracteristicas.turgorDiminuido) pontos.grau_ii += 1;
    if (caracteristicas.turgorMuitoDiminuido) pontos.grau_iii += 1;

    // Lágrimas
    if (caracteristicas.lagrimasPresentes) pontos.grau_i += 1;
    if (caracteristicas.lagrimasAusentes) {
      pontos.grau_ii += 1;
      pontos.grau_iii += 1;
    }

    // Respiração
    if (caracteristicas.respiracaoNormal) pontos.grau_i += 1;
    if (caracteristicas.respiracaoRapida) pontos.grau_ii += 1;
    if (caracteristicas.respiracaoAcidotica) pontos.grau_iii += 1;

    // Pulso
    if (caracteristicas.pulsoNormal) pontos.grau_i += 1;
    if (caracteristicas.pulsoRapido) pontos.grau_ii += 1;
    if (caracteristicas.pulsoFinoAusente) pontos.grau_iii += 1;

    // Extremidades
    if (caracteristicas.extremidadesNormais) pontos.grau_i += 1;
    if (caracteristicas.extremidadesFrias) pontos.grau_ii += 1;
    if (caracteristicas.extremidadesCianoticas) pontos.grau_iii += 1;

    // Pressão arterial
    if (caracteristicas.paNormal) pontos.grau_i += 1;
    if (caracteristicas.paNormalBaixa) pontos.grau_ii += 1;
    if (caracteristicas.paIndetectavel) pontos.grau_iii += 1;

    // Diurese
    if (caracteristicas.diureseNormal) pontos.grau_i += 1;
    if (caracteristicas.diureseNormalBaixa) pontos.grau_ii += 1;
    if (caracteristicas.diureseOliguriaAnuria) pontos.grau_iii += 1;

    // Determinar o grau predominante
    if (pontos.grau_iii >= 3) return 'grau_iii';
    if (pontos.grau_ii >= 3) return 'grau_ii';
    return 'grau_i';
  }

  public recomendarPlano(grauDesidratacao: 'grau_i' | 'grau_ii' | 'grau_iii'): 'plano_a' | 'plano_b' | 'plano_c' {
    switch (grauDesidratacao) {
      case 'grau_iii':
        return 'plano_c';
      case 'grau_ii':
        return 'plano_b';
      default:
        return 'plano_a';
    }
  }

  public calcularVolumeSoro(pesoKg: number, grauDesidratacao: 'grau_i' | 'grau_ii' | 'grau_iii'): number {
    switch (grauDesidratacao) {
      case 'grau_iii':
        return pesoKg * 20; // 20 ml/kg para fase rápida
      case 'grau_ii':
        return pesoKg * 75; // Média de 50-100 ml/kg
      default:
        return 0; // Volume variável conforme sede
    }
  }

  public calcularManutencaoHidrica(pesoKg: number): number {
    if (pesoKg <= 10) {
      return pesoKg * 100;
    } else if (pesoKg <= 20) {
      return 1000 + ((pesoKg - 10) * 50);
    } else {
      return 1500 + ((pesoKg - 20) * 20);
    }
  }

  public calcularDeficitEstimado(pesoKg: number, grauDesidratacao: 'grau_i' | 'grau_ii' | 'grau_iii'): number {
    switch (grauDesidratacao) {
      case 'grau_i':
        return pesoKg * 40; // 4% (média de 3-5%)
      case 'grau_ii':
        return pesoKg * 75; // 7.5% (média de 5-10%)
      case 'grau_iii':
        return pesoKg * 100; // 10% (mínimo de >10%)
    }
  }

  public calcular(dados: DesidratacaoInput): DesidratacaoResult {
    const { pesoKg, idadeMeses, caracteristicas, diarreia } = dados;

    // Determinar o grau de desidratação
    const grauDesidratacao = this.calcularGrauDesidratacao(caracteristicas);

    // Recomendar plano de hidratação
    const planoRecomendado = this.recomendarPlano(grauDesidratacao);

    // Calcular volumes
    const volumeSoro = this.calcularVolumeSoro(pesoKg, grauDesidratacao);
    const manutencaoHidricaDiaria = this.calcularManutencaoHidrica(pesoKg);
    const deficitEstimado = this.calcularDeficitEstimado(pesoKg, grauDesidratacao);

    // Avaliar ausência de diurese
    const ausenciaDiurese = caracteristicas.diureseOliguriaAnuria || 
      (!caracteristicas.diureseNormal && !caracteristicas.diureseNormalBaixa);

    // Nomes amigáveis
    const nomeGrau = {
      grau_i: "Desidratação Leve (Grau I)",
      grau_ii: "Desidratação Moderada (Grau II)",
      grau_iii: "Desidratação Grave (Grau III)"
    };

    const nomePlano = {
      plano_a: "Plano A - Prevenção da desidratação (tratamento domiciliar)",
      plano_b: "Plano B - Reidratação Oral na unidade de saúde",
      plano_c: "Plano C - Reidratação venosa para desidratação grave"
    };

    const percentualDesidratacao = {
      grau_i: "3-5%",
      grau_ii: "5-10%",
      grau_iii: ">10%"
    };

    // Gerar recomendações específicas
    const recomendacoes: string[] = [];
    
    if (grauDesidratacao === 'grau_i') {
      recomendacoes.push("Oferecer SRO conforme sede, 50-100ml após cada evacuação líquida");
      recomendacoes.push("Manter aleitamento materno ou alimentação habitual");
      if (idadeMeses < 6) {
        recomendacoes.push("Suplementação de zinco: 10mg/dia por 10-14 dias");
      } else {
        recomendacoes.push("Suplementação de zinco: 20mg/dia por 10-14 dias");
      }
    } else if (grauDesidratacao === 'grau_ii') {
      recomendacoes.push(`Reidratação oral com SRO: ${volumeSoro}ml em 4-6 horas`);
      recomendacoes.push("Monitorar sinais de desidratação a cada 1-2 horas");
      recomendacoes.push("Reavaliar após período de reidratação");
      if (idadeMeses < 6) {
        recomendacoes.push("Suplementação de zinco: 10mg/dia por 10-14 dias");
      } else {
        recomendacoes.push("Suplementação de zinco: 20mg/dia por 10-14 dias");
      }
    } else {
      recomendacoes.push(`Fase rápida: ${volumeSoro}ml de SF 0,9% em 20-30 minutos`);
      recomendacoes.push("Reavaliar e repetir fase rápida até 2 vezes se necessário");
      recomendacoes.push(`Após estabilização: iniciar reposição do déficit de ${deficitEstimado}ml dividido em 24h`);
      recomendacoes.push(`Manutenção hídrica diária: ${manutencaoHidricaDiaria}ml`);
    }

    return {
      pesoKg,
      idadeMeses,
      grauDesidratacao,
      nomeGrau: nomeGrau[grauDesidratacao],
      percentualDesidratacao: percentualDesidratacao[grauDesidratacao],
      criterios: this.criteriosDesidratacao[grauDesidratacao].criterios,
      planoRecomendado,
      nomePlano: nomePlano[planoRecomendado],
      instrucoesPlano: this.planosHidratacao[planoRecomendado].instrucoes,
      volumeSoro,
      ausenciaDiurese,
      protocoloDiurese: ausenciaDiurese ? this.avaliacaoAusenciaDiurese : [],
      manutencaoHidricaDiaria,
      deficitEstimado,
      recomendacoes,
      diarreia
    };
  }
}

// Singleton instance
export const desidratacaoCalculator = new DesidratacaoCalculator();
