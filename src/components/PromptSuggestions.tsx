
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  { 
    text: "Restaurar foto antiga", 
    icon: "🖼️" 
  },
  { 
    text: "Remover fundo", 
    icon: "✂️" 
  },
  { 
    text: "Melhorar qualidade", 
    icon: "✨" 
  },
  { 
    text: "Converter para cartoon", 
    icon: "🎨" 
  }
];

export function PromptSuggestions({ onSuggestionClick }: PromptSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 py-3">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion.text}
          className="group flex items-center gap-2 text-xs px-3 py-1.5 rounded-full glass hover:bg-primary/20 hover:border-primary/30 transition-all"
          onClick={() => onSuggestionClick(suggestion.text)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{suggestion.icon}</span>
          <span className="text-muted-foreground group-hover:text-foreground">{suggestion.text}</span>
        </motion.button>
      ))}
      
      <motion.button
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all"
        onClick={() => onSuggestionClick("Gerar imagem com GPT")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-3 h-3" />
        <span className="text-primary">Gerar com GPT-4</span>
      </motion.button>
    </div>
  );
}
