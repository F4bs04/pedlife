import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadProtocolContent, getProtocolTitle } from '@/utils/protocolLoader';

const ProtocolDetailPage: React.FC = () => {
  const { protocolId } = useParams<{ protocolId: string }>();
  const navigate = useNavigate();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Protocolo');
  const [isCopying, setIsCopying] = useState<boolean>(false);

  useEffect(() => {
    const fetchProtocol = async () => {
      if (!protocolId) {
        setError('Protocolo não encontrado');
        setLoading(false);
        return;
      }

      try {
        // Usar a função de utilitário para carregar o conteúdo
        const content = await loadProtocolContent(protocolId);
        setMarkdownContent(content);
        
        // Definir o título do protocolo
        setTitle(getProtocolTitle(protocolId));
      } catch (err) {
        setError('Erro ao carregar o protocolo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocol();
  }, [protocolId]);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(markdownContent);
    toast.success('Conteúdo copiado para a área de transferência');
    
    // Feedback visual com ícone de check
    setIsCopying(true);
    setTimeout(() => {
      setIsCopying(false);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const goBack = () => {
    navigate(-1);
  };

  // Componente personalizado para renderizar tabelas com estilo adequado
  const MarkdownTable = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 border">
        {children}
      </table>
    </div>
  );

  // Componente personalizado para renderizar blocos de código
  const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-gray-50 p-4 rounded-md my-4 overflow-x-auto">
      <pre className="text-sm">{children}</pre>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goBack}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyContent}
            className="flex items-center gap-1"
          >
            {isCopying ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {isCopying ? 'Copiado' : 'Copiar'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1 print:hidden"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <Card className="p-6 md:p-8 bg-white shadow-sm">
        {!loading && !error && (
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
        )}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 font-medium text-lg">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/platform/tips')}
            >
              Voltar para Fluxos e Dicas
            </Button>
          </div>
        ) : (
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                table: MarkdownTable,
                code: CodeBlock,
                // Skip h1 since we're already showing the title
                h1: () => null,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </article>
        )}
      </Card>
    </div>
  );
};

export default ProtocolDetailPage;
