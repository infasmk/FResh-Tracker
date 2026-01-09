
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
  Calendar
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
  // State
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  
  // Data State
  const [income, setIncome] = useState<IncomeEntry[]>(() => {
    const saved = localStorage.getItem('hf_income');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    const saved = localStorage.getItem('hf_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('hf_staff');
    return saved ? JSON.parse(saved) : [];
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('hf_attendance');
    return saved ? JSON.parse(saved) : [];
  });
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(() => {
    const saved = localStorage.getItem('hf_salaries');
    return saved ? JSON.parse(saved) : [];
  });
  const [credits, setCredits] = useState<CreditRecord[]>(() => {
    const saved = localStorage.getItem('hf_credits');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to Storage
  useEffect(() => {
    localStorage.setItem('hf_income', JSON.stringify(income));
    localStorage.setItem('hf_expenses', JSON.stringify(expenses));
    localStorage.setItem('hf_staff', JSON.stringify(staff));
    localStorage.setItem('hf_attendance', JSON.stringify(attendance));
    localStorage.setItem('hf_salaries', JSON.stringify(salaryPayments));
    localStorage.setItem('hf_credits', JSON.stringify(credits));
  }, [income, expenses, staff, attendance, salaryPayments, credits]);

  // Calculations
  const stats = useMemo(() => {
    const activeIncome = income.filter(i => !i.isDeleted);
    const activeExpenses = expenses.filter(e => !e.isDeleted);
    const activeCredits = credits.filter(c => !c.isDeleted);
    const currentMonth = getMonthYear(selectedDate);

    const dateIncome = activeIncome.filter(i => i.date === selectedDate).reduce((sum, i) => sum + i.amount, 0);
    const dateExpenses = activeExpenses.filter(e => e.date === selectedDate).reduce((sum, e) => sum + e.amount, 0);
    
    const monthIncome = activeIncome.filter(i => getMonthYear(i.date) === currentMonth).reduce((sum, i) => sum + i.amount, 0);
    const monthExpenses = activeExpenses.filter(e => getMonthYear(e.date) === currentMonth).reduce((sum, e) => sum + e.amount, 0);

    const pendingCreditsCount = activeCredits.filter(c => c.status === 'Pending').length;
    const pendingCreditsAmount = activeCredits.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0);

    const dateAttendance = attendance.filter(a => a.date === selectedDate);
    const presentCount = dateAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const totalStaff = staff.filter(s => !s.isDeleted).length;

    return {
      dateIncome,
      dateExpenses,
      dateNet: dateIncome - dateExpenses,
      monthIncome,
      monthExpenses,
      monthNet: monthIncome - monthExpenses,
      pendingCreditsCount,
      pendingCreditsAmount,
      presentCount,
      totalStaff
    };
  }, [income, expenses, credits, attendance, staff, selectedDate]);

  // UI Components
  const SidebarItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveView(view); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeView === view 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-8">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BarChart3 className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">HotelFlow</span>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view="income" icon={TrendingUp} label="Daily Income" />
            <SidebarItem view="expenses" icon={TrendingDown} label="Daily Expenses" />
            <SidebarItem view="staff" icon={Users} label="Staff Management" />
            <SidebarItem view="credit" icon={CreditCard} label="Credit Records" />
            <SidebarItem view="reports" icon={BarChart3} label="Reports & Analytics" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">HO</div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">Hotel Owner</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="flex-1 px-4 lg:px-8">
             <div className="hidden lg:block text-slate-500 text-sm font-medium">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
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
          {activeView === 'dashboard' && <DashboardView stats={stats} credits={credits} setCredits={setCredits} income={income} expenses={expenses} selectedDate={selectedDate} />}
          {activeView === 'income' && <IncomeView income={income} setIncome={setIncome} />}
          {activeView === 'expenses' && <ExpenseView expenses={expenses} setExpenses={setExpenses} />}
          {activeView === 'staff' && (
            <StaffView 
              staff={staff} 
              setStaff={setStaff} 
              attendance={attendance} 
              setAttendance={setAttendance} 
              salaryPayments={salaryPayments}
              setSalaryPayments={setSalaryPayments}
              selectedDate={selectedDate}
            />
          )}
          {activeView === 'credit' && <CreditView credits={credits} setCredits={setCredits} />}
          {activeView === 'reports' && <ReportsView income={income} expenses={expenses} credits={credits} staff={staff} salaryPayments={salaryPayments} />}
        </div>
      </main>
    </div>
  );
};

const DashboardView = ({ stats, credits, setCredits, income, expenses, selectedDate }: any) => {
  const pendingCredits = credits.filter((c: CreditRecord) => c.status === 'Pending' && !c.isDeleted);
  
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const inc = income.filter((x: any) => x.date === dateStr && !x.isDeleted).reduce((s: number, x: any) => s + x.amount, 0);
      const exp = expenses.filter((x: any) => x.date === dateStr && !x.isDeleted).reduce((s: number, x: any) => s + x.amount, 0);
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        income: inc,
        expense: exp,
      });
    }
    return data;
  }, [income, expenses, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold text-slate-700">Overview for {selectedDate}</h2>
        {selectedDate === getCurrentDate() && <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Today</span>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 text-white">
          <p className="text-blue-100 text-sm font-medium">Income ({selectedDate})</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.dateIncome)}</h3>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Expenses ({selectedDate})</p>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.dateExpenses)}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Staff Present</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.presentCount} / {stats.totalStaff}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-1">
             <p className="text-slate-500 text-sm font-medium">Credit Pending</p>
             <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold">{stats.pendingCreditsCount}</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.pendingCreditsAmount)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">7-Day Trend (Ending {selectedDate})</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Payments</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {pendingCredits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
                <CheckCircle2 size={40} />
                <p>All cleared!</p>
              </div>
            ) : (
              pendingCredits.map((c: CreditRecord) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-slate-800 text-sm truncate">{c.customerName}</p>
                    <p className="text-sm font-bold text-blue-600 whitespace-nowrap">{formatCurrency(c.amount)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{c.reason}</p>
                    <button 
                      onClick={() => setCredits(credits.map((cr: any) => cr.id === c.id ? {...cr, status: 'Paid'} : cr))}
                      className="text-[10px] bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 px-2 py-1 rounded-md font-bold transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IncomeView = ({ income, setIncome }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    source: IncomeSource.RESTAURANT,
    description: '',
    amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setIncome(income.map((i: any) => i.id === editingId ? { ...i, ...formData, amount: parseFloat(formData.amount) } : i));
    } else {
      const newEntry: IncomeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: formData.date,
        source: formData.source,
        description: formData.description,
        amount: parseFloat(formData.amount),
        isDeleted: false
      };
      setIncome([newEntry, ...income]);
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

  const deleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income entry? This action cannot be undone.')) {
      setIncome(income.map((i: any) => i.id === id ? { ...i, isDeleted: true } : i));
    }
  };

  const filteredIncome = income.filter((i: any) => !i.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Daily Income</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Income
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No income records found</td>
                </tr>
              ) : (
                filteredIncome.map((entry: IncomeEntry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{entry.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        entry.source === IncomeSource.RESTAURANT ? 'bg-blue-50 text-blue-600' :
                        entry.source === IncomeSource.BULK_ORDERS ? 'bg-purple-50 text-purple-600' :
                        entry.source === IncomeSource.ZOMATO ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {entry.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">"{entry.description || '-'}"</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(entry.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(entry)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Income' : 'Record Income'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Source</label>
                <select required value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value as IncomeSource })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500">
                  {Object.values(IncomeSource).map(source => <option key={source} value={source}>{source}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input type="number" step="0.01" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea rows={2} placeholder="Notes..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                {editingId ? 'Update Entry' : 'Save Income Entry'}
              </button>
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
  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    category: ExpenseCategory.CHICKEN,
    description: '',
    amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setExpenses(expenses.map((ex: any) => ex.id === editingId ? { ...ex, ...formData, amount: parseFloat(formData.amount) } : ex));
    } else {
      const newEntry: ExpenseEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        isDeleted: false
      };
      setExpenses([newEntry, ...expenses]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ date: getCurrentDate(), category: ExpenseCategory.CHICKEN, description: '', amount: '' });
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

  const deleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record? This action is permanent.')) {
      setExpenses(expenses.map((e: any) => e.id === id ? { ...e, isDeleted: true } : e));
    }
  };

  const filteredExpenses = expenses.filter((e: any) => !e.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Daily Expenses</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No expense records found</td>
                </tr>
              ) : (
                filteredExpenses.map((entry: ExpenseEntry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{entry.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-slate-100 text-slate-600">
                        {entry.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">"{entry.description || '-'}"</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(entry.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(entry)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Expense' : 'Record Expense'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ExpenseCategory})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500">
                  {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input type="number" step="0.01" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea rows={2} placeholder="Notes..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]">
                {editingId ? 'Update Expense' : 'Save Expense Entry'}
              </button>
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
    const newStaff: Staff = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      monthlySalary: parseFloat(formData.monthlySalary),
      isDeleted: false
    };
    setStaff([...staff, newStaff]);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', role: '', monthlySalary: '' });
  };

  const toggleAttendance = (staffId: string, date: string) => {
    const existing = attendance.find((a: any) => a.staffId === staffId && a.date === date);
    if (existing) {
      setAttendance(attendance.map((a: any) => 
        a.id === existing.id 
        ? { ...a, status: a.status === AttendanceStatus.PRESENT ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT } 
        : a
      ));
    } else {
      setAttendance([...attendance, { 
        id: Math.random().toString(36).substr(2, 9), 
        staffId, 
        date, 
        status: AttendanceStatus.PRESENT 
      }]);
    }
  };

  const activeStaff = staff.filter((s: any) => !s.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-sm text-slate-500 font-medium">Viewing context: {selectedDate}</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('roster')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roster' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Staff List</button>
          <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Attendance</button>
          <button onClick={() => setActiveTab('salary')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'salary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Salary Tracker</button>
        </div>
      </div>

      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onClick={() => setIsModalOpen(true)} className="h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-white group">
            <div className="p-3 rounded-full bg-slate-50 group-hover:bg-blue-50 mb-3 transition-colors"><Plus size={24} /></div>
            <span className="font-bold">Add New Staff</span>
          </button>
          {activeStaff.map((s: Staff) => (
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg uppercase">{s.name.charAt(0)}</div>
                <button onClick={() => window.confirm(`Delete ${s.name}?`) && setStaff(staff.map((st: any) => st.id === s.id ? {...st, isDeleted: true} : st))} className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{s.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{s.role}</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={14} className="text-slate-400" /> {s.phone}</div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><CreditCard size={14} className="text-slate-400" /> {formatCurrency(s.monthlySalary)} / Month</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <h3 className="font-bold text-slate-800">Roster for {selectedDate}</h3>
          </div>
          <div className="p-4 space-y-2">
            {activeStaff.map((s: Staff) => {
              const record = attendance.find((a: any) => a.staffId === s.id && a.date === selectedDate);
              const isPresent = record?.status === AttendanceStatus.PRESENT;
              return (
                <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.role}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleAttendance(s.id, selectedDate)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isPresent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-200 text-slate-600'}`}>
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
             const paid = salaryPayments.filter((p: any) => p.staffId === s.id).reduce((sum: number, p: any) => sum + p.amount, 0);
             const balance = s.monthlySalary - paid;
             return (
               <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400">{s.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{s.name}</h4>
                      <p className="text-xs text-slate-500">Monthly Salary: {formatCurrency(s.monthlySalary)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 md:flex-1 md:justify-center text-center md:text-left">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Paid Already</p>
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(paid)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pending Balance</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(balance)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">Pay Salary</button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all active:scale-95">Advance</button>
                  </div>
               </div>
             );
           })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Add New Staff</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={addStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                  <input type="text" required placeholder="Reception, Chef, etc." value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Monthly Salary (₹)</label>
                <input type="number" required placeholder="0.00" value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] mt-2">Add Staff Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CreditView = ({ credits, setCredits }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCredit: CreditRecord = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: formData.customerName,
      phone: formData.phone,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      dueDate: formData.dueDate,
      status: 'Pending',
      date: getCurrentDate(),
      isDeleted: false
    };
    setCredits([newCredit, ...credits]);
    setIsModalOpen(false);
    setFormData({ customerName: '', phone: '', amount: '', reason: '', dueDate: getCurrentDate() });
  };

  const activeCredits = credits.filter((c: any) => !c.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Credit Records</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95"><Plus size={20} /> Add Credit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCredits.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">No records found</div>
        ) : (
          activeCredits.map((c: CreditRecord) => (
            <div key={c.id} className={`p-6 rounded-2xl border transition-all ${c.status === 'Paid' ? 'bg-emerald-50/30 border-emerald-100 opacity-80' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${c.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{c.customerName.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold text-slate-800">{c.customerName}</h3>
                    <p className="text-xs text-slate-500">{c.phone}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${c.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{c.status}</span>
              </div>
              <div className="space-y-2 mb-6 text-sm">
                 <div className="flex justify-between"><span className="text-slate-400">Amount:</span><span className="font-bold text-slate-800">{formatCurrency(c.amount)}</span></div>
                 <div className="flex justify-between"><span className="text-slate-400">Due:</span><span className="font-medium text-slate-600">{c.dueDate || 'N/A'}</span></div>
                 <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">"{c.reason}"</p>
              </div>
              {c.status === 'Pending' && (
                <button onClick={() => setCredits(credits.map((cr: any) => cr.id === c.id ? {...cr, status: 'Paid'} : cr))} className="w-full bg-white hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-200 font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95">Mark as Paid</button>
              )}
            </div>
          ))
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">New Credit Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Customer</label>
                  <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Amount</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Notes</label>
                <textarea rows={2} required placeholder="Reason for credit..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 mt-4">Record Credit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsView = ({ income, expenses, credits, staff, salaryPayments }: any) => {
  const currentMonth = getMonthYear(getCurrentDate());
  
  const reportData = useMemo(() => {
    const inc = income.filter((i: any) => !i.isDeleted && getMonthYear(i.date) === currentMonth).reduce((s: number, i: any) => s + i.amount, 0);
    const exp = expenses.filter((e: any) => !e.isDeleted && getMonthYear(e.date) === currentMonth).reduce((s: number, e: any) => s + e.amount, 0);
    const profit = inc - exp;
    const sourceBreakdown: any[] = [];
    Object.values(IncomeSource).forEach(src => {
      const val = income.filter((i: any) => !i.isDeleted && getMonthYear(i.date) === currentMonth && i.source === src).reduce((s: number, i: any) => s + i.amount, 0);
      if (val > 0) sourceBreakdown.push({ name: src, value: val });
    });
    const expenseBreakdown: any[] = [];
    Object.values(ExpenseCategory).forEach(cat => {
      const val = expenses.filter((e: any) => !e.isDeleted && getMonthYear(e.date) === currentMonth && e.category === cat).reduce((s: number, e: any) => s + e.amount, 0);
      if (val > 0) expenseBreakdown.push({ name: cat, value: val });
    });
    return { inc, exp, profit, sourceBreakdown, expenseBreakdown };
  }, [income, expenses, currentMonth]);

  const COLORS_ARRAY = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monthly Analytics</h1>
          <p className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => window.print()} className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"><BarChart3 size={18} /> Print Report</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Income</p><h2 className="text-3xl font-black text-blue-600">{formatCurrency(reportData.inc)}</h2></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Expenses</p><h2 className="text-3xl font-black text-orange-600">{formatCurrency(reportData.exp)}</h2></div>
        <div className={`p-6 rounded-2xl border shadow-sm ${reportData.profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Net Profit/Loss</p><h2 className={`text-3xl font-black ${reportData.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(reportData.profit)}</h2></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Income Breakdown</h3>
          <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={reportData.sourceBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{reportData.sourceBreakdown.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS_ARRAY[index % COLORS_ARRAY.length]} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Categories</h3>
          <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={reportData.expenseBreakdown} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} /><Tooltip cursor={{fill: '#f8fafc'}} /><Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={15} /></BarChart></ResponsiveContainer></div>
        </div>
      </div>
    </div>
  );
};

export default App;
