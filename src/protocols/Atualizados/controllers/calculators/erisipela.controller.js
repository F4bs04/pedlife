class ErisiplaController {
  constructor() {
    // Opções de tratamento ambulatorial
    this.tratamento_ambulatorial = [
      {
        medicamento: "Cefalexina",
        dosagem: "100 mg/kg/dia",
        frequencia: "a cada 8 horas",
        duracao: "por 7 dias"
      },
      {
        medicamento: "Amoxicilina",
        dosagem: "50 a 100 mg/kg/dia",
        frequencia: "a cada 8 horas",
        duracao: "por 7 dias"
      },
      {
        medicamento: "Amoxicilina com clavulanato",
        dosagem: "50 a 100 mg/kg/dia",
        frequencia: "a cada 8 horas",
        duracao: "por 7 dias"
      }
    ];
    
    // Opções de tratamento hospitalar
    this.tratamento_hospitalar = [
      {
        medicamento: "Penicilina cristalina",
        dosagem: "200.000 U/kg/dia",
        frequencia: "a cada 6 horas"
      },
      {
        medicamento: "Oxacilina",
        dosagem: "200 mg/kg/dia",
        frequencia: "a cada 6 horas"
      },
      {
        medicamento: "Cefalotina",
        dosagem: "100 mg/kg/dia",
        frequencia: "a cada 8 horas"
      },
      {
        medicamento: "Ceftriaxona",
        dosagem: "100 mg/kg/dia",
        frequencia: "a cada 12 horas"
      },
      {
        medicamento: "Clindamicina",
        dosagem: "20 a 40 mg/kg/dia",
        frequencia: "divididos em 3 a 4 doses",
        observacao: "Se houver sinais de sepse deve ser utilizada conjuntamente com os antibióticos acima"
      }
    ];
    
    // Fatores de porta de entrada
    this.fatores_porta_entrada = [
      "Trauma",
      "Dermatite fúngica interdigital",
      "Picadas de inseto",
      "Fissuras no calcanhar"
    ];
    
    // Características clínicas
    this.caracteristicas_clinicas = [
      "Área endurada",
      "Bordas elevadas e bem definidas",
      "Localização em membros inferiores"
    ];
  }

  calcularDoseMedicamento(medicamento, peso) {
    /**
     * Calcula a dose do medicamento baseado no peso do paciente
     */
    try {
      if (medicamento === "Cefalexina") {
        const dose_dia = 100 * peso;  // 100 mg/kg/dia
        const dose_unitaria = Math.round(dose_dia / 3);  // a cada 8 horas
        return {
          dose_dia,
          dose_unitaria,
          unidade: "mg"
        };
      } else if (medicamento === "Amoxicilina" || medicamento === "Amoxicilina com clavulanato") {
        const dose_dia_min = 50 * peso;  // 50 mg/kg/dia
        const dose_dia_max = 100 * peso;  // 100 mg/kg/dia
        const dose_unitaria_min = Math.round(dose_dia_min / 3);  // a cada 8 horas
        const dose_unitaria_max = Math.round(dose_dia_max / 3);  // a cada 8 horas
        return {
          dose_dia_min,
          dose_dia_max,
          dose_unitaria_min,
          dose_unitaria_max,
          unidade: "mg"
        };
      } else if (medicamento === "Penicilina cristalina") {
        const dose_dia = 200000 * peso;  // 200.000 U/kg/dia
        const dose_unitaria = Math.round(dose_dia / 4);  // a cada 6 horas
        return {
          dose_dia,
          dose_unitaria,
          unidade: "U"
        };
      } else if (medicamento === "Oxacilina") {
        const dose_dia = 200 * peso;  // 200 mg/kg/dia
        const dose_unitaria = Math.round(dose_dia / 4);  // a cada 6 horas
        return {
          dose_dia,
          dose_unitaria,
          unidade: "mg"
        };
      } else if (medicamento === "Cefalotina") {
        const dose_dia = 100 * peso;  // 100 mg/kg/dia
        const dose_unitaria = Math.round(dose_dia / 3);  // a cada 8 horas
        return {
          dose_dia,
          dose_unitaria,
          unidade: "mg"
        };
      } else if (medicamento === "Ceftriaxona") {
        const dose_dia = 100 * peso;  // 100 mg/kg/dia
        const dose_unitaria = Math.round(dose_dia / 2);  // a cada 12 horas
        return {
          dose_dia,
          dose_unitaria,
          unidade: "mg"
        };
      } else if (medicamento === "Clindamicina") {
        const dose_dia_min = 20 * peso;  // 20 mg/kg/dia
        const dose_dia_max = 40 * peso;  // 40 mg/kg/dia
        const dose_unitaria_min_3x = Math.round(dose_dia_min / 3);  // 3 doses
        const dose_unitaria_max_3x = Math.round(dose_dia_max / 3);  // 3 doses
        const dose_unitaria_min_4x = Math.round(dose_dia_min / 4);  // 4 doses
        const dose_unitaria_max_4x = Math.round(dose_dia_max / 4);  // 4 doses
        return {
          dose_dia_min,
          dose_dia_max,
          dose_unitaria_min_3x,
          dose_unitaria_max_3x,
          dose_unitaria_min_4x,
          dose_unitaria_max_4x,
          unidade: "mg"
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao calcular dose de medicamento:", error);
      throw new Error("Não foi possível calcular a dose do medicamento");
    }
  }
  
  // Métodos para acesso aos dados de referência
  getTratamentoAmbulatorial() {
    return this.tratamento_ambulatorial;
  }
  
  getTratamentoHospitalar() {
    return this.tratamento_hospitalar;
  }
  
  getFatoresPortaEntrada() {
    return this.fatores_porta_entrada;
  }
  
  getCaracteristicasClinicas() {
    return this.caracteristicas_clinicas;
  }
  
  calcular(dados) {
    /**
     * Método principal que recebe os dados e retorna os resultados
     */
    try {
      const peso = parseFloat(dados.peso || 0);
      
      // Verificar fatores que indicam necessidade de internação
      const lesoes_extensas = dados.lesoes_extensas || false;
      const sintomas_sistemicos = dados.sintomas_sistemicos || false;
      const comorbidades = dados.comorbidades || false;
      const sinais_sepse = dados.sinais_sepse || false;
      
      // Lista de complicações (se existirem)
      const complicacoes = [];
      if (dados.sinais_sepse) {
        complicacoes.push("Sinais de sepse");
      }
      if (dados.celulite_extensa) {
        complicacoes.push("Celulite extensa");
      }
      if (dados.abscessos) {
        complicacoes.push("Abscessos");
      }
      if (dados.imunossupressao) {
        complicacoes.push("Imunossupressão");
      }
      
      // Determinar necessidade de internação
      const necessita_internacao = lesoes_extensas || sintomas_sistemicos || comorbidades || sinais_sepse;
      
      // Determinar o protocolo de tratamento
      let medicamento_recomendado = "Cefalexina";
      let medicamento_secundario = null;
      
      if (necessita_internacao) {
        medicamento_recomendado = "Oxacilina";
        if (sinais_sepse) {
          medicamento_secundario = "Clindamicina";
        }
      }
      
      // Calcular doses
      const doses_medicamento_principal = this.calcularDoseMedicamento(medicamento_recomendado, peso);
      let doses_medicamento_secundario = null;
      if (medicamento_secundario) {
        doses_medicamento_secundario = this.calcularDoseMedicamento(medicamento_secundario, peso);
      }
      
      // Determinar outras opções de tratamento
      const outras_opcoes = [];
      if (necessita_internacao) {
        // Adicionar outras opções de tratamento hospitalar
        for (const medicamento of this.tratamento_hospitalar) {
          if (medicamento.medicamento !== medicamento_recomendado && medicamento.medicamento !== medicamento_secundario) {
            outras_opcoes.push({
              medicamento: medicamento.medicamento,
              dosagem: medicamento.dosagem,
              frequencia: medicamento.frequencia,
              doses: this.calcularDoseMedicamento(medicamento.medicamento, peso)
            });
          }
        }
      } else {
        // Adicionar outras opções de tratamento ambulatorial
        for (const medicamento of this.tratamento_ambulatorial) {
          if (medicamento.medicamento !== medicamento_recomendado) {
            outras_opcoes.push({
              medicamento: medicamento.medicamento,
              dosagem: medicamento.dosagem,
              frequencia: medicamento.frequencia,
              doses: this.calcularDoseMedicamento(medicamento.medicamento, peso)
            });
          }
        }
      }
      
      // Recomendações para o manejo
      const recomendacoes = [];
      if (necessita_internacao) {
        recomendacoes.push("Internação hospitalar");
        recomendacoes.push("Iniciar antibiótico venoso");
        recomendacoes.push("Acompanhamento clínico diário");
        recomendacoes.push("Elevação do membro afetado");
        if (sinais_sepse) {
          recomendacoes.push("Monitoramento de sinais vitais");
          recomendacoes.push("Considerar suporte hemodinâmico se necessário");
        }
      } else {
        recomendacoes.push("Tratamento ambulatorial com antibiótico oral");
        recomendacoes.push("Elevação do membro afetado");
        recomendacoes.push("Retorno para reavaliação em 48-72 horas");
        recomendacoes.push("Orientar retorno imediato se piora dos sintomas");
      }
      
      // Resultado completo
      return {
        necessita_internacao,
        medicamento_recomendado,
        doses_medicamento_principal,
        medicamento_secundario,
        doses_medicamento_secundario,
        complicacoes,
        recomendacoes,
        outras_opcoes
      };
    } catch (error) {
      console.error("Erro ao calcular recomendações para erisipela:", error);
      throw new Error("Não foi possível calcular as recomendações para erisipela");
    }
  }
}

// Exporta uma instância do controlador
const controller = new ErisiplaController();
export default controller;
