
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const redirectToCheckout = useCallback(async (planId: string) => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Por favor, faça login para assinar um plano.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          plan_id: planId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Redirecionar para a página de checkout do Stripe
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error: any) {
      console.error("Erro ao criar sessão de checkout:", error);
      toast({
        title: "Erro ao iniciar checkout",
        description: error.message || "Não foi possível iniciar o processo de pagamento",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [session]);

  return {
    isLoading,
    redirectToCheckout
  };
}
