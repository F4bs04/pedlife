
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import Button

export const Nav: React.FC = () => {
  return (
    <nav className="bg-[rgba(255,255,255,0.95)] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] z-10 flex w-full flex-col items-stretch text-base text-gray-600 font-normal justify-center px-[70px] py-4 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] flex w-[1280px] max-w-full items-center gap-5 flex-wrap justify-between pr-4">
        <Link to="/">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/db1b55d583e7aa08091a7b6d97e205ac58334204?placeholderIfAbsent=true"
            alt="Pedlife Logo"
            className="aspect-[4.27] object-contain w-[145px] shrink-0 max-w-full"
          />
        </Link>
        <div className="bg-[rgba(0,0,0,0)] flex items-center gap-[34px] flex-wrap">
          <Link to="#recursos" className="leading-none grow self-center">
            Recursos
          </Link>
          <Link to="#beneficios" className="leading-none self-center">
            Benefícios
          </Link>
          <Link to="#depoimentos" className="leading-none basis-auto self-center">
            Depoimentos
          </Link>
          <Button asChild size="default" className="rounded-full px-6">
            <Link to="/register">
              Acesse Grátis
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
