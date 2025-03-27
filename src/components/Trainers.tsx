
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const trainers = [
  {
    id: 1,
    name: 'Али Валиев',
    role: 'Тренер по кроссфиту',
    image: 'https://i.imgur.com/WjrhrWT.jpeg',
    quote: 'Достигни своего максимума через дисциплину и упорство.',
    experience: '7+ лет в профессиональном кроссфите, мастер спорта по тяжелой атлетике.',
    bio: 'Али специализируется на функциональных тренировках и развитии выносливости. Его методики помогают участникам КЭМП существенно улучшить физическую форму в кратчайшие сроки, одновременно развивая ментальную стойкость.'
  },
  {
    id: 2,
    name: 'Радик',
    role: 'Тренер по кикбоксингу',
    image: 'https://i.imgur.com/ihXT9rm.jpeg',
    quote: 'Бой раскрывает истинный характер человека.',
    experience: '10+ лет в профессиональном спорте, чемпион по кикбоксингу.',
    bio: 'Радик не только обучает технике ударов, но и помогает развивать бойцовский характер. Его тренировки — это всегда вызов, который помогает участникам выйти из зоны комфорта и обрести уверенность в своих силах.'
  },
  {
    id: 3,
    name: 'Михаил',
    role: 'Нутрициолог',
    image: 'https://i.imgur.com/3WHBCjU.jpeg',
    quote: 'Правильное питание — основа прогресса и энергии для достижения целей.',
    experience: '8 лет опыта в спортивной нутрициологии, сертифицированный специалист.',
    bio: 'Михаил разрабатывает индивидуальные планы питания для участников КЭМП, учитывая интенсивность тренировок и персональные особенности. Его рекомендации помогают оптимизировать результаты тренировок и ускорить восстановление.'
  }
];

export const Trainers: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<typeof trainers[0] | null>(null);

  return (
    <section id="trainers" className="kamp-section">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">Тренеры</span>
          <h2 className="text-kamp-dark">Наша команда профессионалов</h2>
          <p>
            Опытные наставники, которые не только научат технике, но и помогут раскрыть весь потенциал.
            Каждый из них — эксперт в своей области.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="kamp-card overflow-hidden reveal-on-scroll hover-lift cursor-pointer"
              onClick={() => setSelectedTrainer(trainer)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-kamp-dark">{trainer.name}</h3>
                <p className="text-kamp-primary font-medium text-sm mb-3">{trainer.role}</p>
                <p className="text-gray-600 text-sm italic mb-4">"{trainer.quote}"</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrainer(trainer);
                  }}
                  className="text-kamp-primary font-medium text-sm hover:underline"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Detail Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
              >
                <X size={20} className="text-kamp-dark" />
              </button>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-auto">
                  <div className="h-64 md:h-full">
                    <img 
                      src={selectedTrainer.image} 
                      alt={selectedTrainer.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6 md:p-8">
                  <span className="text-kamp-primary font-semibold text-sm">{selectedTrainer.role}</span>
                  <h3 className="text-2xl font-bold text-kamp-dark mt-1 mb-4">{selectedTrainer.name}</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="italic text-gray-700">"{selectedTrainer.quote}"</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-kamp-dark mb-2">Опыт</h4>
                    <p className="text-gray-700">{selectedTrainer.experience}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-kamp-dark mb-2">Профессиональный подход</h4>
                    <p className="text-gray-700">{selectedTrainer.bio}</p>
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
