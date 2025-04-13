
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VideoBackground } from '@/components/ui/VideoBackground';

export const Testimonials: React.FC = () => {
  // Состояние для отслеживания, какое видео воспроизводится
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  // Состояние для отслеживания, у какого видео включен звук
  const [mutedStatus, setMutedStatus] = useState<{[key: number]: boolean}>({
    1: true,
    2: true
  });
  
  // Ссылки на элементы видео для управления ими
  const videoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({
    1: null,
    2: null
  });

  // Данные видеоотзывов
  const testimonials = [
    {
      id: 1,
      name: 'Резеда',
      position: 'Выпускница спец. потока',
      videoUrl: 'https://imgur.com/VO8Habw.mp4',
      thumbnailUrl: 'https://i.imgur.com/VO8Habw.jpg',
    },
    {
      id: 2,
      name: 'Ренат',
      position: 'Выпускник спец. потока',
      videoUrl: 'https://imgur.com/r1Xdknj.mp4',
      thumbnailUrl: 'https://i.imgur.com/r1Xdknj.jpg',
    }
  ];

  // Функция для включения/выключения воспроизведения видео
  const togglePlay = (id: number) => {
    const videoElement = videoRefs.current[id];
    if (!videoElement) return;

    if (playingVideo === id) {
      // Если видео уже воспроизводится, ставим на паузу
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Если воспроизводится другое видео, останавливаем его
      if (playingVideo !== null && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      
      // Начинаем воспроизведение нового видео
      videoElement.play();
      setPlayingVideo(id);
    }
  };

  // Функция для включения/выключения звука
  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
    
    const videoElement = videoRefs.current[id];
    if (!videoElement) return;
    
    const newMutedStatus = !mutedStatus[id];
    videoElement.muted = newMutedStatus;
    
    setMutedStatus(prev => ({
      ...prev,
      [id]: newMutedStatus
    }));
  };

  return (
    <section id="testimonials" className="kamp-section bg-black">
      <div className="kamp-container">
        <div className="section-heading">
          <h2 className="text-white">Отзывы участников</h2>
          <p className="text-gray-300">
            Узнайте, что говорят наши выпускники о программе КЭМП и как она изменила их жизнь
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="overflow-hidden hover-lift bg-gray-900 border-gray-800 cursor-pointer"
              onClick={() => togglePlay(testimonial.id)}
            >
              <CardContent className="p-0 relative aspect-video">
                {/* Видео контейнер */}
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    ref={el => videoRefs.current[testimonial.id] = el}
                    src={testimonial.videoUrl}
                    poster={testimonial.thumbnailUrl}
                    muted={mutedStatus[testimonial.id]}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Оверлей с информацией */}
                  <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 
                    ${playingVideo === testimonial.id ? 'bg-black/20 opacity-100' : 'bg-black/60 opacity-100'}`}>
                    
                    {/* Верхняя часть с именем */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <h4 className="font-bold text-white text-xl">{testimonial.name}</h4>
                        <p className="text-gray-300 text-sm">{testimonial.position}</p>
                      </div>
                      
                      {/* Кнопка включения/выключения звука */}
                      <button 
                        className="bg-black/80 hover:bg-black p-2 rounded-full text-white transition-all"
                        onClick={(e) => toggleMute(testimonial.id, e)}
                      >
                        {mutedStatus[testimonial.id] ? 
                          <VolumeX size={18} /> : 
                          <Volume2 size={18} />
                        }
                      </button>
                    </div>
                    
                    {/* Центральная кнопка воспроизведения */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className={`flex items-center justify-center h-20 w-20 rounded-full 
                        ${playingVideo === testimonial.id ? 'bg-kamp-primary scale-90' : 'bg-white/20 scale-100'} 
                        transition-all duration-300 backdrop-blur-sm`}
                      >
                        {playingVideo === testimonial.id ? 
                          <Pause className="text-white" size={32} /> : 
                          <Play className="text-white" size={32} />
                        }
                      </div>
                    </div>
                    
                    {/* Индикатор состояния */}
                    <div className="self-end">
                      <span className="text-white text-sm font-medium">
                        {playingVideo === testimonial.id ? 'Идет воспроизведение' : 'Нажмите для просмотра'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
