
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Star, Diamond, Flame, CheckCircle } from 'lucide-react';
import { ServicePackage, formatPrice } from './servicePackagesData';

interface PackageTableProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTable = ({ packages, onSelectPackage }: PackageTableProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left p-4 border-b text-black font-semibold">Услуга</TableHead>
            <TableHead className="text-center p-4 border-b text-black font-semibold">
              <div className="flex flex-col items-center">
                <Star className="h-5 w-5 text-gray-600 mb-1" />
                <span>Демо</span>
              </div>
            </TableHead>
            <TableHead className="text-center p-4 border-b text-black font-semibold">
              <div className="flex flex-col items-center">
                <Flame className="h-5 w-5 text-gray-600 mb-1" />
                <span>Базовый</span>
              </div>
            </TableHead>
            <TableHead className="text-center p-4 border-b text-black font-semibold">
              <div className="flex flex-col items-center">
                <Diamond className="h-5 w-5 text-gray-600 mb-1" />
                <span>Премиум</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-white">
            <TableCell className="p-4 border-b text-black font-medium">Стоимость</TableCell>
            <TableCell className="text-center p-4 border-b text-black">{formatPrice(600)} ₽</TableCell>
            <TableCell className="text-center p-4 border-b text-black">{formatPrice(20400)} ₽</TableCell>
            <TableCell className="text-center p-4 border-b text-black">{formatPrice(34900)} ₽</TableCell>
          </TableRow>
          <TableRow className="bg-gray-50">
            <TableCell className="p-4 border-b text-black font-medium">Тренировки по кикбоксингу</TableCell>
            <TableCell className="text-center p-4 border-b text-black">1</TableCell>
            <TableCell className="text-center p-4 border-b text-black">10</TableCell>
            <TableCell className="text-center p-4 border-b text-black">10</TableCell>
          </TableRow>
          <TableRow className="bg-white">
            <TableCell className="p-4 border-b text-black font-medium">Функциональные тренировки</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">8</TableCell>
            <TableCell className="text-center p-4 border-b text-black">8</TableCell>
          </TableRow>
          <TableRow className="bg-gray-50">
            <TableCell className="p-4 border-b text-black font-medium">Выездные мероприятия</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">2</TableCell>
            <TableCell className="text-center p-4 border-b text-black">4</TableCell>
          </TableRow>
          <TableRow className="bg-white">
            <TableCell className="p-4 border-b text-black font-medium">Индивидуальное сопровождение</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">
              <CheckCircle className="h-5 w-5 text-kamp-primary mx-auto" />
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-50">
            <TableCell className="p-4 border-b text-black font-medium">План питания</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">
              <CheckCircle className="h-5 w-5 text-kamp-primary mx-auto" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} className="p-4">
              <div className="grid grid-cols-3 gap-4 mt-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="text-center">
                    <Button 
                      className="w-full bg-kamp-primary hover:bg-kamp-accent text-white" 
                      onClick={() => onSelectPackage(pkg)}
                    >
                      Выбрать {pkg.title}
                    </Button>
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
