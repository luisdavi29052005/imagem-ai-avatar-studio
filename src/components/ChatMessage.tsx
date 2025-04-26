
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Heart, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  images?: string[];
  timestamp: Date;
  modelType?: 'gemini' | 'gpt'; // Indica qual modelo gerou a resposta
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onFavorite?: () => void;
}

export function ChatMessage({ 
  message, 
  isLoading = false,
  onRegenerate,
  onFavorite
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const isAI = message.role === 'ai';
  
  return (
    <motion.div
      className={cn(
        "group relative flex items-start gap-3 py-4 transition-all",
        isAI ? "justify-start" : "justify-end"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Message content */}
      <div
        className={cn(
          "message-bubble",
          isAI ? "ai-message" : "user-message"
        )}
      >
        {/* Text content */}
        <div className="prose prose-invert text-sm">
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse mx-1 animate-delay-200"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse animate-delay-400"></div>
            </div>
          ) : (
            message.content
          )}
        </div>
        
        {/* Image content (if any) */}
        {message.images && message.images.length > 0 && (
          <div className="mt-2 grid grid-cols-1 gap-2">
            {message.images.map((image, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`Generated image ${index + 1}`} 
                  className="w-full h-auto"
                />
                
                {/* Model badge */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>{message.modelType === 'gemini' ? 'Gemini' : 'GPT-4'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Timestamp */}
        <div className="mt-1 text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Message actions (visible on hover) */}
      {isAI && message.images && showActions && (
        <motion.div 
          className="absolute -left-12 top-4 flex flex-col gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={onFavorite}
          >
            <Star className="h-3.5 w-3.5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={() => {}}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
