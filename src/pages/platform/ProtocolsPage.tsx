import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpenText, 
  Search, 
  Brain, 
  Ambulance, 
  Zap, 
  ShieldAlert,
  Stethoscope,
  Droplets,
  Wind,
  Thermometer 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtocolCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  iconColorClass?: string;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ title, description, icon: Icon, link, iconColorClass = "text-primary" }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-8 w-8 ${iconColorClass}`} />
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {link && (
        <Button variant="outline" size="sm" asChild>
          <Link to={link}>Ver mais</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

interface CategorySectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  protocols: Array<{
    title: string;
    description: string;
    icon: React.ElementType;
    link: string;
    iconColorClass?: string;
  }>;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, icon: Icon, iconColor, protocols }) => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-6">
      <Icon className={`h-6 w-6 ${iconColor}`} />
      <h2 className={`text-2xl font-semibold ${iconColor}`}>{title}</h2>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {protocols.map((protocol, index) => (
        <ProtocolCard key={`${title}-protocol-${index}`} {...protocol} />
      ))}
    </div>
  </section>
);

const ProtocolsPage: React.FC = () => {
  // Emergências e Trauma
  const emergencyProtocols = [
    {
      title: "Trauma Cranioencefálico",
      description: "Avaliação e manejo de trauma craniano em crianças.",
      icon: Brain,
      iconColorClass: "text-red-500",
      link: "/platform/protocols/tce"
    },
    {
      title: "Politraumatismo",
      description: "Abordagem da criança politraumatizada.",
      icon: Ambulance,
      iconColorClass: "text-red-500",
      link: "/platform/protocols/politraumatismo"
    },
    {
      title: "Parada Cardiorrespiratória",
      description: "Manejo da PCR em pediatria.",
      icon: Ambulance,
      iconColorClass: "text-red-500",
      link: "/platform/protocols/parada-cardiorrespiratoria"
    },
    {
      title: "Choque Séptico",
      description: "Avaliação e tratamento do choque séptico.",
      icon: Ambulance,
      iconColorClass: "text-red-500",
      link: "/platform/protocols/choque-septico"
    }
  ];

  // Doenças Infecciosas
  const infectiousDiseaseProtocols = [
    {
      title: "Celulite",
      description: "Diagnóstico e tratamento de celulite em pediatria.",
      icon: Stethoscope,
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/celulite"
    },
    {
      title: "Erisipela",
      description: "Manejo da erisipela em crianças.",
      icon: Stethoscope,
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/erisipela"
    },
    {
      title: "Pneumonia",
      description: "Diagnóstico e tratamento da pneumonia em pediatria.",
      icon: Stethoscope,
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/pneumonia"
    },
    {
      title: "Doença Diarreica",
      description: "Manejo da doença diarreica aguda na infância.",
      icon: Stethoscope,
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/doenca-diarreica"
    }
  ];

  // Condições Respiratórias
  const respiratoryProtocols = [
    {
      title: "Asma",
      description: "Avaliação e tratamento da crise asmática.",
      icon: Wind,
      iconColorClass: "text-blue-500",
      link: "/platform/protocols/asma"
    },
    {
      title: "Bronquiolite VSR",
      description: "Manejo da bronquiolite viral pelo VSR.",
      icon: Wind,
      iconColorClass: "text-blue-500",
      link: "/platform/protocols/bronquiolite"
    },
    {
      title: "SRAG",
      description: "Síndrome Respiratória Aguda Grave em pediatria.",
      icon: Wind,
      iconColorClass: "text-blue-500",
      link: "/platform/protocols/srag"
    }
  ];

  // Condições Metabólicas e Endócrinas
  const metabolicProtocols = [
    {
      title: "Cetoacidose Diabética",
      description: "Avaliação e manejo da cetoacidose diabética.",
      icon: Thermometer,
      iconColorClass: "text-orange-500",
      link: "/platform/protocols/cetoacidose"
    },
    {
      title: "Desidratação",
      description: "Avaliação e tratamento da desidratação em pediatria.",
      icon: Thermometer,
      iconColorClass: "text-orange-500",
      link: "/platform/protocols/desidratacao"
    }
  ];

  // Emergências Neurológicas
  const neurologicalProtocols = [
    {
      title: "Crise Convulsiva",
      description: "Manejo da crise convulsiva e estado de mal epiléptico.",
      icon: Zap,
      iconColorClass: "text-purple-500",
      link: "/platform/protocols/crise-convulsiva"
    }
  ];

  // Condições Específicas
  const specificConditionProtocols = [
    {
      title: "Crise Álgica na Anemia Falciforme",
      description: "Manejo da dor na anemia falciforme.",
      icon: Droplets,
      iconColorClass: "text-teal-500",
      link: "/platform/protocols/crise-algica"
    },
    {
      title: "Glomerulonefrite",
      description: "Avaliação e tratamento da glomerulonefrite difusa aguda.",
      icon: Droplets,
      iconColorClass: "text-teal-500",
      link: "/platform/protocols/glomerulonefrite"
    },
    {
      title: "SIM-P",
      description: "Síndrome Inflamatória Multissistêmica Pediátrica.",
      icon: Droplets,
      iconColorClass: "text-teal-500",
      link: "/platform/protocols/simp"
    },
    {
      title: "Anafilaxia",
      description: "Manejo da anafilaxia na criança.",
      icon: Droplets,
      iconColorClass: "text-teal-500",
      link: "/platform/protocols/anafilaxia"
    }
  ];

  // Situações Especiais
  const specialSituationsProtocols = [
    {
      title: "Suspeita de Violência Sexual",
      description: "Atendimento a casos suspeitos de violência sexual.",
      icon: ShieldAlert,
      iconColorClass: "text-orange-500",
      link: "/platform/protocols/violencia-sexual"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <BookOpenText className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Protocolos</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Sistema de apoio à decisão clínica baseado em protocolos médicos pediátricos.
        </p>
      </header>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar protocolo..."
            className="pl-10 text-base py-3"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Seção de Emergências e Trauma */}
      <CategorySection 
        title="Emergências e Trauma" 
        icon={Ambulance} 
        iconColor="text-red-500" 
        protocols={emergencyProtocols} 
      />
      
      {/* Seção de Doenças Infecciosas */}
      <CategorySection 
        title="Doenças Infecciosas" 
        icon={Stethoscope} 
        iconColor="text-purple-500" 
        protocols={infectiousDiseaseProtocols} 
      />

      {/* Seção de Condições Respiratórias */}
      <CategorySection 
        title="Condições Respiratórias" 
        icon={Wind} 
        iconColor="text-blue-500" 
        protocols={respiratoryProtocols} 
      />

      {/* Seção de Condições Metabólicas e Endócrinas */}
      <CategorySection 
        title="Condições Metabólicas e Endócrinas" 
        icon={Thermometer} 
        iconColor="text-orange-500" 
        protocols={metabolicProtocols} 
      />

      {/* Seção de Emergências Neurológicas */}
      <CategorySection 
        title="Emergências Neurológicas" 
        icon={Zap} 
        iconColor="text-purple-500" 
        protocols={neurologicalProtocols} 
      />

      {/* Seção de Condições Específicas */}
      <CategorySection 
        title="Condições Específicas" 
        icon={Droplets} 
        iconColor="text-teal-500" 
        protocols={specificConditionProtocols} 
      />

      {/* Seção de Situações Especiais */}
      <CategorySection 
        title="Situações Especiais" 
        icon={ShieldAlert} 
        iconColor="text-orange-500" 
        protocols={specialSituationsProtocols} 
      />
    </div>
  );
};

export default ProtocolsPage;
