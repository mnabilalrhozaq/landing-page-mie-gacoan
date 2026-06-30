import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" && "bg-primary text-white hover:bg-primary/95 shadow",
          variant === "destructive" && "bg-red-500 text-white hover:bg-red-500/90 shadow-sm",
          variant === "outline" && "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground",
          variant === "secondary" && "bg-secondary text-white hover:bg-secondary/95 shadow-sm",
          variant === "ghost" && "hover:bg-accent/10 hover:text-accent-foreground",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          // Sizes
          size === "default" && "h-9 px-4 py-2",
          size === "sm" && "h-8 rounded-md px-3 text-xs",
          size === "lg" && "h-10 rounded-md px-8",
          size === "icon" && "h-9 w-9",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
