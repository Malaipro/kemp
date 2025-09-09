
import React from 'react';
import { Medal, Target, Sun, DropletIcon, Utensils, Share2, Book, Trophy, Zap, Dumbbell, FileText, Shield, Flame, Mountain, Crosshair, Heart } from 'lucide-react';

// Function to get icon component based on string name
export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Target':
      return <Target className="w-5 h-5 text-kamp-accent" />;
    case 'Medal':
      return <Medal className="w-5 h-5 text-kamp-accent" />;
    case 'Sun':
      return <Sun className="w-5 h-5 text-kamp-accent" />;
    case 'DropletIcon':
      return <DropletIcon className="w-5 h-5 text-kamp-accent" />;
    case 'Utensils':
      return <Utensils className="w-5 h-5 text-kamp-accent" />;
    case 'Share2':
      return <Share2 className="w-5 h-5 text-kamp-accent" />;
    case 'Book':
      return <Book className="w-5 h-5 text-kamp-accent" />;
    case 'Trophy':
      return <Trophy className="w-5 h-5 text-kamp-accent" />;
    case 'Zap':
      return <Zap className="w-5 h-5 text-kamp-accent" />;
    case 'Dumbbell':
      return <Dumbbell className="w-5 h-5 text-kamp-accent" />;
    case 'FileText':
      return <FileText className="w-5 h-5 text-kamp-accent" />;
    case 'Shield':
      return <Shield className="w-5 h-5 text-kamp-accent" />;
    case 'Flame':
      return <Flame className="w-5 h-5 text-kamp-accent" />;
    case 'Mountain':
      return <Mountain className="w-5 h-5 text-kamp-accent" />;
    case 'Crosshair':
      return <Crosshair className="w-5 h-5 text-kamp-accent" />;
    case 'Heart':
      return <Heart className="w-5 h-5 text-kamp-accent" />;
    default:
      return <Target className="w-5 h-5 text-kamp-accent" />;
  }
};
