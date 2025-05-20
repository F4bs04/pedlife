
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Abaixo, MessageSquareQuestion foi substituído por MessageSquareQuoteIcon
import { BookOpenText, Route, MessageSquareQuoteIcon, Lightbulb, Search } from 'lucide-react';

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
          <a href={link} target="_blank" rel="noopener noreferrer">Ver mais</a>
        </Button>
      )}
    </CardContent>
  </Card>
);

const FlowsAndTipsPage: React.FC = () => {
  // Dados de exemplo
  const tipsAndFlows = [
    {
      title: "Fluxograma de Crise Convulsiva",
      description: "Protocolo de atendimento para crianças em crise convulsiva na emergência.",
      icon: Route,
      category: "Fluxograma",
      iconColorClass: "text-orange-500",
      link: "#"
    },
    {
      title: "Manejo da Febre em Pediatria",
      description: "Dicas práticas para avaliação e tratamento da febre em crianças.",
      icon: Lightbulb,
      category: "Dica Rápida",
      iconColorClass: "text-yellow-500",
      link: "#"
    },
    {
      title: "Protocolo de Sepse Pediátrica",
      description: "Abordagem inicial e tratamento da sepse em pacientes pediátricos.",
      icon: Route,
      category: "Fluxograma",
      iconColorClass: "text-red-500",
      link: "#"
    },
    {
      title: "Alergia à Proteína do Leite de Vaca (APLV)",
      description: "Principais pontos no diagnóstico e manejo da APLV.",
      // Abaixo, MessageSquareQuestion foi substituído por MessageSquareQuoteIcon
      icon: MessageSquareQuoteIcon,
      category: "Guia Prático",
      iconColorClass: "text-blue-500",
      link: "#"
    },
  ];

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tipsAndFlows.map((item, index) => (
          <TipCard key={index} {...item} />
        ))}
      </div>

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
