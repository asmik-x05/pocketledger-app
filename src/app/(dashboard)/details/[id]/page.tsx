"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/api/index";
import { Category } from "@/api/category";
import { getCategorySummary, CategorySummary } from "@/api/transaction";
import { Transaction, TransactionCategory } from "@/api/transaction";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";

const CategoryDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [summary, setSummary] = useState<CategorySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTarget, setViewTarget] = useState<Transaction | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const catRes = await api.get(`/categories/${id}`);
        const cat: Category = catRes.data;
        setCategory(cat);

        const [summaryRes, allTxRes] = await Promise.all([
          getCategorySummary(cat.name),
          api.get("/transaction/all"),
        ]);

        setSummary(summaryRes);

        const categoryTx = (allTxRes.data as Transaction[]).filter((t) => {
          if (!t.categoryId) return false;
          const catId =
            typeof t.categoryId === "string"
              ? t.categoryId
              : (t.categoryId as TransactionCategory)._id;
          return catId === id;
        });
        setTransactions(categoryTx);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load category details",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-text-secondary">Loading...</div>;
  }

  if (!category || !summary) {
    return <div className="p-6 text-text-secondary">Not found</div>;
  }
  const getBarColor = (pct: number) => {
    if (pct < 34) return "#dc2626";
    if (pct < 67) return "#f59e0b";
    return "#16a34a";
  };
  const progress =
    category.target > 0
      ? Math.min((summary.balance / category.target) * 100, 100)
      : 0;
  const remaining = Math.max(category.target - summary.balance, 0);

  return (
    <main className="p-6 space-y-6 text-text dark:bg-gray-900 min-h-screen">
      <div className="p-6 space-y-6">
        <Link
          href="/goals"
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors w-fit"
        >
          <FaArrowLeft size={14} />
          Back to Goals
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-text-secondary text-sm">
            Target: Rs. {category.target}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-text-secondary">Target</p>
            <p className="text-2xl font-bold text-text">
              Rs. {category.target}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-text-secondary">Total Saved</p>
            <p className="text-2xl font-bold text-green-500">
              Rs. {summary.totalSavings}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-text-secondary">Total Withdrawn</p>
            <p className="text-2xl font-bold text-red-600">
              Rs. {summary.totalWithdrawals}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-text-secondary">Balance</p>
            <p className="text-2xl font-bold text-primary">
              Rs. {summary.balance}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: getBarColor(progress),
              }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2">
            {remaining > 0 ? `Rs. ${remaining} to go` : "Target reached"}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Transactions in this Goal
          </h2>
          <div className="space-y-2">
            {transactions.length === 0 && (
              <p className="text-text-secondary text-sm">
                No transactions yet.
              </p>
            )}
            {transactions.map((t) => (
              <div
                key={t.id}
                onClick={() => setViewTarget(t)}
                className="flex justify-between items-center bg-surface border border-border rounded-lg p-4 cursor-pointer"
              >
                <div>
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
                <p
                  className={
                    t.type === "SAVING"
                      ? "text-green-500 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  Rs. {t.type === "SAVING" ? "+" : "-"}
                  {t.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {viewTarget && (
        <TransactionDetailModal
          transaction={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </main>
  );
};

export default CategoryDetailPage;
