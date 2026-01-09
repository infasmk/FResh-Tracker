
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
  HandCoins
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
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie 
} from 'recharts';

// --- Custom UI Components ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
        <button 
          onClick={onConfirm} 
          className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

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
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        activeView === view ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeView === view ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 text-blue-600 mb-8 px-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-md shadow-blue-100"><BarChart3 className="text-white" size={20} /></div>
            <span className="text-xl font-black tracking-tight text-slate-900">HotelFlow</span>
          </div>
          <nav className="space-y-1.5 flex-1">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="reminders" icon={Bell} label="Reminders" badge={reminderCount} />
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff & Salary" />
            <SidebarItem view="credit" icon={CreditCard} label="Credits" />
            <SidebarItem view="reports" icon={BarChart3} label="Analytics" />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <h2 className="hidden md:block font-bold text-slate-800 capitalize">{activeView}</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <Calendar size={14} className="text-slate-400" />
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer" 
                />
             </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <DashboardView income={income} expenses={expenses} credits={credits} staff={staff} attendance={attendance} selectedDate={selectedDate} setCredits={setCredits} />}
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

// --- View Components ---

const DashboardView = ({ income, expenses, credits, staff, attendance, selectedDate, setCredits }: any) => {
  const stats = useMemo(() => {
    const activeInc = income.filter((i: any) => !i.isDeleted && i.date === selectedDate).reduce((s: number, i: any) => s + i.amount, 0);
    const activeExp = expenses.filter((e: any) => !e.isDeleted && e.date === selectedDate).reduce((s: number, e: any) => s + e.amount, 0);
    const presentCount = attendance.filter((a: any) => a.date === selectedDate && a.status === AttendanceStatus.PRESENT).length;
    const pendingCredits = credits.filter((c: any) => !c.isDeleted && c.status === 'Pending').reduce((s: number, c: any) => s + c.amount, 0);
    return { income: activeInc, expenses: activeExp, staffPresent: presentCount, totalStaff: staff.filter((s:any) => !s.isDeleted).length, pendingCredits };
  }, [income, expenses, attendance, credits, staff, selectedDate]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overview for {selectedDate}</h2>
          <p className="text-slate-500 text-sm font-medium">Daily operational performance</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-100 text-white relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
          <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1">Income</p>
          <h3 className="text-3xl font-black">{formatCurrency(stats.income)}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Expenses</p>
          <h3 className="text-3xl font-black text-slate-800">{formatCurrency(stats.expenses)}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Present Staff</p>
          <h3 className="text-3xl font-black text-slate-800">{stats.staffPresent} <span className="text-sm text-slate-300 font-bold">/ {stats.totalStaff}</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm border-b-4 border-b-red-500">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Pending Credit</p>
          <h3 className="text-3xl font-black text-red-600">{formatCurrency(stats.pendingCredits)}</h3>
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
    <div className="space-y-8 animate-in fade-in">
      <h1 className="text-3xl font-black text-slate-900">Reminders Center</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">Overdue Payments ({overdueCredits.length})</h2>
          <div className="space-y-3">
            {overdueCredits.length === 0 ? <p className="text-slate-400 text-sm bg-white p-6 rounded-2xl border border-dashed text-center">No overdue credits.</p> : overdueCredits.map((c: any) => (
              <div key={c.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex justify-between items-center group hover:border-red-100 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{c.customerName}</p>
                  <p className="text-xs text-red-500 font-bold">Due {c.dueDate}</p>
                </div>
                <div className="text-right">
                   <p className="font-black text-slate-800">{formatCurrency(c.amount)}</p>
                   <button onClick={() => setCredits(credits.map((cr: any) => cr.id === c.id ? {...cr, status: 'Paid'} : cr))} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all">Clear</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-blue-600 mb-4">Unpaid Staff Salary ({salaryStatus.length})</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 font-bold border-b">
                <tr><th className="p-4">Staff</th><th className="p-4">Pending</th></tr>
              </thead>
              <tbody>
                {salaryStatus.length === 0 ? <tr><td colSpan={2} className="p-8 text-center text-slate-400">All settled.</td></tr> : salaryStatus.map((s: any) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="p-4"><p className="font-bold">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></td>
                    <td className="p-4 font-black text-orange-600">{formatCurrency(s.pending)}</td>
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
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-3xl font-black text-slate-900">Daily Income</h1><p className="text-sm font-bold text-slate-400">Total: <span className="text-blue-600">{formatCurrency(total)}</span></p></div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none cursor-pointer" />
             <ChevronRight size={14} className="text-slate-300" />
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none cursor-pointer" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-100 font-bold active:scale-95 transition-all"><Plus size={18} /> Add New</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-xs font-bold text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Date</th><th className="px-6 py-4">Source</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? <tr><td colSpan={4} className="p-12 text-center text-slate-300 font-medium italic underline underline-offset-4 decoration-slate-100">Empty Logs</td></tr> : filtered.map((i: any) => (
              <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{i.date}</td>
                <td className="px-6 py-4"><span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 uppercase tracking-tighter border border-blue-100">{i.source}</span></td>
                <td className="px-6 py-4 font-black text-slate-800">{formatCurrency(i.amount)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Pencil size={16} /></button>
                    <button onClick={() => setIsDeleteOpen(i.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-blue-500" /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Source</label><select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as any})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-blue-500">{Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div><label className="text-[10px] font-black text-slate-400 uppercase">Amount (₹)</label><input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-blue-500" /></div>
          <div><label className="text-[10px] font-black text-slate-400 uppercase">Notes</label><textarea placeholder="Details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-blue-500 h-20" /></div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 active:scale-[0.98] transition-all">Save Entry</button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!isDeleteOpen} 
        onClose={() => setIsDeleteOpen(null)} 
        onConfirm={() => { setIncome(income.map((x:any) => x.id === isDeleteOpen ? {...x, isDeleted: true} : x)); setIsDeleteOpen(null); }}
        title="Delete Income Entry?"
        message="This record will be permanently removed from your historical logs."
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
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-3xl font-black text-slate-900">Expense Logs</h1><p className="text-sm font-bold text-slate-400">Total: <span className="text-orange-600">{formatCurrency(total)}</span></p></div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none cursor-pointer" />
             <ChevronRight size={14} className="text-slate-300" />
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none cursor-pointer" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl shadow-orange-100 font-bold active:scale-95 transition-all"><Plus size={18} /> Add New</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-xs font-bold text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Date</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? <tr><td colSpan={4} className="p-12 text-center text-slate-300 font-medium italic underline underline-offset-4 decoration-slate-100">Empty Logs</td></tr> : filtered.map((e: any) => (
              <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{e.date}</td>
                <td className="px-6 py-4"><span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 uppercase tracking-tighter border border-slate-200">{e.category}</span></td>
                <td className="px-6 py-4 font-black text-slate-800">{formatCurrency(e.amount)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleEdit(e)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Pencil size={16} /></button>
                    <button onClick={() => setIsDeleteOpen(e.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-orange-500" /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-orange-500">{Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div><label className="text-[10px] font-black text-slate-400 uppercase">Amount (₹)</label><input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-orange-500" /></div>
          <div><label className="text-[10px] font-black text-slate-400 uppercase">Notes</label><textarea placeholder="Details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-slate-100 p-2.5 rounded-2xl outline-none focus:border-orange-500 h-20" /></div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 active:scale-[0.98] transition-all">Save Entry</button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!isDeleteOpen} 
        onClose={() => setIsDeleteOpen(null)} 
        onConfirm={() => { setExpenses(expenses.map((x:any) => x.id === isDeleteOpen ? {...x, isDeleted: true} : x)); setIsDeleteOpen(null); }}
        title="Delete Expense Entry?"
        message="This will impact your monthly profit analytics. Proceed?"
      />
    </div>
  );
};

const StaffView = ({ staff, setStaff, attendance, setAttendance, salaryPayments, setSalaryPayments, expenses, setExpenses, selectedDate }: any) => {
  // ATTENDANCE FIRST
  const [activeTab, setActiveTab] = useState<'attendance' | 'roster' | 'salary'>('attendance');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState<string | null>(null);
  const [salaryAmt, setSalaryAmt] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', role: '', monthlySalary: '' });

  const addStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaff([{ id: Math.random().toString(36).substr(2, 9), ...formData, monthlySalary: parseFloat(formData.monthlySalary), isDeleted: false }, ...staff]);
    setIsStaffModalOpen(false); setFormData({ name: '', phone: '', role: '', monthlySalary: '' });
  };

  const handleSalaryPayment = () => {
    if (!isSalaryModalOpen || !salaryAmt) return;
    const staffId = isSalaryModalOpen;
    const amount = parseFloat(salaryAmt);
    const targetStaff = staff.find((s:any) => s.id === staffId);

    // Record salary payment
    const paymentId = Math.random().toString(36).substr(2, 9);
    setSalaryPayments([{ id: paymentId, staffId, date: selectedDate, amount, type: 'Salary' }, ...salaryPayments]);

    // AUTO-SYNC TO EXPENSES
    const expenseEntry: ExpenseEntry = {
      id: `sal-${paymentId}`,
      date: selectedDate,
      category: ExpenseCategory.OTHER, // Using 'Other' or we could add 'Salary' to the enum if allowed, but for now 'Other' with description
      description: `Salary/Advance Payment for ${targetStaff?.name || 'Staff'}`,
      amount: amount,
      isDeleted: false
    };
    setExpenses([expenseEntry, ...expenses]);

    setIsSalaryModalOpen(null);
    setSalaryAmt('');
  };

  const activeStaff = staff.filter((s: any) => !s.isDeleted);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-3xl font-black text-slate-900">Staff Management</h1><p className="text-sm font-medium text-slate-400">Manage your workforce & payroll</p></div>
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl shadow-inner w-full md:w-auto overflow-x-auto">
          <button onClick={() => setActiveTab('attendance')} className={`flex-1 md:flex-none whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Attendance</button>
          <button onClick={() => setActiveTab('salary')} className={`flex-1 md:flex-none whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'salary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Salary Tracker</button>
          <button onClick={() => setActiveTab('roster')} className={`flex-1 md:flex-none whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'roster' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Staff List</button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeStaff.length === 0 ? <p className="col-span-full py-20 text-center text-slate-400 bg-white rounded-3xl border-2 border-dashed">No staff records to track attendance.</p> : activeStaff.map((s: Staff) => {
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
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer select-none group relative overflow-hidden ${isPresent ? 'bg-emerald-50/50 border-emerald-100 shadow-sm shadow-emerald-50' : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${isPresent ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{s.name.charAt(0)}</div>
                    <div><h4 className="font-black text-slate-800 tracking-tight">{s.name}</h4><p className="text-[10px] font-bold text-slate-400 uppercase">{s.role}</p></div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPresent ? 'bg-emerald-500 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-300'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                {isPresent && <span className="absolute -right-4 -bottom-4 text-emerald-100 font-black text-6xl opacity-20 pointer-events-none uppercase">Present</span>}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-4">
          {activeStaff.map((s: Staff) => {
            const paid = salaryPayments.filter((p: any) => p.staffId === s.id && getMonthYear(p.date) === getMonthYear(selectedDate)).reduce((acc: number, curr: any) => acc + curr.amount, 0);
            const balance = s.monthlySalary - paid;
            const progress = Math.min(100, (paid / s.monthlySalary) * 100);
            return (
              <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-auto flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xl text-slate-300 border border-slate-100">{s.name.charAt(0)}</div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800">{s.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.role}</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-3">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Current Payout: {formatCurrency(paid)}</span>
                    <span>Total Pay: {formatCurrency(s.monthlySalary)}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-sm font-bold text-orange-600 flex items-center gap-1.5"><Clock size={14}/> Pending: {formatCurrency(balance)}</p>
                    <button onClick={() => { setSalaryAmt(balance.toString()); setIsSalaryModalOpen(s.id); }} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg shadow-slate-200 flex items-center gap-2 hover:bg-black transition-all active:scale-95"><HandCoins size={14}/> Record Pay</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onClick={() => setIsStaffModalOpen(true)} className="h-48 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-white group p-6">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"><Plus size={24} /></div>
            <span className="font-bold">Register New Staff</span>
          </button>
          {activeStaff.map((s: Staff) => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-100">{s.name.charAt(0)}</div>
                <button onClick={() => window.confirm(`Remove ${s.name}?`) && setStaff(staff.map((st: any) => st.id === s.id ? {...st, isDeleted: true} : st))} className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-xl"><Trash2 size={16} /></button>
              </div>
              <h3 className="font-black text-slate-800 text-lg leading-tight">{s.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{s.role}</p>
              <div className="space-y-2 border-t pt-4">
                <div className="text-xs text-slate-500 flex items-center gap-2 font-medium"><Phone size={14} className="text-slate-300" /> {s.phone}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 font-medium"><HandCoins size={14} className="text-slate-300" /> {formatCurrency(s.monthlySalary)} / Month</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title="New Staff Member">
        <form onSubmit={addStaff} className="space-y-4">
          <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold" />
          <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold" />
          <input type="text" placeholder="Job Title (e.g. Chef)" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold" />
          <input type="number" placeholder="Monthly Salary" required value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold" />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">Complete Registration</button>
        </form>
      </Modal>

      <Modal isOpen={!!isSalaryModalOpen} onClose={() => setIsSalaryModalOpen(null)} title="Record Salary Payment">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Record a salary or advance payment for <b>{staff.find((s:any) => s.id === isSalaryModalOpen)?.name}</b>. This will be auto-added to Expenses.</p>
          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Payment Amount (₹)</label>
             <input type="number" required value={salaryAmt} onChange={e => setSalaryAmt(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-black text-xl" />
          </div>
          <button onClick={handleSalaryPayment} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Execute Payment</button>
        </div>
      </Modal>
    </div>
  );
};

const CreditView = ({ credits, setCredits }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [range, setRange] = useState({ start: getCurrentDate(), end: getCurrentDate() });
  const [formData, setFormData] = useState({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });

  const filtered = useMemo(() => credits.filter((c: any) => !c.isDeleted && c.date >= range.start && c.date <= range.end), [credits, range]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCredits([{ id: Math.random().toString(36).substr(2, 9), ...formData, amount: parseFloat(formData.amount), status: 'Pending', date: getCurrentDate(), isDeleted: false }, ...credits]);
    setIsModalOpen(false); setFormData({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black text-slate-900">Credit Records</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none cursor-pointer" />
             <ChevronRight size={14} className="text-slate-300" />
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none cursor-pointer" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl shadow-red-100 font-bold hover:bg-red-700 transition-all"><Plus size={20} /> New Credit</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? <p className="col-span-full py-20 text-center text-slate-300 font-bold bg-white rounded-3xl border-2 border-dashed">No credit records in range.</p> : filtered.map((c: any) => (
          <div key={c.id} className={`p-6 rounded-3xl border-2 transition-all ${c.status === 'Paid' ? 'bg-emerald-50/50 border-emerald-100 opacity-60 scale-95' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-800 text-lg leading-tight">{c.customerName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.phone}</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${c.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-100'}`}>{c.status}</span>
            </div>
            <div className="mb-4 space-y-1">
              <p className="text-2xl font-black text-slate-900">{formatCurrency(c.amount)}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Clock size={12}/> Due: {c.dueDate || 'Immediate'}</div>
              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 font-medium italic">"{c.reason}"</div>
            </div>
            {c.status === 'Pending' && <button onClick={() => setCredits(credits.map((x: any) => x.id === c.id ? {...x, status: 'Paid'} : x))} className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-black shadow-lg hover:bg-black transition-all">Clear Balance</button>}
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Credit Log">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Customer Name" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-red-500 font-bold" />
          <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-red-500 font-bold" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Credit Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-red-500 font-bold" />
            <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-red-500 font-bold" />
          </div>
          <textarea placeholder="Reason/Items..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-red-500 font-medium h-24" />
          <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition-all">Record Entry</button>
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
      const inc = income.filter((x: any) => !x.isDeleted && getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      const exp = expenses.filter((x: any) => !x.isDeleted && getMonthYear(x.date) === my).reduce((s: number, x: any) => s + x.amount, 0);
      data.push({ name: d.toLocaleDateString('en-US', { month: 'short' }), income: inc, expense: exp, profit: inc - exp });
    }
    return data;
  }, [income, expenses]);

  return (
    <div className="space-y-10 animate-in fade-in">
      <h1 className="text-3xl font-black text-slate-900">Profit Analytics</h1>
      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Financial Performance (6 Months)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              <Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Expenses" />
              <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {last6Months.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
            <h4 className="font-black text-slate-800 border-b border-slate-50 pb-3 mb-5 flex justify-between items-center">
              <span>{m.name} {new Date().getFullYear()}</span>
              <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg ${m.profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {m.profit >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Revenue</span><span className="font-bold text-blue-600">{formatCurrency(m.income)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Spend</span><span className="font-bold text-orange-600">{formatCurrency(m.expense)}</span></div>
              <div className="flex justify-between items-center border-t border-slate-50 pt-3"><span className="font-black text-slate-800">Net</span><span className={`text-lg font-black ${m.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(m.profit)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
