"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { registerUser } from "@/redux/auth/authActions";
import { useDispatch, useSelector } from "react-redux";

import logo from "@/assets/images/logo.svg";

import { useForm } from "react-hook-form";

import { FaEye } from "react-icons/fa";
import { FaArrowLeft, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { clearError } from "@/redux/auth/authSlice";

const RegisterPage = () => {
  interface RegisterInput {
    name: string;
    email: string;
    password: string;
  }

  const { register, handleSubmit } = useForm<RegisterInput>();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const submitForm = (data: RegisterInput) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    dispatch(clearError());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(
        error.message || (error as any).error || "Registration failed",
      );
    }
  }, [error]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="bg-surface text-text min-h-screen">
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

        <div className="w-full rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 border border-border ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Link
              href="/"
              className=" flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <FaArrowLeft size={14} />
              Back to home
            </Link>
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Create an account
            </h1>
            <p className="text-sm text-text-secondary">
              Register to start tracking your savings
            </p>

            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(submitForm)}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  className="border-border border-0 border-b-2 focus:border-primary outline-none transition-colors duration-200 text-sm rounded-lg block w-full p-2.5 placeholder-text-muted bg-transparent"
                  placeholder="John Doe"
                  required
                  {...register("name")}
                />
              </div>

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

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    placeholder="Enter your password"
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
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-sm font-light">
                Already have an account?{" "}
                <Link href="/login" className="font-medium hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
