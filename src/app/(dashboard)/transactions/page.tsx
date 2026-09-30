"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllTransactions,
  deleteTransaction,
  createTransaction,
  Transaction,
} from "@/api/transaction";
import { getAllCategories, Category } from "@/api/category";
import api from "@/api/index";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa6";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import TransactionModal, {
  TransactionFormInput,
} from "@/components/dashboard/TransactionModal";
import { PiEmpty } from "react-icons/pi";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "SAVING" | "WITHDRAWAL">("ALL");

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewTarget, setViewTarget] = useState<Transaction | null>(null);
  const fetchData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        getAllTransactions(),
        getAllCategories(),
      ]);
      setTransactions(txRes);
      setCategories(catRes);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load transactions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTransaction(deleteTarget.id);
      setTransactions((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success("Transaction deleted");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const submitAdd = async (data: TransactionFormInput) => {
    setSaving(true);
    try {
      const newTransaction = await createTransaction(data);
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("Transaction added");
      setShowAdd(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add transaction");
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (data: TransactionFormInput) => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await api.put(`/transaction/${editing.id}`, data);
      setTransactions((prev) =>
        prev.map((t) => (t.id === editing.id ? res.data : t)),
      );
      toast.success("Transaction updated");
      setEditing(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update transaction",
      );
    } finally {
      setSaving(false);
    }
  };

  const filtered =
    filter === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  if (loading) {
    return <div className="p-6 text-text-secondary">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 text-text dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg bg-btn-primary text-white hover:bg-btn-primary-hover transition-colors text-sm font-medium flex items-center gap-2 cursor-pointer outline-0"
        >
          <span>Add Transaction</span> <FaPlus />
        </button>
      </div>

      <div className="flex gap-2">
        {(["ALL", "SAVING", "WITHDRAWAL"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors cursor-pointer ${
              filter === f
                ? "bg-btn-primary text-white border-primary"
                : "border-border text-text-secondary hover:bg-btn-primary-hover hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center text-text-secondary text-sm">
            <div className="flex flex-col items-center gap-2">
              <PiEmpty size={100} />
              No transactions yet.
            </div>
          </div>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center bg-surface border border-border rounded-lg p-4"
          >
            <div
              onClick={() => setViewTarget(t)}
              className="flex-1 cursor-pointer"
            >
              <p
                className={
                  t.type === "SAVING"
                    ? "text-green-500 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {t.type}
              </p>
              <p className="text-xs text-text-secondary">{t.note}</p>
              <p className="text-xs text-text-muted">
                {new Date(t.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={
                  t.type === "SAVING"
                    ? "text-green-500 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                Rs. {t.type === "SAVING" ? "+" + t.amount : "-" + t.amount}
              </p>
              <button
                onClick={() => setEditing(t)}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(t)}
                className="text-sm text-red-600 hover:underline cursor-pointer"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <TransactionModal
          mode="add"
          categories={categories}
          onSubmit={submitAdd}
          onCancel={() => setShowAdd(false)}
          loading={saving}
        />
      )}

      {editing && (
        <TransactionModal
          mode="edit"
          categories={categories}
          initialData={editing}
          onSubmit={submitEdit}
          onCancel={() => setEditing(null)}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Transaction"
          message={`Are you sure you want to delete this ${deleteTarget.type.toLowerCase()} of Rs. ${deleteTarget.amount}? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
      {viewTarget && (
        <TransactionDetailModal
          transaction={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
