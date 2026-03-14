import { ReactNode } from 'react';

export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
  iconName: string; // Lucide icon name
  isActive: boolean;
}

export interface Appointment {
  id: string;
  services: Service[];
  totalPrice: number;
  date: string; // ISO string
  time: string; // HH:mm
  createdAt: string;
  status: AppointmentStatus;
  clientName?: string;
  clientPhone?: string;
}

export interface BlockedTime {
  date: string;
  time: string;
}

export type Screen = 'home' | 'services' | 'cart' | 'datetime' | 'confirmation' | 'my-appointments';
export type AdminScreen = 'dashboard' | 'services' | 'appointments' | 'times' | 'clients';
export type UserRole = 'client' | 'admin';
