class SimPController {
  constructor() {
    /**
     * Inicializa os critérios diagnósticos e dados para avaliação da SIM-P
     */
    // Critérios diagnósticos da OMS
    this.criterios_oms = {
      idade: "Crianças e adolescentes de 0 a 19 anos",
      febre: "Febre ≥ 3 dias",
      criterios_adicionais: [
        "Erupção cutânea ou conjuntivite não purulenta bilateral ou sinais de inflamação mucocutânea (oral, mãos ou pés)",
        "Hipotensão ou choque",
        "Características de disfunção miocárdica, pericardite, valvulite ou anormalidades coronárias",
        "Evidência de coagulopatia (prolongamento de TP, TTPa, D-dímero elevado)",
        "Manifestações gastrointestinais agudas (diarreia, vômitos ou dor abdominal)"
      ],
      inflamacao: "Marcadores de inflamação elevados (VHS, PCR ou procalcitonina)",
      exclusao: "Nenhuma outra causa microbiana óbvia de inflamação",
      covid: "Evidência de COVID-19 (RT-PCR, teste antigênico ou sorologia positiva) ou contato provável com paciente com COVID-19"
    };
    
    // Critérios diagnósticos do CDC
    this.criterios_cdc = {
      idade: "Indivíduo < 21 anos",
      febre: "Febre > 38,0°C por ≥ 24h ou relato de febre subjetiva persistente por ≥ 24h",
      inflamacao: "Evidência de inflamação laboratorial",
      doenca_grave: "Evidência de doença clinicamente grave que requer hospitalização",
      multisistema: "Envolvimento multissistêmico (≥ 2 órgãos)",
      exclusao: "Ausência de diagnósticos alternativos plausíveis",
      covid: "Evidência de infecção recente ou atual por SARS-CoV-2 ou exposição à COVID-19 nas 4 semanas anteriores"
    };
    
    // Sistemas/órgãos envolvidos para critério multissistêmico
    this.sistemas_orgaos = [
      "Cardíaco",
      "Renal",
      "Respiratório",
      "Hematológico",
      "Gastrointestinal",
      "Dermatológico",
      "Neurológico"
    ];
    
    // Marcadores laboratoriais de inflamação
    this.marcadores_inflamacao = [
      "PCR elevada",
      "VHS elevada",
      "Procalcitonina elevada",
      "Ferritina elevada",
      "D-dímero elevado",
      "IL-6 elevada",
      "Neutrofilia",
      "Linfopenia",
      "Hipoalbuminemia"
    ];
    
    // Critérios de gravidade
    this.criterios_gravidade = [
      "Hipotensão/choque refratário a volume",
      "Disfunção miocárdica (FE < 55%)",
      "Arritmias",
      "Aneurismas coronarianos",
      "Alteração neurológica significativa",
      "Insuficiência respiratória",
      "Insuficiência renal aguda",
      "Coagulopatia significativa"
    ];
    
    // Recomendações de tratamento
    this.tratamentos = {
      primeira_linha: [
        "Imunoglobulina intravenosa (IVIG) 2g/kg em dose única",
        "Monitorização contínua dos sinais vitais",
        "Ecocardiograma na admissão e seriado",
        "Antiagregação plaquetária (AAS 3-5mg/kg/dia)"
      ],
      casos_graves: [
        "Corticosteroides (metilprednisolona 1-2mg/kg/dia)",
        "Considerar terapias biológicas (anakinra, tocilizumabe) em casos refratários",
        "Suporte hemodinâmico (considerar inotrópicos/vasopressores)",
        "Anticoagulação profilática ou terapêutica conforme avaliação"
      ]
    };
    
    // Recomendações de seguimento
    this.seguimento = [
      "Ecocardiograma na alta e em 1-2 semanas, 4-6 semanas e 6-12 meses",
      "Avaliação cardíaca em 1-2 semanas após alta",
      "Monitoração de marcadores inflamatórios até resolução",
      "Seguimento com cardiologia por pelo menos 12 meses",
      "Seguimento com reumatologia ou imunologia por 6-12 meses"
    ];
  }

  avaliarCriteriosOms(dados) {
    /**
     * Avalia se o paciente atende aos critérios da OMS para SIM-P
     */
    try {
      const idade_ok = 0 <= parseInt(dados.idade_anos || 0) && parseInt(dados.idade_anos || 0) <= 19;
      const febre_3_dias = dados.febre_3_dias || false;
      
      const num_criterios_adicionais = [
        dados.erupcao_conjuntivite || false,
        dados.hipotensao_choque || false,
        dados.disfuncao_cardiaca || false,
        dados.coagulopatia || false,
        dados.manifestacoes_gi || false
      ].filter(Boolean).length;
      
      const marcadores_inflamacao = dados.marcadores_inflamacao || false;
      const sem_causa_microbiana = dados.sem_causa_microbiana || false;
      const evidencia_covid = dados.evidencia_covid || false;
      
      const criterios_atendidos = idade_ok && febre_3_dias && (num_criterios_adicionais >= 2) && 
                                marcadores_inflamacao && sem_causa_microbiana && evidencia_covid;
      
      return {
        atende_criterios: criterios_atendidos,
        idade_ok,
        febre_3_dias,
        num_criterios_adicionais,
        criterios_adicionais_ok: num_criterios_adicionais >= 2,
        marcadores_inflamacao,
        sem_causa_microbiana,
        evidencia_covid
      };
    } catch (error) {
      console.error("Erro ao avaliar critérios OMS:", error);
      throw new Error("Não foi possível avaliar os critérios da OMS para SIM-P");
    }
  }
  
  avaliarCriteriosCdc(dados) {
    /**
     * Avalia se o paciente atende aos critérios do CDC para SIM-P
     */
    try {
      const idade_ok = 0 <= parseInt(dados.idade_anos || 0) && parseInt(dados.idade_anos || 0) < 21;
      const febre_24h = dados.febre_24h || false;
      const inflamacao_lab = dados.inflamacao_lab || false;
      const doenca_grave = dados.doenca_grave || false;
      
      const num_sistemas = [
        dados.sistema_cardiaco || false,
        dados.sistema_renal || false,
        dados.sistema_respiratorio || false,
        dados.sistema_hematologico || false,
        dados.sistema_gastrointestinal || false,
        dados.sistema_dermatologico || false,
        dados.sistema_neurologico || false
      ].filter(Boolean).length;
      
      const sem_diagnostico_alternativo = dados.sem_diagnostico_alternativo || false;
      const evidencia_covid = dados.evidencia_covid || false;
      
      const criterios_atendidos = idade_ok && febre_24h && inflamacao_lab && doenca_grave && 
                                (num_sistemas >= 2) && sem_diagnostico_alternativo && evidencia_covid;
      
      return {
        atende_criterios: criterios_atendidos,
        idade_ok,
        febre_24h,
        inflamacao_lab,
        doenca_grave,
        num_sistemas,
        sistemas_ok: num_sistemas >= 2,
        sem_diagnostico_alternativo,
        evidencia_covid
      };
    } catch (error) {
      console.error("Erro ao avaliar critérios CDC:", error);
      throw new Error("Não foi possível avaliar os critérios do CDC para SIM-P");
    }
  }
  
  avaliarGravidade(dados) {
    /**
     * Avalia a gravidade do caso de SIM-P
     */
    try {
      const num_criterios_gravidade = [
        dados.hipotensao_choque_refratario || false,
        dados.disfuncao_miocardica || false,
        dados.arritmias || false,
        dados.aneurismas_coronarianos || false,
        dados.alteracao_neurologica || false,
        dados.insuficiencia_respiratoria || false,
        dados.insuficiencia_renal || false,
        dados.coagulopatia_significativa || false
      ].filter(Boolean).length;
      
      let gravidade = "Leve";
      if (num_criterios_gravidade >= 3) {
        gravidade = "Grave";
      } else if (num_criterios_gravidade >= 1) {
        gravidade = "Moderado";
      }
      
      return {
        gravidade,
        num_criterios_gravidade
      };
    } catch (error) {
      console.error("Erro ao avaliar gravidade:", error);
      throw new Error("Não foi possível avaliar a gravidade do caso de SIM-P");
    }
  }
  
  gerarRecomendacoes(avaliacao_oms, avaliacao_cdc, avaliacao_gravidade) {
    /**
     * Gera recomendações com base nos critérios e na gravidade
     */
    try {
      const recomendacoes = [];
      
      // Diagnóstico
      if (avaliacao_oms.atende_criterios || avaliacao_cdc.atende_criterios) {
        recomendacoes.push("Diagnóstico compatível com SIM-P, recomendar internação hospitalar imediata");
        recomendacoes.push(...this.tratamentos.primeira_linha);
        
        // Adicionar recomendações baseadas na gravidade
        if (["Moderado", "Grave"].includes(avaliacao_gravidade.gravidade)) {
          recomendacoes.push(...this.tratamentos.casos_graves);
        }
        
        // Seguimento
        recomendacoes.push("SEGUIMENTO RECOMENDADO:");
        recomendacoes.push(...this.seguimento);
      } else {
        const criterios_parciais_oms = [
          avaliacao_oms.febre_3_dias,
          avaliacao_oms.criterios_adicionais_ok,
          avaliacao_oms.marcadores_inflamacao,
          avaliacao_oms.sem_causa_microbiana,
          avaliacao_oms.evidencia_covid
        ].filter(Boolean).length;
        
        const criterios_parciais_cdc = [
          avaliacao_cdc.febre_24h,
          avaliacao_cdc.inflamacao_lab,
          avaliacao_cdc.doenca_grave,
          avaliacao_cdc.sistemas_ok,
          avaliacao_cdc.sem_diagnostico_alternativo,
          avaliacao_cdc.evidencia_covid
        ].filter(Boolean).length;
        
        if ((criterios_parciais_oms >= 3) || (criterios_parciais_cdc >= 4)) {
          recomendacoes.push("Critérios diagnósticos parcialmente atendidos para SIM-P");
          recomendacoes.push("Considerar internação hospitalar para observação e investigação adicional");
          recomendacoes.push("Realizar exames complementares: hemograma completo, PCR, VHS, ferritina, D-dímero, ecocardiograma");
          recomendacoes.push("Reavaliar critérios diagnósticos com resultados de exames");
        } else {
          recomendacoes.push("Critérios diagnósticos para SIM-P não atendidos");
          recomendacoes.push("Considerar diagnósticos alternativos");
          recomendacoes.push("Manter observação clínica e reavaliação periódica");
        }
      }
      
      return recomendacoes;
    } catch (error) {
      console.error("Erro ao gerar recomendações:", error);
      throw new Error("Não foi possível gerar recomendações para SIM-P");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getCriteriosOms() {
    return this.criterios_oms;
  }
  
  getCriteriosCdc() {
    return this.criterios_cdc;
  }
  
  getSistemasOrgaos() {
    return this.sistemas_orgaos;
  }
  
  getMarcadoresInflamacao() {
    return this.marcadores_inflamacao;
  }
  
  getCriteriosGravidade() {
    return this.criterios_gravidade;
  }
  
  getTratamentos() {
    return this.tratamentos;
  }
  
  getSeguimento() {
    return this.seguimento;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      // Avaliar critérios diagnósticos
      const avaliacao_oms = this.avaliarCriteriosOms(dados);
      const avaliacao_cdc = this.avaliarCriteriosCdc(dados);
      
      // Avaliar gravidade
      const avaliacao_gravidade = this.avaliarGravidade(dados);
      
      // Gerar recomendações
      const recomendacoes = this.gerarRecomendacoes(avaliacao_oms, avaliacao_cdc, avaliacao_gravidade);
      
      // Preparar resultado final
      return {
        avaliacao_oms,
        avaliacao_cdc,
        avaliacao_gravidade,
        recomendacoes,
        criterios_oms: this.criterios_oms,
        criterios_cdc: this.criterios_cdc,
        criterios_gravidade: this.criterios_gravidade
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para SIM-P:", error);
      throw new Error("Não foi possível calcular as recomendações para SIM-P");
    }
  }
}

// Exporta uma instância do controlador
const controller = new SimPController();
export default controller;
