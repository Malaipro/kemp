
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ServicePackage, formatPrice } from './servicePackagesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface PackageCardsProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageCards = ({ packages, onSelectPackage }: PackageCardsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-3 gap-1' : 'md:grid-cols-3 gap-4 md:gap-6'} reveal-on-scroll overflow-x-auto pb-2 snap-x`}>
      {packages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={`border-2 ${pkg.highlight ? 'border-kamp-primary shadow-lg' : 'border-gray-300'} 
            shadow-md overflow-hidden transition-all hover:shadow-xl hover:border-kamp-accent flex flex-col 
            ${isMobile ? 'min-w-[90px] snap-center scale-95' : ''}`}
        >
          <CardHeader className={`bg-white ${isMobile ? 'p-1.5' : 'p-6'}`}>
            <CardTitle className={`text-black font-bold ${isMobile ? 'text-xs' : ''}`}>
              {pkg.title}
            </CardTitle>
            <div className={`mt-1 mb-1 ${isMobile ? 'text-sm' : 'text-2xl md:text-3xl'} font-bold text-kamp-primary`}>{formatPrice(pkg.price)} ₽</div>
            {!isMobile && <CardDescription className="text-black/70">{pkg.description}</CardDescription>}
            {pkg.date && !isMobile && (
              <div className="text-xs md:text-sm font-medium text-black/70 mt-2 flex items-center">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                {format(pkg.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
              </div>
            )}
          </CardHeader>
          <CardContent className={`${isMobile ? 'pt-0 pb-1 px-1.5' : 'pt-6 pb-4 px-6'} flex-grow bg-white`}>
            {isMobile ? (
              <div className="text-center text-xs text-black/70">
                {pkg.features && pkg.features[0]}
              </div>
            ) : (
              <ul className="space-y-1 md:space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-black text-sm md:text-base">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-kamp-primary shrink-0 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="mt-auto bg-white p-1.5 md:p-6">
            <Button 
              className={`w-full bg-kamp-primary hover:bg-kamp-accent text-white font-medium shadow-md ${isMobile ? 'text-xs py-0.5' : 'py-1.5 md:py-2.5'}`}
              onClick={() => onSelectPackage(pkg)}
            >
              {isMobile ? 'Выбрать' : 'Выбрать'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
