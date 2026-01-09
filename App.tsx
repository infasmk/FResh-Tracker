
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, TrendingUp, TrendingDown, Users, CreditCard, 
  BarChart3, Menu, X, Plus, Bell, Trash2, Pencil, Calendar, 
  AlertCircle, Clock, ChevronRight, HandCoins, History, Check, 
  CalendarRange, Lock, User, LogOut, Hotel, Cloud, CloudOff, RefreshCw,
  Wallet, UserPlus
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

// --- Auth Component ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanPassword = password.trim();
    const REQUIRED_PASSWORD = "fb@5star";
    setTimeout(() => {
      if (cleanPassword === REQUIRED_PASSWORD) onLogin();
      else { setError('Incorrect Access Password'); setLoading(false); }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2.5rem] shadow-2xl text-white mb-6">
            <Hotel size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">HotelFlow</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Secure Access Required</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest text-center">Enter Access PIN</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={20} />
                <input 
                  type="password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-12 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-center text-xl tracking-[0.3em]" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-3 animate-in shake"><AlertCircle size={16} />{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl hover:bg-blue-700 active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3">
              {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Verifying...</> : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Connection Badge ---
const ConnectionBadge = ({ status }: { status: 'loading' | 'connected' | 'error' }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-500 ${
    status === 'connected' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
    status === 'error' ? 'bg-red-50 border-red-100 text-red-600' :
    'bg-slate-50 border-slate-100 text-slate-400'
  }`}>
    {status === 'loading' && <RefreshCw size={12} className="animate-spin" />}
    {status === 'connected' && <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>Cloud Sync</>}
    {status === 'error' && <><CloudOff size={12} /> Offline</>}
  </div>
);

// --- Reusable UI Parts ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={20} /></button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="text-center mb-8">
      <div className={`w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
        <AlertCircle size={32} />
      </div>
      <p className="text-slate-600 font-medium leading-relaxed">{message}</p>
    </div>
    <div className="flex gap-3">
      <button onClick={onClose} className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-slate-100 font-bold text-slate-500">Cancel</button>
      <button onClick={onConfirm} className={`flex-1 px-4 py-3.5 rounded-2xl font-black text-white shadow-lg ${type === 'danger' ? 'bg-red-600' : 'bg-blue-600'}`}>Confirm</button>
    </div>
  </Modal>
);

const DateSelector = ({ value, onChange, label, onResetToday }: any) => (
  <div className="flex items-center gap-2">
    <div className="group flex items-center gap-3 bg-white border-2 border-slate-200 px-4 py-2 rounded-2xl shadow-sm focus-within:border-blue-500 transition-all">
      <div className="flex flex-col">
        {label && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" />
          <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer" />
        </div>
      </div>
    </div>
    {onResetToday && <button onClick={onResetToday} className="p-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><CalendarRange size={20} /></button>}
  </div>
);

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
    <button onClick={() => { setActiveView(view); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeView === view ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
      <div className="flex items-center gap-3"><Icon size={20} /><span className="font-bold">{label}</span></div>
      {badge > 0 && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeView === view ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 text-blue-600 mb-12 px-2"><div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100"><Hotel className="text-white" size={24} /></div><span className="text-2xl font-black tracking-tighter text-slate-900">HotelFlow</span></div>
          <nav className="space-y-2 flex-1">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="reminders" icon={Bell} label="Reminders" badge={credits.filter(c => c.status === 'Pending' && c.dueDate && c.dueDate < getCurrentDate()).length} />
            <div className="py-4 border-b border-slate-50"></div>
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff & Pay" />
            <SidebarItem view="credit" icon={CreditCard} label="Credits" />
            <SidebarItem view="reports" icon={BarChart3} label="Insights" />
          </nav>
          <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('hf_auth'); }} className="mt-10 flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <button className="lg:hidden p-3 bg-white border rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex items-center gap-6 ml-auto"><ConnectionBadge status={dbStatus} /><DateSelector value={selectedDate} onChange={setSelectedDate} label="Working Date" onResetToday={() => setSelectedDate(getCurrentDate())} /></div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div><p className="font-black text-slate-400 text-sm tracking-widest">LOADING CLOUD DATA...</p></div>
          ) : (
            <>
              {activeView === 'dashboard' && <DashboardView income={income} expenses={expenses} credits={credits} staff={staff} attendance={attendance} selectedDate={selectedDate} />}
              {activeView === 'income' && <IncomeView income={income} refresh={fetchData} selectedDate={selectedDate} triggerConfirm={triggerConfirm} />}
              {activeView === 'expenses' && <ExpenseView expenses={expenses} refresh={fetchData} selectedDate={selectedDate} triggerConfirm={triggerConfirm} />}
              {activeView === 'staff' && <StaffView staff={staff} attendance={attendance} salaryPayments={salaryPayments} refresh={fetchData} selectedDate={selectedDate} triggerConfirm={triggerConfirm} />}
              {activeView === 'credit' && <CreditView credits={credits} refresh={fetchData} triggerConfirm={triggerConfirm} />}
              {activeView === 'reports' && <ReportsView income={income} expenses={expenses} />}
              {activeView === 'reminders' && <RemindersView credits={credits} refresh={fetchData} />}
            </>
          )}
        </div>
      </main>
      {confirmConfig && <ConfirmDialog isOpen={true} onClose={() => setConfirmConfig(null)} {...confirmConfig} />}
    </div>
  );
};

// --- View Components ---
const DashboardView = ({ income, expenses, staff, attendance, selectedDate }: any) => {
  const stats = useMemo(() => {
    const activeInc = income.filter((i: any) => i.date === selectedDate).reduce((s: number, i: any) => s + i.amount, 0);
    const activeExp = expenses.filter((e: any) => e.date === selectedDate).reduce((s: number, e: any) => s + e.amount, 0);
    const presentCount = attendance.filter((a: any) => a.date === selectedDate && a.status === AttendanceStatus.PRESENT).length;
    return { income: activeInc, expenses: activeExp, present: presentCount, staffCount: staff.length };
  }, [income, expenses, attendance, staff, selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
      <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl text-white"><TrendingUp className="mb-4" size={32} /><p className="text-blue-100 text-[10px] font-black uppercase mb-1">Today's Revenue</p><h3 className="text-4xl font-black">{formatCurrency(stats.income)}</h3></div>
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><TrendingDown className="text-orange-500 mb-4" size={32} /><p className="text-slate-400 text-[10px] font-black uppercase mb-1">Today's Expense</p><h3 className="text-4xl font-black">{formatCurrency(stats.expenses)}</h3></div>
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><Users className="text-emerald-500 mb-4" size={32} /><p className="text-slate-400 text-[10px] font-black uppercase mb-1">Attendance</p><h3 className="text-4xl font-black">{stats.present} / {stats.staffCount}</h3></div>
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><CreditCard className="text-red-500 mb-4" size={32} /><p className="text-slate-400 text-[10px] font-black uppercase mb-1">Net Flow</p><h3 className={`text-4xl font-black ${stats.income - stats.expenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(stats.income - stats.expenses)}</h3></div>
    </div>
  );
};

const IncomeView = ({ income, refresh, selectedDate, triggerConfirm }: any) => {
  const [modal, setModal] = useState<any>(null);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { date: modal.data.date, source: modal.data.source, amount: parseFloat(modal.data.amount), description: modal.data.description };
    if (modal.type === 'edit') await supabase.from('income').update(payload).eq('id', modal.data.id);
    else await supabase.from('income').insert(payload);
    setModal(null); refresh();
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black tracking-tight">Daily Income</h1><button onClick={() => setModal({ type: 'add', data: { date: selectedDate, source: IncomeSource.RESTAURANT, amount: '', description: '' }})} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg hover:bg-blue-700"><Plus size={20} /> Add Revenue</button></div>
      <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
        <table className="w-full text-left"><thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400"><tr><th className="p-6">Source</th><th className="p-6">Description</th><th className="p-6">Amount</th><th className="p-6 text-right">Actions</th></tr></thead>
          <tbody>{income.filter((i: any) => i.date === selectedDate).map((i: any) => (
            <tr key={i.id} className="border-b last:border-0 hover:bg-slate-50/50 group"><td className="p-6 font-bold">{i.source}</td><td className="p-6 text-slate-500 text-sm">{i.description || '-'}</td><td className="p-6 font-black text-lg">{formatCurrency(i.amount)}</td>
              <td className="p-6 text-right space-x-2"><button onClick={() => setModal({ type: 'edit', data: i })} className="p-2 text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100"><Pencil size={18} /></button><button onClick={() => triggerConfirm('Delete Income', 'Are you sure?', async () => { await supabase.from('income').update({ is_deleted: true }).eq('id', i.id); refresh(); })} className="p-2 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button></td>
            </tr>))}
          </tbody></table>
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.type === 'edit' ? 'Edit Revenue' : 'Add Revenue'}>
        <form onSubmit={handleSave} className="space-y-4">
          <select value={modal?.data?.source} onChange={e => setModal({...modal, data: {...modal.data, source: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50">{Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}</select>
          <input type="text" value={modal?.data?.description} onChange={e => setModal({...modal, data: {...modal.data, description: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" placeholder="Description..." />
          <input type="number" required value={modal?.data?.amount} onChange={e => setModal({...modal, data: {...modal.data, amount: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-3xl bg-slate-50" placeholder="Amount" />
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg">Save Entry</button>
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
    if (modal.type === 'edit') await supabase.from('expenses').update(payload).eq('id', modal.data.id);
    else await supabase.from('expenses').insert(payload);
    setModal(null); refresh();
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black tracking-tight">Daily Expenses</h1><button onClick={() => setModal({ type: 'add', data: { date: selectedDate, category: ExpenseCategory.GROCERIES, amount: '', description: '' }})} className="bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg hover:bg-orange-700"><Plus size={20} /> Add Expense</button></div>
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <table className="w-full text-left"><thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400"><tr><th className="p-6">Category</th><th className="p-6">Description</th><th className="p-6">Amount</th><th className="p-6 text-right">Actions</th></tr></thead>
          <tbody>{expenses.filter((e: any) => e.date === selectedDate).map((e: any) => (
            <tr key={e.id} className="border-b last:border-0 group hover:bg-slate-50/50 group"><td className="p-6 font-bold">{e.category}</td><td className="p-6 text-slate-500 text-sm">{e.description || '-'}</td><td className="p-6 font-black text-lg text-orange-600">{formatCurrency(e.amount)}</td>
              <td className="p-6 text-right space-x-2"><button onClick={() => setModal({ type: 'edit', data: e })} className="p-2 text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100"><Pencil size={18} /></button><button onClick={() => triggerConfirm('Delete Expense', 'Delete this?', async () => { await supabase.from('expenses').update({ is_deleted: true }).eq('id', e.id); refresh(); })} className="p-2 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button></td>
            </tr>))}
          </tbody></table>
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.type === 'edit' ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSave} className="space-y-4">
          <select value={modal?.data?.category} onChange={e => setModal({...modal, data: {...modal.data, category: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50">{Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}</select>
          <input type="text" value={modal?.data?.description} onChange={e => setModal({...modal, data: {...modal.data, description: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" placeholder="Description..." />
          <input type="number" required value={modal?.data?.amount} onChange={e => setModal({...modal, data: {...modal.data, amount: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-3xl bg-slate-50" placeholder="Amount" />
          <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg">Save Expense</button>
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

  const handlePayment = async () => {
    if (!modal?.staff) return;
    const amt = parseFloat(payData.amount);
    await supabase.from('salary_payments').insert({ staff_id: modal.staff.id, date: selectedDate, amount: amt, type: payData.type });
    await supabase.from('expenses').insert({ date: selectedDate, category: ExpenseCategory.OTHER, amount: amt, description: `[${payData.type}] ${modal.staff.name}` });
    setModal(null); setPayData({ amount: '', type: 'Salary' }); refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4"><h1 className="text-3xl font-black tracking-tight">Staff Management</h1><div className="flex bg-white p-1 rounded-2xl border shadow-sm"><button onClick={() => setTab('roster')} className={`px-6 py-2.5 rounded-xl text-xs font-black ${tab === 'roster' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Daily Roster</button><button onClick={() => setTab('payroll')} className={`px-6 py-2.5 rounded-xl text-xs font-black ${tab === 'payroll' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Payroll</button><button onClick={() => setTab('staff')} className={`px-6 py-2.5 rounded-xl text-xs font-black ${tab === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Directory</button></div></div>
      {tab === 'roster' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{staff.map((s: any) => {
          const rec = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
          const isP = rec?.status === AttendanceStatus.PRESENT;
          return (<button key={s.id} onClick={() => toggleAtt(s.id)} className={`p-6 rounded-[2rem] border-2 text-left transition-all ${isP ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}><div className="flex justify-between items-center"><div><h4 className="font-black text-lg">{s.name}</h4><p className="text-[10px] font-black text-slate-400 uppercase">{s.role}</p></div>{isP ? <Check className="text-emerald-600" /> : <Clock className="text-slate-300" />}</div></button>);
        })}</div>)}
      {tab === 'payroll' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{staff.map((s: any) => {
          const myPays = salaryPayments.filter((p: any) => p.staffId === s.id && getMonthYear(p.date) === getMonthYear(selectedDate));
          const sal = myPays.filter(p => p.type === 'Salary').reduce((a, b) => a + b.amount, 0);
          const adv = myPays.filter(p => p.type === 'Advance').reduce((a, b) => a + b.amount, 0);
          const rem = s.monthlySalary - sal - adv;
          return (<div key={s.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm"><div className="flex justify-between mb-6"><div><h4 className="text-xl font-black">{s.name}</h4><p className="text-xs text-slate-400">{s.role}</p></div><div className="text-right font-black"><p className="text-[9px] uppercase text-slate-400">Monthly</p>{formatCurrency(s.monthlySalary)}</div></div>
            <div className="grid grid-cols-3 gap-2 mb-6 text-center"><div className="bg-slate-50 p-4 rounded-xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Paid</p><p className="font-black text-blue-600">{formatCurrency(sal)}</p></div><div className="bg-slate-50 p-4 rounded-xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Advance</p><p className="font-black text-orange-600">{formatCurrency(adv)}</p></div><div className={`p-4 rounded-xl ${rem <= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Balance</p><p className={`font-black ${rem <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(rem)}</p></div></div>
            <div className="flex gap-2"><button onClick={() => setModal({ type: 'pay', staff: s })} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2"><Wallet size={16} /> Pay</button><button onClick={() => setModal({ type: 'history', staff: s })} className="p-3.5 rounded-2xl border-2 border-slate-100 text-slate-300 hover:text-blue-600"><History size={20} /></button></div></div>);
        })}</div>)}
      {tab === 'staff' && (<div className="space-y-4"><div className="flex justify-end"><button onClick={() => setModal({ type: 'add_staff', data: { name: '', role: '', salary: '' }})} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2"><UserPlus size={18} /> Add Employee</button></div>
          <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm"><table className="w-full text-left"><thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase"><tr><th className="p-6">Employee</th><th className="p-6">Role</th><th className="p-6">Salary</th><th className="p-6 text-right">Actions</th></tr></thead>
            <tbody>{staff.map((s: any) => (<tr key={s.id} className="border-b last:border-0 hover:bg-slate-50/50 group"><td className="p-6 font-black text-lg">{s.name}</td><td className="p-6 font-bold text-slate-500">{s.role}</td><td className="p-6 font-black">{formatCurrency(s.monthlySalary)}</td><td className="p-6 text-right"><button onClick={() => triggerConfirm('Delete Staff', `Remove ${s.name}?`, async () => { await supabase.from('staff').update({ is_deleted: true }).eq('id', s.id); refresh(); })} className="p-2 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button></td></tr>))}</tbody></table></div></div>)}
      <Modal isOpen={modal?.type === 'add_staff'} onClose={() => setModal(null)} title="New Staff Profile"><form onSubmit={async (e) => { e.preventDefault(); await supabase.from('staff').insert({ name: modal.data.name, role: modal.data.role, monthly_salary: parseFloat(modal.data.salary) }); setModal(null); refresh(); }} className="space-y-4">
        <input type="text" required placeholder="Name" value={modal?.data?.name} onChange={e => setModal({...modal, data: {...modal.data, name: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
        <input type="text" required placeholder="Role" value={modal?.data?.role} onChange={e => setModal({...modal, data: {...modal.data, role: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
        <input type="number" required placeholder="Salary" value={modal?.data?.salary} onChange={e => setModal({...modal, data: {...modal.data, salary: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-2xl bg-slate-50" />
        <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg">Add Staff</button></form></Modal>
      <Modal isOpen={modal?.type === 'pay'} onClose={() => setModal(null)} title={`Pay ${modal?.staff?.name}`}>
        <div className="space-y-6"><div className="flex bg-slate-50 p-1 rounded-2xl border"><button onClick={() => setPayData({...payData, type: 'Salary'})} className={`flex-1 py-3 rounded-xl font-black text-sm ${payData.type === 'Salary' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Salary</button><button onClick={() => setPayData({...payData, type: 'Advance'})} className={`flex-1 py-3 rounded-xl font-black text-sm ${payData.type === 'Advance' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}>Advance</button></div>
        <input type="number" value={payData.amount} onChange={e => setPayData({...payData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-5 rounded-3xl font-black text-4xl text-center bg-slate-50" placeholder="₹ Amount" /><button onClick={handlePayment} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-100">Release Funds</button></div></Modal>
      <Modal isOpen={modal?.type === 'history'} onClose={() => setModal(null)} title={`${modal?.staff?.name} History`}>{modal?.staff && (
        <div className="space-y-6"><section><h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Attendance (This Month)</h5><div className="flex flex-wrap gap-2">{attendance.filter((a: any) => a.staffId === modal.staff.id && getMonthYear(a.date) === getMonthYear(selectedDate)).map((a: any) => (<div key={a.id} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${a.status === AttendanceStatus.PRESENT ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{new Date(a.date).getDate()}</div>))}</div></section>
          <section><h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recent Payments</h5><div className="space-y-2">{salaryPayments.filter((p: any) => p.staffId === modal.staff.id && getMonthYear(p.date) === getMonthYear(selectedDate)).map((p: any) => (<div key={p.id} className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"><div><p className="font-bold text-sm">{p.type}</p><p className="text-[10px] text-slate-400">{p.date}</p></div><p className={`font-black ${p.type === 'Salary' ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(p.amount)}</p></div>))}</div></section></div>)}</Modal>
    </div>
  );
};

const CreditView = ({ credits, refresh, triggerConfirm }: any) => {
  const [modal, setModal] = useState<any>(null);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-black tracking-tight">Credit Ledger</h1><button onClick={() => setModal({ type: 'add', data: { customerName: '', phone: '', amount: '', dueDate: getCurrentDate() }})} className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg"><Plus size={20} /> Open Credit</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{credits.filter((c: any) => c.status === 'Pending').map((c: any) => (
        <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group"><h3 className="font-black text-xl mb-1">{c.customerName}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{c.phone}</p><p className="text-3xl font-black text-slate-900 mb-6">{formatCurrency(c.amount)}</p>
          <div className="flex justify-between items-center"><span className="text-xs text-red-500 font-bold flex items-center gap-1"><Clock size={12}/> {c.dueDate}</span><button onClick={() => triggerConfirm('Settle Credit', `Record payment for ${c.customerName}?`, async () => { await supabase.from('credits').update({ status: 'Paid' }).eq('id', c.id); await supabase.from('income').insert({ date: getCurrentDate(), source: IncomeSource.OTHER, amount: c.amount, description: `[Credit Settled] ${c.customerName}` }); refresh(); }, 'info')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black">Settle</button></div></div>))}
      </div>
      <Modal isOpen={modal?.type === 'add'} onClose={() => setModal(null)} title="New Credit Entry"><form onSubmit={async (e) => { e.preventDefault(); await supabase.from('credits').insert({ customer_name: modal.data.customerName, phone: modal.data.phone, amount: parseFloat(modal.data.amount), due_date: modal.data.dueDate, status: 'Pending' }); setModal(null); refresh(); }} className="space-y-4">
        <input type="text" required placeholder="Name" value={modal?.data?.customerName} onChange={e => setModal({...modal, data: {...modal.data, customerName: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" />
        <input type="number" required placeholder="Amount" value={modal?.data?.amount} onChange={e => setModal({...modal, data: {...modal.data, amount: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-2xl bg-slate-50" />
        <input type="date" value={modal?.data?.dueDate} onChange={e => setModal({...modal, data: {...modal.data, dueDate: e.target.value}})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold bg-slate-50" /><button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg">Grant Credit</button></form></Modal>
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
  return (<div className="bg-white p-10 rounded-[3rem] border shadow-sm h-[400px]"><h3 className="text-2xl font-black mb-8 tracking-tight">Business Velocity</h3><ResponsiveContainer width="100%" height="80%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} /><Legend verticalAlign="top" align="right" iconType="circle" /><Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Income" /><Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Expense" /></BarChart></ResponsiveContainer></div>);
};

const RemindersView = ({ credits }: any) => (
  <div className="space-y-6"><h1 className="text-3xl font-black tracking-tight text-red-600">Urgent Alerts</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-white p-8 rounded-[2.5rem] border-2 border-red-50"><h4 className="font-black text-xl mb-6">Overdue Credits</h4><div className="space-y-4">{credits.filter((c: any) => c.status === 'Pending' && c.dueDate && c.dueDate < getCurrentDate()).map((c: any) => (<div key={c.id} className="flex justify-between p-4 bg-red-50/30 rounded-2xl border border-red-100"><div><p className="font-black">{c.customerName}</p><p className="text-xs text-red-400 font-bold">Due: {c.dueDate}</p></div><p className="font-black text-lg text-red-600">{formatCurrency(c.amount)}</p></div>))}</div></div></div></div>
);

export default App;
