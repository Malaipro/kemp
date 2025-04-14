
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Diamond, Flame, CheckCircle, Calendar } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const servicePackages = [
  {
    id: 'demo',
    title: 'Демо-тренировка',
    description: 'Тренировка с Шакиром Бабаевым, специалистом по космической медицине',
    price: 600,
    features: [
      'Одна тренировка длительностью 60 минут',
      'Индивидуальный подход',
      'Введение в методику КЭМП',
      'Оценка физической подготовки'
    ],
    date: new Date(2025, 3, 19, 10, 0), // 19 апреля 2025, 10:00
    highlight: false,
    color: 'bg-gray-100',
    icon: Star,
    titleColor: 'text-yellow-600'
  },
  {
    id: 'basic',
    title: 'Базовый курс',
    description: 'Полный курс для физического и ментального развития',
    price: 20400,
    features: [
      '10 тренировок по кикбоксингу',
      '8 функциональных тренировок',
      '2 выездных мероприятия',
      'Общий чат участников',
      'Методические материалы'
    ],
    highlight: false,
    color: 'bg-blue-50',
    icon: Flame,
    titleColor: 'text-blue-600'
  },
  {
    id: 'premium',
    title: 'Премиум курс',
    description: 'Расширенный курс с максимальной поддержкой',
    price: 34900,
    features: [
      'Всё, что входит в Базовый курс',
      'Индивидуальное сопровождение',
      '4 выездных мероприятия',
      'Персональный план питания',
      'Доступ к закрытому комьюнити',
      'Сессии с психологом'
    ],
    highlight: true,
    color: 'bg-amber-50',
    icon: Diamond,
    titleColor: 'text-purple-600'
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

export const ServicesPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<typeof servicePackages[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSelectPackage = (pkg: typeof servicePackages[0]) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name || !phone || !selectedPackage) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_bookings')
        .insert([{
          name,
          phone,
          package_id: selectedPackage.id,
          package_title: selectedPackage.title,
          package_price: selectedPackage.price
        }]);

      if (error) throw error;

      toast({
        title: "Успех!",
        description: "Ваша заявка успешно отправлена",
      });

      setIsDialogOpen(false);
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const PackageIcon = ({ icon: Icon }: { icon: typeof Star }) => (
    <div className="inline-flex items-center justify-center p-2 bg-kamp-accent/10 rounded-full mb-2">
      <Icon className="h-6 w-6 text-kamp-accent" />
    </div>
  );

  return (
    <section id="services" className="kamp-section bg-kamp-dark text-black">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-black font-semibold mb-2">Пакеты услуг</span>
          <h2 className="relative inline-block bg-gradient-to-r from-kamp-accent via-purple-600 to-blue-600 bg-clip-text text-transparent font-bold after:content-[''] after:absolute after:w-full after:h-[8px] after:left-0 after:bottom-1 after:bg-kamp-accent/20 after:-z-10">
            Выберите подходящий вариант
          </h2>
          <p className="text-black/70">
            Мы предлагаем различные варианты участия в программе КЭМП,
            от пробной тренировки до полного премиум-курса с индивидуальным сопровождением.
          </p>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="cards" className="text-black font-medium">Карточки</TabsTrigger>
              <TabsTrigger value="table" className="text-black font-medium">Сравнение</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards">
              <div className="grid md:grid-cols-3 gap-6 reveal-on-scroll">
                {servicePackages.map((pkg) => (
                  <Card key={pkg.id} className={`border-0 shadow-lg overflow-hidden transition-all hover:shadow-xl ${pkg.highlight ? 'ring-2 ring-kamp-accent' : ''} flex flex-col`}>
                    <CardHeader className={`${pkg.color} text-black`}>
                      <div className="flex items-center mb-2">
                        <PackageIcon icon={pkg.icon} />
                        <CardTitle className={`ml-2 ${pkg.titleColor} font-bold`}>
                          {pkg.title}
                        </CardTitle>
                      </div>
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
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button 
                        className="w-full bg-gradient-to-r from-kamp-accent to-kamp-primary hover:bg-kamp-accent-hover text-white font-medium shadow-md hover:shadow-lg transition-all" 
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        Выбрать
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="reveal-on-scroll">
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
                          {servicePackages.map((pkg) => (
                            <div key={pkg.id} className="text-center">
                              <Button 
                                className={`w-full ${pkg.id === 'premium' 
                                  ? 'bg-gradient-to-r from-kamp-accent to-kamp-primary hover:bg-kamp-accent-hover' 
                                  : 'bg-black hover:bg-gray-800'}`}
                                onClick={() => handleSelectPackage(pkg)}
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
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-black">
                {selectedPackage?.title || "Выбор пакета"}
              </DialogTitle>
              <DialogDescription className="text-black/70">
                Заполните форму, чтобы забронировать выбранный пакет услуг. Мы свяжемся с вами для подтверждения.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-black">Ваше имя</Label>
                <Input 
                  id="name" 
                  placeholder="Иванов Иван" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-black"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone" className="text-black">Телефон</Label>
                <Input 
                  id="phone" 
                  placeholder="+7 (XXX) XXX-XX-XX" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-black"
                />
              </div>
              
              {selectedPackage && (
                <div className="bg-gray-100 p-3 rounded-md mt-2">
                  <div className="font-medium text-black">{selectedPackage.title} - {formatPrice(selectedPackage.price)} ₽</div>
                  {selectedPackage.date && (
                    <div className="text-sm text-black/70 mt-1">
                      Дата: {format(selectedPackage.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="text-black"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-kamp-accent to-kamp-primary hover:bg-kamp-accent-hover text-white"
              >
                {isSubmitting ? 'Отправка...' : 'Забронировать'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
