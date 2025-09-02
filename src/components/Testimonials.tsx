import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
export const Testimonials: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [mutedStatus, setMutedStatus] = useState<{
    [key: number]: boolean;
  }>({
    1: true,
    2: true
  });
  const [openVideo, setOpenVideo] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const videoRefs = useRef<{
    [key: number]: HTMLVideoElement | null;
  }>({
    1: null,
    2: null
  });
  const modalVideoRefs = useRef<{
    [key: number]: HTMLVideoElement | null;
  }>({
    1: null,
    2: null
  });
  const testimonials = [
    {
      id: 1,
      name: 'Участник программы',
      position: 'Выпускник КЭМП',
      videoUrl: '/videos/testimonial-1.mp4'
    },
    {
      id: 2,
      name: 'Участник программы',
      position: 'Выпускник КЭМП',
      videoUrl: '/videos/testimonial-2.mp4'
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
  return <section id="testimonials" className="kamp-section bg-black py-6 md:py-16">
      <div className="kamp-container">
        <div className="section-heading mb-4 md:mb-12">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl mb-2">Отзывы участников</h2>
          <p className="text-gray-300 text-sm md:text-base">
            Узнайте, что говорят наши выпускники о программе КЭМП и как она изменила их жизнь
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          {testimonials.map(testimonial => <Card key={testimonial.id} className="overflow-hidden hover-lift bg-gray-900 border-gray-800 cursor-pointer" onClick={() => togglePlay(testimonial.id)}>
              <CardContent className="p-0 relative aspect-video">
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    ref={el => videoRefs.current[testimonial.id] = el}
                    src={testimonial.videoUrl}
                    muted={mutedStatus[testimonial.id]}
                    className="w-full h-full object-cover"
                    onEnded={() => setPlayingVideo(null)}
                  />
                  
                  {/* Play/Pause Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-black/60 hover:bg-black/80 text-white border-0 rounded-full p-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(testimonial.id);
                      }}
                    >
                      {playingVideo === testimonial.id ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} />
                      )}
                    </Button>
                  </div>

                  {/* Controls */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-black/60 hover:bg-black/80 text-white border-0 rounded-full p-2"
                      onClick={(e) => toggleMute(testimonial.id, e)}
                    >
                      {mutedStatus[testimonial.id] ? (
                        <VolumeX size={16} />
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-black/60 hover:bg-black/80 text-white border-0 rounded-full p-2"
                      onClick={(e) => openVideoDialog(testimonial.id, e)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </svg>
                    </Button>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
                    <h4 className="font-bold text-white text-sm md:text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-300 text-xs">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>

      <Dialog open={openVideo !== null} onOpenChange={open => !open && handleDialogClose()}>
        <DialogContent className="max-w-4xl p-0 border-gray-800 bg-black w-[95vw]">
          <DialogClose className="absolute right-2 top-2 md:right-4 md:top-4 z-20 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 transition-all" />
          
          {openVideo && <div className="relative aspect-video w-full">
              <video ref={el => modalVideoRefs.current[openVideo] = el} src={testimonials.find(t => t.id === openVideo)?.videoUrl} autoPlay controls className="w-full h-full object-contain" />
              <div className="absolute bottom-0 left-0 p-2 md:p-4 bg-gradient-to-t from-black to-transparent w-full">
                <h4 className="font-bold text-white text-base md:text-xl">
                  {testimonials.find(t => t.id === openVideo)?.name}
                </h4>
                <p className="text-gray-300 text-xs md:text-sm">
                  {testimonials.find(t => t.id === openVideo)?.position}
                </p>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </section>;
};