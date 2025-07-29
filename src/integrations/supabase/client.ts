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
  console.log(' PedLife - Funções de debug disponíveis:');
  console.log('   • window.clearSupabaseAuth() - Limpa todos os dados de auth');
  console.log('   • window.diagnoseAuth() - Diagnostica problemas de auth');
  
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
    console.log(' Diagnosticando autenticação...');
    console.log('URL do Supabase:', supabaseUrl);
    console.log('API Key presente:', supabaseKey ? '' : '');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Sessão atual:', session ? ' Válida' : ' Nenhuma sessão válida encontrada');
      if (error) {
        console.error('Erro na sessão:', error);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  };
}