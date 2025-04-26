import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            className="flex items-center justify-center w-10 h-10 mr-2 md:mr-4"
            onClick={handleMenuClick}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
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
        </div>

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
          
          {isLoggedIn ? (
            <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Perfil do usuário" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Button className="bg-primary hover:bg-primary/90">
              Entrar
            </Button>
          )}
        </nav>

        {/* Mobile right actions */}
        <div className="flex md:hidden">
          {isLoggedIn ? (
            <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Perfil do usuário" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Entrar
            </Button>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && !onMenuClick && (
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
            {!isLoggedIn && (
              <Button className="w-full mt-2" onClick={() => setIsOpen(false)}>
                Entrar
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
