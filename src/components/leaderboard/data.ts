
import { Participant, Activity } from '@/types/leaderboard';

// Static data for participants
export const participants: Participant[] = [
  { id: '1', name: 'Алексей Петров', points: 240, rank: 1 },
  { id: '2', name: 'Иван Смирнов', points: 225, rank: 2 },
  { id: '3', name: 'Сергей Иванов', points: 210, rank: 3 },
  { id: '4', name: 'Дмитрий Козлов', points: 195, rank: 4 },
  { id: '5', name: 'Николай Морозов', points: 180, rank: 5 },
  { id: '6', name: 'Артем Волков', points: 170, rank: 6 },
  { id: '7', name: 'Максим Соколов', points: 165, rank: 7 },
  { id: '8', name: 'Владимир Новиков', points: 155, rank: 8 },
  { id: '9', name: 'Георгий Лебедев', points: 140, rank: 9 },
  { id: '10', name: 'Антон Орлов', points: 130, rank: 10 },
];

// Static data for activities
export const activities: Activity[] = [
  { id: '1', title: 'Тренировка', icon: 'Target', points: 20 },
  { id: '2', title: 'Утренняя тренировка', icon: 'Sun', points: 15 },
  { id: '3', title: 'Закаливание', icon: 'DropletIcon', points: 10 },
  { id: '4', title: 'Правильное питание', icon: 'Utensils', points: 15 },
  { id: '5', title: 'Посещение лекций и мастер классов', icon: 'Book', points: 15 },
  { id: '6', title: 'Участие в финальном испытании', icon: 'Trophy', points: 30 },
];
