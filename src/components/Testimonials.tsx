
import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Валеев Амир',
      image: '/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png', // Используем имеющееся изображение как заглушку
      rating: 5,
      quote: 'КЭМП полностью изменил мой подход к тренировкам и дисциплине. За время обучения я добился больших результатов, как в физическом плане, так и в ментальном. Тренеры профессионалы своего дела, которые знают, как мотивировать и направить энергию в нужное русло.',
      position: 'Выпускник спец. потока'
    },
    {
      id: 2,
      name: 'Волкова Евгения',
      image: '/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png', // Используем имеющееся изображение как заглушку
      rating: 5,
      quote: 'Я получила колоссальный опыт и поддержку от команды. Занятия по кроссфиту и пробежки закаливают не только тело, но и характер. Безумно благодарна тренерам за индивидуальный подход и высокий уровень профессионализма!',
      position: 'Выпускница спец. потока'
    },
    {
      id: 3,
      name: 'Утегенов Рустэм',
      image: '/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png', // Используем имеющееся изображение как заглушку
      rating: 5,
      quote: 'После прохождения КЭМП я стал намного дисциплинированнее и выносливее. Особенно запомнились выездные испытания, где действительно проверяются твои силы и характер. Рекомендую всем, кто хочет выйти из зоны комфорта и стать сильнее.',
      position: 'Выпускник спец. потока'
    }
  ];
  
  // Компонент для отображения рейтинга в виде звезд
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < rating ? 'text-kamp-accent fill-kamp-accent' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="kamp-section bg-gray-50">
      <div className="kamp-container">
        <div className="section-heading">
          <h2>Отзывы участников</h2>
          <p>
            Узнайте, что говорят наши выпускники о программе КЭМП и как она изменила их жизнь
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="overflow-hidden hover-lift"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
                <RatingStars rating={testimonial.rating} />
                <blockquote className="mt-3 text-gray-700 italic">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
