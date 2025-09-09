import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

interface Participant {
  id: string;
  name: string;
  last_name: string | null;
  points: number;
  user_id: string | null;
  stream_id: string | null;
  stream?: {
    name: string;
  };
}

interface Stream {
  id: string;
  name: string;
  is_active: boolean;
}

export const ParticipantManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    last_name: '',
    stream_id: ''
  });

  const queryClient = useQueryClient();

  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ['participants-management'],
    queryFn: async (): Promise<Participant[]> => {
      const { data, error } = await supabase
        .from('участники')
        .select(`
          *,
          intensive_streams:stream_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(p => ({
        ...p,
        stream: p.intensive_streams
      }));
    }
  });

  const { data: streams } = useQuery({
    queryKey: ['streams-for-participants'],
    queryFn: async (): Promise<Stream[]> => {
      const { data, error } = await supabase
        .from('intensive_streams')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createParticipantMutation = useMutation({
    mutationFn: async (participantData: typeof newParticipant) => {
      const { data, error } = await supabase
        .from('участники')
        .insert([{
          name: participantData.name,
          last_name: participantData.last_name || null,
          stream_id: participantData.stream_id || null,
          points: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants-management'] });
      setShowCreateForm(false);
      setNewParticipant({ name: '', last_name: '', stream_id: '' });
      toast.success('Участник создан успешно');
    },
    onError: (error) => {
      toast.error('Ошибка создания участника: ' + error.message);
    }
  });

  const updateParticipantMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Participant> }) => {
      const { data, error } = await supabase
        .from('участники')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants-management'] });
      setEditingParticipant(null);
      toast.success('Участник обновлен успешно');
    },
    onError: (error) => {
      toast.error('Ошибка обновления участника: ' + error.message);
    }
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('участники')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants-management'] });
      toast.success('Участник удален успешно');
    },
    onError: (error) => {
      toast.error('Ошибка удаления участника: ' + error.message);
    }
  });

  const handleCreateParticipant = () => {
    if (!newParticipant.name) {
      toast.error('Заполните имя участника');
      return;
    }
    createParticipantMutation.mutate(newParticipant);
  };

  const handleUpdateParticipant = () => {
    if (!editingParticipant || !editingParticipant.name) {
      toast.error('Заполните имя участника');
      return;
    }
    updateParticipantMutation.mutate({
      id: editingParticipant.id,
      updates: {
        name: editingParticipant.name,
        last_name: editingParticipant.last_name,
        stream_id: editingParticipant.stream_id
      }
    });
  };

  if (participantsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kamp-accent mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Управление участниками</h3>
          <p className="text-gray-400">Добавляйте и редактируйте участников интенсивов</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить участника
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Добавить нового участника</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Имя *</Label>
                <Input
                  id="name"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Имя участника"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-gray-300">Фамилия</Label>
                <Input
                  id="last_name"
                  value={newParticipant.last_name}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Фамилия участника"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="stream" className="text-gray-300">Поток</Label>
              <Select
                value={newParticipant.stream_id}
                onValueChange={(value) => setNewParticipant(prev => ({ ...prev, stream_id: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Выберите поток" />
                </SelectTrigger>
                <SelectContent>
                  {streams?.map(stream => (
                    <SelectItem key={stream.id} value={stream.id}>
                      {stream.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateParticipant}
                disabled={createParticipantMutation.isPending}
                className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
              >
                Создать
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-gray-700"
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      {editingParticipant && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Редактировать участника</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_name" className="text-gray-300">Имя *</Label>
                <Input
                  id="edit_name"
                  value={editingParticipant.name}
                  onChange={(e) => setEditingParticipant(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="edit_last_name" className="text-gray-300">Фамилия</Label>
                <Input
                  id="edit_last_name"
                  value={editingParticipant.last_name || ''}
                  onChange={(e) => setEditingParticipant(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_stream" className="text-gray-300">Поток</Label>
              <Select
                value={editingParticipant.stream_id || ''}
                onValueChange={(value) => setEditingParticipant(prev => prev ? { ...prev, stream_id: value } : null)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Выберите поток" />
                </SelectTrigger>
                <SelectContent>
                  {streams?.map(stream => (
                    <SelectItem key={stream.id} value={stream.id}>
                      {stream.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateParticipant}
                disabled={updateParticipantMutation.isPending}
                className="bg-kamp-accent hover:bg-kamp-accent/90 text-black"
              >
                Сохранить
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingParticipant(null)}
                className="border-gray-700"
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants List */}
      <div className="grid gap-4">
        {participants?.map(participant => (
          <Card key={participant.id} className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-kamp-accent/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-kamp-accent" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {participant.name} {participant.last_name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{participant.points} баллов</span>
                      {participant.stream && (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {participant.stream.name}
                        </Badge>
                      )}
                      {participant.user_id && (
                        <Badge className="bg-green-600 text-white">
                          Зарегистрирован
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingParticipant(participant)}
                    className="border-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Вы уверены, что хотите удалить этого участника?')) {
                        deleteParticipantMutation.mutate(participant.id);
                      }
                    }}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};