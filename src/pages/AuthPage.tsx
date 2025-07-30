import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { checkAndCleanCorruptedTokens, clearAuthData } from '@/utils/auth-utils';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  fullName: string;
  email: string;
  crm: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordForm {
  email: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showEmailConfirmationHelp, setShowEmailConfirmationHelp] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();
  const forgotPasswordForm = useForm<ForgotPasswordForm>();

  useEffect(() => {
    // Check if user is already logged in with error handling
    const checkUser = async () => {
      try {
        // First check and clean any corrupted tokens
        const hasValidSession = await checkAndCleanCorruptedTokens();
        
        if (!hasValidSession) {
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthPage session error:', error);
          // If there's an auth error, clean the data
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('refresh_token_not_found')) {
            clearAuthData();
            toast({
              title: "Sessão expirada",
              description: "Por favor, faça login novamente.",
            });
            return;
          }
        }
        
        if (session) {
          navigate('/platform/calculator');
        }
      } catch (error) {
        console.error('AuthPage unexpected error:', error);
        clearAuthData();
      }
    };
    
    // Check URL parameters for different scenarios
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('reset') === 'true') {
      toast({
        title: "Link de recuperação válido",
        description: "Você pode redefinir sua senha agora.",
      });
    }
    
    if (urlParams.get('confirmed') === 'true') {
      toast({
        title: "Email confirmado!",
        description: "Sua conta foi verificada com sucesso. Você já pode fazer login.",
      });
      // Clean URL
      window.history.replaceState({}, document.title, '/auth');
    }
    
    checkUser();
  }, [navigate, toast]);

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    
    // Notificação inicial
    toast({
      title: "🔄 Iniciando login...",
      description: "Conectando com o servidor de autenticação",
    });
    
    try {
      console.log('🔐 Tentando fazer login com:', { email: data.email });
      console.log('📡 Enviando requisição para Supabase...');
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      console.log('📥 Resposta do Supabase:', { authData, error });

      if (error) {
        console.error('❌ Erro de autenticação:', error);
        
        // Melhores mensagens de erro em português
        let errorMessage = "Erro desconhecido";
        let errorDetails = "";
        
        // Sistema inteligente de identificação de erros baseado em boas práticas
        if (error.status === 400 || error.message.includes('400')) {
          // Verificar se é erro de credenciais inválidas
          if (error.message.includes('Invalid login credentials') || error.code === 'invalid_credentials') {
            // Tentar identificar o tipo específico de problema
            const email = loginForm.getValues('email');
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            if (!isValidEmail) {
              // Email com formato inválido
              errorMessage = "Formato de email inválido";
              errorDetails = "Verifique se o email está no formato correto (exemplo@dominio.com)";
              
              toast({
                title: "📧 Email inválido",
                description: "Use o formato: seuemail@provedor.com",
              });
            } else {
              // Email válido, mas credenciais incorretas
              errorMessage = "Credenciais incorretas";
              errorDetails = "Email não encontrado, senha incorreta ou email não confirmado";
              
              // Mostrar banner de ajuda
              setShowEmailConfirmationHelp(true);
              
              // Notificações escalonadas com base em probabilidade
              setTimeout(() => {
                toast({
                  title: "🔑 Possíveis causas",
                  description: "1️⃣ Email não confirmado | 2️⃣ Senha incorreta | 3️⃣ Email não cadastrado",
                });
              }, 1500);
              
              setTimeout(() => {
                toast({
                  title: "📧 Email não confirmado?",
                  description: "Causa mais comum: Verifique sua caixa de entrada e confirme o email",
                });
              }, 3500);
              
              setTimeout(() => {
                toast({
                  title: "🔒 Esqueceu a senha?",
                  description: "Use 'Esqueci minha senha' para redefinir sua senha",
                });
              }, 5500);
              
              setTimeout(() => {
                toast({
                  title: "👤 Primeira vez aqui?",
                  description: "Se não tem conta, use a aba 'Cadastrar' para criar uma",
                });
              }, 7500);
            }
          } else {
            errorMessage = "Erro de configuração do servidor";
            errorDetails = "Problema com a API do Supabase. Tente usar window.clearSupabaseAuth() no console";
            
            // Sugerir limpeza automática
            toast({
              title: "🔧 Sugestão de correção",
              description: "Abra o console (F12) e execute: window.clearSupabaseAuth()",
            });
          }
        } else {
          switch (error.message) {
            case "Invalid login credentials":
              errorMessage = "Login inválido";
              errorDetails = "Email ou senha incorretos. Verifique seus dados";
              
              // Sugestão para cadastro se usuário não existe
              setTimeout(() => {
                toast({
                  title: "🤔 Não consegue entrar?",
                  description: "Verifique se você já tem uma conta ou crie uma nova na aba 'Cadastrar'",
                });
              }, 3000);
              break;
              
            case "Email not confirmed":
              errorMessage = "Email não confirmado";
              errorDetails = "Você precisa confirmar seu email antes de fazer login";
              
              // Mostrar banner específico para email não confirmado
              setShowEmailConfirmationHelp(true);
              
              toast({
                title: "📧 Email não confirmado",
                description: "Você precisa confirmar seu email antes de fazer login",
              });
              
              setTimeout(() => {
                toast({
                  title: "📬 Como confirmar?",
                  description: "1️⃣ Abra seu email | 2️⃣ Procure também no spam | 3️⃣ Clique no link",
                });
              }, 2500);
              
              setTimeout(() => {
                toast({
                  title: "🔄 Não recebeu?",
                  description: "Use 'Esqueci minha senha' para receber um novo email",
                });
              }, 5000);
              break;
              
            case "Email confirmation required":
              errorMessage = "Confirmação de email necessária";
              errorDetails = "Sua conta foi criada, mas você precisa confirmar o email";
              break;
              
            case "Too many requests":
              errorMessage = "Muitas tentativas de login";
              errorDetails = "Aguarde 5-10 minutos antes de tentar novamente";
              
              // Sugestão de recuperação de senha
              setTimeout(() => {
                toast({
                  title: "🔑 Esqueceu a senha?",
                  description: "Use o link 'Esqueci minha senha' para redefinir sua senha",
                });
              }, 2000);
              break;
              
            case "User not found":
              errorMessage = "Usuário não encontrado";
              errorDetails = "Este email não está cadastrado no sistema";
              
              // Sugestão para cadastro
              setTimeout(() => {
                toast({
                  title: "👤 Primeira vez aqui?",
                  description: "Clique na aba 'Cadastrar' para criar sua conta gratuita",
                });
              }, 1500);
              break;
              
            case "Invalid email":
              errorMessage = "Email inválido";
              errorDetails = "Verifique o formato do seu email (exemplo@dominio.com)";
              break;
              
            case "Weak password":
              errorMessage = "Senha muito fraca";
              errorDetails = "Use uma senha com pelo menos 6 caracteres, incluindo letras e números";
              break;
              
            case "Network error":
              errorMessage = "Erro de conexão";
              errorDetails = "Verifique sua conexão com a internet e tente novamente";
              break;
              
            default:
              errorMessage = error.message || "Erro desconhecido";
              errorDetails = `Código: ${error.status || error.code || 'N/A'}`;
              
              // Para erros desconhecidos, sugerir limpeza
              setTimeout(() => {
                toast({
                  title: "🔧 Erro técnico?",
                  description: "Tente limpar os dados: window.clearSupabaseAuth() no console (F12)",
                });
              }, 2000);
          }
        }
        
        toast({
          variant: "destructive",
          title: `❌ ${errorMessage}`,
          description: errorDetails,
        });
        
        // Log detalhado para debug
        console.group('🔍 Detalhes do erro de login:');
        console.log('Mensagem:', error.message);
        console.log('Status:', error.status);
        console.log('Código:', error.code);
        console.log('Detalhes completos:', error);
        console.groupEnd();
        
        return;
      }

      console.log('✅ Login bem-sucedido!');
      toast({
        title: "✅ Login realizado com sucesso!",
        description: "Redirecionando para a plataforma...",
      });

      // Pequeno delay para mostrar a notificação de sucesso
      setTimeout(() => {
        navigate('/platform/calculator');
      }, 1000);
      
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error);
      
      let errorMessage = "Erro de conexão";
      let errorDetails = "Verifique sua conexão com a internet";
      
      if (error instanceof Error) {
        errorMessage = "Erro inesperado";
        errorDetails = error.message;
      }
      
      toast({
        variant: "destructive",
        title: `💥 ${errorMessage}`,
        description: errorDetails,
      });
      
      // Log detalhado para debug
      console.group('🔍 Detalhes do erro inesperado:');
      console.log('Tipo:', typeof error);
      console.log('Mensagem:', error instanceof Error ? error.message : String(error));
      console.log('Stack:', error instanceof Error ? error.stack : 'N/A');
      console.log('Objeto completo:', error);
      console.groupEnd();
      
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "❌ Erro",
        description: "As senhas não coincidem",
      });
      return;
    }

    setIsLoading(true);
    
    // Notificação inicial
    toast({
      title: "🔄 Criando conta...",
      description: "Registrando usuário no sistema",
    });
    
    try {
      console.log('👤 Tentando criar conta para:', { email: data.email, fullName: data.fullName });
      console.log('📡 Enviando requisição de cadastro para Supabase...');
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`,
          data: {
            full_name: data.fullName,
            crm: data.crm,
            phone: data.phone,
          }
        }
      });
      
      console.log('📥 Resposta do cadastro Supabase:', { authData, error });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        
        // Sistema inteligente de tratamento de erros no cadastro
        let errorMessage = "Erro desconhecido";
        let errorDetails = "";
        
        // Sistema inteligente de tratamento de erros no cadastro
        if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
          errorMessage = "Email já cadastrado";
          errorDetails = "Este email já possui uma conta ativa.";
          
          toast({
            title: "📧 Email já existe",
            description: "Este email já tem uma conta cadastrada",
          });
          
          // Orientações específicas para usuário existente
          setTimeout(() => {
            toast({
              title: "🔑 Opções disponíveis",
              description: "1️⃣ Fazer login | 2️⃣ Recuperar senha | 3️⃣ Usar outro email",
            });
          }, 2000);
          
          setTimeout(() => {
            toast({
              title: "🔄 Quer fazer login?",
              description: "Clique na aba 'Login' para acessar sua conta",
            });
          }, 4000);
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = "Senha muito curta";
          errorDetails = "A senha deve ter pelo menos 6 caracteres";
          
          toast({
            title: "🔒 Senha muito curta",
            description: "Use pelo menos 6 caracteres",
          });
          
          // Dica de senha segura
          setTimeout(() => {
            toast({
              title: "💡 Dica de segurança",
              description: "Use uma combinação de letras, números e símbolos",
            });
          }, 1500);
        } else if (error.message.includes('Invalid email format')) {
          errorMessage = "Formato de email inválido";
          errorDetails = "Use o formato: exemplo@dominio.com";
          
          toast({
            title: "📧 Email inválido",
            description: "Use o formato: seuemail@provedor.com",
          });
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = "Limite de emails atingido";
          errorDetails = "Aguarde alguns minutos antes de tentar novamente";
          
          toast({
            title: "⏰ Muitas tentativas",
            description: "Aguarde alguns minutos e tente novamente",
          });
        } else if (error.message.includes('Signup disabled')) {
          errorMessage = "Cadastro temporariamente indisponível";
          errorDetails = "Tente novamente mais tarde ou entre em contato conosco";
          
          toast({
            title: "🚫 Cadastro indisponível",
            description: "Tente novamente mais tarde",
          });
        } else {
          errorMessage = error.message || "Erro no cadastro";
          errorDetails = `Código: ${error.status || error.code || 'N/A'}`;
          
          toast({
            title: "❌ Erro no cadastro",
            description: errorMessage,
          });
          
          // Para erros desconhecidos no cadastro
          setTimeout(() => {
            toast({
              title: "🔧 Problema técnico?",
              description: "Tente recarregar a página ou entre em contato conosco",
            });
          }, 2000);
        }
        
        toast({
          variant: "destructive",
          title: `❌ ${errorMessage}`,
          description: errorDetails,
        });
        
        // Log detalhado para debug
        console.group('🔍 Detalhes do erro de cadastro:');
        console.log('Mensagem:', error.message);
        console.log('Status:', error.status);
        console.log('Código:', error.code);
        console.log('Detalhes completos:', error);
        console.groupEnd();
        
        return;
      }

      console.log('✅ Cadastro bem-sucedido!');
      toast({
        title: "✅ Conta criada com sucesso!",
        description: "Um email de confirmação foi enviado para sua caixa de entrada",
      });
      
      // Notificação com instruções passo-a-passo
      setTimeout(() => {
        toast({
          title: "📧 IMPORTANTE: Confirme seu email",
          description: "1️⃣ Abra seu email → 2️⃣ Clique no link → 3️⃣ Volte aqui para fazer login",
        });
      }, 2000);
      
      // Notificação sobre verificar spam
      setTimeout(() => {
        toast({
          title: "📬 Não encontrou o email?",
          description: "Verifique spam/lixo eletrônico. O email pode demorar alguns minutos",
        });
      }, 5000);
      
      // Notificação final com lembrete
      setTimeout(() => {
        toast({
          title: "⚠️ Lembrete importante",
          description: "Sem confirmação de email, você não conseguirá fazer login!",
        });
      }, 8000);

      // Marcar que o usuário acabou de se registrar
      setJustRegistered(true);
      
      // Clear form
      registerForm.reset();
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        const loginTab = document.querySelector('[value="login"]') as HTMLElement;
        if (loginTab) {
          loginTab.click();
          toast({
            title: "🔄 Pronto para fazer login",
            description: "Após confirmar o email, use suas credenciais para entrar",
          });
        }
      }, 3000);
    } catch (error) {
      console.error('Register error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async (data: ForgotPasswordForm) => {
    setIsResetLoading(true);
    
    // Notificação inicial
    toast({
      title: "📧 Enviando email de recuperação...",
      description: "Processando sua solicitação",
    });
    
    try {
      console.log('🔑 Solicitando recuperação de senha para:', data.email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        console.error('❌ Erro na recuperação de senha:', error);
        
        let errorMessage = "Erro ao enviar email";
        let errorDetails = "";
        
        switch (error.message) {
          case "User not found":
            errorMessage = "Email não encontrado";
            errorDetails = "Este email não está cadastrado no sistema";
            
            // Sugestão para cadastro
            setTimeout(() => {
              toast({
                title: "👤 Primeira vez aqui?",
                description: "Clique em 'Cadastrar' para criar sua conta",
              });
            }, 2000);
            break;
            
          case "Email rate limit exceeded":
            errorMessage = "Muitas solicitações";
            errorDetails = "Aguarde alguns minutos antes de tentar novamente";
            break;
            
          case "Invalid email":
            errorMessage = "Email inválido";
            errorDetails = "Verifique o formato do email";
            break;
            
          default:
            errorMessage = "Erro no envio";
            errorDetails = error.message || "Tente novamente em alguns instantes";
        }
        
        toast({
          variant: "destructive",
          title: `❌ ${errorMessage}`,
          description: errorDetails,
        });
        return;
      }

      console.log('✅ Email de recuperação enviado!');
      toast({
        title: "✅ Email de recuperação enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
      
      // Notificações adicionais com instruções
      setTimeout(() => {
        toast({
          title: "📬 Instruções enviadas",
          description: "Clique no link do email para criar uma nova senha",
        });
      }, 2000);
      
      setTimeout(() => {
        toast({
          title: "🕒 Não recebeu o email?",
          description: "Verifique a pasta de spam ou tente novamente em 5 minutos",
        });
      }, 5000);

      // Clear form and close dialog
      forgotPasswordForm.reset();
      setIsResetDialogOpen(false);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/64143.jpg)',
          filter: 'blur(5px)',
          transform: 'scale(1.1)' // Prevent blur edge artifacts
        }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Main content with fade animation */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 shadow-2xl animate-in fade-in duration-700 slide-in-from-bottom-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">PedLife</CardTitle>
          <CardDescription>
            Acesse sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        
        {/* Banner de ajuda para confirmação de email */}
        {showEmailConfirmationHelp && (
          <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">📧</div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-1">Problema no login?</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Se você se cadastrou recentemente, precisa <strong>confirmar seu email</strong> antes de fazer login.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• Verifique sua caixa de entrada</p>
                  <p>• Procure também na pasta de spam</p>
                  <p>• Clique no link de confirmação</p>
                </div>
                <button 
                  onClick={() => setShowEmailConfirmationHelp(false)}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
                >
                  Entendi, fechar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Banner de sucesso após cadastro */}
        {justRegistered && (
          <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-1">Conta criada com sucesso!</h4>
                <p className="text-sm text-green-700 mb-2">
                  Agora você precisa <strong>confirmar seu email</strong> para fazer login.
                </p>
                <div className="text-xs text-green-600 bg-green-100 p-2 rounded mb-2">
                  <strong>Próximos passos:</strong><br/>
                  1️⃣ Abra seu email<br/>
                  2️⃣ Clique no link de confirmação<br/>
                  3️⃣ Volte aqui e faça login
                </div>
                <button 
                  onClick={() => setJustRegistered(false)}
                  className="text-xs text-green-500 hover:text-green-700 underline"
                >
                  Ok, entendi
                </button>
              </div>
            </div>
          </div>
        )}
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...loginForm.register('email', { 
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido"
                      }
                    })}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Sua senha"
                    {...loginForm.register('password', { 
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres"
                      }
                    })}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto font-normal text-sm">
                        Esqueci minha senha
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Recuperar senha</DialogTitle>
                        <DialogDescription>
                          Digite seu email para receber um link de recuperação de senha.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="seu@email.com"
                            {...forgotPasswordForm.register('email', { 
                              required: "Email é obrigatório",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email inválido"
                              }
                            })}
                          />
                          {forgotPasswordForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{forgotPasswordForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsResetDialogOpen(false)}
                            disabled={isResetLoading}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isResetLoading}
                          >
                            {isResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Conectando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <Input
                    id="register-name"
                    placeholder="Seu nome completo"
                    {...registerForm.register('fullName', { 
                      required: "Nome completo é obrigatório",
                      minLength: {
                        value: 2,
                        message: "Nome deve ter pelo menos 2 caracteres"
                      }
                    })}
                  />
                  {registerForm.formState.errors.fullName && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerForm.register('email', { 
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido"
                      }
                    })}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-crm">CRM (opcional)</Label>
                  <Input
                    id="register-crm"
                    placeholder="123456"
                    {...registerForm.register('crm', { required: false })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Telefone</Label>
                  <Input
                    id="register-phone"
                    placeholder="(11) 99999-9999"
                    {...registerForm.register('phone', { 
                      required: "Telefone é obrigatório",
                      pattern: {
                        value: /^[+]?[1-9][\d]{0,15}$/,
                        message: "Telefone inválido"
                      }
                    })}
                  />
                  {registerForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Sua senha"
                    {...registerForm.register('password', { 
                      required: "Senha é obrigatória", 
                      minLength: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
                      }
                    })}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirme sua senha"
                    {...registerForm.register('confirmPassword', { 
                      required: "Confirmação de senha é obrigatória",
                      validate: (value) => {
                        const password = registerForm.getValues('password');
                        return value === password || "As senhas não coincidem";
                      }
                    })}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;