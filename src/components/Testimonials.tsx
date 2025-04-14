
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

export const Testimonials: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [mutedStatus, setMutedStatus] = useState<{[key: number]: boolean}>({
    1: true,
    2: true,
    3: true
  });
  const [openVideo, setOpenVideo] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  const videoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({
    1: null,
    2: null,
    3: null
  });
  
  const modalVideoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({
    1: null,
    2: null,
    3: null
  });

  const testimonials = [
    {
      id: 3,
      name: 'Ренат',
      position: 'Выпускник 1 потока',
      videoUrl: 'https://i.imgur.com/GtLxhNZ.mp4',
      thumbnailUrl: 'https://i.imgur.com/GtLxhNZ.jpg',
    },
    {
      id: 1,
      name: 'Резеда',
      position: 'Выпускник 1 потока',
      videoUrl: 'https://i.imgur.com/VO8Habw.mp4',
      thumbnailUrl: 'https://i.imgur.com/VO8Habw.jpg',
    },
    {
      id: 2,
      name: 'Рустэм',
      position: 'Выпускник 1 потока',
      videoUrl: 'https://i.imgur.com/r1Xdknj.mp4',
      thumbnailUrl: 'https://i.imgur.com/r1Xdknj.jpg',
    }
  ];

  const togglePlay = (id: number) => {
    const videoElement = videoRefs.current[id];
    if (!videoElement) return;

    if (playingVideo === id) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo !== null && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      videoElement.play().catch(err => {
        console.error("Error playing video:", err);
      });
      setPlayingVideo(id);
    }
  };

  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const videoElement = videoRefs.current[id];
    if (!videoElement) return;
    
    const newMutedStatus = !mutedStatus[id];
    videoElement.muted = newMutedStatus;
    
    setMutedStatus(prev => ({
      ...prev,
      [id]: newMutedStatus
    }));
  };

  const openVideoDialog = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenVideo(id);
    if (playingVideo === id) {
      const videoElement = videoRefs.current[id];
      if (videoElement) {
        videoElement.pause();
        setPlayingVideo(null);
      }
    }
  };

  const handleDialogClose = () => {
    if (openVideo !== null && modalVideoRefs.current[openVideo]) {
      modalVideoRefs.current[openVideo]?.pause();
    }
    setOpenVideo(null);
  };

  return (
    <section id="testimonials" className="kamp-section bg-black py-10 md:py-16">
      <div className="kamp-container">
        <div className="section-heading mb-8 md:mb-12">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl mb-2">Отзывы участников</h2>
          <p className="text-gray-300 text-sm md:text-base">
            Узнайте, что говорят наши выпускники о программе КЭМП и как она изменила их жизнь
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="overflow-hidden hover-lift bg-gray-900 border-gray-800 cursor-pointer"
              onClick={() => togglePlay(testimonial.id)}
            >
              <CardContent className="p-0 relative aspect-video">
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    ref={el => videoRefs.current[testimonial.id] = el}
                    src={testimonial.videoUrl}
                    poster={testimonial.thumbnailUrl}
                    muted={mutedStatus[testimonial.id]}
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 flex flex-col justify-between p-3 md:p-6 transition-opacity duration-300 
                    ${playingVideo === testimonial.id ? 'bg-black/20 opacity-100' : 'bg-black/60 opacity-100'}`}>
                    
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <h4 className="font-bold text-white text-base md:text-xl">{testimonial.name}</h4>
                        <p className="text-gray-300 text-xs md:text-sm">{testimonial.position}</p>
                      </div>
                      
                      <button 
                        className="bg-black/80 hover:bg-black p-1.5 md:p-2 rounded-full text-white transition-all"
                        onClick={(e) => toggleMute(testimonial.id, e)}
                      >
                        {mutedStatus[testimonial.id] ? 
                          <VolumeX size={isMobile ? 16 : 18} /> : 
                          <Volume2 size={isMobile ? 16 : 18} />
                        }
                      </button>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className={`flex items-center justify-center 
                        ${isMobile ? 'h-14 w-14' : 'h-20 w-20'} rounded-full 
                        ${playingVideo === testimonial.id ? 'bg-kamp-primary scale-90' : 'bg-white/20 scale-100'} 
                        transition-all duration-300 backdrop-blur-sm`}
                      >
                        {playingVideo === testimonial.id ? 
                          <Pause className="text-white" size={isMobile ? 24 : 32} /> : 
                          <Play className="text-white" size={isMobile ? 24 : 32} />
                        }
                      </div>
                    </div>
                    
                    <div className="self-end flex items-center justify-between w-full">
                      <span className="text-white text-xs md:text-sm font-medium">
                        {playingVideo === testimonial.id ? 'Идет воспроизведение' : 'Нажмите для просмотра'}
                      </span>
                      <button 
                        className="ml-2 md:ml-4 bg-kamp-primary hover:bg-opacity-80 text-white px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all"
                        onClick={(e) => openVideoDialog(testimonial.id, e)}
                      >
                        Смотреть полностью
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={openVideo !== null} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent className="max-w-4xl p-0 border-gray-800 bg-black w-[95vw]">
          <DialogClose className="absolute right-2 top-2 md:right-4 md:top-4 z-20 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 transition-all" />
          
          {openVideo && (
            <div className="relative aspect-video w-full">
              <video
                ref={el => modalVideoRefs.current[openVideo] = el}
                src={testimonials.find(t => t.id === openVideo)?.videoUrl}
                autoPlay
                controls
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 p-2 md:p-4 bg-gradient-to-t from-black to-transparent w-full">
                <h4 className="font-bold text-white text-base md:text-xl">
                  {testimonials.find(t => t.id === openVideo)?.name}
                </h4>
                <p className="text-gray-300 text-xs md:text-sm">
                  {testimonials.find(t => t.id === openVideo)?.position}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
