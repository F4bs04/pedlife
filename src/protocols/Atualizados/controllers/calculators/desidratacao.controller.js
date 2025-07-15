class DesidratacaoController {
  constructor() {
    this.criterios_desidratacao = {
      grau_i: {
        perda_peso: "3 a 5%",
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
        perda_peso: "5 a 10%",
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
        perda_peso: "> 10%",
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
    
    this.planos_hidratacao = {
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
    
    this.avaliacao_ausencia_diurese = [
      "Pesquisar bexigoma: esvaziar se estiver presente",
      "Se bexigoma ausente, correr 10 ml/kg de SF 0,9% em 1h",
      "Reavaliar bexigoma: se ausente, administrar furosemida 1 mg/kg, até 2 vezes",
      "Se diurese ausente, pensar em insuficiência aguda pré-renal e iniciar procedimento"
    ];
  }

  calcularGrauDesidratacao(caracteristicas) {
    /**
     * Calcula o grau de desidratação com base nas características informadas
     */
    try {
      // Contabilizar pontos para cada grau
      const pontos = { grau_i: 0, grau_ii: 0, grau_iii: 0 };
      
      // Estado de consciência
      if (caracteristicas.alerta) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.irritado) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.letargico) {
        pontos.grau_iii += 1;
      }
        
      // Olhos
      if (caracteristicas.olhos_normais) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.olhos_fundos) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.olhos_muito_fundos) {
        pontos.grau_iii += 1;
      }
        
      // Mucosas
      if (caracteristicas.mucosas_umidas) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.mucosas_secas) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.mucosas_muito_secas) {
        pontos.grau_iii += 1;
      }
        
      // Turgor
      if (caracteristicas.turgor_normal) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.turgor_diminuido) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.turgor_muito_diminuido) {
        pontos.grau_iii += 1;
      }
        
      // Lágrimas
      if (caracteristicas.lagrimas_presentes) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.lagrimas_ausentes) {
        pontos.grau_ii += 1;
        pontos.grau_iii += 1;
      }
        
      // Respiração
      if (caracteristicas.respiracao_normal) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.respiracao_rapida) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.respiracao_acidotica) {
        pontos.grau_iii += 1;
      }
        
      // Pulso
      if (caracteristicas.pulso_normal) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.pulso_rapido) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.pulso_fino_ausente) {
        pontos.grau_iii += 1;
      }
        
      // Extremidades
      if (caracteristicas.extremidades_normais) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.extremidades_frias) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.extremidades_cianoticas) {
        pontos.grau_iii += 1;
      }
        
      // Pressão arterial
      if (caracteristicas.pa_normal) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.pa_normal_baixa) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.pa_indetectavel) {
        pontos.grau_iii += 1;
      }
        
      // Diurese
      if (caracteristicas.diurese_normal) {
        pontos.grau_i += 1;
      }
      if (caracteristicas.diurese_normal_baixa) {
        pontos.grau_ii += 1;
      }
      if (caracteristicas.diurese_oliguria_anuria) {
        pontos.grau_iii += 1;
      }
      
      // Determinar o grau predominante
      if (pontos.grau_iii >= 3) {
        return "grau_iii";
      } else if (pontos.grau_ii >= 3) {
        return "grau_ii";
      } else {
        return "grau_i";
      }
    } catch (error) {
      console.error("Erro ao calcular grau de desidratação:", error);
      throw new Error("Não foi possível calcular o grau de desidratação");
    }
  }
  
  recomendarPlano(grau_desidratacao) {
    /**
     * Recomenda o plano de hidratação adequado com base no grau de desidratação
     */
    try {
      if (grau_desidratacao === "grau_iii") {
        return "plano_c";
      } else if (grau_desidratacao === "grau_ii") {
        return "plano_b";
      } else {
        return "plano_a";
      }
    } catch (error) {
      console.error("Erro ao recomendar plano de hidratação:", error);
      throw new Error("Não foi possível recomendar o plano de hidratação");
    }
  }
  
  calcularVolumeSoro(peso_kg, grau_desidratacao) {
    /**
     * Calcula o volume de soro recomendado com base no peso e grau de desidratação
     */
    try {
      if (grau_desidratacao === "grau_iii") {
        // Para desidratação grave, fase rápida inicial
        return peso_kg * 20;  // 20 ml/kg
      } else if (grau_desidratacao === "grau_ii") {
        // Para desidratação moderada, TRO
        return peso_kg * 75;  // Média de 50-100 ml/kg
      } else {
        // Para desidratação leve, orientação de TRO domiciliar
        return 0;  // Volume variável conforme sede
      }
    } catch (error) {
      console.error("Erro ao calcular volume de soro:", error);
      throw new Error("Não foi possível calcular o volume de soro");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getCriteriosDesidratacao() {
    return this.criterios_desidratacao;
  }
  
  getPlanosHidratacao() {
    return this.planos_hidratacao;
  }
  
  getAvaliacaoAusenciaDiurese() {
    return this.avaliacao_ausencia_diurese;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      const peso_kg = parseFloat(dados.peso_kg || 0);
      const idade_meses = parseInt(dados.idade_meses || 0);
      
      // Coletar características para avaliação do grau de desidratação
      const caracteristicas = {
        // Estado de consciência
        alerta: dados.alerta || false,
        irritado: dados.irritado || false,
        letargico: dados.letargico || false,
        
        // Olhos
        olhos_normais: dados.olhos_normais || false,
        olhos_fundos: dados.olhos_fundos || false,
        olhos_muito_fundos: dados.olhos_muito_fundos || false,
        
        // Mucosas
        mucosas_umidas: dados.mucosas_umidas || false,
        mucosas_secas: dados.mucosas_secas || false,
        mucosas_muito_secas: dados.mucosas_muito_secas || false,
        
        // Turgor
        turgor_normal: dados.turgor_normal || false,
        turgor_diminuido: dados.turgor_diminuido || false,
        turgor_muito_diminuido: dados.turgor_muito_diminuido || false,
        
        // Lágrimas
        lagrimas_presentes: dados.lagrimas_presentes || false,
        lagrimas_ausentes: dados.lagrimas_ausentes || false,
        
        // Respiração
        respiracao_normal: dados.respiracao_normal || false,
        respiracao_rapida: dados.respiracao_rapida || false,
        respiracao_acidotica: dados.respiracao_acidotica || false,
        
        // Pulso
        pulso_normal: dados.pulso_normal || false,
        pulso_rapido: dados.pulso_rapido || false,
        pulso_fino_ausente: dados.pulso_fino_ausente || false,
        
        // Extremidades
        extremidades_normais: dados.extremidades_normais || false,
        extremidades_frias: dados.extremidades_frias || false,
        extremidades_cianoticas: dados.extremidades_cianoticas || false,
        
        // Pressão arterial
        pa_normal: dados.pa_normal || false,
        pa_normal_baixa: dados.pa_normal_baixa || false,
        pa_indetectavel: dados.pa_indetectavel || false,
        
        // Diurese
        diurese_normal: dados.diurese_normal || false,
        diurese_normal_baixa: dados.diurese_normal_baixa || false,
        diurese_oliguria_anuria: dados.diurese_oliguria_anuria || false
      };
      
      // Avaliar presença de diarreia
      const diarreia = dados.diarreia || false;
      
      // Determinar o grau de desidratação
      const grau_desidratacao = this.calcularGrauDesidratacao(caracteristicas);
      
      // Recomendar plano de hidratação
      const plano_recomendado = this.recomendarPlano(grau_desidratacao);
      
      // Calcular volume de soro recomendado
      const volume_soro = this.calcularVolumeSoro(peso_kg, grau_desidratacao);
      
      // Avaliar se há ausência de diurese
      const ausencia_diurese = dados.diurese_oliguria_anuria || (
        !dados.diurese_normal && !dados.diurese_normal_baixa
      );
      
      // Conversão para nomes mais amigáveis
      const nome_grau = {
        grau_i: "Desidratação Leve (Grau I)",
        grau_ii: "Desidratação Moderada (Grau II)",
        grau_iii: "Desidratação Grave (Grau III)"
      };
      
      const nome_plano = {
        plano_a: "Plano A - Prevenção da desidratação (tratamento domiciliar)",
        plano_b: "Plano B - Reidratação Oral na unidade de saúde",
        plano_c: "Plano C - Reidratação venosa para desidratação grave"
      };
      
      // Calcular percentual estimado de desidratação
      const percentual_desidratacao = {
        grau_i: "3-5%",
        grau_ii: "5-10%",
        grau_iii: ">10%"
      };
      
      // Calcular necessidades de manutenção hídrica (Holliday-Segar)
      let manutencao_hidrica_diaria = 0;
      if (peso_kg <= 10) {
        manutencao_hidrica_diaria = peso_kg * 100;
      } else if (peso_kg <= 20) {
        manutencao_hidrica_diaria = 1000 + ((peso_kg - 10) * 50);
      } else {
        manutencao_hidrica_diaria = 1500 + ((peso_kg - 20) * 20);
      }
      
      // Calcular déficit estimado de água
      let deficit_estimado = 0;
      if (grau_desidratacao === "grau_i") {
        deficit_estimado = peso_kg * 40;  // 4% (média de 3-5%)
      } else if (grau_desidratacao === "grau_ii") {
        deficit_estimado = peso_kg * 75;  // 7.5% (média de 5-10%)
      } else {
        deficit_estimado = peso_kg * 100;  // 10% (mínimo de >10%)
      }
      
      // Adicionar recomendações específicas
      const recomendacoes = [];
      if (grau_desidratacao === "grau_i") {
        recomendacoes.push("Oferecer SRO conforme sede, 50-100ml após cada evacuação líquida");
        recomendacoes.push("Manter aleitamento materno ou alimentação habitual");
        if (idade_meses < 6) {
          recomendacoes.push("Suplementação de zinco: 10mg/dia por 10-14 dias");
        } else {
          recomendacoes.push("Suplementação de zinco: 20mg/dia por 10-14 dias");
        }
      } else if (grau_desidratacao === "grau_ii") {
        recomendacoes.push(`Reidratação oral com SRO: ${Math.round(volume_soro)}ml em 4-6 horas`);
        recomendacoes.push("Monitorar sinais de desidratação a cada 1-2 horas");
        recomendacoes.push("Reavaliar após período de reidratação");
        if (idade_meses < 6) {
          recomendacoes.push("Suplementação de zinco: 10mg/dia por 10-14 dias");
        } else {
          recomendacoes.push("Suplementação de zinco: 20mg/dia por 10-14 dias");
        }
      } else {  // Desidratação grave
        recomendacoes.push(`Fase rápida: ${Math.round(volume_soro)}ml de SF 0,9% em 20-30 minutos`);
        recomendacoes.push("Reavaliar e repetir fase rápida até 2 vezes se necessário");
        recomendacoes.push(`Após estabilização: iniciar reposição do déficit de ${Math.round(deficit_estimado)}ml dividido em 24h`);
        recomendacoes.push(`Manutenção hídrica diária: ${Math.round(manutencao_hidrica_diaria)}ml`);
      }
      
      // Resultado final
      return {
        peso_kg,
        idade_meses,
        grau_desidratacao,
        nome_grau: nome_grau[grau_desidratacao],
        percentual_desidratacao: percentual_desidratacao[grau_desidratacao],
        criterios: this.criterios_desidratacao[grau_desidratacao].criterios,
        plano_recomendado,
        nome_plano: nome_plano[plano_recomendado],
        instrucoes_plano: this.planos_hidratacao[plano_recomendado].instrucoes,
        volume_soro,
        ausencia_diurese,
        protocolo_diurese: ausencia_diurese ? this.avaliacao_ausencia_diurese : [],
        manutencao_hidrica_diaria,
        deficit_estimado,
        diarreia,
        recomendacoes
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para desidratação:", error);
      throw new Error("Não foi possível calcular as recomendações para desidratação");
    }
  }
}

// Exporta uma instância do controlador
const controller = new DesidratacaoController();
export default controller;
