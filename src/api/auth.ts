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

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  console.log(data);
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const signUp = async ({ name, email, password }: SignUpInput): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};