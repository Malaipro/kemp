
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
import { CheckCircle, XCircle } from 'lucide-react';
import { ServicePackage, formatPrice } from './servicePackagesData';

interface PackageTableMobileProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTableMobile = ({ packages, onSelectPackage }: PackageTableMobileProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white">
      <div className="overflow-x-auto text-xs">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-left p-1 border-b text-black font-semibold">Услуга</TableHead>
              <TableHead className="text-center p-1 border-b text-black font-semibold w-[55px]">Демо</TableHead>
              <TableHead className="text-center p-1 border-b text-black font-semibold w-[55px]">Баз.</TableHead>
              <TableHead className="text-center p-1 border-b text-black font-semibold w-[55px]">Прем.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FeatureRow 
              title="Стоимость" 
              values={[
                `${formatPrice(600)} ₽`, 
                `${formatPrice(20400)} ₽`, 
                `${formatPrice(34900)} ₽`
              ]} 
              textValues={true}
              bgWhite={true}
            />
            <FeatureRow 
              title="Тренировки" 
              values={[true, true, true]} 
              bgWhite={false}
            />
            <FeatureRow 
              title="Функциональные" 
              values={[false, true, true]} 
              bgWhite={true}
            />
            <FeatureRow 
              title="Выездные" 
              values={[false, true, true]} 
              bgWhite={false}
            />
            <FeatureRow 
              title="Индивидуальное" 
              values={[false, false, true]} 
              bgWhite={true}
            />
            <FeatureRow 
              title="План питания" 
              values={[false, false, true]} 
              bgWhite={false}
            />
            <TableRow>
              <TableCell colSpan={4} className="p-1">
                <div className="flex space-x-1 mt-1 justify-between">
                  {packages.map((pkg) => (
                    <Button 
                      key={pkg.id}
                      className={`w-full text-white text-[10px] py-1 ${pkg.highlight ? 'bg-kamp-primary hover:bg-kamp-primary/90' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => onSelectPackage(pkg)}
                    >
                      {pkg.title === "Демо" ? "Демо" : pkg.title === "Базовый" ? "Баз." : "Прем."}
                    </Button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Helper component for rendering feature rows
interface FeatureRowProps {
  title: string;
  values: (boolean | string)[];
  textValues?: boolean;
  bgWhite?: boolean;
}

const FeatureRow = ({ title, values, textValues = false, bgWhite = false }: FeatureRowProps) => {
  return (
    <TableRow className={bgWhite ? "bg-white" : "bg-gray-50"}>
      <TableCell className="p-1 border-b text-black font-medium text-xs">{title}</TableCell>
      {values.map((value, index) => (
        <TableCell key={index} className="text-center p-1 border-b">
          {textValues ? (
            <span className="text-black text-xs">{value}</span>
          ) : (
            value ? (
              <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
            )
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};
