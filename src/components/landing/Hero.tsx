import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="bg-[rgba(0,0,0,0)] self-center w-full max-w-[1322px] ml-[21px] px-px max-md:max-w-full">
      <div className="bg-[rgba(0,0,0,0)] pr-[50px] pt-[25px] pb-[75px] max-md:max-w-full max-md:pr-5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          {/* Alteração aqui: adicionado flex items-center para centralizar verticalmente o conteúdo da coluna de texto */}
          <div className="w-6/12 flex items-center max-md:w-full max-md:ml-0">
            <div className="bg-[rgba(0,0,0,0)] w-full self-stretch m-auto max-md:max-w-full max-md:mt-10">
              <div className="z-10 flex flex-col items-stretch pl-[15px] pr-[34px] max-md:max-w-full max-md:pr-5">
                <h1 className="text-gray-800 text-5xl font-bold leading-[48px] max-md:max-w-full max-md:text-[40px] max-md:leading-[45px]">
                  Facilitando decisões clínicas na pediatria
                </h1>
                <p className="text-gray-600 text-lg font-normal leading-[18px] mt-10 max-md:max-w-full">
                  Sua ferramenta completa para cálculos de doses, protocolos e condutas pediátricas
                </p>
              </div>
              <div className="bg-[rgba(0,0,0,0)] flex items-stretch justify-center gap-4 text-base font-normal text-center flex-wrap mt-[41px] pl-[15px] pr-20 pt-[5px] pb-[25px] max-md:mt-10 max-md:pr-5">
                <Link
                  to="/register"
                  className="bg-[rgba(58,48,231,1)] shadow-[0px_4px_6px_rgba(0,0,0,0.1)] text-white pt-[13px] pb-[25px] px-8 rounded-full max-md:px-5"
                >
                  Acesse Gratuitamente
                </Link>
                <Link
                  to="#saiba-mais"
                  className="bg-[rgba(0,0,0,0)] border-indigo-600 border text-[rgba(58,48,231,1)] pt-[13px] pb-[25px] px-[34px] rounded-full border-solid max-md:px-5"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
          </div>
          <div className="w-6/12 ml-5 flex justify-center items-center max-md:w-full max-md:ml-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/9d77224975ffcc8cbbf4b754d53fc6b455f157bb?placeholderIfAbsent=true"
              alt="Pedlife Interface"
              className="aspect-[1] object-contain w-full shadow-[0px_25px_50px_rgba(0,0,0,0.25)] rounded-xl max-md:max-w-full max-md:mt-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
