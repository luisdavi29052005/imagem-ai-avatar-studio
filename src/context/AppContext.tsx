
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id?: string;
  email?: string;
  name?: string;
  isLoggedIn: boolean;
  isPro: boolean;
  imageGenerationsLeft: number;
}

interface AppContextType {
  user: User;
  login: (email: string, name?: string) => void;
  logout: () => void;
  upgradeToPro: () => void;
  decrementGenerations: () => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
  isUpgradeModalOpen: boolean;
  setUpgradeModalOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    isPro: false,
    imageGenerationsLeft: 5,
  });
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("reviverImagem_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("reviverImagem_user", JSON.stringify(user));
  }, [user]);

  const login = (email: string, name?: string) => {
    setUser({
      id: `user-${Date.now()}`,
      email,
      name,
      isLoggedIn: true,
      isPro: user.isPro, // Maintain pro status if already set
      imageGenerationsLeft: 5,
    });
    setLoginModalOpen(false);
  };

  const logout = () => {
    setUser({
      isLoggedIn: false,
      isPro: false,
      imageGenerationsLeft: 5,
    });
  };

  const upgradeToPro = () => {
    setUser({
      ...user,
      isPro: true,
      imageGenerationsLeft: Number.POSITIVE_INFINITY, // Unlimited generations
    });
    setUpgradeModalOpen(false);
  };

  const decrementGenerations = () => {
    if (!user.isPro && user.imageGenerationsLeft > 0) {
      setUser({
        ...user,
        imageGenerationsLeft: user.imageGenerationsLeft - 1,
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        upgradeToPro,
        decrementGenerations,
        isLoginModalOpen,
        setLoginModalOpen,
        isUpgradeModalOpen,
        setUpgradeModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
