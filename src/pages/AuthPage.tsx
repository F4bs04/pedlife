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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Melhores mensagens de erro em português
        let errorMessage = "Erro desconhecido";
        
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "Email ou senha incorretos";
            break;
          case "Email not confirmed":
            errorMessage = "Por favor, confirme seu email antes de fazer login";
            break;
          case "Too many requests":
            errorMessage = "Muitas tentativas. Tente novamente em alguns minutos";
            break;
          case "User not found":
            errorMessage = "Usuário não encontrado";
            break;
          default:
            errorMessage = error.message;
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: errorMessage,
        });
        return;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });

      navigate('/platform/calculator');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
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

      if (error) {
        // Melhores mensagens de erro em português
        let errorMessage = "Erro desconhecido";
        
        switch (error.message) {
          case "User already registered":
            errorMessage = "Este email já está cadastrado";
            break;
          case "Password should be at least 6 characters":
            errorMessage = "A senha deve ter pelo menos 6 caracteres";
            break;
          case "Invalid email format":
            errorMessage = "Formato de email inválido";
            break;
          case "Password should contain at least one uppercase letter":
            errorMessage = "A senha deve conter pelo menos uma letra maiúscula";
            break;
          default:
            errorMessage = error.message;
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: errorMessage,
        });
        return;
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta antes de fazer login.",
      });

      // Clear form
      registerForm.reset();
      
      // Switch to login tab after successful registration
      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
      if (loginTab) loginTab.click();
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
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao enviar email",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Email enviado!",
        description: "Verifique seu email para redefinir sua senha.",
      });

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
                  Entrar
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