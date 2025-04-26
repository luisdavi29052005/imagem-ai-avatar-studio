
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, ArrowLeft, Loader, Shield } from "lucide-react";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // Format expiry date
    if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 2) {
        setFormData({ ...formData, [name]: cleaned });
      } else {
        setFormData({ ...formData, [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || 
        !formData.cardNumber || !formData.expiry || !formData.cvc) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos do formulário",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate("/chat");
      }, 2000);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-darkbg">
      <Background />
      <Header />

      <main className="container max-w-4xl pt-24 pb-16 px-4 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/pricing")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para preços
        </Button>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <motion.div
              className="glass rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>
              
              {isSuccess ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Pagamento concluído!</h2>
                  <p className="text-muted-foreground mb-4">
                    Sua assinatura foi ativada com sucesso.
                  </p>
                  <p className="text-sm">Redirecionando para o chat...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="João Silva"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 glass"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seuemail@exemplo.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 glass"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Número do cartão</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            maxLength={19}
                            className="mt-1 pl-10 glass"
                          />
                          <CreditCard className="absolute left-3 top-[13px] h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/AA"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          maxLength={5}
                          className="mt-1 glass"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          maxLength={3}
                          className="mt-1 glass"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Pagar R$ 29,90"
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
                      <Shield className="w-3 h-3 mr-1" />
                      <span>Pagamento seguro processado por Stripe</span>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
          
          <div className="md:col-span-2">
            <motion.div
              className="glass rounded-xl p-6 border border-white/10 sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4">Resumo do pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-white/10">
                  <span>Plano Pro</span>
                  <span>R$ 29,90</span>
                </div>
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ 29,90</span>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-4 mt-6">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    O que está incluído
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                      <span>Acesso ao GPT-4 para qualidade superior</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                      <span>Gerações de imagem ilimitadas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                      <span>Sem tempo de espera entre gerações</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                      <span>Acesso prioritário a novos recursos</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>
                    Sua assinatura será renovada automaticamente a cada mês. 
                    Você pode cancelar a qualquer momento na sua conta.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
