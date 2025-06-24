import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const trainers = [
  {
    id: 1,
    name: 'Дмитрий',
    role: 'Тренер по джиу-джитсу',
    image: 'https://imgur.com/zCYntX0.jpeg',
    quote: 'Джиу-джитсу учит не только технике, но и терпению и стратегическому мышлению.',
    experience: '12+ лет практики бразильского джиу-джитсу.',
    bio: 'Андреев Дмитрий\nХедлайнер, наставник и идеолог КЭМП\n\nБизнесмен, сооснователь Ayboost.com и Malai.pro\n\nНаставник федерального проекта «100 лидеров Татарстана»\n\nЧемпион России по бразильскому джиу-джитсу, синий пояс\n\nВ КЭМПе — хедлайнер, наставник по пирамиде личного роста и тренер по BJJ\n\nОтец троих детей, крепкая семья — моя опора\n\nПридерживаюсь традиционных мужских ценностей, силы окружения и движения вперёд'
  },
  {
    id: 2,
    name: 'Али Валиев',
    role: 'Тренер по кикбоксингу',
    image: 'https://i.imgur.com/WjrhrWT.jpeg',
    quote: 'Достигни своего максимума через дисциплину и упорство.',
    experience: '7+ лет в профессиональном кикбоксинге, мастер спорта по боевым искусствам.',
    bio: 'Али специализируется на ударной технике и развитии бойцовского духа. Его методики помогают участникам КЭМП существенно улучшить физическую форму в кратчайшие сроки, одновременно развивая ментальную стойкость.'
  },
  {
    id: 3,
    name: 'Михаил',
    role: 'Нутрициолог',
    image: 'https://i.imgur.com/3WHBCjU.jpeg',
    quote: 'Правильное питание — основа прогресса и энергии для достижения целей.',
    experience: '8 лет опыта в спортивной нутрициологии, сертифицированный специалист.',
    bio: 'Михаил разрабатывает индивидуальные планы питания для участников КЭМП, учитывая интенсивность тренировок и персональные особенности. Его рекомендации помогают оптимизировать результаты тренировок и ускорить восстановление.'
  },
  {
    id: 4,
    name: 'Тагир',
    role: 'Инструктор по стрельбе',
    image: '/lovable-uploads/e27de7f5-f9fd-4432-b8b6-b6d2fe2231fc.png',
    quote: 'Точность в стрельбе — это концентрация ума и самоконтроль.',
    experience: '15+ лет опыта в стрелковом спорте, сертифицированный инструктор.',
    bio: 'Тагир — профессиональный инструктор по стрельбе с богатым опытом в различных дисциплинах. Он обучает безопасному обращению с оружием, технике стрельбы и развитию концентрации. Его занятия развивают точность, терпение и самодисциплину.'
  }
];

export const Trainers: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<typeof trainers[0] | null>(null);
  const isMobile = useIsMobile();

  return (
    <section 
      id="trainers" 
      className="kamp-section bg-black py-4 md:py-16"
    >
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll text-white">
          <span className="inline-block text-kamp-primary font-semibold mb-1 text-sm">Тренеры</span>
          <h2 className="text-white text-xl md:text-4xl">Наша команда профессионалов</h2>
          <p className="text-gray-300 text-xs md:text-base mt-2">
            Опытные наставники, которые не только научат технике, но и помогут раскрыть весь потенциал.
            Каждый из них — эксперт в своей области.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-8 mt-3 md:mt-16">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="kamp-card overflow-hidden reveal-on-scroll hover-lift cursor-pointer bg-black border border-gray-800"
              onClick={() => setSelectedTrainer(trainer)}
            >
              <div className={`${isMobile ? 'aspect-[3/4]' : 'aspect-[3/4]'} overflow-hidden`}>
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                />
              </div>
              <div className={`${isMobile ? 'p-1.5' : 'p-4 md:p-6'} bg-black`}>
                <h3 className={`${isMobile ? 'text-xs' : 'text-lg md:text-xl'} font-bold text-white`}>{trainer.name}</h3>
                <p className={`text-kamp-primary font-medium ${isMobile ? 'text-[10px]' : 'text-xs md:text-sm'} mb-1 md:mb-3`}>{trainer.role}</p>
                {!isMobile && (
                  <p className="text-gray-600 text-xs md:text-sm italic mb-3 md:mb-4">"{trainer.quote}"</p>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrainer(trainer);
                  }}
                  className="text-kamp-primary font-medium text-[10px] md:text-sm hover:underline"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTrainer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
          <div 
            className="bg-black rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-scale-in text-white border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-2 md:top-4 right-2 md:right-4 bg-gray-900 text-white rounded-full p-2 shadow-md z-10"
              >
                <X size={isMobile ? 16 : 20} />
              </button>
              
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  <div className="h-48 md:h-full">
                    <img 
                      src={selectedTrainer.image} 
                      alt={selectedTrainer.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 p-4 md:p-8 bg-black">
                  <span className="text-kamp-primary font-semibold text-xs md:text-sm">{selectedTrainer.role}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1 mb-3 md:mb-4">{selectedTrainer.name}</h3>
                  
                  <div className="bg-gray-900 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
                    <p className="italic text-gray-300 text-sm md:text-base">"{selectedTrainer.quote}"</p>
                  </div>
                  
                  <div className="mb-4 md:mb-6">
                    <h4 className="font-bold text-white text-sm md:text-base mb-1 md:mb-2">Опыт</h4>
                    <p className="text-gray-300 text-xs md:text-sm">{selectedTrainer.experience}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-1 md:mb-2">Профессиональный подход</h4>
                    <p className="text-gray-300 text-xs md:text-sm">{selectedTrainer.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
