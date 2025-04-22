import React from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, Book, Dumbbell, Award } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const isMobile = useIsMobile();
  
  const scrollToProgram = () => {
    const programSection = document.getElementById('program');
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-kamp-primary" />,
      title: "Бизнес-сообщество",
      description: "Построй сеть контактов с успешными предпринимателями и единомышленниками"
    },
    {
      icon: <Book className="w-5 h-5 md:w-6 md:h-6 text-kamp-primary" />,
      title: "Развитие",
      description: "Мастер-классы и лекции от опытных бизнесменов и лидеров индустрии"
    },
    {
      icon: <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-kamp-primary" />,
      title: "Сила и выносливость",
      description: "Интенсивные тренировки для физического развития"
    },
    {
      icon: <Award className="w-5 h-5 md:w-6 md:h-6 text-kamp-primary" />,
      title: "Лидерство",
      description: "Развитие лидерских качеств через испытания и командную работу"
    }
  ];

  return (
    <section id="about" className="kamp-section bg-kamp-light border-t-4 border-kamp-primary">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll max-w-3xl mx-auto">
          <span className="inline-block text-kamp-accent font-semibold mb-2 uppercase tracking-wider">О нас</span>
          <h2 className="text-white mb-4">Бизнес-сообщество для развития тела и духа</h2>
          <p className="text-balance text-gray-300 max-w-2xl mx-auto">
            КЭМП — это не просто тренировки, это сообщество амбициозных людей, 
            объединенных стремлением к росту. Здесь вы найдете круг 
            единомышленников, готовых развиваться ментально и физически.
          </p>
        </div>

        <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 reveal-on-scroll">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#222226] border border-gray-700/50 p-4 md:p-6 rounded-lg hover:border-kamp-primary/50 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex flex-col items-center mb-4">
                <div className="flex-shrink-0 mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-center w-full truncate px-2 text-sm md:text-base">{feature.title}</h3>
              </div>
              <p className="text-gray-400 text-xs md:text-sm flex-grow text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-24 reveal-on-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="text-left mb-8 md:mb-0 order-2 md:order-1 bg-[#222226] border border-gray-700 p-4 md:p-10 rounded-md">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white border-l-4 border-kamp-primary pl-4">
                Что вы получите?
              </h3>
              {isMobile ? (
                <div>
                  <p className="text-gray-300 mb-3 text-sm">
                    КЭМП — это платформа для тех, кто стремится к большему. Здесь вы найдете 
                    единомышленников, готовых вместе расти и развиваться.
                  </p>
                  <ul className="list-disc list-inside mb-4 space-y-2 text-sm text-gray-300">
                    <li>Нетворкинг с успешными предпринимателями</li>
                    <li>Мастер-классы от лидеров бизнеса</li>
                    <li>Интенсивные тренировки</li>
                    <li>Командные испытания</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-300">
                    КЭМП — это платформа для тех, кто стремится к большему. Здесь вы найдете 
                    единомышленников, готовых вместе расти и развиваться как в бизнесе, 
                    так и в личностном плане.
                  </p>
                  <ul className="list-disc list-inside space-y-3 text-gray-300 ml-4">
                    <li className="pl-2">Нетворкинг с успешными предпринимателями и лидерами индустрии</li>
                    <li className="pl-2">Регулярные мастер-классы и лекции от опытных бизнесменов</li>
                    <li className="pl-2">Интенсивные тренировки для физического развития</li>
                    <li className="pl-2">Командные испытания для развития лидерских качеств</li>
                    <li className="pl-2">Доступ к закрытым бизнес-мероприятиям</li>
                    <li className="pl-2">Возможность обмена опытом и знаниями внутри сообщества</li>
                  </ul>
                  <Button 
                    onClick={scrollToProgram}
                    className="bg-kamp-primary hover:bg-kamp-primary/90 text-white mt-6"
                  >
                    Узнать больше
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-center order-1 md:order-2">
              <div className="relative w-full max-w-[420px]">
                <div className="relative w-[320px] h-[650px] mx-auto bg-[#111111] rounded-[40px] p-4 shadow-2xl border-[3px] border-gray-800">
                  <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                    <div className="w-[130px] h-[35px] bg-[#111111] rounded-b-[14px] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] bg-gray-600 rounded-full mr-2"></div>
                      <div className="w-[40px] h-[6px] bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-[60px] right-[-6px] w-[3px] h-[60px] bg-gray-700 rounded-r-md"></div>
                  <div className="absolute top-[60px] left-[-6px] w-[3px] h-[30px] bg-gray-700 rounded-l-md"></div>
                  <div className="absolute top-[85px] left-[-6px] w-[3px] h-[60px] bg-gray-700 rounded-l-md"></div>
                  
                  <div className="relative h-full w-full rounded-[34px] overflow-hidden bg-black">
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    >
                      <source src="https://i.imgur.com/eXVpT0r.mp4" type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-white/10 to-transparent rounded-[40px] pointer-events-none"></div>
                
                <div className="absolute bottom-[8px] left-0 right-0 flex justify-center">
                  <div className="w-[40%] h-[4px] bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
