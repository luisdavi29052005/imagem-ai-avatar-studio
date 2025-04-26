
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Evento personalizado para notificar toda a aplicação sobre mudanças de autenticação
export const AUTH_CHANGE_EVENT = "auth-state-change";
export const emitAuthChangeEvent = (user: User | null, isLoggedIn: boolean) => {
  const event = new CustomEvent(AUTH_CHANGE_EVENT, {
    detail: { user, isLoggedIn }
  });
  window.dispatchEvent(event);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        const newLoggedInState = !!session?.user;
        setIsLoggedIn(newLoggedInState);
        setIsLoading(false);
        
        // Emitir evento para notificar toda a aplicação
        emitAuthChangeEvent(session?.user ?? null, newLoggedInState);
        
        // Se o usuário acabou de fazer login, redirecionar para /chat
        if (event === 'SIGNED_IN') {
          navigate('/chat');
        } else if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
      setIsLoading(false);
      
      // Emitir evento para a sessão inicial
      emitAuthChangeEvent(session?.user ?? null, !!session?.user);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with:", email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo(a) de volta!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with Google");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message || "Ocorreu um erro ao tentar fazer login com Google",
        variant: "destructive",
      });
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign up with:", email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar seu cadastro",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign out");
      
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoggedIn,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
