class CriseAlgicaAnemiaFalciformeController {
  constructor() {
    // Opções de tratamento para diferentes níveis de dor
    this.tratamento_dor_leve_moderada = [
      {
        medicamento: "Dipirona",
        dose: "10-15 mg/kg/dose VO ou IV a cada 6 horas",
        dose_maxima: "1g por dose"
      },
      {
        medicamento: "Paracetamol",
        dose: "10-15 mg/kg/dose VO a cada 6 horas",
        dose_maxima: "750 mg por dose"
      },
      {
        medicamento: "Ibuprofeno",
        dose: "5-10 mg/kg/dose VO a cada 8 horas",
        dose_maxima: "600 mg por dose",
        observacao: "Evitar em caso de comprometimento renal"
      },
      {
        medicamento: "Codeína",
        dose: "0,5-1 mg/kg/dose VO a cada 4-6 horas",
        dose_maxima: "60 mg por dose",
        observacao: "Associado a analgésicos simples"
      }
    ];
    
    this.tratamento_dor_moderada_intensa = [
      {
        medicamento: "Tramadol",
        dose: "1-2 mg/kg/dose IV a cada 6-8 horas",
        dose_maxima: "100 mg por dose"
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
    
    // Critérios para definir a gravidade da crise
    this.criterios_dor_leve = [
      "Dor de intensidade 1-3 em escala de 0-10",
      "Ausência de sinais de toxicidade",
      "Hidratação adequada",
      "Capacidade de ingestão oral preservada",
      "Ausência de febre ou febre baixa",
      "Ausência de complicações associadas"
    ];
    
    this.criterios_dor_moderada = [
      "Dor de intensidade 4-6 em escala de 0-10",
      "Sinais vitais estáveis",
      "Ingesta oral prejudicada",
      "Desidratação leve",
      "Febre baixa a moderada",
      "Pode haver distúrbios eletrolíticos leves"
    ];
    
    this.criterios_dor_intensa = [
      "Dor de intensidade 7-10 em escala de 0-10",
      "Sinais de toxicidade",
      "Impossibilidade de ingestão oral",
      "Desidratação moderada a grave",
      "Febre elevada",
      "Distúrbios eletrolíticos importantes",
      "Complicações associadas (síndrome torácica aguda, sequestro esplênico, etc.)"
    ];
    
    // Critérios de alta
    this.criterios_alta = [
      "Dor controlada com analgésicos orais",
      "Ausência de complicações agudas",
      "Tolerância à dieta via oral",
      "Paciente e família orientados quanto ao seguimento"
    ];
    
    // Complicações que requerem atenção especial
    this.complicacoes = [
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
  }

  calcularHidratacao(peso, idade_anos, tipo_hidratacao) {
    /**
     * Calcula necessidades hídricas
     * 
     * @param {number} peso - Peso em kg
     * @param {number} idade_anos - Idade em anos
     * @param {string} tipo_hidratacao - Tipo de hidratação (manutenção ou expansão)
     * @returns {number} - Volume de hidratação em mL
     */
    let volume_hidratacao = 0;
    
    if (tipo_hidratacao === "manutencao") {
      // Cálculo pela fórmula de Holliday-Segar
      if (peso <= 10) {
        volume_hidratacao = peso * 100;
      } else if (peso <= 20) {
        volume_hidratacao = 1000 + (peso - 10) * 50;
      } else {
        volume_hidratacao = 1500 + (peso - 20) * 20;
      }
          
      // Ajuste para 1,5x manutenção em crise álgica
      volume_hidratacao = volume_hidratacao * 1.5;
    } else if (tipo_hidratacao === "expansao") {
      // Volume para expansão (10-20 ml/kg)
      volume_hidratacao = peso * 15;  // 15 ml/kg como média
    }
    
    return volume_hidratacao;
  }

  calcularDoseMedicacao(peso, medicamento, intensidade_dor) {
    /**
     * Calcula dose dos medicamentos com base no peso
     * 
     * @param {number} peso - Peso em kg
     * @param {string} medicamento - Nome do medicamento
     * @param {number} intensidade_dor - Intensidade da dor (0-10)
     * @returns {Object} - Objeto com informações da dose calculada
     */
    const resultado = {};
    
    // Selecionar lista de medicamentos com base na intensidade da dor
    const lista_medicamentos = intensidade_dor < 7 ? this.tratamento_dor_leve_moderada : this.tratamento_dor_moderada_intensa;
    
    // Buscar medicamento específico
    for (const med of lista_medicamentos) {
      if (med.medicamento.toLowerCase() === medicamento.toLowerCase()) {
        // Extrair valores da dose
        const dose_info = med.dose;
        const dose_range = dose_info.split(" ")[0].split("-");
        
        // Calcular dose mínima e máxima se houver range
        if (dose_range.length > 1) {
          const dose_min = parseFloat(dose_range[0]) * peso;
          const dose_max = parseFloat(dose_range[1]) * peso;
          resultado.dose_calculada = `${dose_min.toFixed(1)} - ${dose_max.toFixed(1)} mg`;
        } else {
          const dose = parseFloat(dose_range[0]) * peso;
          resultado.dose_calculada = `${dose.toFixed(1)} mg`;
        }
        
        // Verificar dose máxima
        if (med.dose_maxima) {
          const max_txt = med.dose_maxima;
          const valor_max = parseFloat(max_txt.split(" ")[0].replace("g", "000"));
          resultado.dose_maxima = max_txt;
        }
        
        // Adicionar informações de frequência e observações
        resultado.frequencia = dose_info.includes("dose ") ? dose_info.split("dose ")[1] : "";
        if (med.observacao) {
          resultado.observacao = med.observacao;
        }
              
        break;
      }
    }
    
    return resultado;
  }

  avaliarGravidadeDor(intensidade_dor, sinais_toxicidade, hidratacao, ingesta_oral, febre, complicacoes) {
    /**
     * Avalia a gravidade da crise de dor
     * 
     * @param {number} intensidade_dor - Intensidade da dor (0-10)
     * @param {boolean} sinais_toxicidade - Presença de sinais de toxicidade
     * @param {string} hidratacao - Estado de hidratação
     * @param {string} ingesta_oral - Capacidade de ingestão oral
     * @param {string} febre - Presença e intensidade da febre
     * @param {boolean} complicacoes - Presença de complicações
     * @returns {string} - Classificação da gravidade da dor
     */
    if (intensidade_dor >= 7 || sinais_toxicidade || complicacoes) {
      return "intensa";
    } else if (intensidade_dor >= 4 || ingesta_oral === "prejudicada" || hidratacao === "desidratado" || febre === "moderada_alta") {
      return "moderada";
    } else {
      return "leve";
    }
  }

  recomendarMedicamentos(gravidade_dor) {
    /**
     * Recomenda medicamentos com base na gravidade da dor
     * 
     * @param {string} gravidade_dor - Gravidade da dor (leve, moderada, intensa)
     * @returns {Array} - Lista de medicamentos recomendados
     */
    if (gravidade_dor === "intensa") {
      return this.tratamento_dor_moderada_intensa;
    } else {
      return this.tratamento_dor_leve_moderada;
    }
  }

  avaliarNecessidadeInternacao(gravidade_dor, complicacoes, vomitos_persistentes, febre_alta) {
    /**
     * Avalia necessidade de internação
     * 
     * @param {string} gravidade_dor - Gravidade da dor
     * @param {Array} complicacoes - Lista de complicações presentes
     * @param {boolean} vomitos_persistentes - Presença de vômitos persistentes
     * @param {boolean} febre_alta - Presença de febre alta
     * @returns {Object} - Objeto com indicação de internação e justificativas
     */
    let necessita_internacao = false;
    const justificativas = [];
    
    if (gravidade_dor === "intensa") {
      necessita_internacao = true;
      justificativas.push("Dor intensa (7-10/10)");
    }
    
    if (complicacoes && complicacoes.length > 0) {
      necessita_internacao = true;
      justificativas.push("Presença de complicações: " + complicacoes.join(", "));
    }
    
    if (vomitos_persistentes) {
      necessita_internacao = true;
      justificativas.push("Vômitos persistentes");
    }
    
    if (febre_alta) {
      necessita_internacao = true;
      justificativas.push("Febre alta");
    }
    
    return {
      necessita_internacao: necessita_internacao,
      justificativas: justificativas
    };
  }

  recomendarExames(gravidade_dor, complicacoes) {
    /**
     * Recomenda exames baseados na gravidade e complicações
     * 
     * @param {string} gravidade_dor - Gravidade da dor
     * @param {Array} complicacoes - Lista de complicações presentes
     * @returns {Array} - Lista de exames recomendados
     */
    const exames_recomendados = [
      "Hemograma completo",
      "Reticulócitos",
      "Função renal (ureia e creatinina)",
      "Eletrólitos (sódio, potássio)"
    ];
    
    if (gravidade_dor === "intensa" || (complicacoes && complicacoes.length > 0)) {
      exames_recomendados.push(
        "Proteína C reativa",
        "Hemoculturas (se febre)",
        "Bilirrubinas (total e frações)",
        "DHL",
        "Transaminases hepáticas"
      );
          
      if (complicacoes && (complicacoes.includes("sintomas respiratórios") || complicacoes.includes("dor torácica"))) {
        exames_recomendados.push("Radiografia de tórax");
      }
          
      if (complicacoes && complicacoes.includes("sintomas abdominais")) {
        exames_recomendados.push("Ultrassonografia abdominal");
      }
    }
    
    return exames_recomendados;
  }

  calcular(dados) {
    try {
      // Extrair dados básicos
      const peso = parseFloat(dados.peso || 0);
      const idade_anos = parseInt(dados.idade_anos || 0);
      const intensidade_dor = parseInt(dados.intensidade_dor || 0);
      
      // Extrair dados clínicos
      const sinais_toxicidade = dados.sinais_toxicidade || false;
      const hidratacao = dados.hidratacao || "normal";
      const ingesta_oral = dados.ingesta_oral || "normal";
      const febre = dados.febre || "ausente";
      
      // Extrair complicações
      const complicacoes_selecionadas = [];
      if (dados.sintomas_respiratorios) {
        complicacoes_selecionadas.push("sintomas respiratórios");
      }
      if (dados.dor_toracica) {
        complicacoes_selecionadas.push("dor torácica");
      }
      if (dados.sintomas_abdominais) {
        complicacoes_selecionadas.push("sintomas abdominais");
      }
      if (dados.priapismo) {
        complicacoes_selecionadas.push("priapismo");
      }
      if (dados.sequestro_esplenico) {
        complicacoes_selecionadas.push("sequestro esplênico");
      }
          
      // Avaliar gravidade da dor
      const gravidade_dor = this.avaliarGravidadeDor(
        intensidade_dor,
        sinais_toxicidade,
        hidratacao,
        ingesta_oral,
        febre,
        complicacoes_selecionadas.length > 0
      );
      
      // Calcular hidratação
      const volume_manutencao = this.calcularHidratacao(peso, idade_anos, "manutencao");
      const volume_expansao = gravidade_dor === "intensa" ? this.calcularHidratacao(peso, idade_anos, "expansao") : 0;
      
      // Recomendar medicamentos
      const medicamentos_recomendados = this.recomendarMedicamentos(gravidade_dor);
      
      // Avaliar necessidade de internação
      const avaliacao_internacao = this.avaliarNecessidadeInternacao(
        gravidade_dor,
        complicacoes_selecionadas,
        dados.vomitos_persistentes || false,
        febre === "alta"
      );
      
      // Recomendar exames
      const exames_recomendados = this.recomendarExames(gravidade_dor, complicacoes_selecionadas);
      
      // Recomendações específicas para complicações
      const recomendacoes_complicacoes = [];
      for (const complicacao of this.complicacoes) {
        const nome_complicacao = complicacao.nome.toLowerCase();
        if ((complicacoes_selecionadas.includes("priapismo") && nome_complicacao.includes("priapismo")) || 
            (complicacoes_selecionadas.includes("sequestro esplênico") && nome_complicacao.includes("sequestro")) || 
            ((complicacoes_selecionadas.includes("sintomas respiratórios") || complicacoes_selecionadas.includes("dor torácica")) && nome_complicacao.includes("torácica"))) {
          recomendacoes_complicacoes.push({
            nome: complicacao.nome,
            manejo: complicacao.manejo
          });
        }
      }
      
      // Montar resultado
      const resultado = {
        dados_paciente: {
          peso: peso,
          idade_anos: idade_anos,
          intensidade_dor: intensidade_dor
        },
        avaliacao: {
          gravidade_dor: gravidade_dor,
          complicacoes: complicacoes_selecionadas
        },
        recomendacoes: {
          hidratacao: {
            volume_manutencao: Math.round(volume_manutencao),
            volume_manutencao_hora: Math.round(volume_manutencao / 24),
            volume_expansao: volume_expansao > 0 ? Math.round(volume_expansao) : null
          },
          medicamentos: medicamentos_recomendados,
          exames: exames_recomendados,
          complicacoes: recomendacoes_complicacoes
        },
        internacao: avaliacao_internacao,
        criterios_alta: !avaliacao_internacao.necessita_internacao ? this.criterios_alta : []
      };
      
      return resultado;
    } catch (error) {
      throw new Error(`Erro ao calcular crise álgica em anemia falciforme: ${error.message}`);
    }
  }

  // Métodos para acesso aos dados
  getTratamentoDorLeveModera() {
    return this.tratamento_dor_leve_moderada;
  }

  getTratamentoDorModeradaIntensa() {
    return this.tratamento_dor_moderada_intensa;
  }

  getCriteriosDorLeve() {
    return this.criterios_dor_leve;
  }

  getCriteriosDorModerada() {
    return this.criterios_dor_moderada;
  }

  getCriteriosDorIntensa() {
    return this.criterios_dor_intensa;
  }

  getCriteriosAlta() {
    return this.criterios_alta;
  }

  getComplicacoes() {
    return this.complicacoes;
  }
}

// Exporta uma instância do controlador
const controller = new CriseAlgicaAnemiaFalciformeController();
export default controller;
