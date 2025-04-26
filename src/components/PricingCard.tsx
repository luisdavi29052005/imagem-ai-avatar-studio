
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string | null;
  features: PricingFeature[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  buttonText: string;
  onSelect: () => void;
}

export function PricingCard({
  title,
  description,
  price,
  features,
  isPopular = false,
  isCurrentPlan = false,
  buttonText,
  onSelect,
}: PricingCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className={`relative glass rounded-xl overflow-hidden border ${
        isPopular
          ? "border-primary"
          : isCurrentPlan
          ? "border-green-500"
          : "border-white/10"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Popular or Current Plan Badge */}
      {(isPopular || isCurrentPlan) && (
        <div
          className={`absolute top-0 right-0 z-10 px-3 py-1 text-xs font-medium ${
            isCurrentPlan ? "bg-green-500" : "bg-primary"
          } text-white rounded-bl-lg`}
        >
          {isCurrentPlan ? "Seu Plano" : "Popular"}
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>

        <div className="mt-4 mb-6">
          {price ? (
            <div className="flex items-end">
              <span className="text-3xl font-bold">{price}</span>
              <span className="text-muted-foreground ml-2">/mês</span>
            </div>
          ) : (
            <div className="text-3xl font-bold">Grátis</div>
          )}
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {feature.included ? (
                <CheckCircle
                  className={`w-5 h-5 mr-2 flex-shrink-0 ${
                    feature.highlight ? "text-primary" : "text-green-500"
                  }`}
                />
              ) : (
                <X className="w-5 h-5 mr-2 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  feature.highlight ? "text-primary font-medium" : ""
                }`}
              >
                {feature.name}
              </span>
            </motion.li>
          ))}
        </ul>

        <Button
          className={`w-full ${isPopular ? "bg-primary hover:bg-primary/90" : ""}`}
          onClick={onSelect}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Plano Atual" : buttonText}
        </Button>
      </div>

      {/* Optional glow effect on hover */}
      {isHovering && isPopular && (
        <motion.div
          className="absolute inset-0 -z-10 bg-primary/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
