import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para corrigir problemas comuns em JSON
function fixJsonFile(inputFilePath, outputFilePath) {
  try {
    console.log(`Lendo arquivo: ${inputFilePath}`);
    let jsonString = fs.readFileSync(inputFilePath, 'utf8');
    
    // Correção 1: Adicionar vírgulas faltantes entre objetos
    jsonString = jsonString.replace(/"\s*\n\s*"/g, '",\n"');
    
    // Correção 2: Adicionar vírgulas faltantes entre propriedades
    jsonString = jsonString.replace(/"\s*\n\s*}/g, '"\n}');
    
    // Correção 3: Corrigir problema específico na linha ~2234
    jsonString = jsonString.replace(/"administrationNotes"\s*:\s*""\s*\n\s*"description"/g, 
                                   '"administrationNotes": "",\n      "description"');
    
    // Tentativa de parse do JSON corrigido
    try {
      const jsonData = JSON.parse(jsonString);
      console.log('✅ JSON corrigido e validado com sucesso!');
      
      // Escrever o JSON formatado
      fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
      console.log(`✅ JSON formatado salvo em: ${outputFilePath}`);
      
      return true;
    } catch (parseError) {
      console.error('❌ Ainda há erros no JSON:', parseError.message);
      
      // Se ainda houver erros, salvar a versão parcialmente corrigida para inspeção
      const tempFilePath = outputFilePath.replace('.json', '_parcial.json');
      fs.writeFileSync(tempFilePath, jsonString, 'utf8');
      console.log(`⚠️ Versão parcialmente corrigida salva em: ${tempFilePath}`);
      
      // Tentar identificar a linha do erro
      const match = parseError.message.match(/position\s+(\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        const lineNumber = lines.length;
        const column = lines[lines.length - 1].length + 1;
        console.error(`   O erro está próximo à linha ${lineNumber}, coluna ${column}`);
        
        // Mostrar o contexto do erro
        const contextStart = Math.max(0, lineNumber - 5);
        const contextEnd = Math.min(jsonString.split('\n').length, lineNumber + 5);
        console.error('   Contexto do erro:');
        
        const allLines = jsonString.split('\n');
        for (let i = contextStart; i < contextEnd; i++) {
          const prefix = i === lineNumber - 1 ? '>> ' : '   ';
          console.error(`${prefix}${i + 1}: ${allLines[i]}`);
        }
      }
      
      // Usar o arquivo formatado como fallback
      console.log('⚠️ Usando o arquivo formatado como fallback...');
      const formattedFilePath = inputFilePath.replace('.json', '_formatado.json');
      if (fs.existsSync(formattedFilePath)) {
        const formattedContent = fs.readFileSync(formattedFilePath, 'utf8');
        fs.writeFileSync(outputFilePath, formattedContent, 'utf8');
        console.log(`✅ Arquivo formatado copiado para: ${outputFilePath}`);
        return true;
      } else {
        console.error('❌ Arquivo formatado não encontrado!');
        return false;
      }
    }
  } catch (fileError) {
    console.error('❌ Erro ao ler o arquivo:', fileError.message);
    return false;
  }
}

// Caminhos dos arquivos
const inputPath = path.join(__dirname, 'src', 'medications', 'banco_dosagens_medicas.json');
const outputPath = path.join(__dirname, 'src', 'medications', 'banco_dosagens_medicas_corrigido.json');

// Executar a correção
fixJsonFile(inputPath, outputPath);
