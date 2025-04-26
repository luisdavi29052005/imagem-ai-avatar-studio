
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md glass rounded-xl overflow-hidden mx-auto border border-purple-500/30"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">Desbloqueie o GPT-4</h2>
              <p className="text-muted-foreground text-center mb-6">
                Acesse o modelo mais avançado para resultados excepcionais
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="text-sm">Geração de imagens de alta qualidade</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="text-sm">Compreensão multimodal avançada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="text-sm">Sem limite de imagens geradas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary mr-2 h-5 w-5" />
                  <span className="text-sm">Sem tempo de espera entre gerações</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button
                  className="bg-primary hover:bg-primary/90 w-full"
                  onClick={onUpgrade}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Fazer Upgrade por R$ 29,90/mês
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Continuar com plano gratuito
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
