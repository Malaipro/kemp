
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

// Static data for activities - Геймификация КЭМП
export const activities: Activity[] = [
  { id: '1', title: 'Закал БЖЖ (тренировка)', icon: 'Target', points: 1 },
  { id: '2', title: 'Закал Кикбоксинг (тренировка)', icon: 'Zap', points: 1 },
  { id: '3', title: 'Закал ОФП (тренировка)', icon: 'Dumbbell', points: 1 },
  { id: '4', title: 'Грань - лекция КЭМП', icon: 'Book', points: 1 },
  { id: '5', title: 'Грань - домашнее задание', icon: 'FileText', points: 1 },
  { id: '6', title: 'Шрам БЖЖ (испытание)', icon: 'Shield', points: 6 },
  { id: '7', title: 'Шрам Кикбоксинг (испытание)', icon: 'Flame', points: 6 },
  { id: '8', title: 'Шрам ОФП (испытание)', icon: 'Mountain', points: 6 },
  { id: '9', title: 'Шрам Тактика (испытание)', icon: 'Crosshair', points: 3 },
  { id: '10', title: 'Гонка Героев', icon: 'Trophy', points: 8 },
  { id: '11', title: 'Аскеза (14 дней)', icon: 'Heart', points: 0 },
];
