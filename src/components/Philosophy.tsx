
import React from 'react';
import { Shield, Star, Zap } from 'lucide-react';

const principles = [
  {
    id: 1,
    icon: <Shield className="w-12 h-12 text-white" />,
    title: 'Выносливость',
    description: 'Держи удар не только в спорте, но и в жизни. Мы развиваем физическую и ментальную стойкость.',
  },
  {
    id: 2,
    icon: <Star className="w-12 h-12 text-white" />,
    title: 'Лидерство',
    description: 'Веди за собой, принимай решения, бери ответственность. Мы формируем настоящих лидеров.',
  },
  {
    id: 3,
    icon: <Zap className="w-12 h-12 text-white" />,
    title: 'Закалка духа',
    description: 'Выходи за пределы своих возможностей. Мы поможем тебе открыть свой настоящий потенциал.',
  },
];

export const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="kamp-section bg-kamp-primary text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="kamp-container relative z-10">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-white/80 font-semibold mb-2">Наша философия</span>
          <h2 className="text-white">В каждом из нас есть сила. Мы учим, как ее раскрыть.</h2>
          <p className="text-white/80">
            Мы верим, что настоящая сила формируется через преодоление трудностей, 
            дисциплину и постоянное развитие. КЭМП — это путь к лучшей версии себя.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {principles.map((principle) => (
            <div 
              key={principle.id} 
              className="text-center p-8 glass-card bg-white/5 backdrop-blur-sm rounded-xl reveal-on-scroll"
            >
              <div className="rounded-full bg-white/10 p-5 inline-flex mb-6">
                {principle.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
              <p className="text-white/80">{principle.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center reveal-on-scroll">
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-xl">
            <blockquote className="text-xl md:text-2xl italic font-light">
              "Сила не в том, чтобы никогда не падать, а в том, чтобы всегда подниматься."
            </blockquote>
            <div className="mt-4 font-semibold">— Команда КЭМП</div>
          </div>
        </div>
      </div>
    </section>
  );
};
