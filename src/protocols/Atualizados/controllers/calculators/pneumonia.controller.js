class PneumoniaController {
  constructor() {
    this.etiologia_por_idade = {
      "0-2_meses": [
        "Estreptococo do grupo B",
        "Enterobactérias",
        "Citomegalovírus",
        "Listeria monocytogenes",
        "Chlamydia trachomatis",
        "Ureaplasma urealyticum"
      ],
      "2_meses-5_anos": [
        "Vírus (VSR, Influenza, Parainfluenza, Adenovírus, Metapneumovírus)",
        "Streptococcus pneumoniae",
        "Haemophilus influenzae tipo B e não-tipável",
        "Staphylococcus aureus",
        "Mycoplasma pneumoniae"
      ],
      "acima_5_anos": [
        "Mycoplasma pneumoniae",
        "Chlamydophila pneumoniae",
        "Streptococcus pneumoniae",
        "Vírus (menos frequentes que em crianças menores)"
      ]
    };
    
    // Classificação de gravidade
    this.criterios_leve = [
      "Frequência respiratória < 60 irpm em lactentes",
      "Retrações leves ou ausentes",
      "Saturação de O₂ > 95% em ar ambiente",
      "Boa aceitação alimentar (> 75% da ingesta habitual)",
      "Ausência de toxemia"
    ];
    
    this.criterios_moderada = [
      "Frequência respiratória entre 60-70 irpm em lactentes",
      "Retrações moderadas",
      "Saturação de O₂ entre 90-95% em ar ambiente",
      "Dificuldade alimentar (50-75% da ingesta habitual)",
      "Irritabilidade"
    ];
    
    this.criterios_grave = [
      "Frequência respiratória > 70 irpm em lactentes",
      "Retrações graves (intercostais, subdiafragmáticas, supraesternais)",
      "Batimento de asa de nariz, gemência",
      "Saturação de O₂ < 90% em ar ambiente",
      "Incapacidade de alimentação (< 50% da ingesta habitual)",
      "Letargia",
      "Cianose",
      "Apneia"
    ];
    
    // Critérios de internação
    this.criterios_internacao = [
      "Hipoxemia (saturação de O₂ < 90-92% em ar ambiente)",
      "Desconforto respiratório moderado a grave",
      "Idade < 2-3 meses",
      "Prematuros < 35 semanas nas primeiras 12 semanas de vida",
      "Comorbidades (cardiopatia, pneumopatia, imunodeficiência)",
      "Incapacidade de manter hidratação adequada",
      "Condições sociais desfavoráveis",
      "Distância do serviço de saúde"
    ];
    
    // Critérios de UTI
    this.criterios_uti = [
      "Insuficiência respiratória com necessidade de ventilação mecânica",
      "Desconforto respiratório grave e progressivo",
      "Saturação de O₂ < 90% apesar de oxigenoterapia",
      "Acidose respiratória (pH < 7,25)"
    ];
    
    // Referências de Frequência Respiratória por idade
    this.fr_referencia = [
      { idade_meses: 0, idade_anos: 2, normal: "< 40", elevada: "≥ 40", alerta: "≥ 60" },
      { idade_meses: 24, idade_anos: 5, normal: "< 30", elevada: "≥ 30", alerta: "≥ 40" },
      { idade_meses: 60, idade_anos: 12, normal: "< 25", elevada: "≥ 25", alerta: "≥ 35" },
      { idade_meses: 144, idade_anos: 18, normal: "< 20", elevada: "≥ 20", alerta: "≥ 30" }
    ];
  }

  avaliarEtiologiaPorIdade(idade_meses) {
    /**
     * Determina prováveis agentes etiológicos conforme faixa etária
     */
    try {
      if (idade_meses < 2) {
        return this.etiologia_por_idade["0-2_meses"];
      } else if (idade_meses < 60) {
        return this.etiologia_por_idade["2_meses-5_anos"];
      } else {
        return this.etiologia_por_idade["acima_5_anos"];
      }
    } catch (error) {
      console.error("Erro ao avaliar etiologia por idade:", error);
      throw new Error("Não foi possível avaliar a etiologia por idade");
    }
  }
  
  avaliarFrReferencia(idade_meses) {
    /**
     * Determina referência de frequência respiratória conforme idade
     */
    try {
      for (const ref of this.fr_referencia) {
        if (idade_meses <= ref.idade_meses) {
          return ref;
        }
      }
      return this.fr_referencia[this.fr_referencia.length - 1];  // Última faixa etária se acima das listadas
    } catch (error) {
      console.error("Erro ao avaliar referência de frequência respiratória:", error);
      throw new Error("Não foi possível avaliar a referência de frequência respiratória");
    }
  }
  
  classificarGravidade(dados) {
    /**
     * Classifica a gravidade da pneumonia com base nos critérios clínicos
     */
    try {
      // Determinar pontuação de gravidade
      let pontos_grave = 0;
      let pontos_moderada = 0;
      let pontos_leve = 0;
      
      // Avaliação da frequência respiratória
      const idade_meses = parseInt(dados.idade_meses || 0);
      const fr = parseInt(dados.freq_respiratoria || 0);
      
      const ref_fr = this.avaliarFrReferencia(idade_meses);
      
      // Frequência respiratória
      if (idade_meses < 12) {  // Lactentes
        if (fr > 70) {
          pontos_grave += 1;
        } else if (fr >= 60) {
          pontos_moderada += 1;
        } else {
          pontos_leve += 1;
        }
      } else {
        // Converter os valores de referência (que são strings) para inteiros para comparação
        const alerta = parseInt(ref_fr.alerta.replace("≥ ", ""));
        const elevada = parseInt(ref_fr.elevada.replace("≥ ", ""));
        
        if (fr >= alerta) {
          pontos_grave += 1;
        } else if (fr >= elevada) {
          pontos_moderada += 1;
        } else {
          pontos_leve += 1;
        }
      }
      
      // Saturação de oxigênio
      const sao2 = parseInt(dados.saturacao_o2 || 98);
      if (sao2 < 90) {
        pontos_grave += 1;
      } else if (sao2 <= 95) {
        pontos_moderada += 1;
      } else {
        pontos_leve += 1;
      }
      
      // Retrações
      const retracoes = dados.retracoes || "ausentes";
      if (retracoes === "graves") {
        pontos_grave += 1;
      } else if (retracoes === "moderadas") {
        pontos_moderada += 1;
      } else {
        pontos_leve += 1;
      }
      
      // Aceitação alimentar
      const alimentacao = dados.alimentacao || "normal";
      if (alimentacao === "recusa") {
        pontos_grave += 1;
      } else if (alimentacao === "reduzida") {
        pontos_moderada += 1;
      } else {
        pontos_leve += 1;
      }
      
      // Estado geral
      const estado_geral = dados.estado_geral || "bom";
      if (estado_geral === "toxemiado") {
        pontos_grave += 1;
      } else if (estado_geral === "irritado") {
        pontos_moderada += 1;
      } else {
        pontos_leve += 1;
      }
      
      // Sinais específicos de gravidade
      if (dados.cianose || dados.apneia || dados.letargia) {
        pontos_grave += 1;
      }
      
      // Determinar classificação final
      let gravidade;
      if (pontos_grave >= 2) {
        gravidade = "grave";
      } else if (pontos_moderada >= 3 || pontos_grave === 1) {
        gravidade = "moderada";
      } else {
        gravidade = "leve";
      }
      
      return gravidade;
    } catch (error) {
      console.error("Erro ao classificar gravidade da pneumonia:", error);
      throw new Error("Não foi possível classificar a gravidade da pneumonia");
    }
  }
  
  avaliarNecessidadeInternacao(dados, gravidade) {
    /**
     * Avalia se há necessidade de internação hospitalar
     */
    try {
      const criterios_presentes = [];
      
      // Avaliar hipoxemia
      if (parseInt(dados.saturacao_o2 || 98) < 92) {
        criterios_presentes.push("Hipoxemia (saturação de O₂ < 92% em ar ambiente)");
      }
      
      // Avaliar desconforto respiratório
      if (gravidade === "moderada" || gravidade === "grave") {
        criterios_presentes.push("Desconforto respiratório moderado a grave");
      }
      
      // Avaliar idade
      const idade_meses = parseInt(dados.idade_meses || 0);
      if (idade_meses < 3) {
        criterios_presentes.push("Idade < 3 meses");
      }
      
      // Avaliar prematuridade
      if (dados.prematuro) {
        criterios_presentes.push("Prematuridade (< 35 semanas) nas primeiras 12 semanas de vida");
      }
      
      // Avaliar comorbidades
      if (dados.comorbidades) {
        criterios_presentes.push("Presença de comorbidades significativas");
      }
      
      // Avaliar capacidade de manter hidratação
      if (dados.alimentacao === "recusa") {
        criterios_presentes.push("Incapacidade de manter hidratação adequada");
      }
      
      // Avaliar condições sociais
      if (dados.condicoes_sociais_desfavoraveis) {
        criterios_presentes.push("Condições sociais desfavoráveis");
      }
      
      // Avaliar distância do serviço de saúde
      if (dados.dificuldade_acesso) {
        criterios_presentes.push("Dificuldade de acesso a serviço de saúde");
      }
      
      // Adicionais
      if (dados.falha_tratamento) {
        criterios_presentes.push("Falha do tratamento ambulatorial");
      }
      
      return { necessita_internacao: criterios_presentes.length > 0, criterios: criterios_presentes };
    } catch (error) {
      console.error("Erro ao avaliar necessidade de internação:", error);
      throw new Error("Não foi possível avaliar a necessidade de internação");
    }
  }
  
  avaliarNecessidadeUti(dados, gravidade) {
    /**
     * Avalia se há necessidade de cuidados intensivos
     */
    try {
      if (gravidade !== "grave") {
        return { necessita_uti: false, criterios: [] };
      }
      
      const criterios_presentes = [];
      
      if (dados.insuficiencia_respiratoria) {
        criterios_presentes.push("Insuficiência respiratória com necessidade de ventilação mecânica");
      }
      
      if (dados.desconforto_progressivo) {
        criterios_presentes.push("Desconforto respiratório grave e progressivo");
      }
      
      if (parseInt(dados.saturacao_o2 || 98) < 90 && dados.oxigenoterapia) {
        criterios_presentes.push("Saturação de O₂ < 90% apesar de oxigenoterapia");
      }
      
      if (dados.acidose_respiratoria) {
        criterios_presentes.push("Acidose respiratória (pH < 7,25)");
      }
      
      return { necessita_uti: criterios_presentes.length > 0, criterios: criterios_presentes };
    } catch (error) {
      console.error("Erro ao avaliar necessidade de UTI:", error);
      throw new Error("Não foi possível avaliar a necessidade de UTI");
    }
  }
  
  recomendarTratamento(dados, gravidade, avaliacao_internacao) {
    /**
     * Recomenda o tratamento adequado conforme gravidade e necessidade de internação
     */
    try {
      const idade_meses = parseInt(dados.idade_meses || 0);
      
      // Tratamento ambulatorial
      const tratamento_ambulatorial = {
        indicacao: !avaliacao_internacao.necessita_internacao,
        antibioticos: []
      };
      
      // Tratamento hospitalar
      const tratamento_hospitalar = {
        indicacao: avaliacao_internacao.necessita_internacao,
        antibioticos: []
      };
      
      // Recomendar antibióticos para tratamento ambulatorial
      if (2 <= idade_meses && idade_meses < 60) {  // 2 meses a 5 anos
        tratamento_ambulatorial.antibioticos.push({
          medicamento: "Amoxicilina",
          dose: "50-90 mg/kg/dia, dividido a cada 8 horas",
          duracao: "7-10 dias",
          primeira_linha: true
        });
        
        // Alternativas para alergia à penicilina
        tratamento_ambulatorial.antibioticos.push({
          medicamento: "Cefalosporinas de 1ª ou 2ª geração (alergia não anafilática)",
          dose: "Conforme medicamento",
          duracao: "7-10 dias",
          primeira_linha: false
        });
        
        tratamento_ambulatorial.antibioticos.push({
          medicamento: "Macrolídeos (alergia anafilática)",
          dose: "Azitromicina 10 mg/kg no primeiro dia, seguido de 5 mg/kg/dia por 4 dias",
          duracao: "5 dias",
          primeira_linha: false
        });
        
      } else if (idade_meses >= 60) {  // Maior de 5 anos
        // Considerar agentes atípicos
        if (dados.suspeita_atipicos) {
          tratamento_ambulatorial.antibioticos.push({
            medicamento: "Azitromicina",
            dose: "10 mg/kg no primeiro dia, seguido de 5 mg/kg/dia por 4 dias",
            duracao: "5 dias",
            primeira_linha: true
          });
        } else {
          tratamento_ambulatorial.antibioticos.push({
            medicamento: "Amoxicilina",
            dose: "50 mg/kg/dia, dividido a cada 8 horas",
            duracao: "7-10 dias",
            primeira_linha: true
          });
          
          // Alternativas
          tratamento_ambulatorial.antibioticos.push({
            medicamento: "Macrolídeos (se suspeita de agentes atípicos)",
            dose: "Azitromicina 10 mg/kg no primeiro dia, seguido de 5 mg/kg/dia por 4 dias",
            duracao: "5 dias",
            primeira_linha: false
          });
        }
      }
      
      // Recomendar antibióticos para tratamento hospitalar
      if (idade_meses < 2) {  // 0-2 meses
        tratamento_hospitalar.antibioticos.push({
          medicamento: "Ampicilina + Gentamicina",
          dose: "Ampicilina 200 mg/kg/dia 6/6h, Gentamicina 7,5 mg/kg/dia 1x/dia",
          via: "Intravenosa",
          duracao: "10-14 dias",
          primeira_linha: true
        });
        
        tratamento_hospitalar.antibioticos.push({
          medicamento: "Ampicilina + Cefotaxima",
          dose: "Ampicilina 200 mg/kg/dia 6/6h, Cefotaxima 150 mg/kg/dia 8/8h",
          via: "Intravenosa",
          duracao: "10-14 dias",
          primeira_linha: true
        });
      } else if (2 <= idade_meses && idade_meses < 60) {  // 2 meses a 5 anos
        if (gravidade === "grave") {
          tratamento_hospitalar.antibioticos.push({
            medicamento: "Oxacilina + Ceftriaxona",
            dose: "Oxacilina 150-200 mg/kg/dia 6/6h, Ceftriaxona 50-100 mg/kg/dia 12/12h",
            via: "Intravenosa",
            duracao: "10-14 dias",
            primeira_linha: true
          });
        } else {
          tratamento_hospitalar.antibioticos.push({
            medicamento: "Ampicilina ou Penicilina Cristalina",
            dose: "Ampicilina 200 mg/kg/dia 6/6h, Penicilina 200.000 UI/kg/dia 4/4h ou 6/6h",
            via: "Intravenosa",
            duracao: "7-10 dias",
            primeira_linha: true
          });
        }
      } else if (idade_meses >= 60) {  // Maior de 5 anos
        if (dados.suspeita_atipicos) {
          tratamento_hospitalar.antibioticos.push({
            medicamento: "Ampicilina/Penicilina + Macrolídeo",
            dose: "Ampicilina 200 mg/kg/dia 6/6h + Azitromicina 10 mg/kg no dia 1, seguido de 5 mg/kg/dia",
            via: "Intravenosa + Oral/IV",
            duracao: "7-10 dias",
            primeira_linha: true
          });
        } else {
          tratamento_hospitalar.antibioticos.push({
            medicamento: "Ampicilina ou Penicilina Cristalina",
            dose: "Ampicilina 200 mg/kg/dia 6/6h, Penicilina 200.000 UI/kg/dia 4/4h ou 6/6h",
            via: "Intravenosa",
            duracao: "7-10 dias",
            primeira_linha: true
          });
        }
      }
      
      // Para complicações
      if (dados.pneumonia_complicada) {
        tratamento_hospitalar.antibioticos.push({
          medicamento: "Oxacilina + Ceftriaxona (pneumonia necrotizante/abscesso)",
          dose: "Oxacilina 150-200 mg/kg/dia 6/6h, Ceftriaxona 50-100 mg/kg/dia 12/12h",
          via: "Intravenosa",
          duracao: "14-21 dias",
          primeira_linha: true
        });
      }
      
      if (dados.suspeita_aspiracao) {
        tratamento_hospitalar.antibioticos.push({
          medicamento: "Ampicilina/Sulbactam ou Clindamicina + Ceftriaxona",
          dose: "Ampicilina/Sulbactam 200 mg/kg/dia 6/6h, Clindamicina 40 mg/kg/dia 6/6h",
          via: "Intravenosa",
          duracao: "10-14 dias",
          primeira_linha: true
        });
      }
      
      return {
        tratamento_ambulatorial,
        tratamento_hospitalar
      };
    } catch (error) {
      console.error("Erro ao recomendar tratamento:", error);
      throw new Error("Não foi possível recomendar o tratamento");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getCriteriosLeve() {
    return this.criterios_leve;
  }
  
  getCriteriosModerada() {
    return this.criterios_moderada;
  }
  
  getCriteriosGrave() {
    return this.criterios_grave;
  }
  
  getCriteriosInternacao() {
    return this.criterios_internacao;
  }
  
  getCriteriosUti() {
    return this.criterios_uti;
  }
  
  getFrReferencia() {
    return this.fr_referencia;
  }
  
  calcular(dados) {
    /**
     * Método principal que processa os dados e retorna a avaliação
     */
    try {
      // Classificar gravidade da pneumonia
      const gravidade = this.classificarGravidade(dados);
      
      // Avaliar necessidade de internação hospitalar
      const avaliacao_internacao = this.avaliarNecessidadeInternacao(dados, gravidade);
      
      // Avaliar necessidade de UTI
      const avaliacao_uti = this.avaliarNecessidadeUti(dados, gravidade);
      
      // Recomendar tratamento
      const recomendacao_tratamento = this.recomendarTratamento(dados, gravidade, avaliacao_internacao);
      
      // Determinar etiologia provável por idade
      const idade_meses = parseInt(dados.idade_meses || 0);
      const etiologia_provavel = this.avaliarEtiologiaPorIdade(idade_meses);
      
      // Recomendar exames complementares
      const exames_recomendados = ["Radiografia de tórax"];
      
      if (gravidade === "grave" || avaliacao_internacao.necessita_internacao) {
        exames_recomendados.push(
          "Hemograma completo",
          "Proteína C reativa",
          "Gasometria arterial",
          "Hemocultura"
        );
      }
      
      if (dados.derrame_pleural) {
        exames_recomendados.push("Análise do líquido pleural");
      }
      
      // Montar resultado final
      return {
        idade_meses,
        gravidade,
        etiologia_provavel,
        necessidade_internacao: avaliacao_internacao,
        necessidade_uti: avaliacao_uti,
        recomendacao_tratamento,
        exames_recomendados
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para pneumonia:", error);
      throw new Error("Não foi possível calcular as recomendações para pneumonia");
    }
  }
}

// Exporta uma instância do controlador
const controller = new PneumoniaController();
export default controller;
