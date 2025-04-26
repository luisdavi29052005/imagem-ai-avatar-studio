import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    title: "Restauração de foto antiga",
    lastMessage: new Date(),
    unread: 2
  },
  {
    id: 2,
    title: "Edição de paisagem",
    lastMessage: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unread: 0
  },
  {
    id: 3,
    title: "Retratos com estilo artístico",
    lastMessage: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0
  },
  {
    id: 4,
    title: "Remoção de fundo",
    lastMessage: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: 0
  },
];

export function ChatSidebar() {
  const [activeConversation, setActiveConversation] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than 24 hours, show time
    if (diff < 1000 * 60 * 60 * 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If less than a week, show day of week
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  return (
    <aside className="w-[280px] md:w-[240px] lg:w-[280px] fixed top-16 left-0 bottom-0 bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm border-r border-white/5 flex flex-col z-10 overflow-hidden">
      <div className="flex flex-col h-full p-6">
        {/* New Conversation Button */}
        <Button 
          className="w-full mb-6 gap-2 bg-white/10 hover:bg-white/15 border border-white/10"
          variant="ghost"
        >
          <Plus className="w-4 h-4" />
          <span>Nova conversa</span>
        </Button>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto -mx-3 px-3">
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">Conversas recentes</h3>
          <ul className="space-y-1">
            {mockConversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  className={cn(
                    "w-full px-3 py-2 text-left rounded-md flex flex-col items-start transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/60 focus-visible:ring-2",
                    "hover:bg-white/6 hover:translate-y-[-1px]",
                    activeConversation === conversation.id ? "bg-white/8" : ""
                  )}
                  onClick={() => setActiveConversation(conversation.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium truncate">{conversation.title}</span>
                    {conversation.unread > 0 && (
                      <span className="bg-primary text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatDate(conversation.lastMessage)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer */}
        <div className="pt-4 border-t border-white/5 text-xs text-muted-foreground flex justify-between items-center">
          <span>Versão 1.0</span>
          <a href="#" className="text-primary hover:underline text-xs">Changelog</a>
        </div>
      </div>
    </aside>
  );
}
