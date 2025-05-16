import React from 'react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/f588f0eac650339bc24283b5b64be4c203aee54e?placeholderIfAbsent=true",
      title: "Reduz erros de prescrição",
      description: "Cálculos automáticos e verificação dupla de doses"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/5d8b636ef904f2a3eaf5ad7c4a2470b59dc7dbf3?placeholderIfAbsent=true",
      title: "Acelera tomadas de decisão",
      description: "Acesso rápido a informações essenciais"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/c8338b9314ff25617aa79bce5afe80ff94719ea8?placeholderIfAbsent=true",
      title: "Fontes confiáveis",
      description: "Conteúdo baseado em diretrizes internacionais"
    }
  ];

  return (
    <section className="bg-[rgba(0,0,0,0)] w-full pt-[39px] px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] w-full px-4 max-md:max-w-full">
        <div className="bg-[rgba(0,0,0,0)] max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-6/12 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(0,0,0,0)] flex flex-col self-stretch items-stretch leading-none w-full my-auto max-md:max-w-full max-md:-mr-0.5 max-md:mt-10">
                <h2 className="text-gray-800 text-3xl font-bold z-10 max-md:max-w-full">
                  Benefícios que fazem a diferença
                </h2>
                <div className="bg-[rgba(0,0,0,0)] w-full mt-[39px] max-md:max-w-full">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className={`bg-[rgba(0,0,0,0)] flex items-stretch gap-4 flex-wrap ${
                        index > 0 ? 'mt-6' : ''
                      } pr-20 max-md:pr-5`}
                    >
                      <img
                        src={benefit.icon}
                        alt={benefit.title}
                        className="aspect-[1] object-contain w-10 shrink-0 rounded-full"
                      />
                      <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch grow shrink-0 basis-0 w-fit pr-1.5 pb-[7px]">
                        <h3 className="text-gray-800 text-xl font-semibold">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 text-base font-normal mt-[15px]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(0,0,0,0)] w-full pt-[25px] pb-[75px] px-[50px] max-md:max-w-full max-md:px-5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/8da3d82377c1d03e3cb594b404a3c4f2043ea1a2?placeholderIfAbsent=true"
                  alt="Benefits illustration"
                  className="aspect-[1] object-contain w-full shadow-[0px_25px_50px_rgba(0,0,0,0.25)] rounded-2xl max-md:max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
