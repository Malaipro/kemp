
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ServicePackage, formatPrice } from './servicePackagesData';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: ServicePackage | null;
}

export const BookingDialog = ({ open, onOpenChange, selectedPackage }: BookingDialogProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
};
