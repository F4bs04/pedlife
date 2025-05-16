
import React from 'react';

export const Audience: React.FC = () => {
  const audiences = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/aa021e75e9a3eff7c24ca33ee5abced35712ed31?placeholderIfAbsent=true",
      title: "Pediatras",
      description: ["Ideal para consultórios, emergências e", "enfermarias"]
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/acb9272bfbdb943328a94e6c869ab71c9f057ba2?placeholderIfAbsent=true",
      title: "Residentes e Estudantes",
      description: ["Suporte confiável para seu aprendizado", "clínico"]
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/7b705bd9d7c65d21561eb8e32fac4c3ac68f1665?placeholderIfAbsent=true",
      title: "Profissionais de UBS",
      description: ["Essencial para atendimento primário"]
    }
  ];

  return (
    <section className="w-full pt-[61px] pb-[39px] px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] flex w-full flex-col items-stretch px-px max-md:max-w-full">
        <h2 className="text-gray-800 text-3xl font-bold leading-none text-center self-center z-10">
          Para quem é o Pedlife?
        </h2>
        <div className="bg-[rgba(0,0,0,0)] mt-[66px] pt-[5px] pb-[25px] px-[15px] max-md:max-w-full max-md:mt-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            {audiences.map((audience, index) => (
              <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
                <div className="bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)] flex grow flex-col items-stretch text-center w-full p-6 rounded-xl max-md:mt-[37px] max-md:px-5">
                  <img
                    src={audience.icon}
                    alt={audience.title}
                    className="aspect-[1] object-contain w-16 self-center rounded-full"
                  />
                  <h3 className="bg-[rgba(0,0,0,0)] text-xl text-gray-800 font-semibold whitespace-nowrap mt-6 pb-3">
                    {audience.title}
                  </h3>
                  <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch text-base text-gray-600 font-normal mt-4 pb-3">
                    {audience.description.map((line, i) => (
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

