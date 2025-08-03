/**
 * Teste simples para verificar se a calculadora de anafilaxia funciona corretamente
 */

import { anafilaxiaCalculator } from './anafilaxia';
import { AnafilaxiaCalculationInput } from '../../types/protocol-calculators';

// Teste básico da calculadora
const testCalculator = () => {
  console.log('🧪 Testando Calculadora de Anafilaxia...');

  try {
    // Dados de teste
    const testInput: AnafilaxiaCalculationInput = {
      weight: 15,
      age: 3,
      symptoms: {
        urticaria: true,
        dispneia: true,
        taquicardia: true,
        vomitos: true
      }
    };

    // Executar cálculo
    const result = anafilaxiaCalculator.calculate(testInput);

    console.log('✅ Resultado do teste:');
    console.log('📊 Gravidade:', result.severity.level);
    console.log('💉 Dose de adrenalina:', `${result.adrenaline.doseMg} mg`);
    console.log('🩺 PA mínima:', `${result.minBloodPressure} mmHg`);
    console.log('🔄 Sistemas envolvidos:', result.severity.systems.join(', '));
    console.log('📝 Total de recomendações:', result.recommendations.length);

    return true;
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return false;
  }
};

// Executar teste se estiver em ambiente de desenvolvimento
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  testCalculator();
}

export { testCalculator };
