
import React from 'react';
import { Dumbbell, Award, Users } from 'lucide-react';
import { Button } from './ui/button';

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
  // Function to scroll to the Program section
  const scrollToProgram = () => {
    const programSection = document.getElementById('program');
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <div className="mb-6 bg-blue-50 inline-flex p-4 rounded-lg">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-kamp-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center reveal-on-scroll">
          <div className="relative overflow-hidden rounded-xl shadow-xl bg-gradient-to-r from-kamp-dark/10 to-kamp-primary/10 p-1">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <video 
                className="w-full h-full object-cover rounded-lg"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="https://imgur.com/eXVpT0r" type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="max-w-xl text-left">
                  <h3 className="text-2xl font-bold mb-2 text-white">Что тебя ждет?</h3>
                  <p className="text-white/90 mb-4">
                    Интенсивные тренировки, испытания на выносливость, работа в команде и индивидуальный рост.
                    Каждый день — новый вызов, каждый день — новая победа над собой.
                  </p>
                  <button 
                    onClick={scrollToProgram}
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                  >
                    Узнать больше
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
