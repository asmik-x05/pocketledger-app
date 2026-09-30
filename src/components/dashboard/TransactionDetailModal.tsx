"use client";

import { useEffect } from "react";
import { Transaction, TransactionCategory } from "@/api/transaction";

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetailModal = ({
  transaction,
  onClose,
}: TransactionDetailModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const categoryName =
    typeof transaction.categoryId === "string"
      ? transaction.categoryId
      : (transaction.categoryId as TransactionCategory).name;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-700 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        <div
          className={
            transaction.type === "SAVING"
              ? "text-2xl font-bold text-green-500"
              : "text-2xl font-bold text-red-600"
          }
        >
          Rs. {transaction.type === "SAVING" ? "+" : "-"}
          {transaction.amount}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Type</span>
            <span className="font-medium">{transaction.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Goal</span>
            <span className="font-medium">{categoryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Date</span>
            <span className="font-medium">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
          </div>
          {transaction.note && (
            <div className="flex justify-between">
              <span className="text-text-secondary">Note</span>
              <span className="font-medium text-right">{transaction.note}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full border text-white border-border rounded-lg text-sm px-4 py-2.5 bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
