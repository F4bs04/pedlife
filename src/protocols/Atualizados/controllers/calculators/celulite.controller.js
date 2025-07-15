class CeluliteController {
  constructor() {
    // Definir tratamentos disponíveis
    this.tratamentos_ambulatoriais = [
      {
        escolha: "1ª escolha",
        medicamento: "cefalexina",
        dosagem: "50 a 100 mg/kg/dia",
        frequencia: "a cada 6 horas",
        dose_maxima: "4 g/dia"
      },
      {
        escolha: "2ª escolha (alérgicos às penicilinas e cefalosporinas)",
        medicamento: "claritromicina",
        dosagem: "15 mg/kg/dia",
        frequencia: "a cada 12 horas",
        dose_maxima: "1 g/dia"
      },
      {
        escolha: "3ª escolha",
        medicamento: "amoxicilina com clavulanato",
        dosagem: "50 mg/kg/dia",
        frequencia: "a cada 8 a 12 horas, conforme apresentação",
        dose_maxima: "1,5 g/dia (componente amoxicilina)"
      }
    ];
    
    this.tratamentos_hospitalares = [
      {
        medicamento: "Oxacilina",
        dosagem: "200 mg/kg/dia",
        frequencia: "a cada 6 horas",
        dose_maxima: "12 g/dia"
      },
      {
        medicamento: "Ceftriaxona",
        dosagem: "100 mg/kg/dia",
        frequencia: "a cada 12 horas",
        dose_maxima: "4 g/dia"
      },
      {
        medicamento: "Amoxicilina com clavulanato",
        dosagem: "50 a 100 mg/kg/dia",
        frequencia: "a cada 8 horas",
        dose_maxima: "1,5 g/dia (componente amoxicilina)"
      },
      {
        medicamento: "Clindamicina",
        dosagem: "20 a 40 mg/kg/dia",
        frequencia: "divididos em 3 a 4 doses",
        dose_maxima: "2,7 g/dia",
        indicacao: "em crianças com sinais de sepse"
      }
    ];
    
    // Fatores de gravidade para decisão de internação
    this.fatores_gravidade = [
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
    
    // Sinais e sintomas para avaliar gravidade
    this.sintomas = [
      "Febre",
      "Toxemia",
      "Mal estar",
      "Manifestações locais (calor, edema, hiperemia, dor)",
      "Linfadenopatia satélite",
      "Vesículas/bolhas/pústulas sobre a pele acometida"
    ];
  }

  calcularDose(medicamento, peso, dosagem_recomendada) {
    // Extrai valores numéricos da dosagem
    let dose_media;
    if (dosagem_recomendada.includes("a")) {
      const [min_dose, max_dose] = dosagem_recomendada.split("a").map(val => parseFloat(val.trim()));
      dose_media = (min_dose + max_dose) / 2;
    } else {
      dose_media = parseFloat(dosagem_recomendada.split(" ")[0]);
    }
    
    // Calcula a dose diária baseada no peso
    const dose_diaria = dose_media * peso;
    
    return dose_diaria;
  }
    
  calcular(dados) {
    try {
      // Extrair dados
      const peso = parseFloat(dados.peso || 0);
      const idade_meses = parseInt(dados.idade_meses || 0);
      const temperatura = parseFloat(dados.temperatura || 36.5);
      const sintomas_selecionados = dados.sintomas || [];
      let fatores_gravidade = dados.fatores_gravidade || [];
      const area_especial = dados.area_especial || false;
      const extensao_importante = dados.extensao_importante || false;
      const linfangite = dados.linfangite || false;
      
      // Determinar gravidade
      let gravidade_score = 0;
      
      // Adicionar idade como fator de gravidade automaticamente se menor que 3 meses
      if (idade_meses < 3 && !fatores_gravidade.includes("Idade < 3 meses")) {
        fatores_gravidade.push("Idade < 3 meses");
      }
          
      // Adicionar temperatura como fator de gravidade se ≥ 38.5°C
      if (temperatura >= 38.5 && !fatores_gravidade.includes("Febre alta (≥ 38.5°C)")) {
        fatores_gravidade.push("Febre alta (≥ 38.5°C)");
      }
          
      // Adicionar área especial se marcada
      if (area_especial && !fatores_gravidade.includes("Áreas especiais (face, pescoço, área genital, mãos, pés)")) {
        fatores_gravidade.push("Áreas especiais (face, pescoço, área genital, mãos, pés)");
      }
          
      // Adicionar extensão se marcada
      if (extensao_importante && !fatores_gravidade.includes("Extensão importante da lesão")) {
        fatores_gravidade.push("Extensão importante da lesão");
      }
          
      // Adicionar linfangite se marcada
      if (linfangite && !fatores_gravidade.includes("Presença de linfangite")) {
        fatores_gravidade.push("Presença de linfangite");
      }
          
      // Cada fator de gravidade adiciona 1 ponto
      gravidade_score += fatores_gravidade.length;
      
      // Cada sintoma adiciona 0.5 ponto
      gravidade_score += sintomas_selecionados.length * 0.5;
      
      // Determinar se precisa de internação
      let necessita_internacao = false;
      const motivos_internacao = [];
      
      // Critérios de decisão para internação:
      // 1. Se dois ou mais fatores de gravidade
      // 2. Se "Toxemia/comprometimento sistêmico" está presente
      // 3. Se idade menor que 1 mês
      // 4. Se imunossupressão
      
      if (fatores_gravidade.length >= 2) {
        necessita_internacao = true;
        motivos_internacao.push("Presença de múltiplos fatores de gravidade");
      }
          
      if (fatores_gravidade.includes("Toxemia/comprometimento sistêmico")) {
        necessita_internacao = true;
        motivos_internacao.push("Presença de toxemia/comprometimento sistêmico");
      }
          
      if (idade_meses < 1) {
        necessita_internacao = true;
        motivos_internacao.push("Idade menor que 1 mês");
      }
          
      if (fatores_gravidade.includes("Imunossupressão")) {
        necessita_internacao = true;
        motivos_internacao.push("Presença de imunossupressão");
      }
      
      // Determinar recomendação de tratamento
      const tratamento_recomendado = [];
      
      if (necessita_internacao) {
        // Para tratamento hospitalar
        const tratamento_primario = this.tratamentos_hospitalares[0];  // Oxacilina como padrão
        
        // Se há sinais de sepse, adicionar Clindamicina
        if (fatores_gravidade.includes("Toxemia/comprometimento sistêmico")) {
          const tratamento_secundario = this.tratamentos_hospitalares[3];  // Clindamicina
          const dose_secundaria = this.calcularDose(
            tratamento_secundario.medicamento,
            peso,
            tratamento_secundario.dosagem.split(" ")[0]
          );
          tratamento_recomendado.push({
            tipo: "hospitalar",
            medicamento: tratamento_secundario.medicamento,
            dose_diaria: dose_secundaria,
            dose_por_kg: tratamento_secundario.dosagem,
            frequencia: tratamento_secundario.frequencia,
            observacao: "Indicada nos casos de toxemia/sepse"
          });
        }
        
        // Calcular dose do tratamento primário
        const dose_primaria = this.calcularDose(
          tratamento_primario.medicamento,
          peso,
          tratamento_primario.dosagem.split(" ")[0]
        );
        
        tratamento_recomendado.push({
          tipo: "hospitalar",
          medicamento: tratamento_primario.medicamento,
          dose_diaria: dose_primaria,
          dose_por_kg: tratamento_primario.dosagem,
          frequencia: tratamento_primario.frequencia
        });
        
      } else {
        // Para tratamento ambulatorial
        let tratamento_primario = this.tratamentos_ambulatoriais[0];  // Cefalexina como padrão
        
        // Verificar se há alergia a penicilinas e cefalosporinas
        if (dados.alergia_penicilinacefalosporina) {
          tratamento_primario = this.tratamentos_ambulatoriais[1];  // Claritromicina
        }
        
        const dose_primaria = this.calcularDose(
          tratamento_primario.medicamento,
          peso,
          tratamento_primario.dosagem.split(" ")[0]
        );
        
        tratamento_recomendado.push({
          tipo: "ambulatorial",
          medicamento: tratamento_primario.medicamento,
          dose_diaria: dose_primaria,
          dose_por_kg: tratamento_primario.dosagem,
          frequencia: tratamento_primario.frequencia,
          escolha: tratamento_primario.escolha
        });
      }
      
      // Construir recomendações gerais
      const recomendacoes_gerais = [
        "Duração do tratamento: 7 a 14 dias, dependendo da gravidade da infecção",
        "Avaliação clínica para acompanhamento da evolução"
      ];
      
      if (necessita_internacao) {
        recomendacoes_gerais.push("Monitorização dos sinais vitais e estado geral");
        recomendacoes_gerais.push("Avaliar coleta de hemoculturas antes do início da antibioticoterapia");
        recomendacoes_gerais.push("Alta hospitalar após 24 a 48 horas afebril, com melhora do estado geral e dos parâmetros laboratoriais");
      } else {
        recomendacoes_gerais.push("Retorno em 48-72 horas para reavaliação");
        recomendacoes_gerais.push("Retornar antes se piora dos sintomas ou febre persistente");
      }
      
      // Medidas de suporte
      const medidas_suporte = [
        "Elevação de extremidades afetadas",
        "Higiene adequada da área afetada",
        "Compressas mornas locais (se não houver contraindicação)"
      ];
      
      if (extensao_importante) {
        medidas_suporte.push("Avaliação para possível drenagem de abscessos, se estiverem presentes");
      }
      
      // Retornar resultado
      return {
        gravidade_score: gravidade_score,
        necessita_internacao: necessita_internacao,
        motivos_internacao: motivos_internacao,
        fatores_gravidade_selecionados: fatores_gravidade,
        sintomas_selecionados: sintomas_selecionados,
        tratamento_recomendado: tratamento_recomendado,
        recomendacoes_gerais: recomendacoes_gerais,
        medidas_suporte: medidas_suporte
      };
    } catch (error) {
      throw new Error(`Erro ao calcular celulite: ${error.message}`);
    }
  }

  // Métodos para acesso aos dados
  getTratamentosAmbulatoriais() {
    return this.tratamentos_ambulatoriais;
  }

  getTratamentosHospitalares() {
    return this.tratamentos_hospitalares;
  }

  getFatoresGravidade() {
    return this.fatores_gravidade;
  }

  getSintomas() {
    return this.sintomas;
  }
}

// Exporta uma instância do controlador
const controller = new CeluliteController();
export default controller;
