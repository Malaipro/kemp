
import React from 'react';
import { Dumbbell, Award, Users } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: <Dumbbell className="w-10 h-10 text-kamp-primary" />,
    title: 'Испытания',
    description: 'Жёсткие тренировки, закаливание, дисциплина. Преодолей себя и стань сильнее.',
  },
  {
    id: 2,
    icon: <Users className="w-10 h-10 text-kamp-primary" />,
    title: 'Поддержка',
    description: 'Лучшие наставники, сообщество единомышленников. Вместе мы достигнем большего.',
  },
  {
    id: 3,
    icon: <Award className="w-10 h-10 text-kamp-primary" />,
    title: 'Лидерборд',
    description: 'Докажи свою силу, соревнуйся с другими участниками, получи заслуженную награду.',
  },
];

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="kamp-section bg-kamp-light">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-2">О нас</span>
          <h2 className="text-kamp-dark">Мы создаем условия для развития настоящей силы</h2>
          <p>
            Мы — команда профессионалов, объединенных одной целью: создавать условия для развития настоящей силы. 
            Наш курс — это не просто тренировки. Это система испытаний, которые делают тебя сильнее во всех сферах жизни.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 stagger-animation">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="kamp-card p-8 reveal-on-scroll hover-lift"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-kamp-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center reveal-on-scroll">
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
              alt="Групповые тренировки"
              className="w-full h-auto object-cover rounded-xl"
              style={{ maxHeight: '500px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 text-white text-left">
              <h3 className="text-2xl font-bold mb-2">Что тебя ждет?</h3>
              <p className="text-white/80 max-w-xl">
                Интенсивные тренировки, испытания на выносливость, работа в команде и индивидуальный рост.
                Каждый день — новый вызов, каждый день — новая победа над собой.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
