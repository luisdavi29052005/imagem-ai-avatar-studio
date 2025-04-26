
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { LoginModal } from "@/components/LoginModal";

export default function Pricing() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleFreePlanSelect = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate('/chat');
    }
  };

  const handleProPlanSelect = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const freePlanFeatures = [
    { name: 'Geração de imagens com Gemini', included: true },
    { name: 'Restauração de fotos antigas', included: true },
    { name: 'Upload de imagens ilimitado', included: true },
    { name: 'Limite de 5 gerações por dia', included: true },
    { name: 'Acesso ao GPT-4', included: false },
    { name: 'Sem tempo de espera entre gerações', included: false },
    { name: 'Acesso prioritário às novas funcionalidades', included: false },
  ];

  const proPlanFeatures = [
    { name: 'Geração de imagens com Gemini', included: true },
    { name: 'Restauração de fotos antigas', included: true },
    { name: 'Upload de imagens ilimitado', included: true },
    { name: 'Gerações ilimitadas', included: true },
    { name: 'Acesso ao GPT-4', included: true, highlight: true },
    { name: 'Sem tempo de espera entre gerações', included: true, highlight: true },
    { name: 'Acesso prioritário às novas funcionalidades', included: true },
  ];

  return (
    <div className="relative min-h-screen bg-darkbg">
      <Background />
      <Header />

      <main className="container max-w-6xl pt-24 pb-16 px-4 mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha o Plano Perfeito Para Você
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desbloqueie todo o potencial da IA para transformar suas imagens com nosso plano Pro. 
              Compare as opções abaixo e escolha a que melhor atende suas necessidades.
            </p>
          </motion.div>

          <motion.div
            className="mt-6 inline-flex items-center gap-2 glass px-4 py-2 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="text-primary w-5 h-5" />
            <span className="text-sm font-medium">
              Recomendamos o plano Pro para resultados profissionais
            </span>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="Grátis"
            description="Ideal para uso ocasional e experimentar o serviço"
            price={null}
            features={freePlanFeatures}
            buttonText="Começar Grátis"
            onSelect={handleFreePlanSelect}
          />

          <PricingCard
            title="Pro"
            description="Acesso completo para resultados profissionais"
            price="R$29,90"
            features={proPlanFeatures}
            isPopular={true}
            buttonText="Assinar Pro"
            onSelect={handleProPlanSelect}
          />
        </div>

        <div className="mt-16 glass rounded-xl p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Perguntas Frequentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Qual a diferença entre Gemini e GPT-4?</h3>
              <p className="text-muted-foreground">
                O GPT-4 é um modelo mais avançado que oferece melhor qualidade de imagem, 
                compreensão de contexto superior e resultados mais detalhados.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Como funciona o limite de gerações?</h3>
              <p className="text-muted-foreground">
                Usuários gratuitos podem gerar até 5 imagens por dia. Assinantes Pro têm gerações ilimitadas 
                sem tempo de espera entre elas.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
}
