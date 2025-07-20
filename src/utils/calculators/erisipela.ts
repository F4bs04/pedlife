import type { 
  ErisipelaInput, 
  ErisipelaResult, 
  ErisipelaCalculatedDose,
  ErisipenaoTratamento
} from '../../types/protocol-calculators';

/**
 * Calculadora para Erisipela em Pediatria
 * Baseada nas diretrizes médicas para tratamento de erisipela e critérios de internação
 */
class ErisipelaCalculator {
  private tratamentoAmbulatorial = [
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

  private tratamentoHospitalar = [
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

  /**
   * Retorna os fatores de porta de entrada
   */
  getFatoresPortaEntrada(): string[] {
    return [
      "Trauma",
      "Dermatite fúngica interdigital",
      "Picadas de inseto",
      "Fissuras no calcanhar"
    ];
  }

  /**
   * Retorna as características clínicas
   */
  getCaracteristicasClinicas(): string[] {
    return [
      "Área endurada",
      "Bordas elevadas e bem definidas",
      "Localização em membros inferiores"
    ];
  }

  /**
   * Calcula a dose do medicamento baseado no peso do paciente
   */
  private calcularDoseMedicamento(medicamento: string, peso: number): ErisipelaCalculatedDose {
    switch (medicamento) {
      case "Cefalexina": {
        const doseDiaCefalexina = 100 * peso; // 100 mg/kg/dia
        const doseUnitariaCefalexina = Math.round(doseDiaCefalexina / 3); // a cada 8 horas
        return {
          doseDia: doseDiaCefalexina,
          doseUnitaria: doseUnitariaCefalexina,
          unidade: "mg"
        };
      }

      case "Amoxicilina":
      case "Amoxicilina com clavulanato": {
        const doseDiaMinAmox = 50 * peso; // 50 mg/kg/dia
        const doseDiaMaxAmox = 100 * peso; // 100 mg/kg/dia
        const doseUnitariaMinAmox = Math.round(doseDiaMinAmox / 3); // a cada 8 horas
        const doseUnitariaMaxAmox = Math.round(doseDiaMaxAmox / 3); // a cada 8 horas
        return {
          doseDiaMin: doseDiaMinAmox,
          doseDiaMax: doseDiaMaxAmox,
          doseUnitariaMin: doseUnitariaMinAmox,
          doseUnitariaMax: doseUnitariaMaxAmox,
          unidade: "mg"
        };
      }

      case "Penicilina cristalina": {
        const doseDiaPenicilina = 200000 * peso; // 200.000 U/kg/dia
        const doseUnitariaPenicilina = Math.round(doseDiaPenicilina / 4); // a cada 6 horas
        return {
          doseDia: doseDiaPenicilina,
          doseUnitaria: doseUnitariaPenicilina,
          unidade: "U"
        };
      }

      case "Oxacilina": {
        const doseDiaOxacilina = 200 * peso; // 200 mg/kg/dia
        const doseUnitariaOxacilina = Math.round(doseDiaOxacilina / 4); // a cada 6 horas
        return {
          doseDia: doseDiaOxacilina,
          doseUnitaria: doseUnitariaOxacilina,
          unidade: "mg"
        };
      }

      case "Cefalotina": {
        const doseDiaCefalotina = 100 * peso; // 100 mg/kg/dia
        const doseUnitariaCefalotina = Math.round(doseDiaCefalotina / 3); // a cada 8 horas
        return {
          doseDia: doseDiaCefalotina,
          doseUnitaria: doseUnitariaCefalotina,
          unidade: "mg"
        };
      }

      case "Ceftriaxona": {
        const doseDiaCeftriaxona = 100 * peso; // 100 mg/kg/dia
        const doseUnitariaCeftriaxona = Math.round(doseDiaCeftriaxona / 2); // a cada 12 horas
        return {
          doseDia: doseDiaCeftriaxona,
          doseUnitaria: doseUnitariaCeftriaxona,
          unidade: "mg"
        };
      }

      case "Clindamicina": {
        const doseDiaMinClinda = 20 * peso; // 20 mg/kg/dia
        const doseDiaMaxClinda = 40 * peso; // 40 mg/kg/dia
        const doseUnitariaMinClinda = Math.round(doseDiaMinClinda / 3); // 3 doses
        const doseUnitariaMaxClinda = Math.round(doseDiaMaxClinda / 3); // 3 doses
        return {
          doseDiaMin: doseDiaMinClinda,
          doseDiaMax: doseDiaMaxClinda,
          doseUnitariaMin: doseUnitariaMinClinda,
          doseUnitariaMax: doseUnitariaMaxClinda,
          unidade: "mg"
        };
      }

      default:
        return { unidade: "mg" };
    }
  }

  /**
   * Método principal que recebe os dados e retorna os resultados
   */
  calcular(dados: ErisipelaInput): ErisipelaResult {
    const {
      peso,
      lesoesExtensas,
      sintomasSystemicos,
      comorbidades,
      sinaisSepse,
      celuliteExtensa,
      abscessos,
      imunossupressao
    } = dados;

    // Lista de complicações (se existirem)
    const complicacoes: string[] = [];
    if (sinaisSepse) {
      complicacoes.push("Sinais de sepse");
    }
    if (celuliteExtensa) {
      complicacoes.push("Celulite extensa");
    }
    if (abscessos) {
      complicacoes.push("Abscessos");
    }
    if (imunossupressao) {
      complicacoes.push("Imunossupressão");
    }

    // Determinar necessidade de internação
    const necessitaInternacao = lesoesExtensas || sintomasSystemicos || comorbidades || sinaisSepse;

    // Determinar o protocolo de tratamento
    let medicamentoRecomendado: string;
    let medicamentoSecundario: string | undefined;

    if (necessitaInternacao) {
      medicamentoRecomendado = "Oxacilina";
      if (sinaisSepse) {
        medicamentoSecundario = "Clindamicina";
      }
    } else {
      medicamentoRecomendado = "Cefalexina";
    }

    // Calcular doses
    const dosesMedicamentoPrincipal = this.calcularDoseMedicamento(medicamentoRecomendado, peso);
    const dosesMedicamentoSecundario = medicamentoSecundario 
      ? this.calcularDoseMedicamento(medicamentoSecundario, peso)
      : undefined;

    // Determinar outras opções de tratamento
    const outrasOpcoes: ErisipenaoTratamento[] = [];

    if (necessitaInternacao) {
      // Adicionar outras opções de tratamento hospitalar
      for (const medicamento of this.tratamentoHospitalar) {
        if (medicamento.medicamento !== medicamentoRecomendado && 
            medicamento.medicamento !== medicamentoSecundario) {
          outrasOpcoes.push({
            medicamento: medicamento.medicamento,
            dosagem: medicamento.dosagem,
            frequencia: medicamento.frequencia,
            doses: this.calcularDoseMedicamento(medicamento.medicamento, peso)
          });
        }
      }
    } else {
      // Adicionar outras opções de tratamento ambulatorial
      for (const medicamento of this.tratamentoAmbulatorial) {
        if (medicamento.medicamento !== medicamentoRecomendado) {
          outrasOpcoes.push({
            medicamento: medicamento.medicamento,
            dosagem: medicamento.dosagem,
            frequencia: medicamento.frequencia,
            doses: this.calcularDoseMedicamento(medicamento.medicamento, peso)
          });
        }
      }
    }

    // Recomendações para o manejo
    const recomendacoes: string[] = [];
    if (necessitaInternacao) {
      recomendacoes.push("Internação hospitalar");
      recomendacoes.push("Iniciar antibiótico venoso");
      recomendacoes.push("Acompanhamento clínico diário");
      recomendacoes.push("Elevação do membro afetado");
      if (sinaisSepse) {
        recomendacoes.push("Monitoramento de sinais vitais");
        recomendacoes.push("Considerar suporte hemodinâmico se necessário");
      }
    } else {
      recomendacoes.push("Tratamento ambulatorial com antibiótico oral");
      recomendacoes.push("Elevação do membro afetado");
      recomendacoes.push("Retorno para reavaliação em 48-72 horas");
      recomendacoes.push("Orientar retorno imediato se piora dos sintomas");
    }

    return {
      necessitaInternacao,
      medicamentoRecomendado,
      dosesMedicamentoPrincipal,
      medicamentoSecundario,
      dosesMedicamentoSecundario,
      complicacoes,
      recomendacoes,
      outrasOpcoes
    };
  }
}

// Instância singleton para uso global
export const erisipelaCalculator = new ErisipelaCalculator();
