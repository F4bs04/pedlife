import { supabase } from '@/integrations/supabase/client';

/**
 * Limpa completamente todos os dados de autenticação armazenados
 */
export const clearAuthData = () => {
  // Limpar localStorage
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('supabase')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Limpar sessionStorage
  const sessionKeysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.includes('supabase')) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

  // Limpar cookies relacionados ao Supabase (se houver)
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.includes('supabase') || name.includes('auth')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
};

/**
 * Força um logout completo e limpa todos os dados
 */
export const forceLogout = async () => {
  try {
    // Tentar fazer logout normal primeiro
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('Normal logout failed, forcing cleanup:', error);
  } finally {
    // Sempre limpar os dados independentemente do resultado
    clearAuthData();
    
    // Recarregar a página para garantir que o estado seja limpo
    window.location.href = '/auth';
  }
};

/**
 * Verifica se há tokens corrompidos e os limpa automaticamente
 */
export const checkAndCleanCorruptedTokens = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Session error detected, cleaning auth data:', error);
      clearAuthData();
      return false;
    }
    
    return !!session;
  } catch (error) {
    console.warn('Error checking session, cleaning auth data:', error);
    clearAuthData();
    return false;
  }
};
