"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  getAllCategories,
  createCategory,
  Category,
  CreateCategoryInput,
  deleteCategory,
  updateCategory,
} from "@/api/category";
import { getCategorySummary } from "@/api/transaction";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa6";
import ConfirmModal from "@/components/dashboard/ConfirmModal";

import { PiEmpty } from "react-icons/pi";
import GoalModal from "@/components/dashboard/GoalModal";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res);

      const balanceEntries = await Promise.all(
        res.map(async (c) => {
          try {
            const summary = await getCategorySummary(c.name);
            return [c.id, summary.balance] as const;
          } catch {
            return [c.id, 0] as const;
          }
        }),
      );
      setBalances(Object.fromEntries(balanceEntries));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitAdd = async (data: CreateCategoryInput) => {
    setSubmitting(true);
    try {
      const newCategory = await createCategory(data);
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Goal added");
      setShowAdd(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add goal");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Goal deleted");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const submitEdit = async (data: CreateCategoryInput) => {
    if (!editing) return;
    setUpdating(true);
    try {
      await updateCategory(editing.id, data);
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)),
      );
      toast.success("Category updated");
      setEditing(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen dark:bg-gray-900 text-text">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goals</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg bg-primary-hover/90 text-white hover:bg-[#1e2040] transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
        >
          <span>Add Goal</span> <FaPlus />
        </button>
      </div>

      {loading && <p className="text-text-secondary text-sm">Loading...</p>}
      {!loading && categories.length === 0 && (
        <div className="flex items-center justify-center text-text-secondary text-sm">
          <div className="flex flex-col items-center gap-2">
            <PiEmpty size={100} />
            No goals yet.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {categories.map((c) => {
          const balance = balances[c.id] ?? 0;
          const progress =
            c.target > 0 ? Math.min((balance / c.target) * 100, 100) : 0;
          const remaining = Math.max(c.target - balance, 0);

          const getBarColor = (pct: number) => {
            if (pct < 34) return "#dc2626";
            if (pct < 67) return "#f59e0b";
            return "#16a34a";
          };

          return (
            <div
              key={c.id}
              className="bg-surface border border-border rounded-lg p-4  transition-all cursor-pointer"
            >
              <Link href={`/details/${c.id}`} className="cursor-pointer block">
                <p className="font-medium text-text truncate mb-2">{c.name}</p>
                <p className="text-xl font-bold text-primary">Rs. {balance}</p>
                <p className="text-xs text-text-secondary">
                  of Rs. {c.target} target
                </p>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: getBarColor(progress),
                    }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {remaining > 0 ? `Rs. ${remaining} to go` : "Target reached"}
                </p>
              </Link>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => setEditing(c)}
                  className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <FaPen />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  className="text-sm text-red-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <GoalModal
          mode="add"
          onSubmit={submitAdd}
          onCancel={() => setShowAdd(false)}
          loading={submitting}
        />
      )}

      {editing && (
        <GoalModal
          mode="edit"
          initialData={editing}
          onSubmit={submitEdit}
          onCancel={() => setEditing(null)}
          loading={updating}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
