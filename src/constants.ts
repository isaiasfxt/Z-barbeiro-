import { Service } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabelo',
    price: 45,
    duration: 30,
    description: 'Corte moderno ou clássico, finalizado com pomada.',
    iconName: 'Scissors',
    isActive: true,
  },
  {
    id: '2',
    name: 'Barba',
    price: 35,
    duration: 30,
    description: 'Aparada e desenhada com toalha quente e navalha.',
    iconName: 'Zap',
    isActive: true,
  },
  {
    id: '3',
    name: 'Corte + Barba',
    price: 70,
    duration: 60,
    description: 'O combo completo para o seu visual.',
    iconName: 'UserCheck',
    isActive: true,
  },
  {
    id: '4',
    name: 'Sobrancelha',
    price: 15,
    duration: 15,
    description: 'Limpeza e design da sobrancelha.',
    iconName: 'Eye',
    isActive: true,
  },
  {
    id: '5',
    name: 'Acabamento',
    price: 20,
    duration: 15,
    description: 'Apenas o contorno do cabelo (pezinho).',
    iconName: 'CornerRightDown',
    isActive: true,
  },
];

export const DEFAULT_AVAILABLE_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];
