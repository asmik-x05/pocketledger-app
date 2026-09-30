import api from "./index";

export interface TransactionCategory {
  _id: string;
  name: string;
}
export interface Transaction {
  id: string;
  categoryId: string | TransactionCategory;
  type: "SAVING" | "WITHDRAWAL";
  amount: number;
  note?: string;
  date: string;
}
export interface CategorySummary {
  totalSavings: number;
  totalWithdrawals: number;
  balance: number;
}

export interface Summary {
  totalSavings: number;
  totalWithdrawals: number;
  balance: number;
}

export interface CreateTransactionInput {
  categoryId: string;
  type: "SAVING" | "WITHDRAWAL";
  amount: number;
  note?: string;
  date: string;
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("/transaction/all");
  return response.data;
};

export const getSummary = async (): Promise<Summary> => {
  const response = await api.get("/transaction/user/summary");
  return response.data;
};

export const createTransaction = async (
  data: CreateTransactionInput,
): Promise<Transaction> => {
  const response = await api.post("/transaction", data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transaction/${id}`);
};

export const updateTransaction = async (
  id: string,
  data: CreateTransactionInput,
): Promise<Transaction> => {
  const response = await api.put(`/transaction/${id}`, data);
  return response.data;
};

export const getTransactionsById = async (id: string): Promise<Transaction> => {
  const response = await api.get(`/transaction/${id}`);
  return response.data;
};

export const getCategorySummary = async (
  categoryName: string,
): Promise<CategorySummary> => {
  const response = await api.get(
    `/transaction/category/${categoryName}/summary`,
  );
  return response.data;
};
