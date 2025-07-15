class ViolenciaSexualController {
  constructor() {
    // Sinais físicos de violência sexual
    this.sinais_fisicos = [
      "Lesões genitais ou anais inexplicadas, incluindo lacerações, equimoses, hematomas",
      "Sangramento ou corrimento vaginal ou anal",
      "Infecções sexualmente transmissíveis",
      "Gravidez",
      "Dor, prurido ou desconforto na região genital ou anal",
      "Infecções urinárias recorrentes sem causa aparente",
      "Trauma físico em mamas, coxas, nádegas"
    ];
    
    // Sinais comportamentais de violência sexual
    this.sinais_comportamentais = [
      "Comportamento sexual inadequado para a idade",
      "Conhecimento sexual inapropriado para a faixa etária",
      "Medo excessivo de adultos ou de determinada pessoa",
      "Mudanças bruscas de comportamento",
      "Regressão a comportamentos infantis",
      "Alterações no padrão de sono e alimentação",
      "Fugas de casa",
      "Comportamento autodestrutivo ou suicida",
      "Baixo desempenho escolar repentino",
      "Isolamento social",
      "Erotização precoce",
      "Comportamento extremamente submisso ou agressivo"
    ];
    
    // Profilaxias para ISTs conforme a idade
    this.profilaxias_ists = {
      "gonorreia": {
        "pediatrico": {"medicamento": "Ceftriaxona", "dose": "125-250 mg, IM, dose única"},
        "adolescente": {"medicamento": "Ceftriaxona", "dose": "500 mg, IM, dose única"}
      },
      "clamidia": {
        "pediatrico": {"medicamento": "Azitromicina", "dose": "20 mg/kg, VO, dose única (máximo 1g)"},
        "adolescente": {"medicamento": "Azitromicina", "dose": "1 g, VO, dose única"}
      },
      "sifilis": {
        "pediatrico": {"medicamento": "Penicilina G benzatina", "dose": "50.000 UI/kg, IM, dose única (máximo 2.400.000 UI)"},
        "adolescente": {"medicamento": "Penicilina G benzatina", "dose": "2.400.000 UI, IM, dose única"}
      },
      "tricomon": {
        "pediatrico": {"medicamento": "Metronidazol", "dose": "15 mg/kg/dia, VO, divididos em 3 doses, por 7 dias (máximo 2g)"},
        "adolescente": {"medicamento": "Metronidazol", "dose": "2 g, VO, dose única"}
      }
    };
    
    // Profilaxia para HIV
    this.profilaxia_hiv = {
      "criancas": {
        "criterio": "< 12 anos ou < 35 kg",
        "medicamentos": [
          {"nome": "Zidovudina (AZT)", "dose": "180 mg/m²/dose, 12/12h (máximo 300 mg/dose)"},
          {"nome": "Lamivudina (3TC)", "dose": "4 mg/kg/dose, 12/12h (máximo 150 mg/dose)"},
          {"nome": "Lopinavir/ritonavir (LPV/r)", "dose": "230 mg/m²/dose de LPV, 12/12h (máximo 400/100 mg/dose)"}
        ]
      },
      "adolescentes": {
        "criterio": "≥ 12 anos ou ≥ 35 kg",
        "medicamentos": [
          {"nome": "Tenofovir (TDF) + Lamivudina (3TC)", "dose": "300 mg + 300 mg, VO, 1x/dia"},
          {"nome": "Dolutegravir (DTG)", "dose": "50 mg, VO, 1x/dia"}
        ],
        "alternativa": [
          {"nome": "Tenofovir (TDF) + Lamivudina (3TC)", "dose": "300 mg + 300 mg, VO, 1x/dia"},
          {"nome": "Atazanavir/ritonavir (ATV/r)", "dose": "300/100 mg, VO, 1x/dia"}
        ]
      }
    };
    
    // Contracepção de emergência
    this.contracepcao_emergencia = [
      {"medicamento": "Levonorgestrel", "dose": "1,5 mg, VO, dose única (ou 0,75 mg, VO, 12/12h, duas doses)"},
      {"medicamento": "Método Yuzpe (alternativa)", "dose": "Anticoncepcional oral combinado com etinilestradiol 30-35 mcg + levonorgestrel 0,15-0,25 mg: 4 comprimidos, VO, divididos em 2 doses com intervalo de 12h"}
    ];
    
    // Imunizações recomendadas
    this.imunizacoes = [
      {"vacina": "Hepatite B", "indicacao": "Para não vacinados ou esquema incompleto"},
      {"vacina": "HPV", "indicacao": "Para crianças e adolescentes não vacinados ou esquema incompleto"}
    ];
  }

  avaliarCaso(dados) {
    /**
     * Avalia a gravidade e recomendações para caso de violência sexual
     */
    try {
      const idade = parseInt(dados.idade || 0);
      const peso = parseFloat(dados.peso || 0);
      const tempo_desde_ocorrido = parseInt(dados.tempo_desde_ocorrido || 0);
      
      // Classificar como agudo (<72h) ou não agudo
      const caso_agudo = tempo_desde_ocorrido <= 72;
      
      // Determinar se é criança ou adolescente para fins de medicação
      const eh_adolescente = idade >= 12;
      
      // Verificar indicações de profilaxias
      const indicacao_profilaxia_ist = caso_agudo;
      const indicacao_profilaxia_hiv = caso_agudo && dados.risco_hiv;
      const indicacao_contracepcao = caso_agudo && eh_adolescente && dados.menarca;
      
      // Verificar sinais físicos e comportamentais assinalados
      const sinais_fisicos_presentes = this.sinais_fisicos.filter((sinal, index) => 
        dados[`sinal_fisico_${index}`] === true
      );
      
      const sinais_comportamentais_presentes = this.sinais_comportamentais.filter((sinal, index) => 
        dados[`sinal_comportamental_${index}`] === true
      );
      
      // Construir recomendações
      const recomendacoes = [];
      const recomendacoes_notificacao = [];
      const recomendacoes_medicamentos = [];
      
      // Notificação (sempre obrigatória)
      recomendacoes_notificacao.push("Preencher a Ficha de Notificação/Investigação Individual de Violência Interpessoal/Autoprovocada (SINAN)");
      recomendacoes_notificacao.push("Comunicar ao Conselho Tutelar em até 24 horas");
      if (caso_agudo) {
        recomendacoes_notificacao.push("Acionar autoridades policiais para casos de violência aguda (< 72h)");
      }
      
      // Recomendações básicas
      recomendacoes.push("Realizar acolhimento humanizado da vítima e familiares");
      
      if (caso_agudo) {
        recomendacoes.push("Realizar anamnese e exame físico detalhados");
        
        if (tempo_desde_ocorrido <= 24) {
          recomendacoes.push("Preservar evidências (não dar banho, manter mesmas roupas quando possível)");
        }
        
        recomendacoes.push("Coleta de amostras para exames");
        
        // Se houver indicação de profilaxia para ISTs
        if (indicacao_profilaxia_ist) {
          for (const [ist, info] of Object.entries(this.profilaxias_ists)) {
            const tipo = eh_adolescente ? "adolescente" : "pediatrico";
            const medicamento = info[tipo].medicamento;
            const dose = info[tipo].dose;
            recomendacoes_medicamentos.push(`${medicamento}: ${dose}`);
          }
        }
        
        // Se houver indicação de profilaxia para HIV
        if (indicacao_profilaxia_hiv) {
          const tipo = eh_adolescente ? "adolescentes" : "criancas";
          recomendacoes.push(`Profilaxia HIV: Esquema para ${tipo}`);
          
          for (const med of this.profilaxia_hiv[tipo].medicamentos) {
            recomendacoes_medicamentos.push(`${med.nome}: ${med.dose}`);
          }
        }
        
        // Se houver indicação de contracepção de emergência
        if (indicacao_contracepcao) {
          for (const opcao of this.contracepcao_emergencia) {
            recomendacoes_medicamentos.push(`${opcao.medicamento}: ${opcao.dose}`);
          }
        }
      } else {
        recomendacoes.push("Realizar anamnese e exame físico detalhados");
        recomendacoes.push("Exames para diagnóstico de IST e gravidez");
        recomendacoes.push("Tratamento de infecções diagnosticadas");
      }
      
      // Recomendações para todos os casos
      recomendacoes.push("Encaminhamento para serviço de saúde mental");
      recomendacoes.push("Acompanhamento ambulatorial para seguimento médico");
      
      // Verificar imunizações
      for (const imunizacao of this.imunizacoes) {
        recomendacoes.push(`Verificar status vacinal para ${imunizacao.vacina}`);
      }
      
      // Definir encaminhamentos necessários
      const encaminhamentos = [
        "Conselho Tutelar",
        "Serviço de saúde mental",
        "Ambulatório especializado para seguimento"
      ];
      
      if (caso_agudo) {
        encaminhamentos.push("Delegacia Especializada de Proteção à Criança e ao Adolescente");
      }
          
      encaminhamentos.push("CREAS (Centro de Referência Especializado de Assistência Social)");
      
      // Classificação de gravidade baseada nos sinais presentes
      let nivel_gravidade = "Médio";
      
      if (sinais_fisicos_presentes.length >= 3 || sinais_comportamentais_presentes.length >= 3) {
        nivel_gravidade = "Alto";
      }
      
      if (caso_agudo) {
        nivel_gravidade = "Alto";
      }
      
      return {
        caso_agudo,
        tempo_desde_ocorrido,
        eh_adolescente,
        nivel_gravidade,
        sinais_fisicos_presentes,
        sinais_comportamentais_presentes,
        recomendacoes,
        recomendacoes_notificacao,
        recomendacoes_medicamentos,
        encaminhamentos,
        indicacao_profilaxia_ist,
        indicacao_profilaxia_hiv,
        indicacao_contracepcao
      };
    } catch (error) {
      console.error("Erro ao avaliar caso de violência sexual:", error);
      throw new Error("Não foi possível avaliar o caso de violência sexual");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getSinaisFisicos() {
    return this.sinais_fisicos;
  }
  
  getSinaisComportamentais() {
    return this.sinais_comportamentais;
  }
  
  getProfilaxiasISTs() {
    return this.profilaxias_ists;
  }
  
  getProfilaxiaHIV() {
    return this.profilaxia_hiv;
  }
  
  getContracepcaoEmergencia() {
    return this.contracepcao_emergencia;
  }
  
  getImunizacoes() {
    return this.imunizacoes;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados da avaliação
     */
    try {
      return this.avaliarCaso(dados);
    } catch (error) {
      console.error("Erro ao calcular recomendações para violência sexual:", error);
      throw new Error("Não foi possível calcular as recomendações para violência sexual");
    }
  }
}

// Exporta uma instância do controlador
const controller = new ViolenciaSexualController();
export default controller;
