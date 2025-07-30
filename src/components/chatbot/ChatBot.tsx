import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Bot, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIService, AIMessage } from '@/services/aiService';
import { MedicalFormattedMessage } from '@/utils/messageFormatter';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do PedLife com IA integrada. Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);
  const [aiConnectionStatus, setAiConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Test AI connection on component mount
    checkAIConnection();
  }, []);

  const checkAIConnection = async () => {
    setAiConnectionStatus('checking');
    try {
      const isConnected = await AIService.testConnection();
      setAiConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (!isConnected) {
        toast({
          title: "IA Externa Indisponível",
          description: "Usando respostas offline. Configure a API para melhor experiência.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setAiConnectionStatus('disconnected');
    }
  };



  const simulateStreamingResponse = async (fullResponse: string, messageId: string): Promise<void> => {
    // Don't stream if response is empty
    if (!fullResponse || fullResponse.trim() === '') {
      setStreamingMessageId(null);
      return;
    }

    setStreamingMessageId(messageId);
    
    // Split response into sentences for better streaming (respecting punctuation)
    const sentences = fullResponse.split(/([.!?])\s+/).filter(part => part.trim());
    let currentText = '';
    
    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      
      // Add the sentence part
      if (part.match(/[.!?]/)) {
        currentText += part;
      } else {
        currentText += (currentText ? ' ' : '') + part;
      }
      
      // Update the message with current text
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: currentText }
          : msg
      ));
      
      // Add delay between sentences for better reading flow
      await new Promise(resolve => setTimeout(resolve, part.match(/[.!?]/) ? 200 : 100));
    }
    
    setStreamingMessageId(null);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentMessage = inputMessage;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get response from AI service first
      const response = await AIService.sendMessage(currentMessage, conversationHistory);
      
      if (response.success && response.message && response.message.trim()) {
        // Create bot message for streaming only if we have a valid response
        const botMessageId = (Date.now() + 1).toString();
        const botResponse: Message = {
          id: botMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
        
        // Simulate streaming effect
        await simulateStreamingResponse(response.message, botMessageId);
        
        // Update conversation history for context
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: currentMessage },
          { role: 'assistant', content: response.message }
        ]);
      } else {
        // Handle error or empty response
        const errorMessage = response.message || 'Desculpe, não consegui gerar uma resposta.';
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
        
        if (response.error && aiConnectionStatus === 'connected') {
          toast({
            title: "Erro na IA",
            description: "Usando resposta offline temporariamente.",
            variant: "destructive"
          });
          setAiConnectionStatus('disconnected');
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Erro de Comunicação",
        description: "Não foi possível obter resposta da IA.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 z-50"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Abrir chat</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0 border-0 shadow-lg">
          <DialogHeader className="p-4 border-b bg-primary text-primary-foreground">
            <DialogTitle className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Assistente PedLife
              </div>
              <div className="flex items-center gap-1 text-xs mr-2">
                <div className={`w-2 h-2 rounded-full ${
                  aiConnectionStatus === 'connected' ? 'bg-green-400' :
                  aiConnectionStatus === 'disconnected' ? 'bg-red-400' :
                  'bg-yellow-400 animate-pulse'
                }`} />
                <span className="opacity-80">
                  {aiConnectionStatus === 'connected' ? 'IA Online' :
                   aiConnectionStatus === 'disconnected' ? 'Modo Offline' :
                   'Conectando...'}
                </span>
                {aiConnectionStatus === 'disconnected' && (
                  <AlertCircle className="h-3 w-3 ml-1" />
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8">
                      {aiConnectionStatus === 'connected' ? (
                        <AvatarImage 
                          src="/lovable-uploads/PedroAvatar.jpg" 
                          alt="Pedro - Assistente Clínico Pediátrico"
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'bot' ? (
                      <MedicalFormattedMessage 
                        text={message.text} 
                        className="text-inherit"
                      />
                    ) : (
                      <p>{message.text}</p>
                    )}
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.sender === 'bot' ? 'border-t border-opacity-20 pt-1' : ''
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    {aiConnectionStatus === 'connected' ? (
                      <AvatarImage 
                        src="/lovable-uploads/PedroAvatar.jpg" 
                        alt="Pedro - Assistente Clínico Pediátrico"
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pressione Enter para enviar
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;