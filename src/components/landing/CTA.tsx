import React from 'react';
import { Link } from 'react-router-dom';

export const CTA: React.FC = () => {
  return (
    <section className="bg-[rgba(0,0,0,0)] flex w-full flex-col items-stretch text-base font-normal text-center justify-center px-20 py-16 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] px-4 max-md:max-w-full">
        <div className="bg-[rgba(58,48,231,1)] flex flex-col items-center p-12 rounded-2xl max-md:max-w-full max-md:px-5">
          <h2 className="z-10 bg-[rgba(0,0,0,0)] self-stretch text-3xl text-white font-bold pt-[-4px] pb-[9px] px-[70px] max-md:max-w-full max-md:px-5">
            Comece a usar gratuitamente hoje
          </h2>
          <div className="bg-[rgba(0,0,0,0)] flex w-[672px] max-w-full flex-col items-stretch text-indigo-100 mt-[23px] pb-[11px] px-[39px] max-md:px-5">
            <p className="max-md:max-w-full">
              Junte-se a milhares de profissionais que já confiam no PediCalc para suas
              <span className="block mt-[7px]">decisões clínicas</span>
            </p>
          </div>
          <Link
            to="/register"
            className="bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)] w-56 max-w-full text-[rgba(58,48,231,1)] mt-8 pt-3 pb-[19px] px-[34px] rounded-full max-md:px-5"
          >
            Criar conta gratuita
          </Link>
        </div>
      </div>
    </section>
  );
};
