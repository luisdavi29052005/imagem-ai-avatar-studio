
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ConversationDrawer } from "@/components/ConversationDrawer";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-conversations";
import { Message } from "@/components/ChatMessage";
import { toast } from "@/hooks/use-toast";

// Mock image for demo purposes
const mockGeneratedImage = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjE4MTYwNzAzfA&ixlib=rb-4.0.3&q=80&w=400";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [avatarMood, setAvatarMood] = useState<"happy" | "thinking" | "excited" | "confused">("happy");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [imageGenerationCount, setImageGenerationCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 960px)");
  const { user, isLoggedIn } = useAuth();
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId,
    fetchConversations, 
    saveConversation, 
    loadMessages 
  } = useConversations();

  // Carregar conversas quando o usuário estiver logado
  useEffect(() => {
    if (isLoggedIn) {
      fetchConversations();
    }
  }, [isLoggedIn, fetchConversations]);

  // Ouvir eventos de autenticação para atualizar o estado
  useEffect(() => {
    const handleAuthChange = (event: Event) => {
      // @ts-ignore - CustomEvent tem um campo detail
      const { isLoggedIn } = (event as CustomEvent).detail;
      
      if (isLoggedIn) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo(a) de volta!"
        });
        fetchConversations();
      }
    };
    
    window.addEventListener("auth-state-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-state-change", handleAuthChange);
    };
  }, [fetchConversations]);

  // Carregar mensagens quando uma conversa é selecionada
  useEffect(() => {
    const loadSelectedConversation = async () => {
      if (activeConversationId) {
        const loadedMessages = await loadMessages(activeConversationId);
        if (loadedMessages) {
          setMessages(loadedMessages);
        }
      }
    };
    
    if (activeConversationId) {
      loadSelectedConversation();
    }
  }, [activeConversationId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close sidebar drawer when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  // Handle cooldown timer
  useEffect(() => {
    let interval: number | undefined;
    if (cooldownTime > 0) {
      interval = window.setInterval(() => {
        setCooldownTime((time) => Math.max(0, time - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownTime]);

  const handleSaveConversation = async () => {
    if (isLoggedIn && messages.length > 0) {
      const title = messages[0]?.content?.substring(0, 30) || "Nova conversa";
      await saveConversation(title, messages);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setShowUploadPanel(false);
  };

  const toggleUploadPanel = () => {
    setShowUploadPanel(!showUploadPanel);
  };

  const simulateAIResponse = (userPrompt: string, includeImage = false) => {
    setIsProcessing(true);
    setAvatarMood("thinking");
    
    // Check if prompt mentions GPT
    const mentionsGPT = userPrompt.toLowerCase().includes('gpt');
    if (mentionsGPT && !isLoggedIn) {
      setTimeout(() => {
        setIsProcessing(false);
        setAvatarMood("confused");
        setShowUpgradeModal(true);
      }, 1500);
      return;
    }
    
    // For non-logged in users, limit to 5 image generations
    if (includeImage && !isLoggedIn && imageGenerationCount >= 4) {
      setTimeout(() => {
        setIsProcessing(false);
        setAvatarMood("confused");
        setShowLoginModal(true);
      }, 1000);
      return;
    }

    // For GPT generations, add cooldown time for free users
    if (mentionsGPT && cooldownTime === 0) {
      setCooldownTime(30); // 30 second cooldown for GPT requests
    }
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: `Aqui está o resultado para "${userPrompt}"`,
        timestamp: new Date(),
        modelType: mentionsGPT ? 'gpt' : 'gemini',
      };
      
      // Add image if requested or if upload was provided
      if (includeImage || uploadedImage) {
        aiResponse.images = [mockGeneratedImage];
        setImageGenerationCount(prev => prev + 1);
      }
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsProcessing(false);
      setAvatarMood(mentionsGPT ? "excited" : "happy");
      setUploadedImage(null);
      
      // Salvar conversa se o usuário estiver logado
      if (isLoggedIn) {
        handleSaveConversation();
      }
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!prompt.trim() && !uploadedImage) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    simulateAIResponse(prompt, uploadedImage !== null);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    navigate('/pricing');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
  };

  return (
    <div className="relative min-h-screen bg-darkbg flex flex-col">
      <Background />
      <Header onMenuClick={toggleSidebar} />
      
      <main className="flex-1 pt-16 pb-0 flex h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        {isDesktop && (
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={handleNewChat}
          />
        )}
        
        {/* Mobile Drawer */}
        {!isDesktop && (
          <ConversationDrawer 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              setActiveConversationId(id);
              setIsSidebarOpen(false);
            }}
            onNewConversation={() => {
              handleNewChat();
              setIsSidebarOpen(false);
            }}
          />
        )}
        
        {/* Chat container */}
        <div className={`flex flex-1 items-center justify-center p-4 transition-all duration-200
          ${isDesktop ? "ml-[280px] lg:ml-[280px] md:ml-[240px]" : "ml-0"}`}
        >
          <div className="flex-1 glass max-w-3xl mx-auto rounded-lg overflow-hidden border border-white/10 flex flex-col h-full">
            <ChatContainer
              messages={messages}
              isProcessing={isProcessing}
              avatarMood={avatarMood}
              onSuggestionClick={handleSuggestionClick}
              onSaveConversation={handleSaveConversation}
            />
            
            <ChatInput
              prompt={prompt}
              isProcessing={isProcessing}
              showUploadPanel={showUploadPanel}
              uploadedImage={uploadedImage}
              imageGenerationCount={imageGenerationCount}
              cooldownTime={cooldownTime}
              isLoggedIn={isLoggedIn}
              avatarMood={avatarMood}
              onPromptChange={handlePromptChange}
              onSend={handleSendMessage}
              onImageUpload={handleImageUpload}
              onToggleUpload={toggleUploadPanel}
              onShowLogin={() => setShowLoginModal(true)}
            />
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin} 
      />
      
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUpgrade={handleUpgrade} 
      />
    </div>
  );
}
