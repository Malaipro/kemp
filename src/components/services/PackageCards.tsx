
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ServicePackage, formatPrice } from './servicePackagesData';

interface PackageCardsProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageCards = ({ packages, onSelectPackage }: PackageCardsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 reveal-on-scroll">
      {packages.map((pkg) => (
        <Card key={pkg.id} className={`border shadow-lg overflow-hidden transition-all hover:shadow-xl ${pkg.highlight ? 'ring-2 ring-gray-400' : ''} flex flex-col`}>
          <CardHeader className={`${pkg.color} text-black`}>
            <CardTitle className="text-black font-bold">
              {pkg.title}
            </CardTitle>
            <div className="mt-2 mb-1 text-3xl font-bold text-black">{formatPrice(pkg.price)} ₽</div>
            <CardDescription className="text-black/70">{pkg.description}</CardDescription>
            {pkg.date && (
              <div className="text-sm font-medium text-black/70 mt-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(pkg.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow">
            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start text-black">
                  <CheckCircle className="h-5 w-5 text-gray-600 shrink-0 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              className="w-full bg-kamp-primary hover:bg-kamp-accent text-white font-medium shadow-md" 
              onClick={() => onSelectPackage(pkg)}
            >
              Выбрать
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
