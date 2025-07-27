import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const programs = [
  {
    id: 1,
    title: 'Кикбоксинг',
    description: 'Техника ударов, спарринги, работа в парах. Развитие координации и скорости реакции.',
    image: 'https://www.fit-l.com/images/14-812bfw7mtbdl-sl1407.jpg',
  },
  {
    id: 2,
    title: 'Джиу-джитсу',
    description: 'Это шахматы в мире единоборств. Изучение техники борьбы, захватов и удушения.',
    image: 'https://imgur.com/9yxISfR.jpeg',
  },
  {
    id: 3,
    title: 'Тактическая медицина и безопасность',
    description: '⚔️ Самооборона с разрешёнными средствами\n\n🚨 Практика в реальных сценариях (улица, авто, семья)\n\n❌ Что делать нельзя: правовые риски\n\n🩹 Первая помощь: жгуты, повязки, эвакуация\n\n🔫 Тактическая игра с пейнтболом: работа в команде',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    title: 'Нутрициология',
    description: '🥩 Основа мужского питания: белки, жиры, углеводы\n\n🧠 Питание для энергии, силы и концентрации\n\n🍽️ Рацион под цели: жиросжигание / набор / баланс\n\n💊 Витамины, БАДы, гидратация: что реально нужно\n\n🚫 Разбор мифов и вредных привычек в питании',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    title: 'Выездные испытания',
    description: 'Голубое озеро, баня, экстремальные челленджи. Закалка духа и командная работа.',
    image: 'https://i.imgur.com/7yP7h13.jpeg',
  },
  {
    id: 6,
    title: 'Финальные испытания',
    description: 'Краш-тест по джиу-джитсу и кикбоксингу. Гонка Героев - итоговое испытание всех навыков. Проверка физической и психологической готовности.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 7,
    title: 'Пробежки и закаливание',
    description: 'Утренние забеги, холодные ванны. Развитие дисциплины и стойкости.',
    image: 'https://i.imgur.com/m3S48iw.jpeg',
  },
];

export const Program: React.FC = () => {
  const [activeProgram, setActiveProgram] = useState(programs[0]);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleProgramClick = (program: typeof programs[0]) => {
    setActiveProgram(program);
    
    // On mobile, scroll to content area after a short delay to allow state update
    if (isMobile && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <section id="program" className="kamp-section bg-gray-50 py-10 md:py-16">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll mb-6 md:mb-8">
          <span className="inline-block text-kamp-primary font-semibold mb-1 md:mb-2 text-sm md:text-base">Программа клуба</span>
          <h2 className="text-black text-2xl md:text-3xl lg:text-4xl mb-2">Интенсивные тренировки для тела и духа</h2>
          <p className="text-sm md:text-base">
            Наша программа разработана для всестороннего развития. 
            Каждая тренировка — это шаг к совершенству, каждое испытание — возможность стать сильнее.
          </p>
        </div>

        {isMobile ? (
          // Mobile layout - vertical with scroll to content
          <div className="mt-6 space-y-4 reveal-on-scroll">
            <div className="space-y-2">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => handleProgramClick(program)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                    activeProgram.id === program.id 
                    ? 'bg-white shadow-soft border-l-4 border-kamp-primary' 
                    : 'bg-white/50 hover:bg-white hover:shadow-soft'
                  }`}
                >
                  <div>
                    <h3 className={`font-bold text-sm ${activeProgram.id === program.id ? 'text-kamp-primary' : 'text-gray-700'}`}>
                      {program.title}
                    </h3>
                  </div>
                  {activeProgram.id === program.id ? (
                    <ChevronDown className="text-kamp-primary" size={16} />
                  ) : (
                    <ArrowRight className="text-gray-400" size={16} />
                  )}
                </button>
              ))}
            </div>
            
            <div ref={contentRef} className="pt-1 scroll-mt-16">
              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="h-48 relative">
                  <img 
                    src={activeProgram.image} 
                    alt={activeProgram.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-bold">{activeProgram.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm">{activeProgram.description}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop layout - side by side
          <div className="mt-12 grid md:grid-cols-3 gap-8 reveal-on-scroll">
            <div className="md:col-span-1 space-y-4">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => handleProgramClick(program)}
                  className={`w-full text-left p-5 rounded-lg transition-all duration-300 flex items-center ${
                    activeProgram.id === program.id 
                    ? 'bg-white shadow-soft border-l-4 border-kamp-primary' 
                    : 'bg-white/50 hover:bg-white hover:shadow-soft'
                  }`}
                >
                  <div>
                    <h3 className={`font-bold ${activeProgram.id === program.id ? 'text-kamp-primary' : 'text-gray-700'}`}>
                      {program.title}
                    </h3>
                  </div>
                  <ArrowRight className={`ml-auto transition-transform ${
                    activeProgram.id === program.id ? 'transform translate-x-1 text-kamp-primary' : 'text-gray-400'
                  }`} size={18} />
                </button>
              ))}
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-soft overflow-hidden h-full">
                <div className="h-64 md:h-80 relative">
                  <img 
                    src={activeProgram.image} 
                    alt={activeProgram.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{activeProgram.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">{activeProgram.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
