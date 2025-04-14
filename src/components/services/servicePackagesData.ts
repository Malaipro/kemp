
import { Star, Diamond, Flame } from 'lucide-react';

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  date?: Date;
  highlight: boolean;
  color: string;
  icon: typeof Star | typeof Diamond | typeof Flame;
  titleColor: string;
}

export const servicePackages: ServicePackage[] = [
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
    titleColor: 'text-black'
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
    color: 'bg-gray-50',
    icon: Flame,
    titleColor: 'text-black'
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
    color: 'bg-gray-100',
    icon: Diamond,
    titleColor: 'text-black'
  }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price);
};
