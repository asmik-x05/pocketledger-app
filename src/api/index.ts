"use client";

import config from "@/config/config";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: config.apiUrl,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

export default api;
