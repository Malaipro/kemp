import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { Activity, Clock, User, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CooperTestResult {
  id: string;
  participant_id: string;
  test_date: string;
  distance_meters: number;
  time_minutes: number;
  completion_time_seconds: number | null;
  fitness_level: string | null;
  notes: string | null;
  test_number: number;
  participant?: {
    name: string;
    last_name: string | null;
  };
}

interface Participant {
  id: string;
  name: string;
  last_name: string | null;
}

export const CooperTestManagement: React.FC = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useRole();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState<CooperTestResult | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [testNumber, setTestNumber] = useState<number>(1);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionTimeSeconds, setCompletionTimeSeconds] = useState<number>(720); // 12 minutes in seconds
  const [notes, setNotes] = useState('');

  // Get current user's participant data
  const { data: currentParticipant } = useQuery({
    queryKey: ['current-participant-cooper'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !isSuperAdmin
  });

  // Get all participants (admin only)
  const { data: allParticipants } = useQuery({
    queryKey: ['all-participants-cooper'],
    queryFn: async () => {
      // Get current stream
      const { data: currentStream } = await supabase
        .from('intensive_streams')
        .select('id')
        .eq('is_current', true)
        .maybeSingle();

      if (!currentStream) return [];

      const { data, error } = await supabase
        .from('участники')
        .select('id, name, last_name')
        .eq('stream_id', currentStream.id)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: isSuperAdmin
  });

  // Get test results
  const { data: testResults, isLoading } = useQuery({
    queryKey: ['cooper-test-results', isSuperAdmin],
    queryFn: async () => {
      // Get test results
      let query = supabase
        .from('cooper_test_results')
        .select('*')
        .order('test_date', { ascending: false });

      // If not admin, only show current user's results
      if (!isSuperAdmin && currentParticipant) {
        query = query.eq('participant_id', currentParticipant.id);
      } else if (!isSuperAdmin) {
        return [];
      }

      const { data: results, error: resultsError } = await query;
      if (resultsError) throw resultsError;

      if (!results) return [];

      // Get participant info for admin
      if (isSuperAdmin && results.length > 0) {
        const participantIds = Array.from(new Set(results.map(r => r.participant_id)));
        const { data: participants, error: participantsError } = await supabase
          .from('участники')
          .select('id, name, last_name')
          .in('id', participantIds);

        if (participantsError) throw participantsError;

        const participantMap = new Map(participants?.map(p => [p.id, p]) || []);

        return results.map(result => ({
          ...result,
          participant: participantMap.get(result.participant_id) || null
        }));
      }

      return results.map(result => ({ ...result, participant: null }));
    },
    enabled: isSuperAdmin || !!currentParticipant
  });

  const calculateFitnessLevel = (timeSeconds: number) => {
    // Основано на времени прохождения теста (чем меньше время, тем лучше)
    if (timeSeconds <= 540) return 'Отлично'; // 9 минут или меньше
    if (timeSeconds <= 600) return 'Хорошо';   // до 10 минут
    if (timeSeconds <= 720) return 'Удовлетворительно'; // до 12 минут
    if (timeSeconds <= 900) return 'Слабо';    // до 15 минут
    return 'Очень слабо'; // больше 15 минут
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      const { error } = await supabase
        .from('cooper_test_results')
        .insert(testData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Результат теста добавлен');
      queryClient.invalidateQueries({ queryKey: ['cooper-test-results'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const updateTestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('cooper_test_results')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Результат теста обновлен');
      queryClient.invalidateQueries({ queryKey: ['cooper-test-results'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const deleteTestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cooper_test_results')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Результат теста удален');
      queryClient.invalidateQueries({ queryKey: ['cooper-test-results'] });
    },
    onError: (error: any) => {
      toast.error('Ошибка: ' + error.message);
    }
  });

  const resetForm = () => {
    setShowAddForm(false);
    setEditingResult(null);
    setSelectedParticipantId('');
    setTestNumber(1);
    setTestDate(new Date().toISOString().split('T')[0]);
    setCompletionTimeSeconds(720);
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const participantId = isSuperAdmin ? selectedParticipantId : currentParticipant?.id;
    
    if (!participantId) {
      toast.error('Выберите участника');
      return;
    }

    const testData = {
      participant_id: participantId,
      test_number: testNumber,
      test_date: testDate,
      completion_time_seconds: completionTimeSeconds,
      fitness_level: calculateFitnessLevel(completionTimeSeconds),
      notes: notes || null
    };

    if (editingResult) {
      updateTestMutation.mutate({ id: editingResult.id, updates: testData });
    } else {
      addTestMutation.mutate(testData);
    }
  };

  const handleEdit = (result: CooperTestResult) => {
    setEditingResult(result);
    setSelectedParticipantId(result.participant_id);
    setTestNumber(result.test_number);
    setTestDate(result.test_date);
    setCompletionTimeSeconds(result.completion_time_seconds || 720);
    setNotes(result.notes || '');
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот результат?')) {
      deleteTestMutation.mutate(id);
    }
  };

  // Group results by test number
  const test1Results = testResults?.filter(r => r.test_number === 1) || [];
  const test2Results = testResults?.filter(r => r.test_number === 2) || [];

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
          <p className="text-gray-400 mt-2">Загрузка результатов...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-kamp-accent" />
            Тест Купера
          </h2>
          <p className="text-gray-400">
            {isSuperAdmin ? 'Управление результатами всех участников' : 'Ваши результаты тестов'}
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить результат
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingResult ? 'Редактировать результат' : 'Добавить новый результат'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Participant Selection (Admin only) */}
                {isSuperAdmin && (
                  <div>
                    <Label>Участник *</Label>
                    <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Выберите участника" />
                      </SelectTrigger>
                      <SelectContent>
                        {allParticipants?.map(participant => (
                          <SelectItem key={participant.id} value={participant.id}>
                            {participant.name} {participant.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Test Number */}
                <div>
                  <Label>Номер теста *</Label>
                  <Select value={testNumber.toString()} onValueChange={(value) => setTestNumber(parseInt(value))}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Тест 1</SelectItem>
                      <SelectItem value="2">Тест 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Test Date */}
                <div>
                  <Label>Дата теста *</Label>
                  <Input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                {/* Completion Time */}
                <div>
                  <Label>Время прохождения (секунды) *</Label>
                  <Input
                    type="number"
                    value={completionTimeSeconds}
                    onChange={(e) => setCompletionTimeSeconds(parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-gray-800 border-gray-700"
                    placeholder="720"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Текущее значение: {formatTime(completionTimeSeconds)}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Заметки</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Дополнительные заметки о тесте"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Fitness Level Preview */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300">
                  Уровень подготовки: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    calculateFitnessLevel(completionTimeSeconds) === 'Отлично' ? 'bg-green-600 text-white' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Хорошо' ? 'bg-blue-600 text-white' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Удовлетворительно' ? 'bg-yellow-600 text-black' :
                    calculateFitnessLevel(completionTimeSeconds) === 'Слабо' ? 'bg-orange-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {calculateFitnessLevel(completionTimeSeconds)}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={addTestMutation.isPending || updateTestMutation.isPending}
                  className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
                >
                  {editingResult ? 'Обновить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <Tabs defaultValue="test1" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test1" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Тест 1 ({test1Results.length})
          </TabsTrigger>
          <TabsTrigger value="test2" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Тест 2 ({test2Results.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test1" className="space-y-4">
          {test1Results.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">Нет результатов для теста 1</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {test1Results.map(result => (
                <Card key={result.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {isSuperAdmin && result.participant && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-white">
                                {result.participant.name} {result.participant.last_name}
                              </span>
                            </div>
                          )}
                          <span className="text-kamp-accent font-semibold">
                            {new Date(result.test_date).toLocaleDateString('ru-RU')}
                          </span>
                          <Badge variant="secondary" className="bg-blue-600 text-white">
                            Тест 1
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          <span className="text-lg font-bold text-white">
                            {result.distance_meters}м
                          </span>
                          {result.completion_time_seconds && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{formatTime(result.completion_time_seconds)}</span>
                            </div>
                          )}
                          {result.fitness_level && (
                            <Badge className={
                              result.fitness_level === 'Отлично' ? 'bg-green-600' :
                              result.fitness_level === 'Хорошо' ? 'bg-blue-600' :
                              result.fitness_level === 'Удовлетворительно' ? 'bg-yellow-600' :
                              result.fitness_level === 'Слабо' ? 'bg-orange-600' :
                              'bg-red-600'
                            }>
                              {result.fitness_level}
                            </Badge>
                          )}
                        </div>
                        
                        {result.notes && (
                          <p className="text-gray-400 text-sm">{result.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(result)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(result.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="test2" className="space-y-4">
          {test2Results.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">Нет результатов для теста 2</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {test2Results.map(result => (
                <Card key={result.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          {isSuperAdmin && result.participant && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-white">
                                {result.participant.name} {result.participant.last_name}
                              </span>
                            </div>
                          )}
                          <span className="text-kamp-accent font-semibold">
                            {new Date(result.test_date).toLocaleDateString('ru-RU')}
                          </span>
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            Тест 2
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          <span className="text-lg font-bold text-white">
                            {result.distance_meters}м
                          </span>
                          {result.completion_time_seconds && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{formatTime(result.completion_time_seconds)}</span>
                            </div>
                          )}
                          {result.fitness_level && (
                            <Badge className={
                              result.fitness_level === 'Отлично' ? 'bg-green-600' :
                              result.fitness_level === 'Хорошо' ? 'bg-blue-600' :
                              result.fitness_level === 'Удовлетворительно' ? 'bg-yellow-600' :
                              result.fitness_level === 'Слабо' ? 'bg-orange-600' :
                              'bg-red-600'
                            }>
                              {result.fitness_level}
                            </Badge>
                          )}
                        </div>
                        
                        {result.notes && (
                          <p className="text-gray-400 text-sm">{result.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(result)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(result.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};