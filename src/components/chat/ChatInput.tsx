
import { useState } from "react";
import { ImageIcon, Send, Loader, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ImageUploader";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "@/components/Avatar";

interface ChatInputProps {
  prompt: string;
  isProcessing: boolean;
  showUploadPanel: boolean;
  uploadedImage: File | null;
  imageGenerationCount: number;
  cooldownTime: number;
  isLoggedIn: boolean;
  avatarMood: "happy" | "thinking" | "excited" | "confused";
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onImageUpload: (file: File) => void;
  onToggleUpload: () => void;
  onShowLogin: () => void;
}

export function ChatInput({ 
  prompt,
  isProcessing,
  showUploadPanel,
  uploadedImage,
  imageGenerationCount,
  cooldownTime,
  isLoggedIn,
  avatarMood,
  onPromptChange,
  onSend,
  onImageUpload,
  onToggleUpload,
  onShowLogin
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-white/10 p-4">
      <div className="flex items-start gap-2">
        <div className="block md:hidden">
          <Avatar mood={avatarMood} size="sm" />
        </div>
        
        <div className="relative flex-1">
          <Textarea
            value={prompt}
            onChange={onPromptChange}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem ou descreva a imagem..."
            className="min-h-[60px] w-full resize-none glass rounded-lg border-white/10 pr-12"
            rows={1}
          />
          <div className="absolute right-2 bottom-2">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-8 w-8"
              onClick={onToggleUpload}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          size="icon"
          disabled={(!prompt.trim() && !uploadedImage) || isProcessing}
          onClick={onSend}
          className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {showUploadPanel && (
          <motion.div
            className="p-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ImageUploader onImageUpload={onImageUpload} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-2 text-xs text-center text-muted-foreground">
        {isLoggedIn ? (
          <span>Plano Grátis - <a href="/pricing" className="text-primary hover:underline">Fazer upgrade</a></span>
        ) : (
          <span>
            Limite gratuito: {imageGenerationCount}/5 imagens - 
            <button onClick={onShowLogin} className="text-primary hover:underline">Entrar</button>
          </span>
        )}
      </div>
    </div>
  );
}
