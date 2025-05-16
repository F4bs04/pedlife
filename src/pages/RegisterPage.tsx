
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Por enquanto, redireciona diretamente para a plataforma
    navigate('/platform/calculator');
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-2xl font-semibold text-primary mb-4">Criando conta...</h1>
      <p className="text-muted-foreground">Redirecionando para a plataforma.</p>
    </div>
  );
};

export default RegisterPage;
