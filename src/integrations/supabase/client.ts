import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwctrihpwmpafwpfzecg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Y3RyaWhwd21wYWZ3cGZ6ZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Nzc5MzksImV4cCI6MjA2NTE1MzkzOX0.UsNWzqfQtYr1oaRMhPii8CsCy37ObdDDLH5Kf1_zrp8';

// Debug logs para diagnosticar problemas de configuração
console.log(' Testando conexão com Supabase...');
console.log('Supabase URL:', supabaseUrl);
console.log('API Key presente:', supabaseKey ? ' Sim' : ' Não');

// Validar se a API key está presente
if (!supabaseKey) {
  console.error(' ERRO: API Key do Supabase não encontrada!');
  console.log('Verifique se a variável VITE_SUPABASE_ANON_KEY está configurada.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: true // Ativar debug do Supabase
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
});

// Funções de debug disponíveis globalmente
if (typeof window !== 'undefined') {
  console.log('🚀 PedLife - Funções de debug disponíveis:');
  console.log('   • window.clearSupabaseAuth() - Limpa todos os dados de auth');
  console.log('   • window.diagnoseAuth() - Diagnostica problemas de auth');
  console.log('   • window.createTestUser() - Cria usuário de teste (teste@pedlife.com)');
  console.log('   • window.testLogin() - Testa login com usuário de teste');
  console.log('   • window.debugSupabaseConfig() - Diagnóstico completo do Supabase');
  console.log('   • window.forceCreateUser() - Criação forçada de usuário');
  
  (window as any).clearSupabaseAuth = () => {
    // Limpar localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase')) {
        console.log('Removendo do localStorage:', key);
        localStorage.removeItem(key);
      }
    });
    
    // Limpar sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase')) {
        console.log('Removendo do sessionStorage:', key);
        sessionStorage.removeItem(key);
      }
    });
    
    console.log(' Dados de autenticação limpos!');
    window.location.reload();
  };
  
  (window as any).diagnoseAuth = async () => {
    console.log('🔍 Diagnosticando autenticação...');
    console.log('URL do Supabase:', supabaseUrl);
    console.log('API Key presente:', supabaseKey ? '✅' : '❌');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Sessão atual:', session ? '✅ Válida' : '⚠️ Nenhuma sessão válida encontrada');
      if (error) {
        console.error('Erro na sessão:', error);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  };
  
  (window as any).createTestUser = async () => {
    console.log('👤 Criando usuário de teste...');
    
    const testUser = {
      email: 'teste@pedlife.com',
      password: 'Teste123!',
      fullName: 'Usuário Teste',
      crm: '123456',
      phone: '11999999999'
    };
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            full_name: testUser.fullName,
            crm: testUser.crm,
            phone: testUser.phone,
          }
        }
      });
      
      if (error) {
        console.error('❌ Erro ao criar usuário de teste:', error);
        if (error.message.includes('User already registered')) {
          console.log('✅ Usuário de teste já existe! Credenciais:');
          console.log('Email:', testUser.email);
          console.log('Senha:', testUser.password);
        }
      } else {
        console.log('✅ Usuário de teste criado com sucesso!');
        console.log('📧 Email:', testUser.email);
        console.log('🔑 Senha:', testUser.password);
        console.log('⚠️ Confirme o email se necessário');
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao criar usuário de teste:', error);
    }
  };
  
  (window as any).testLogin = async () => {
    console.log('🔐 Testando login com usuário de teste...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'teste@pedlife.com',
        password: 'Teste123!'
      });
      
      if (error) {
        console.error('❌ Erro no login de teste:', error);
        if (error.message.includes('Invalid login credentials')) {
          console.log('💡 Dica: Execute window.createTestUser() primeiro');
        }
      } else {
        console.log('✅ Login de teste bem-sucedido!');
        console.log('👤 Usuário:', data.user?.email);
      }
    } catch (error) {
      console.error('💥 Erro inesperado no teste de login:', error);
    }
  };
  
  (window as any).debugSupabaseConfig = async () => {
    console.log('🔍 Diagnosticando configuração completa do Supabase...');
    console.log('URL:', supabaseUrl);
    console.log('API Key (primeiros 20 chars):', supabaseKey?.substring(0, 20) + '...');
    
    try {
      // Testar conexão básica
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('📊 Status da sessão:', session ? '✅ Ativa' : '❌ Nenhuma');
      if (sessionError) console.error('Erro na sessão:', sessionError);
      
      // Testar configurações do projeto
      console.log('🔧 Testando configurações do projeto...');
      
      // Tentar um cadastro de teste para ver o erro específico
      console.log('🧪 Testando cadastro para identificar bloqueios...');
      const testEmail = `teste-${Date.now()}@pedlife.com`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TesteSenha123!',
        options: {
          data: {
            full_name: 'Teste Debug',
            test: true
          }
        }
      });
      
      if (signUpError) {
        console.error('❌ Erro no cadastro de teste:', signUpError);
        console.log('📋 Detalhes do erro:');
        console.log('  - Mensagem:', signUpError.message);
        console.log('  - Status:', signUpError.status);
        console.log('  - Código:', signUpError.code);
        
        // Verificar tipos específicos de erro
        if (signUpError.message.includes('Signup is disabled')) {
          console.log('🚫 PROBLEMA IDENTIFICADO: Cadastro está desabilitado no Supabase');
          console.log('💡 SOLUÇÃO: Habilitar cadastro nas configurações do projeto Supabase');
        } else if (signUpError.message.includes('Email rate limit')) {
          console.log('⏰ PROBLEMA: Limite de rate de emails atingido');
          console.log('💡 SOLUÇÃO: Aguardar ou configurar provedor de email');
        } else if (signUpError.message.includes('Invalid email')) {
          console.log('📧 PROBLEMA: Configuração de email inválida');
        }
      } else {
        console.log('✅ Cadastro de teste funcionou!');
        console.log('👤 Usuário criado:', signUpData.user?.email);
        console.log('📧 Confirmação necessária:', !signUpData.user?.email_confirmed_at);
      }
      
    } catch (error) {
      console.error('💥 Erro na análise:', error);
    }
  };
  
  (window as any).forceCreateUser = async (email = 'admin@pedlife.com', password = 'Admin123!') => {
    console.log('🚀 Tentativa de criação forçada de usuário...');
    console.log('📧 Email:', email);
    
    try {
      // Tentar diferentes abordagens de cadastro
      const approaches = [
        {
          name: 'Cadastro padrão',
          method: () => supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + '/auth?confirmed=true'
            }
          })
        },
        {
          name: 'Cadastro sem confirmação de email',
          method: () => supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + '/auth?confirmed=true',
              data: {
                email_confirm: false
              }
            }
          })
        }
      ];
      
      for (const approach of approaches) {
        console.log(`🔄 Tentando: ${approach.name}`);
        const { data, error } = await approach.method();
        
        if (error) {
          console.error(`❌ ${approach.name} falhou:`, error.message);
        } else {
          console.log(`✅ ${approach.name} funcionou!`);
          console.log('👤 Usuário:', data.user?.email);
          console.log('🔑 ID:', data.user?.id);
          return data;
        }
      }
      
      console.log('❌ Todas as abordagens falharam');
      
    } catch (error) {
      console.error('💥 Erro na criação forçada:', error);
    }
  };
}