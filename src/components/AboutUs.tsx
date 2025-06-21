
import React, { useState } from 'react';
import { Target, Users, Trophy, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const AboutUs: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const features = [
    {
      icon: Target,
      title: "Четкая цель",
      description: "Системный подход к развитию личности через физические и ментальные испытания"
    },
    {
      icon: Users,
      title: "Команда единомышленников", 
      description: "Сообщество мужчин, стремящихся к постоянному самосовершенствованию"
    },
    {
      icon: Trophy,
      title: "Проверенные результаты",
      description: "Методики, доказавшие свою эффективность на практике"
    }
  ];

  const diltsLevels = [
    { level: "Миссия", description: "Зачем живу", color: "bg-kamp-primary", info: "Высшая цель и смысл существования" },
    { level: "Идентичность", description: "Кто я такой", color: "bg-kamp-accent", info: "Самоопределение и понимание своей роли" },
    { level: "Убеждения", description: "Во что я верю", color: "bg-orange-500", info: "Ценности и принципы, которые направляют жизнь" },
    { level: "Способности", description: "Как я выбираю", color: "bg-yellow-500", info: "Навыки принятия решений и стратегического мышления" },
    { level: "Поведение", description: "Что я делаю", color: "bg-green-500", info: "Конкретные действия и привычки для достижения целей" },
    { level: "Окружение", description: "Что я имею", color: "bg-blue-500", info: "Физические ресурсы, связи, возможности" }
  ];

  return (
    <section id="about" className={`kamp-section bg-kamp-light ${isMobile ? 'py-6' : 'py-16'}`}>
      <div className="kamp-container">
        <div className={`section-heading ${isMobile ? 'mb-6' : 'mb-16'}`}>
          <span className={`inline-block text-kamp-primary font-semibold ${isMobile ? 'mb-1 text-sm' : 'mb-2'}`}>О клубе</span>
          <h2 className={`text-kamp-dark ${isMobile ? 'text-xl' : 'text-3xl'}`}>КЭМП — это больше чем тренировки</h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile ? 
              "Комплексная система развития мужчины через физические и ментальные испытания" :
              "Комплексная система развития современного мужчины через физические и ментальные испытания, направленная на формирование сильной личности"
            }
          </p>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4 mb-8' : 'grid-cols-3 gap-8 mb-16'}`}>
          {features.map((feature, index) => (
            <div key={index} className={`reveal-on-scroll bg-white rounded-xl shadow-soft ${isMobile ? 'p-4' : 'p-8'} border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
              <feature.icon className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-kamp-primary mb-4`} />
              <h3 className={`font-bold text-kamp-dark ${isMobile ? 'text-base mb-2' : 'text-xl mb-4'}`}>{feature.title}</h3>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="reveal-on-scroll">
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-12'}`}>
            <h3 className={`font-bold text-kamp-dark ${isMobile ? 'text-lg mb-2' : 'text-2xl mb-4'}`}>
              Пирамида личностного роста
            </h3>
            <p className={`text-gray-600 mx-auto ${isMobile ? 'text-sm max-w-full' : 'max-w-2xl'}`}>
              {isMobile ?
                "Системный подход к развитию через 6 уровней" :
                "Мы используем системный подход к развитию личности, основанный на пирамиде Дилтса — от базового окружения до высшей миссии"
              }
            </p>
          </div>

          <div className={`max-w-2xl mx-auto ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
            {diltsLevels.map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-xl text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  activeLevel === index ? 'scale-[1.02]' : ''
                }`}
                onClick={() => setActiveLevel(activeLevel === index ? null : index)}
              >
                <div className={`${isMobile ? 'p-3' : 'p-6'} flex items-center justify-between`}>
                  <div className="flex-grow">
                    <h4 className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>{item.level}</h4>
                    <p className={`text-white/90 ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.description}</p>
                  </div>
                  <ChevronRight 
                    className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} transition-transform duration-300 ${
                      activeLevel === index ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                
                {activeLevel === index && (
                  <div className={`border-t border-white/20 ${isMobile ? 'p-3' : 'p-6'} bg-black/10`}>
                    <p className={`text-white/90 ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.info}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
