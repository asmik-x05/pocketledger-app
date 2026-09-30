"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { resetPasswordApi } from "@/api/auth";
import logo from "@/assets/images/logo.svg";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

interface ResetPasswordInput {
  password: string;
}

const ResetPasswordPage = () => {
  const { register, handleSubmit } = useForm<ResetPasswordInput>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const submitForm = async (data: ResetPasswordInput) => {
    setLoading(true);
    try {
      const res = await resetPasswordApi({ token, password: data.password });
      toast.success(res.message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface text-text min-h-screen relative">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
      >
        <FaArrowLeft size={14} />
        Back to login
      </Link>

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <p className="flex items-center mb-6 text-2xl font-semibold">
          <Image
            src={logo}
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-8 mr-2"
          />
          Pocket Ledger
        </p>

        <div className="w-full rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 border border-border">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Reset password
            </h1>
            <p className="text-sm text-text-secondary">
              Enter your new password below.
            </p>

            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(submitForm)}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    placeholder="Enter new password"
                    className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 pr-10 placeholder-text-muted bg-transparent"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-btn-primary hover:bg-btn-primary-hover transition-colors cursor-pointer disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
