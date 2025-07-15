class DoencaDiarreicaController {
  constructor() {
    // Critérios de avaliação para desidratação
    this.sinais_sem_desidratacao = [
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
    
    this.sinais_desidratacao_leve_moderada = [
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
    
    this.sinais_desidratacao_grave = [
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
    this.plano_a = {
      titulo: "Plano A (para prevenir a desidratação no domicílio)",
      instrucoes: [
        "Oferecer ou ingerir mais líquido que o habitual para prevenir a desidratação",
        "O paciente deve tomar líquidos caseiros (água de arroz, soro caseiro, chás, sucos e sopas) ou solução de reidratação oral (SRO) após cada evacuação diarreica",
        "Não utilizar refrigerante e não adoçar o chá",
        "Continuar o aleitamento materno",
        "Manter a alimentação habitual para as crianças e os adultos",
        "Administrar zinco uma vez ao dia durante 10 a 14 dias (até 6 meses: 10 mg/dia; maiores de 6 meses: 20 mg/dia)"
      ],
      sinais_alerta: [
        "Piora na diarreia",
        "Vômitos repetidos",
        "Muita sede",
        "Recusa de alimento",
        "Sangue nas fezes",
        "Diminuição da diurese"
      ]
    };
    
    this.plano_b = {
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
    
    this.plano_c = {
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
  }

  calcularPerdaLiquidos(peso, grau_desidratacao) {
    /**
     * Calcula a perda de líquidos com base no peso e grau de desidratação
     */
    try {
      let percentual_perda = 0;
      
      if (grau_desidratacao === "leve") {
        percentual_perda = 0.05;  // 5% do peso corporal
      } else if (grau_desidratacao === "moderada") {
        percentual_perda = 0.075;  // 7.5% do peso corporal
      } else if (grau_desidratacao === "grave") {
        percentual_perda = 0.1;  // 10% do peso corporal
      }
          
      const perda_ml = peso * 1000 * percentual_perda;
      return perda_ml;
    } catch (error) {
      console.error("Erro ao calcular perda de líquidos:", error);
      throw new Error("Não foi possível calcular a perda de líquidos");
    }
  }
  
  calcularTRO(peso, grau_desidratacao) {
    /**
     * Calcula o volume de TRO (Terapia de Reidratação Oral) necessário
     */
    try {
      if (grau_desidratacao === "sem_desidratacao") {
        return "Oferecer 10ml/kg após cada evacuação líquida.";
      }
      
      const volume_minimo = 50 * peso;  // 50ml/kg
      const volume_maximo = 100 * peso;  // 100ml/kg
      
      return `${Math.round(volume_minimo)}-${Math.round(volume_maximo)} ml em 4-6 horas`;
    } catch (error) {
      console.error("Erro ao calcular TRO:", error);
      throw new Error("Não foi possível calcular o volume de TRO");
    }
  }
  
  avaliarDiarreiaSangue(diarreia_sangue, dias_duracao, febre_alta) {
    /**
     * Avalia recomendações para diarreia com sangue
     */
    try {
      const recomendacoes = [];
      
      if (diarreia_sangue) {
        recomendacoes.push("Considerar coleta de coprocultura");
          
        if (febre_alta || dias_duracao > 3) {
          recomendacoes.push("Considerar antibioticoterapia empírica para Shigella, Salmonella ou Campylobacter");
          recomendacoes.push("Opções de antibióticos: Azitromicina, Ciprofloxacino ou Ceftriaxona (conforme protocolo local)");
        }
          
        recomendacoes.push("Manter observação clínica para sinais de toxemia");
      }
          
      return recomendacoes;
    } catch (error) {
      console.error("Erro ao avaliar diarreia com sangue:", error);
      throw new Error("Não foi possível avaliar diarreia com sangue");
    }
  }
  
  avaliarDiarreiaPersistente(dias_duracao) {
    /**
     * Avalia recomendações para diarreia persistente (>14 dias)
     */
    try {
      const recomendacoes = [];
      
      if (dias_duracao >= 14) {
        recomendacoes.push("Solicitar EPF seriado (3 amostras)");
        recomendacoes.push("Considerar coprocultura");
        recomendacoes.push("Avaliar presença de leucócitos fecais");
        recomendacoes.push("Considerar investigação para intolerâncias alimentares");
        recomendacoes.push("Avaliar necessidade de consulta com especialista (gastroenterologista pediátrico)");
      }
          
      return recomendacoes;
    } catch (error) {
      console.error("Erro ao avaliar diarreia persistente:", error);
      throw new Error("Não foi possível avaliar diarreia persistente");
    }
  }
  
  gerarRecomendacoesAdicionais(idade_meses, aleitamento_materno) {
    /**
     * Gera recomendações adicionais com base na idade e histórico de aleitamento
     */
    try {
      const recomendacoes = [];
      
      // Recomendações para zinco
      if (idade_meses < 6) {
        recomendacoes.push("Administrar zinco 10 mg/dia por 10-14 dias");
      } else {
        recomendacoes.push("Administrar zinco 20 mg/dia por 10-14 dias");
      }
      
      // Recomendações para alimentação
      if (aleitamento_materno) {
        recomendacoes.push("Manter aleitamento materno durante todo o episódio diarreico");
      }
      
      recomendacoes.push("Não interromper a alimentação durante o episódio de diarreia");
      recomendacoes.push("Preferir alimentos de fácil digestão e evitar alimentos gordurosos, açúcares simples e refrigerantes");
      
      // Recomendações probióticos
      recomendacoes.push("Considerar uso de probióticos (Saccharomyces boulardii, Lactobacillus GG) como adjuvantes");
      
      return recomendacoes;
    } catch (error) {
      console.error("Erro ao gerar recomendações adicionais:", error);
      throw new Error("Não foi possível gerar recomendações adicionais");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getSinaisSemDesidratacao() {
    return this.sinais_sem_desidratacao;
  }
  
  getSinaisDesidratacaoLeveModerada() {
    return this.sinais_desidratacao_leve_moderada;
  }
  
  getSinaisDesidratacaoGrave() {
    return this.sinais_desidratacao_grave;
  }
  
  getPlanoA() {
    return this.plano_a;
  }
  
  getPlanoB() {
    return this.plano_b;
  }
  
  getPlanoC() {
    return this.plano_c;
  }
  
  calcular(dados) {
    /**
     * Método principal para calcular recomendações com base nos dados fornecidos
     */
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade_meses = parseInt(dados.idade_meses || 0);
      const dias_duracao = parseInt(dados.dias_duracao || 1);
      
      // Sinais de desidratação selecionados
      const sinais_desidratacao = {
        alerta: dados.alerta || true,
        olhos_fundos: dados.olhos_fundos || false,
        mucosas_secas: dados.mucosas_secas || false,
        turgor_diminuido: dados.turgor_diminuido || false,
        sede_aumentada: dados.sede_aumentada || false,
        lagrimas_ausentes: dados.lagrimas_ausentes || false,
        respiracao_rapida: dados.respiracao_rapida || false,
        pulso_rapido: dados.pulso_rapido || false,
        extremidades_frias: dados.extremidades_frias || false,
        pa_baixa: dados.pa_baixa || false,
        diurese_diminuida: dados.diurese_diminuida || false,
        letargia: dados.letargia || false,
        olhos_muito_fundos: dados.olhos_muito_fundos || false,
        mucosas_muito_secas: dados.mucosas_muito_secas || false,
        turgor_muito_diminuido: dados.turgor_muito_diminuido || false,
        incapaz_beber: dados.incapaz_beber || false,
        respiracao_acidotica: dados.respiracao_acidotica || false,
        pulso_ausente: dados.pulso_ausente || false,
        extremidades_cianoticas: dados.extremidades_cianoticas || false,
        pa_indetectavel: dados.pa_indetectavel || false,
        anuria: dados.anuria || false
      };
      
      // Outros dados clínicos
      const diarreia_sangue = dados.diarreia_sangue || false;
      const febre_alta = dados.febre_alta || false;
      const vomitos = dados.vomitos || false;
      const aleitamento_materno = dados.aleitamento_materno || false;
      
      // Determinar grau de desidratação
      let grau_desidratacao = "sem_desidratacao";
      const sinais_graves = [
        sinais_desidratacao.letargia, 
        sinais_desidratacao.olhos_muito_fundos,
        sinais_desidratacao.mucosas_muito_secas,
        sinais_desidratacao.turgor_muito_diminuido,
        sinais_desidratacao.incapaz_beber,
        sinais_desidratacao.respiracao_acidotica,
        sinais_desidratacao.pulso_ausente,
        sinais_desidratacao.extremidades_cianoticas,
        sinais_desidratacao.pa_indetectavel,
        sinais_desidratacao.anuria
      ];
      
      const sinais_moderados = [
        sinais_desidratacao.olhos_fundos,
        sinais_desidratacao.mucosas_secas,
        sinais_desidratacao.turgor_diminuido,
        sinais_desidratacao.sede_aumentada,
        sinais_desidratacao.lagrimas_ausentes,
        sinais_desidratacao.respiracao_rapida,
        sinais_desidratacao.pulso_rapido,
        sinais_desidratacao.extremidades_frias,
        sinais_desidratacao.pa_baixa,
        sinais_desidratacao.diurese_diminuida
      ];
      
      // Contar sinais de desidratação
      const contagem_sinais_graves = sinais_graves.filter(sinal => sinal).length;
      const contagem_sinais_moderados = sinais_moderados.filter(sinal => sinal).length;
      
      // Determinar grau de desidratação baseado nos sinais
      if (contagem_sinais_graves >= 1) {
        grau_desidratacao = "grave";
      } else if (contagem_sinais_moderados >= 2) {
        grau_desidratacao = "moderada";
      }
      
      // Selecionar plano de hidratação
      let plano_hidratacao = {};
      if (grau_desidratacao === "grave") {
        plano_hidratacao = this.plano_c;
      } else if (grau_desidratacao === "moderada") {
        plano_hidratacao = this.plano_b;
      } else {
        plano_hidratacao = this.plano_a;
      }
      
      // Calcular perda de líquidos estimada
      let perda_liquidos = 0;
      if (grau_desidratacao === "moderada") {
        perda_liquidos = this.calcularPerdaLiquidos(peso, "moderada");
      } else if (grau_desidratacao === "grave") {
        perda_liquidos = this.calcularPerdaLiquidos(peso, "grave");
      }
      
      // Calcular TRO para graus apropriados
      let tro = "";
      if (grau_desidratacao === "moderada") {
        tro = this.calcularTRO(peso, grau_desidratacao);
      }
      
      // Avaliar diarreia com sangue
      const recomendacoes_diarreia_sangue = this.avaliarDiarreiaSangue(diarreia_sangue, dias_duracao, febre_alta);
      
      // Avaliar diarreia persistente
      const recomendacoes_diarreia_persistente = this.avaliarDiarreiaPersistente(dias_duracao);
      
      // Gerar recomendações adicionais
      const recomendacoes_adicionais = this.gerarRecomendacoesAdicionais(idade_meses, aleitamento_materno);
      
      // Compilar resultado
      return {
        grau_desidratacao,
        perda_liquidos_estimada: Math.round(perda_liquidos),
        plano_hidratacao,
        tro: grau_desidratacao !== "grave" ? tro : "",
        criterios_internacao: grau_desidratacao === "grave" || (vomitos && dias_duracao > 3) || (idade_meses < 3 && dias_duracao > 3),
        diarreia_classificacao: diarreia_sangue ? "com sangue" : dias_duracao >= 14 ? "persistente" : "aguda",
        recomendacoes_diarreia_sangue,
        recomendacoes_diarreia_persistente,
        recomendacoes_adicionais
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para doença diarreica:", error);
      throw new Error("Não foi possível calcular as recomendações para doença diarreica");
    }
  }
}

// Exporta uma instância do controlador
const controller = new DoencaDiarreicaController();
export default controller;
