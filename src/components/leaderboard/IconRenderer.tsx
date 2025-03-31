
import React from 'react';
import { Medal, Target, Sun, DropletIcon, Utensils, Share2 } from 'lucide-react';

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
    default:
      return <Target className="w-5 h-5 text-kamp-accent" />;
  }
};
