
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Obter o token de autorização
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verificar o usuário pelo token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Obter o ID da conversa da URL
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversation_id");
    
    if (!conversationId) {
      throw new Error("Missing conversation_id parameter");
    }

    // Verificar se a conversa pertence ao usuário
    const { data: conversation, error: conversationError } = await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (conversationError) {
      throw new Error("Conversation not found or unauthorized access");
    }

    // Obter todas as mensagens da conversa, ordenadas cronologicamente
    const { data: messages, error: messagesError } = await supabaseClient
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      throw new Error(`Error fetching messages: ${messagesError.message}`);
    }

    // Formatar as mensagens para o formato esperado pelo frontend
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      images: msg.images,
      timestamp: msg.created_at,
      modelType: msg.model_type
    }));

    return new Response(
      JSON.stringify({ 
        conversation: conversation,
        messages: formattedMessages 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in get-conversation-messages function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
