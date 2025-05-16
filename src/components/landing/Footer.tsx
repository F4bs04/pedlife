import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 flex w-full flex-col items-stretch justify-center px-20 py-12 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] w-full px-4 max-md:max-w-full">
        <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-8 flex-wrap pr-20 max-md:max-w-full max-md:pr-5">
          <div className="bg-[rgba(0,0,0,0)] pb-3.5">
            <div className="bg-[rgba(0,0,0,0)] flex w-full py-px">
              <div className="flex min-h-6 items-center overflow-hidden justify-center">
                <div className="bg-[rgba(0,0,0,0)] self-stretch flex min-h-6 w-[27px] my-auto" />
              </div>
              <div className="text-white text-xl font-semibold leading-none grow shrink w-[279px] basis-auto">
                Pedlife
              </div>
            </div>
            <div className="text-gray-400 text-sm font-normal leading-none mt-4 max-md:mr-1.5">
              Sua ferramenta essencial para pediatria
            </div>
          </div>
          <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch text-base whitespace-nowrap leading-none">
            <div className="text-white font-semibold">Produto</div>
            <nav className="bg-[rgba(0,0,0,0)] text-gray-400 font-normal mt-7">
              <Link to="#recursos" className="bg-[rgba(0,0,0,0)] pb-[13px] max-md:pr-5 block">
                Recursos
              </Link>
              <div className="bg-[rgba(0,0,0,0)] flex shrink-0 h-px mt-2" />
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
