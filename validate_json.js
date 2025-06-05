import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para validar e formatar JSON
function validateAndFormatJSON(inputFilePath, outputFilePath) {
  try {
    console.log(`Lendo arquivo: ${inputFilePath}`);
    const jsonString = fs.readFileSync(inputFilePath, 'utf8');
    
    // Tentar fazer o parse do JSON
    try {
      const jsonData = JSON.parse(jsonString);
      console.log('✅ JSON válido!');
      
      // Escrever o JSON formatado
      fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
      console.log(`✅ JSON formatado salvo em: ${outputFilePath}`);
      
      return true;
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError.message);
      
      // Tentar identificar a linha do erro
      const match = parseError.message.match(/position\s+(\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        const lineNumber = lines.length;
        const column = lines[lines.length - 1].length + 1;
        console.error(`   O erro está próximo à linha ${lineNumber}, coluna ${column}`);
        
        // Mostrar o contexto do erro
        const contextStart = Math.max(0, lineNumber - 3);
        const contextEnd = Math.min(jsonString.split('\n').length, lineNumber + 3);
        console.error('   Contexto do erro:');
        
        const allLines = jsonString.split('\n');
        for (let i = contextStart; i < contextEnd; i++) {
          const prefix = i === lineNumber - 1 ? '>> ' : '   ';
          console.error(`${prefix}${i + 1}: ${allLines[i]}`);
        }
      }
      
      return false;
    }
  } catch (fileError) {
    console.error('❌ Erro ao ler o arquivo:', fileError.message);
    return false;
  }
}

// Caminhos dos arquivos
const inputPath = path.join(__dirname, 'src', 'medications', 'banco_dosagens_medicas.json');
const outputPath = path.join(__dirname, 'src', 'medications', 'banco_dosagens_medicas_corrigido.json');

// Executar a validação
validateAndFormatJSON(inputPath, outputPath);
