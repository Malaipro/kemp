
import React from 'react';

interface VideoBackgroundProps {
  videoUrl?: string;
  imageUrl?: string;
  overlayColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoUrl,
  imageUrl,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  children,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : imageUrl ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : null}
      
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: overlayColor }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
