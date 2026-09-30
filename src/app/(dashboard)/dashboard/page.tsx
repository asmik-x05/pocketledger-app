"use client";

import { useEffect, useState } from "react";
import {
  getSummary,
  getAllTransactions,
  Transaction,
  Summary,
} from "@/api/transaction";
import { toast } from "react-toastify";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";
import { PiEmpty } from "react-icons/pi";

const DashboardPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTarget, setViewTarget] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          getSummary(),
          getAllTransactions(),
        ]);
        setSummary(summaryRes);
        setTransactions(transactionsRes.slice(0, 5));
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-text-secondary">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8 text-text dark:bg-gray-900 min-h-screen ">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-sm text-text-secondary">Total Saved</p>
          <p className="text-2xl font-bold text-green-500">
            Rs. {summary?.totalSavings ?? 0}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-sm text-text-secondary">Total Withdrawn</p>
          <p className="text-2xl font-bold text-red-600">
            Rs. {summary?.totalWithdrawals ?? 0}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-sm text-text-secondary">Balance</p>
          <p className="text-2xl font-bold text-primary">
            Rs. {summary?.balance ?? 0}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <a
            href="/transactions"
            className="text-sm text-primary hover:underline"
          >
            View all
          </a>
        </div>

        <div className="space-y-2">
          {transactions.length === 0 && (
            <div className="flex items-center justify-center text-text-secondary text-sm">
              <div className="flex flex-col items-center gap-2">
                <PiEmpty size={100} />
                No transactions yet.
              </div>
            </div>
          )}
          {transactions.map((t) => (
            <div
              onClick={() => setViewTarget(t)}
              key={t.id}
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
              </div>
              <div className="text-right">
                <p
                  className={
                    t.type === "SAVING"
                      ? "text-green-500 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  Rs. {t.type === "SAVING" ? "+" + t.amount : "-" + t.amount}
                </p>
                <p className="text-xs text-text-muted">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {viewTarget && (
        <TransactionDetailModal
          transaction={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
