import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi } from "../config/api/authApi";
import { userApi } from "../config/api/userApi";

type Theme = "dark" | "light";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  theme: Theme;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { data } = await authApi.get("/me");
    if (data.isSuccess && data.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

async function updateThemeOnServer(theme: Theme): Promise<Theme> {
  const { data } = await userApi.put("/theme", { theme });
  if (data.isSuccess && data.data) {
    return data.data.theme;
  }
  throw new Error(data.error || "Failed to update theme");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [localTheme, setLocalTheme] = useState<Theme>("dark");

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handlePopState = () => refetch();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [refetch]);

  const themeMutation = useMutation({
    mutationFn: updateThemeOnServer,
    onSuccess: (newTheme) => {
      queryClient.setQueryData(["auth", "me"], (prev: User | null) => {
        if (!prev) return prev;
        return { ...prev, theme: newTheme };
      });
    },
  });

  const theme = user?.theme ?? localTheme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
      if (user?.theme) {
        applyTheme(user.theme);
      }
    }
  }, [isLoading, user?.theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      applyTheme(newTheme);
      if (user) {
        themeMutation.mutate(newTheme);
      } else {
        setLocalTheme(newTheme);
      }
    },
    [user, themeMutation]
  );

  const logout = useCallback(async () => {
    await authApi.post("/logout").catch(() => {});
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();
    setLocalTheme("dark");
    applyTheme("dark");
  }, [queryClient]);

  const value: AuthContextType = {
    user: user ?? null,
    isLoading: !isInitialized,
    isAuthenticated: !!user,
    theme,
    setTheme,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
