export type Theme = "dark" | "light";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  theme: Theme;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  logout: () => Promise<void>;
  refetch: () => void;
}
