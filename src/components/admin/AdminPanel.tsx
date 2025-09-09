import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Award } from 'lucide-react';
import { validateEmail, validateName, validatePassword, sanitizeInput, rateLimiter } from '@/lib/validation';

interface Participant {
  id: string;
  name: string;
  last_name: string;
  user_id: string;
  points: number;
}

export const AdminPanel: React.FC = () => {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Состояние для добавления пользователя
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  // Состояние для добавления активности
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [activityType, setActivityType] = useState<'zakal' | 'gran' | 'shram'>('zakal');
  const [activitySubtype, setActivitySubtype] = useState('');
  const [activityPoints, setActivityPoints] = useState(1);
  const [activityDescription, setActivityDescription] = useState('');

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    const { data, error } = await supabase
      .from('участники')
      .select('*')
      .order('points', { ascending: false });

    if (error) {
      console.error('Error loading participants:', error);
      return;
    }

    setParticipants(data || []);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting for admin actions
    if (!rateLimiter.isAllowed('admin-add-user', 10, 300000)) {
      toast({
        title: "Слишком много попыток",
        description: "Попробуйте через 5 минут",
        variant: "destructive"
      });
      return;
    }

    // Validate inputs
    const errors: Record<string, string> = {};
    const sanitizedEmail = sanitizeInput(newUserEmail);
    const sanitizedName = sanitizeInput(newUserName);
    const sanitizedLastName = sanitizeInput(newUserLastName);
    
    if (!validateEmail(sanitizedEmail)) {
      errors.email = 'Введите корректный email адрес';
    }
    
    if (!validateName(sanitizedName)) {
      errors.name = 'Имя должно содержать только буквы и пробелы';
    }
    
    if (!validateName(sanitizedLastName)) {
      errors.lastName = 'Фамилия должна содержать только буквы и пробелы';
    }
    
    if (!validatePassword(newUserPassword)) {
      errors.password = 'Пароль должен содержать минимум 8 символов, буквы и цифры';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setLoading(true);

    try {
      // Создаем пользователя через admin API с валидированными данными
      const { data, error } = await supabase.auth.admin.createUser({
        email: sanitizedEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: {
          name: sanitizedName,
          lastName: sanitizedLastName
        }
      });

      if (error) {
        toast({
          title: "Ошибка создания пользователя",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Создаем профиль участника
      if (data.user) {
        const { error: profileError } = await supabase
          .from('участники')
          .insert([
            {
              user_id: data.user.id,
              name: sanitizedName,
              last_name: sanitizedLastName,
              points: 0
            }
          ]);

        if (profileError) {
          console.error('Error creating participant profile:', profileError);
          toast({
            title: "Ошибка создания профиля",
            description: profileError.message,
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "Пользователь создан",
        description: `${sanitizedName} ${sanitizedLastName} успешно добавлен`
      });

      // Очищаем форму
      setNewUserEmail('');
      setNewUserName('');
      setNewUserLastName('');
      setNewUserPassword('');
      
      // Обновляем список участников
      loadParticipants();
    } catch (error) {
      console.error('Error in handleAddUser:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании пользователя",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const activityData: any = {
        participant_id: selectedParticipant,
        reward_type: activityType,
        points: activityPoints,
        description: activityDescription,
        activity_date: new Date().toISOString().split('T')[0],
        verified_by: 'Супер админ'
      };

      // Добавляем подтип в зависимости от типа активности
      if (activityType === 'zakal') {
        activityData.zakal_subtype = activitySubtype;
      } else if (activityType === 'shram') {
        activityData.shram_subtype = activitySubtype;
      }

      const { error } = await supabase
        .from('кэмп_активности')
        .insert([activityData]);

      if (error) {
        toast({
          title: "Ошибка добавления активности",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Активность добавлена",
        description: `${activityType.toUpperCase()} успешно добавлен участнику`
      });

      // Очищаем форму
      setSelectedParticipant('');
      setActivityDescription('');
      setActivityPoints(1);
      
      // Обновляем список участников
      loadParticipants();
    } catch (error) {
      console.error('Error in handleAddActivity:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении активности",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Добавление пользователя */}
        <Card className="kamp-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-kamp-accent responsive-text-base">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              Добавить пользователя
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name" className="responsive-text-sm">Имя</Label>
                  <Input
                    id="new-name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                    maxLength={50}
                    className={`kamp-input text-sm ${formErrors.name ? 'border-red-500' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-lastname" className="responsive-text-sm">Фамилия</Label>
                  <Input
                    id="new-lastname"
                    value={newUserLastName}
                    onChange={(e) => setNewUserLastName(e.target.value)}
                    required
                    maxLength={50}
                    className={`kamp-input text-sm ${formErrors.lastName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-email" className="responsive-text-sm">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  maxLength={254}
                  className={`kamp-input text-sm ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="responsive-text-sm">Пароль</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={50}
                  className={`kamp-input text-sm ${formErrors.password ? 'border-red-500' : ''}`}
                />
                {formErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="kamp-button-primary w-full tap-target responsive-text-sm"
                disabled={loading || Object.keys(formErrors).length > 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Создание...' : 'Создать пользователя'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Добавление активности */}
        <Card className="kamp-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-kamp-accent responsive-text-base">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              Добавить активность
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="participant-select" className="responsive-text-sm">Участник</Label>
                <Select value={selectedParticipant} onValueChange={setSelectedParticipant} required>
                  <SelectTrigger className="kamp-input h-10">
                    <SelectValue placeholder="Выберите участника" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name} {participant.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-type" className="responsive-text-sm">Тип награды</Label>
                  <Select value={activityType} onValueChange={(value: 'zakal' | 'gran' | 'shram') => setActivityType(value)}>
                    <SelectTrigger className="kamp-input h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zakal">Закал</SelectItem>
                      <SelectItem value="gran">Грань</SelectItem>
                      <SelectItem value="shram">Шрам</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(activityType === 'zakal' || activityType === 'shram') && (
                  <div className="space-y-2">
                    <Label htmlFor="activity-subtype" className="responsive-text-sm">Подтип</Label>
                    <Select value={activitySubtype} onValueChange={setActivitySubtype} required>
                      <SelectTrigger className="kamp-input h-10">
                        <SelectValue placeholder="Выберите подтип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bjj">БЖЖ</SelectItem>
                        <SelectItem value="kick">Кикбоксинг</SelectItem>
                        <SelectItem value="ofp">ОФП</SelectItem>
                        {activityType === 'shram' && (
                          <SelectItem value="tactics">Тактика</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-points" className="responsive-text-sm">Баллы</Label>
                <Input
                  id="activity-points"
                  type="number"
                  value={activityPoints}
                  onChange={(e) => setActivityPoints(parseInt(e.target.value) || 1)}
                  min={1}
                  className="kamp-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-description" className="responsive-text-sm">Описание</Label>
                <Input
                  id="activity-description"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(sanitizeInput(e.target.value))}
                  placeholder="Описание активности"
                  maxLength={200}
                  className="kamp-input text-sm"
                />
              </div>

              <Button 
                type="submit" 
                className="kamp-button-primary w-full tap-target responsive-text-sm"
                disabled={loading || !selectedParticipant}
              >
                <Award className="w-4 h-4 mr-2" />
                {loading ? 'Добавление...' : 'Добавить активность'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Список участников */}
      <Card className="kamp-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-kamp-accent responsive-text-base">
            Все участники ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {participants.map((participant) => (
              <div 
                key={participant.id}
                className="p-3 sm:p-4 border border-gray-700 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-colors touch-card"
              >
                <h3 className="font-semibold text-kamp-accent responsive-text-sm line-clamp-1">
                  {participant.name} {participant.last_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Баллы: {participant.points}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};