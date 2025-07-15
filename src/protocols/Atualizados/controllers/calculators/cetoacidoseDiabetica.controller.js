class CetoacidoseDiabeticaController {
  constructor() {
    // Parâmetros para avaliação
    this.criterios_diagnosticos = {
      glicemia: 200, // mg/dL
      bicarbonato: 15, // mEq/L
      ph: 7.3
    };
    
    this.classificacao_gravidade = [
      {gravidade: "Leve", ph: 7.2, bicarbonato: 10, alteracao_consciencia: "Alerta"},
      {gravidade: "Moderada", ph: 7.1, bicarbonato: 5, alteracao_consciencia: "Sonolento/confuso"},
      {gravidade: "Grave", ph: "<7.1", bicarbonato: "<5", alteracao_consciencia: "Estupor/coma"}
    ];
  }

  calcularHidratacao(peso, deficit_estimado, manutencao_diaria = null) {
    /**
     * Calcula os volumes para hidratação do paciente em CAD
     * 
     * @param {number} peso - Peso em kg
     * @param {number} deficit_estimado - Estimativa de déficit em % (5-10%)
     * @param {number} manutencao_diaria - Volume de manutenção diária em mL/dia (opcional)
     * @returns {Object} - Dict com volumes para hidratação
     */
    
    // Cálculo do déficit total em mL
    const deficit_ml = (deficit_estimado / 100) * peso * 1000;
    
    // Cálculo da expansão inicial (fase rápida)
    const expansao_inicial = 20 * peso;  // 20 mL/kg
    
    // Cálculo da manutenção diária se não informada
    if (!manutencao_diaria) {
      if (peso <= 10) {
        manutencao_diaria = 100 * peso;
      } else if (peso <= 20) {
        manutencao_diaria = 1000 + 50 * (peso - 10);
      } else {
        manutencao_diaria = 1500 + 20 * (peso - 20);
      }
    }
    
    // Manutenção para 24h
    const manutencao_24h = manutencao_diaria;
    
    // Manutenção para 48h (metade para reidratação em 24h)
    const manutencao_48h = manutencao_diaria * 1.5;
    
    // Cálculo da reparação residual
    const reparacao_residual = deficit_ml - expansao_inicial;
    
    // Volume total para 24h (manutenção + reparação residual)
    const volume_total_24h = manutencao_24h + reparacao_residual;
    
    // Volume por fase (dividido em 6 fases de 2h cada)
    const volume_por_fase = reparacao_residual / 6;
    
    return {
      expansao_inicial: Math.round(expansao_inicial),
      reparacao_residual: Math.round(reparacao_residual),
      manutencao_24h: Math.round(manutencao_24h),
      volume_total_24h: Math.round(volume_total_24h),
      volume_por_fase: Math.round(volume_por_fase),
      fluxo_horario: Math.round(volume_total_24h / 24)
    };
  }
    
  calcularInsulinoterapia(peso, fase = "inicial") {
    /**
     * Calcula doses de insulina para CAD
     * 
     * @param {number} peso - Peso em kg
     * @param {string} fase - Fase do tratamento (inicial, manutencao, transicao)
     * @returns {Object} - Dict com doses de insulina
     */
    
    // Dose inicial na fase intravenosa (0,05 - 0,1 U/kg/h)
    const dose_minima_iv = Number((0.05 * peso).toFixed(2));
    const dose_maxima_iv = Number((0.1 * peso).toFixed(2));
    
    // Volume para a dose na diluição padrão (1U = 10mL)
    // 50 UI em 500 mL -> 1 UI em 10 mL
    const volume_minimo_iv = Number((dose_minima_iv * 10).toFixed(1));
    const volume_maximo_iv = Number((dose_maxima_iv * 10).toFixed(1));
    
    // Doses para transição subcutânea
    // Utilizar 0,1 a 0,2 U/kg a cada 3-4h antes das refeições
    const dose_baixa_sc = Number((0.1 * peso).toFixed(1));
    const dose_alta_sc = Number((0.2 * peso).toFixed(1));
    
    // Esquemas por glicemia
    const doses_esquema = {
      "160-200": Number((0.1 * peso).toFixed(1)),
      "200-300": Number((0.2 * peso).toFixed(1)),
      "300-500": Number((0.3 * peso).toFixed(1)),
      ">500": Number((0.4 * peso <= 12 ? (0.4 * peso).toFixed(1) : 12).toFixed(1))
    };
    
    // NPH para primeira manhã após compensação 
    const dose_nph = Number((0.5 * peso).toFixed(1));
    
    return {
      dose_minima_iv: dose_minima_iv,
      dose_maxima_iv: dose_maxima_iv,
      volume_minimo_iv: volume_minimo_iv,
      volume_maximo_iv: volume_maximo_iv,
      dose_baixa_sc: dose_baixa_sc,
      dose_alta_sc: dose_alta_sc,
      doses_esquema: doses_esquema,
      dose_nph: dose_nph
    };
  }
    
  calcularEletrolitoterapia(peso, potassio_serico) {
    /**
     * Calcula reposição de eletrólitos para paciente com CAD
     * 
     * @param {number} peso - Peso em kg
     * @param {number} potassio_serico - Nível sérico de potássio em mEq/L
     * @returns {Object} - Dict com recomendações para reposição de eletrólitos
     */
    
    // Reposição de potássio
    let k_dose_min, k_dose_max, k_recomendacao;
    
    if (potassio_serico < 4.5) {
      k_dose_min = Number((0.3 * peso).toFixed(1));
      k_dose_max = Number((0.5 * peso).toFixed(1));
      k_recomendacao = `Iniciar na primeira fase da reparação residual com ${k_dose_min} a ${k_dose_max} mEq/kg/h`;
    } else if (potassio_serico >= 4.5 && potassio_serico <= 6) {
      k_dose_min = Number((0.2 * peso).toFixed(1));
      k_dose_max = Number((0.3 * peso).toFixed(1));
      k_recomendacao = `Iniciar na segunda fase da reparação residual com ${k_dose_min} a ${k_dose_max} mEq/kg/h`;
    } else {  // > 6
      k_dose_min = 0;
      k_dose_max = 0;
      k_recomendacao = "Reposição temporariamente contraindicada. Monitorar e reavaliar.";
    }
    
    return {
      k_dose_min: k_dose_min,
      k_dose_max: k_dose_max,
      k_recomendacao: k_recomendacao
    };
  }
    
  calcularBicarbonato(peso, bicarbonato_atual, indicado = false) {
    /**
     * Calcula dose de bicarbonato quando indicado
     * 
     * @param {number} peso - Peso em kg
     * @param {number} bicarbonato_atual - Nível sérico atual de bicarbonato em mEq/L
     * @param {boolean} indicado - Boolean indicando se o uso de bicarbonato está indicado
     * @returns {Object} - Dict com cálculos para reposição de bicarbonato
     */
    
    if (!indicado) {
      return {
        bicarbonato_indicado: false,
        bicarbonato_dose: 0,
        recomendacao: "Uso de bicarbonato NÃO recomendado."
      };
    }
    
    // Fórmula para cálculo: (15 - bicarbonato_atual) × 0,3 × peso
    const bicarbonato_dose = Number(((15 - bicarbonato_atual) * 0.3 * peso).toFixed(1));
    
    return {
      bicarbonato_indicado: true,
      bicarbonato_dose: bicarbonato_dose,
      recomendacao: `Administrar ${bicarbonato_dose} mEq em 2h, depois reavaliar com nova gasometria.`
    };
  }
    
  calcular(dados) {
    try {
      // Extrair dados da requisição
      const peso = parseFloat(dados.peso || 0);
      const idade = parseInt(dados.idade || 0);
      const glicemia = parseFloat(dados.glicemia || 0);
      const ph = parseFloat(dados.ph || 0);
      const bicarbonato = parseFloat(dados.bicarbonato || 0);
      const potassio = parseFloat(dados.potassio || 0);
      const deficit_estimado = parseFloat(dados.deficit_estimado || 7);  // Default 7%
      const nivel_consciencia = dados.nivel_consciencia || "alerta";
      const bicarbonato_indicado = dados.bicarbonato_indicado || false;
      
      // Verificar diagnóstico de CAD
      const diagnostico_cad = (
        glicemia > this.criterios_diagnosticos.glicemia &&
        (bicarbonato < this.criterios_diagnosticos.bicarbonato || 
         ph < this.criterios_diagnosticos.ph)
      );
      
      // Classificar gravidade
      let gravidade = "Leve";
      if (ph < 7.1 || bicarbonato < 5 || ["estupor", "coma"].includes(nivel_consciencia)) {
        gravidade = "Grave";
      } else if (ph < 7.2 || bicarbonato < 10 || ["sonolento", "confuso"].includes(nivel_consciencia)) {
        gravidade = "Moderada";
      }
      
      // Calcular hidratação
      const hidratacao = this.calcularHidratacao(peso, deficit_estimado);
      
      // Calcular insulinoterapia
      const insulinoterapia = this.calcularInsulinoterapia(peso);
      
      // Calcular eletrólitos
      const eletrolitoterapia = this.calcularEletrolitoterapia(peso, potassio);
      
      // Calcular bicarbonato quando indicado
      const calculo_bicarbonato = this.calcularBicarbonato(peso, bicarbonato, bicarbonato_indicado);
      
      // Recomendações gerais
      const recomendacoes = [];
      
      // Recomendar internação UTI se grave
      if (gravidade === "Grave") {
        recomendacoes.push("Considerar internação em UTI devido à gravidade do quadro");
      }
      
      // Recomendar monitorização mais frequente se instável
      if (nivel_consciencia !== "alerta" || ph < 7.1) {
        recomendacoes.push("Monitorização mais frequente dos sinais vitais e neurológicos");
      }
      
      // Recomendações específicas para hidratação
      recomendacoes.push(`Fase rápida: ${hidratacao.expansao_inicial} mL de SF 0,9% em 1 hora`);
      recomendacoes.push(`Reparação residual: ${hidratacao.reparacao_residual} mL divididos em 6 fases de 2h`);
      
      // Recomendação para insulina
      recomendacoes.push(`Insulina IV: ${insulinoterapia.dose_minima_iv} a ${insulinoterapia.dose_maxima_iv} U/h`);
      
      // Resultado final
      const resultado = {
        diagnostico_cad: diagnostico_cad,
        gravidade: gravidade,
        hidratacao: hidratacao,
        insulinoterapia: insulinoterapia,
        eletrolitoterapia: eletrolitoterapia,
        calculo_bicarbonato: calculo_bicarbonato,
        recomendacoes: recomendacoes
      };
      
      return resultado;
    } catch (error) {
      throw new Error(`Erro ao calcular cetoacidose diabética: ${error.message}`);
    }
  }

  // Métodos para acesso aos dados
  getCriteriosDiagnosticos() {
    return this.criterios_diagnosticos;
  }

  getClassificacaoGravidade() {
    return this.classificacao_gravidade;
  }
}

// Exporta uma instância do controlador
const controller = new CetoacidoseDiabeticaController();
export default controller;
