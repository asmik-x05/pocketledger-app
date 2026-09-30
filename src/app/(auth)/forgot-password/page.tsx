"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { forgotPassword } from "@/api/auth";
import logo from "@/assets/images/logo.svg";
import { FaArrowLeft } from "react-icons/fa";

interface ForgotPasswordInput {
  email: string;
}

const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm<ForgotPasswordInput>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitForm = async (data: ForgotPasswordInput) => {
    setLoading(true);
    try {
      const res = await forgotPassword(data);
      toast.success(res.message);
      setSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface text-text min-h-screen relative">
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
            <Link
              href="/login"
              className=" flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <FaArrowLeft size={14} />
              Back to login
            </Link>
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Forgot password
            </h1>
            <p className="text-sm text-text-secondary">
              {sent
                ? "Check your email for a reset link."
                : "Enter your email and we'll send you a reset link."}
            </p>

            {!sent && (
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(submitForm)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 placeholder-text-muted bg-transparent"
                    placeholder="example@gmail.com"
                    required
                    {...register("email")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-btn-primary hover:bg-btn-primary-hover transition-colors cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
