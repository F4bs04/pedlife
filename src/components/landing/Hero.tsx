
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = () => {
  return (
    <section className="bg-[rgba(0,0,0,0)] w-full max-w-[1322px] mx-auto px-4 md:px-px">
      {/* Alterado para py-12 e pr-0 para mobile, padding original para md e acima */}
      <div className="bg-[rgba(0,0,0,0)] md:pr-[50px] pt-12 md:pt-[25px] pb-12 md:pb-[75px] max-md:max-w-full">
        {/* Adicionado max-md:flex-col-reverse para inverter a ordem no mobile */}
        <div className="gap-10 flex max-md:flex-col-reverse max-md:items-center">
          {/* Coluna da Imagem */}
          <div className="w-full md:w-6/12 flex justify-center items-center max-md:px-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/9d77224975ffcc8cbbf4b754d53fc6b455f157bb?placeholderIfAbsent=true"
              alt="Pedlife Interface"
              className="aspect-square object-contain w-full max-w-md md:max-w-full shadow-[0px_15px_30px_rgba(0,0,0,0.2)] md:shadow-[0px_25px_50px_rgba(0,0,0,0.25)] rounded-xl"
            />
          </div>
          {/* Coluna de Texto */}
          {/* Ajustado padding e margin para mobile */}
          <div className="w-full md:w-6/12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <div className="bg-[rgba(0,0,0,0)] w-full max-md:max-w-full max-md:mt-0">
              {/* Removido padding excessivo para centralizar melhor no mobile */}
              <div className="z-10 flex flex-col items-center md:items-stretch max-md:max-w-full">
                <h1 className="text-gray-800 text-4xl md:text-5xl font-bold leading-tight md:leading-[48px] max-md:max-w-full">
                  Facilitando decisões clínicas na pediatria
                </h1>
                <p className="text-gray-600 text-lg font-normal leading-relaxed mt-6 md:mt-10 max-md:max-w-full">
                  Sua ferramenta completa para cálculos de doses, protocolos e condutas pediátricas
                </p>
              </div>
              {/* Botões: adicionado max-md:flex-col para empilhar e centralizar padding */}
              <div className="bg-[rgba(0,0,0,0)] flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-start gap-4 text-base font-normal text-center mt-8 md:mt-[41px] md:pr-20 pb-0 md:pb-[25px] max-md:w-full">
                <Button asChild size="lg" className="rounded-full shadow-[0px_4px_6px_rgba(0,0,0,0.1)] w-full md:w-auto">
                  <Link to="/register">
                    Acesse Gratuitamente
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full w-full md:w-auto">
                  <Link to="#saiba-mais">
                    Saiba Mais
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
