
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Abaixo, MessageSquareQuestion foi substituído por MessageSquareQuoteIcon
import { BookOpenText, Route, MessageSquareQuoteIcon, Lightbulb, Search, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TipCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  link?: string;
  iconColorClass?: string;
}

const TipCard: React.FC<TipCardProps> = ({ title, description, icon: Icon, category, link, iconColorClass = "text-primary" }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-8 w-8 ${iconColorClass}`} />
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      <CardDescription className="text-xs bg-gray-100 inline-block px-2 py-1 rounded">{category}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {link && (
        <Button variant="outline" size="sm" asChild>
          {link.startsWith('/') ? (
            <Link to={link}>Ver mais</Link>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer">Ver mais</a>
          )}
        </Button>
      )}
    </CardContent>
  </Card>
);

const FlowsAndTipsPage: React.FC = () => {
  // Protocolos clínicos disponíveis
  const protocolCards = [
    {
      title: "Traumatismo Cranioencefálico (TCE)",
      description: "Protocolo clínico para avaliação e manejo de TCE em pediatria.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/tce"
    },
    {
      title: "Celulite",
      description: "Protocolo para diagnóstico e tratamento de celulite em pacientes pediátricos.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/celulite"
    },
    {
      title: "Erisipela",
      description: "Protocolo para diagnóstico e tratamento de erisipela em pacientes pediátricos.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/erisipela"
    },
    {
      title: "Cetoacidose Diabética",
      description: "Protocolo para manejo de cetoacidose diabética em crianças e adolescentes.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/cetoacidose"
    },
    {
      title: "Asma",
      description: "Protocolo para avaliação e tratamento de crises asmáticas em pediatria.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/asma"
    },
    {
      title: "Anafilaxia",
      description: "Protocolo para reconhecimento e manejo de anafilaxia em pacientes pediátricos.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/anafilaxia"
    },
    {
      title: "Desidratação",
      description: "Protocolo para avaliação e tratamento da desidratação em pediatria.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/desidratacao"
    },
    {
      title: "Crise Convulsiva",
      description: "Protocolo para manejo de crises convulsivas em crianças e adolescentes.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/crise-convulsiva"
    },
    {
      title: "Choque Séptico",
      description: "Protocolo para reconhecimento e tratamento de choque séptico em pediatria.",
      icon: Brain,
      category: "Protocolo Clínico",
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/choque-septico"
    },
  ];
  
  // Outros fluxos e dicas (exemplos)
  const otherTipsAndFlows = [
    {
      title: "Manejo da Febre em Pediatria",
      description: "Dicas práticas para avaliação e tratamento da febre em crianças.",
      icon: Lightbulb,
      category: "Dica Rápida",
      iconColorClass: "text-yellow-500",
      link: "#"
    },
    {
      title: "Alergia à Proteína do Leite de Vaca (APLV)",
      description: "Principais pontos no diagnóstico e manejo da APLV.",
      icon: MessageSquareQuoteIcon,
      category: "Guia Prático",
      iconColorClass: "text-blue-500",
      link: "#"
    },
  ];
  
  // Combinando todos os cards
  const tipsAndFlows = [...protocolCards, ...otherTipsAndFlows];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <BookOpenText className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Fluxos e Dicas</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Recursos rápidos para auxiliar na sua prática clínica diária.
        </p>
      </header>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar fluxos ou dicas..."
            className="pl-10 text-base py-3"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Seção de Protocolos Clínicos */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Protocolos Clínicos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocolCards.map((item, index) => (
            <TipCard key={`protocol-${index}`} {...item} />
          ))}
        </div>
      </section>
      
      {/* Seção de Outras Dicas e Fluxos */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Dicas e Fluxogramas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTipsAndFlows.map((item, index) => (
            <TipCard key={`tip-${index}`} {...item} />
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Não encontrou o que precisava?</h2>
        <p className="text-muted-foreground mb-6">
          Sugira novos fluxos ou dicas para nossa equipe.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Sugerir Conteúdo
        </Button>
      </section>
    </div>
  );
};

export default FlowsAndTipsPage;
