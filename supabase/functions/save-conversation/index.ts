
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
    
    // Criar cliente Supabase com a service role key para contornar RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Criar cliente Supabase com o token do usuário para verificar a autenticação
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
    
    // Obter os dados da requisição
    const { conversation, messages } = await req.json();
    
    // Verificar se a conversa já existe ou precisa ser criada
    let conversationId = conversation?.id;
    
    if (!conversationId) {
      // Criar uma nova conversa
      const { data: newConversation, error: conversationError } = await supabaseAdmin
        .from("conversations")
        .insert({
          user_id: user.id,
          title: conversation.title || "Nova conversa",
          last_message_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      
      if (conversationError) {
        throw new Error(`Error creating conversation: ${conversationError.message}`);
      }
      
      conversationId = newConversation.id;
    } else {
      // Atualizar a conversa existente
      const { error: updateError } = await supabaseAdmin
        .from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
          title: conversation.title || "Conversa sem título",
        })
        .eq("id", conversationId)
        .eq("user_id", user.id);
      
      if (updateError) {
        throw new Error(`Error updating conversation: ${updateError.message}`);
      }
    }
    
    // Inserir as mensagens
    if (messages && messages.length > 0) {
      const messagesToInsert = messages.map((msg: any) => ({
        conversation_id: conversationId,
        user_id: user.id,
        role: msg.role,
        content: msg.content,
        images: msg.images,
        model_type: msg.modelType,
        created_at: msg.timestamp || new Date().toISOString(),
      }));
      
      const { error: messagesError } = await supabaseAdmin
        .from("messages")
        .insert(messagesToInsert);
      
      if (messagesError) {
        throw new Error(`Error saving messages: ${messagesError.message}`);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        conversation_id: conversationId
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
    console.error("Error in save-conversation function:", error);
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
