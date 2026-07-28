import * as React from "react";

import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "transition-apple-fast flex min-h-[80px] w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground ring-offset-background placeholder:text-text-muted focus-visible:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
