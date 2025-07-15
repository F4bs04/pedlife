class AnafilaxiaController {
  constructor() {
    // Critérios diagnósticos da anafilaxia
    this.criterios_diagnosticos = [
      {
        titulo: "Critério 1",
        descricao: "Início agudo (minutos a horas) com envolvimento de pele/mucosa E pelo menos um dos seguintes:",
        subcategorias: [
          "Comprometimento respiratório (dispneia, sibilância, broncoespasmo, estridor, PFE reduzido, hipoxemia)",
          "Redução da PA ou sintomas associados de disfunção orgânica (hipotonia, síncope, incontinência)"
        ]
      },
      {
        titulo: "Critério 2",
        descricao: "Dois ou mais dos seguintes que ocorrem rapidamente após exposição a um provável alérgeno:",
        subcategorias: [
          "Envolvimento de pele/mucosa (urticária, prurido, rubor, edema)",
          "Comprometimento respiratório (dispneia, sibilância, broncoespasmo, estridor, PFE reduzido, hipoxemia)",
          "Redução da PA ou sintomas associados (hipotonia, síncope, incontinência)",
          "Sintomas gastrointestinais persistentes (cólicas abdominais, vômitos)"
        ]
      },
      {
        titulo: "Critério 3",
        descricao: "Redução da pressão arterial após exposição a alérgeno conhecido para o paciente:",
        subcategorias: [
          "Lactentes e crianças: PA sistólica baixa (específica para idade) ou queda > 30% na PA sistólica",
          "Adultos: PA sistólica < 90 mmHg ou queda > 30% do seu valor basal"
        ]
      }
    ];
    
    // Definição de hipotensão por idade
    this.definicao_hipotensao = {
      "1_mes_a_1_ano": "PA sistólica < 70 mmHg",
      "1_a_10_anos": "PA sistólica < 70 mmHg + (2 x idade em anos)",
      "11_a_17_anos": "PA sistólica < 90 mmHg"
    };
    
    // Manifestações clínicas por sistema
    this.manifestacoes_clinicas = {
      cutaneas: [
        "Rubor", "Prurido", "Urticária", "Angioedema", 
        "Rash morbiliforme", "Ereção pilar"
      ],
      respiratorias: [
        "Prurido e aperto na garganta", "Disfagia", "Disfonia", 
        "Rouquidão", "Tosse seca", "Estridor", "Dispneia", 
        "Aperto no peito", "Sibilância", "Congestão nasal"
      ],
      cardiovasculares: [
        "Hipotensão", "Taquicardia", "Bradicardia", "Arritmia", 
        "Dor no peito", "Síncope", "Parada cardíaca"
      ],
      gastrointestinais: [
        "Náusea", "Dor abdominal", "Vômitos", "Diarreia"
      ],
      neurologicas: [
        "Vertigem", "Estado mental alterado", "Convulsões"
      ]
    };
    
    // Medicações para tratamento
    this.medicacoes = {
      adrenalina: {
        dose: "0,01 mg/kg (1:1000)",
        dose_maxima: "0,3 mg",
        via: "IM, no vasto lateral da coxa",
        observacoes: "Pode ser repetida a cada 5-15 minutos se necessário"
      },
      anti_histaminicos: [
        {
          nome: "Difenidramina",
          dose: "1 mg/kg/dose",
          dose_maxima: "50 mg",
          via: "IV/IM/VO"
        },
        {
          nome: "Prometazina",
          dose: "0,5-1 mg/kg/dose",
          dose_maxima: "25 mg",
          via: "IM",
          observacao: "Em crianças maiores de 2 anos"
        }
      ],
      corticosteroides: [
        {
          nome: "Metilprednisolona",
          dose: "1-2 mg/kg/dose",
          dose_maxima: "125 mg",
          via: "IV"
        },
        {
          nome: "Hidrocortisona",
          dose: "10 mg/kg (ataque); 5 mg/kg (manutenção)",
          dose_maxima: "500 mg",
          via: "IV/IM"
        },
        {
          nome: "Prednisona",
          dose: "1-2 mg/kg/dose",
          dose_maxima: "60 mg",
          via: "VO"
        }
      ]
    };
    
    // Critérios de gravidade
    this.gravidade = {
      leve: {
        descricao: "Envolvimento de pele e tecido subcutâneo apenas",
        sinais: ["Urticária", "Angioedema", "Prurido", "Eritema"]
      },
      moderada: {
        descricao: "Envolvimento de pelo menos um sistema além da pele",
        sinais: [
          "Sintomas respiratórios leves a moderados",
          "Sintomas gastrointestinais",
          "Sintomas cardiovasculares leves (taquicardia)"
        ]
      },
      grave: {
        descricao: "Envolvimento de múltiplos sistemas com risco à vida",
        sinais: [
          "Hipotensão/choque",
          "Hipoxemia grave",
          "Comprometimento respiratório grave",
          "Estado mental alterado"
        ]
      }
    };
  }

  calcularPressaoMinima(idadeAnos) {
    // Calcula a pressão arterial sistólica mínima aceitável para a idade
    if (idadeAnos < 1) {
      return 70;
    } else if (idadeAnos >= 1 && idadeAnos <= 10) {
      return 70 + (2 * idadeAnos);
    } else {
      return 90;
    }
  }

  calcularDoseAdrenalina(pesoKg) {
    // Calcula a dose de adrenalina baseada no peso
    let dose = 0.01 * pesoKg;  // 0,01 mg/kg
    if (dose > 0.3) {
      dose = 0.3;  // Máximo de 0,3 mg
    }
    return {
      dose_mg: parseFloat(dose.toFixed(2)),
      dose_ml: parseFloat(dose.toFixed(2)),  // Para adrenalina 1:1000, 1 mg = 1 ml
      observacao: "Administrar IM no vasto lateral da coxa"
    };
  }

  avaliarGravidade(sintomas) {
    // Avalia a gravidade da anafilaxia com base nos sintomas selecionados
    // Verificar se há sinais de gravidade (hipotensão, dispneia grave, hipoxemia, alteração de consciência)
    const sinaisGraves = [
      sintomas.hipotensao,
      sintomas.hipoxemia,
      sintomas.dispneia_grave,
      sintomas.estado_mental_alterado,
      sintomas.cianose,
      sintomas.parada_respiratoria
    ].some(Boolean);
    
    // Verificar se há sinais de múltiplos sistemas
    const sistemasEnvolvidos = [];
    
    if (['urticaria', 'angioedema', 'prurido', 'eritema'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('pele');
    }
      
    if (['dispneia', 'sibilancia', 'estridor', 'tosse', 'aperto_garganta'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('respiratorio');
    }
      
    if (['hipotensao', 'taquicardia', 'sincope'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('cardiovascular');
    }
      
    if (['vomitos', 'dor_abdominal', 'diarreia'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('gastrointestinal');
    }
      
    if (['estado_mental_alterado', 'convulsoes'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('neurologico');
    }
    
    // Determinar gravidade
    if (sinaisGraves) {
      return {
        nivel: "grave",
        descricao: "Anafilaxia grave com risco à vida",
        sistemas: sistemasEnvolvidos
      };
    } else if (sistemasEnvolvidos.length > 1) {
      return {
        nivel: "moderada",
        descricao: "Anafilaxia moderada com envolvimento multissistêmico",
        sistemas: sistemasEnvolvidos
      };
    } else if (sistemasEnvolvidos.includes('pele') && sistemasEnvolvidos.length === 1) {
      return {
        nivel: "leve",
        descricao: "Reação alérgica leve (envolvimento cutâneo apenas)",
        sistemas: sistemasEnvolvidos
      };
    } else {
      return {
        nivel: "indeterminada",
        descricao: "Não há sinais claros de anafilaxia",
        sistemas: sistemasEnvolvidos
      };
    }
  }

  criterioDiagnosticoAtendido(sintomas) {
    // Verifica se os critérios diagnósticos de anafilaxia foram atendidos
    // Critério 1: Pele/mucosa + (respiratório ou PA reduzida)
    const criterio1 = (
      ['urticaria', 'angioedema', 'prurido', 'eritema'].some(s => sintomas[s]) &&
      (
        ['dispneia', 'sibilancia', 'estridor', 'hipoxemia'].some(s => sintomas[s]) ||
        sintomas.hipotensao ||
        sintomas.sincope
      )
    );
    
    // Critério 2: Dois ou mais sistemas após exposição ao alérgeno
    const sistemasEnvolvidos = [];
    if (['urticaria', 'angioedema', 'prurido', 'eritema'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('pele/mucosa');
    }
    if (['dispneia', 'sibilancia', 'estridor', 'hipoxemia'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('respiratorio');
    }
    if (sintomas.hipotensao || sintomas.sincope) {
      sistemasEnvolvidos.push('cardiovascular');
    }
    if (['vomitos', 'dor_abdominal', 'diarreia'].some(s => sintomas[s])) {
      sistemasEnvolvidos.push('gastrointestinal');
    }
      
    const criterio2 = sistemasEnvolvidos.length >= 2 && sintomas.exposicao_alergeno;
    
    // Critério 3: Pressão reduzida após exposição a alérgeno conhecido
    const criterio3 = sintomas.hipotensao && sintomas.exposicao_alergeno_conhecido;
    
    const criteriosAtendidos = [];
    if (criterio1) {
      criteriosAtendidos.push(1);
    }
    if (criterio2) {
      criteriosAtendidos.push(2);
    }
    if (criterio3) {
      criteriosAtendidos.push(3);
    }
      
    return {
      diagnostico_anafilaxia: criteriosAtendidos.length > 0,
      criterios_atendidos: criteriosAtendidos
    };
  }
            
  gerarRecomendacoes(gravidade, pesoKg, idadeAnos) {
    // Gera recomendações de tratamento com base na gravidade e dados do paciente
    const doseAdrenalina = this.calcularDoseAdrenalina(pesoKg);
    
    // Recomendações gerais para qualquer gravidade
    const recomendacoes = [
      "Posicionar o paciente em decúbito dorsal com membros inferiores elevados",
      "Manter vias aéreas pérvias",
      "Administrar oxigênio se disponível"
    ];
    
    // Recomendações específicas por gravidade
    if (gravidade.nivel === "grave") {
      recomendacoes.push(
        `Administrar adrenalina IM IMEDIATAMENTE: ${doseAdrenalina.dose_mg} mg (${doseAdrenalina.dose_ml} ml de adrenalina 1:1000)`,
        "Estabelecer acesso venoso ou intraósseo",
        "Iniciar reposição volêmica: SF 0,9% 20 ml/kg em bolus",
        "Monitorar sinais vitais continuamente",
        "Preparar-se para manejo avançado de via aérea se necessário",
        "Considerar segunda dose de adrenalina após 5-15 minutos se não houver melhora"
      );
    } else if (gravidade.nivel === "moderada") {
      recomendacoes.push(
        `Administrar adrenalina IM: ${doseAdrenalina.dose_mg} mg (${doseAdrenalina.dose_ml} ml de adrenalina 1:1000)`,
        "Estabelecer acesso venoso",
        "Considerar anti-histamínicos e corticosteroides como tratamento adjuvante"
      );
    } else if (gravidade.nivel === "leve") {
      recomendacoes.push(
        "Observar por pelo menos 4-6 horas",
        "Considerar anti-histamínicos para alívio sintomático"
      );
    }
    
    // Cálculo de doses para medicações adjuvantes
    const dosesAdjuvantes = [];
    
    // Anti-histamínicos
    if (idadeAnos >= 2) {  // Prometazina apenas para maiores de 2 anos
      const prometazinaDose = Math.min(parseFloat((0.5 * pesoKg).toFixed(1)), 25);
      dosesAdjuvantes.push(`Prometazina: ${prometazinaDose} mg IM`);
    }
      
    const difenidraminaDose = Math.min(parseFloat((1 * pesoKg).toFixed(1)), 50);
    dosesAdjuvantes.push(`Difenidramina: ${difenidraminaDose} mg IV/IM/VO`);
    
    // Corticosteroides
    const metilprednisolonaDose = Math.min(parseFloat((2 * pesoKg).toFixed(1)), 125);
    dosesAdjuvantes.push(`Metilprednisolona: ${metilprednisolonaDose} mg IV`);
    
    const hidrocortisonaDoseAtaque = Math.min(parseFloat((10 * pesoKg).toFixed(1)), 500);
    const hidrocortisonaDoseManutencao = Math.min(parseFloat((5 * pesoKg).toFixed(1)), 250);
    dosesAdjuvantes.push(`Hidrocortisona: ${hidrocortisonaDoseAtaque} mg (ataque) / ${hidrocortisonaDoseManutencao} mg (manutenção) IV/IM`);
    
    const prednisonaDose = Math.min(parseFloat((1.5 * pesoKg).toFixed(1)), 60);
    dosesAdjuvantes.push(`Prednisona: ${prednisonaDose} mg VO`);
    
    return {
      recomendacoes_imediatas: recomendacoes,
      doses_medicacoes_adjuvantes: dosesAdjuvantes,
      observacao_alta: [
        "Observar por 4-6 horas após resolução dos sintomas",
        "Prescrever anti-histamínicos e corticosteroides por 3 dias",
        "Orientar sobre prevenção de novos episódios",
        "Considerar prescrição de adrenalina auto-injetável para uso domiciliar",
        "Encaminhar para seguimento com alergista"
      ]
    };
  }
    
  calcular(dados) {
    // Método principal que recebe os dados e retorna os resultados da avaliação
    try {
      const pesoKg = parseFloat(dados.peso || 0);
      const idadeAnos = parseInt(dados.idade_anos || 0);
      
      // Análise de sintomas e gravidade
      const gravidade = this.avaliarGravidade(dados);
      const criterios = this.criterioDiagnosticoAtendido(dados);
      const recomendacoes = this.gerarRecomendacoes(gravidade, pesoKg, idadeAnos);
      const pressaoMin = this.calcularPressaoMinima(idadeAnos);
      
      // Resultado final
      return {
        peso_kg: pesoKg,
        idade_anos: idadeAnos,
        pressao_minima_esperada: pressaoMin,
        gravidade: gravidade,
        criterios_diagnosticos: criterios,
        recomendacoes: recomendacoes,
        dose_adrenalina: this.calcularDoseAdrenalina(pesoKg)
      };
    } catch (error) {
      throw new Error(`Erro ao calcular anafilaxia: ${error.message}`);
    }
  }

  // Métodos para acesso aos dados
  getCriteriosDiagnosticos() {
    return this.criterios_diagnosticos;
  }

  getDefinicaoHipotensao() {
    return this.definicao_hipotensao;
  }

  getManifestacoesClinias() {
    return this.manifestacoes_clinicas;
  }

  getMedicacoes() {
    return this.medicacoes;
  }

  getCriteriosGravidade() {
    return this.gravidade;
  }
}

// Exporta uma instância do controlador
const controller = new AnafilaxiaController();
export default controller;
