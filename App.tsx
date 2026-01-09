
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, TrendingUp, TrendingDown, Users, CreditCard, 
  BarChart3, Menu, X, Plus, Bell, Trash2, Pencil, Calendar, 
  AlertCircle, Clock, ChevronRight, HandCoins, History, Check, 
  CalendarRange, Lock, User, LogOut, Hotel
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Clean inputs to avoid whitespace issues
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    try {
      // 1. First, check if the table is even accessible
      const { data, error: queryError } = await supabase
        .from('manager_profiles')
        .select('username, password_hash')
        .eq('username', cleanUsername)
        .eq('password_hash', cleanPassword);

      if (queryError) {
        console.error('Supabase Auth Error:', queryError);
        // If it's a 406 or RLS error, it usually means policies are missing
        if (queryError.code === '42501') {
          setError('Permission Denied: Check Supabase RLS Policies');
        } else {
          setError(`Database Error: ${queryError.message}`);
        }
        return;
      }

      if (data && data.length > 0) {
        // Successful login
        onLogin();
      } else {
        // No matching record found
        setError('Incorrect Username or Password');
      }
    } catch (err: any) {
      console.error('Login Exception:', err);
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
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
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Management Cloud</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Manager ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={20} />
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" 
                  placeholder="Username" 
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Secure PIN/Pass</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl hover:bg-blue-700 active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Unlock Dashboard'
              )}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-loose">
              Enterprise Access Control<br/>
              HotelFlow Management System v2.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    {onResetToday && (
      <button onClick={onResetToday} className="p-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
        <CalendarRange size={20} />
      </button>
    )}
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('hf_auth') === 'true');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(true);

  // Supabase Data State
  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
  const [credits, setCredits] = useState<CreditRecord[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inc, exp, stf, att, sal, cre] = await Promise.all([
        supabase.from('income').select('*').eq('is_deleted', false),
        supabase.from('expenses').select('*').eq('is_deleted', false),
        supabase.from('staff').select('*').eq('is_deleted', false),
        supabase.from('attendance').select('*'),
        supabase.from('salary_payments').select('*'),
        supabase.from('credits').select('*').eq('is_deleted', false),
      ]);
      
      if (inc.data) setIncome(inc.data);
      if (exp.data) setExpenses(exp.data);
      if (stf.data) setStaff(stf.data.map(s => ({ ...s, monthlySalary: s.monthly_salary })));
      if (att.data) setAttendance(att.data.map(a => ({ ...a, staffId: a.staff_id })));
      if (sal.data) setSalaryPayments(sal.data.map(s => ({ ...s, staffId: s.staff_id })));
      if (cre.data) setCredits(cre.data.map(c => ({ ...c, customerName: c.customer_name, dueDate: c.due_date })));
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hf_auth');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('hf_auth', 'true');
  };

  const reminderCount = useMemo(() => {
    const today = getCurrentDate();
    const overdueCredits = credits.filter(c => c.status === 'Pending' && c.dueDate && c.dueDate < today).length;
    const unpaidStaff = staff.filter(s => {
      const paidThisMonth = salaryPayments.filter(p => p.staffId === s.id && getMonthYear(p.date) === getMonthYear(today)).reduce((acc, curr) => acc + curr.amount, 0);
      return paidThisMonth < s.monthlySalary;
    }).length;
    return overdueCredits + unpaidStaff;
  }, [credits, staff, salaryPayments, selectedDate]);

  if (!isAuthenticated) return <LoginScreen onLogin={handleLoginSuccess} />;

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
          <div className="flex items-center gap-3 text-blue-600 mb-12 px-2">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100"><BarChart3 className="text-white" size={24} /></div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">HotelFlow</span>
          </div>
          <nav className="space-y-2 flex-1 overflow-y-auto">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="reminders" icon={Bell} label="Reminders" badge={reminderCount} />
            <div className="py-4 border-b border-slate-50"></div>
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff & Pay" />
            <SidebarItem view="credit" icon={CreditCard} label="Credits" />
            <SidebarItem view="reports" icon={BarChart3} label="Insights" />
          </nav>
          <button onClick={handleLogout} className="mt-10 flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-all" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-3 bg-white border rounded-xl text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <h2 className="hidden md:block font-black text-slate-800 text-xl tracking-tight capitalize">{activeView}</h2>
          </div>
          <DateSelector value={selectedDate} onChange={setSelectedDate} label="Working Date" onResetToday={() => setSelectedDate(getCurrentDate())} />
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="font-black text-slate-400 text-sm animate-pulse tracking-widest">CONNECTING TO CLOUD...</p>
            </div>
          ) : (
            <>
              {activeView === 'dashboard' && <DashboardView income={income} expenses={expenses} credits={credits} staff={staff} attendance={attendance} selectedDate={selectedDate} />}
              {activeView === 'reminders' && <RemindersView credits={credits} staff={staff} salaryPayments={salaryPayments} refresh={fetchData} />}
              {activeView === 'income' && <IncomeView income={income} refresh={fetchData} selectedDate={selectedDate} />}
              {activeView === 'expenses' && <ExpenseView expenses={expenses} refresh={fetchData} selectedDate={selectedDate} />}
              {activeView === 'staff' && <StaffView staff={staff} attendance={attendance} salaryPayments={salaryPayments} refresh={fetchData} selectedDate={selectedDate} />}
              {activeView === 'credit' && <CreditView credits={credits} refresh={fetchData} />}
              {activeView === 'reports' && <ReportsView income={income} expenses={expenses} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const DashboardView = ({ income, expenses, credits, staff, attendance, selectedDate }: any) => {
  const stats = useMemo(() => {
    const activeInc = income.filter((i: any) => i.date === selectedDate).reduce((s: number, i: any) => s + i.amount, 0);
    const activeExp = expenses.filter((e: any) => e.date === selectedDate).reduce((s: number, e: any) => s + e.amount, 0);
    const presentCount = attendance.filter((a: any) => a.date === selectedDate && a.status === AttendanceStatus.PRESENT).length;
    const pendingCredits = credits.filter((c: any) => c.status === 'Pending').reduce((s: number, c: any) => s + c.amount, 0);
    return { income: activeInc, expenses: activeExp, staffPresent: presentCount, totalStaff: staff.length, pendingCredits };
  }, [income, expenses, attendance, credits, staff, selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-2xl text-white">
        <TrendingUp className="mb-4" size={32} />
        <p className="text-blue-100 text-xs font-black uppercase mb-2">Daily Revenue</p>
        <h3 className="text-4xl font-black">{formatCurrency(stats.income)}</h3>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <TrendingDown className="text-orange-600 mb-4" size={32} />
        <p className="text-slate-400 text-xs font-black uppercase mb-2">Daily Expenses</p>
        <h3 className="text-4xl font-black text-slate-800">{formatCurrency(stats.expenses)}</h3>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <Users className="text-emerald-600 mb-4" size={32} />
        <p className="text-slate-400 text-xs font-black uppercase mb-2">Team Attendance</p>
        <h3 className="text-4xl font-black text-slate-800">{stats.staffPresent} <span className="text-sm text-slate-300">/ {stats.totalStaff}</span></h3>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <CreditCard className="text-red-500 mb-4" size={32} />
        <p className="text-slate-400 text-xs font-black uppercase mb-2">Receivables</p>
        <h3 className="text-4xl font-black text-red-500">{formatCurrency(stats.pendingCredits)}</h3>
      </div>
    </div>
  );
};

const IncomeView = ({ income, refresh, selectedDate }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: selectedDate, source: IncomeSource.RESTAURANT, description: '', amount: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('income').insert({
      date: formData.date,
      source: formData.source,
      description: formData.description,
      amount: parseFloat(formData.amount)
    });
    setIsModalOpen(false);
    refresh();
  };

  const deleteEntry = async (id: string) => {
    await supabase.from('income').update({ is_deleted: true }).eq('id', id);
    refresh();
  };

  const dayIncome = income.filter((i: any) => i.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight">Daily Income</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg"><Plus size={20} /> Add Entry</button>
      </div>
      <div className="bg-white rounded-[2rem] border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr><th className="p-6">Source</th><th className="p-6">Amount</th><th className="p-6 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {dayIncome.map((i: any) => (
              <tr key={i.id} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="p-6 font-bold">{i.source}</td>
                <td className="p-6 font-black text-lg">{formatCurrency(i.amount)}</td>
                <td className="p-6 text-right">
                  <button onClick={() => deleteEntry(i.id)} className="p-2 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {dayIncome.length === 0 && <tr><td colSpan={3} className="p-20 text-center text-slate-300 font-bold italic">No records today.</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Revenue Entry">
        <form onSubmit={handleAdd} className="space-y-4">
          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold" />
          <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as any})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold">
            {Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-2xl" />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg">Save Record</button>
        </form>
      </Modal>
    </div>
  );
};

const ExpenseView = ({ expenses, refresh, selectedDate }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: selectedDate, category: ExpenseCategory.GROCERIES, description: '', amount: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('expenses').insert({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount)
    });
    setIsModalOpen(false);
    refresh();
  };

  const deleteEntry = async (id: string) => {
    await supabase.from('expenses').update({ is_deleted: true }).eq('id', id);
    refresh();
  };

  const dayExpenses = expenses.filter((e: any) => e.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight">Daily Outflows</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg"><Plus size={20} /> Add Expense</button>
      </div>
      <div className="bg-white rounded-[2rem] border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr><th className="p-6">Category</th><th className="p-6">Amount</th><th className="p-6 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {dayExpenses.map((e: any) => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="p-6 font-bold">{e.category}</td>
                <td className="p-6 font-black text-lg">{formatCurrency(e.amount)}</td>
                <td className="p-6 text-right">
                  <button onClick={() => deleteEntry(e.id)} className="p-2 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {dayExpenses.length === 0 && <tr><td colSpan={3} className="p-20 text-center text-slate-300 font-bold italic">No expenses logged.</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Expense Record">
        <form onSubmit={handleAdd} className="space-y-4">
          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold" />
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold">
            {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black text-2xl" />
          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg">Record Outflow</button>
        </form>
      </Modal>
    </div>
  );
};

const StaffView = ({ staff, attendance, salaryPayments, refresh, selectedDate }: any) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'salary' | 'list'>('attendance');
  const [isSalaryModal, setIsSalaryModal] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  const toggleAttendance = async (staffId: string) => {
    const att = attendance.find(a => a.staffId === staffId && a.date === selectedDate);
    if (att) {
      await supabase.from('attendance').update({ status: att.status === AttendanceStatus.PRESENT ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT }).eq('id', att.id);
    } else {
      await supabase.from('attendance').insert({ staff_id: staffId, date: selectedDate, status: AttendanceStatus.PRESENT });
    }
    refresh();
  };

  const handleSalary = async () => {
    if (!isSalaryModal) return;
    const amount = parseFloat(payAmount);
    await supabase.from('salary_payments').insert({
      staff_id: isSalaryModal.id,
      date: selectedDate,
      amount,
      type: 'Salary'
    });
    await supabase.from('expenses').insert({
      date: selectedDate,
      category: ExpenseCategory.OTHER,
      description: `[Staff Salary] Paid to ${isSalaryModal.name}`,
      amount
    });
    setIsSalaryModal(null);
    setPayAmount('');
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight">Team Center</h1>
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
          <button onClick={() => setActiveTab('attendance')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Roster</button>
          <button onClick={() => setActiveTab('salary')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'salary' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Payroll</button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(s => {
            const att = attendance.find(a => a.staffId === s.id && a.date === selectedDate);
            const isPresent = att?.status === AttendanceStatus.PRESENT;
            return (
              <div key={s.id} onClick={() => toggleAttendance(s.id)} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${isPresent ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${isPresent ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300'}`}>{s.name[0]}</div>
                    <div><h4 className="font-black">{s.name}</h4><p className="text-[10px] uppercase font-black text-slate-400">{s.role}</p></div>
                  </div>
                  {isPresent && <Check size={20} className="text-emerald-600" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-4">
          {staff.map(s => {
            const paid = salaryPayments.filter(p => p.staffId === s.id && getMonthYear(p.date) === getMonthYear(selectedDate)).reduce((a, b) => a + b.amount, 0);
            const progress = (paid / (s.monthlySalary || 1)) * 100;
            return (
              <div key={s.id} className="bg-white p-6 rounded-[2.5rem] border flex items-center gap-8 shadow-sm">
                <div className="flex-1">
                  <h4 className="font-black text-lg mb-1">{s.name}</h4>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                    <span>Paid: {formatCurrency(paid)}</span>
                    <span>Goal: {formatCurrency(s.monthlySalary)}</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full border">
                    <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${Math.min(100, progress)}%` }}></div>
                  </div>
                </div>
                <button onClick={() => setIsSalaryModal(s)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg">Release Pay</button>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!isSalaryModal} onClose={() => setIsSalaryModal(null)} title="Funds Release">
        <div className="space-y-6">
          <p className="text-sm font-bold text-slate-500">Record a salary payment for {isSalaryModal?.name}. This will be auto-logged in daily expenses.</p>
          <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full border-2 border-slate-100 p-5 rounded-2xl font-black text-4xl" placeholder="₹ Amount" />
          <button onClick={handleSalary} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100">Confirm Payout</button>
        </div>
      </Modal>
    </div>
  );
};

const CreditView = ({ credits, refresh }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('credits').insert({
      customer_name: formData.customerName,
      phone: formData.phone,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      due_date: formData.dueDate,
      status: 'Pending'
    });
    setIsModalOpen(false);
    refresh();
  };

  const settle = async (id: string) => {
    await supabase.from('credits').update({ status: 'Paid' }).eq('id', id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight">Receivables</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg"><Plus size={20} /> New Credit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credits.filter(c => c.status === 'Pending').map(c => (
          <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:border-red-100 transition-all">
            <h3 className="font-black text-xl mb-1">{c.customerName}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{c.phone}</p>
            <p className="text-3xl font-black text-slate-900 mb-4">{formatCurrency(c.amount)}</p>
            <div className="text-xs text-red-500 font-bold mb-6 flex items-center gap-1"><Clock size={12}/> Due: {c.dueDate}</div>
            <button onClick={() => settle(c.id)} className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-black transition-all">Clear Debt</button>
          </div>
        ))}
        {credits.filter(c => c.status === 'Pending').length === 0 && <p className="col-span-full py-20 text-center text-slate-300 italic font-bold">No active debts.</p>}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Credit Entry">
        <form onSubmit={handleAdd} className="space-y-4">
          <input type="text" placeholder="Customer Name" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold" />
          <input type="number" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-black" />
          <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold" />
          <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg">Open Credit</button>
        </form>
      </Modal>
    </div>
  );
};

const ReportsView = ({ income, expenses }: any) => {
  const last6Months = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const my = getMonthYear(d.toISOString().split('T')[0]);
      const inc = income.filter((x: any) => getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      const exp = expenses.filter((x: any) => getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      data.push({ name: d.toLocaleDateString('en-US', { month: 'short' }), income: inc, expense: exp, profit: inc - exp });
    }
    return data;
  }, [income, expenses]);

  return (
    <div className="space-y-10 animate-in fade-in">
      <section className="bg-white p-10 rounded-[3rem] border shadow-sm h-[400px]">
        <h3 className="text-2xl font-black mb-8 tracking-tight">Growth Performance</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={last6Months}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
            <Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

const RemindersView = ({ credits, staff, salaryPayments, refresh }: any) => {
  const today = getCurrentDate();
  const overdue = credits.filter(c => c.status === 'Pending' && c.dueDate && c.dueDate < today);

  const settleCredit = async (id: string) => {
    await supabase.from('credits').update({ status: 'Paid' }).eq('id', id);
    refresh();
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-black tracking-tight">Urgent Attention</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-black text-red-600 mb-4 flex items-center gap-2">Overdue Receivables ({overdue.length})</h2>
          <div className="space-y-4">
            {overdue.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-3xl border flex justify-between items-center group shadow-sm hover:border-red-100">
                <div><p className="font-black text-slate-800">{c.customerName}</p><p className="text-xs text-red-500 font-bold">Overdue since {c.dueDate}</p></div>
                <div className="text-right">
                  <p className="font-black text-lg text-slate-900">{formatCurrency(c.amount)}</p>
                  <button onClick={() => settleCredit(c.id)} className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black hover:bg-emerald-600 hover:text-white transition-all">Settle</button>
                </div>
              </div>
            ))}
            {overdue.length === 0 && <p className="p-12 text-center text-slate-300 font-bold italic border-2 border-dashed rounded-3xl">Everything is up to date.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
