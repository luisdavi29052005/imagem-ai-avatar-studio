import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  last_message_at: string;
  unread?: number;
}

interface ConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations?: Conversation[];
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
}

export function ConversationDrawer({ 
  isOpen, 
  onClose,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewConversation
}: ConversationDrawerProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-[240px] z-50 bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm border-r border-white/5 flex flex-col"
            initial={{ x: "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.5 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
          >
            <div className="pt-16 h-full flex flex-col">
              <div className="flex flex-col h-full p-6">
                {/* Close button */}
                <button 
                  className="absolute right-4 top-20 text-muted-foreground p-2"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
                
                {/* New Conversation Button */}
                <Button 
                  className="w-full mb-6 gap-2 bg-white/10 hover:bg-white/15 border border-white/10"
                  variant="ghost"
                  onClick={() => {
                    onNewConversation?.();
                    onClose();
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova conversa</span>
                </Button>
                
                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto -mx-3 px-3">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">Conversas recentes</h3>
                  <ul className="space-y-1">
                    {conversations.length > 0 ? (
                      conversations.map((conversation) => (
                        <li key={conversation.id}>
                          <button
                            className={cn(
                              "w-full px-3 py-2 text-left rounded-md flex flex-col items-start transition-all duration-200",
                              "focus:outline-none focus:ring-2 focus:ring-primary/60 focus-visible:ring-2",
                              "hover:bg-white/6 hover:translate-y-[-1px]",
                              activeConversationId === conversation.id ? "bg-white/8" : ""
                            )}
                            onClick={() => onSelectConversation?.(conversation.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="font-medium truncate">{conversation.title}</span>
                              {conversation.unread ? (
                                <span className="bg-primary text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
                                  {conversation.unread}
                                </span>
                              ) : null}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              {formatDate(conversation.last_message_at)}
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-center py-6 text-sm text-muted-foreground">
                        Nenhuma conversa encontrada
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Footer */}
                <div className="pt-4 border-t border-white/5 text-xs text-muted-foreground flex justify-between items-center">
                  <span>Versão 1.0</span>
                  <a href="#" className="text-primary hover:underline text-xs">Changelog</a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
