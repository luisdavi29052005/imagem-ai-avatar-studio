
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AvatarProps {
  mood?: "happy" | "thinking" | "excited" | "confused";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export function Avatar({ 
  mood = "happy", 
  size = "md", 
  className = "",
  animate = true
}: AvatarProps) {
  // Avatar image is uploaded at public/lovable-uploads/adea8768-9d0a-42d5-98b5-424c265702b1.png
  const avatarUrl = "/lovable-uploads/adea8768-9d0a-42d5-98b5-424c265702b1.png";
  const [isVisible, setIsVisible] = useState(true);

  // Size classes
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20 sm:w-24 sm:h-24",
    lg: "w-32 h-32 sm:w-40 sm:h-40"
  };

  useEffect(() => {
    if (!animate) return;
    
    // Randomly blink effect
    const blinkInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 150);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(blinkInterval);
  }, [animate]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`rounded-full overflow-hidden ${sizeClasses[size]}`}
        initial={{ scale: 1 }}
        animate={{ 
          scale: animate ? [1, 1.05, 1] : 1,
          y: animate ? [0, -5, 0] : 0
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <img 
          src={avatarUrl} 
          alt="AI Assistant Avatar" 
          className="w-full h-full object-cover"
        />
        
        {/* Eyes blinking effect */}
        <AnimatePresence>
          {!isVisible && (
            <motion.div 
              className="absolute inset-0 bg-darkbg opacity-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Optional: mood indicator */}
      {mood !== "happy" && (
        <motion.div 
          className={`absolute bottom-1 right-1 rounded-full w-4 h-4 sm:w-5 sm:h-5 border-2 border-darkbg ${
            mood === "thinking" ? "bg-amber-400" :
            mood === "excited" ? "bg-green-400" : 
            "bg-blue-400"
          }`}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </div>
  );
}
