
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white"
        >
          <Avatar size="sm" animate={false} />
          <motion.span 
            className="text-lg font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ReviverImagem AI
          </motion.span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/chat" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/chat') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Chat
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/pricing') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Preços
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User size={18} />
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <LogIn className="w-4 h-4 mr-2" />
            Entrar
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="flex items-center justify-center w-10 h-10 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <motion.div 
          className="glass md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/chat"
              className={`block p-3 rounded-md ${isActive('/chat') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsOpen(false)}
            >
              Chat
            </Link>
            <Link
              to="/pricing"
              className={`block p-3 rounded-md ${isActive('/pricing') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsOpen(false)}
            >
              Preços
            </Link>
            <Button className="w-full mt-2" onClick={() => setIsOpen(false)}>
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
