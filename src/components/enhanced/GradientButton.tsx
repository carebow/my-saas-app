
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isWaitlistButton?: boolean;
}

const GradientButton = ({
  children,
  icon: Icon,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  isWaitlistButton = false,
}: GradientButtonProps) => {
  const scrollToWaitlist = () => {
    // First check if we're on the homepage
    if (window.location.pathname === '/') {
      // We're on homepage, scroll to waitlist section
      const element = document.getElementById('waitlist');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element not found, wait a bit and try again (in case it's still loading)
        setTimeout(() => {
          const retryElement = document.getElementById('waitlist');
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = '/#waitlist';
    }
  };

  const handleClick = () => {
    if (isWaitlistButton) {
      scrollToWaitlist();
    } else if (onClick) {
      onClick();
    }
  };

  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 shadow-md",
    outline: "border-2 border-purple-200 bg-transparent hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 text-purple-600 hover:border-purple-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 group min-h-[44px]",
          variants[variant],
          sizes[size],
          className
        )}
      >
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1,
          }}
        />
        
        <span className="relative flex items-center gap-2">
          {Icon && (
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          )}
          {children}
        </span>
      </Button>
    </motion.div>
  );
};

export default GradientButton;
