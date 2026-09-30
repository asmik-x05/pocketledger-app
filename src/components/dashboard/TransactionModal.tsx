"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Category } from "@/api/category";
import { Transaction, TransactionCategory } from "@/api/transaction";

export interface TransactionFormInput {
  type: "SAVING" | "WITHDRAWAL";
  categoryId: string;
  amount: number;
  note?: string;
  date: string;
}

interface TransactionModalProps {
  mode: "add" | "edit";
  categories: Category[];
  initialData?: Transaction;
  onSubmit: (data: TransactionFormInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const TransactionModal = ({
  mode,
  categories,
  initialData,
  onSubmit,
  onCancel,
  loading,
}: TransactionModalProps) => {
  const { register, handleSubmit, reset } = useForm<TransactionFormInput>();

  useEffect(() => {
    if (initialData) {
      const categoryId =
        typeof initialData.categoryId === "string"
          ? initialData.categoryId
          : (initialData.categoryId as TransactionCategory)._id;

      reset({
        type: initialData.type,
        categoryId,
        amount: initialData.amount,
        note: initialData.note,
        date: initialData.date.slice(0, 10),
      });
    } else {
      reset({
        type: "SAVING",
        categoryId: categories[0]?.id || "",
        amount: undefined,
        note: "",
        date: new Date().toISOString().slice(0, 10),
      });
    }
  }, [initialData, categories]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">
          {mode === "add" ? "Add Transaction" : "Edit Transaction"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="type" className="block mb-2 text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              required
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 bg-surface"
              {...register("type")}
            >
              <option value="SAVING">Saving</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block mb-2 text-sm font-medium"
            >
              Goal
            </label>
            <select
              id="categoryId"
              required
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 bg-surface"
              {...register("categoryId")}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block mb-2 text-sm font-medium">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              required
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 placeholder-text-muted bg-transparent"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label htmlFor="date" className="block mb-2 text-sm font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 bg-transparent"
              {...register("date")}
            />
          </div>

          <div>
            <label htmlFor="note" className="block mb-2 text-sm font-medium">
              Note (optional)
            </label>
            <input
              type="text"
              id="note"
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 placeholder-text-muted bg-transparent"
              placeholder="e.g. Salary bonus"
              {...register("note")}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-border rounded-lg text-sm px-4 py-2.5 bg-red-600 hover:bg-red-700 transition-colors cursor-pointer text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white font-medium rounded-lg text-sm px-4 py-2.5 bg-btn-primary hover:bg-btn-primary-hover transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? "Saving..." : mode === "add" ? "Add" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
