import React from 'react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/cbc64caec56ce8399aae366778e3a6e1fc66b7d8?placeholderIfAbsent=true",
      title: "Calculadora de Doses",
      description: ["Cálculos precisos baseados", "em peso e idade"]
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/dce5fdb603dedad6df873886b334c2df9c6f479a?placeholderIfAbsent=true",
      title: "Protocolos Clínicos",
      description: ["Diretrizes atualizadas e", "baseadas em evidências"]
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/929aedcb1f1373ebff6b866501e1d7caa63388c6?placeholderIfAbsent=true",
      title: "Busca Rápida",
      description: ["Acesso instantâneo a", "medicamentos e doenças"]
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/7f96c5a2653ba73dbbc851ca67679cd526188b0a?placeholderIfAbsent=true",
      title: "Fluxogramas",
      description: ["Condutas clínicas em", "formato visual e intuitivo"]
    }
  ];

  return (
    <section className="bg-[rgba(0,0,0,0)] w-full pt-[61px] pb-[39px] px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] flex w-full flex-col items-stretch px-px max-md:max-w-full">
        <div className="bg-[rgba(0,0,0,0)] self-center flex w-[672px] max-w-full flex-col items-stretch text-center pb-3 px-4">
          <h2 className="text-gray-800 text-3xl font-bold leading-none self-center z-10 max-md:max-w-full">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-gray-600 text-base font-normal leading-4 mt-[27px] max-md:max-w-full">
            Desenvolvido por pediatras para pediatras, com as ferramentas essenciais para sua prática clínica
          </p>
        </div>
        <div className="bg-[rgba(0,0,0,0)] mt-[59px] pt-[5px] pb-[25px] px-[15px] max-md:max-w-full max-md:mt-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            {features.map((feature, index) => (
              <div key={index} className="flex w-3/12 max-md:w-full max-md:ml-0">
                <div className="bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)] w-full p-6 rounded-xl max-md:mt-[37px] max-md:px-5">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="aspect-[1] object-contain w-12 rounded-full"
                  />
                  <h3 className="bg-[rgba(0,0,0,0)] text-xl text-gray-800 font-semibold mt-4 pb-[13px]">
                    {feature.title}
                  </h3>
                  <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch text-base text-gray-600 font-normal mt-2 pr-[17px] pb-2">
                    {feature.description.map((line, i) => (
                      <div key={i} className={i > 0 ? "mt-[7px]" : ""}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
