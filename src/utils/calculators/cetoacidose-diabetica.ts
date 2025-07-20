import { 
  CetoacidoseCalculationInput, 
  CetoacidoseCalculationResult,
  CetoacidoseHydrationResult,
  CetoacidoseInsulinResult
} from '../../types/protocol-calculators';

export class CetoacidoseDiabeticaCalculator {
  private criteriosDiagnosticos = {
    glicemia: 200, // mg/dL
    bicarbonato: 15, // mEq/L
    ph: 7.3
  };

  private classificacaoGravidade = [
    { gravidade: "Leve", ph: 7.2, bicarbonato: 10, alteracaoConsciencia: "Alerta" },
    { gravidade: "Moderada", ph: 7.1, bicarbonato: 5, alteracaoConsciencia: "Sonolento/confuso" },
    { gravidade: "Grave", ph: 7.1, bicarbonato: 5, alteracaoConsciencia: "Estupor/coma" }
  ];

  public calcularHidratacao(peso: number, deficitEstimado: number, manutencaoDiaria?: number): CetoacidoseHydrationResult {
    // Cálculo do déficit total em mL
    const deficitMl = (deficitEstimado / 100) * peso * 1000;

    // Cálculo da expansão inicial (fase rápida)
    const expansaoInicial = 20 * peso; // 20 mL/kg

    // Cálculo da manutenção diária se não informada
    if (!manutencaoDiaria) {
      if (peso <= 10) {
        manutencaoDiaria = 100 * peso;
      } else if (peso <= 20) {
        manutencaoDiaria = 1000 + 50 * (peso - 10);
      } else {
        manutencaoDiaria = 1500 + 20 * (peso - 20);
      }
    }

    // Manutenção para 24h
    const manutencao24h = manutencaoDiaria;

    // Cálculo da reparação residual
    const reparacaoResidual = deficitMl - expansaoInicial;

    // Volume total para 24h (manutenção + reparação residual)
    const volumeTotal24h = manutencao24h + reparacaoResidual;

    // Volume por fase (dividido em 6 fases de 2h cada)
    const volumePorFase = reparacaoResidual / 6;

    return {
      initialExpansion: Math.round(expansaoInicial),
      residualRepair: Math.round(reparacaoResidual),
      maintenance24h: Math.round(manutencao24h),
      totalVolume24h: Math.round(volumeTotal24h),
      volumePerPhase: Math.round(volumePorFase),
      hourlyFlow: Math.round(volumeTotal24h / 24)
    };
  }

  public calcularInsulinoterapia(peso: number): CetoacidoseInsulinResult {
    // Dose inicial na fase intravenosa (0,05 - 0,1 U/kg/h)
    const doseMinimaIv = Math.round(0.05 * peso * 100) / 100;
    const doseMaximaIv = Math.round(0.1 * peso * 100) / 100;

    // Volume para a dose na diluição padrão (1U = 10mL)
    // 50 UI em 500 mL -> 1 UI em 10 mL
    const volumeMinimoIv = Math.round(doseMinimaIv * 10 * 10) / 10;
    const volumeMaximoIv = Math.round(doseMaximaIv * 10 * 10) / 10;

    // Doses para transição subcutânea
    // Utilizar 0,1 a 0,2 U/kg a cada 3-4h antes das refeições
    const doseBaixaSc = Math.round(0.1 * peso * 10) / 10;
    const doseAltaSc = Math.round(0.2 * peso * 10) / 10;

    // Esquemas por glicemia
    const dosesEsquema = {
      "160-200": Math.round(0.1 * peso * 10) / 10,
      "200-300": Math.round(0.2 * peso * 10) / 10,
      "300-500": Math.round(0.3 * peso * 10) / 10,
      ">500": Math.min(Math.round(0.4 * peso * 10) / 10, 12)
    };

    // NPH para primeira manhã após compensação
    const doseNph = Math.round(0.5 * peso * 10) / 10;

    return {
      ivMinDose: doseMinimaIv,
      ivMaxDose: doseMaximaIv,
      ivMinVolume: volumeMinimoIv,
      ivMaxVolume: volumeMaximoIv,
      scLowDose: doseBaixaSc,
      scHighDose: doseAltaSc,
      schemeByGlycemia: dosesEsquema,
      nphDose: doseNph
    };
  }

  public calcularEletrolitoterapia(peso: number, potassioSerico: number) {
    let kDoseMin = 0;
    let kDoseMax = 0;
    let recomendacao = "";

    if (potassioSerico < 4.5) {
      kDoseMin = Math.round(0.3 * peso * 10) / 10;
      kDoseMax = Math.round(0.5 * peso * 10) / 10;
      recomendacao = `Iniciar na primeira fase da reparação residual com ${kDoseMin} a ${kDoseMax} mEq/kg/h`;
    } else if (potassioSerico >= 4.5 && potassioSerico <= 6) {
      kDoseMin = Math.round(0.2 * peso * 10) / 10;
      kDoseMax = Math.round(0.3 * peso * 10) / 10;
      recomendacao = `Iniciar na segunda fase da reparação residual com ${kDoseMin} a ${kDoseMax} mEq/kg/h`;
    } else { // > 6
      kDoseMin = 0;
      kDoseMax = 0;
      recomendacao = "Reposição temporariamente contraindicada. Monitorar e reavaliar.";
    }

    return {
      potassiumMin: kDoseMin,
      potassiumMax: kDoseMax,
      recommendation: recomendacao
    };
  }

  public calcularBicarbonato(peso: number, bicarbonatoAtual: number, indicado: boolean) {
    if (!indicado) {
      return {
        indicated: false,
        dose: 0
      };
    }

    // Fórmula para cálculo: (15 - bicarbonato_atual) × 0,3 × peso
    const dose = Math.round((15 - bicarbonatoAtual) * 0.3 * peso * 10) / 10;

    return {
      indicated: true,
      dose: dose
    };
  }

  public classificarGravidade(ph: number, bicarbonato: number, nivelConsciencia: string): "leve" | "moderada" | "grave" {
    if (ph < 7.1 || bicarbonato < 5 || ["estupor", "coma"].includes(nivelConsciencia)) {
      return "grave";
    } else if (ph < 7.2 || bicarbonato < 10 || ["sonolento", "confuso"].includes(nivelConsciencia)) {
      return "moderada";
    }
    return "leve";
  }

  public verificarDiagnosticoCad(glicemia: number, bicarbonato: number, ph: number): boolean {
    return (
      glicemia > this.criteriosDiagnosticos.glicemia &&
      (bicarbonato < this.criteriosDiagnosticos.bicarbonato || ph < this.criteriosDiagnosticos.ph)
    );
  }

  public calcular(dados: CetoacidoseCalculationInput): CetoacidoseCalculationResult {
    const { 
      weight: peso, 
      age: idade, 
      glucose: glicemia, 
      ph, 
      bicarbonate: bicarbonato,
      potassium: potassio,
      deficitEstimate: deficitEstimado
    } = dados;

    // Verificar diagnóstico de CAD
    const diagnosticoCad = this.verificarDiagnosticoCad(glicemia, bicarbonato, ph);

    // Classificar gravidade - usando lógica baseada nos valores fornecidos
    let nivelConsciencia = "alerta";
    if (ph < 7.1 || bicarbonato < 5) {
      nivelConsciencia = "estupor";
    } else if (ph < 7.2 || bicarbonato < 10) {
      nivelConsciencia = "sonolento";
    }

    const gravidade = this.classificarGravidade(ph, bicarbonato, nivelConsciencia);

    // Calcular hidratação
    const hidratacao = this.calcularHidratacao(peso, deficitEstimado);

    // Calcular insulinoterapia
    const insulinoterapia = this.calcularInsulinoterapia(peso);

    // Calcular eletrólitos
    const eletrolitoterapia = this.calcularEletrolitoterapia(peso, potassio);

    // Calcular bicarbonato (só indicado se pH < 7.0 ou bicarbonato < 5)
    const bicarbonatoIndicado = ph < 7.0 || bicarbonato < 5;
    const calculoBicarbonato = this.calcularBicarbonato(peso, bicarbonato, bicarbonatoIndicado);

    // Recomendações gerais
    const recomendacoes: string[] = [];

    // Recomendar internação UTI se grave
    if (gravidade === "grave") {
      recomendacoes.push("Considerar internação em UTI devido à gravidade do quadro");
    }

    // Recomendar monitorização mais frequente se instável
    if (nivelConsciencia !== "alerta" || ph < 7.1) {
      recomendacoes.push("Monitorização mais frequente dos sinais vitais e neurológicos");
    }

    // Recomendações específicas para hidratação
    recomendacoes.push(`Fase rápida: ${hidratacao.initialExpansion} mL de SF 0,9% em 1 hora`);
    recomendacoes.push(`Reparação residual: ${hidratacao.residualRepair} mL divididos em 6 fases de 2h`);

    // Recomendação para insulina
    recomendacoes.push(`Insulina IV: ${insulinoterapia.ivMinDose} a ${insulinoterapia.ivMaxDose} U/h`);

    // Recomendação para potássio
    recomendacoes.push(eletrolitoterapia.recommendation);

    return {
      severity: gravidade,
      hydration: hidratacao,
      insulin: insulinoterapia,
      electrolytes: eletrolitoterapia,
      bicarbonate: calculoBicarbonato,
      recommendations: recomendacoes
    };
  }
}

// Singleton instance
export const cetoacidoseDiabeticaCalculator = new CetoacidoseDiabeticaCalculator();
