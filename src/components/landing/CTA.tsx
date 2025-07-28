
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import Button

export const CTA: React.FC = () => {
  return (
    <section className="bg-[rgba(0,0,0,0)] flex w-full flex-col items-stretch text-base font-normal text-center justify-center px-20 py-16 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] px-4 max-md:max-w-full">
        <div className="bg-primary flex flex-col items-center p-12 rounded-2xl max-md:max-w-full max-md:px-5"> {/* Changed background to bg-primary */}
          <h2 className="z-10 bg-[rgba(0,0,0,0)] self-stretch text-3xl text-primary-foreground font-bold pt-[-4px] pb-[9px] px-[70px] max-md:max-w-full max-md:px-5"> {/* Changed text to text-primary-foreground */}
            Comece a usar gratuitamente hoje
          </h2>
          <div className="bg-[rgba(0,0,0,0)] flex w-[672px] max-w-full flex-col items-stretch text-indigo-100 mt-[23px] pb-[11px] px-[39px] max-md:px-5">
            <p className="max-md:max-w-full text-primary-foreground/80"> {/* Adjusted text color for contrast on primary background */}
              Junte-se a milhares de profissionais que já confiam no PediCalc para suas
              <span className="block mt-[7px]">decisões clínicas</span>
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full shadow-[0px_4px_6px_rgba(0,0,0,0.1)] mt-8">
            <Link to="/auth">
              Criar conta gratuita
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
