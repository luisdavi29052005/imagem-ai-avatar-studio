import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sparkles } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Simulate a successful checkout process
    const timeoutId = setTimeout(() => {
      toast({
        title: "Pagamento efetuado com sucesso!",
        description: "Obrigado por sua compra. Você será redirecionado.",
      });

      // Redirect to a confirmation page or the main app after a delay
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [navigate, toast]);

  return (
    <div className="container h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Insira os detalhes do pagamento para completar a compra.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome no cartão</Label>
            <Input id="name" placeholder="João Silva" type="text" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Número do cartão</Label>
            <Input id="cardNumber" placeholder="**** **** **** ****" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiry">Validade</Label>
              <Input id="expiry" placeholder="MM/AA" type="text" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="***" type="number" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Pagar agora
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
