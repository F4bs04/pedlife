import { ViolenciaSexualInput, ViolenciaSexualResult } from '@/types/protocol-calculators';

export class ViolenciaSexualCalculator {
  private static instance: ViolenciaSexualCalculator;

  private sinais_fisicos: string[] = [
    "Sangramento vaginal ou anal",
    "Dor ou dificuldade para urinar",
    "Dor abdominal ou pélvica",
    "Lesões genitais ou anais",
    "Hematomas ou lesões corporais",
    "Dificuldade para sentar ou caminhar",
    "Secreção vaginal ou anal anormal",
    "Prurido genital",
    "Edema ou eritema genital",
    "Lesões orais ou periorais"
  ];

  private sinais_comportamentais: string[] = [
    "Alterações do sono (pesadelos, insônia)",
    "Medo excessivo de pessoas específicas",
    "Comportamento regressivo",
    "Comportamento sexual inadequado para idade",
    "Isolamento social",
    "Agressividade ou irritabilidade",
    "Choro frequente sem causa aparente",
    "Recusa em ficar só com certas pessoas",
    "Mudanças no humor ou personalidade",
    "Problemas de aprendizagem ou concentração",
    "Automutilação ou ideação suicida",
    "Transtornos alimentares"
  ];

  private profilaxias_ists = {
    gonorreia: {
      pediatrico: {
        medicamento: "Ceftriaxona",
        dose: "125 mg, IM, dose única (< 45 kg)"
      },
      adolescente: {
        medicamento: "Ceftriaxona",
        dose: "250 mg, IM, dose única (≥ 45 kg)"
      }
    },
    clamidia: {
      pediatrico: {
        medicamento: "Azitromicina",
        dose: "20 mg/kg (máx 1g), VO, dose única"
      },
      adolescente: {
        medicamento: "Azitromicina",
        dose: "1g, VO, dose única"
      }
    },
    sifilis: {
      pediatrico: {
        medicamento: "Penicilina G benzatina",
        dose: "50.000 UI/kg (máx 2.400.000 UI), IM, dose única"
      },
      adolescente: {
        medicamento: "Penicilina G benzatina",
        dose: "2.400.000 UI, IM, dose única"
      }
    },
    tricomon: {
      pediatrico: {
        medicamento: "Metronidazol",
        dose: "15 mg/kg/dia, VO, 8/8h por 7 dias"
      },
      adolescente: {
        medicamento: "Metronidazol",
        dose: "400 mg, VO, 12/12h por 7 dias ou 2g, VO, dose única"
      }
    }
  };

  private profilaxia_hiv = {
    criancas: {
      criterio: "< 12 anos ou < 35 kg",
      medicamentos: [
        { nome: "Zidovudina (AZT)", dose: "180 mg/m²/dose, 12/12h (máximo 300 mg/dose)" },
        { nome: "Lamivudina (3TC)", dose: "4 mg/kg/dose, 12/12h (máximo 150 mg/dose)" },
        { nome: "Lopinavir/ritonavir (LPV/r)", dose: "230 mg/m²/dose de LPV, 12/12h (máximo 400/100 mg/dose)" }
      ]
    },
    adolescentes: {
      criterio: "≥ 12 anos ou ≥ 35 kg",
      medicamentos: [
        { nome: "Tenofovir (TDF) + Lamivudina (3TC)", dose: "300 mg + 300 mg, VO, 1x/dia" },
        { nome: "Dolutegravir (DTG)", dose: "50 mg, VO, 1x/dia" }
      ],
      alternativa: [
        { nome: "Tenofovir (TDF) + Lamivudina (3TC)", dose: "300 mg + 300 mg, VO, 1x/dia" },
        { nome: "Atazanavir/ritonavir (ATV/r)", dose: "300/100 mg, VO, 1x/dia" }
      ]
    }
  };

  private contracepcao_emergencia = [
    {
      medicamento: "Levonorgestrel",
      dose: "1,5 mg, VO, dose única (ou 0,75 mg, VO, 12/12h, duas doses)"
    },
    {
      medicamento: "Método Yuzpe (alternativa)",
      dose: "Anticoncepcional oral combinado com etinilestradiol 30-35 mcg + levonorgestrel 0,15-0,25 mg: 4 comprimidos, VO, divididos em 2 doses com intervalo de 12h"
    }
  ];

  private imunizacoes = [
    { vacina: "Hepatite B", indicacao: "Para não vacinados ou esquema incompleto" },
    { vacina: "HPV", indicacao: "Para crianças e adolescentes não vacinados ou esquema incompleto" }
  ];

  public static getInstance(): ViolenciaSexualCalculator {
    if (!ViolenciaSexualCalculator.instance) {
      ViolenciaSexualCalculator.instance = new ViolenciaSexualCalculator();
    }
    return ViolenciaSexualCalculator.instance;
  }

  public getSinaisFisicos(): string[] {
    return [...this.sinais_fisicos];
  }

  public getSinaisComportamentais(): string[] {
    return [...this.sinais_comportamentais];
  }

  public calcular(input: ViolenciaSexualInput): ViolenciaSexualResult {
    const { idade, peso, tempoDesdeOcorrido, riscoHIV, menarca, sinais_fisicos, sinais_comportamentais } = input;

    // Classificar como agudo (<72h) ou não agudo
    const caso_agudo = tempoDesdeOcorrido <= 72;

    // Determinar se é criança ou adolescente para fins de medicação
    const eh_adolescente = idade >= 12;

    // Verificar indicações de profilaxias
    const indicacao_profilaxia_ist = caso_agudo;
    const indicacao_profilaxia_hiv = caso_agudo && riscoHIV;
    const indicacao_contracepcao = caso_agudo && eh_adolescente && menarca;

    // Verificar sinais físicos e comportamentais assinalados
    const sinais_fisicos_presentes = sinais_fisicos.map(index => this.sinais_fisicos[index]).filter(Boolean);
    const sinais_comportamentais_presentes = sinais_comportamentais.map(index => this.sinais_comportamentais[index]).filter(Boolean);

    // Construir recomendações
    const recomendacoes: string[] = [];
    const recomendacoes_notificacao: string[] = [];
    const recomendacoes_medicamentos: string[] = [];

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

      if (tempoDesdeOcorrido <= 24) {
        recomendacoes.push("Preservar evidências (não dar banho, manter mesmas roupas quando possível)");
      }

      recomendacoes.push("Coleta de amostras para exames");

      // Se houver indicação de profilaxia para ISTs
      if (indicacao_profilaxia_ist) {
        const tipo = eh_adolescente ? "adolescente" : "pediatrico";
        
        for (const [ist, info] of Object.entries(this.profilaxias_ists)) {
          const medicamento = info[tipo as keyof typeof info].medicamento;
          const dose = info[tipo as keyof typeof info].dose;
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
      idade,
      peso,
      casoAgudo: caso_agudo,
      caso_agudo, // alias para compatibilidade
      tempoDesdeOcorrido,
      sinaisFisicos: sinais_fisicos_presentes,
      sinaisComportamentais: sinais_comportamentais_presentes,
      sinais_fisicos_presentes, // alias para compatibilidade
      sinais_comportamentais_presentes, // alias para compatibilidade
      eh_adolescente,
      nivel_gravidade,
      recomendacoes,
      recomendacoes_notificacao,
      recomendacoes_medicamentos,
      encaminhamentos,
      indicacao_profilaxia_ist,
      indicacao_profilaxia_hiv,
      indicacao_contracepcao,
      indicacoes: {
        profilaxiaIST: indicacao_profilaxia_ist,
        profilaxiaHIV: indicacao_profilaxia_hiv,
        contracepcaoEmergencia: indicacao_contracepcao
      },
      profilaxias: {
        ists: [],
        contracepcao: []
      },
      imunizacoes: [],
      condutas: recomendacoes,
      observacoes: []
    };
  }
}
