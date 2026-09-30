import api from "./index";

interface LoginInput {
  email: string;
  password: string;
}

interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface ResetPasswordInput {
  token: string;
  password: string;
}

interface MessageResponse {
  message: string;
}

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const signUp = async ({
  name,
  email,
  password,
}: SignUpInput): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const forgotPassword = async ({
  email,
}: ForgotPasswordInput): Promise<MessageResponse> => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async ({
  token,
  password,
}: ResetPasswordInput): Promise<MessageResponse> => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};
