import * as React from "react";

import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "transition-apple-fast flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-text-muted focus-visible:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
