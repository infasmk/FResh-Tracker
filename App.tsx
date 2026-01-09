
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
  Clock
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

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  
  // Persistence states
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

  const SidebarItem = ({ view, icon: Icon, label, badge }: { view: View, icon: any, label: string, badge?: number }) => (
    <button
      onClick={() => { setActiveView(view); setIsSidebarOpen(false); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
        activeView === view ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
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
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-8">
            <div className="bg-blue-600 p-1.5 rounded-lg"><BarChart3 className="text-white" size={20} /></div>
            <span className="text-xl font-bold tracking-tight text-slate-900">HotelFlow</span>
          </div>
          <nav className="space-y-1">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="reminders" icon={Bell} label="Reminders" badge={reminderCount} />
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff" />
            <SidebarItem view="credit" icon={CreditCard} label="Credits" />
            <SidebarItem view="reports" icon={BarChart3} label="Analytics" />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex-1 px-4 lg:px-8">
             <div className="hidden lg:block text-slate-500 text-sm font-medium">Hotel Management Portal</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar size={16} className="text-slate-400" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer" 
              />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <DashboardView income={income} expenses={expenses} credits={credits} staff={staff} attendance={attendance} selectedDate={selectedDate} setCredits={setCredits} />}
          {activeView === 'reminders' && <RemindersView credits={credits} staff={staff} salaryPayments={salaryPayments} setCredits={setCredits} />}
          {activeView === 'income' && <IncomeView income={income} setIncome={setIncome} />}
          {activeView === 'expenses' && <ExpenseView expenses={expenses} setExpenses={setExpenses} />}
          {activeView === 'staff' && <StaffView staff={staff} setStaff={setStaff} attendance={attendance} setAttendance={setAttendance} salaryPayments={salaryPayments} setSalaryPayments={setSalaryPayments} selectedDate={selectedDate} />}
          {activeView === 'credit' && <CreditView credits={credits} setCredits={setCredits} />}
          {activeView === 'reports' && <ReportsView income={income} expenses={expenses} />}
        </div>
      </main>
    </div>
  );
};

const DashboardView = ({ income, expenses, credits, staff, attendance, selectedDate, setCredits }: any) => {
  const stats = useMemo(() => {
    const activeInc = income.filter((i: any) => !i.isDeleted && i.date === selectedDate).reduce((s: number, i: any) => s + i.amount, 0);
    const activeExp = expenses.filter((e: any) => !e.isDeleted && e.date === selectedDate).reduce((s: number, e: any) => s + e.amount, 0);
    const presentCount = attendance.filter((a: any) => a.date === selectedDate && a.status === AttendanceStatus.PRESENT).length;
    const pendingCredits = credits.filter((c: any) => !c.isDeleted && c.status === 'Pending').reduce((s: number, c: any) => s + c.amount, 0);
    return { income: activeInc, expenses: activeExp, staffPresent: presentCount, totalStaff: staff.filter((s:any) => !s.isDeleted).length, pendingCredits };
  }, [income, expenses, attendance, credits, staff, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">Overview for {selectedDate}</h2>
        {selectedDate === getCurrentDate() && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Today</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 text-white">
          <p className="text-blue-100 text-sm font-medium">Income</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.income)}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Expenses</p>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.expenses)}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Staff Present</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.staffPresent} / {stats.totalStaff}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Pending Credit</p>
          <h3 className="text-2xl font-bold text-red-600">{formatCurrency(stats.pendingCredits)}</h3>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Selected Date Summary</h3>
        <p className="text-slate-500 text-sm">
          On <b>{selectedDate}</b>, the net balance was <b className={stats.income - stats.expenses >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatCurrency(stats.income - stats.expenses)}</b>.
          Staff attendance was at {stats.totalStaff > 0 ? Math.round((stats.staffPresent / stats.totalStaff) * 100) : 0}%.
        </p>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Bell className="text-blue-600" /> Critical Reminders</h1>
        <p className="text-slate-500 text-sm">Automated alerts for payments and dues.</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2"><AlertCircle size={18} /> Overdue Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overdueCredits.length === 0 ? <p className="text-slate-400 text-sm">No overdue credits.</p> : overdueCredits.map((c: any) => (
            <div key={c.id} className="bg-red-50 border border-red-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-slate-900">{c.customerName}</p>
                <p className="text-xs text-red-600 font-bold uppercase">Overdue since {c.dueDate}</p>
                <p className="text-lg font-black text-slate-800 mt-1">{formatCurrency(c.amount)}</p>
              </div>
              <button onClick={() => setCredits(credits.map((cr: any) => cr.id === c.id ? {...cr, status: 'Paid'} : cr))} className="bg-white text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all">Clear</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2"><Clock size={18} /> Salary Reminders ({new Date().toLocaleDateString('en-US', {month: 'long'})})</h2>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Staff Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Monthly Pay</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Paid So Far</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salaryStatus.length === 0 ? <tr><td colSpan={4} className="p-6 text-center text-slate-400">All staff salaries settled.</td></tr> : salaryStatus.map((s: any) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                  <td className="px-6 py-4 text-slate-500">{formatCurrency(s.monthlySalary)}</td>
                  <td className="px-6 py-4 text-emerald-600 font-medium">{formatCurrency(s.paid)}</td>
                  <td className="px-6 py-4"><span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold">{formatCurrency(s.pending)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const IncomeView = ({ income, setIncome }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleEdit = (entry: IncomeEntry) => {
    setEditingId(entry.id);
    setFormData({
      date: entry.date,
      source: entry.source,
      description: entry.description,
      amount: entry.amount.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      setIncome(income.map((i: any) => i.id === id ? { ...i, isDeleted: true } : i));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Income Logs</h1>
          <p className="text-sm text-slate-500 font-bold">Total in Range: <span className="text-blue-600">{formatCurrency(total)}</span></p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-xl shadow-sm">
             <div className="flex items-center gap-1">
               <span className="text-[10px] text-slate-400 font-bold">FROM</span>
               <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none" />
             </div>
             <div className="w-px h-4 bg-slate-200"></div>
             <div className="flex items-center gap-1">
               <span className="text-[10px] text-slate-400 font-bold">TO</span>
               <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none" />
             </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"><Plus size={20} /> Add Income</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-slate-400">No records found for this date range.</td></tr> : filtered.map((i: any) => (
              <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{i.date}</td>
                <td className="px-6 py-4"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">{i.source}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">{i.description || '-'}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(i.amount)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(i)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(i.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Income Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">DATE</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">SOURCE</label>
                <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as any})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500">
                  {Object.values(IncomeSource).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">AMOUNT (₹)</label>
                <input type="number" step="0.01" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">NOTES</label>
                <textarea placeholder="Optional details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 border py-2 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 shadow-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ExpenseView = ({ expenses, setExpenses }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleEdit = (entry: ExpenseEntry) => {
    setEditingId(entry.id);
    setFormData({
      date: entry.date,
      category: entry.category,
      description: entry.description,
      amount: entry.amount.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      setExpenses(expenses.map((e: any) => e.id === id ? { ...e, isDeleted: true } : e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expense Logs</h1>
          <p className="text-sm text-slate-500 font-bold">Total in Range: <span className="text-orange-600">{formatCurrency(total)}</span></p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-xl shadow-sm">
             <div className="flex items-center gap-1">
               <span className="text-[10px] text-slate-400 font-bold">FROM</span>
               <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none" />
             </div>
             <div className="w-px h-4 bg-slate-200"></div>
             <div className="flex items-center gap-1">
               <span className="text-[10px] text-slate-400 font-bold">TO</span>
               <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none" />
             </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95"><Plus size={20} /> Add Expense</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-slate-400">No expenses recorded for this date range.</td></tr> : filtered.map((e: any) => (
              <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{e.date}</td>
                <td className="px-6 py-4"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">{e.category}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">{e.description || '-'}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(e.amount)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(e)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(e.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'New'} Expense Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">DATE</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">CATEGORY</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full border p-2.5 rounded-xl outline-none focus:border-orange-500">
                  {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">AMOUNT (₹)</label>
                <input type="number" step="0.01" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">DESCRIPTION</label>
                <textarea placeholder="Notes..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-orange-500" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 border py-2 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700 shadow-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StaffView = ({ staff, setStaff, attendance, setAttendance, salaryPayments, setSalaryPayments, selectedDate }: any) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'attendance' | 'salary'>('roster');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', role: '', monthlySalary: '' });

  const addStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaff([{ id: Math.random().toString(36).substr(2, 9), ...formData, monthlySalary: parseFloat(formData.monthlySalary), isDeleted: false }, ...staff]);
    setIsModalOpen(false); setFormData({ name: '', phone: '', role: '', monthlySalary: '' });
  };

  const activeStaff = staff.filter((s: any) => !s.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl shadow-inner">
          <button onClick={() => setActiveTab('roster')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roster' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Staff List</button>
          <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Attendance</button>
          <button onClick={() => setActiveTab('salary')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'salary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Salary Tracker</button>
        </div>
      </div>

      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onClick={() => setIsModalOpen(true)} className="h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-white group">
            <Plus size={24} className="mb-2" />
            <span className="font-bold">Add Staff</span>
          </button>
          {activeStaff.map((s: Staff) => (
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg uppercase">{s.name.charAt(0)}</div>
                <button onClick={() => window.confirm(`Remove ${s.name} from records?`) && setStaff(staff.map((st: any) => st.id === s.id ? {...st, isDeleted: true} : st))} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{s.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{s.role}</p>
              <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-600 flex items-center gap-2 font-medium"><Phone size={14} className="text-slate-400" /> {s.phone}</div>
                <div className="text-xs text-slate-600 flex items-center gap-2 font-medium"><CreditCard size={14} className="text-slate-400" /> {formatCurrency(s.monthlySalary)} / Month</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 font-bold border-b border-slate-100 flex justify-between items-center">
            <span>Roster Check: {selectedDate}</span>
            <span className="text-[10px] text-slate-400">Mark daily attendance</span>
          </div>
          <div className="p-4 space-y-2">
            {activeStaff.length === 0 ? <p className="p-8 text-center text-slate-400">No staff found.</p> : activeStaff.map((s: Staff) => {
              const record = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
              const isPresent = record?.status === AttendanceStatus.PRESENT;
              return (
                <div key={s.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                      <p className="text-[10px] text-slate-500">{s.role}</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    const existing = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
                    if (existing) {
                      setAttendance(attendance.map((a: any) => a.id === existing.id ? { ...a, status: a.status === AttendanceStatus.PRESENT ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT } : a));
                    } else {
                      setAttendance([...attendance, { id: Math.random().toString(36).substr(2, 9), staffId: s.id, date: selectedDate, status: AttendanceStatus.PRESENT }]);
                    }
                  }} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${isPresent ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-200 text-slate-600'}`}>
                    {isPresent ? 'Present' : 'Absent'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-4">
          {activeStaff.map((s: Staff) => {
            const paid = salaryPayments.filter((p: any) => p.staffId === s.id && getMonthYear(p.date) === getMonthYear(selectedDate)).reduce((acc: number, curr: any) => acc + curr.amount, 0);
            return (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{s.name}</h4>
                  <p className="text-xs text-slate-500">Pay Scale: {formatCurrency(s.monthlySalary)}</p>
                </div>
                <div className="text-right flex-1 px-8">
                   <p className="text-xs text-slate-400 font-bold">CURRENT MONTH</p>
                   <div className="flex items-center gap-4 justify-end">
                     <p className="text-sm font-bold text-emerald-600 whitespace-nowrap">Paid: {formatCurrency(paid)}</p>
                     <p className="text-sm font-bold text-orange-600 whitespace-nowrap">Bal: {formatCurrency(s.monthlySalary - paid)}</p>
                   </div>
                </div>
                <button onClick={() => {
                  const amt = prompt('Amount to pay?', (s.monthlySalary - paid).toString());
                  if (amt) {
                    setSalaryPayments([{ id: Math.random().toString(36).substr(2, 9), staffId: s.id, date: selectedDate, amount: parseFloat(amt), type: 'Salary' }, ...salaryPayments]);
                  }
                }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md">Record Payment</button>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800">New Staff Member</h2>
            <form onSubmit={addStaff} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              <input type="text" placeholder="Designation (e.g. Chef, Billing)" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              <input type="number" placeholder="Monthly Salary" required value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-blue-500" />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border py-2.5 rounded-xl hover:bg-slate-50 font-semibold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg">Add to Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Credit Logs</h1>
        <div className="flex gap-2 bg-white border px-3 py-1.5 rounded-xl shadow-sm">
           <div className="flex items-center gap-1">
             <span className="text-[10px] text-slate-400 font-bold">FROM</span>
             <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="text-xs font-bold outline-none" />
           </div>
           <div className="w-px h-4 bg-slate-200 mx-1"></div>
           <div className="flex items-center gap-1">
             <span className="text-[10px] text-slate-400 font-bold">TO</span>
             <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="text-xs font-bold outline-none" />
           </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-red-700 transition-all active:scale-95"><Plus size={20} /> New Credit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? <p className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No logs for this range.</p> : filtered.map((c: any) => (
          <div key={c.id} className={`p-6 rounded-2xl border transition-all ${c.status === 'Paid' ? 'bg-emerald-50 border-emerald-100 opacity-70' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-800">{c.customerName}</h3>
                <p className="text-xs text-slate-500 font-medium">{c.phone}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${c.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{c.status}</span>
            </div>
            <div className="mb-4">
              <p className="text-lg font-black text-slate-800">{formatCurrency(c.amount)}</p>
              <p className="text-xs text-slate-400 font-medium">Recorded: {c.date} • Due: {c.dueDate || 'N/A'}</p>
              <p className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">"{c.reason}"</p>
            </div>
            {c.status === 'Pending' && <button onClick={() => setCredits(credits.map((x: any) => x.id === c.id ? {...x, status: 'Paid'} : x))} className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">Mark as Paid</button>}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-800">New Credit Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Customer Name" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-red-500" />
              <input type="tel" placeholder="Contact Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-red-500" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-red-500" />
                <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-red-500" />
              </div>
              <textarea placeholder="Reason / Items..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full border p-2.5 rounded-xl outline-none focus:border-red-500" />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border py-2.5 rounded-xl hover:bg-slate-50 font-semibold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 shadow-lg transition-all">Record Credit</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Financial Analytics</h1>
        <p className="text-slate-500 text-sm font-medium">Track your progress over time with historical charts.</p>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Profit Performance (Last 6 Months)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Legend />
              <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {last6Months.map((m, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
            <h4 className="font-bold text-slate-800 border-b border-slate-50 pb-2 mb-4 flex justify-between">
              <span>{m.name} Stats</span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${m.profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {m.profit >= 0 ? 'Profit' : 'Loss'}
              </span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Income:</span><span className="font-bold text-blue-600">{formatCurrency(m.income)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Expenses:</span><span className="font-bold text-orange-600">{formatCurrency(m.expense)}</span></div>
              <div className="flex justify-between border-t border-slate-50 pt-2"><span className="font-bold text-slate-800">Net:</span><span className={`font-black ${m.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(m.profit)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
