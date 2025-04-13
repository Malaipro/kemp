
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const Testimonials: React.FC = () => {
  // State to track which video is playing
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  // State to track which video has sound enabled
  const [mutedStatus, setMutedStatus] = useState<{[key: number]: boolean}>({
    1: true,
    2: true
  });
  
  // References to video elements for controlling them
  const videoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({
    1: null,
    2: null
  });

  // Video testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Резеда',
      position: 'Выпускница спец. потока',
      videoUrl: 'https://i.imgur.com/VO8Habw.mp4',
      thumbnailUrl: 'https://i.imgur.com/VO8Habw.jpg',
    },
    {
      id: 2,
      name: 'Ренат',
      position: 'Выпускник спец. потока',
      videoUrl: 'https://i.imgur.com/r1Xdknj.mp4',
      thumbnailUrl: 'https://i.imgur.com/r1Xdknj.jpg',
    }
  ];

  // Function to play/pause video
  const togglePlay = (id: number) => {
    const videoElement = videoRefs.current[id];
    if (!videoElement) return;

    if (playingVideo === id) {
      // If the video is already playing, pause it
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // If another video is playing, stop it
      if (playingVideo !== null && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      
      // Start playing the new video
      videoElement.play().catch(err => {
        console.error("Error playing video:", err);
      });
      setPlayingVideo(id);
    }
  };

  // Function to mute/unmute
  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
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
                {/* Video container */}
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
                  
                  {/* Overlay with information */}
                  <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 
                    ${playingVideo === testimonial.id ? 'bg-black/20 opacity-100' : 'bg-black/60 opacity-100'}`}>
                    
                    {/* Top part with name */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <h4 className="font-bold text-white text-xl">{testimonial.name}</h4>
                        <p className="text-gray-300 text-sm">{testimonial.position}</p>
                      </div>
                      
                      {/* Mute/unmute button */}
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
                    
                    {/* Central play button */}
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
                    
                    {/* Status indicator */}
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
