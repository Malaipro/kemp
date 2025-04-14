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
    color: 'bg-gray-100'
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
    color: 'bg-blue-50'
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
    color: 'bg-amber-50'
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

  return (
    <section id="services" className="kamp-section bg-kamp-dark text-black">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-black font-semibold mb-2">Пакеты услуг</span>
          <h2 className="text-black">Выберите подходящий вариант</h2>
          <p className="text-black/70">
            Мы предлагаем различные варианты участия в программе КЭМП,
            от пробной тренировки до полного премиум-курса с индивидуальным сопровождением.
          </p>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="cards">Карточки</TabsTrigger>
              <TabsTrigger value="table">Сравнение</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards">
              <div className="grid md:grid-cols-3 gap-6 reveal-on-scroll">
                {servicePackages.map((pkg) => (
                  <Card key={pkg.id} className={`border-0 shadow-lg overflow-hidden transition-all hover:shadow-xl ${pkg.highlight ? 'ring-2 ring-kamp-accent' : ''} flex flex-col`}>
                    <CardHeader className={`${pkg.color} text-black`}>
                      <CardTitle className="text-black">{pkg.title}</CardTitle>
                      <div className="mt-2 mb-1 text-3xl font-bold text-black">{formatPrice(pkg.price)} ₽</div>
                      <CardDescription className="text-black/70">{pkg.description}</CardDescription>
                      {pkg.date && (
                        <div className="text-sm font-medium text-black/70 mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                            <line x1="16" x2="16" y1="2" y2="6"></line>
                            <line x1="8" x2="8" y1="2" y2="6"></line>
                            <line x1="3" x2="21" y1="10" y2="10"></line>
                          </svg>
                          {format(pkg.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 flex-grow">
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-black">
                            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button 
                        className="w-full bg-kamp-accent hover:bg-kamp-accent-hover text-white" 
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
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-4 border-b text-black">Услуга</th>
                      <th className="text-center p-4 border-b text-black">Демо</th>
                      <th className="text-center p-4 border-b text-black">Базовый</th>
                      <th className="text-center p-4 border-b text-black">Премиум</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b text-black">Стоимость</td>
                      <td className="text-center p-4 border-b text-black">600 ₽</td>
                      <td className="text-center p-4 border-b text-black">20 400 ₽</td>
                      <td className="text-center p-4 border-b text-black">34 900 ₽</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b text-black">Тренировки по кикбоксингу</td>
                      <td className="text-center p-4 border-b text-black">1</td>
                      <td className="text-center p-4 border-b text-black">10</td>
                      <td className="text-center p-4 border-b text-black">10</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b text-black">Функциональные тренировки</td>
                      <td className="text-center p-4 border-b text-black">-</td>
                      <td className="text-center p-4 border-b text-black">8</td>
                      <td className="text-center p-4 border-b text-black">8</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b text-black">Выездные мероприятия</td>
                      <td className="text-center p-4 border-b text-black">-</td>
                      <td className="text-center p-4 border-b text-black">2</td>
                      <td className="text-center p-4 border-b text-black">4</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b text-black">Индивидуальное сопровождение</td>
                      <td className="text-center p-4 border-b text-black">-</td>
                      <td className="text-center p-4 border-b text-black">-</td>
                      <td className="text-center p-4 border-b text-black">✓</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b text-black">План питания</td>
                      <td className="text-center p-4 border-b text-black">-</td>
                      <td className="text-center p-4 border-b text-black">-</td>
                      <td className="text-center p-4 border-b text-black">✓</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-4">
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {servicePackages.map((pkg) => (
                            <div key={pkg.id} className="text-center">
                              <Button 
                                className={`w-full ${pkg.id === 'premium' ? 'bg-kamp-accent hover:bg-kamp-accent-hover' : ''}`}
                                onClick={() => handleSelectPackage(pkg)}
                              >
                                Выбрать {pkg.title}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                className="text-white"
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
