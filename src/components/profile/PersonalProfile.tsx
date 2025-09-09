import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalData {
  id: string;
  name: string;
  last_name: string | null;
  email: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  birth_date: string | null;
}

export const PersonalProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PersonalData>>({});
  const queryClient = useQueryClient();

  const { data: personalData, isLoading } = useQuery({
    queryKey: ['personal-profile', user?.id],
    queryFn: async (): Promise<PersonalData | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name, email, height_cm, weight_kg, birth_date')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (personalData) {
      setFormData(personalData);
    }
  }, [personalData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<PersonalData>) => {
      if (!personalData) throw new Error('No participant data found');
      
      const { data, error } = await supabase
        .from('участники')
        .update(updates)
        .eq('id', personalData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-profile', user?.id] });
      setIsEditing(false);
      toast.success('Персональные данные обновлены');
    },
    onError: (error) => {
      toast.error('Ошибка обновления данных: ' + error.message);
    }
  });

  const handleSave = () => {
    if (!formData.name) {
      toast.error('Имя обязательно для заполнения');
      return;
    }
    
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(personalData || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!personalData) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Персональные данные не найдены</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Персональные данные</h3>
          <p className="text-gray-400">Ваша личная информация</p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        )}
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-kamp-accent" />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Имя *</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                  placeholder="Ваше имя"
                />
              ) : (
                <p className="text-white bg-gray-800 px-3 py-2 rounded-md min-h-[40px] flex items-center">
                  {personalData.name}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="last_name" className="text-gray-300">Фамилия</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                  placeholder="Ваша фамилия"
                />
              ) : (
                <p className="text-white bg-gray-800 px-3 py-2 rounded-md min-h-[40px] flex items-center">
                  {personalData.last_name || 'Не указана'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Электронная почта</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                  placeholder="email@example.com"
                />
              ) : (
                <p className="text-white bg-gray-800 px-3 py-2 rounded-md min-h-[40px] flex items-center">
                  {personalData.email || 'Не указана'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="birth_date" className="text-gray-300">Дата рождения</Label>
              {isEditing ? (
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                />
              ) : (
                <p className="text-white bg-gray-800 px-3 py-2 rounded-md min-h-[40px] flex items-center">
                  {personalData.birth_date 
                    ? new Date(personalData.birth_date).toLocaleDateString('ru-RU') 
                    : 'Не указана'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="height" className="text-gray-300">Рост (см)</Label>
              {isEditing ? (
                <Input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  value={formData.height_cm || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value ? Number(e.target.value) : null }))}
                  className="bg-white border-gray-300 text-black"
                  placeholder="175"
                />
              ) : (
                <p className="text-white bg-gray-800 px-3 py-2 rounded-md min-h-[40px] flex items-center">
                  {personalData.height_cm ? `${personalData.height_cm} см` : 'Не указан'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="weight" className="text-gray-300">Вес (кг)</Label>
              {isEditing ? (
                <Input
                  id="weight"
                  type="number"
                  min="30"
                  max="200"
                  value={formData.weight_kg || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value ? Number(e.target.value) : null }))}
                  className="bg-white border-gray-300 text-black"
                  placeholder="70"
                />
              ) : (
                <p className="text-white bg-gray-800 px-3 py-2 rounded-md min-h-[40px] flex items-center">
                  {personalData.weight_kg ? `${personalData.weight_kg} кг` : 'Не указан'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-gray-700 text-gray-300"
              >
                Отмена
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};