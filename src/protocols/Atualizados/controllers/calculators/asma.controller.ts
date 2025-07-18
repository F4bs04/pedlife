class AsmaController {
  parametros_leve: any;
  parametros_moderada: any;
  parametros_grave: any;
  medicacoes: any;
  
  constructor() {
    // Parâmetros para classificação da crise
    this.parametros_leve = {
      dispneia: "Aos exercícios",
      fala: "Sentenças completas",
      posicao: "Pode deitar",
      nivel_consciencia: "Pode estar agitado",
      uso_musculatura: "Geralmente não",
      sibilos: "Moderados, geralmente ao final da expiração",
      pulso_paradoxal: "< 10 mmHg",
      pef: "> 80% do predito",
      pco2: "< 42 mmHg",
      po2: "> 95%"
    };
    
    this.parametros_moderada = {
      dispneia: "Ao falar",
      fala: "Frases",
      posicao: "Prefere ficar sentado",
      nivel_consciencia: "Geralmente agitado",
      uso_musculatura: "Geralmente",
      sibilos: "Altos, durante toda expiração",
      pulso_paradoxal: "10-25 mmHg",
      pef: "60-80% do predito",
      pco2: "< 42 mmHg",
      po2: "91-95%"
    };
    
    this.parametros_grave = {
      dispneia: "Em repouso",
      fala: "Palavras",
      posicao: "Inclinado para frente",
      nivel_consciencia: "Geralmente agitado",
      uso_musculatura: "Geralmente",
      sibilos: "Geralmente altos",
      pulso_paradoxal: "> 25 mmHg (geralmente)",
      pef: "< 60% do predito",
      pco2: "> 42 mmHg",
      po2: "< 91%"
    };
    
    this.medicacoes = {
      salbutamol: {
        nebulizacao: {
          peso_menor_15kg: "2,5 mg",
          peso_maior_15kg: "5 mg",
          intervalo: "20 min",
          maximo_doses: 3
        },
        inalador: {
          dose_unitaria: "100 mcg/jato",
          criancas_2_5_anos: "2-6 jatos",
          criancas_maior_5_anos: "4-10 jatos",
          intervalo: "20 min"
        }
      },
      ipratropio: {
        nebulizacao: {
          dose: "250 mcg",
          idade_minima: "6 anos",
          uso: "Combinado com salbutamol nas crises moderadas/graves"
        },
        inalador: {
          dose_unitaria: "20 mcg/jato",
          dose: "4-8 jatos",
          uso: "Combinado com salbutamol"
        }
      },
      prednisolona: {
        dose: "1-2 mg/kg/dia",
        dose_maxima: "40 mg/dia",
        duracao: "3-5 dias",
        indicacao: "Crises moderadas e graves"
      },
      hidrocortisona: {
        dose: "5-10 mg/kg",
        dose_maxima: "200 mg",
        via: "EV",
        indicacao: "Crises graves ou quando via oral não disponível"
      }
    };
  }

  calcularDoseSalbutamol(peso: number, via: string): any {
    try {
      if (via === "nebulizacao") {
        const dose = peso < 15 ? "2,5 mg" : "5 mg";
        return {
          dose: dose,
          diluicao: "em 3-4 mL de SF 0,9%",
          intervalo: "20 minutos",
          maximo_doses: 3
        };
      } else if (via === "inalador") {
        const jatos = peso < 20 ? "2-6 jatos" : "4-10 jatos";
        return {
          dose: jatos,
          concentracao: "100 mcg/jato",
          intervalo: "20 minutos",
          observacao: "Usar com espaçador"
        };
      }
    } catch (error: any) {
      throw new Error("Erro ao calcular dose de salbutamol");
    }
  }

  calcularDoseIpratropio(idade: number, via: string): any {
    try {
      if (idade < 6) {
        return {
          indicado: false,
          motivo: "Não recomendado para menores de 6 anos"
        };
      }
      
      if (via === "nebulizacao") {
        return {
          dose: "250 mcg",
          diluicao: "em 3-4 mL de SF 0,9%",
          uso: "Combinado com salbutamol",
          indicado: true
        };
      } else if (via === "inalador") {
        return {
          dose: "4-8 jatos",
          concentracao: "20 mcg/jato",
          uso: "Combinado com salbutamol",
          observacao: "Usar com espaçador",
          indicado: true
        };
      }
    } catch (error: any) {
      throw new Error("Erro ao calcular dose de ipratrópio");
    }
  }

  calcularDoseCorticoide(peso: number, via: string): any {
    try {
      if (via === "oral") {
        const dose = Math.round(peso * 1.5); // 1-2 mg/kg, usando 1,5
        const doseMaxima = Math.min(dose, 40);
        
        return {
          medicamento: "Prednisolona",
          dose: `${doseMaxima} mg`,
          dose_kg: "1-2 mg/kg/dia",
          duracao: "3-5 dias",
          observacao: "Dose única pela manhã"
        };
      } else if (via === "ev") {
        const dose = Math.round(peso * 7.5); // 5-10 mg/kg, usando 7,5
        const doseMaxima = Math.min(dose, 200);
        
        return {
          medicamento: "Hidrocortisona",
          dose: `${doseMaxima} mg`,
          dose_kg: "5-10 mg/kg",
          via: "Endovenosa",
          observacao: "Para crises graves ou quando via oral não disponível"
        };
      }
    } catch (error: any) {
      throw new Error("Erro ao calcular dose de corticóide");
    }
  }

  classificarGravidade(dados: any): string {
    try {
      let pontuacaoGrave = 0;
      let pontuacaoModerada = 0;
      
      // Análise dos parâmetros clínicos
      if (dados.dispneia === "repouso") pontuacaoGrave += 2;
      else if (dados.dispneia === "falar") pontuacaoModerada += 1;
      
      if (dados.fala === "palavras") pontuacaoGrave += 2;
      else if (dados.fala === "frases") pontuacaoModerada += 1;
      
      if (dados.uso_musculatura_acessoria) {
        pontuacaoGrave += 1;
        pontuacaoModerada += 1;
      }
      
      if (dados.sibilos === "diminuidos" || dados.sibilos === "ausentes") {
        pontuacaoGrave += 3; // Sinal de alarme
      } else if (dados.sibilos === "altos") {
        pontuacaoModerada += 1;
      }
      
      if (dados.saturacao_o2 && dados.saturacao_o2 < 91) {
        pontuacaoGrave += 3;
      } else if (dados.saturacao_o2 && dados.saturacao_o2 < 95) {
        pontuacaoModerada += 1;
      }
      
      if (dados.pef && dados.pef < 60) {
        pontuacaoGrave += 2;
      } else if (dados.pef && dados.pef < 80) {
        pontuacaoModerada += 1;
      }
      
      if (dados.nivel_consciencia === "confuso" || dados.nivel_consciencia === "sonolento") {
        pontuacaoGrave += 3;
      }
      
      // Classificação final
      if (pontuacaoGrave >= 3) {
        return "Grave";
      } else if (pontuacaoModerada >= 2 || pontuacaoGrave >= 1) {
        return "Moderada";
      } else {
        return "Leve";
      }
    } catch (error: any) {
      throw new Error("Erro ao classificar gravidade da crise asmática");
    }
  }

  gerarPlanoTratamento(gravidade: string, peso: number, idade: number): any {
    try {
      const plano = {
        gravidade: gravidade,
        medicacoes: [],
        observacoes: [],
        criterios_internacao: false,
        monitorizacao: []
      };
      
      if (gravidade === "Leve") {
        // Salbutamol apenas
        const doseSalbutamol = this.calcularDoseSalbutamol(peso, "inalador");
        plano.medicacoes.push({
          medicamento: "Salbutamol",
          ...doseSalbutamol,
          doses_max: "2-3 doses com intervalo de 20 min"
        });
        
        plano.observacoes.push("Monitorar resposta ao tratamento");
        plano.observacoes.push("Orientar técnica inalatória");
        plano.monitorizacao.push("Saturação de O2");
        plano.monitorizacao.push("Frequência respiratória");
        
      } else if (gravidade === "Moderada") {
        // Salbutamol + Ipratrópio + Corticóide
        const doseSalbutamol = this.calcularDoseSalbutamol(peso, "nebulizacao");
        plano.medicacoes.push({
          medicamento: "Salbutamol",
          ...doseSalbutamol
        });
        
        const doseIpratropio = this.calcularDoseIpratropio(idade, "nebulizacao");
        if (doseIpratropio.indicado) {
          plano.medicacoes.push({
            medicamento: "Ipratrópio",
            ...doseIpratropio
          });
        }
        
        const doseCorticoide = this.calcularDoseCorticoide(peso, "oral");
        plano.medicacoes.push({
          medicamento: "Corticóide",
          ...doseCorticoide
        });
        
        plano.observacoes.push("Observação por 1-4 horas após tratamento");
        plano.observacoes.push("Considerar internação se não melhorar");
        plano.monitorizacao.push("Saturação de O2 contínua");
        plano.monitorizacao.push("Sinais vitais a cada 30 min");
        
      } else if (gravidade === "Grave") {
        // Tratamento intensivo
        const doseSalbutamol = this.calcularDoseSalbutamol(peso, "nebulizacao");
        plano.medicacoes.push({
          medicamento: "Salbutamol",
          ...doseSalbutamol,
          frequencia: "Contínuo ou a cada 20 min"
        });
        
        const doseIpratropio = this.calcularDoseIpratropio(idade, "nebulizacao");
        if (doseIpratropio.indicado) {
          plano.medicacoes.push({
            medicamento: "Ipratrópio",
            ...doseIpratropio
          });
        }
        
        const doseCorticoide = this.calcularDoseCorticoide(peso, "ev");
        plano.medicacoes.push({
          medicamento: "Corticóide EV",
          ...doseCorticoide
        });
        
        plano.criterios_internacao = true;
        plano.observacoes.push("INTERNAÇÃO OBRIGATÓRIA");
        plano.observacoes.push("Considerar UTI se não responder");
        plano.observacoes.push("Considerar sulfato de magnésio se refratário");
        plano.monitorizacao.push("Monitorização cardíaca");
        plano.monitorizacao.push("Gasometria arterial");
        plano.monitorizacao.push("Saturação de O2 contínua");
      }
      
      return plano;
    } catch (error: any) {
      throw new Error("Erro ao gerar plano de tratamento");
    }
  }

  calcular(dados: any): any {
    try {
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade || 0);
      
      if (peso <= 0) {
        throw new Error("Peso deve ser informado e maior que zero");
      }
      
      // Classificar gravidade
      const gravidade = this.classificarGravidade(dados);
      
      // Gerar plano de tratamento
      const planoTratamento = this.gerarPlanoTratamento(gravidade, peso, idade);
      
      // Critérios de alta
      const criteriosAlta = [];
      if (gravidade !== "Grave") {
        criteriosAlta.push("Ausência de dispneia em repouso");
        criteriosAlta.push("Saturação de O2 > 95% em ar ambiente");
        criteriosAlta.push("PEF > 80% do predito ou melhor valor pessoal");
        criteriosAlta.push("Capacidade de realizar atividades cotidianas");
      }
      
      // Orientações para seguimento
      const orientacoesSeguimento = [
        "Manter medicação de controle conforme prescrição prévia",
        "Retornar se piora dos sintomas",
        "Seguimento ambulatorial em 7-15 dias",
        "Orientar sobre técnica inalatória",
        "Identificar e evitar fatores desencadeantes"
      ];
      
      return {
        classificacao: {
          gravidade: gravidade,
          parametros_avaliados: dados
        },
        tratamento: planoTratamento,
        criterios_alta: criteriosAlta,
        orientacoes_seguimento: orientacoesSeguimento,
        parametros_normais: {
          leve: this.parametros_leve,
          moderada: this.parametros_moderada,
          grave: this.parametros_grave
        }
      };
    } catch (error: any) {
      throw new Error(`Erro ao calcular tratamento da asma: ${error.message}`);
    }
  }

  // Métodos para compatibilidade
  getParametrosClassificacao(): any {
    return {
      leve: this.parametros_leve,
      moderada: this.parametros_moderada,
      grave: this.parametros_grave
    };
  }
  
  getMedicacoes(): any {
    return this.medicacoes;
  }
}

const controller = new AsmaController();
export default controller;
