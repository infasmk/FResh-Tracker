
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  BarChart3, 
  Menu, 
  X, 
  Plus, 
  Bell,
  Trash2,
  CheckCircle2,
  CalendarDays,
  Phone,
  Pencil,
  Calendar,
  AlertCircle,
  Clock,
  ChevronRight,
  HandCoins,
  History,
  Check
} from 'lucide-react';
import { 
  IncomeEntry, 
  ExpenseEntry, 
  Staff, 
  AttendanceRecord, 
  SalaryPayment, 
  CreditRecord, 
  View,
  IncomeSource,
  ExpenseCategory,
  AttendanceStatus
} from './types';
import { formatCurrency, getCurrentDate, getMonthYear } from './constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';

// --- Custom UI Components ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <AlertCircle size={32} />
        </div>
        <p className="text-slate-600 font-medium leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
        <button 
          onClick={onConfirm} 
          className={`flex-1 px-4 py-3.5 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

const DateSelector = ({ value, onChange, label }: any) => (
  <div className="group relative flex items-center gap-3 bg-white border-2 border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-blue-500 transition-all">
    <div className="flex flex-col">
      {label && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>}
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-blue-500" />
        <input 
          type="date" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer" 
        />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  
  // Data State
  const [income, setIncome] = useState<IncomeEntry[]>(() => JSON.parse(localStorage.getItem('hf_income') || '[]'));
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => JSON.parse(localStorage.getItem('hf_expenses') || '[]'));
  const [staff, setStaff] = useState<Staff[]>(() => JSON.parse(localStorage.getItem('hf_staff') || '[]'));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => JSON.parse(localStorage.getItem('hf_attendance') || '[]'));
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(() => JSON.parse(localStorage.getItem('hf_salaries') || '[]'));
  const [credits, setCredits] = useState<CreditRecord[]>(() => JSON.parse(localStorage.getItem('hf_credits') || '[]'));

  useEffect(() => {
    localStorage.setItem('hf_income', JSON.stringify(income));
    localStorage.setItem('hf_expenses', JSON.stringify(expenses));
    localStorage.setItem('hf_staff', JSON.stringify(staff));
    localStorage.setItem('hf_attendance', JSON.stringify(attendance));
    localStorage.setItem('hf_salaries', JSON.stringify(salaryPayments));
    localStorage.setItem('hf_credits', JSON.stringify(credits));
  }, [income, expenses, staff, attendance, salaryPayments, credits]);

  const reminderCount = useMemo(() => {
    const today = getCurrentDate();
    const overdueCredits = credits.filter(c => !c.isDeleted && c.status === 'Pending' && c.dueDate && c.dueDate < today).length;
    const currentMonth = getMonthYear(today);
    const unpaidStaff = staff.filter(s => !s.isDeleted).filter(s => {
      const paidThisMonth = salaryPayments.filter(p => p.staffId === s.id && getMonthYear(p.date) === currentMonth).reduce((acc, curr) => acc + curr.amount, 0);
      return paidThisMonth < s.monthlySalary;
    }).length;
    return overdueCredits + unpaidStaff;
  }, [credits, staff, salaryPayments]);

  const SidebarItem = ({ view, icon: Icon, label, badge }: any) => (
    <button
      onClick={() => { setActiveView(view); setIsSidebarOpen(false); }}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
        activeView === view ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} strokeWidth={activeView === view ? 2.5 : 2} />
        <span className={`font-bold tracking-tight ${activeView === view ? 'text-white' : 'text-slate-600'}`}>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeView === view ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 text-blue-600 mb-12 px-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-2xl shadow-xl shadow-blue-100">
              <BarChart3 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">HotelFlow</span>
          </div>
          <nav className="space-y-2 flex-1">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="reminders" icon={Bell} label="Reminders" badge={reminderCount} />
            <div className="py-4"><div className="h-px bg-slate-50 mx-4"></div></div>
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff & Attendance" />
            <SidebarItem view="credit" icon={CreditCard} label="Credit Records" />
            <SidebarItem view="reports" icon={BarChart3} label="Insights" />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <h2 className="hidden md:block font-black text-slate-800 text-xl tracking-tight capitalize">{activeView}</h2>
          </div>
          <DateSelector value={selectedDate} onChange={setSelectedDate} label="Working Date" />
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <DashboardView income={income} expenses={expenses} credits={credits} staff={staff} attendance={attendance} selectedDate={selectedDate} />}
          {activeView === 'reminders' && <RemindersView credits={credits} staff={staff} salaryPayments={salaryPayments} setCredits={setCredits} />}
          {activeView === 'income' && <IncomeView income={income} setIncome={setIncome} />}
          {activeView === 'expenses' && <ExpenseView expenses={expenses} setExpenses={setExpenses} />}
          {activeView === 'staff' && <StaffView staff={staff} setStaff={setStaff} attendance={attendance} setAttendance={setAttendance} salaryPayments={salaryPayments} setSalaryPayments={setSalaryPayments} expenses={expenses} setExpenses={setExpenses} selectedDate={selectedDate} />}
          {activeView === 'credit' && <CreditView credits={credits} setCredits={setCredits} />}
          {activeView === 'reports' && <ReportsView income={income} expenses={expenses} />}
        </div>
      </main>
    </div>
  );
};

const DashboardView = ({ income, expenses, credits, staff, attendance, selectedDate }: any) => {
  const stats = useMemo(() => {
    const activeInc = income.filter((i: any) => !i.isDeleted && i.date === selectedDate).reduce((s: number, i: any) => s + i.amount, 0);
    const activeExp = expenses.filter((e: any) => !e.isDeleted && e.date === selectedDate).reduce((s: number, e: any) => s + e.amount, 0);
    const presentCount = attendance.filter((a: any) => a.date === selectedDate && a.status === AttendanceStatus.PRESENT).length;
    const pendingCredits = credits.filter((c: any) => !c.isDeleted && c.status === 'Pending').reduce((s: number, c: any) => s + c.amount, 0);
    return { income: activeInc, expenses: activeExp, staffPresent: presentCount, totalStaff: staff.filter((s:any) => !s.isDeleted).length, pendingCredits };
  }, [income, expenses, attendance, credits, staff, selectedDate]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Day Summary</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 text-white relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-2">Revenue</p>
          <h3 className="text-4xl font-black tracking-tight">{formatCurrency(stats.income)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Expenses</p>
          <h3 className="text-4xl font-black text-slate-800 tracking-tight">{formatCurrency(stats.expenses)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Roster</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{stats.staffPresent}</h3>
            <span className="text-lg font-bold text-slate-300 mb-1">/ {stats.totalStaff} staff</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Receivables</p>
          <h3 className="text-4xl font-black text-red-500 tracking-tight">{formatCurrency(stats.pendingCredits)}</h3>
        </div>
      </div>
    </div>
  );
};

const RemindersView = ({ credits, staff, salaryPayments, setCredits }: any) => {
  const today = getCurrentDate();
  const currentMonth = getMonthYear(today);
  const overdueCredits = credits.filter((c: any) => !c.isDeleted && c.status === 'Pending' && c.dueDate && c.dueDate < today);
  const salaryStatus = staff.filter((s: any) => !s.isDeleted).map((s: any) => {
    const paid = salaryPayments.filter((p: any) => p.staffId === s.id && getMonthYear(p.date) === currentMonth).reduce((acc: number, curr: any) => acc + curr.amount, 0);
    return { ...s, paid, pending: s.monthlySalary - paid };
  }).filter(s => s.pending > 0);

  return (
    <div className="space-y-10 animate-in fade-in">
      <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Reminders</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-xl font-black text-red-600 mb-6 flex items-center gap-2">Overdue Receivables ({overdueCredits.length})</h2>
          <div className="space-y-4">
            {overdueCredits.length === 0 ? <p className="text-slate-400 font-bold text-center bg-white p-12 rounded-[2rem] border-2 border-dashed">All payments are current.</p> : overdueCredits.map((c: any) => (
              <div key={c.id} className="bg-white border-2 border-slate-50 p-6 rounded-3xl shadow-sm flex justify-between items-center hover:border-red-100 transition-colors group">
                <div>
                  <p className="font-black text-slate-900 text-lg">{c.customerName}</p>
                  <p className="text-xs text-red-500 font-black uppercase tracking-widest mt-1 flex items-center gap-1.5"><AlertCircle size={12}/> Overdue since {c.dueDate}</p>
                </div>
                <div className="text-right">
                   <p className="font-black text-slate-800 text-xl mb-2">{formatCurrency(c.amount)}</p>
                   <button onClick={() => setCredits(credits.map((cr: any) => cr.id === c.id ? {...cr, status: 'Paid'} : cr))} className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-50">Settle</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-black text-blue-600 mb-6 flex items-center gap-2">Monthly Payroll Gaps ({salaryStatus.length})</h2>
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400 border-b">
                <tr><th className="px-6 py-4">Employee</th><th className="px-6 py-4 text-right">Pending Pay</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {salaryStatus.length === 0 ? <tr><td colSpan={2} className="p-12 text-center text-slate-300 font-bold italic">No salaries pending this month.</td></tr> : salaryStatus.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5"><p className="font-black text-slate-800">{s.name}</p><p className="text-xs font-bold text-slate-400">{s.role}</p></td>
                    <td className="px-6 py-5 text-right font-black text-orange-600 text-lg">{formatCurrency(s.pending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const IncomeView = ({ income, setIncome }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<string | null>(null);
  const [range, setRange] = useState({ start: getCurrentDate(), end: getCurrentDate() });
  const [formData, setFormData] = useState({ date: getCurrentDate(), source: IncomeSource.RESTAURANT, description: '', amount: '' });

  const filtered = useMemo(() => income.filter((i: any) => !i.isDeleted && i.date >= range.start && i.date <= range.end), [income, range]);
  const total = useMemo(() => filtered.reduce((acc: number, curr: any) => acc + curr.amount, 0), [filtered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setIncome(income.map((i: any) => i.id === editingId ? { ...i, ...formData, amount: parseFloat(formData.amount) } : i));
    } else {
      setIncome([{ id: Math.random().toString(36).substr(2, 9), ...formData, amount: parseFloat(formData.amount), isDeleted: false }, ...income]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ date: getCurrentDate(), source: IncomeSource.RESTAURANT, description: '', amount: '' });
  };

  const handleEdit = (entry: any) => {
    setEditingId(entry.id);
    setFormData({ date: entry.date, source: entry.source, description: entry.description, amount: entry.amount.toString() });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Income</h1>
          <p className="text-sm font-black text-slate-400 mt-1 uppercase tracking-widest">Total Revenue: <span className="text-blue-600">{formatCurrency(total)}</span></p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 bg-white border-2 border-slate-100 p-2 rounded-2xl shadow-sm">
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none cursor-pointer p-1" />
             <ChevronRight size={14} className="text-slate-300" />
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none cursor-pointer p-1" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3.5 rounded-[1.25rem] flex items-center gap-2 shadow-2xl shadow-blue-100 font-black active:scale-95 transition-all"><Plus size={20} /> New Record</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]"><th className="px-8 py-5">Date</th><th className="px-8 py-5">Source</th><th className="px-8 py-5">Amount</th><th className="px-8 py-5 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black italic tracking-tight">No Financial Logs</td></tr> : filtered.map((i: any) => (
              <tr key={i.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 text-sm font-black text-slate-600">{i.date}</td>
                <td className="px-8 py-6"><span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-50 text-blue-600 uppercase tracking-tighter border border-blue-100">{i.source}</span></td>
                <td className="px-8 py-6 font-black text-slate-900 text-lg">{formatCurrency(i.amount)}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(i)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-blue-100 transition-all"><Pencil size={18} /></button>
                    <button onClick={() => setIsDeleteOpen(i.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-red-100 transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Update Entry' : 'Log New Revenue'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DateSelector value={formData.date} onChange={(val:any) => setFormData({...formData, date: val})} label="Entry Date" />
            <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Source</label><select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as any})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl outline-none focus:border-blue-500 font-bold bg-white">{Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Amount (INR)</label><input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-black text-2xl" /></div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Remarks</label><textarea placeholder="Optional notes..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 h-24 font-medium" /></div>
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-blue-100 active:scale-[0.98] transition-all">Submit Financial Entry</button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!isDeleteOpen} 
        onClose={() => setIsDeleteOpen(null)} 
        onConfirm={() => { setIncome(income.map((x:any) => x.id === isDeleteOpen ? {...x, isDeleted: true} : x)); setIsDeleteOpen(null); }}
        title="Delete Log?"
        message="Removing this income record will permanently update your daily totals."
      />
    </div>
  );
};

const ExpenseView = ({ expenses, setExpenses }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<string | null>(null);
  const [range, setRange] = useState({ start: getCurrentDate(), end: getCurrentDate() });
  const [formData, setFormData] = useState({ date: getCurrentDate(), category: ExpenseCategory.GROCERIES, description: '', amount: '' });

  const filtered = useMemo(() => expenses.filter((e: any) => !e.isDeleted && e.date >= range.start && e.date <= range.end), [expenses, range]);
  const total = useMemo(() => filtered.reduce((acc: number, curr: any) => acc + curr.amount, 0), [filtered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setExpenses(expenses.map((ex: any) => ex.id === editingId ? { ...ex, ...formData, amount: parseFloat(formData.amount) } : ex));
    } else {
      setExpenses([{ id: Math.random().toString(36).substr(2, 9), ...formData, amount: parseFloat(formData.amount), isDeleted: false }, ...expenses]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ date: getCurrentDate(), category: ExpenseCategory.GROCERIES, description: '', amount: '' });
  };

  const handleEdit = (entry: any) => {
    setEditingId(entry.id);
    setFormData({ date: entry.date, category: entry.category, description: entry.description, amount: entry.amount.toString() });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h1 className="text-4xl font-black text-slate-900 tracking-tighter">Expenses</h1><p className="text-sm font-black text-slate-400 mt-1 uppercase tracking-widest">Total Spend: <span className="text-orange-600">{formatCurrency(total)}</span></p></div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 bg-white border-2 border-slate-100 p-2 rounded-2xl shadow-sm">
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none cursor-pointer p-1" />
             <ChevronRight size={14} className="text-slate-300" />
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none cursor-pointer p-1" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white px-8 py-3.5 rounded-[1.25rem] flex items-center gap-2 shadow-2xl shadow-orange-100 font-black active:scale-95 transition-all"><Plus size={20} /> Log Expense</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-8 py-5">Date</th><th className="px-8 py-5">Category</th><th className="px-8 py-5">Amount</th><th className="px-8 py-5 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black italic tracking-tight">No Expense Data</td></tr> : filtered.map((e: any) => (
              <tr key={e.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 text-sm font-black text-slate-600">{e.date}</td>
                <td className="px-8 py-6"><span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-50 text-slate-600 uppercase tracking-tighter border border-slate-200">{e.category}</span></td>
                <td className="px-8 py-6 font-black text-slate-900 text-lg">{formatCurrency(e.amount)}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(e)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-2xl border border-transparent shadow-sm hover:border-blue-100 transition-all"><Pencil size={18} /></button>
                    <button onClick={() => setIsDeleteOpen(e.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-white rounded-2xl border border-transparent shadow-sm hover:border-red-100 transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Record' : 'Log New Outflow'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DateSelector value={formData.date} onChange={(val:any) => setFormData({...formData, date: val})} label="Purchase Date" />
            <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full border-2 border-slate-100 p-3.5 rounded-2xl outline-none focus:border-orange-500 font-bold bg-white">{Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Amount (INR)</label><input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-orange-500 font-black text-2xl" /></div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Description</label><textarea placeholder="Specify items or service..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-orange-500 h-24 font-medium" /></div>
          <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-100 active:scale-[0.98] transition-all">Submit Outflow Record</button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!isDeleteOpen} 
        onClose={() => setIsDeleteOpen(null)} 
        onConfirm={() => { setExpenses(expenses.map((x:any) => x.id === isDeleteOpen ? {...x, isDeleted: true} : x)); setIsDeleteOpen(null); }}
        title="Delete Record?"
        message="This outflow data will be removed. Profit analytics for the month will shift."
      />
    </div>
  );
};

const StaffView = ({ staff, setStaff, attendance, setAttendance, salaryPayments, setSalaryPayments, expenses, setExpenses, selectedDate }: any) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'roster' | 'salary'>('attendance');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState<string | null>(null);
  const [isDeleteStaffOpen, setIsDeleteStaffOpen] = useState<string | null>(null);
  const [isAttendanceHistoryOpen, setIsAttendanceHistoryOpen] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [salaryAmt, setSalaryAmt] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', role: '', monthlySalary: '' });

  const addOrUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaffId) {
      setStaff(staff.map((s:any) => s.id === editingStaffId ? { ...s, ...formData, monthlySalary: parseFloat(formData.monthlySalary) } : s));
    } else {
      setStaff([{ id: Math.random().toString(36).substr(2, 9), ...formData, monthlySalary: parseFloat(formData.monthlySalary), isDeleted: false }, ...staff]);
    }
    closeStaffModal();
  };

  const closeStaffModal = () => {
    setIsStaffModalOpen(false);
    setEditingStaffId(null);
    setFormData({ name: '', phone: '', role: '', monthlySalary: '' });
  };

  const openEditStaff = (s: Staff) => {
    setEditingStaffId(s.id);
    setFormData({ name: s.name, phone: s.phone, role: s.role, monthlySalary: s.monthlySalary.toString() });
    setIsStaffModalOpen(true);
  };

  const handleSalaryPayment = () => {
    if (!isSalaryModalOpen || !salaryAmt) return;
    const staffId = isSalaryModalOpen;
    const amount = parseFloat(salaryAmt);
    const targetStaff = staff.find((s:any) => s.id === staffId);

    const paymentId = Math.random().toString(36).substr(2, 9);
    setSalaryPayments([{ id: paymentId, staffId, date: selectedDate, amount, type: 'Salary' }, ...salaryPayments]);

    // AUTO-SYNC TO EXPENSES
    const expenseEntry: ExpenseEntry = {
      id: `sal-${paymentId}`,
      date: selectedDate,
      category: ExpenseCategory.OTHER,
      description: `Staff Pay: ${targetStaff?.name || 'Employee'}`,
      amount: amount,
      isDeleted: false
    };
    setExpenses([expenseEntry, ...expenses]);

    setIsSalaryModalOpen(null);
    setSalaryAmt('');
  };

  const activeStaff = staff.filter((s: any) => !s.isDeleted);

  const getPresentDaysCount = (staffId: string) => {
    const currentMonth = getMonthYear(selectedDate);
    return attendance.filter((a: any) => a.staffId === staffId && a.status === AttendanceStatus.PRESENT && getMonthYear(a.date) === currentMonth).length;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h1 className="text-4xl font-black text-slate-900 tracking-tighter">Team & Pay</h1><p className="text-sm font-black text-slate-400 mt-1 uppercase tracking-widest">Roster Operations</p></div>
        <div className="flex gap-2 bg-slate-100 p-2 rounded-[1.5rem] shadow-inner w-full md:w-auto overflow-x-auto border-2 border-slate-50">
          <button onClick={() => setActiveTab('attendance')} className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-xl shadow-blue-50/20' : 'text-slate-400 hover:text-slate-600'}`}>Daily Roster</button>
          <button onClick={() => setActiveTab('salary')} className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'salary' ? 'bg-white text-blue-600 shadow-xl shadow-blue-50/20' : 'text-slate-400 hover:text-slate-600'}`}>Pay Tracker</button>
          <button onClick={() => setActiveTab('roster')} className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'roster' ? 'bg-white text-blue-600 shadow-xl shadow-blue-50/20' : 'text-slate-400 hover:text-slate-600'}`}>Employees</button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeStaff.length === 0 ? <p className="col-span-full py-24 text-center text-slate-300 font-black italic bg-white rounded-[2.5rem] border-4 border-dashed border-slate-50">No Employees Found</p> : activeStaff.map((s: Staff) => {
            const record = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
            const isPresent = record?.status === AttendanceStatus.PRESENT;
            return (
              <div 
                key={s.id} 
                onClick={() => {
                  const existing = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
                  if (existing) {
                    setAttendance(attendance.map((a: any) => a.id === existing.id ? { ...a, status: a.status === AttendanceStatus.PRESENT ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT } : a));
                  } else {
                    setAttendance([...attendance, { id: Math.random().toString(36).substr(2, 9), staffId: s.id, date: selectedDate, status: AttendanceStatus.PRESENT }]);
                  }
                }}
                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer select-none group relative overflow-hidden ${isPresent ? 'bg-emerald-50 border-emerald-100 shadow-xl shadow-emerald-50' : 'bg-white border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${isPresent ? 'bg-emerald-500 text-white rotate-6' : 'bg-slate-50 text-slate-300'}`}>{s.name.charAt(0)}</div>
                    <div><h4 className="font-black text-slate-800 text-lg tracking-tight">{s.name}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{s.role}</p></div>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${isPresent ? 'bg-emerald-500 text-white scale-110 shadow-lg rotate-[360deg]' : 'bg-slate-50 text-slate-200'}`}>
                    <Check size={20} strokeWidth={4} />
                  </div>
                </div>
                {isPresent && <div className="absolute -right-4 -bottom-4 text-emerald-100 font-black text-7xl opacity-30 select-none uppercase tracking-tighter">YES</div>}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-6">
          {activeStaff.map((s: Staff) => {
            const currentMonth = getMonthYear(selectedDate);
            const paid = salaryPayments.filter((p: any) => p.staffId === s.id && getMonthYear(p.date) === currentMonth).reduce((acc: number, curr: any) => acc + curr.amount, 0);
            const balance = s.monthlySalary - paid;
            const progress = Math.min(100, (paid / s.monthlySalary) * 100);
            return (
              <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10 hover:shadow-xl transition-all">
                <div className="w-full md:w-auto flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center font-black text-2xl text-slate-300 border-2 border-slate-50">{s.name.charAt(0)}</div>
                  <div className="flex-1 min-w-[120px]">
                    <h4 className="font-black text-slate-800 text-lg">{s.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.role}</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span>Paid: {formatCurrency(paid)}</span>
                    <span className="text-slate-800">Target: {formatCurrency(s.monthlySalary)}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-lg shadow-blue-100" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-orange-600 flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl"><Clock size={16}/> Balance: {formatCurrency(balance)}</p>
                    <button onClick={() => { setSalaryAmt(balance.toString()); setIsSalaryModalOpen(s.id); }} className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-2xl shadow-slate-200 flex items-center gap-2 hover:bg-black transition-all active:scale-95"><HandCoins size={16}/> Record Pay</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={() => setIsStaffModalOpen(true)} className="h-56 rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-all bg-white group p-10">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:rotate-90 transition-all duration-500"><Plus size={32} /></div>
            <span className="font-black text-lg tracking-tight">Add Employee</span>
          </button>
          {activeStaff.map((s: Staff) => (
            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl border-2 border-blue-50">{s.name.charAt(0)}</div>
                <div className="flex gap-1.5">
                   <button onClick={() => openEditStaff(s)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={18} /></button>
                   <button onClick={() => setIsDeleteStaffOpen(s.id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
              </div>
              <h3 className="font-black text-slate-800 text-xl leading-tight mb-1">{s.name}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{s.role}</p>
              
              <div className="space-y-3 mb-6">
                <div className="text-xs text-slate-500 flex items-center gap-2 font-bold bg-slate-50 p-2 rounded-xl"><Phone size={14} className="text-slate-300" /> {s.phone}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 font-bold bg-slate-50 p-2 rounded-xl"><HandCoins size={14} className="text-slate-300" /> {formatCurrency(s.monthlySalary)} <span className="text-[9px] uppercase tracking-tighter opacity-50">/ month</span></div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Attendance</span>
                  <span className="text-sm font-black text-emerald-600">{getPresentDaysCount(s.id)} <span className="text-xs text-slate-300">days this mo.</span></span>
                </div>
                <button onClick={() => setIsAttendanceHistoryOpen(s.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300"><History size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isStaffModalOpen} onClose={closeStaffModal} title={editingStaffId ? 'Update Profile' : 'Register Employee'}>
        <form onSubmit={addOrUpdateStaff} className="space-y-5">
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Legal Name</label><input type="text" placeholder="Full name..." required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" /></div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Contact</label><input type="tel" placeholder="Mobile number..." required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Role</label><input type="text" placeholder="Job Title" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" /></div>
            <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Monthly Sal.</label><input type="number" placeholder="₹" required value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" /></div>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-slate-100 hover:bg-black transition-all active:scale-95">Save Staff Profile</button>
        </form>
      </Modal>

      <Modal isOpen={!!isSalaryModalOpen} onClose={() => setIsSalaryModalOpen(null)} title="Payout Record">
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
             <p className="text-blue-900 font-bold text-sm leading-relaxed">Recording a payment for <b>{staff.find((s:any) => s.id === isSalaryModalOpen)?.name}</b> will automatically reflect in today's expenses.</p>
          </div>
          <div className="flex flex-col">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount to Release (INR)</label>
             <input type="number" required value={salaryAmt} onChange={e => setSalaryAmt(e.target.value)} className="w-full border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-blue-500 font-black text-4xl text-slate-800" />
          </div>
          <button onClick={handleSalaryPayment} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Settle Payment</button>
        </div>
      </Modal>

      <ConfirmDialog 
        isOpen={!!isDeleteStaffOpen} 
        onClose={() => setIsDeleteStaffOpen(null)} 
        onConfirm={() => { setStaff(staff.map((st: any) => st.id === isDeleteStaffOpen ? {...st, isDeleted: true} : st)); setIsDeleteStaffOpen(null); }}
        title="Archive Employee?"
        message="This staff member will be removed from future rosters. Historical pay records will be preserved."
      />

      <Modal isOpen={!!isAttendanceHistoryOpen} onClose={() => setIsAttendanceHistoryOpen(null)} title="Presence Log">
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{staff.find((s:any) => s.id === isAttendanceHistoryOpen)?.name}'s Attendance for {new Date(selectedDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
            {attendance
              .filter((a:any) => a.staffId === isAttendanceHistoryOpen && a.status === AttendanceStatus.PRESENT && getMonthYear(a.date) === getMonthYear(selectedDate))
              .sort((a:any, b:any) => b.date.localeCompare(a.date))
              .map((a:any) => (
                <div key={a.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-black text-slate-700">{a.date}</span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg uppercase tracking-widest">Present</span>
                </div>
              ))}
            {attendance.filter((a:any) => a.staffId === isAttendanceHistoryOpen && a.status === AttendanceStatus.PRESENT && getMonthYear(a.date) === getMonthYear(selectedDate)).length === 0 && (
              <p className="p-8 text-center text-slate-300 font-bold italic">No days marked present yet.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const CreditView = ({ credits, setCredits }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState<string | null>(null);
  const [range, setRange] = useState({ start: getCurrentDate(), end: getCurrentDate() });
  const [formData, setFormData] = useState({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });

  const filtered = useMemo(() => credits.filter((c: any) => !c.isDeleted && c.date >= range.start && c.date <= range.end), [credits, range]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCredits([{ id: Math.random().toString(36).substr(2, 9), ...formData, amount: parseFloat(formData.amount), status: 'Pending', date: getCurrentDate(), isDeleted: false }, ...credits]);
    setIsModalOpen(false); setFormData({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });
  };

  const handleSettle = () => {
    if (!isSettleOpen) return;
    setCredits(credits.map((x: any) => x.id === isSettleOpen ? {...x, status: 'Paid'} : x));
    setIsSettleOpen(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Receivables</h1>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 bg-white border-2 border-slate-100 p-2 rounded-2xl shadow-sm">
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none cursor-pointer p-1" />
             <ChevronRight size={14} className="text-slate-300" />
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none cursor-pointer p-1" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-8 py-3.5 rounded-[1.25rem] flex items-center gap-2 shadow-2xl shadow-red-100 font-black hover:bg-red-700 transition-all active:scale-95"><Plus size={20} /> Open Credit</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 ? <p className="col-span-full py-24 text-center text-slate-300 font-black bg-white rounded-[2.5rem] border-4 border-dashed border-slate-50">No Pending Debt in Range</p> : filtered.map((c: any) => (
          <div key={c.id} className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${c.status === 'Paid' ? 'bg-emerald-50/30 border-emerald-50 opacity-50 grayscale' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="font-black text-slate-800 text-xl leading-tight mb-1">{c.customerName}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.phone}</p>
              </div>
              <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border-2 ${c.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-100'}`}>{c.status}</span>
            </div>
            <div className="mb-6 space-y-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(c.amount)}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Clock size={14} className="text-slate-300"/> Due: <span className="text-slate-600 font-black">{c.dueDate || 'No Limit'}</span></div>
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-[11px] text-slate-500 font-black leading-relaxed">NOTES: {c.reason.toUpperCase()}</div>
            </div>
            {c.status === 'Pending' && <button onClick={() => setIsSettleOpen(c.id)} className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm shadow-2xl shadow-slate-200 hover:bg-black transition-all">Clear Balance</button>}
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Credit Entry">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Customer Name</label><input type="text" placeholder="Full name..." required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-red-500 font-bold" /></div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Contact</label><input type="tel" placeholder="Phone..." required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-red-500 font-bold" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Debt Amount</label><input type="number" placeholder="₹" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-red-500 font-black text-xl" /></div>
            <DateSelector value={formData.dueDate} onChange={(v:any) => setFormData({...formData, dueDate: v})} label="Due Date" />
          </div>
          <div className="flex flex-col"><label className="text-[10px] font-black text-slate-400 uppercase mb-2">Debt Details</label><textarea placeholder="Specify goods or services..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-red-500 font-medium h-24" /></div>
          <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-red-100 hover:bg-red-700 transition-all">Confirm Credit Entry</button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!isSettleOpen} 
        onClose={() => setIsSettleOpen(null)} 
        onConfirm={handleSettle}
        title="Settle Debt?"
        message="This will mark the customer as fully paid. This action is recorded in the logs."
      />
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
      const inc = income.filter((x: any) => !x.isDeleted && getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      const exp = expenses.filter((x: any) => !x.isDeleted && getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      data.push({ name: d.toLocaleDateString('en-US', { month: 'short' }), income: inc, expense: exp, profit: inc - exp });
    }
    return data;
  }, [income, expenses]);

  return (
    <div className="space-y-12 animate-in fade-in pb-20">
      <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Insights</h1>
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-100 transition-colors duration-1000"></div>
        <h3 className="text-2xl font-black text-slate-800 mb-10 tracking-tight flex items-center gap-3"><BarChart3 size={24} className="text-blue-600"/> Growth Performance</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
              <Tooltip cursor={{fill: '#f8fafc', radius: 24}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}} />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '30px', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}} />
              <Bar dataKey="income" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Expense" />
              <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {last6Months.map((m, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all group">
            <h4 className="font-black text-slate-800 border-b border-slate-50 pb-4 mb-6 flex justify-between items-center">
              <span>{m.name} Financials</span>
              <span className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-xl ${m.profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {m.profit >= 0 ? 'Green' : 'Gap'}
              </span>
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black"><span className="text-slate-400 uppercase tracking-widest">Revenue</span><span className="text-blue-600">{formatCurrency(m.income)}</span></div>
              <div className="flex justify-between text-xs font-black"><span className="text-slate-400 uppercase tracking-widest">Outflow</span><span className="text-orange-600">{formatCurrency(m.expense)}</span></div>
              <div className="flex justify-between items-center border-t border-slate-50 pt-4"><span className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Net Result</span><span className={`text-xl font-black ${m.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(m.profit)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
