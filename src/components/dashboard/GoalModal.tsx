"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CreateCategoryInput, Category } from "@/api/category";

interface GoalModalProps {
  mode: "add" | "edit";
  initialData?: Category;
  onSubmit: (data: CreateCategoryInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const GoalModal = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading,
}: GoalModalProps) => {
  const { register, handleSubmit, reset } = useForm<CreateCategoryInput>();

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name, target: initialData.target });
    } else {
      reset({ name: "", target: undefined });
    }
  }, [initialData]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">
          {mode === "add" ? "Add Goal" : "Edit Goal"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 placeholder-text-muted bg-transparent"
              placeholder="e.g. Emergency Fund"
              {...register("name")}
            />
          </div>
          <div>
            <label htmlFor="target" className="block mb-2 text-sm font-medium">
              Target
            </label>
            <input
              type="number"
              id="target"
              step="0.01"
              required
              className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 placeholder-text-muted bg-transparent"
              placeholder="0.00"
              {...register("target", { valueAsNumber: true })}
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
              {loading ? "Saving..." : mode === "add" ? "Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
