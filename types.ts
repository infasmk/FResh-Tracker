
export enum IncomeSource {
  RESTAURANT = 'Restaurant',
  BULK_ORDERS = 'Bulk Orders',
  ZOMATO = 'Zomato',
  OTHER = 'Other'
}

export enum ExpenseCategory {
  CHICKEN = 'Chicken',
  MILK_CURD = 'Milk & Curd',
  GROCERIES = 'Groceries',
  VEGETABLES = 'Vegetables',
  WATER = 'Water',
  FISH = 'Fish',
  SPICES = 'Spices',
  ELECTRICITY = 'Electricity',
  RENT = 'Rent',
  OTHER = 'Other'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent'
}

export interface IncomeEntry {
  id: string;
  date: string;
  source: IncomeSource;
  description: string;
  amount: number;
  isDeleted: boolean;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  isDeleted: boolean;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: string;
  monthlySalary: number;
  isDeleted: boolean;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  status: AttendanceStatus;
}

export interface SalaryPayment {
  id: string;
  staffId: string;
  date: string;
  amount: number;
  type: 'Salary' | 'Advance';
}

export interface CreditRecord {
  id: string;
  customerName: string;
  phone: string;
  amount: number;
  reason: string;
  dueDate?: string;
  status: 'Pending' | 'Paid';
  date: string;
  isDeleted: boolean;
}

export type View = 'dashboard' | 'income' | 'expenses' | 'staff' | 'credit' | 'reports' | 'reminders';
