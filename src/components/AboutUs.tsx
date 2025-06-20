
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, Book, Dumbbell, Award } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  
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

  // Перевернутая пирамида Дилтса с новыми вопросами
  const diltsLevels = [
    { level: "Окружение", description: "Что я имею", color: "bg-blue-500", info: "Физические ресурсы, связи, возможности" },
    { level: "Поведение", description: "Что я делаю", color: "bg-green-500", info: "Конкретные действия и привычки для достижения целей" },
    { level: "Способности", description: "Как я выбираю", color: "bg-yellow-500", info: "Навыки принятия решений и стратегического мышления" },
    { level: "Убеждения", description: "Во что я верю", color: "bg-orange-500", info: "Ценности и принципы, которые направляют жизнь" },
    { level: "Идентичность", description: "Кто я такой", color: "bg-kamp-accent", info: "Самоопределение и понимание своей роли" },
    { level: "Миссия", description: "Зачем живу", color: "bg-kamp-primary", info: "Высшая цель и смысл существования" }
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
                Психологический профиль клуба
              </h3>
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                В основе методологии КЭМП лежит пирамида Дилтса — мощный инструмент для 
                системного развития личности через логические уровни мышления.
              </p>
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                Мы работаем с каждым уровнем сознания: от материального окружения до высшей миссии. 
                Это позволяет участникам не просто тренироваться, а осознанно трансформировать свою жизнь, 
                развивая лидерские качества и внутреннюю силу.
              </p>
              <p className="text-gray-300 mb-6 text-sm md:text-base">
                Каждое занятие в клубе направлено на проработку определенного уровня, 
                что обеспечивает комплексное развитие личности современного мужчины.
              </p>
              
              {!isMobile && (
                <Button 
                  onClick={scrollToProgram}
                  className="bg-kamp-primary hover:bg-kamp-primary/90 text-white mt-6"
                >
                  Узнать больше
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              )}
            </div>
            
            <div className="flex justify-center order-1 md:order-2">
              <div className="relative w-full max-w-[400px]">
                <h4 className="text-center text-white font-bold mb-6 text-lg md:text-xl">Пирамида Дилтса</h4>
                <div className="space-y-2">
                  {diltsLevels.map((level, index) => (
                    <div 
                      key={index}
                      className={`${level.color} text-white p-3 md:p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                        activeLevel === index ? 'ring-2 ring-white scale-105' : ''
                      }`}
                      style={{
                        marginLeft: `${(diltsLevels.length - 1 - index) * (isMobile ? 8 : 16)}px`,
                        marginRight: `${(diltsLevels.length - 1 - index) * (isMobile ? 8 : 16)}px`
                      }}
                      onClick={() => setActiveLevel(activeLevel === index ? null : index)}
                      onMouseEnter={() => !isMobile && setActiveLevel(index)}
                      onMouseLeave={() => !isMobile && setActiveLevel(null)}
                    >
                      <div className="text-center">
                        <div className="font-bold text-sm md:text-base">{level.level}</div>
                        <div className="text-xs md:text-sm opacity-90">{level.description}</div>
                        {activeLevel === index && (
                          <div className="text-xs md:text-sm mt-2 bg-black/20 rounded p-2 animate-fade-in">
                            {level.info}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-400 text-xs md:text-sm mt-4">
                  Наведите курсор на уровень, чтобы узнать больше
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
