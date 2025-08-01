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
    2: true,
    3: true
  });
  const [openVideo, setOpenVideo] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const videoRefs = useRef<{
    [key: number]: HTMLVideoElement | null;
  }>({
    1: null,
    2: null,
    3: null
  });
  const modalVideoRefs = useRef<{
    [key: number]: HTMLVideoElement | null;
  }>({
    1: null,
    2: null,
    3: null
  });
  const testimonials = [{
    id: 3,
    name: 'Ренат',
    position: 'Выпускник 1 потока',
    videoUrl: 'https://i.imgur.com/GtLxhNZ.mp4',
    thumbnailUrl: 'https://i.imgur.com/GtLxhNZ.jpg'
  }, {
    id: 1,
    name: 'Резеда',
    position: 'Выпускник 1 потока',
    videoUrl: 'https://i.imgur.com/VO8Habw.mp4',
    thumbnailUrl: 'https://i.imgur.com/VO8Habw.jpg'
  }, {
    id: 2,
    name: 'Рустэм',
    position: 'Выпускник 1 потока',
    videoUrl: 'https://i.imgur.com/r1Xdknj.mp4',
    thumbnailUrl: 'https://i.imgur.com/r1Xdknj.jpg'
  }];
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