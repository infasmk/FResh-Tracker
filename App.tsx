
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, TrendingUp, TrendingDown, Users, CreditCard, 
  BarChart3, Menu, X, Plus, Bell, Trash2, Pencil, Calendar, 
  AlertCircle, Clock, ChevronRight, HandCoins, History, Check, 
  CalendarRange, Lock, User, LogOut, Hotel, Cloud, CloudOff, RefreshCw,
  Wallet, UserPlus, Save
} from 'lucide-react';
import { 
  IncomeEntry, ExpenseEntry, Staff, AttendanceRecord, SalaryPayment, 
  CreditRecord, View, IncomeSource, ExpenseCategory, AttendanceStatus 
} from './types';
import { formatCurrency, getCurrentDate, getMonthYear } from './constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';

// --- Supabase Config ---
const supabaseUrl = 'https://prwlghexhsmnhbgycray.supabase.co';
const supabaseKey = 'sb_publishable_-vYJ2KWKmomazN-uXzhteg_CAm8OOw2';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Shared UI Components ---

// Fix: Added Modal component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

// Fix: Added DateSelector component
const DateSelector = ({ value, onChange, onResetToday }: any) => (
  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
      <input 
        type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-transparent pl-9 pr-3 py-1.5 text-xs font-black outline-none"
      />
    </div>
    <button onClick={onResetToday} className="px-3 py-1.5 bg-white text-[10px] font-black uppercase rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
      Today
    </button>
  </div>
);

// Fix: Added ConfirmDialog component
const ConfirmDialog = ({ isOpen, onClose, title, message, onConfirm, type = 'danger' }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 p-8 text-center animate-in zoom-in-95">
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-black mb-2">{title}</h3>
        <p className="text-slate-500 font-bold text-sm mb-8">{message}</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-4 rounded-xl font-black text-sm bg-slate-100 text-slate-600">Cancel</button>
          <button onClick={onConfirm} className={`py-4 rounded-xl font-black text-sm text-white ${type === 'danger' ? 'bg-red-600' : 'bg-blue-600'}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

// --- Auth Component ---
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const REQUIRED_PASSWORD = "fb@5star";
    setTimeout(() => {
      if (password.trim() === REQUIRED_PASSWORD) onLogin();
      else { setError('Access Denied'); setLoading(false); }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-transparent to-orange-100/40 opacity-50"></div>
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-2xl text-white mb-6">
            <Hotel size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">HotelFlow</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Enterprise Resource Access</p>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest text-center">System Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-12 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-center text-xl tracking-[0.2em]" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center animate-in shake">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
              {loading ? 'Authenticating...' : 'Unlock System'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('hf_auth') === 'true');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
  const [credits, setCredits] = useState<CreditRecord[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setDbStatus('loading');
    try {
      const [inc, exp, stf, att, sal, cre] = await Promise.all([
        supabase.from('income').select('*').eq('is_deleted', false).order('date', { ascending: false }),
        supabase.from('expenses').select('*').eq('is_deleted', false).order('date', { ascending: false }),
        supabase.from('staff').select('*').eq('is_deleted', false).order('name', { ascending: true }),
        supabase.from('attendance').select('*'),
        supabase.from('salary_payments').select('*'),
        supabase.from('credits').select('*').eq('is_deleted', false),
      ]);
      if (inc.error || exp.error || stf.error) setDbStatus('error'); else setDbStatus('connected');
      if (inc.data) setIncome(inc.data);
      if (exp.data) setExpenses(exp.data);
      if (stf.data) setStaff(stf.data.map(s => ({ ...s, monthlySalary: s.monthly_salary })));
      if (att.data) setAttendance(att.data.map(a => ({ ...a, staffId: a.staff_id })));
      if (sal.data) setSalaryPayments(sal.data.map(s => ({ ...s, staffId: s.staff_id })));
      if (cre.data) setCredits(cre.data.map(c => ({ ...c, customerName: c.customer_name, dueDate: c.due_date })));
    } catch (err) { setDbStatus('error'); } finally { setLoading(false); }
  };

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const triggerConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'info' = 'danger') => {
    setConfirmConfig({ title, message, onConfirm: () => { onConfirm(); setConfirmConfig(null); }, type });
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => { setIsAuthenticated(true); localStorage.setItem('hf_auth', 'true'); }} />;

  const SidebarItem = ({ view, icon: Icon, label, badge }: any) => (
    <button onClick={() => { setActiveView(view); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeView === view ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3"><Icon size={20} /><span className="font-bold">{label}</span></div>
      {badge > 0 && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeView === view ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="bg-blue-600 p-2 rounded-xl text-white"><Hotel size={20} /></div>
              <span className="text-xl font-black tracking-tighter text-slate-900">HotelFlow</span>
            </div>
            <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
          </div>
          <nav className="space-y-1 flex-1 overflow-y-auto pr-2">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="reminders" icon={Bell} label="Reminders" badge={credits.filter(c => c.status === 'Pending' && c.dueDate && c.dueDate < getCurrentDate()).length} />
            <div className="h-px bg-slate-100 my-4"></div>
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff & Pay" />
            <SidebarItem view="credit" icon={CreditCard} label="Credits" />
            <SidebarItem view="reports" icon={BarChart3} label="Insights" />
          </nav>
          <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('hf_auth'); }} className="mt-auto flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0">
          <button className="lg:hidden p-3 bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:block"><ConnectionBadge status={dbStatus} /></div>
            <DateSelector value={selectedDate} onChange={setSelectedDate} onResetToday={() => setSelectedDate(getCurrentDate())} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <>
                {activeView === 'dashboard' && <DashboardView income={income} expenses={expenses} staff={staff} attendance={attendance} selectedDate={selectedDate} />}
                {activeView === 'income' && <IncomeView income={income} refresh={fetchData} selectedDate={selectedDate} triggerConfirm={triggerConfirm} />}
                {activeView === 'expenses' && <ExpenseView expenses={expenses} refresh={fetchData} selectedDate={selectedDate} triggerConfirm={triggerConfirm} />}
                {activeView === 'staff' && <StaffView staff={staff} attendance={attendance} salaryPayments={salaryPayments} refresh={fetchData} selectedDate={selectedDate} triggerConfirm={triggerConfirm} />}
                {activeView === 'credit' && <CreditView credits={credits} refresh={fetchData} triggerConfirm={triggerConfirm} />}
                {activeView === 'reports' && <ReportsView income={income} expenses={expenses} />}
                {activeView === 'reminders' && <RemindersView credits={credits} refresh={fetchData} />}
              </>
            )}
          </div>
        </div>
      </main>
      
      {confirmConfig && (
        <ConfirmDialog isOpen={true} onClose={() => setConfirmConfig(null)} {...confirmConfig} />
      )}
    </div>
  );
};

// --- View Components ---

const DashboardView = ({ income, expenses, staff, attendance, selectedDate }: any) => {
  const stats = useMemo(() => {
    const inc = income.filter((i: any) => i.date === selectedDate).reduce((s: number, i: any) => s + i.amount, 0);
    const exp = expenses.filter((e: any) => e.date === selectedDate).reduce((s: number, e: any) => s + e.amount, 0);
    const pres = attendance.filter((a: any) => a.date === selectedDate && a.status === AttendanceStatus.PRESENT).length;
    return { inc, exp, pres, total: staff.length };
  }, [income, expenses, attendance, staff, selectedDate]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in slide-in-from-bottom-4">
      <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
        <TrendingUp className="mb-4" size={28} />
        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Today's Income</p>
        <h3 className="text-3xl font-black">{formatCurrency(stats.inc)}</h3>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm">
        <TrendingDown className="text-orange-500 mb-4" size={28} />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Today's Expense</p>
        <h3 className="text-3xl font-black">{formatCurrency(stats.exp)}</h3>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm">
        <Users className="text-emerald-500 mb-4" size={28} />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Attendance</p>
        <h3 className="text-3xl font-black">{stats.pres} <span className="text-sm text-slate-300">/ {stats.total}</span></h3>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm">
        <CreditCard className="text-red-500 mb-4" size={28} />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Net Cash</p>
        <h3 className={`text-3xl font-black ${stats.inc - stats.exp >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(stats.inc - stats.exp)}</h3>
      </div>
    </div>
  );
};

const IncomeView = ({ income, refresh, selectedDate, triggerConfirm }: any) => {
  const [modal, setModal] = useState<any>(null);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { date: modal.data.date, source: modal.data.source, amount: parseFloat(modal.data.amount), description: modal.data.description };
    if (modal.type === 'edit') {
      await supabase.from('income').update(payload).eq('id', modal.data.id);
    } else {
      await supabase.from('income').insert(payload);
    }
    setModal(null); refresh();
  };

  const dayData = income.filter((i: any) => i.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black">Income Records</h1>
        <button onClick={() => setModal({ type: 'add', data: { date: selectedDate, source: IncomeSource.RESTAURANT, amount: '', description: '' }})} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg">
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="p-6">Source</th>
                <th className="p-6 hidden md:table-cell">Description</th>
                <th className="p-6">Amount</th>
                <th className="p-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dayData.map((i: any) => (
                <tr key={i.id} className="border-b last:border-0 hover:bg-slate-50/40">
                  <td className="p-6 font-bold">{i.source}</td>
                  <td className="p-6 hidden md:table-cell text-slate-400 text-sm italic">{i.description || '—'}</td>
                  <td className="p-6 font-black text-lg">{formatCurrency(i.amount)}</td>
                  <td className="p-6 flex items-center justify-center gap-3">
                    <button onClick={() => setModal({ type: 'edit', data: i })} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => triggerConfirm('Delete Entry', 'Are you sure?', async () => { await supabase.from('income').update({ is_deleted: true }).eq('id', i.id); refresh(); })} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {dayData.length === 0 && (
                <tr><td colSpan={4} className="p-16 text-center text-slate-300 font-bold italic">No records for this date</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.type === 'edit' ? 'Edit Revenue' : 'Add Revenue'}>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Category Source</label>
            <select value={modal?.data?.source} onChange={e => setModal({...modal, data: {...modal.data, source: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50 outline-none focus:border-blue-500">
              {Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
            <input type="text" value={modal?.data?.description} onChange={e => setModal({...modal, data: {...modal.data, description: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" placeholder="Notes..." />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Total Amount</label>
            <input type="number" required value={modal?.data?.amount} onChange={e => setModal({...modal, data: {...modal.data, amount: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-3xl bg-slate-50" placeholder="0.00" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Save size={20} /> {modal?.type === 'edit' ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

const ExpenseView = ({ expenses, refresh, selectedDate, triggerConfirm }: any) => {
  const [modal, setModal] = useState<any>(null);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { date: modal.data.date, category: modal.data.category, amount: parseFloat(modal.data.amount), description: modal.data.description };
    if (modal.type === 'edit') {
      await supabase.from('expenses').update(payload).eq('id', modal.data.id);
    } else {
      await supabase.from('expenses').insert(payload);
    }
    setModal(null); refresh();
  };

  const dayData = expenses.filter((e: any) => e.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black">Daily Expenses</h1>
        <button onClick={() => setModal({ type: 'add', data: { date: selectedDate, category: ExpenseCategory.GROCERIES, amount: '', description: '' }})} className="w-full sm:w-auto bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg">
          <Plus size={18} /> New Expense
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="p-6">Category</th>
                <th className="p-6 hidden md:table-cell">Description</th>
                <th className="p-6">Amount</th>
                <th className="p-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dayData.map((e: any) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-slate-50/40">
                  <td className="p-6 font-bold">{e.category}</td>
                  <td className="p-6 hidden md:table-cell text-slate-400 text-sm italic">{e.description || '—'}</td>
                  <td className="p-6 font-black text-lg text-orange-600">{formatCurrency(e.amount)}</td>
                  <td className="p-6 flex items-center justify-center gap-3">
                    <button onClick={() => setModal({ type: 'edit', data: e })} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => triggerConfirm('Delete Expense', 'Remove this expense?', async () => { await supabase.from('expenses').update({ is_deleted: true }).eq('id', e.id); refresh(); })} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {dayData.length === 0 && (
                <tr><td colSpan={4} className="p-16 text-center text-slate-300 font-bold italic">No expenses logged for today</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.type === 'edit' ? 'Edit Expense' : 'New Expense'}>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
            <select value={modal?.data?.category} onChange={e => setModal({...modal, data: {...modal.data, category: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50">
              {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
            <input type="text" value={modal?.data?.description} onChange={e => setModal({...modal, data: {...modal.data, description: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" placeholder="Optional notes..." />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Amount</label>
            <input type="number" required value={modal?.data?.amount} onChange={e => setModal({...modal, data: {...modal.data, amount: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-3xl bg-slate-50" placeholder="0.00" />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
            <Save size={20} /> {modal?.type === 'edit' ? 'Update Expense' : 'Save Expense'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

const StaffView = ({ staff, attendance, salaryPayments, refresh, selectedDate, triggerConfirm }: any) => {
  const [tab, setTab] = useState<'roster' | 'payroll' | 'staff'>('roster');
  const [modal, setModal] = useState<any>(null);
  const [payData, setPayData] = useState({ amount: '', type: 'Salary' as 'Salary' | 'Advance' });

  const toggleAtt = async (sId: string) => {
    const rec = attendance.find((a: any) => a.staffId === sId && a.date === selectedDate);
    if (rec) await supabase.from('attendance').update({ status: rec.status === AttendanceStatus.PRESENT ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT }).eq('id', rec.id);
    else await supabase.from('attendance').insert({ staff_id: sId, date: selectedDate, status: AttendanceStatus.PRESENT });
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff & Payroll</h1>
        <div className="flex w-full md:w-auto bg-white p-1 rounded-2xl border shadow-sm overflow-x-auto no-scrollbar">
          <button onClick={() => setTab('roster')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${tab === 'roster' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Roster</button>
          <button onClick={() => setTab('payroll')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${tab === 'payroll' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Payroll</button>
          <button onClick={() => setTab('staff')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${tab === 'staff' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Staff List</button>
        </div>
      </div>

      {tab === 'roster' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s: any) => {
            const rec = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
            const isP = rec?.status === AttendanceStatus.PRESENT;
            return (
              <button key={s.id} onClick={() => toggleAtt(s.id)} className={`p-6 rounded-[2.5rem] border-2 text-left transition-all ${isP ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-blue-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-lg">{s.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.role}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${isP ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                    {isP ? <Check size={20} /> : <Clock size={20} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === 'payroll' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staff.map((s: any) => {
            const myPays = salaryPayments.filter((p: any) => p.staffId === s.id && getMonthYear(p.date) === getMonthYear(selectedDate));
            const sal = myPays.filter(p => p.type === 'Salary').reduce((a, b) => a + b.amount, 0);
            const adv = myPays.filter(p => p.type === 'Advance').reduce((a, b) => a + b.amount, 0);
            const rem = s.monthlySalary - sal - adv;
            return (
              <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black">{s.name}</h4>
                    <p className="text-xs text-slate-400 font-bold">{s.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Base Salary</p>
                    <p className="font-black text-lg">{formatCurrency(s.monthlySalary)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Paid</p>
                    <p className="font-black text-blue-600">{formatCurrency(sal)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Adv.</p>
                    <p className="font-black text-orange-600">{formatCurrency(adv)}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${rem <= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rem.</p>
                    <p className={`font-black ${rem <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(rem)}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal({ type: 'pay', staff: s })} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-black transition-all">
                    <Wallet size={18} /> Pay Staff
                  </button>
                  <button onClick={() => setModal({ type: 'history', staff: s })} className="p-4 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
                    <History size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'staff' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setModal({ type: 'add_staff', data: { name: '', role: '', salary: '' }})} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg">
              <UserPlus size={18} /> Add New Employee
            </button>
          </div>
          <div className="bg-white rounded-[2.5rem] border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase">
                  <tr>
                    <th className="p-6">Employee</th>
                    <th className="p-6">Role</th>
                    <th className="p-6">Base Salary</th>
                    <th className="p-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s: any) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50/40">
                      <td className="p-6 font-black text-lg">{s.name}</td>
                      <td className="p-6 font-bold text-slate-500">{s.role}</td>
                      <td className="p-6 font-black">{formatCurrency(s.monthlySalary)}</td>
                      <td className="p-6 text-center">
                        <button onClick={() => triggerConfirm('Delete Staff', `Remove profile for ${s.name}?`, async () => { await supabase.from('staff').update({ is_deleted: true }).eq('id', s.id); refresh(); })} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={modal?.type === 'add_staff'} onClose={() => setModal(null)} title="New Staff Profile">
        <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('staff').insert({ name: modal.data.name, role: modal.data.role, monthly_salary: parseFloat(modal.data.salary) }); setModal(null); refresh(); }} className="space-y-4">
          <input type="text" required placeholder="Full Name" value={modal?.data?.name} onChange={e => setModal({...modal, data: {...modal.data, name: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
          <input type="text" required placeholder="Role (e.g. Chef, Waiter)" value={modal?.data?.role} onChange={e => setModal({...modal, data: {...modal.data, role: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
          <input type="number" required placeholder="Monthly Base Salary" value={modal?.data?.salary} onChange={e => setModal({...modal, data: {...modal.data, salary: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-2xl bg-slate-50" />
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">Register Employee</button>
        </form>
      </Modal>

      <Modal isOpen={modal?.type === 'pay'} onClose={() => setModal(null)} title={`Pay ${modal?.staff?.name}`}>
        <div className="space-y-6">
          <div className="flex bg-slate-50 p-1 rounded-2xl border">
            <button onClick={() => setPayData({...payData, type: 'Salary'})} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${payData.type === 'Salary' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Salary Payment</button>
            <button onClick={() => setPayData({...payData, type: 'Advance'})} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${payData.type === 'Advance' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Salary Advance</button>
          </div>
          <input type="number" value={payData.amount} onChange={e => setPayData({...payData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-5 rounded-3xl font-black text-4xl text-center bg-slate-50" placeholder="₹ Amount" />
          <button onClick={async () => {
             const amt = parseFloat(payData.amount);
             if (!amt || isNaN(amt)) return;
             await supabase.from('salary_payments').insert({ staff_id: modal.staff.id, date: selectedDate, amount: amt, type: payData.type });
             await supabase.from('expenses').insert({ date: selectedDate, category: ExpenseCategory.OTHER, amount: amt, description: `[${payData.type}] ${modal.staff.name}` });
             setModal(null); setPayData({ amount: '', type: 'Salary' }); refresh();
          }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">Confirm Payout</button>
        </div>
      </Modal>

      <Modal isOpen={modal?.type === 'history'} onClose={() => setModal(null)} title={`${modal?.staff?.name} Activity`}>
        {modal?.staff && (
          <div className="space-y-8">
            <section>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Attendance (This Month)</h5>
              <div className="flex flex-wrap gap-2">
                {attendance.filter((a: any) => a.staffId === modal.staff.id && getMonthYear(a.date) === getMonthYear(selectedDate)).map((a: any) => (
                  <div key={a.id} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${a.status === AttendanceStatus.PRESENT ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {new Date(a.date).getDate()}
                  </div>
                ))}
                {attendance.filter((a: any) => a.staffId === modal.staff.id && getMonthYear(a.date) === getMonthYear(selectedDate)).length === 0 && (
                  <p className="text-sm text-slate-300 italic">No attendance records this month</p>
                )}
              </div>
            </section>
            <section>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Logs</h5>
              <div className="space-y-3">
                {salaryPayments.filter((p: any) => p.staffId === modal.staff.id && getMonthYear(p.date) === getMonthYear(selectedDate)).map((p: any) => (
                  <div key={p.id} className="flex justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                    <div>
                      <p className={`font-black text-sm ${p.type === 'Salary' ? 'text-blue-600' : 'text-orange-600'}`}>{p.type}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.date}</p>
                    </div>
                    <p className="font-black text-lg">{formatCurrency(p.amount)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
};

const CreditView = ({ credits, refresh, triggerConfirm }: any) => {
  const [modal, setModal] = useState<any>(null);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('credits').insert({ customer_name: modal.data.customerName, phone: modal.data.phone, amount: parseFloat(modal.data.amount), due_date: modal.data.dueDate, status: 'Pending' });
    setModal(null); refresh();
  };

  const pendingCredits = credits.filter((c: any) => c.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black">Customer Credits</h1>
        <button onClick={() => setModal({ type: 'add', data: { customerName: '', phone: '', amount: '', dueDate: getCurrentDate() }})} className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg">
          <Plus size={18} /> New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingCredits.map((c: any) => (
          <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group space-y-4">
            <div>
              <h3 className="font-black text-xl text-slate-900">{c.customerName}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.phone || 'No phone'}</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{formatCurrency(c.amount)}</p>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs text-red-500 font-bold flex items-center gap-2"><Clock size={14}/> {c.dueDate}</span>
              <button onClick={() => triggerConfirm('Settle Credit', `Record payment for ${c.customerName}?`, async () => { 
                await supabase.from('credits').update({ status: 'Paid' }).eq('id', c.id); 
                await supabase.from('income').insert({ date: getCurrentDate(), source: IncomeSource.OTHER, amount: c.amount, description: `[Credit Settled] ${c.customerName}` }); 
                refresh(); 
              }, 'info')} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg">Settle</button>
            </div>
          </div>
        ))}
        {pendingCredits.length === 0 && <p className="col-span-full py-20 text-center text-slate-300 font-bold italic">No active credits</p>}
      </div>

      <Modal isOpen={modal?.type === 'add'} onClose={() => setModal(null)} title="Open New Credit">
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" required placeholder="Customer Name" value={modal?.data?.customerName} onChange={e => setModal({...modal, data: {...modal.data, customerName: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
          <input type="text" placeholder="Phone Number" value={modal?.data?.phone} onChange={e => setModal({...modal, data: {...modal.data, phone: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
          <input type="number" required placeholder="Amount Due" value={modal?.data?.amount} onChange={e => setModal({...modal, data: {...modal.data, amount: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-2xl bg-slate-50" />
          <input type="date" value={modal?.data?.dueDate} onChange={e => setModal({...modal, data: {...modal.data, dueDate: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
          <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg">Save Ledger</button>
        </form>
      </Modal>
    </div>
  );
};

const ReportsView = ({ income, expenses }: any) => {
  const data = useMemo(() => {
    const list = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i); const my = getMonthYear(d.toISOString().split('T')[0]);
      const inc = income.filter((x: any) => getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      const exp = expenses.filter((x: any) => getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      list.push({ name: d.toLocaleDateString('en-US', { month: 'short' }), income: inc, expense: exp });
    }
    return list;
  }, [income, expenses]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Financial Insights</h1>
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border shadow-sm min-h-[450px]">
        <h3 className="text-lg font-black mb-10 tracking-tight text-slate-400 uppercase text-[10px]">Monthly Velocity</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const RemindersView = ({ credits }: any) => {
  const overdue = credits.filter((c: any) => c.status === 'Pending' && c.dueDate && c.dueDate < getCurrentDate());
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-red-600">Urgent Alerts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-red-50 space-y-6">
          <h4 className="font-black text-xl flex items-center gap-2"><Bell className="text-red-500" size={20}/> Overdue Credits</h4>
          <div className="space-y-3">
            {overdue.map((c: any) => (
              <div key={c.id} className="flex justify-between p-5 bg-red-50/20 rounded-2xl border border-red-100">
                <div><p className="font-black">{c.customerName}</p><p className="text-xs text-red-400 font-bold">Lapsed on {c.dueDate}</p></div>
                <p className="font-black text-lg text-red-600">{formatCurrency(c.amount)}</p>
              </div>
            ))}
            {overdue.length === 0 && <p className="text-center text-slate-300 italic py-10">No pending alerts</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Badge ---
const ConnectionBadge = ({ status }: { status: 'loading' | 'connected' | 'error' }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-500 ${
    status === 'connected' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
    status === 'error' ? 'bg-red-50 border-red-100 text-red-600' :
    'bg-slate-50 border-slate-100 text-slate-400'
  }`}>
    {status === 'loading' && <RefreshCw size={12} className="animate-spin" />}
    {status === 'connected' && <Check size={12} />}
    {status === 'error' && <CloudOff size={12} />}
    {status}
  </div>
);

export default App;
