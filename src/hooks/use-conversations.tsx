
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/components/ChatMessage";

interface Conversation {
  id: string;
  title: string;
  last_message_at: string;
  unread?: number;
}

export function useConversations() {
  const { user, session } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user || !session) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-conversations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setConversations(data.conversations || []);
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Erro ao carregar conversas",
        description: error.message || "Não foi possível carregar suas conversas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  const saveConversation = useCallback(async (title: string, messages: Message[]) => {
    if (!user || !session) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke("save-conversation", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          conversation: {
            id: activeConversationId,
            title: title || messages[0]?.content?.substring(0, 30) || "Nova conversa",
          },
          messages,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Atualizar a lista de conversas após salvar
      await fetchConversations();
      
      return data.conversation_id;
    } catch (error: any) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Erro ao salvar conversa",
        description: error.message || "Não foi possível salvar sua conversa",
        variant: "destructive",
      });
      return null;
    }
  }, [user, session, activeConversationId, fetchConversations]);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user || !session) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-conversation-messages", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          conversation_id: conversationId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setActiveConversationId(conversationId);
      return data.messages || [];
    } catch (error: any) {
      console.error("Error loading messages:", error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message || "Não foi possível carregar as mensagens desta conversa",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  return {
    conversations,
    isLoading,
    activeConversationId,
    setActiveConversationId,
    fetchConversations,
    saveConversation,
    loadMessages,
  };
}
