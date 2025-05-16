import React from 'react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      avatar: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/c6b4b1e717cc80a7d3b865374ed5328262ad7073?placeholderIfAbsent=true",
      name: "Dr. Lucas M.",
      role: "Pediatra, 8 anos de experiência",
      quote: [
        '"Uso todos os dias no plantão, se tornou',
        "uma ferramenta essencial para minha",
        'prática clínica."'
      ]
    },
    {
      avatar: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/8d1e5dec6ff5041fa6ccc65a8681c18df0e69422?placeholderIfAbsent=true",
      name: "Dra. Carla P.",
      role: "Residente R2 em Pediatria",
      quote: [
        '"Salvou meu tempo várias vezes durante',
        "os plantões. Interface intuitiva e conteúdo",
        'confiável."'
      ]
    },
    {
      avatar: "https://cdn.builder.io/api/v1/image/assets/78ab2fde8e3747148b556fefd3eab937/11d1e71edac164240ee58d45729fa7c54c64ba71?placeholderIfAbsent=true",
      name: "Dra. Ana S.",
      role: "Pediatra UBS",
      quote: [
        '"Fundamental para consultas rápidas e',
        "cálculos precisos. Recomendo para todos",
        'os colegas."'
      ]
    }
  ];

  return (
    <section className="w-full pt-[61px] pb-[39px] px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] flex w-full flex-col items-stretch px-px max-md:max-w-full">
        <h2 className="text-gray-800 text-3xl font-bold leading-none text-center self-center z-10 max-md:max-w-full">
          O que dizem nossos usuários
        </h2>
        <div className="bg-[rgba(0,0,0,0)] mt-[66px] pt-[5px] pb-[25px] px-[15px] max-md:max-w-full max-md:mt-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
                <div className="bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)] w-full mx-auto p-6 rounded-xl max-md:mt-[37px] max-md:px-5">
                  <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-4 leading-none pr-[61px] max-md:pr-5">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="aspect-[1] object-contain w-12 shrink-0 rounded-full"
                    />
                    <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch my-auto pr-[5px] pb-1.5">
                      <div className="text-gray-800 text-base font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-sm font-normal mt-[13px]">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[rgba(0,0,0,0)] flex flex-col text-base text-gray-600 font-normal mt-6 pr-8 pb-[7px] max-md:pr-5">
                    {testimonial.quote.map((line, i) => (
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
