export interface User {
    id: number;
    name: string;
    email: string;
};

export interface Category {
    id: number;
    name: string;
};

export interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  date: string;
  title: string;
  amount: number;
  note?: string;
};

export type UsersProps = {
    onChange?: () => void | Promise<void>;
};

export type ExpensesProps = {
    users: User[];
    categories: Category[];
    onChange?: () => void | Promise<void>;
};

export type CategoriesProps = {
    onChange?: ()=> void | Promise<void>;
}