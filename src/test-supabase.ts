import { supabase } from '@/integrations/supabase/client';
import { clearAuthData, checkAndCleanCorruptedTokens } from '@/utils/auth-utils';
import { Session } from '@supabase/supabase-js';

// Função para limpar dados corrompidos - pode ser executada via console
(window as Window & typeof globalThis & { clearSupabaseAuth: () => void }).clearSupabaseAuth = () => {
  clearAuthData();
  console.log('✅ Todos os dados de autenticação foram limpos');
  console.log('🔄 Recarregue a página para aplicar as mudanças');
};

// Função para diagnosticar problemas de autenticação
(window as Window & typeof globalThis & { diagnoseAuth: () => Promise<void> }).diagnoseAuth = async () => {
  console.log('🔍 Diagnosticando problemas de autenticação...');
  
  try {
    // Verificar dados no localStorage
    const localStorageKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
    console.log('📦 Chaves no localStorage:', localStorageKeys);
    
    // Verificar dados no sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage).filter(key => key.includes('supabase'));
    console.log('🗂️ Chaves no sessionStorage:', sessionStorageKeys);
    
    // Tentar obter sessão atual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro na sessão:', error);
      console.log('🧹 Recomendação: Execute window.clearSupabaseAuth() para limpar');
    } else if (session) {
      console.log('✅ Sessão válida encontrada:', {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: new Date(session.expires_at! * 1000)
      });
    } else {
      console.log('ℹ️ Nenhuma sessão ativa encontrada');
    }
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
    console.log('🧹 Execute window.clearSupabaseAuth() para limpar todos os dados');
  }
};

// Teste para verificar conexão com Supabase e buscar dados do usuário
export async function testSupabaseConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    
    // Primeiro, verificar e limpar tokens corrompidos
    const hasValidSession = await checkAndCleanCorruptedTokens();
    
    if (!hasValidSession) {
      console.log('⚠️ Nenhuma sessão válida encontrada');
      return;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro na sessão:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('ℹ️ Nenhuma sessão ativa encontrada');
      return;
    }
    
    console.log('✅ Sessão ativa encontrada:', {
      userId: session.user.id,
      email: session.user.email,
      userMetadata: session.user.user_metadata
    });
    
    // Buscar dados do perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erro no perfil:', profileError);
      
      // Se o perfil não existe, tentar criar
      if (profileError.code === 'PGRST116') {
        console.log('📝 Perfil não encontrado, tentando criar...');
        await createUserProfile(session);
      }
      return;
    }
    
    console.log('✅ Perfil do usuário:', profile);
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

// Função auxiliar para criar perfil do usuário
async function createUserProfile(session: Session) {
  try {
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuário',
        crm: session.user.user_metadata.crm || null,
        phone: session.user.user_metadata.phone || null
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao criar perfil:', insertError);
      return;
    }
    
    console.log('✅ Perfil criado:', newProfile);
  } catch (error) {
    console.error('💥 Erro ao criar perfil:', error);
  }
}

// Executar teste ao importar (apenas no browser)
if (typeof window !== 'undefined') {
  console.log('🚀 PedLife - Funções de debug disponíveis:');
  console.log('   • window.clearSupabaseAuth() - Limpa todos os dados de auth');
  console.log('   • window.diagnoseAuth() - Diagnostica problemas de auth');
  
  // Executar teste automático
  testSupabaseConnection();
}