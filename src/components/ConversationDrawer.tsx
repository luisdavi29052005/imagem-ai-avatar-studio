
import { motion, AnimatePresence } from "framer-motion";
import { ChatSidebar } from "./ChatSidebar";

interface ConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationDrawer({ isOpen, onClose }: ConversationDrawerProps) {
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
            className="fixed top-0 left-0 bottom-0 w-[240px] z-50 bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm border-r border-white/5"
            initial={{ x: "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.5 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
          >
            <div className="pt-16">
              <ChatSidebar />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
