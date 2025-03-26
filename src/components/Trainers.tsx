
import React, { useState } from 'react';
import { X } from 'lucide-react';

const trainers = [
  {
    id: 1,
    name: 'Александр Волков',
    role: 'Главный тренер',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop',
    quote: 'Настоящая сила приходит через дисциплину и самоотверженность.',
    experience: '10+ лет в профессиональном спорте, чемпион России по кикбоксингу.',
    bio: 'Александр — основатель КЭМП и главный идеолог программы. Его подход к тренировкам основан на гармоничном развитии физической силы, выносливости и ментальной стойкости. Под его руководством сотни мужчин смогли преодолеть свои слабости и открыть новые горизонты.'
  },
  {
    id: 2,
    name: 'Михаил Соколов',
    role: 'Тренер по кроссфиту',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
    quote: 'Пределы существуют только в твоей голове.',
    experience: '8 лет опыта, сертифицированный тренер CrossFit Level 2.',
    bio: 'Михаил специализируется на функциональных тренировках и развитии выносливости. Его программы тренировок адаптированы для мужчин любого уровня подготовки, но всегда направлены на достижение максимального результата.'
  },
  {
    id: 3,
    name: 'Дмитрий Лебедев',
    role: 'Тренер по кикбоксингу',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
    quote: 'Бой раскрывает истинный характер человека.',
    experience: '15 лет в профессиональном спорте, мастер спорта международного класса.',
    bio: 'Дмитрий не только учит технике ударов, но и помогает развивать бойцовский характер. Его занятия — это всегда вызов, который помогает участникам выйти из зоны комфорта и обрести уверенность в своих силах.'
  },
  {
    id: 4,
    name: 'Игорь Морозов',
    role: 'Специалист по реабилитации',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    quote: 'Правильное восстановление — ключ к устойчивому прогрессу.',
    experience: '12 лет работы с профессиональными спортсменами, кандидат медицинских наук.',
    bio: 'Игорь разрабатывает индивидуальные программы восстановления для каждого участника. Благодаря его методикам, интенсивные тренировки КЭМП становятся эффективными и безопасными даже для новичков.'
  },
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
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
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
              >
                <X size={20} className="text-kamp-dark" />
              </button>
              
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="aspect-[3/4] md:h-full">
                    <img 
                      src={selectedTrainer.image} 
                      alt={selectedTrainer.name}
                      className="w-full h-full object-cover"
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
                    <h4 className="font-bold text-kamp-dark mb-2">Биография</h4>
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
