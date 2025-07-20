class AnafilaxiaController {
  criterios_diagnosticos: any[];
  definicao_hipotensao: Record<string, string>;
  manifestacoes_clinicas: Record<string, string[]>;

  constructor() {
    // Critérios diagnósticos para anafilaxia
    this.criterios_diagnosticos = [
      {
        criterio: "Critério 1",
        descricao: "Início súbito (minutos a horas) de doença envolvendo pele ou mucosa E pelo menos UM dos seguintes: comprometimento respiratório OU pressão arterial reduzida ou sintomas de disfunção orgânica"
      },
      {
        criterio: "Critério 2", 
        descricao: "Dois ou mais dos seguintes que ocorrem rapidamente após exposição a alérgeno provável: comprometimento cutâneo-mucoso, respiratório, cardiovascular ou gastrointestinal persistente"
      },
      {
        criterio: "Critério 3",
        descricao: "Pressão arterial reduzida após exposição a alérgeno conhecido para aquele paciente"
      }
    ];

    this.definicao_hipotensao = {
      "1_mes_a_1_ano": "PA sistólica < 70 mmHg",
      "1_a_10_anos": "PA sistólica < 70 mmHg + (2 x idade em anos)",
      "11_a_17_anos": "PA sistólica < 90 mmHg"
    };

    this.manifestacoes_clinicas = {
      cutaneas: ["Rubor", "Prurido", "Urticária", "Angioedema", "Rash morbiliforme", "Ereção pilar"],
      respiratorias: ["Prurido e aperto na garganta", "Disfagia", "Disfonia", "Rouquidão", "Tosse seca", "Estridor", "Dispneia", "Aperto no peito", "Sibilância", "Congestão nasal"],
      cardiovasculares: ["Hipotensão", "Taquicardia", "Bradicardia", "Arritmia", "Dor no peito", "Síncope", "Parada cardíaca"],
      gastrointestinais: ["Náusea", "Dor abdominal", "Vômitos", "Diarreia"],
      neurologicas: ["Vertigem", "Estado mental alterado", "Convulsões"]
    };
  }

  calcularPressaoMinima(idadeAnos: number): number {
    if (idadeAnos < 1) {
      return 70;
    } else if (idadeAnos <= 10) {
      return 70 + (2 * idadeAnos);
    } else {
      return 90;
    }
  }

  calcularDoseAdrenalina(peso: number): any {
    // Dose: 0,01 mg/kg IM (máximo 0,5 mg)
    const dose = Math.min(0.01 * peso, 0.5);
    const volume = dose; // 1:1000 = 1mg/mL
    
    return {
      dose_mg: Number(dose.toFixed(3)),
      volume_ml: Number(volume.toFixed(3)),
      concentracao: "1:1000",
      via: "Intramuscular (vasto lateral da coxa)",
      repeticao: "Pode repetir a cada 5-15 minutos se necessário"
    };
  }

  avaliarGravidade(dados: any): string {
    const sintomas_graves = [
      dados.estridor,
      dados.dispneia_severa,
      dados.hipotensao,
      dados.alteracao_consciencia,
      dados.parada_cardiaca
    ].filter(Boolean).length;

    if (sintomas_graves >= 2) {
      return "Grave";
    } else if (sintomas_graves >= 1) {
      return "Moderada";
    } else {
      return "Leve";
    }
  }

  gerarRecomendacoes(gravidade: string, peso: number, idade: number): string[] {
    const recomendacoes = [];
    
    // Sempre adrenalina como primeira linha
    const doseAdrenalina = this.calcularDoseAdrenalina(peso);
    recomendacoes.push(`Adrenalina ${doseAdrenalina.dose_mg} mg (${doseAdrenalina.volume_ml} mL) IM imediatamente`);
    
    // Posicionamento
    if (gravidade === "Grave") {
      recomendacoes.push("Posição supina com pernas elevadas (se consciente)");
      recomendacoes.push("Oxigênio suplementar");
      recomendacoes.push("Acesso venoso e reposição volêmica se necessário");
    } else {
      recomendacoes.push("Posição confortável, evitar mudanças bruscas de posição");
    }
    
    // Medicações adjuvantes
    recomendacoes.push("Anti-histamínico H1 (difenidramina 1-2 mg/kg IV/IM)");
    recomendacoes.push("Corticosteroide (prednisolona 1-2 mg/kg VO ou hidrocortisona 5 mg/kg IV)");
    
    if (gravidade !== "Leve") {
      recomendacoes.push("Considerar anti-histamínico H2 (ranitidina)");
      recomendacoes.push("Broncodilatador se sibilância persistente");
    }
    
    // Monitorização
    recomendacoes.push("Monitorização contínua por pelo menos 4-6 horas");
    recomendacoes.push("Observação para reação bifásica (4-12 horas)");
    
    return recomendacoes;
  }

  criterioDiagnosticoAtendido(dados: any): boolean {
    // Simplificação - verificar se tem manifestações de múltiplos sistemas
    const sistemas = [
      dados.manifestacoes_cutaneas,
      dados.manifestacoes_respiratorias, 
      dados.manifestacoes_cardiovasculares,
      dados.manifestacoes_gastrointestinais
    ].filter(Boolean).length;
    
    return sistemas >= 2 || dados.hipotensao || dados.exposicao_alergeno;
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade_anos || 0);
      
      if (peso <= 0) {
        throw new Error("Peso deve ser maior que zero");
      }

      // Avaliar gravidade
      const gravidade = this.avaliarGravidade(dados);
      
      // Verificar critérios diagnósticos
      const criterios = this.criterioDiagnosticoAtendido(dados);
      
      // Gerar recomendações
      const recomendacoes = this.gerarRecomendacoes(gravidade, peso, idade);
      
      // Calcular pressão mínima esperada
      const pressaoMinima = this.calcularPressaoMinima(idade);
      
      // Dose de adrenalina
      const adrenalina = this.calcularDoseAdrenalina(peso);

      return {
        peso_kg: peso,
        idade_anos: idade,
        pressao_minima_esperada: pressaoMinima,
        gravidade: gravidade,
        criterios_atendidos: criterios,
        adrenalina: adrenalina,
        recomendacoes: recomendacoes,
        observacoes: [
          "Adrenalina é a medicação de primeira linha",
          "Não há contraindicação absoluta para adrenalina em anafilaxia",
          "Via IM é preferível à via SC",
          "Considerar internação se anafilaxia grave ou reação prolongada"
        ]
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular anafilaxia: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getCriteriosDiagnosticos(): any[] {
    return this.criterios_diagnosticos;
  }

  getManifestacaoesClinicas(): any {
    return this.manifestacoes_clinicas;
  }

  getDefinicaoHipotensao(): any {
    return this.definicao_hipotensao;
  }
}

const controller = new AnafilaxiaController();
export default controller;
