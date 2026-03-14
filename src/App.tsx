/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2, 
  History, Plus, ArrowRight, MapPin, Phone, ShoppingCart, Trash2, 
  Zap, Eye, CornerRightDown, UserCheck, LayoutGrid, Settings, 
  LogOut, Users, DollarSign, XCircle, CheckCircle, Edit2, Save, X
} from 'lucide-react';
import { INITIAL_SERVICES, DEFAULT_AVAILABLE_TIMES } from './constants';
import { Service, Appointment, Screen, AdminScreen, UserRole, BlockedTime } from './types';

const IconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors size={24} />,
  Zap: <Zap size={24} />,
  UserCheck: <UserCheck size={24} />,
  Eye: <Eye size={24} />,
  CornerRightDown: <CornerRightDown size={24} />,
};

const IconOptions = ['Scissors', 'Zap', 'UserCheck', 'Eye', 'CornerRightDown'];

export default function App() {
  // Global State
  const [role, setRole] = useState<UserRole>('client');
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  
  // Client State
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cart, setCart] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });

  // Admin State
  const [adminScreen, setAdminScreen] = useState<AdminScreen>('dashboard');
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Persistence
  useEffect(() => {
    const savedServices = localStorage.getItem('zb_services');
    const savedAppointments = localStorage.getItem('zb_appointments');
    const savedBlocked = localStorage.getItem('zb_blocked');
    const savedClient = localStorage.getItem('zb_client');
    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    if (savedBlocked) setBlockedTimes(JSON.parse(savedBlocked));
    if (savedClient) setClientInfo(JSON.parse(savedClient));
  }, []);

  useEffect(() => {
    localStorage.setItem('zb_services', JSON.stringify(services));
    localStorage.setItem('zb_appointments', JSON.stringify(appointments));
    localStorage.setItem('zb_blocked', JSON.stringify(blockedTimes));
    localStorage.setItem('zb_client', JSON.stringify(clientInfo));
  }, [services, appointments, blockedTimes, clientInfo]);

  // Derived Data
  const activeServices = useMemo(() => services.filter(s => s.isActive), [services]);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = useMemo(() => 
    appointments.filter(a => a.date === todayStr && a.status !== 'cancelled'),
  [appointments, todayStr]);

  const resetBooking = () => {
    setCart([]);
    setSelectedTime(null);
    setClientInfo({ name: '', phone: '' });
    setCurrentScreen('home');
  };

  const handleConfirmBooking = () => {
    if (cart.length > 0 && selectedTime) {
      const newApp: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        services: [...cart],
        totalPrice: cart.reduce((s, i) => s + i.price, 0),
        date: selectedDate,
        time: selectedTime,
        createdAt: new Date().toISOString(),
        status: 'pending',
        clientName: clientInfo.name || 'Cliente Anônimo',
        clientPhone: clientInfo.phone,
      };
      setAppointments([newApp, ...appointments]);
      setCurrentScreen('confirmation');
    }
  };

  // UI Components
  const ClientHeader = ({ title, showBack = true }: { title: string, showBack?: boolean }) => (
    <header className="flex items-center justify-between p-6 bg-black text-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={() => {
            if (currentScreen === 'services') setCurrentScreen('home');
            else if (currentScreen === 'cart') setCurrentScreen('services');
            else if (currentScreen === 'datetime') setCurrentScreen('cart');
            else if (currentScreen === 'my-appointments') setCurrentScreen('home');
          }} className="p-1 hover:bg-white/10 rounded-full">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight uppercase">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setCurrentScreen('cart')} className="p-2 relative">
          <ShoppingCart size={20} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
        </button>
        <button onClick={() => setRole('admin')} className="p-2 opacity-20 hover:opacity-100"><Settings size={20} /></button>
      </div>
    </header>
  );

  const AdminHeader = ({ title }: { title: string }) => (
    <header className="flex items-center justify-between p-6 bg-black text-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {adminScreen !== 'dashboard' && (
          <button onClick={() => setAdminScreen('dashboard')} className="p-1"><ChevronLeft size={24} /></button>
        )}
        <h1 className="text-xl font-bold tracking-tight uppercase">{title}</h1>
      </div>
      <button onClick={() => { setRole('client'); setAdminScreen('dashboard'); }} className="p-2"><LogOut size={20} /></button>
    </header>
  );

  // --- CLIENT SCREENS ---
  const ClientView = () => (
    <div className="min-h-screen bg-white text-black font-sans">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen">
            <div className="bg-black p-10 pt-16 flex flex-col items-center text-center">
              <div className="mb-6 p-4 border-2 border-white rounded-full"><Scissors size={40} className="text-white" /></div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Zé Barbeiro</h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">The Gentleman's Choice</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <button onClick={() => setCurrentScreen('services')} className="aspect-square bg-black text-white rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl">
                <div className="p-4 bg-white/10 rounded-2xl"><LayoutGrid size={32} /></div>
                <span className="font-bold uppercase text-xs tracking-widest">Serviços</span>
              </button>
              <button onClick={() => setCurrentScreen('cart')} className="aspect-square bg-white text-black border-2 border-black rounded-3xl flex flex-col items-center justify-center gap-4 relative">
                <div className="p-4 bg-black/5 rounded-2xl"><ShoppingCart size={32} /></div>
                <span className="font-bold uppercase text-xs tracking-widest">Carrinho</span>
                {cart.length > 0 && <span className="absolute top-4 right-4 bg-black text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">{cart.length}</span>}
              </button>
              <button onClick={() => cart.length > 0 ? setCurrentScreen('datetime') : setCurrentScreen('services')} className="aspect-square bg-white text-black border-2 border-black rounded-3xl flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-black/5 rounded-2xl"><CalendarIcon size={32} /></div>
                <span className="font-bold uppercase text-xs tracking-widest">Agendar</span>
              </button>
              <button onClick={() => setCurrentScreen('my-appointments')} className="aspect-square bg-black text-white rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl">
                <div className="p-4 bg-white/10 rounded-2xl"><History size={32} /></div>
                <span className="font-bold uppercase text-xs tracking-widest">Histórico</span>
              </button>
            </div>

            <div className="p-6 mt-auto">
              <div className="p-6 bg-black/5 rounded-[32px] space-y-4">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-black/30">Onde estamos</h3>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <p className="text-sm font-medium">Rua dos Barbeiros, 123 - Centro, São Paulo</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="flex-shrink-0" />
                  <p className="text-sm font-medium">(11) 99999-9999</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentScreen === 'services' && (
          <motion.div key="services" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex flex-col min-h-screen bg-white">
            <ClientHeader title="Serviços" />
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {activeServices.map((service) => {
                const isInCart = cart.find(item => item.id === service.id);
                return (
                  <div key={service.id} className="flex items-center justify-between p-5 border border-black/10 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/5 rounded-2xl">{IconMap[service.iconName]}</div>
                      <div><h3 className="font-bold">{service.name}</h3><p className="text-xl font-black">R$ {service.price}</p></div>
                    </div>
                    <button onClick={() => isInCart ? setCart(cart.filter(i => i.id !== service.id)) : setCart([...cart, service])} className={`p-3 rounded-2xl ${isInCart ? 'bg-black text-white' : 'bg-black/5 text-black'}`}>
                      {isInCart ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-6 border-t border-black/5">
              <button onClick={() => setCurrentScreen('cart')} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                Ver Carrinho ({cart.length}) <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {currentScreen === 'cart' && (
          <motion.div key="cart" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex flex-col min-h-screen bg-white">
            <ClientHeader title="Carrinho" />
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-30"><ShoppingCart size={64} className="mb-4" /><p className="font-bold uppercase tracking-widest text-sm">Carrinho Vazio</p></div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-black/5 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl">{IconMap[item.iconName]}</div>
                      <div><h3 className="font-bold text-sm">{item.name}</h3><p className="font-black">R$ {item.price}</p></div>
                    </div>
                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="p-2 text-black/20 hover:text-black"><Trash2 size={20} /></button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-black/5 space-y-4">
                <div className="flex justify-between items-center px-2"><span className="text-black/40 font-bold uppercase text-xs tracking-widest">Total</span><span className="text-3xl font-black">R$ {cart.reduce((s, i) => s + i.price, 0)},00</span></div>
                <button onClick={() => setCurrentScreen('datetime')} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest">Agendar Horário</button>
              </div>
            )}
          </motion.div>
        )}

        {currentScreen === 'datetime' && (
          <motion.div key="datetime" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex flex-col min-h-screen bg-white">
            <ClientHeader title="Data e Horário" />
            <div className="p-6 flex-1 overflow-y-auto">
              <section className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Selecione a Data</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                    const date = new Date(); date.setDate(date.getDate() + i);
                    const dStr = date.toISOString().split('T')[0];
                    const isSelected = dStr === selectedDate;
                    return (
                      <button key={i} onClick={() => setSelectedDate(dStr)} className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-black text-white shadow-xl' : 'bg-black/5 text-black'}`}>
                        <span className="text-[10px] uppercase font-bold tracking-tighter mb-1 opacity-60">{date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                        <span className="text-xl font-black">{date.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Horários Disponíveis</h2>
                <div className="grid grid-cols-3 gap-3">
                  {DEFAULT_AVAILABLE_TIMES.map((time) => {
                    const isBlocked = blockedTimes.some(b => b.date === selectedDate && b.time === time);
                    const isTaken = appointments.some(a => a.date === selectedDate && a.time === time && a.status !== 'cancelled');
                    const isSelected = selectedTime === time;
                    return (
                      <button key={time} disabled={isBlocked || isTaken} onClick={() => setSelectedTime(time)} className={`py-3 rounded-xl font-bold transition-all ${(isBlocked || isTaken) ? 'opacity-20 cursor-not-allowed bg-black/5' : isSelected ? 'bg-black text-white shadow-lg' : 'bg-black/5 text-black hover:bg-black/10'}`}>
                        {time}
                      </button>
                    );
                  })}
                </div>
              </section>
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Suas Informações</h2>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Seu Nome" 
                    className="w-full p-4 bg-black/5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-black/10"
                    value={clientInfo.name}
                    onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                  />
                  <input 
                    type="tel" 
                    placeholder="Seu WhatsApp (opcional)" 
                    className="w-full p-4 bg-black/5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-black/10"
                    value={clientInfo.phone}
                    onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  />
                </div>
              </section>
            </div>
            <div className="p-6 bg-white border-t border-black/5">
              <button disabled={!selectedTime || !clientInfo.name} onClick={handleConfirmBooking} className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all ${selectedTime && clientInfo.name ? 'bg-black text-white shadow-xl' : 'bg-black/10 text-black/30 cursor-not-allowed'}`}>Confirmar Agendamento</button>
            </div>
          </motion.div>
        )}

        {currentScreen === 'confirmation' && (
          <motion.div key="confirmation" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="mb-8 text-black"><CheckCircle2 size={80} strokeWidth={1.5} /></div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Confirmado!</h1>
            <p className="text-black/50 mb-8">Seu agendamento foi realizado com sucesso.</p>
            <button onClick={resetBooking} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest shadow-xl">Voltar para o Início</button>
          </motion.div>
        )}

        {currentScreen === 'my-appointments' && (
          <motion.div key="my-appointments" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="flex flex-col min-h-screen bg-white">
            <ClientHeader title="Histórico" />
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-20"><History size={64} className="mb-4" /><p className="font-bold uppercase tracking-widest text-sm">Sem Histórico</p></div>
              ) : (
                appointments.map((app) => (
                  <div key={app.id} className="p-6 border-2 border-black/5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div><p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1">Agendamento</p><h3 className="font-bold">{new Date(app.date).toLocaleDateString('pt-BR')} às {app.time}</h3></div>
                      <span className="text-xl font-black">R$ {app.totalPrice}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">{app.services.map(s => <span key={s.id} className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">{s.name}</span>)}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${app.status === 'completed' ? 'text-green-600' : app.status === 'cancelled' ? 'text-red-600' : 'text-black/40'}`}>{app.status}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // --- ADMIN SCREENS ---
  const AdminView = () => (
    <div className="min-h-screen bg-white text-black font-sans">
      <AnimatePresence mode="wait">
        <div className="flex flex-col min-h-screen">
            {adminScreen === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen">
                <AdminHeader title="Painel Admin" />
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black text-white p-6 rounded-3xl">
                      <CalendarIcon size={24} className="mb-2 opacity-50" />
                      <p className="text-3xl font-black">{todayAppointments.length}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Hoje</p>
                    </div>
                    <div className="bg-black/5 p-6 rounded-3xl">
                      <DollarSign size={24} className="mb-2 opacity-50" />
                      <p className="text-3xl font-black">R$ {todayAppointments.reduce((s, a) => s + a.totalPrice, 0)}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Receita Hoje</p>
                    </div>
                  </div>
                  <div className="bg-black text-white p-6 rounded-3xl">
                    <p className="text-4xl font-black">R$ {appointments.filter(a => a.status === 'completed').reduce((s, a) => s + a.totalPrice, 0)}</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Receita Total Acumulada</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setAdminScreen('appointments')} className="p-6 border-2 border-black rounded-3xl flex flex-col items-center gap-2">
                      <Clock size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Agendamentos</span>
                    </button>
                    <button onClick={() => setAdminScreen('services')} className="p-6 border-2 border-black rounded-3xl flex flex-col items-center gap-2">
                      <LayoutGrid size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Serviços</span>
                    </button>
                    <button onClick={() => setAdminScreen('times')} className="p-6 border-2 border-black rounded-3xl flex flex-col items-center gap-2">
                      <CalendarIcon size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Horários</span>
                    </button>
                    <button onClick={() => setAdminScreen('clients')} className="p-6 border-2 border-black rounded-3xl flex flex-col items-center gap-2">
                      <Users size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Clientes</span>
                    </button>
                  </div>
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Próximos Clientes</h2>
                    <div className="space-y-3">
                      {todayAppointments.slice(0, 3).map(app => (
                        <div key={app.id} className="p-4 bg-black/5 rounded-2xl flex justify-between items-center">
                          <div><p className="font-bold">{app.time}</p><p className="text-xs text-black/40">{app.services[0].name}</p></div>
                          <span className="text-xs font-bold uppercase tracking-widest">Pendente</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {adminScreen === 'services' && (
              <motion.div key="admin-services" initial={{ x: '100%' }} animate={{ x: 0 }} className="flex flex-col min-h-screen">
                <AdminHeader title="Serviços" />
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  {services.map(s => (
                    <div key={s.id} className="p-4 border border-black/10 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-black/5 rounded-xl">{IconMap[s.iconName]}</div>
                        <div><p className="font-bold">{s.name}</p><p className="text-xs text-black/40">R$ {s.price}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingService(s)} className="p-2 bg-black/5 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => setServices(services.map(item => item.id === s.id ? {...item, isActive: !item.isActive} : item))} className={`p-2 rounded-lg ${s.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {s.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setEditingService({ id: Math.random().toString(36).substr(2, 9), name: '', price: 0, duration: 30, description: '', iconName: 'Scissors', isActive: true })} className="w-full py-4 border-2 border-dashed border-black/20 rounded-2xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2"><Plus size={16} /> Novo Serviço</button>
                </div>
                {editingService && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="w-full bg-white rounded-t-[40px] p-8 space-y-6">
                      <div className="flex justify-between items-center"><h2 className="text-xl font-black uppercase tracking-tighter">Editar Serviço</h2><button onClick={() => setEditingService(null)}><X size={24} /></button></div>
                      <input type="text" placeholder="Nome" className="w-full p-4 bg-black/5 rounded-2xl font-bold" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} />
                      <input type="number" placeholder="Preço" className="w-full p-4 bg-black/5 rounded-2xl font-bold" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} />
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {IconOptions.map(icon => (
                          <button key={icon} onClick={() => setEditingService({...editingService, iconName: icon})} className={`p-4 rounded-2xl ${editingService.iconName === icon ? 'bg-black text-white' : 'bg-black/5'}`}>{IconMap[icon]}</button>
                        ))}
                      </div>
                      <button onClick={() => {
                        const exists = services.find(s => s.id === editingService.id);
                        if (exists) setServices(services.map(s => s.id === editingService.id ? editingService : s));
                        else setServices([...services, editingService]);
                        setEditingService(null);
                      }} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Save size={18} /> Salvar</button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {adminScreen === 'appointments' && (
              <motion.div key="admin-appointments" initial={{ x: '100%' }} animate={{ x: 0 }} className="flex flex-col min-h-screen">
                <AdminHeader title="Agendamentos" />
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  {appointments.map(app => (
                    <div key={app.id} className={`p-5 border rounded-3xl space-y-4 ${app.status === 'cancelled' ? 'opacity-40 bg-black/5' : 'border-black/10'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-black/30">{new Date(app.date).toLocaleDateString('pt-BR')}</p>
                          <h3 className="font-bold text-lg">{app.time} - {app.clientName}</h3>
                          {app.clientPhone && <p className="text-xs text-black/50 flex items-center gap-1"><Phone size={10} /> {app.clientPhone}</p>}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-black">R$ {app.totalPrice}</span>
                          <button onClick={() => {
                            if (confirm('Deseja excluir permanentemente este agendamento?')) {
                              setAppointments(appointments.filter(a => a.id !== app.id));
                            }
                          }} className="mt-2 text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">{app.services.map(s => <span key={s.id} className="px-2 py-1 bg-black/5 text-[10px] font-bold rounded-md uppercase">{s.name}</span>)}</div>
                      {app.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setAppointments(appointments.map(a => a.id === app.id ? {...a, status: 'completed'} : a))} className="flex-1 bg-black text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">Concluir</button>
                          <button onClick={() => setAppointments(appointments.map(a => a.id === app.id ? {...a, status: 'cancelled'} : a))} className="flex-1 border border-black py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">Cancelar</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[50vh] opacity-20">
                      <CalendarIcon size={48} className="mb-2" />
                      <p className="font-bold uppercase text-xs tracking-widest">Nenhum agendamento</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {adminScreen === 'times' && (
              <motion.div key="admin-times" initial={{ x: '100%' }} animate={{ x: 0 }} className="flex flex-col min-h-screen">
                <AdminHeader title="Horários" />
                <div className="p-6 space-y-6">
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                      const date = new Date(); date.setDate(date.getDate() + i);
                      const dStr = date.toISOString().split('T')[0];
                      return (
                        <button key={i} onClick={() => setSelectedDate(dStr)} className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${selectedDate === dStr ? 'bg-black text-white shadow-xl' : 'bg-black/5 text-black'}`}>
                          <span className="text-[10px] uppercase font-bold tracking-tighter mb-1 opacity-60">{date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                          <span className="text-xl font-black">{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {DEFAULT_AVAILABLE_TIMES.map(time => {
                      const isBlocked = blockedTimes.some(b => b.date === selectedDate && b.time === time);
                      return (
                        <button key={time} onClick={() => {
                          if (isBlocked) setBlockedTimes(blockedTimes.filter(b => !(b.date === selectedDate && b.time === time)));
                          else setBlockedTimes([...blockedTimes, { date: selectedDate, time }]);
                        }} className={`py-3 rounded-xl font-bold transition-all ${isBlocked ? 'bg-red-500 text-white' : 'bg-black/5 text-black'}`}>
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest text-center">Toque para bloquear/desbloquear horários</p>
                </div>
              </motion.div>
            )}

            {adminScreen === 'clients' && (
              <motion.div key="admin-clients" initial={{ x: '100%' }} animate={{ x: 0 }} className="flex flex-col min-h-screen">
                <AdminHeader title="Clientes" />
                <div className="p-6 space-y-4">
                  {Array.from(new Set(appointments.map(a => a.clientName))).map(client => (
                    <div key={client} className="p-5 bg-black/5 rounded-3xl flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-black text-white rounded-full"><Users size={20} /></div>
                        <div><p className="font-bold">{client}</p><p className="text-xs text-black/40">{appointments.filter(a => a.clientName === client).length} agendamentos</p></div>
                      </div>
                      <button className="p-2 opacity-20"><ArrowRight size={20} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
        </div>
      </AnimatePresence>
    </div>
  );

  return role === 'client' ? <ClientView /> : <AdminView />;
}
