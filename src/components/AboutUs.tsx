
import React from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const AboutUs: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Function to scroll to the Program section
  const scrollToProgram = () => {
    const programSection = document.getElementById('program');
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="kamp-section bg-kamp-light border-t-4 border-kamp-primary">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-accent font-semibold mb-2 uppercase tracking-wider">О нас</span>
          <h2 className="text-white">Мы создаем условия для развития настоящей силы</h2>
          <p className="text-balance text-gray-300">
            Мы — команда профессионалов, объединенных одной целью: создавать условия для развития настоящей силы. 
            Наш курс — это не просто тренировки. Это система испытаний, которые делают тебя сильнее во всех сферах жизни.
          </p>
        </div>

        <div className="mt-8 md:mt-20 reveal-on-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Text Content - Left Side on both Mobile and Desktop */}
            <div className="text-left mb-8 md:mb-0 order-1 bg-[#222226] border border-gray-700 p-4 md:p-10 rounded-md">
              <h3 className="text-xl font-bold mb-4 md:mb-6 text-white border-l-4 border-kamp-primary pl-4">Что тебя ждет?</h3>
              {isMobile ? (
                <div>
                  <p className="text-gray-300 mb-3 text-sm">
                    Интенсивные тренировки, испытания на выносливость, работа в команде и индивидуальный рост.
                    Каждый день — новый вызов, каждый день — новая победа над собой.
                  </p>
                  <p className="text-gray-300 mb-4 text-sm">
                    <span className="font-medium text-white">В КЭМП ты найдешь:</span>
                  </p>
                  <ul className="list-disc list-inside mb-4 space-y-2 text-sm text-gray-300">
                    <li>Структурированную программу испытаний</li>
                    <li>Тренировки, меняющие тело и сознание</li>
                    <li>Поддержку единомышленников</li>
                    <li>Ценные награды для лидеров</li>
                  </ul>
                </div>
              ) : (
                <>
                  <p className="text-gray-300 mb-4">
                    Интенсивные тренировки, испытания на выносливость, работа в команде и индивидуальный рост.
                    Каждый день — новый вызов, каждый день — новая победа над собой.
                  </p>
                  <p className="text-gray-300 mb-6">
                    <span className="font-medium text-white">В КЭМП ты найдешь:</span>
                    <ul className="list-disc list-inside mt-4 space-y-3">
                      <li>Структурированную программу испытаний</li>
                      <li>Профессиональных тренеров с боевым опытом</li>
                      <li>Тренировки, которые меняют не только тело, но и сознание</li>
                      <li>Поддержку сообщества единомышленников</li>
                      <li>Возможность проверить свои пределы и выйти за их рамки</li>
                      <li>Ценные награды для лидеров рейтинга</li>
                    </ul>
                  </p>
                  <p className="text-gray-300 mb-6">
                    Наши инструкторы — профессиональные тренеры с опытом в силовых структурах. Они знают, как 
                    создать максимальную нагрузку и безопасно провести вас через все испытания.
                  </p>
                </>
              )}
              <Button 
                onClick={scrollToProgram}
                className={`bg-kamp-primary hover:bg-kamp-primary/90 text-white mt-2 ${isMobile ? 'text-sm py-1.5 px-3' : ''}`}
              >
                Узнать больше
                <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ml-1`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
            
            {/* iPhone Frame with Video - Right Side on both Mobile and Desktop */}
            <div className="flex justify-center order-2 p-2 md:p-0">
              <div className="relative">
                {/* iPhone Frame - Reduced size for mobile */}
                <div className={`relative ${isMobile ? 'w-[180px] h-[360px]' : 'w-[320px] h-[650px]'} bg-[#111111] rounded-[40px] p-2 md:p-4 shadow-2xl border-[3px] border-gray-800`}>
                  {/* iPhone Notch - Smaller for mobile */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                    <div className={`${isMobile ? 'w-[60px] h-[16px]' : 'w-[130px] h-[35px]'} bg-[#111111] rounded-b-[14px] flex items-center justify-center`}>
                      <div className={`${isMobile ? 'w-[4px] h-[4px]' : 'w-[8px] h-[8px]'} bg-gray-600 rounded-full mr-2`}></div>
                      <div className={`${isMobile ? 'w-[20px] h-[3px]' : 'w-[40px] h-[6px]'} bg-gray-600 rounded-full`}></div>
                    </div>
                  </div>
                  
                  {/* Smaller buttons for mobile */}
                  <div className={`absolute top-[60px] right-[-6px] w-[3px] ${isMobile ? 'h-[30px]' : 'h-[60px]'} bg-gray-700 rounded-r-md`}></div>
                  <div className={`absolute top-[60px] left-[-6px] w-[3px] ${isMobile ? 'h-[15px]' : 'h-[30px]'} bg-gray-700 rounded-l-md`}></div>
                  <div className={`absolute top-[85px] left-[-6px] w-[3px] ${isMobile ? 'h-[30px]' : 'h-[60px]'} bg-gray-700 rounded-l-md`}></div>
                  
                  {/* Screen with Video */}
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
                
                {/* Reflection effect */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-white/10 to-transparent rounded-[40px] pointer-events-none"></div>
                
                {/* Home indicator - Smaller for mobile */}
                <div className="absolute bottom-[8px] left-0 right-0 flex justify-center">
                  <div className={`${isMobile ? 'w-[30%] h-[3px]' : 'w-[40%] h-[4px]'} bg-gray-700 rounded-full`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
