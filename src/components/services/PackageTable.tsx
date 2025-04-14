
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
import { ServicePackage } from './servicePackagesData';

interface PackageTableProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTable = ({ packages, onSelectPackage }: PackageTableProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <Table>
        <TableHeader className="bg-gradient-to-r from-gray-100 to-gray-200">
          <TableRow>
            <TableHead className="text-left p-4 border-b text-black font-semibold">Услуга</TableHead>
            <TableHead className="text-center p-4 border-b">
              <div className="flex flex-col items-center">
                <Star className="h-5 w-5 text-yellow-500 mb-1" />
                <span className="text-yellow-600 font-semibold">Демо</span>
              </div>
            </TableHead>
            <TableHead className="text-center p-4 border-b">
              <div className="flex flex-col items-center">
                <Flame className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-blue-600 font-semibold">Базовый</span>
              </div>
            </TableHead>
            <TableHead className="text-center p-4 border-b">
              <div className="flex flex-col items-center">
                <Diamond className="h-5 w-5 text-purple-500 mb-1" />
                <span className="text-purple-600 font-semibold">Премиум</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-white">
            <TableCell className="p-4 border-b text-black font-medium">Стоимость</TableCell>
            <TableCell className="text-center p-4 border-b text-black">600 ₽</TableCell>
            <TableCell className="text-center p-4 border-b text-black">20 400 ₽</TableCell>
            <TableCell className="text-center p-4 border-b text-black">34 900 ₽</TableCell>
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
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-50">
            <TableCell className="p-4 border-b text-black font-medium">План питания</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">-</TableCell>
            <TableCell className="text-center p-4 border-b text-black">
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} className="p-4">
              <div className="grid grid-cols-3 gap-4 mt-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="text-center">
                    <Button 
                      className={`w-full ${pkg.id === 'premium' 
                        ? 'bg-gradient-to-r from-kamp-accent to-kamp-primary hover:bg-kamp-accent-hover' 
                        : 'bg-black hover:bg-gray-800'}`}
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
