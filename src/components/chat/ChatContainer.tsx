
import { useRef, useEffect } from "react";
import { Message } from "@/components/ChatMessage";
import { ChatMessage } from "@/components/ChatMessage";
import { PromptSuggestions } from "@/components/PromptSuggestions";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/hooks/use-auth";

interface ChatContainerProps {
  messages: Message[];
  isProcessing: boolean;
  avatarMood: "happy" | "thinking" | "excited" | "confused";
  onSuggestionClick: (suggestion: string) => void;
  onSaveConversation?: () => void;
}

export function ChatContainer({ 
  messages, 
  isProcessing, 
  avatarMood, 
  onSuggestionClick,
  onSaveConversation
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save conversation when messages change and user is logged in
  useEffect(() => {
    if (isLoggedIn && messages.length > 0 && onSaveConversation) {
      // Salvando a conversa após 1 segundo de inatividade no chat
      const debounceTimer = setTimeout(() => {
        onSaveConversation();
      }, 1000);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [messages, isLoggedIn, onSaveConversation]);

  return (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <Avatar mood="happy" size="md" className="mb-6" />
          <h2 className="text-xl font-medium mb-2">Bem-vindo(a) ao ReviverImagem AI</h2>
          <p className="text-muted-foreground mb-4">
            Restaure, edite e gere imagens com IA. Como posso ajudar hoje?
          </p>
          <PromptSuggestions onSuggestionClick={onSuggestionClick} />
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onRegenerate={() => {}}
              onFavorite={() => {}}
            />
          ))}
          
          {isProcessing && (
            <ChatMessage 
              message={{ 
                id: 'loading', 
                role: 'ai', 
                content: '', 
                timestamp: new Date() 
              }}
              isLoading={true} 
            />
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
