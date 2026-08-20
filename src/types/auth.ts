export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  plan: "Free Community" | "Pro Creator";
  imagesProcessed?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithSocial: (provider: "google" | "apple") => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
