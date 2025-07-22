import type {
  ViolenciaSexualInput,
  ViolenciaSexualResult,
  ViolenciaSexualProfilaxiaIST,
  ViolenciaSexualProfilaxiaHIV,
  ViolenciaSexualContracepcao
} from '../../types/protocol-calculators';

/**
 * Calculadora para Violência Sexual em Pediatria
 * Baseada nas diretrizes de atendimento a casos de violência sexual
 */
class ViolenciaSexualCalculator {
  private sinaisFisicos = [
    "Lesões genitais ou anais inexplicadas, incluindo lacerações, equimoses, hematomas",
    "Sangramento ou corrimento vaginal ou anal",
    "Infecções sexualmente transmissíveis",
    "Gravidez",
    "Dor, prurido ou desconforto na região genital ou anal",
    "Infecções urinárias recorrentes sem causa aparente",
    "Trauma físico em mamas, coxas, nádegas"
  ];

  private sinaisComportamentais = [
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

  private profilaxiasISTs = {
    gonorreia: {
      pediatrico: { medicamento: "Ceftriaxona", dose: "125-250 mg, IM, dose única" },
      adolescente: { medicamento: "Ceftriaxona", dose: "500 mg, IM, dose única" }
    },
    clamidia: {
      pediatrico: { medicamento: "Azitromicina", dose: "20 mg/kg, VO, dose única (máximo 1g)" },
      adolescente: { medicamento: "Azitromicina", dose: "1 g, VO, dose única" }
    },
    sifilis: {
      pediatrico: { medicamento: "Penicilina G benzatina", dose: "50.000 UI/kg, IM, dose única (máximo 2.400.000 UI)" },
      adolescente: { medicamento: "Penicilina G benzatina", dose: "2.400.000 UI, IM, dose única" }
    },
    tricomon: {
      pediatrico: { medicamento: "Metronidazol", dose: "15 mg/kg/dia, VO, divididos em 3 doses, por 7 dias (máximo 2g)" },
      adolescente: { medicamento: "Metronidazol", dose: "2 g, VO, dose única" }
    }
  };

  private profilaxiaHIV = {
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

  private contracepcaoEmergencia = [
    { medicamento: "Levonorgestrel", dose: "1,5 mg, VO, dose única (ou 0,75 mg, VO, 12/12h, duas doses)" },
    { medicamento: "Método Yuzpe (alternativa)", dose: "Anticoncepcional oral combinado com etinilestradiol 30-35 mcg + levonorgestrel 0,15-0,25 mg: 4 comprimidos, VO, divididos em 2 doses com intervalo de 12h" }
  ];

  private imunizacoes = [
    { vacina: "Hepatite B", indicacao: "Para não vacinados ou esquema incompleto" },
    { vacina: "HPV", indicacao: "Para crianças e adolescentes não vacinados ou esquema incompleto" }
  ];

  private condutas = [
    "Notificação obrigatória ao Conselho Tutelar/autoridades competentes",
    "Avaliação médica completa com exame físico cuidadoso",
    "Coleta de material para exames quando indicado",
    "Suporte psicológico imediato",
    "Acompanhamento multidisciplinar",
    "Orientação familiar quando apropriado"
  ];

  /**
   * Calcula superfície corporal para doses pediátricas de HIV
   */
  private calcularSuperficieCorporal(peso: number, altura: number): number {
    return Math.sqrt((peso * altura) / 3600);
  }

  /**
   * Determina se é caso agudo (< 72 horas)
   */
  private isCasoAgudo(tempoDesdeOcorrido: number): boolean {
    return tempoDesdeOcorrido <= 72;
  }

  /**
   * Determina se é adolescente para fins de medicação
   */
  private isAdolescente(idade: number, peso: number): boolean {
    return idade >= 12 || peso >= 35;
  }

  /**
   * Calcula doses específicas para HIV baseadas no peso e superfície corporal
   */
  private calcularDosesHIV(idade: number, peso: number, altura: number): ViolenciaSexualProfilaxiaHIV {
    const isAdol = this.isAdolescente(idade, peso);
    const sc = this.calcularSuperficieCorporal(peso, altura);

    if (isAdol) {
      return {
        categoria: "adolescente",
        criterio: this.profilaxiaHIV.adolescentes.criterio,
        medicamentos: this.profilaxiaHIV.adolescentes.medicamentos,
        alternativa: this.profilaxiaHIV.adolescentes.alternativa,
        duracao: "28 dias",
        observacao: "Iniciar idealmente até 2 horas, no máximo 72 horas após exposição"
      };
    } else {
      // Calcular doses específicas para crianças baseadas em SC
      const doseAZT = Math.min(Math.round(180 * sc), 300);
      const dose3TC = Math.min(Math.round(4 * peso), 150);
      const doseLPV = Math.min(Math.round(230 * sc), 400);

      const medicamentosCalculados = [
        { nome: "Zidovudina (AZT)", dose: `${doseAZT} mg, 12/12h` },
        { nome: "Lamivudina (3TC)", dose: `${dose3TC} mg, 12/12h` },
        { nome: "Lopinavir/ritonavir (LPV/r)", dose: `${doseLPV}/100 mg, 12/12h` }
      ];

      return {
        categoria: "crianca",
        criterio: this.profilaxiaHIV.criancas.criterio,
        medicamentos: medicamentosCalculados,
        duracao: "28 dias",
        observacao: "Iniciar idealmente até 2 horas, no máximo 72 horas após exposição"
      };
    }
  }

  /**
   * Determina profilaxias IST baseadas na idade
   */
  private determinarProfilaxiasIST(idade: number, peso: number): ViolenciaSexualProfilaxiaIST[] {
    const isAdol = this.isAdolescente(idade, peso);
    const categoria = isAdol ? 'adolescente' : 'pediatrico';

    return [
      {
        infeccao: "Gonorreia",
        medicamento: this.profilaxiasISTs.gonorreia[categoria].medicamento,
        dose: this.profilaxiasISTs.gonorreia[categoria].dose,
        via: "IM"
      },
      {
        infeccao: "Clamídia",
        medicamento: this.profilaxiasISTs.clamidia[categoria].medicamento,
        dose: this.profilaxiasISTs.clamidia[categoria].dose,
        via: "VO"
      },
      {
        infeccao: "Sífilis",
        medicamento: this.profilaxiasISTs.sifilis[categoria].medicamento,
        dose: this.profilaxiasISTs.sifilis[categoria].dose,
        via: "IM"
      },
      {
        infeccao: "Trichomonas",
        medicamento: this.profilaxiasISTs.tricomon[categoria].medicamento,
        dose: this.profilaxiasISTs.tricomon[categoria].dose,
        via: "VO"
      }
    ];
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: ViolenciaSexualInput): ViolenciaSexualResult {
    const { idade, peso, altura, tempoDesdeOcorrido, menarca, riscoHIV } = dados;

    const casoAgudo = this.isCasoAgudo(tempoDesdeOcorrido);
    const isAdol = this.isAdolescente(idade, peso);
    
    // Determinar indicações
    const indicacaoProfilaxiaIST = casoAgudo;
    const indicacaoProfilaxiaHIV = casoAgudo && riscoHIV;
    const indicacaoContracepcao = casoAgudo && isAdol && menarca;

    // Calcular profilaxias
    const profilaxiasIST = indicacaoProfilaxiaIST ? this.determinarProfilaxiasIST(idade, peso) : [];
    const profilaxiaHIV = indicacaoProfilaxiaHIV ? this.calcularDosesHIV(idade, peso, altura) : undefined;
    
    const contracepcao: ViolenciaSexualContracepcao[] = indicacaoContracepcao 
      ? this.contracepcaoEmergencia.map(item => ({
          medicamento: item.medicamento,
          dose: item.dose,
          prazoMaximo: "Até 120 horas (5 dias), preferencialmente até 72 horas"
        }))
      : [];

    return {
      idade,
      peso,
      casoAgudo,
      caso_agudo: casoAgudo,
      tempoDesdeOcorrido,
      sinaisFisicos: this.sinaisFisicos,
      sinaisComportamentais: this.sinaisComportamentais,
      sinais_fisicos_presentes: [],
      sinais_comportamentais_presentes: [],
      nivel_gravidade: casoAgudo ? "Alto" : "Baixo",
      eh_adolescente: isAdol,
      recomendacoes_notificacao: this.condutas.slice(0, 2),
      recomendacoes_medicamentos: profilaxiasIST.map(p => `${p.medicamento} - ${p.dose}`),
      recomendacoes: this.condutas,
      encaminhamentos: ["Psicologia", "Serviço Social", "Ginecologia (se adolescente)", "Pediatria"],
      indicacao_profilaxia_ist: indicacaoProfilaxiaIST,
      indicacao_profilaxia_hiv: indicacaoProfilaxiaHIV,
      indicacao_contracepcao: indicacaoContracepcao,
      indicacoes: {
        profilaxiaIST: indicacaoProfilaxiaIST,
        profilaxiaHIV: indicacaoProfilaxiaHIV,
        contracepcaoEmergencia: indicacaoContracepcao
      },
      profilaxias: {
        ists: profilaxiasIST,
        hiv: profilaxiaHIV,
        contracepcao: contracepcao
      },
      imunizacoes: this.imunizacoes,
      condutas: this.condutas,
      observacoes: [
        "Caso deve ser notificado obrigatoriamente",
        "Acompanhamento multidisciplinar é essencial",
        "Suporte psicológico deve ser oferecido",
        "Retornos médicos são necessários para seguimento das profilaxias",
        "Exames de controle devem ser realizados conforme protocolo"
      ]
    };
  }
}

// Instância singleton para uso global
export const violenciaSexualCalculator = new ViolenciaSexualCalculator();
